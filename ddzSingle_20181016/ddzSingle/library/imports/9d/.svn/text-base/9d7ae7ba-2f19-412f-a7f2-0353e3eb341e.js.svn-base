"use strict";
cc._RF.push(module, '9d7aee6LxlBL6fyA1Pj6zQe', 'HttpUtil');
// Script/Framework/HttpUtil.js

'use strict';

/**
 * Created by xujing on 2018/4/8.
 * http请求工具
 */
ty.HttpUtil = {

    /**
     * 发起http请求
     * @param cfgObj 请求参数
     * @param httpType 请求方式 POST,GET
     * @param successCallBack 成功后回调
     * @param failCallBack 失败后回调
     */
    httpPost: function httpPost(cfgObj, httpType, successCallBack, failCallBack) {
        hall.LOGD('ty.HttpUtil.httpPost', 'res =  ...');
        wx.request({
            url: cfgObj.url,
            data: cfgObj.postData,
            header: cfgObj.header,
            method: httpType,
            dataType: 'json',
            success: function success(res) {
                hall.LOGD('ty.HttpUtil.httpPost', 'res =  ' + JSON.stringify(res));
                if (res.statusCode == 200) {
                    // hall.LOGW('ty.HttpUtil.httpPost', '======res.statusCode200============' + cfgObj.url+"=="+JSON.stringify(arguments));
                    //正常连接{"/api/bilog5/clientlog": "ok"}
                    if (res.data && res.data.hasOwnProperty('/api/bilog5/clientlog') && res.data['/api/bilog5/clientlog'] == "ok") {
                        hall.LOGD('ty.HttpUtil.httpPost', 'post success! ');
                    }
                    if (successCallBack) {
                        successCallBack(res);
                    }
                } else {
                    hall.LOGD('ty.HttpUtil.httpPost', 'statusCode:' + res.statusCode);
                }
            },
            fail: function fail(res) {
                hall.LOGD('ty.HttpUtil.httpPost', 'post error! ' + cfgObj.url);
                if (failCallBack) {
                    failCallBack(res);
                }
            },
            complete: function complete(res) {
                hall.LOGD('ty.HttpUtil.httpPost', 'post complete! ');
            }
        });
    },
    httpGet: function httpGet(cfgObj, successcb, failcb) {
        hall.LOGD('ty.HttpUtil.httpGet', 'url:' + cfgObj.url);
        wx.request({
            url: cfgObj.url,
            method: 'GET',
            success: function success(res) {
                if (res.statusCode == 200) {
                    hall.LOGD('ty.HttpUtil.httpGet', 'res:' + JSON.stringify(res.data));
                    if (successcb) {
                        successcb(res.data);
                    }
                } else {
                    hall.LOGD('ty.HttpUtil.httpGet', 'statusCode:' + res.statusCode);
                }
            },
            fail: function fail(res) {
                hall.LOGD('ty.HttpUtil.httpGet', 'post error! ' + cfgObj.url);
                if (failcb) {
                    failcb(res);
                }
            }
        });
    }
};

cc._RF.pop();