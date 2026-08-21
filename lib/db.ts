import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import type {
  AppUser,
  ClassBreakdown,
  ClassOverview,
  Profile,
  SessionRecord,
} from "./types";
import { xpFromScore } from "./game";
import { getFirebase } from "./firebase";
import { TACTICS, CHANNEL_META } from "./tactics";

const EMPTY: Profile = {
  totalXp: 0,
  sessionsPlayed: 0,
  bestScore: 0,
  bestStreak: 0,
  history: [],
};

const localKey = (uid: string) => `phishguard.profile.${uid}`;

function localLoad(uid: string): Profile {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(localKey(uid));
    if (!raw) return { ...EMPTY };
    const p = JSON.parse(raw) as Profile;
    return { ...EMPTY, ...p, history: Array.isArray(p.history) ? p.history : [] };
  } catch {
    return { ...EMPTY };
  }
}

function localSave(uid: string, p: Profile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(localKey(uid), JSON.stringify(p));
  } catch {}
}

function localCommit(uid: string, session: SessionRecord): Profile {
  const prev = localLoad(uid);
  const xp = xpFromScore(session.score);
  const updated: Profile = {
    totalXp: prev.totalXp + xp,
    sessionsPlayed: prev.sessionsPlayed + 1,
    bestScore: Math.max(prev.bestScore, session.score),
    bestStreak: Math.max(prev.bestStreak, session.maxStreak),
    history: [{ ...session, xpEarned: xp }, ...prev.history].slice(0, 50),
  };
  localSave(uid, updated);
  return updated;
}

async function cloudLoad(uid: string): Promise<Profile> {
  const fb = getFirebase();
  if (!fb) return { ...EMPTY };
  const { db } = fb;

  const userSnap = await getDoc(doc(db, "users", uid));
  const summary = userSnap.exists() ? userSnap.data() : {};

  const sessSnap = await getDocs(
    query(
      collection(db, "sessions"),
      where("uid", "==", uid),
      orderBy("finishedAt", "desc"),
      limit(50)
    )
  );
  const history = sessSnap.docs.map((d) => d.data() as SessionRecord);

  return {
    totalXp: Number(summary.totalXp ?? 0),
    sessionsPlayed: Number(summary.sessionsPlayed ?? 0),
    bestScore: Number(summary.bestScore ?? 0),
    bestStreak: Number(summary.bestStreak ?? 0),
    history,
  };
}

async function cloudCommit(
  user: AppUser,
  session: SessionRecord
): Promise<Profile> {
  const fb = getFirebase();
  if (!fb) return { ...EMPTY };
  const { db } = fb;
  const xp = xpFromScore(session.score);

  // User summary needs a transaction because bestScore/bestStreak take a max.
  const userRef = doc(db, "users", user.uid);
  const isNew = await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    const prev = snap.exists() ? snap.data() : null;
    tx.set(
      userRef,
      {
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        totalXp: (prev?.totalXp ?? 0) + xp,
        sessionsPlayed: (prev?.sessionsPlayed ?? 0) + 1,
        bestScore: Math.max(prev?.bestScore ?? 0, session.score),
        bestStreak: Math.max(prev?.bestStreak ?? 0, session.maxStreak),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return !snap.exists();
  });

  await addDoc(collection(db, "sessions"), {
    ...session,
    xpEarned: xp,
    uid: user.uid,
    displayName: user.displayName,
  });

  // Class-wide counters, updated with atomic increments so the dashboard
  // can be read from a single document.
  const missed = session.answers.filter(
    (a) => a.verdict === "phishing" && !a.correct
  ).length;
  const aggUpdate: Record<string, unknown> = {
    totalSessions: increment(1),
    totalAnswers: increment(session.answers.length),
    totalCorrect: increment(session.answers.filter((a) => a.correct).length),
    missedThreats: increment(missed),
    totalStudents: increment(isNew ? 1 : 0),
  };
  for (const a of session.answers) {
    aggUpdate[`channel_${a.channel}_total`] = increment(1);
    if (a.correct) aggUpdate[`channel_${a.channel}_correct`] = increment(1);
    for (const t of a.tactics) {
      aggUpdate[`tactic_${t}_total`] = increment(1);
      if (a.correct) aggUpdate[`tactic_${t}_correct`] = increment(1);
    }
  }
  await setDoc(doc(db, "aggregates", "global"), aggUpdate, { merge: true });

  return cloudLoad(user.uid);
}

async function cloudReset(uid: string): Promise<Profile> {
  return cloudLoad(uid);
}

export async function loadProfile(user: AppUser): Promise<Profile> {
  return user.cloud ? cloudLoad(user.uid) : localLoad(user.uid);
}

export async function commitSession(
  user: AppUser,
  session: SessionRecord
): Promise<Profile> {
  return user.cloud ? cloudCommit(user, session) : localCommit(user.uid, session);
}

export async function resetProfile(user: AppUser): Promise<Profile> {
  if (user.cloud) return cloudReset(user.uid);
  localSave(user.uid, { ...EMPTY });
  return { ...EMPTY };
}

function acc(correct: number, total: number) {
  return total === 0 ? 0 : correct / total;
}

async function cloudOverview(): Promise<ClassOverview> {
  const fb = getFirebase();
  if (!fb) return emptyOverview();
  try {
    return await cloudOverviewInner(fb.db);
  } catch (e) {
    // Degrade to an empty overview on a permission or missing-index error
    // instead of crashing the page.
    console.error("Sınıf verileri okunamadı.", e);
    return emptyOverview();
  }
}

async function cloudOverviewInner(
  db: NonNullable<ReturnType<typeof getFirebase>>["db"]
): Promise<ClassOverview> {
  const aggSnap = await getDoc(doc(db, "aggregates", "global"));
  const g = aggSnap.exists() ? (aggSnap.data() as Record<string, number>) : {};

  const channels: ClassBreakdown[] = (["email", "sms", "voice"] as const)
    .map((ch) => {
      const total = Number(g[`channel_${ch}_total`] ?? 0);
      const correct = Number(g[`channel_${ch}_correct`] ?? 0);
      return {
        key: ch,
        label: CHANNEL_META[ch].label,
        total,
        correct,
        accuracy: acc(correct, total),
      };
    })
    .filter((b) => b.total > 0);

  const tactics: ClassBreakdown[] = Object.values(TACTICS)
    .map((t) => {
      const total = Number(g[`tactic_${t.id}_total`] ?? 0);
      const correct = Number(g[`tactic_${t.id}_correct`] ?? 0);
      return {
        key: t.id,
        label: t.label,
        total,
        correct,
        accuracy: acc(correct, total),
      };
    })
    .filter((b) => b.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy);

  const recentSnap = await getDocs(
    query(collection(db, "sessions"), orderBy("finishedAt", "desc"), limit(15))
  );
  const recentSessions = recentSnap.docs.map((d) => {
    const s = d.data() as SessionRecord & { displayName?: string };
    return {
      displayName: s.displayName ?? "Anonim",
      mode: s.mode,
      accuracy: s.accuracy,
      score: s.score,
      at: s.finishedAt,
    };
  });

  const topSnap = await getDocs(
    query(collection(db, "users"), orderBy("totalXp", "desc"), limit(10))
  );
  const topStudents = topSnap.docs.map((d) => {
    const u = d.data() as Record<string, unknown>;
    return {
      displayName: String(u.displayName ?? "Anonim"),
      totalXp: Number(u.totalXp ?? 0),
      bestScore: Number(u.bestScore ?? 0),
      sessionsPlayed: Number(u.sessionsPlayed ?? 0),
    };
  });

  const totalAnswers = Number(g.totalAnswers ?? 0);
  const totalCorrect = Number(g.totalCorrect ?? 0);
  return {
    totalStudents: Number(g.totalStudents ?? topStudents.length),
    totalSessions: Number(g.totalSessions ?? 0),
    totalAnswers,
    totalCorrect,
    accuracy: acc(totalCorrect, totalAnswers),
    missedThreats: Number(g.missedThreats ?? 0),
    channels,
    tactics,
    recentSessions,
    topStudents,
  };
}

function localOverview(uid: string): ClassOverview {
  const p = localLoad(uid);
  const answers = p.history.flatMap((h) => h.answers);
  const chMap = new Map<string, { t: number; c: number }>();
  const tacMap = new Map<string, { t: number; c: number }>();
  let missed = 0;
  for (const a of answers) {
    const ch = chMap.get(a.channel) ?? { t: 0, c: 0 };
    ch.t++;
    if (a.correct) ch.c++;
    chMap.set(a.channel, ch);
    if (a.verdict === "phishing" && !a.correct) missed++;
    for (const t of a.tactics) {
      const e = tacMap.get(t) ?? { t: 0, c: 0 };
      e.t++;
      if (a.correct) e.c++;
      tacMap.set(t, e);
    }
  }
  const channels: ClassBreakdown[] = Array.from(chMap.entries()).map(
    ([k, v]) => ({
      key: k,
      label: CHANNEL_META[k as "email"].label,
      total: v.t,
      correct: v.c,
      accuracy: acc(v.c, v.t),
    })
  );
  const tactics: ClassBreakdown[] = Array.from(tacMap.entries())
    .map(([k, v]) => ({
      key: k,
      label: TACTICS[k as keyof typeof TACTICS].label,
      total: v.t,
      correct: v.c,
      accuracy: acc(v.c, v.t),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
  const totalCorrect = answers.filter((a) => a.correct).length;
  return {
    totalStudents: p.sessionsPlayed > 0 ? 1 : 0,
    totalSessions: p.sessionsPlayed,
    totalAnswers: answers.length,
    totalCorrect,
    accuracy: acc(totalCorrect, answers.length),
    missedThreats: missed,
    channels,
    tactics,
    recentSessions: p.history.slice(0, 15).map((h) => ({
      displayName: "Sen (yerel)",
      mode: h.mode,
      accuracy: h.accuracy,
      score: h.score,
      at: h.finishedAt,
    })),
    topStudents:
      p.sessionsPlayed > 0
        ? [
            {
              displayName: "Sen (yerel)",
              totalXp: p.totalXp,
              bestScore: p.bestScore,
              sessionsPlayed: p.sessionsPlayed,
            },
          ]
        : [],
  };
}

function emptyOverview(): ClassOverview {
  return {
    totalStudents: 0,
    totalSessions: 0,
    totalAnswers: 0,
    totalCorrect: 0,
    accuracy: 0,
    missedThreats: 0,
    channels: [],
    tactics: [],
    recentSessions: [],
    topStudents: [],
  };
}

export async function loadClassOverview(
  user: AppUser
): Promise<ClassOverview> {
  return user.cloud ? cloudOverview() : localOverview(user.uid);
}
