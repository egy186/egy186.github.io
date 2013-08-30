/*!
 * colorConvert.js v0.0.3
 * github.com/egy186/colorConverter
 *
 * Copyright (c) 2013 egy186
 * Released under the MIT License.
 *
 *
 * Modernizr method is:
 * Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: modernizr.com/download/#-inputtypes
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

(function () {
    // # TODO
    // use addEventListener
    // Array R,G,B --> for
    var focusdForm = document.getElementById('RGBform');
    window.onload = function () {
        //var defcolor = 'rgb(51,51,51)';
        var defcolor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
        text_setValue(defcolor);
        focusdForm.RGB.value = defcolor;
    }
    focusdForm.RGB.onkeyup = function () { text_setValue(this.value); };
    focusdForm.rangeR.onchange = function () { range_setValue(this.valueAsNumber, 'R'); };
    focusdForm.rangeG.onchange = function () { range_setValue(this.valueAsNumber, 'G'); };
    focusdForm.rangeB.onchange = function () { range_setValue(this.valueAsNumber, 'B'); };
    focusdForm.numR.onchange = function () { num_setValue(this.valueAsNumber, 'R'); };
    focusdForm.numG.onchange = function () { num_setValue(this.valueAsNumber, 'G'); };
    focusdForm.numB.onchange = function () { num_setValue(this.valueAsNumber, 'B'); };
    focusdForm.numR.onkeyup = function () {
        var val = this.valueAsNumber;
        if (val >= 0 && val <= 255) {
            num_setValue(this.valueAsNumber, 'R');
        }
    };
    focusdForm.numG.onkeyup = function () {
        var val = this.valueAsNumber;
        if (val >= 0 && val <= 255) {
            num_setValue(this.valueAsNumber, 'G');
        }
    };
    focusdForm.numB.onkeyup = function () {
        var val = this.valueAsNumber;
        if (val >= 0 && val <= 255) {
            num_setValue(this.valueAsNumber, 'B');
        }
    };
    focusdForm.RGBa.onfocus = function () { this.select(); };
    focusdForm.HSL.onfocus = function () { this.select(); };
    focusdForm.HSLa.onfocus = function () { this.select(); };
    focusdForm.Hex.onfocus = function () { this.select(); };

    function text_setValue(str) {
        var enterArr = str.replace(/\s/g, '').replace(/[rgb();]/g, '').split(/,/);
        switch(enterArr.length){
            case 2:
                enterArr[2] = 0;
            case 1:
                enterArr[1] = 0;
            case 3:
                break;
            default:
                return;
        }
        if (enterArr[0].search("%") != -1) {
            for (var i = 1; i <= 3; i++) {
                enterArr[i] = enterArr[i].replace(/%$/, "") * 255 / 100;
            }
        }
        for (var j = 0; j < 3; j++) {
            enterArr[j] = parseFloat(enterArr[j]);
            if(isNaN(enterArr[j])) {
                return;
            }
            if (enterArr[j] < 0 || enterArr[j] > 255) {
                return;
            }
        }
        focusdForm.rangeR.value = enterArr[0];
        focusdForm.rangeG.value = enterArr[1];
        focusdForm.rangeB.value = enterArr[2];
        focusdForm.numR.value = enterArr[0];
        focusdForm.numG.value = enterArr[1];
        focusdForm.numB.value = enterArr[2];
        setResult(enterArr, 'rgb', true);
    }

    function num_setValue(value, changedValueName) {
        var rgb = getOtherValue(value, changedValueName);
        if (changedValueName == 'R') {
            focusdForm.rangeR.value = rgb[0];
        }
        if (changedValueName == 'G') {
            focusdForm.rangeG.value = rgb[1];
        }
        if (changedValueName == 'B') {
            focusdForm.rangeB.value = rgb[2];
        }
        setResult(rgb, 'rgb', false);
    }

    function range_setValue(value, changedValueName) {
        var rgb = getOtherValue(value, changedValueName);
        if (changedValueName == 'R') {
            focusdForm.numR.value = rgb[0];
        }
        if (changedValueName == 'G') {
            focusdForm.numG.value = rgb[1];
        }
        if (changedValueName == 'B') {
            focusdForm.numB.value = rgb[2];
        }
        setResult(rgb, 'rgb', false);
    }

    function setResult(colorArr, codeType, except) {
        var rgb, hsl, hex;
        switch (codeType) {
            case 'rgb':
                rgb = colorArr;
                hsl = rgb2hsl(rgb[0], rgb[1], rgb[2]);
                hex = rgb2hex(rgb[0], rgb[1], rgb[2]);
                break;
            default:
                window.alert('Exception');
        }
        if (!except) {
            focusdForm.RGB.value = 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }
        focusdForm.RGBa.value = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 1)';
        focusdForm.HSL.value = 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
        focusdForm.HSLa.value = 'hsla(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%, 1)';
        focusdForm.Hex.value = hex;
        var ApStElem = document.getElementById('page-body').style;
        ApStElem.backgroundColor = 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        if (judgeTextColor(rgb[0], rgb[1], rgb[2]) == 0) {
            ApStElem.color = '#222';
        } else {
            ApStElem.color = '#fafafa';
        }
    }

    function getOtherValue(value, changedValueName) {
        var r, g, b
        if (changedValueName == 'R') {
            r = value;
        } else {
            r = focusdForm.rangeR.valueAsNumber;
        }
        if (changedValueName == 'G') {
            g = value;
        } else {
            g = focusdForm.rangeG.valueAsNumber;
        }
        if (changedValueName == 'B') {
            b = value;
        } else {
            b = focusdForm.rangeB.valueAsNumber;
        }
        return [r, g, b];
    }
})();

function rgb2hsl(r, g, b) {
    // Param: r, g and b are from 0 to 255
    // Return: h is from 0 to 360, s and l are from 0 to 100
    r /= 255;
    g /= 255;
    b /= 255;
    var h, s, l,
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        sum = max + min,
        delta = max - min;

    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = 60 * (g - b) / delta;
            break;
        case g:
            h = 120 + 60 * (b - r) / delta;
            break;
        case b:
            h = 240 + 60 * (r - g) / delta;
            break;
    }
    while (h < 0) {
        h += 360;
    }

    l = sum / 2;

    if (l == 0 || l == 1) {
        s = 0;
    } else if (l < 0.5) {
        s = delta / sum;
    } else {
        s = delta / (2 - sum);
    }

    // now s and l are from 0 to 1 
    // h, s and l are decimals so...
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hsl2rgb(h, s, l) {
    // Param: h is from 0 to 360, s and l are from 0 to 100
    // Return: r, g and b are from 0 to 255
    while (h < 0) {
        h += 360;
    }
    while (h > 360) {
        h -= 360;
    }
    s /= 100;
    l /= 100;

    var r = 0, g = 0, b = 0,
        C = s * (1 - Math.abs(2 * l - 1)),
        X = C * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - C / 2;
    if (h < 60) {
        r = C;
        g = X;
    } else if (h < 120) {
        r = X;
        g = C;
    } else if (h < 180) {
        g = C;
        b = X;
    } else if (h < 240) {
        g = X;
        b = C;
    } else if (h < 300) {
        r = X;
        b = C;
    } else {
        r = C;
        b = X;
    }

    // Now r, g and b are from 0  to 1 so...
    // r, g and b are decimals so...
    return [Math.round(255 * (r + m)), Math.round(255 * (g + m)), Math.round(255 * (b + m))];
}

function rgb2hex(r, g, b) {
    // Param: r, g and b are from 0 to 255
    // Return: #rrggbb
    //window.alert(r * 65536 + g * 256 + b);
    var result = (r * 65536 + g * 256 + b).toString(16);
    while (result.length < 6) {
        result = '0' + result;
    }
    return '#' + result;
}

function hex2rgb(hex) {
    // Param: #rrggbb
    // Return: r, g and b are from 0 to 255
    hex = hex.replace("#", "");
    if (hex.length == 3) {
        var r = parseInt(hex.slice(0, 1), 16),
            g = parseInt(hex.slice(1, 2), 16),
            b = parseInt(hex.slice(2, 3), 16);
        return [r + r * 16, g + g * 16, b + b * 16];
    }
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function judgeTextColor(r, g, b) {
    // Param: background r, g, b. r, g and b are from 0 to 255
    // Return: textColor. 1 means white, 0 means black.
    var lum = 0.298912 * r + 0.586611 * g + 0.114478 * b;
    if (lum < 128) {
        return 1;
    }
    return 0;
}

/*window.Modernizr = (function (window, document, undefined) {

    var version = '2.6.2',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem = document.createElement('input'),

    smile = ':)',

    toString = {}.toString, tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName,



    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function (object, property) {
            return _hasOwnProperty.call(object, property);
        };
    }
    else {
        hasOwnProp = function (object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }


    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function () {

                    if (this instanceof bound) {

                        var F = function () { };
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {

                if (elem === false) return props[i];

                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }
    function webforms() {
        Modernizr['inputtypes'] = (function (props) {

            for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                if (bool) {

                    inputElem.value = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {

                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;

                        bool = defaultView.getComputedStyle &&
              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                                                  (inputElem.offsetHeight !== 0);

                        docElement.removeChild(inputElem);

                    } else if (/^(search|tel)$/.test(inputElemType)) {
                    } else if (/^(url|email)$/.test(inputElemType)) {
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                        bool = inputElem.value != smile;
                    }
                }

                inputs[props[i]] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
    }
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


    Modernizr.addTest = function (feature, test) {
        if (typeof feature == 'object') {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {

            feature = feature.toLowerCase();

            if (Modernizr[feature] !== undefined) {
                return Modernizr;
            }

            test = typeof test == 'function' ? test() : test;

            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;

        }

        return Modernizr;
    };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version = version;


    return Modernizr;

})(this, this.document);*/
