
// @ts-nocheck
$ => ({
    "@media screen and (max-width: 768px)": {
        ".github-corner, .sidebar-toggle, .sidebar": {
            position: $.fixed,
        },
        ".app-nav": {
            marginTop: 16,
            "li ul": {
                top: 30,
            },
        },
        main: {
            height: $.auto,
            minHeight: $.vh(100),
            overflowX: $.hidden,
        },
        ".sidebar": {
            left: -300,
            transition: $.transition({ prop: "transform", time: "250ms", ease: "ease-out" }),
        },
        ".content": {
            left: 0,
            maxWidth: $.vw(100),
            position: $.static,
            paddingTop: 20,
            transition: $.transition({ prop: "transform", time: "250ms" }),
        },
        ".app-nav, .github-corner": {
            transition: $.transition({ prop: "transform", time: "250ms", ease: "ease-out" }),
        },
        ".sidebar-toggle": {
            background: $.rgba(255, 0.95),
            backdropFilter: "blur(10px)",
            border: 0,
            borderBottom: $.border({ width: 1, color: $.cssVar("border-color") }),
            outline: $.none,
            padding: 12,
            position: $.sticky,
            top: 0,
            left: 0,
        },
        "body.close": {
            ".sidebar": {
                transform: $.transform().translateX(300).str(),
            },
            ".sidebar-toggle": {
                backgroundColor: $.rgba(255, 0.95),
                transition: $.transition({ prop: "background-color", time: "1s" }),
                width: 284,
                padding: 10,
            },
            ".content": {
                transform: $.transform().translateX(300).str(),
            },
            ".app-nav, .github-corner": {
                display: $.none,
            },
        },
        ".github-corner": {
            "&:hover .octo-arm": {
                animation: $.none,
            },
            ".octo-arm": {
                animation: "octocat-wave 560ms ease-in-out",
            },
        },
        ".markdown-section": {
            padding: $.padding(20, 16, 40),
        },
        "section.cover h1": {
            fontSize: $.rem(2.5),
        },
    },
})