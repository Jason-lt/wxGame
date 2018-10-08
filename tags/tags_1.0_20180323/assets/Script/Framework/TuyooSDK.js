/**
 * @author zhaoliang
 * @date 1.28
 * 
 * 全局对象
 * 系统信息
 * 包括clientId，loginUrl等
 */
console.log("TuyooSDK loaded");
ty.TuyooSDK = {

    SESSION_KEY: 'TU_SESSION_STORAGE',

    login: function() {
        ty.TuyooSDK.getSystemType();
        // 先进行测试
        ty.TuyooSDK.wechatLogin();
        return;

        wx.checkSession({
            success: function() {
                // session未过期，并且在本生命周期内一直有效
                ty.TuyooSDK.loginTuyooWith3rdSession();
            },

            fail: function() {
                ty.TuyooSDK.wechatLogin();
            },
        });
    },

    // 微信登录
    wechatLogin: function() {
        wx.login({
            success: function(params) {
                hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                if (params.code) {
                    var code = params.code;
                    // code = '021LC5Lz1LoT4e0X83Kz1hr5Lz1LC5L1';//来宾00c0WlUCv  10192
                    // code = '0016yzDS0C1d3X1pVQBS0gOvDS06yzDB';//来宾00c8PjflJ 10200  模拟器
                    // code = '061ATtL10NatnF1b42L10ScUL10ATtLQ';//来宾00ccnRx** 10204  手机
                    // code = '011gkXRs0fV25f1HGiSs08sERs0gkXRz';//来宾00d6efoPq 10214
                    // code = '061U3h6512XTNM102K551esX551U3h6y';//来宾00d7LvyoI 10215
                    // code = '0610kpGZ0mFKBZ1As7IZ0i06GZ00kpG6';//来宾00d8FIaRB 10216
                    // code = '061MEpsM03zUo32dcTqM0SqmsM0MEps2';//01e3NUsOJ 10483
                    // code = '013xzueF1B3cl00bOxfF1E5ReF1xzue9';//来宾0247**CSe 10583 iPhone X
                    // code = '0033pbw20WCiAC1Cqmv20VUaw203pbwu';//来宾0248VpUWw 10584
                    // ty.TuyooSDK.loginTuyooWithCode(code);
                    code = '021cvMAI1jSls80tCpAI1HBsAI1cvMAF';//来宾01baGt**F 10442 我的
                    // code = '001OC2bL0m00I62ZYKbL0eV5bL0OC2bo';//白龙 10459
                    // code = '081cKO2j2Po5MI0PhQ2j2WV73j2cKO22';//杨翠红 10468

                    wx.getSetting({
                        success(res) {
                            if (!res.authSetting['scope.userInfo']) {
                                wx.authorize({
                                    scope : "scope.userInfo",
                                    success : function () {
                                        ty.TuyooSDK.loginTuyooWithCode(code);
                                    },
                                    fail:function () {
                                        hall.MsgBoxManager.showToast({title : "请授权!"});
                                    },
                                    complete:function () {

                                    }
                                });
                            }
                            else{
                                ty.TuyooSDK.loginTuyooWithCode(code);
                            }
                        }
                    })

                }
            },

            fail: function(params) {
                hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
            },

            complete: function(params) {

            },
        });
    },
    shareWithInformation : function (titleString,imagUrl) {
        wx.shareAppMessage({
            title: titleString,
            imageUrl : imagUrl,
            // query : 'key1=val1&key2=val2',
            success : function (shareTickets,groupMsgInfos) {
                hall.LOGD(null, "+++++++++++++++++"+shareTickets+"+++++++++++++++++"+groupMsgInfos);
            },
            fail : function (ssss) {
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function (ssss) {
                // console.log(JSON.stringify(arguments));
            },
        });
    },

    // 微信不需要重新授权，使用
    loginTuyooWith3rdSession: function() {
        wx.getStorage({
            key: ty.TuyooSDK.SESSION_KEY,
            success: function(params) {
                if (!params.data) {
                    ty.TuyooSDK.wechatLogin();
                    return;
                };

                // 微信授权成功后使用code登录途游服务器
                wx.request({
                    url: ty.SystemInfo.loginUrl + 'open/v3/user/processSnsIdNew',
                    data: {
                        snsId: params.data,
                        deviceName: 'wechatGame',
                        clientId: ty.SystemInfo.clientId,
                        appId: ty.SystemInfo.appId
                    },

                    success: function(params) {
                        hall.LOGD(null, 'tuyoo login success, params:' + JSON.stringify(params));
                    },

                    fail: function(params) {
                        hall.LOGD(null, 'tuyoo login fail, params:' + JSON.stringify(params));
                    },

                    complete: function(params) {

                    },
                });
            },
            fail: function(params) {
                ty.TuyooSDK.wechatLogin();
            },
            complete:function(params) {

            }
        });
    },

    // 微信授权成功后，使用
    /* {
        "data": {
            "result": {
                "code": 0,
                "userId": 10116,
                "exception_report": 0,
                "userType": 4,
                "authInfo": "{\"authcode\": \"eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==\", \"account\": \"\", \"uid\": 10116, \"usercode\": \"\"}",
                "tcpsrv": {
                    "ip": "192.168.10.88",
                    "port": 8041
                },
                "isCreate": 1,
                "changePwdCount": 0,
                "360.vip": 0,
                "logclient": {
                    "loguploadurl": "",
                    "logreporturl": ""
                },
                "userPwd": "ty817142",
                "purl": "http://ddz.image.tuyoo.com/avatar/head_female_0.png",
                "snsId": "wxapp:071Nehqt0Z4XEe1jN6qt007Cqt0Nehqz",
                "userEmail": "",
                "connectTimeOut": 35,
                "appId": 9999,
                "heartBeat": 6,
                "userName": "来宾0074AibsT",
                "mobile": "",
                "token": "cce362d6-68a8-485e-b137-86ae6828e07a",
                "authorCode": "eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==",
                "log_report": 0,
                "showAd": 1
            }
        },
        "header": {
            "Server": "nginx/1.4.1",
            "Date": "Mon, 29 Jan 2018 06:13:12 GMT",
            "Content-Type": "application/json;charset=UTF-8",
            "Transfer-Encoding": "chunked",
            "Connection": "keep-alive",
            "Content-Encoding": "gzip"
        },
        "statusCode": 200,
        "errMsg": "request:ok"
    }
    */
    loginTuyooWithCode: function(code) {
        // 微信授权成功后使用code登录途游服务器
        wx.request({
            url: ty.SystemInfo.loginUrl + 'open/v6/user/LoginBySnsIdNoVerify',
            data: {
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                snsId: 'wxapp:' + code
            },

            success: function(params) {
                hall.LOGD(null, 'tuyoo login success, params:' + JSON.stringify(params));
                var checkData = params.data;
                if (checkData.error && checkData.error.code == 1){
                    console.log('tuyoo login fail...');
                    return;
                }
                // 保存用户名/用户ID/用户头像
                var result = checkData.result;
                ty.UserInfo.userId = result.userId;
                ty.UserInfo.userName = result.userName;
                ty.UserInfo.userPic = result.purl;
                ty.UserInfo.authorCode = result.authorCode;
                hall.LOGD(null, 'userId:' + ty.UserInfo.userId + ' userName:' + ty.UserInfo.userName + ' userPic:' + ty.UserInfo.userPic);

                var logicScene = cc.director.getScene();
                var no = logicScene.children[0];
                var window = no.getComponent("Ddz");
                window.testWithString(ty.UserInfo.userId+"");

                var token = result.token;
                hall.LOGD(null, 'token:' + token);
                wx.setStorage({
                    key: ty.TuyooSDK.SESSION_KEY,
                    data: token
                });

                // 发送登录成功事件
                ty.NotificationCenter.trigger(ty.EventType.MSG_LOGIN_SUCCESS);

                var ip = result.tcpsrv.ip;
                var port = result.tcpsrv.port;
                hall.LOGD(null, 'ip:' + ip + ' port:' + port);
                var webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                hall.LOGD(null, 'webSocketUrl:' + webSocketUrl);
                ty.SystemInfo.webSocketUrl = webSocketUrl;
                
                // 解析SDK登录返回，userId/tcpsrv信息，根据tcpsrv信息初始化长连接模块
                ty.TCP.connect(ty.SystemInfo.webSocketUrl);
            },

            fail: function(params) {
                hall.LOGD(null, 'tuyoo login fail, params:' + JSON.stringify(params));
            },

            complete: function(params) {

            },
        });
    },
    getSystemType : function () {
        // {
        // 	"0":{
        // 	"errMsg":"getSystemInfo:ok",
        // 		"model":"iPhone X",
        // 		"pixelRatio":3,
        // 		"windowWidth":375,
        // 		"windowHeight":812,
        // 		"system":"iOS 10.0.1",
        // 		"language":"zh_CN",
        // 		"version":"6.6.3",
        // 		"batteryLevel":100,
        // 		"screenWidth":375,
        // 		"screenHeight":812,
        // 		"SDKVersion":"1.8.0",
        // 		"brand":"devtools",
        // 		"fontSizeSetting":16,
        // 		"statusbarHeight":44,
        // 		"platform":"devtools"
        // }
        // }
        wx.getSystemInfo({
            success : function (result) {
                var model = result.model;
                var isiPhone = model.indexOf("iPhone") >= 0;
                var windowHeight = result.windowHeight;
                var resultType = 0;
                if (isiPhone){
                    if(windowHeight == 812){   //iPhoneX
                        resultType = 2;
                    }else {  //其他iPhone
                        resultType = 1;
                    }
                }else { //cc.sys.OS_ANDROID
                    resultType = 3;
                }
                ty.UserInfo.systemType = resultType;
            },
            fail : function () {
            },
            complete : function () {
            },
        });
    },
};

wx.onShow(function () {
    hall.onHide = false;
    var date = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.ONHIDE_DATE);
    var date2 = new Date().getTime();
    var timeGap = date2-date;
    if(timeGap < 60000){
        ty.NotificationCenter.trigger(ddz.EventType.CHANGE_TO_SHOW_FROM_HODE,timeGap);
    }
    ddz.AudioHelper.rePlayMusic();
    ddz.LOGD("wx.onShow","======================================wx.onShow"+"---"+date+"---"+date2+"---"+timeGap);
});

wx.onHide(function () {
    hall.onHide = true;
    var date = new Date().getTime();
    hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.ONHIDE_DATE, date);
    ty.NotificationCenter.trigger(ddz.EventType.GAME_HIDE);
    ddz.LOGD("wx.onHide","======================================wx.onHide"+"---"+date);
    ty.TCP.close();
});
