/*!
 * Color Converter Version 0.2.0
 * github.com/egy186/colorConverter
 *
 * Includes egyColorCONFIG
 * gist.github.com/egy186/7693713
 *
 * Copyright (c) 2013 egy186
 * Released under the MIT License.
 */

// egyColorCONFIG
function egyColorCONFIG() {
    this.r = 0; // 0-255
    this.g = 0; // 0-255
    this.b = 0; // 0-255
    this.h = 0, // 0-360
    this.s = 0, // 0-100
    this.l = 0, // 0-100
    this.a = 1  // 0-1
}

egyColorCONFIG.prototype.set = function (key, value) {
    // key is string rgb, rgba, hsl, hsla, hex
    //     or float  r, g, b, h, s, l, a
    // value is float
    switch (key) {
        case 'rgb':
        case 'rgba':
            value = value.replace(/[rgba();\s]/g, '').split(/,/);
            for (var i = 0; i < value.length; i++) {
                value[i] = parseFloat(value[i]);
            }
            switch (value.length) {
                case 4:
                    if (!isNaN(value[3])) {
                        this.a = value[3];
                    }
                case 3:
                    if (!isNaN(value[2])) {
                        this.b = value[2];
                    }
                case 2:
                    if (!isNaN(value[1])) {
                        this.g = value[1];
                    }
                case 1:
                    if (!isNaN(value[0])) {
                        this.r = value[0];
                    }
                case 0:
                    break;
            }
            this.sync('rgb');
            break;
        case 'r':
        case 'g':
        case 'b':
        case 'a': // a dosen't need sync
            value = parseFloat(value);
            if (!isNaN(value)) {
                this[key] = value;
            }
            this.sync('rgb');
            break;
        case 'hsl':
        case 'hsla':
            value = value.replace(/[hsla();\s]/g, '').split(/,/);
            for (var i = 0; i < value.length; i++) {
                value[i] = parseFloat(value[i]);
            }
            switch (value.length) {
                case 4:
                    if (!isNaN(value[3])) {
                        this.a = value[3];
                    }
                case 3:
                    if (!isNaN(value[2])) {
                        this.l = value[2];
                    }
                case 2:
                    if (!isNaN(value[1])) {
                        this.s = value[1];
                    }
                case 1:
                    if (!isNaN(value[0])) {
                        this.h = value[0];
                    }
                case 0:
                    break;
            }
            this.sync('hsl');
            break;
        case 'h':
        case 's':
        case 'l':
            value = parseFloat(value);
            if (!isNaN(value)) {
                this[key] = value;
            }
            this.sync('hsl');
            break;
        case 'hex':
            value = value.replace("#", "");
            if (value.length == 3) {
                var r = parseInt(value.slice(0, 1), 16),
                    g = parseInt(value.slice(1, 2), 16),
                    b = parseInt(value.slice(2, 3), 16);
                this.r = r + r * 16;
                this.g = g + g * 16;
                this.b = b + b * 16;
            } else {
                if (value.length != 6) {
                    value = ('000000' + value).slice(-6);
                }
                this.r = parseInt(value.slice(0, 2), 16);
                this.g = parseInt(value.slice(2, 4), 16);
                this.b = parseInt(value.slice(4, 6), 16);
            }
            this.sync('rgb');
            break;
        default:
            console.log('Unknown key: egyColorCONFIG.set');

    }
}

egyColorCONFIG.prototype.sync = function (changedColorScheme) {
    // changedColorScheme is rgb, hsl
    switch (changedColorScheme) {
        case 'rgb':
            // rgb2hsl
            var R = this.r / 255;
            var G = this.g / 255;
            var B = this.b / 255;
            var H, S, L,
                max = Math.max(R, G, B),
                min = Math.min(R, G, B),
                sum = max + min,
                delta = max - min;

            switch (max) {
                case min:
                    H = 0;
                    break;
                case R:
                    H = 60 * (G - B) / delta;
                    break;
                case G:
                    H = 120 + 60 * (B - R) / delta;
                    break;
                case B:
                    H = 240 + 60 * (R - G) / delta;
                    break;
            }
            while (H < 0) {
                H += 360;
            }
            L = sum / 2;
            if (L == 0 || L == 1) {
                S = 0;
            } else if (L < 0.5) {
                S = delta / sum;
            } else {
                S = delta / (2 - sum);
            }
            // return
            this.h = Math.round(H);
            this.s = Math.round(S * 100);
            this.l = Math.round(L * 100);
            break;
        case 'hsl':
            // hsl2rgb
            var H = this.h,
                S = this.s / 100,
                L = this.l / 100;
            var R = 0, G = 0, B = 0,
                C = S * (1 - Math.abs(2 * L - 1)),
                X = C * (1 - Math.abs((H / 60) % 2 - 1)),
                m = L - C / 2;
            while (H < 0) {
                H += 360;
            }
            while (H > 360) {
                H -= 360;
            }
            if (H < 60) {
                R = C;
                G = X;
            } else if (H < 120) {
                R = X;
                G = C;
            } else if (H < 180) {
                G = C;
                B = X;
            } else if (H < 240) {
                G = X;
                B = C;
            } else if (H < 300) {
                R = X;
                B = C;
            } else {
                R = C;
                B = X;
            }
            // return
            this.r = Math.round(255 * (R + m));
            this.g = Math.round(255 * (G + m));
            this.b = Math.round(255 * (B + m));
            break;
    }
}

egyColorCONFIG.prototype.toString = function (colorScheme) {
    // colorScheme is rgb, rgba, hsl, hsla, hex
    switch (colorScheme.toLowerCase()) {
        case 'rgb':
            return 'rgb(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ')';
        case 'rgba':
            return 'rgba(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ', ' + this.a + ')';
        case 'hsl':
            return 'hsl(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%)';
        case 'hsla':
            return 'hsla(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%, ' + this.a + ')';
        case 'hex':
            return '#' + ('000000' + (this.r * 65536 + this.g * 256 + this.b).toString(16)).slice(-6);
    }
}

// usage of egyColorCONFIG
/*var egyColorConfig = new egyColorCONFIG();

console.log(egyColorConfig.toString('rgba')); // rgba(0, 0, 0, 1)

egyColorConfig.set('r', 255);

console.log(egyColorConfig.toString('rgba')); // rgba(255, 0, 0, 1)

console.log(egyColorConfig.toString('hsla')); // hsla(0, 100%, 50%, 1)

egyColorConfig.set('rgba(0, 255, 255, 0.5)');

console.log(egyColorConfig.h); // 180*/


// colorConverter
addEventListener('load', init, false);

var colorConfig = new egyColorCONFIG(),
    tabList = ['RGB', 'RGBa', 'HSL', 'HSLa', 'Hex'];


// init
function init() {
    var navTav = document.getElementById('nav-tab'),
        i;
    // init dom
    navTabAs = navTav.getElementsByTagName('a');
    for (i = 0; i < 5; i++) {
        navTabAs[i].setAttribute('href', '#' + tabList[i]);
    }
    // add event
    navTav.addEventListener('click', function (evt) {
        if (evt.target.tagName.toLowerCase() == 'a') {
            evt.preventDefault();
            evt.target.blur();
            changeTab(evt.target.getAttribute('href').slice(1));
        }
    }, false);

    var formInput = document.getElementById('form-input');
    formInput.addEventListener('change', function (evt) {
        main(evt.target.name, evt.target.value);
    }, false);
    formInput.addEventListener('input', function (evt) {
        main(evt.target.name, evt.target.value);
    }, false);

    var formOutputInputs = document.getElementById('form-output').getElementsByTagName('input');
    for (i = 0; i < formOutputInputs.length; i++) {
        formOutputInputs.item(i).addEventListener('focus', function (evt) {
            evt.target.select();
        }, false);
    }

    // set tab
    var locHash = location.hash.slice(1),
        locHashSc = locHash.replace(/&.*$/, ''),
        locHashCv = locHash.replace(/^.*&/, '');
    if (tabList.indexOf(locHashSc) != -1) {
        changeTab(locHashSc);
    } else {
        // random
        changeTab(tabList[Math.floor(Math.random() * 5)]);
        console.log('random tab');
    }

    // set color
    if (locHashCv && JSON.parse(locHashCv)) {
        var config = JSON.parse(locHashCv);
        for (var key in config) {
            colorConfig.set(key, config[key]);
            main('num-r', colorConfig.r);
        }
    } else {
        main('text-rgba', 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',1)');
        console.log('random color');
    }
    history.replaceState({}, '', location.href.replace(/\#.*/, ''));
}


// select tab
var currentTab = 'RGB';
function changeTab(newTab) {
    // newTab is 'RGB', 'RGBa', 'HSL', 'HSLa', 'Hex'
    var navTabs = document.getElementById('nav-tab').getElementsByTagName('a'),
        newTabIndex = tabList.indexOf(newTab),
        i, j;
    if (newTabIndex == -1) {
        newTab = 'RGB';
        newTabIndex = 0;
        console.log('unknown tab-name')
    }
    // forms
    var temp;
    for (i = 0; i < tabList.length; i++) {
        temp = document.getElementsByClassName(tabList[i].toLowerCase());
        for (j = 0; j < temp.length; j++) {
            temp[j].style.display = 'none';
        }
    }
    temp = document.getElementsByClassName(newTab.toLowerCase());
    for (i = 0; i < temp.length; i++) {
        temp[i].style.display = 'block';
    }
    delete temp;
    // nav-tab
    navTabs.item(tabList.indexOf(currentTab)).removeAttribute('class');
    navTabs.item(newTabIndex).setAttribute('class', 'current');
    // return
    currentTab = newTab;
    //history.pushState({ code: clicked }, clicked, '#' + clicked);
    main('r', colorConfig.r); // !finally
}


// main
function main(key, value) {
    var formInput = document.getElementById('form-input'),
        formOutput = document.getElementById('form-output');
    // set colorConfig
    // TODO: use function
    switch (key) {
        case 'text-rgb':
            colorConfig.set('rgb', value);
            break;
        case 'text-rgba':
            colorConfig.set('rgba', value);
            break;
        case 'text-hsl':
            colorConfig.set('hsl', value);
            break;
        case 'text-hsla':
            colorConfig.set('hsla', value);
            break;
        case 'text-hex':
            colorConfig.set('hex', value);
            break;
        case 'num16-r':
            if (value.length == 1) {
                value = String(value) + String(value);
            }
            value = parseInt(value, 16);
        case 'num-r':
        case 'range-r':
            colorConfig.set('r', value);
            break;
        case 'num16-g':
            if (value.length == 1) {
                value = String(value) + String(value);
            }
            value = parseInt(value, 16);
        case 'num-g':
        case 'range-g':
            colorConfig.set('g', value);
            break;
        case 'num16-b':
            if (value.length == 1) {
                value = String(value) + String(value);
            }
            value = parseInt(value, 16);
        case 'num-b':
        case 'range-b':
            colorConfig.set('b', value);
            break;
        case 'num-h':
        case 'range-h':
            colorConfig.set('h', value);
            break;
        case 'num-s':
        case 'range-s':
            colorConfig.set('s', value);
            break;
        case 'num-l':
        case 'range-l':
            colorConfig.set('l', value);
            break;
        case 'num-a':
        case 'range-a':
            colorConfig.set('a', value);
            break;
        default:
            console.log('unknown key');
            break;
    }
    // set values
    // TODO: use function
    //function setValue(itemHash, dirKey) {
    //    if (key != dirKey) {
    //        formInput[dirKey].value=colorConfig
    //    }
    //}
    if (key != 'text-rgb') {
        formInput['text-rgb'].value = colorConfig.toString('rgb');
    }
    if (key != 'text-rgba') {
        formInput['text-rgba'].value = colorConfig.toString('rgba');
    }
    if (key != 'text-hsl') {
        formInput['text-hsl'].value = colorConfig.toString('hsl');
    }
    if (key != 'text-hsla') {
        formInput['text-hsla'].value = colorConfig.toString('hsla');
    }
    if (key != 'text-hex') {
        formInput['text-hex'].value = colorConfig.toString('hex');
    }
    if (key != 'num-r') {
        formInput['num-r'].value = colorConfig.r;
    }
    if (key != 'range-r') {
        formInput['range-r'].value = colorConfig.r;
    }
    if (key != 'num-g') {
        formInput['num-g'].value = colorConfig.g;
    }
    if (key != 'range-g') {
        formInput['range-g'].value = colorConfig.g;
    }
    if (key != 'num-b') {
        formInput['num-b'].value = colorConfig.b;
    }
    if (key != 'range-b') {
        formInput['range-b'].value = colorConfig.b;
    }
    if (key != 'num16-r') {
        formInput['num16-r'].value = ('0'+colorConfig.r.toString(16)).slice(-2);
    }
    if (key != 'num16-g') {
        formInput['num16-g'].value = ('0' + colorConfig.g.toString(16)).slice(-2);
    }
    if (key != 'num16-b') {
        formInput['num16-b'].value = ('0' + colorConfig.b.toString(16)).slice(-2);
    }
    if (key != 'num-h') {
        formInput['num-h'].value = colorConfig.h;
    }
    if (key != 'range-h') {
        formInput['range-h'].value = colorConfig.h;
    }
    if (key != 'num-s') {
        formInput['num-s'].value = colorConfig.s;
    }
    if (key != 'range-s') {
        formInput['range-s'].value = colorConfig.s;
    }
    if (key != 'num-l') {
        formInput['num-l'].value = colorConfig.l;
    }
    if (key != 'range-l') {
        formInput['range-l'].value = colorConfig.l;
    }
    if (key != 'num-a') {
        formInput['num-a'].value = colorConfig.a;
    }
    if (key != 'range-a') {
        formInput['range-a'].value = colorConfig.a;
    }
    // form-output
    formOutput['output-rgb'].value = colorConfig.toString('rgb');
    formOutput['output-rgba'].value = colorConfig.toString('rgba');
    formOutput['output-hsl'].value = colorConfig.toString('hsl');
    formOutput['output-hsla'].value = colorConfig.toString('hsla');
    formOutput['output-hex'].value = colorConfig.toString('hex');
    //formOutput['output-permalink'].value = location.protocol + location.host + location.pathname + '#' + currentTab + '&' + JSON.stringify(colorConfig);
    formOutput['output-permalink'].value = location.protocol + '//' + location.hostname + location.pathname + '#' + currentTab + '&' + JSON.stringify(colorConfig);
    // set CSS
    var layerBgColor = document.getElementById('layer-bgcolor');
    if (currentTab == 'RGBa' || currentTab == 'HSLa') {
        layerBgColor.style.backgroundColor = colorConfig.toString('hsla');
        if (colorConfig.l > 50 || colorConfig.a < 0.5) {
            layerBgColor.setAttribute('class', 'theme-light');
        } else {
            layerBgColor.setAttribute('class', 'theme-dark');
        }
    } else {
        layerBgColor.style.backgroundColor = colorConfig.toString('hsl');
        if (colorConfig.l > 50) {
            layerBgColor.setAttribute('class', 'theme-light');
        } else {
            layerBgColor.setAttribute('class', 'theme-dark');
        }
    }
}
// [EOF]