import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editöryel / aydınlık palet — kağıt zemin, mürekkep metin, kırmızı vurgu
        bg: {
          DEFAULT: "#F4EEE3", // kağıt (bone)
          soft: "#ECE4D6", // alternatif bölüm zemini
          card: "#FFFFFF", // yüzey / kart
          elevated: "#EBE3D4", // input / hover dolgusu
        },
        line: "#E1D8C6", // ince çizgi / kenarlık
        ink: {
          DEFAULT: "#211C15", // ana metin (sıcak siyah)
          soft: "#575040", // ikincil metin
          faint: "#8C8471", // üçüncül / etiket
        },
        // Yeşil = güvenli / başarı (success semantiği)
        brand: {
          DEFAULT: "#1E7A52",
          soft: "#DBEBE0",
          dark: "#155C3E",
        },
        // Kırmızı vurgu = marka / alarm / tehlike
        accent: {
          DEFAULT: "#C0391F",
          soft: "#F2DDD5",
          dark: "#8F2911",
        },
        danger: {
          DEFAULT: "#BE3520",
          soft: "#F3D9D2",
        },
        warn: "#B07B1E",
        info: "#33618E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(33, 28, 21, 0.04)",
        lift: "0 12px 30px -18px rgba(33, 28, 21, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in": "slide-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
