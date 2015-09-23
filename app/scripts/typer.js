(function() {
    var emmetTemplate = Emmet.template(".type-container > .type-text{{0}} + textarea.type-area ^ .type-buttons > a.type-submit.btn.primary.disabled.silent{not solved yet...}", true);

    function Typer(el, text) {
        this.typer = el;
        this.init(text);
    }

    Typer.prototype = {
        elements: {
            typeText: null,
            typeArea: null,
            typeSubmit: null,
        },
        words: [],
        wordIndex: 0,
        text: null,

        init: function(text) {
            var wordIndex = this.wordIndex = 0;

            this.text = text || this.typer.innerHTML.trim();
            this.words = this.text.replace(/\s+/g, " ").split(" ");
            console.log("initing...");
            console.log(this.words);

            this.typer.innerHTML = emmetTemplate(this.text);
            this.elements.typeText = this.typer.querySelector(".type-text");
            this.elements.typeArea = this.typer.querySelector(".type-area");
            this.elements.typeSubmit = this.typer.querySelector(".type-submit");
            this.elements.typeText.innerHTML = this.words.map(function(word, index) {
                return index === wordIndex ? "<span>" + word + "</span>" : word;
            }).join(" ");
        },
    };

    window.Typer = Typer;
})();
