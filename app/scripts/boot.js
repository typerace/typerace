;(function () {
    // The Depot
    var D = $.extend(JSON.parse(localStorage.getItem("C")) || {
            debug: true,
            locale: "",
            api: {
                url: "//" + window.location.hostname + "/api"
            },
            user: {}
        }, {
        save: function () {
            localStorage.setItem("D", JSON.stringify(D));
        },
        load: function () {
            D = JSON.parse(localStorage.getItem("D"));
        }
    });

    window.D = D;

    window.cookieconsent_options = {
        "message": "tr.io use cookies, your browser's storage and every possible way to pass your data to third party advertisers, yoy.",
        "dismiss": "_ok",
        "learnMore": "more",
        "link": null,
        "theme": "dark-bottom"
    };
})();