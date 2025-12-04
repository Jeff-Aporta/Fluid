// @ts-nocheck
$ => ({
    ":root": {
        vars: {
            themePrimary: "#00AEEF",
            themePrimaryLight: "#33C1F3",
            themePrimaryDark: "#0090C7",
            themeSecondary: "#2c3e50",
            themeAccent: "#42b983",
            bgPrimary: $.rgba(149, 186, 255, 0.2),
            bgSecondary: $.rgba(128, 0.1),
            bgCode: $.rgb(32, 32, 66),
            textPrimary: "#5a9bdd",
            textSecondary: "#86a5c3",
            textMuted: "#8492a6",
            borderColor: "#e4e7ed",
            shadowSm: $.boxShadow({ dY: 2, blur: 8, color: $.rgba(0, 0.08) }),
            shadowMd: $.boxShadow({ dY: 4, blur: 16, color: $.rgba(0, 0.12) }),
            shadowLg: $.boxShadow({ dY: 8, blur: 24, color: $.rgba(0, 0.15) }),
            radiusSm: 4,
            radiusMd: 8,
            radiusLg: 12,
            transitionFast: "0.15s ease",
            transitionBase: "0.3s ease",
            bgCodeTransparent: $.rgba(32, 32, 66, 0.1),
        },
    },
    code: {
        vars: {
            bgCode: $.cssVar("bg-code-transparent"),
        },
    },
})