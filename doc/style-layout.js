// @ts-nocheck
(() => {
    const { StyleSingleton, element } = window.FluidUI;

    document.addEventListener("click", (e) => e.target.classList.contains("sidebar-toggle") && document.body.classList.toggle("close"));

    StyleSingleton.add("doc-styles-layout-improvements-responsive", $ => ({
        "main": {
            display: $.flex,
            alignItems: $.flexStart,
            position: $.relative,
            width: $.vw(100),
            zIndex: 0,
            "&.hidden": {
                display: $.none
            }
        },
        ".sidebar": {
            background: $.rgb(14, 14, 36),
            overflowY: $.auto,
            padding: 0,
            position: $.sticky,
            top: 0,
            left: 0,
            height: $.vh(100),
            flexShrink: 0,
            transition: $.transition([{ prop: "margin-left", time: "250ms", ease: "cubic-bezier(0.4, 0, 0.2, 1)" }]),
            width: $.px(300),
            zIndex: 20,

            ".sidebar-header": {
                position: $.sticky,
                top: 0,
                left: 0,
                width: $.px(300),
                zIndex: 25,
                background: $.rgb(21, 21, 58),
                paddingTop: 60,
                paddingBottom: 10,

                ".app-name": {
                    margin: 0,
                    padding: 0,
                    textAlign: $.center,
                    "&, :visited, :link, :hover, :active": {
                        color: $.cssVar("text-primary"),
                        textDecoration: "unset"
                    }
                }
            },

            ".search": {
                borderBottom: "unset",
                background: $.transparent,
                paddingLeft: 20,
                margin: $.important(0),
                "input": {
                    width: $.important("auto"),
                    backgroundColor: $.important("#333"),
                    color: $.important("#fff"),
                    border: $.important($.border({ width: 1, color: "#555" }))
                }
            },

            ">h1": {
                margin: $.margin(0, $.auto, "2rem"),
                fontSize: "1.75rem",
                fontWeight: 600,
                textAlign: $.center,
                background: $.linearGradient({ dir: 135, stops: [$.cssVar("theme-primary"), $.cssVar("theme-primary-light")] }),
                webkitBackgroundClip: "text",
                webkitTextFillColor: $.transparent,
                backgroundClip: "text",
                display: $.flex,
                alignItems: $.center,
                justifyContent: $.center,
                gap: 12,

                "&::before": {
                    content: "''",
                    display: $.inlineBlock,
                    width: 32,
                    height: 32,
                    backgroundImage: "url('assets/logo.svg')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: $.center
                },

                "a": {
                    color: "inherit",
                    textDecoration: $.none
                },

                ".app-nav": {
                    display: $.block,
                    position: $.static
                }
            },

            ".sidebar-nav": {
                lineHeight: "2em",
                padding: $.padding(0, 20, 40)
            },

            "li": {
                margin: $.margin(4, 0),
                "&.collapse .app-sub-sidebar": {
                    display: $.none
                },
                ">p": {
                    fontWeight: 600,
                    margin: 0,
                    color: $.cssVar("text-primary")
                }
            },

            "ul": {
                margin: $.margin(0, 0, 0, 15),
                padding: 0,
                listStyle: $.none,

                "li": {
                    "a": {
                        borderBottom: $.none,
                        display: $.block,
                        color: $.cssVar("text-secondary"),
                        fontSize: 14,
                        fontWeight: 400,
                        overflow: $.hidden,
                        textDecoration: $.none,
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        padding: $.padding(4, 0),
                        transition: $.transition([{ prop: "all", time: $.cssVar("transition-fast") }]),
                        borderRadius: $.cssVar("radius-sm"),

                        "&:hover": {
                            color: $.cssVar("theme-primary"),
                            paddingLeft: 8
                        },

                        "&.active": {
                            color: $.important($.cssVar("theme-primary")),
                            fontWeight: $.important(600),
                            background: $.important($.linearGradient({ dir: 90, stops: [$.rgba(0, 174, 239, 0.15), $.transparent] })),
                            borderLeft: $.important($.border({ width: 4, color: $.cssVar("theme-primary") })),
                            paddingLeft: $.important($.px(16))
                        }
                    },
                    "ul": {
                        paddingLeft: 20
                    }
                }
            },


        },
        // Desktop Sidebar Collapse Logic
        "body.close": {
            ".sidebar": {
                transform: $.transform().translateX(-300).str()
            },
            ".content": {
                marginLeft: 0,
                width: $.vw(100),
                maxWidth: $.vw(100)
            },
            ".sidebar-toggle": {
                width: $.px(1),
                padding: $.padding(12),
                background: $.transparent,
                left: 0,
                cursor: $.pointer
            },
            ".sidebar-toggle::after": {
                content: $.text("")
            }
        },

        ".sidebar-toggle": {
            background: $.rgb(19, 19, 52),
            backdropFilter: "blur(10px)",
            border: 0,
            borderBottom: $.border({ width: 1, color: $.rgba(128, 128, 128, 0.5) }),
            outline: $.none,
            padding: "12px 12px 12px 16px",
            position: $.sticky,
            top: 0,
            textAlign: $.center,
            transition: $.transition([{ prop: "opacity", time: $.cssVar("transition-base") }]),
            width: 300,
            marginRight: -300,
            zIndex: 30,
            cursor: $.pointer,
            display: $.flex,
            alignItems: $.center,
            justifyContent: $.flexStart,

            "&:hover .sidebar-toggle-button": {
                opacity: 1
            },

            "span": {
                background: $.cssVar("theme-primary"),
                display: $.block,
                marginBottom: 4,
                width: 16,
                height: 2,
                borderRadius: 1,
                transition: $.transition([{ prop: "all", time: $.cssVar("transition-fast") }])
            },


        },

        ".sidebar-toggle::after": {
            content: "'Documentación'",
            marginLeft: 12,
            fontSize: 14,
            fontWeight: 600,
            color: $.cssVar("theme-primary"),
            letterSpacing: "0.05em",
            pointerEvents: "none" // Allow clicks to pass through to the button
        },

        ".content": {
            paddingTop: 60,
            position: $.relative,
            flexGrow: 1,
            minWidth: 0,
            minHeight: $.vh(100),
            transition: $.transition([{ prop: "margin-left", time: "0.25s", ease: "cubic-bezier(0.4, 0, 0.2, 1)" }])
        },

        ".app-nav": {
            margin: $.margin(25, 60, 0, 0),
            position: $.absolute,
            right: 0,
            textAlign: $.right,
            zIndex: 10,

            "&.no-badge": {
                marginRight: 25
            },

            "p": {
                margin: 0
            },

            ">a": {
                margin: $.margin(0, "1rem"),
                padding: $.padding(5, 0)
            },

            "ul, li": {
                display: $.inlineBlock,
                listStyle: $.none,
                margin: 0
            },

            "a": {
                color: $.cssVar("text-secondary"),
                fontSize: 15,
                fontWeight: 500,
                textDecoration: $.none,
                transition: $.transition([{ prop: "color", time: $.cssVar("transition-base") }]),

                "&:hover": {
                    color: $.cssVar("theme-primary")
                },

                "&.active": {
                    color: $.cssVar("theme-primary"),
                    borderBottom: $.border({ width: 2, color: $.cssVar("theme-primary") })
                }
            },

            "li": {
                display: $.inlineBlock,
                margin: $.margin(0, "1rem"),
                padding: $.padding(5, 0),
                position: $.relative,
                cursor: $.pointer,

                "ul": {
                    background: $.cssVar("bg-primary"),
                    border: $.border({ width: 1, color: $.cssVar("border-color") }),
                    borderRadius: $.cssVar("radius-md"),
                    boxShadow: $.cssVar("shadow-md"),
                    display: $.none,
                    maxHeight: "calc(100vh - 61px)",
                    overflowY: $.auto,
                    padding: $.padding(10, 0),
                    position: $.absolute,
                    right: -15,
                    textAlign: $.left,
                    top: $.percent(100),
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(10px)",

                    "li": {
                        display: $.block,
                        fontSize: 14,
                        lineHeight: "1rem",
                        margin: $.margin(8, 14),
                        whiteSpace: "nowrap",

                        "a": {
                            display: $.block,
                            fontSize: "inherit",
                            margin: 0,
                            padding: 0,

                            "&.active": {
                                borderBottom: 0
                            }
                        }
                    }
                },

                "&:hover ul": {
                    display: $.block
                }
            }
        },

        /* Footer / Creator Info Styles */
        ".app-footer": {
            position: $.fixed,
            bottom: 10,
            right: 10,
            zIndex: 100,
            display: $.flex,
            alignItems: "stretch",
            gap: 10,
            padding: $.padding(6, 12),
            borderRadius: 16,
            background: $.rgba(0, 0, 0, 0.2),
            backdropFilter: "blur(5px)",
            border: $.border({ color: $.rgba(255, 255, 255, 0.05) }),
            transition: $.transition([{ prop: "all", time: "300ms", ease: "ease" }]),
            "&:hover": {
                background: $.rgba(0, 0, 0, 0.4),
                borderColor: $.rgba(255, 255, 255, 0.1)
            }
        },
        ".creator-info": {
            fontSize: "0.75rem",
            color: $.rgba(255, 255, 255, 0.5),
            fontFamily: $.font("-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"),
            letterSpacing: "0.05em",
            fontWeight: 500,
            display: $.flex,
            alignItems: "center"
        },
        ".social-links": {
            display: $.flex,
            gap: 6
        },
        ".social-btn": {
            padding: 3,
            background: $.rgba(255, 255, 255, 0.05),
            borderRadius: $.percent(50),
            display: $.flex,
            alignItems: $.center,
            justifyContent: $.center,
            color: $.rgba(255, 255, 255, 0.6),
            textDecoration: $.none,
            fontSize: 9,
            fontWeight: 700,
            transition: $.transition([{ prop: "all", time: "300ms", ease: "cubic-bezier(0.4, 0, 0.2, 1)" }]),
            border: $.border({ color: $.rgba(255, 255, 255, 0.05) }),
            "&:hover": {
                background: $.cssVar("theme-primary"),
                color: "white",
                transform: $.transform().translateY(-2).str(),
                boxShadow: $.boxShadow({ dY: 4, blur: 12, color: $.rgba(0, 174, 239, 0.3) }),
                borderColor: $.transparent
            },
            "i": {
                lineHeight: $.unset
            }
        },

        "@media screen and (max-width: 768px)": {
            ".github-corner, .sidebar-toggle, .sidebar": {
                position: $.fixed
            },

            ".app-nav": {
                marginTop: $.px(16),
                "li ul": {
                    top: $.px(30)
                }
            },

            "main": {
                height: $.auto,
                minHeight: $.vh(100),
                overflowX: $.hidden
            },

            ".sidebar": {
                left: $.px(-300),
                transition: $.transition([{ prop: "transform", time: "250ms", ease: "ease-out" }])
            },

            ".content": {
                left: 0,
                maxWidth: $.vw(100),
                position: $.static,
                paddingTop: $.px(20),
                transition: $.transition([{ prop: "transform", time: "250ms", ease: "ease" }])
            },

            ".app-nav, .github-corner": {
                transition: $.transition([{ prop: "transform", time: "250ms", ease: "ease-out" }])
            },

            ".sidebar-toggle": {
                background: $.rgba(255, 255, 255, 0.95),
                backdropFilter: "blur(10px)",
                border: 0,
                borderBottom: $.border({ width: 1, color: $.cssVar("border-color") }),
                outline: $.none,
                padding: $.px(12),
                position: $.sticky,
                top: 0,
                left: 0
            },

            "body.close": {
                ".sidebar": {
                    transform: $.transform().translateX(300).str()
                },
                ".sidebar-toggle": {
                    backgroundColor: $.rgba(255, 255, 255, 0.95),
                    transition: $.transition([{ prop: "background-color", time: "1s" }]),
                    width: $.px(284),
                    padding: $.px(10)
                },
                ".content": {
                    transform: $.transform().translateX(300).str()
                },
                ".app-nav, .github-corner": {
                    display: $.none
                }
            },

            ".github-corner": {
                "&:hover .octo-arm": {
                    animation: $.none
                },
                ".octo-arm": {
                    animation: "octocat-wave 560ms ease-in-out"
                }
            },

            ".markdown-section": {
                padding: $.padding(20, 16, 40)
            },

            "section.cover h1": {
                fontSize: $.rem(2.5)
            }
        },

        "@media print": {
            ".sidebar, .app-nav, .github-corner, .sidebar-toggle": {
                display: $.none
            },
            ".content": {
                padding: 0,
                margin: 0,
                width: $.percent(100)
            },
            "a": {
                textDecoration: "underline",
                color: "black"
            }
        }
    }));
})();
