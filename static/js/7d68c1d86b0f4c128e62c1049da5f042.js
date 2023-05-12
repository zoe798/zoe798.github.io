var requestId = getURLParameter("_rid");

if (!requestId) {
    var requestId = getCookie('__rid');

    if(!requestId){
        requestId = "";
        setCookie('__rid', requestId);
    }
    
} else {
    setCookie('__rid', requestId);
}


_yuri_track("init", "EQEGGQpPXUYaHRMdVwYaCAsQHxBXERMQVhQCAFYMBxsQKgIAARAe");
_yuri_track("PageView");

var url=window.location.href;

console.log(url);

if(url.indexOf("checkouts") >= 0 ) {
    _yuri_track("AddToCard");
}

if(url.indexOf("orders") >= 0)
{
    _yuri_track("Purchase");
}

if(url.indexOf("&a=pay&order_no") >= 0)
{
    _yuri_track("Purchase");
}

if(url.indexOf("order_info.html") >= 0)
{
    _yuri_track("Purchase");
}

function _yuri_track_rid(event,rid){
    setCookie('__rid', rid);
    _yuri_track(event);
}


function _yuri_track(event, value) {
    console.log(event);
    if (event == 'init') {
        setCookie("__api", value);
    } else {
        var requestId = getCookie('__rid');
        ajax({ requestId: requestId, event: event, value: value }, function (json)  {
            if (json.pixel != ''){
                
                if(json.domain != '')
                {
                    var iframe = document.createElement('iframe')
                    iframe.display = "none"
                    iframe.src = "https://" + json.domain + "/?_p=" + json.pixel + "&_step=" + json.event + "&_value=" + json.value + "&noscript=1"
                    document.body.appendChild(iframe);
                }
                
                var img = document.createElement('img')
                    img.height=1;
                    img.width=1;
                    img.display = "none"
                    if(json.value){
                        img.src = "https://www.facebook.com/tr?id=" + json.pixel + "&ev=" + json.event +"&cd[value]=" + json.value + "&cd[currency]=USD&noscript=1"
                    }else{
                        img.src = "https://www.facebook.com/tr?id=" + json.pixel + "&ev=" + json.event +"&noscript=1"
                    }    
                    document.body.append(img)

                
            }
        }, function () { })
    }
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30);
    document.cookie = name + "=" + encodeURI(value) + ";path=/;expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}

function enc(data, key) {
    var res = '';
    for (var i = 0; i < data.length; i++) {
        res += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return res;
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.*?)(&|$)').exec(location.search) || [, null])[1] || ''
    )
}


function ajax(postData, success, fail) {
    var __api = getCookie('__api');
    var url = enc(atob(__api), 'yuri');
    var xhr;
    if (window.XMLHttpRequest) {// IE7+, Firefox, Chrome, Opera, Safari 代码
        xhr = new XMLHttpRequest();
    }
    else {// IE6, IE5 代码
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.withCredentials = true;
    xhr.crossDomain = true,
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    var data = xhr.responseText;
                    var json = JSON.parse(data);
                    if (json.status == 'success') {
                        success(json);
                    } else {
                        fail();
                    }
                }
            }
        }
    xhr.send("_ajax=" + btoa(enc(JSON.stringify(postData), 'yuri')));
}