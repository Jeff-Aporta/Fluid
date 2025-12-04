// @ts-nocheck
$ => ({
    body: {
        position: $.relative,
        minHeight: $.vh(100),
        background: $.important("#000000"),
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
            ),
        },
    },
})