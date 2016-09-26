/**
 * Created by leonn on 2016/9/26.
 */
/*
 * 需求：
 * option 是参数的对象，以下是各个配置项
 * 1. option.type 传输方式：GET / POST，默认 GET
 * 2. option.url  默认是当前 URL
 * 3. option.async  是否异步，默认 T
 * 4. option.data 传服务器端的数据
 * 5. option.success 成功后的回调函数
 * 6. option.error 失败后的回调函数
 * */
var AJAXTools = {};
AJAXTools.ajax = function (option) {
    // 创建 XHR 对象
    function XHR() {
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        }
        catch (e) {
            /*在不同的IE版本下初始  ActiveXObject  需要传入的标识*/
            var IEXHRVers = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < IEXHRVers.length; i++) {
                try {
                    xhr = new ActiveXObject(IEXHRVers[i]);
                }
                catch (e) {
                    continue;
                }
            }
        }
        return xhr;
    }

    var xhr = XHR();
    // 校验传入的数据，如果为 null 就停止方法运行
    if (option == null || typeof option != "object") return false;
    // 初始化数据
    var type = option.type || "get";
    var url = option.url || window.location.href;
    var async = option.async || true;
    var data = option.data || null;
    var dataStr = "";
    // 需要对 data 处理，不管是 GET 还是 POST 都需要解析成 ?a=1&b=2 形式
    // 遍历 data 数据
    for (var key in data) {
        dataStr += key;
        dataStr += "=";
        dataStr += data[key];
        dataStr += "&";
    }
    // 去除最后一个 &
    dataStr = dataStr.slice(0, -1);
    // 由于 GET 与 POST 传递数据方式不同，分开处理
    type = type.toLowerCase();
    if (type === "post") {
        xhr.open(type, url, async);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(dataStr);
    } else {
        url += "?" + dataStr;
        xhr.open(type, url, async);
        xhr.send(null);
    }
    // 响应
    xhr.onreadystatechange = function () {
        // 用于获取服务器传递的数据
        var data;
        // 成功
        if (xhr.status == 200 && xhr.readyState == 4) {
            var conType = xhr.getResponseHeader("Content-Type");
            // 判断服务器传递的数据类型
            if (conType.indexOf("xml") > -1) {
                data = xhr.responseXML;
            } else if (conType.indexOf("json") > -1) {
                data = JSON.parse(xhr.responseText);
            } else {
                data = xhr.responseText;
            }
            // 回调函数
            if (typeof option.success === "function") {
                option.success(data);
            }
        }
        // 五个阶段中，每一个阶段都有自己的状态码，最后的阶段表示结束了一次请求
        else if (xhr.readyState == 4) {
            // 回调函数
            if (typeof option.error === "function") {
                option.error();
            }
        }
    };
};
