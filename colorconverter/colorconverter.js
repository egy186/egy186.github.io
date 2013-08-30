/*!
 * colorconverter.js Version 0.1.0
 * github.com/egy186/colorConverter
 *
 * Copyright (c) 2013 egy186
 * Released under the MIT License.
 */

// select tab
var currentTab = 'rgb';
window.addEventListener('load', function () {
    if (location.hash) {
        var hash = location.hash.slice(1);
    } else {
        var hash = 'RGB';
    }
    history.replaceState({ code: hash }, hash, null);
    changeTab(hash.toLowerCase());
}, false);
document.getElementById('nav-tab').addEventListener('click', function (evt) {
    if (evt.target.tagName.toLowerCase() == 'a') {
        evt.target.blur();
        evt.preventDefault();
        var clicked = evt.target.getAttribute('href').slice(1);
        //alert(clicked.toLowerCase());
        if (clicked.toLowerCase() != currentTab) {
            history.pushState({ code: clicked }, clicked, '#' + clicked);
        }
        changeTab(clicked.toLowerCase());
    }
}, false);
window.addEventListener('popstate', function (evt) {
    //if (evt.state.code != null) {
    var clicked = evt.state.code;
    //} else if (location.hash) {
    //var clicked = location.hash.slice(1);
    //} else {
    //var clicked = 'RGB';
    //}
    changeTab(clicked.toLowerCase());
}, false);
function changeTab(newTab) {
    var formOutput = document.getElementById('form-output'),
        formOutputP = formOutput.getElementsByTagName('p'),
        navTab = document.getElementById('nav-tab').getElementsByTagName('a'),
        tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'],
        index = tabList.indexOf(newTab),
        temp, i, j;
    if (index == -1) {
        newTab = 'rgb';
        index = 0;
    }
    // enable alpha?
    if (newTab != 'rgba' && newTab != 'hsla') {
        document.getElementById('form-input')['range-rgb-a'].value = 1;
        main('range-rgb-a', 1);
    }
        /*var rgbaArr = document.getElementById('form-output')['output-rgba'].value.replace(/[rgba()\s]/g, '').split(',');
    if (newTab == 'rgba' || newTab == 'hsla') {
        document.getElementById('layer-bgcolor').style.backgroundColor = 'rgba(' + rgbaArr[0] + ', ' + rgbaArr[1] + ', ' + rgbaArr[2] + ', ' + rgbaArr[3] + ')';
        setThemeDependOnBgColor(rgbaArr[0], rgbaArr[1], rgbaArr[2], rgbaArr[3]);
    } else {
        document.getElementById('layer-bgcolor').style.backgroundColor = 'rgba(' + rgbaArr[0] + ', ' + rgbaArr[1] + ', ' + rgbaArr[2] + ', 1)';
        setThemeDependOnBgColor(rgbaArr[0], rgbaArr[1], rgbaArr[2], 1);
    }
    delete rgbaArr;*/
    // nav-tav
    navTab.item(tabList.indexOf(currentTab)).removeAttribute('class');
    navTab.item(index).setAttribute('class', 'current');
    // form-input
    // init
    for (i = 0; i < tabList.length; i++) {
        temp = document.getElementsByClassName(tabList[i]);
        for (j = 0; j < temp.length; j++) {
            temp.item(j).style.display = 'none';
        }
    }
    // select
    temp = document.getElementsByClassName(newTab);
    for (i = 0; i < temp.length; i++) {
        temp.item(i).style.display = 'block';
    }
    if (newTab == 'hsl' || newTab == 'hsla') {
        document.getElementById('slider-rgba').style.display = 'none';
        document.getElementById('slider-hsla').style.display = 'block';
    } else {
        document.getElementById('slider-rgba').style.display = 'block';
        document.getElementById('slider-hsla').style.display = 'none';
    }

    // form-output
    switch (newTab) {
        case 'rgb':
            var visibleNames = ['output-hsl', 'output-hex'];
            break;
        case 'rgba':
            var visibleNames = ['output-hsla'];
            break;
        case 'hsl':
            var visibleNames = ['output-rgb', 'output-hex'];
            break;
        case 'hsla':
            var visibleNames = ['output-rgba'];
            break;
        case 'hex':
            var visibleNames = ['output-rgb', 'output-hsl'];
            break;
    }
    // init
    for (i = 0; i < formOutputP.length; i++) {
        formOutputP.item(i).style.display = 'none';
    }
    // select
    for (i = 0; i < visibleNames.length; i++) {
        document.getElementById(visibleNames[i]).style.display = 'block';
    }

    // return
    currentTab = newTab;
}

// set first color
window.addEventListener('load', function () {
    var rundColor,
        //query = queryParam.get();
        query = false;
    if (query) {
        if (query.r >= 0 && query.r <= 255 && query.g >= 0 && query.g <= 255 && query.b >= 0 && query.b <= 255) {
            rundColor = 'rgb(' + query.r + ', ' + query.g + ', ' + query.b + ')';
        }
    } else {
        rundColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    }
    document.getElementById('form-input')['text-rgb'].value = rundColor;
    main('text-rgb', rundColor);
}, false);

// addEvent
document.getElementById('form-input').addEventListener('change', function (evt) {
    main(evt.target.name, evt.target.value);
}, false);
document.getElementById('form-input').addEventListener('keyup', function (evt) {
    main(evt.target.name, evt.target.value);
}, false);
document.getElementById('form-input').addEventListener('input', function (evt) {
    main(evt.target.name, evt.target.value);
}, false);
var formOutputInputs = document.getElementById('form-output').getElementsByTagName('input');
for (var i = 0; i < formOutputInputs.length; i++) {
    formOutputInputs.item(i).addEventListener('focus', function (evt) {
        evt.target.select();
    }, false);
}

// main
function main(changedValueName, newValue) {
    var formInput = document.getElementById('form-input'),
        formOutput = document.getElementById('form-output'),
        layerBgColor = document.getElementById('layer-bgcolor');
    var rgbaObj = getOtherValue(changedValueName, newValue),
        hslArr = rgb2hsl(rgbaObj.r, rgbaObj.g, rgbaObj.b);
    var rgbStr = 'rgb(' + rgbaObj.r + ', ' + rgbaObj.g + ', ' + rgbaObj.b + ')',
        rgbaStr = 'rgba(' + rgbaObj.r + ', ' + rgbaObj.g + ', ' + rgbaObj.b + ', ' + rgbaObj.a + ')',
        hslStr = 'hsl(' + hslArr[0] + ', ' + hslArr[1] + '%, ' + hslArr[2] + '%)',
        hslaStr = 'hsla(' + hslArr[0] + ', ' + hslArr[1] + '%, ' + hslArr[2] + '%, ' + rgbaObj.a + ')',
        hexStr = rgb2hex(rgbaObj.r, rgbaObj.g, rgbaObj.b);
    // set values
    // can i use function?
    if (changedValueName != 'text-rgb') {
        formInput['text-rgb'].value = rgbStr;
    }
    if (changedValueName != 'text-rgba') {
        formInput['text-rgba'].value = rgbaStr;
    }
    if (changedValueName != 'text-hsl') {
        formInput['text-hsl'].value = hslStr;
    }
    if (changedValueName != 'text-hsla') {
        formInput['text-hsla'].value = hslaStr;
    }
    if (changedValueName != 'text-hex') {
        formInput['text-hex'].value = hexStr;
    }
    if (changedValueName != 'range-r') {
        formInput['range-r'].value = rgbaObj.r;
    }
    if (changedValueName != 'range-g') {
        formInput['range-g'].value = rgbaObj.g;
    }
    if (changedValueName != 'range-b') {
        formInput['range-b'].value = rgbaObj.b;
    }
    if (changedValueName != 'num-r') {
        formInput['num-r'].value = rgbaObj.r;
    }
    if (changedValueName != 'num-g') {
        formInput['num-g'].value = rgbaObj.g;
    }
    if (changedValueName != 'num-b') {
        formInput['num-b'].value = rgbaObj.b;
    }
    if (changedValueName != 'num16-r') {
        formInput['num16-r'].value = ('0' + rgbaObj.r.toString(16)).substr(-2);
    }
    if (changedValueName != 'num16-g') {
        formInput['num16-g'].value = ('0' + rgbaObj.g.toString(16)).substr(-2);
    }
    if (changedValueName != 'num16-b') {
        formInput['num16-b'].value = ('0' + rgbaObj.b.toString(16)).substr(-2);
    }
    if (changedValueName != 'range-h') {
        formInput['range-h'].value = hslArr[0];
    }
    if (changedValueName != 'range-s') {
        formInput['range-s'].value = hslArr[1];
    }
    if (changedValueName != 'range-l') {
        formInput['range-l'].value = hslArr[2];
    }
    if (changedValueName != 'num-h') {
        formInput['num-h'].value = hslArr[0];
    }
    if (changedValueName != 'num-s') {
        formInput['num-s'].value = hslArr[1];
    }
    if (changedValueName != 'num-l') {
        formInput['num-l'].value = hslArr[2];
    }
    if (changedValueName != 'range-rgb-a') {
        formInput['range-rgb-a'].value = rgbaObj.a;
    }
    if (changedValueName != 'num-rgb-a') {
        formInput['num-rgb-a'].value = rgbaObj.a;
    }
    if (changedValueName != 'range-hsl-a') {
        formInput['range-hsl-a'].value = rgbaObj.a;
    }
    if (changedValueName != 'num-hsl-a') {
        formInput['num-hsl-a'].value = rgbaObj.a;
    }
    // set values to output
    formOutput['output-rgb'].value = rgbStr;
    formOutput['output-rgba'].value = rgbaStr;
    formOutput['output-hsl'].value = hslStr;
    formOutput['output-hsla'].value = hslaStr;
    formOutput['output-hex'].value = hexStr;
    // set CSS
    setThemeDependOnBgColor(rgbaObj.r, rgbaObj.g, rgbaObj.b, rgbaObj.a);
    layerBgColor.style.backgroundColor = rgbaStr;
}

function getOtherValue(changedValueName, newValue) {
    // Return {r: 0 to 255, g: 0 to 255, b 0 to 255, a: 0 to 1}
    var formInput = document.getElementById('form-input'),
        rgbaObj = {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        }, rgbaObjKeys = Object.keys(rgbaObj),
        tempArr = [];
    // set rgbaObj
    if (changedValueName == 'text-hex') {
        tempArr = hex2rgb(newValue);
        rgbaObj.r = tempArr[0];
        rgbaObj.g = tempArr[1];
        rgbaObj.b = tempArr[2];
    } else if (/-r|-g|-b|-rgb/.test(changedValueName)) {
        switch (changedValueName) {
            case 'text-rgba':
            case 'text-rgb':
                newValue = newValue.replace(/[rgba();\s]/g, '').split(/,/);
                switch (newValue.length) {
                    case 4:
                        rgbaObj.a = newValue[3];
                    case 3:
                        rgbaObj.b = newValue[2];
                    case 2:
                        rgbaObj.g = newValue[1];
                    case 1:
                        rgbaObj.r = newValue[0];
                    case 0:
                        break;
                    default:
                        //window.alert('Invalid Value\nRGB or RGBa: '+ newValue);
                        return;
                }
                break;
            case 'num16-r': // hex
                newValue = parseInt(newValue, 16);
            case 'range-r':
            case 'num-r':
                rgbaObj.r = newValue;
                rgbaObj.g = formInput['range-g'].value;
                rgbaObj.b = formInput['range-b'].value;
                rgbaObj.a = formInput['range-rgb-a'].value;
                break;
            case 'num16-g': // hex
                newValue = parseInt(newValue, 16);
            case 'range-g':
            case 'num-g':
                rgbaObj.r = formInput['range-r'].value;
                rgbaObj.g = newValue;
                rgbaObj.b = formInput['range-b'].value;
                rgbaObj.a = formInput['range-rgb-a'].value;
                break;
            case 'num16-b': // hex
                newValue = parseInt(newValue, 16);
            case 'range-b':
            case 'num-b':
                rgbaObj.r = formInput['range-r'].value;
                rgbaObj.g = formInput['range-g'].value;
                rgbaObj.b = newValue;
                rgbaObj.a = formInput['range-rgb-a'].value;
                break;
            case 'range-rgb-a':
            case 'num-rgb-a':
                rgbaObj.r = formInput['range-r'].value;
                rgbaObj.g = formInput['range-g'].value;
                rgbaObj.b = formInput['range-b'].value;
                rgbaObj.a = newValue;
                break;
            default:
                //window.alert('Internal Error\nchangedValueName: ' + changedValueName);
                return;
        }
    } else if (/-h|-s|-l|-hsl/.test(changedValueName)) {
        switch (changedValueName) {
            case 'text-hsla':
            case 'text-hsl':
                newValue = newValue.replace(/[hsla();\s]/g, '').split(/,/);
                switch (newValue.length) {
                    case 4:
                        rgbaObj.a = newValue[3];
                    case 3:
                        tempArr[2] = newValue[2];
                    case 2:
                        tempArr[1] = newValue[1];
                    case 1:
                        tempArr[0] = newValue[0];
                    case 0:
                        break;
                    default:
                        //window.alert('Invalid Value\nHSL or HSLa: '+ newValue);
                        return;
                }
                break;
            case 'range-h':
            case 'num-h':
                tempArr[0] = newValue;
                tempArr[1] = formInput['range-s'].value;
                tempArr[2] = formInput['range-l'].value;
                rgbaObj.a = formInput['range-hsl-a'].value;
                break;
            case 'range-s':
            case 'num-s':
                tempArr[0] = formInput['range-h'].value;
                tempArr[1] = newValue;
                tempArr[2] = formInput['range-l'].value;
                rgbaObj.a = formInput['range-hsl-a'].value;
                break;
            case 'range-l':
            case 'num-l':
                tempArr[0] = formInput['range-h'].value;
                tempArr[1] = formInput['range-s'].value;
                tempArr[2] = newValue;
                rgbaObj.a = formInput['range-hsl-a'].value;
                break;
            case 'range-hsl-a':
            case 'num-hsl-a':
                tempArr[0] = formInput['range-h'].value;
                tempArr[1] = formInput['range-s'].value;
                tempArr[2] = formInput['range-l'].value;
                rgbaObj.a = newValue;
                break;
            default:
                //window.alert('Internal Error\nchangedValueName: ' + changedValueName);
                return;
        }
        tempArr = hsl2rgb(tempArr[0], tempArr[1], tempArr[2]);
        rgbaObj.r = tempArr[0];
        rgbaObj.g = tempArr[1];
        rgbaObj.b = tempArr[2];
        delete tempArr;
    } else {
        //window.alert('Internal Error\nchangedValueName: ' + changedValueName);
        return;
    }
    // regularization
    if (/%/.test(rgbaObj.r) || /%/.test(rgbaObj.g) || /%/.test(rgbaObj.b)) {
        for (var i = 0; i < 3; i++) {
            rgbaObj[rgbaObjKeys[i]] = parseFloat(rgbaObj[rgbaObjKeys[i]].replace(/%$/, '')) * 255 / 100;
        }
    }
    for (var i = 0; i < 3; i++) {
        rgbaObj[rgbaObjKeys[i]] = Math.round(parseFloat(rgbaObj[rgbaObjKeys[i]]));
        if (isNaN(rgbaObj[rgbaObjKeys[i]]) || rgbaObj[rgbaObjKeys[i]] < 0 || rgbaObj[rgbaObjKeys[i]] > 255) {
            //window.alert('Invalid Value\nrgbaObjKeys[i]: '+ rgbaObj[rgbaObjKeys[i]]);
            return;
        }
    }
    rgbaObj.a = parseFloat(rgbaObj.a);
    if (isNaN(rgbaObj.a) || rgbaObj.a < 0 || rgbaObj.a > 1) {
        //window.alert('Invalid Value\nRGBa Array: '+ RGBaArr);
        return;
    }
    // return
    return rgbaObj;
}

function setThemeDependOnBgColor(r, g, b, a) {
    // Param: background-color
    var layerBgColor=document.getElementById('layer-bgcolor')
    if (judgeTextColor(r, g, b, a) == 0) {
        layerBgColor.setAttribute('class', 'theme-light');
    } else {
        layerBgColor.setAttribute('class', 'theme-dark');
    }
}
// utils
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

function judgeTextColor(r, g, b, a) {
    // Param: background r, g, b, a. r, g and b are from 0 to 255.
    // Return: textColor. 1 means white, 0 means black.
    if (0.298912 * r + 0.586611 * g + 0.114478 * b < 128 && a > 0.5) {
        return 1;
    } else {
        return 0;
    }
}