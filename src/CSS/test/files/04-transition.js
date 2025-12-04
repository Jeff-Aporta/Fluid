// @ts-nocheck
$ => ({
    initheader: ["@import url(\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap\");", "@import url(\"other.css\");"],
    ".test-transition-1": {
        transition: $.transition({ prop: "all", time: $.cssVar("transition-base") }),
    },
    ".test-transition-2": {
        transition: $.transition({ prop: "opacity", time: "0.3s" }),
    },
    ".test-transition-3": {
        transition: $.transition(
            { prop: "background-color", time: "0.5s", ease: "linear" },
            { prop: "transform", time: "0.2s" }
        ),
    },
    ".test-transition-4": {
        transition: $.transition({ prop: "margin-left", time: "250ms", ease: $.cubicBezier(0.4, 0, 0.2, 1) }),
    },
    ".test-font": {
        fontFamily: $.fontFamily("-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"),
    },
    ".test-filter-1": {
        filter: $.filter($.dropShadow({ blur: $.cssVar("br"), color: "white" }), $.dropShadow({ blur: $.cssVar("br"), color: "white" })),
    },
    ".test-filter-2": {
        filter: $.filter($.blur(5), $.brightness(1.2), $.contrast(0.8), $.grayscale(0.5), $.hueRotate(90), $.invert(1), $.opacity(0.5), $.saturate(2), $.sepia(0.3)),
    },
    "*": {
        webkitFontSmoothing: $.antialiased,
        "-moz-osx-font-smoothing": "grayscale",
        webkitOverflowScrolling: $.touch,
        webkitTapHighlightColor: $.transparent,
        webkitTextSizeAdjust: $.none,
        webkitTouchCallout: $.none,
        boxSizing: "border-box",
    },
})
