module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "sidebar-width": "var(--sidebar-width)",
        "sidebar-width-mobile": "var(--sidebar-width-mobile)",
        "sidebar-width-user": "var(--sidebar-width-user)",
        "width-modal": "var(--width-modal)",
      },
      transform: {
        "more-menu-mobile": "translate(60px, 604px) translate(0px, -100%)",
        "more-menu": "translate(12px, 548px) translate(0px, -100%)",
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
