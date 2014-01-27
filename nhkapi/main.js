function egyHNKpgAPI() {
    this.baseUrl = 'http://api.nhk.or.jp/v1/pg/';
    this.area = Number();
    this.service = String();
    this.genre = String();
    this.date = String();
    this.id = Number();
    this.apikey = String();
}

egyHNKpgAPI.prototype.toString = function (method) {
    var param = 'key=' + this.apikey;
    switch (method) {
        case 'pg-list':
            return this.baseUrl + 'list/' + this.area + '/' + this.service + '/' + this.date + '.json?' + param;
        case 'pg-genre':
            return this.baseUrl + 'genre/' + this.area + '/' + this.service + '/' +this.genre+'/' + this.date + '.json?' + param;
        case 'pg-info':
            return this.baseUrl + 'info/' + this.area + '/' + this.service + '/' + this.id + '.json?' + param;
        case 'pg-now':
            return this.baseUrl + 'now/' + this.area + '/' + this.service + '.json?' + param;
    }
}

addEventListener('load', init, false);

var nhkPgApi = new egyHNKpgAPI();

function init() {
    // init method
    var methodSelect = document.getElementById('select');
    var methodSelectChild = methodSelect.getElementsByTagName('option');
    // add event method
    methodSelect.addEventListener('change', function () {
        var selected = methodSelectChild.item(methodSelect.selectedIndex);
        if (selected.value) {
            apiSelect(selected.value);
            console.log(selected.value);
        }
    }, false);

    // init date
    var today = (function () {
        var date = new Date();
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();
        mm = mm[1] ? mm : '0' + mm[0];
        dd = dd[1] ? dd : '0' + dd[0];
        return yyyy + '-' + mm + '-' + dd;
    })();
    var tomorrow = (function () {
        var date = new Date();
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = (date.getDate() + 1).toString(); // next day
        mm = mm[1] ? mm : '0' + mm[0];
        dd = dd[1] ? dd : '0' + dd[0];
        return yyyy + '-' + mm + '-' + dd;
    })();
    var tagOptC = document.createElement('option');
    var tagOptT = document.createElement('option');
    var parentElem = document.getElementById('param-date');
    while (parentElem.firstChild) {
        parentElem.removeChild(parentElem.firstChild);
    }
    tagOptC.textContent = today + ': 今日';
    tagOptC.value = today;
    parentElem.appendChild(tagOptC);
    tagOptT.textContent = tomorrow + ': 明日';
    tagOptT.value = tomorrow;
    parentElem.appendChild(tagOptT);

    // add event params
    document.getElementById('parameters').addEventListener('change', paramChange, false);
    document.getElementById('parameters').addEventListener('input', paramChange, false);
    // add event get
    document.getElementById('api-get').addEventListener('click', getNhkApi, false);

    // init display
    apiSelect(methodSelectChild.item(methodSelect.selectedIndex).value);
    var selectList = ['area', 'service', 'genre', 'date'];
    for (var i = 0; i < selectList.length; i++) {
        var temp = document.getElementById('param-'+selectList[i]);
        var tempNode = temp.getElementsByTagName('option');
        var selected = tempNode.item(temp.selectedIndex);
        if (selected.value) {
            nhkPgApi[selectList[i]] = selected.value;
        }
    }
    var paramVal = document.getElementById('param-id').value;
    if (paramVal) {
        nhkPgApi['id'] = paramVal;
    }
    paramVal = document.getElementById('param-apikey').value;
    if (paramVal) {
        nhkPgApi['apikey'] = paramVal;
    }
    document.getElementById('pg-url').value = nhkPgApi.toString(methodSelectChild.item(methodSelect.selectedIndex).value);
}

function paramChange(evt) {
    var methodSelect = document.getElementById('select');
    var targetNode = evt.target;
    var key = targetNode.getAttribute('id').replace(/^.*-/, '');
    if (targetNode.tagName.toLowerCase() == 'select') {
        var targetChild = targetNode.getElementsByTagName('option');
        var selected = targetChild.item(targetNode.selectedIndex);
        if (selected.value) {
            nhkPgApi[key] = selected.value;
        }
    } else {
        switch (key) {
            case 'id':
                if (targetNode.value.length == 13) {
                    nhkPgApi[key] = targetNode.value;
                }
                break;
            case 'apikey':
                if (targetNode.value.length == 32) {
                    nhkPgApi[key] = targetNode.value;
                }
                break;
        }
    }
    document.getElementById('pg-url').value = nhkPgApi.toString(methodSelect.getElementsByTagName('option').item(methodSelect.selectedIndex).value);
}

function apiSelect(method) {
    var MethodElems = document.getElementById('parameters').getElementsByTagName('p');
    for (var i = 0; i < MethodElems.length; i++) {
        MethodElems[i].style.display = 'none';
    }
    var newMethod = document.getElementsByClassName(method);
    for (var i = 0; i < newMethod.length; i++) {
        newMethod[i].style.display = 'block';
    }
    document.getElementById('pg-url').value = nhkPgApi.toString(method);
}

function getNhkApi(evt) {
    evt.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', document.getElementById('pg-url').value, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            document.getElementById('api-result-status').textContent = xhr.status + ' ' + xhr.statusText;
            xhrCallback(xhr.responseText);
        }
    };
    xhr.send();
}

function xhrCallback(response) {
    var resObj = JSON.parse(response);
    document.getElementById('api-result-raw').textContent = JSON.stringify(resObj, null, '    ');
}