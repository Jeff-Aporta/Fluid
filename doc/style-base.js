// @ts-nocheck
if (typeof FluidUI === 'undefined') {
    console.error("FluidUI no está definido. Asegúrate de que fluid.js se cargue antes que style.js");
}

(() => {
    const { StyleSingleton } = window.FluidUI;

    // 3. Inicialización
    StyleSingleton.add("doc-styles-base", $ => ({
        initheader: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap");',
        ":root": {
            vars: {
                themePrimary: "#00AEEF",
                themePrimaryLight: "#33C1F3",
                themePrimaryDark: "#0090C7",
                themeSecondary: "#2c3e50",
                themeAccent: "#42b983",
                bgPrimary: $.rgba(149, 186, 255, 0.2),
                bgSecondary: $.rgba(128, 128, 128, 0.1),
                bgCode: "#1e293b", // Slate 800 from a.html
                textPrimary: "#5a9bdd",
                textSecondary: "#86a5c3",
                textMuted: "#8492a6",
                borderColor: "#e4e7ed",
                shadowSm: $.boxShadow({ dY: 2, blur: 8, color: $.rgba(0, 0.08) }),
                shadowMd: $.boxShadow({ dY: 4, blur: 16, color: $.rgba(0, 0.12) }),
                shadowlg: $.boxShadow({ dY: 8, blur: 24, color: $.rgba(0, 0.15) }),
                radiusSm: $.px(4),
                radiusMd: $.px(8),
                radiusLg: $.px(12),
                transitionFast: "0.15s ease",
                transitionBase: "0.3s ease",
                // Code specific var
                bgCodeTransparent: $.transparent
            }
        },
        "code": {
            vars: {
                bgCode: $.cssVar("bg-code-transparent")
            }
        },
        "*": {
            webkitFontSmoothing: $.antialiased,
            mozOsxFontSmoothing: $.grayscale,
            webkitOverflowScrolling: $.touch,
            webkitTapHighlightColor: $.transparent,
            webkitTextSizeAdjust: $.none,
            webkitTouchCallout: $.none,
            boxSizing: $.borderBox,
            "&::-webkit-scrollbar": {
                width: 10,
                height: 10
            },


            "&::-webkit-scrollbar": {
                width: $.px(6)
            },
            "&::-webkit-scrollbar-track": {
                background: "black"
            },
            "&::-webkit-scrollbar-thumb": {
                background: "black",
                borderRadius: 4,
                transition: $.transition([{ prop: "background", time: $.cssVar("transition-base") }])
            },

            "&:hover::-webkit-scrollbar-thumb": {
                background: $.rgba(0, 174, 239, 0.2),
                "&:hover": {
                    background: $.rgba(0, 174, 239, 0.4)
                }
            },
            "&:hover::-webkit-scrollbar-track": {
                background: "midnightblue"
            },
        },

        "html, body": {
            minHeight: $.percent(100),
            margin: 0,
            padding: 0
        },
        "body": {
            fontFamily: $.font("Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"),
            fontSize: 15,
            lineHeight: 1.6,
            color: $.cssVar("text-primary"),
            backgroundColor: $.important($.cssVar("bg-primary")),
            overflowX: $.hidden,
            position: $.relative,
            "&:not(.ready)": {
                overflow: $.hidden,
                "[data-cloak], .app-nav, >nav": {
                    display: $.none
                }
            },
            "&.close": {
                ".sidebar": {
                    marginLeft: -300
                },
                ".sidebar-toggle": {
                    width: $.auto,
                    marginRight: 0
                },
                ".content": {
                    /* No extra margin adjustment needed for flex */
                }
            },
            // Aurora Background
            "&::before": {
                content: $.text(""),
                position: $.fixed,
                inset: 0,
                zIndex: -1,
                background: $.background(
                    $.radialGradient({
                        shape: "ellipse 120% 80%",
                        at: { x: "70%", y: "20%" },
                        stops: [
                            [$.rgba(255, 20, 147, 0.15), 0],
                            [$.transparent, 50]
                        ]
                    }),
                    $.radialGradient({
                        shape: "ellipse 100% 60%",
                        at: { x: "30%", y: "10%" },
                        stops: [
                            [$.rgba(0, 255, 255, 0.12), 0],
                            [$.transparent, 60]
                        ]
                    }),
                    $.radialGradient({
                        shape: "ellipse 90% 70%",
                        at: { x: "50%", y: "0%" },
                        stops: [
                            [$.rgba(138, 43, 226, 0.18), 0],
                            [$.transparent, 65]
                        ]
                    }),
                    $.radialGradient({
                        shape: "ellipse 110% 50%",
                        at: { x: "80%", y: "30%" },
                        stops: [
                            [$.rgba(255, 215, 0, 0.08), 0],
                            [$.transparent, 40]
                        ]
                    }),
                    "#000000"
                )
            }
        },
        "#app": {
            fontSize: 28,
            fontWeight: 300,
            margin: $.margin(40, $.auto),
            textAlign: $.center,
            color: $.cssVar("theme-primary"),
            "&:empty::before": {
                content: "'Cargando...'"
            }
        },
        ".progress": {
            background: $.important($.linearGradient({
                to: $.right,
                stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")]
            })),
            height: $.important($.px(4)),
            left: 0,
            position: $.fixed,
            right: 0,
            top: 0,
            transition: $.transition([{ prop: "width", time: $.cssVar("transition-base") }, { prop: "opacity", time: 0.4 }]),
            width: "0%",
            zIndex: 999999,
            boxShadow: $.important($.boxShadow({ blur: 15, color: $.cssVar("theme-primary") }))
        },
        "section.cover": {
            background: $.important($.linearGradient({ to: $.bottomRight, stops: [$.rgba(0, 174, 239, 0.1), $.rgba(32, 32, 66, 0.9)] })),
            "&.show": {
                background: $.important($.linearGradient({ to: $.bottomRight, stops: [$.rgba(0, 174, 239, 0.1), $.rgba(32, 32, 66, 0.9)] }))
            },
            ".cover-main": {
                // marginTop: $.important("-20px"),
                "h1": {
                    fontSize: "3.5rem",
                    fontWeight: 700,
                    margin: $.margin(0, 0, 20),
                    background: $.linearGradient({ to: $.right, stops: [$.cssVar("theme-primary"), "#fff"] }),
                    webkitBackgroundClip: "text",
                    webkitTextFillColor: $.transparent,
                    textShadow: $.boxShadow({ blur: 30, color: $.rgba(0, 174, 239, 0.3) })
                },
                "p": {
                    fontSize: "1.5rem",
                    color: $.cssVar("text-secondary"),
                    maxWidth: 800,
                    margin: $.margin(0, $.auto, 40)
                },
                "ul": {
                    padding: 0,
                    listStyle: $.none,
                    display: $.flex,
                    justifyContent: $.center,
                    gap: 20,
                    "li": {
                        display: $.inlineBlock,
                        "a": {
                            display: $.inlineBlock,
                            padding: $.padding(12, 30),
                            borderRadius: $.px(50),
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: $.none,
                            transition: $.transition([{ prop: "all", time: 0.3 }]),
                            border: $.border({ width: 1, color: $.cssVar("theme-primary") }),
                            color: $.cssVar("theme-primary"),
                            background: $.rgba(0, 174, 239, 0.1),
                            "&:hover": {
                                background: $.cssVar("theme-primary"),
                                color: "#fff",
                                boxShadow: $.boxShadow({ blur: 20, color: $.rgba(0, 174, 239, 0.4) }),
                                transform: $.transform().translateY(-2).str()
                            }
                        }
                    }
                }
            }
        },
        "img": {
            maxWidth: "100%",
            "&.emoji": {
                height: $.em(1.2),
                verticalAlign: $.middle
            }
        },
        "span": {
            "&.emoji": {
                fontFamily: $.font("Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"),
                fontSize: $.em(1.2),
                verticalAlign: $.middle
            }
        },
        "a": {
            "&[disabled]": {
                cursor: $.notAllowed,
                opacity: 0.6
            }
        },
        "kbd": {
            background: $.cssVar("bg-code"),
            border: $.border({ color: $.cssVar("border-color") }),
            borderRadius: $.cssVar("radius-sm"),
            boxShadow: $.boxShadow({ dY: 1, color: $.rgba(0, 0.05) }),
            display: $.inlineBlock,
            fontSize: 12,
            fontFamily: $.font("Fira Code", "monospace"),
            lineHeight: $.px(12),
            marginBottom: 3,
            padding: $.padding(4, 6),
            verticalAlign: $.middle
        },
        "li": {
            "input[type='checkbox']": {
                margin: $.margin(0, 0.2, 0.25, 0, $.em),
                verticalAlign: $.middle
            }
        },
    }));
})();
