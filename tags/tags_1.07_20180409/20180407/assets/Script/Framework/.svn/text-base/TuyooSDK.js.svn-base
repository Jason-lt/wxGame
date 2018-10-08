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
        // return;

        // wx.checkSession({
        //     success: function() {
        //         // session未过期，并且在本生命周期内一直有效
        //         ty.TuyooSDK.loginTuyooWith3rdSession();
        //     },
        //
        //     fail: function() {
        //         ty.TuyooSDK.wechatLogin();
        //     },
        // });
    },

    // 微信登录
    wechatLogin: function() {
        wx.login({
            success: function(params) {
                hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                if (params.code) {
                    var code = params.code;
                    var loginByCodeAndInfo = function (code) {
                        wx.getUserInfo({
                            success: function(res) {
                                ty.TuyooSDK.loginTuyooWithCode(code, res.userInfo);
                            }
                        });
                    };

                    wx.getSetting({
                        success:function(res) {
                            if (!res.authSetting['scope.userInfo']) {
                                wx.authorize({
                                    scope : "scope.userInfo",
                                    success : function () {
                                        loginByCodeAndInfo(code);
                                    },
                                    fail:function () {
                                        hall.MsgBoxManager.showToast({title : "请授权!"});
                                    },
                                    complete:function () {
                                    }
                                });
                            }
                            else{
                                loginByCodeAndInfo(code);
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
    shareToGetDiamond : function (tipsXXX,tipsN) {
        var rewardDes = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.MATCH_REWARD_DES, "20万元奖金");
        var titleA = ddz.GameWorld.shareMassageList.getdiamond;
        var imageA = ddz.GameWorld.shareImageList.getdiamond;
        ty.TuyooSDK.shareWithTitleArrayAndImageArray(titleA,imageA,rewardDes,tipsN);
    },
    shareWithTitleArrayAndImageArray : function (titleArray,imageArray,tipsXXX,tipsN) {
        var titleNumber = hall.GlobalFuncs.getRandomNumberBefore(titleArray.length);
        var imageNumber = hall.GlobalFuncs.getRandomNumberBefore(imageArray.length);
        ty.TuyooSDK.shareWithInformation(titleArray[titleNumber],imageArray[imageNumber],tipsXXX,tipsN);
    },
    shareWithInformation : function (titleString,imagUrl,tipsXXX,tipsN) {
        if(tipsXXX){
            titleString = titleString.replace("xxx",tipsXXX);
        }
        if(tipsN){
            titleString =titleString.replace("n",tipsN);
        }
        var query = "inviteCode="+ty.UserInfo.userId;
        wx.shareAppMessage({
            title: titleString,
            imageUrl : imagUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (shareTickets,groupMsgInfos) {
                if(query && query=="getReward=1"){
                    ddz.matchModel.shareToGetreward();
                }
                hall.LOGD(null, "shareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets)+"+++++++++++++++++"+groupMsgInfos);
            },
            fail : function () {
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
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
    loginTuyooWithCode: function(code, userInfo) {
        // 微信授权成功后使用code登录途游服务器
        wx.showShareMenu({
            withShareTicket: false
        });
        // wx.updateShareMenu({
        //     withShareTicket: true
        // });

        // var nickName = userInfo.nickName
        // var avatarUrl = userInfo.avatarUrl
        // var gender = userInfo.gender //性别 0：未知、1：男、2：女
        // var province = userInfo.province
        // var city = userInfo.city
        // var country = userInfo.country

        //咱们后端 0 是男 1 是女,要转换
        var gender = 0;
        if (userInfo.gender == 1){
            gender = 0;
        }
        else if (userInfo.gender == 2){
            gender = 1;
        }

        var local_uuid = hall.GlobalFuncs.getLocalUuid();
        hall.LOGD("local_uuid:",local_uuid);

        wx.request({
            url: ty.SystemInfo.loginUrl + 'open/v6/user/LoginBySnsIdNoVerify',
            data: {
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                snsId: 'wxapp:' + code,
                uuid : local_uuid,
                //以下为上传玩家的微信用户信息
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: gender
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
                var port = result.tcpsrv.wsport || result.tcpsrv.port; //优先使用wsport
                hall.LOGD(null, 'ip:' + ip + ' port:' + port);
                // var webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                var webSocketUrl = 'wss://' + ip + '/';
                // hall.LOGD(null, 'webSocketUrl:' + webSocketUrl);
                ty.SystemInfo.webSocketUrl = webSocketUrl;
                
                // 解析SDK登录返回，userId/tcpsrv信息，根据tcpsrv信息初始化长连接模块
                ty.TCP.connect(ty.SystemInfo.webSocketUrl);
                ty.TuyooSDK.getShareImage();
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

    getShareImage : function () {

        var tempCavas = wx.createCanvas();
        tempCavas.width = 360;
        tempCavas.height = 280;
        var context = tempCavas.getContext("2d");
        var image = wx.createImage();

        var imageArray = ddz.GameWorld.shareImageList.shareButton;
        var imageType = hall.GlobalFuncs.getRandomNumberBefore(imageArray.length);
        image.src = imageArray[imageType];

        var rewardDes = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.MATCH_REWARD_DES, "20万元奖金");
        var text = "闯七关平分"+rewardDes;

        image.onload = function () {
            context.drawImage(image,0,0);
            context.font="25px Arial";
            context.fillStyle="#ffffff";
            context.textAlign="center";
            context.fillText(text,180,105);
            var tempFilePath = tempCavas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: 360,
                height: 280,
                destWidth: 360,
                destHeight: 280
            });
            ty.SystemInfo.shareImagePath = tempFilePath;
            hall.LOGD(null, "onShareAppMessage++++++tempFilePath+++++++++++   "+tempFilePath);
        };
    }
};

wx.onShow(function (result) {
    // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
    hall.LOGE('', "++++++++onShow+++++++++"+JSON.stringify(result));
    hall.onHide = false;
    var date = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.ONHIDE_DATE);
    var date2 = new Date().getTime();
    var timeGap = date2-date;
    if(timeGap < 60000){
        ty.NotificationCenter.trigger(ddz.EventType.CHANGE_TO_SHOW_FROM_HODE,timeGap);
    }
    ddz.AudioHelper.rePlayMusic();
    //
    var scene = result.scene;
    if (result.query && result.query.inviteCode) {
        ddz.matchModel.bindInviteCode(parseInt(result.query.inviteCode));
    }
    if(scene == 1044){
        var shareTicket = result.shareTicket;
        if(shareTicket){
            ty.SystemInfo.shareTicket = shareTicket;
            // ddz.GlobalFuncs.showOrigin();
        }
    }
});

wx.onHide(function () {
    hall.onHide = true;
    var date = new Date().getTime();
    hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.ONHIDE_DATE, date);
    ty.NotificationCenter.trigger(ddz.EventType.GAME_HIDE);
    hall.LOGE('',"=================onHide=====================wx.onHide"+"---"+date);
    ty.TCP.close();
});

var getNetSuccess = function (res) {
    if (res.hasOwnProperty('isConnected')){
        hall.netIsConnected = res.isConnected;
    }
    else if (res.hasOwnProperty('errMsg')){
        hall.netIsConnected = res.errMsg == 'getNetworkType:ok'
    }
    else{
        hall.netIsConnected = res.networkType != 'none';
    }

    hall.networkType = res.networkType;//wifi,2g,3g,4g,none,unknown
    hall.LOGD('onNetworkStatusChange', 'hall.netIsConnected:' + hall.netIsConnected + ';hall.networkType:'+hall.networkType);
};

wx.getNetworkType({
    success:getNetSuccess
});

wx.onNetworkStatusChange(getNetSuccess);

wx.onError(function (res) {
    var d = new Date();
    var errMsg = 'userId:' + ty.UserInfo.userId + 'time:'+ d.toDateString() + ' ' + d.toTimeString() +';' + res.message;
    ty.BiLog.uploadLogTimely(errMsg);
});

// wx.onLaunch(function () {
//     hall.LOGE('',"=================onLaunch=====================wx.onHide"+"---"+date);
// });

wx.onShareAppMessage(function (result) {
    var titleA = ddz.GameWorld.shareMassageList.shareButton;
    var titleCount = hall.GlobalFuncs.getRandomNumberBefore(titleA.length);

    var query = "inviteCode="+ty.UserInfo.userId;
    return {
        title: titleA[titleCount],
        imageUrl:ty.SystemInfo.shareImagePath,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets,groupMsgInfos) {
            hall.LOGD(null, "onShareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets));
        },
        fail : function () {
            hall.LOGD(null, JSON.stringify(arguments));
        },
        complete : function () {
        },
    }

});

