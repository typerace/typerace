;(function () {
    var indexesRe   = /(.+?)(>|\+|\^|$)/g;
    var escapeRe    = /("|')([^\1]*?)\1/g;
    var innerTextRe = /\{([^\}]*?)\}/g;
    var excludes    = '([^\\.#\\(\\{]+)';
    var attrsRe     = /\(([^\)]*)\)/g;
    var tagRe       = new RegExp('^' + excludes);
    var idRe        = new RegExp('#' + excludes, 'g');
    var classesRe   = new RegExp('\\.' + excludes, 'g');

    var escaped     = [];
    var innerTexts  = [];

    function unescape(text) {
        return text.replace(/""/g, function () { return escaped.shift(); });
    }

    function element(text) {
        text = text || '';

        var tag       = text.match(tagRe);
        var id        = text.match(idRe);
        var classes   = text.match(classesRe);
        var attrs     = text.match(attrsRe);
        var innerText = text.match(innerTextRe);

        var element = document.createElement(tag ? tag[0] : 'div');

        if (id) element.id = id.pop().replace(idRe, '$1');
        if (classes) element.className = classes.map(function (e) { return e.slice(1); }).join(' ');
        if (innerText) element.innerText = innerText.map(function () { return unescape(innerTexts.shift()); }).join(' ');

        if (attrs) attrs.map(function (chunk) {
            chunk = chunk.replace(attrsRe, '$1').split(',');
            chunk.map(function (attr) {
                attr = attr.split('=');
                var key = attr.shift();
                var value = JSON.parse(unescape(attr.join('=')));

                element.setAttribute(key, value);
            });
        });

        return element;
    }

    function Emmet(text, htmlOnly, args) {
        var tree = element();
        var current = tree;
        var lastElement = tree;

        escaped = [];
        innerTexts = [];

        if (args) text = Emmet.templatedString(text, args);

        text
            .replace(escapeRe, function (escape) { return escaped.push(escape), '""'; })
            .replace(innerTextRe, function (_, innerText) { return innerTexts.push(innerText), '{}'; })
            .replace(/\s+/g, '')
            .replace(indexesRe, function (full, text, splitter) {
                current.appendChild(lastElement = element(text));
                if (splitter == '>') current = lastElement;
                else if (splitter == '^') current = current.parentNode;
            });

        return htmlOnly ? tree.innerHTML : (tree.children.length > 1 ? tree.children : tree.children[0]);
    }

    Emmet.templatedString = function (text, args) {
        args.map(function (e, i) {
            text = text.replace(new RegExp('\\{' + i + '\\}', 'g'), function () { return e; });
        });
        return text;
    };

    Emmet.template = function (text, htmlOnly) {
        return function () {
            return Emmet(text, htmlOnly, [].slice.call(arguments));
        };
    };

    window.Emmet = Emmet;

    if (window.jQuery) {
        $.emmet = function (text, htmlOnly, args) {
            var el = Emmet(text, htmlOnly, args);
            return htmlOnly ? el : $(el);
        };
        $.emmet.template = function (text, htmlOnly) {
            var template = Emmet.template(text, htmlOnly);
            return function () {
                var el = template.apply(null, arguments);
                return htmlOnly ? el : $(el);
            };
        };
    }

})();