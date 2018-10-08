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
    isOnShare : false,
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
        var sdkPath = ty.SystemInfo.loginUrl;
        if (debugMode){
            sdkPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, ty.SystemInfo.loginUrl);
        }

        ddz.GameWorld.shareKeywordReplace.wechatName = userInfo.nickName;

        wx.request({
            url: sdkPath + 'open/v6/user/LoginBySnsIdNoVerify',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
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

            method:'POST',

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
                // hall.LOGD(null, 'ip:' + ip + ' port:' + port);
                var webSocketUrl;
                if (sdkPath.indexOf("https://") > -1){
                    webSocketUrl = 'wss://' + ip + '/';
                }
                else{
                    webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                }
                hall.LOGD(null, 'webSocketUrl:' + webSocketUrl);
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

    shareWithType : function (type,callBackFun) {
        var shareMap = ddz.GameWorld.shareConfig.share;//TODO:读取分享配置文件
        var shareDetail = shareMap[type];
        var massageList = shareDetail.massageList;
        var massageMap = massageList[hall.GlobalFuncs.getRandomNumberBefore(massageList.length)];
        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
        var imageList = shareDetail.imageList;
        var imageMap = imageList[hall.GlobalFuncs.getRandomNumberBefore(imageList.length)];
        if(massageMap.focusImage){
            for (var i = 0 ; i < imageList.length; i ++){
                if(imageList[i].imageUrl == massageMap.focusImage){
                    imageMap = imageList[i];
                    break;
                }
            }
        }
        var query;
        if(shareDetail.query){
            query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&"+shareDetail.query;
        }else {
            query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type+"&imageType="+imageMap.imageType;
        }
        var shareImage = ty.SystemInfo.cdnPath + imageMap.imageUrl;
        if(imageMap.extraAdd && imageMap.extraAdd.length && imageMap.extraAdd.length > 0 ){
            var callBackF = function(imageUrl) {
                ty.TuyooSDK.shareImformation(type,imageMap.imageType,shareTitle,imageUrl,query,shareDetail.sharePoint,callBackFun);
            };
            ty.TuyooSDK.getShareImageWithShareMap(0,imageMap,shareImage,callBackF);
        }else {
            ty.TuyooSDK.shareImformation(type,imageMap.imageType,shareTitle,shareImage,query,shareDetail.sharePoint,callBackFun);
        }
    },

    getShareImageWithShareMap : function (nowIndex,imageMap,imageUrl,callBackF) {
        var tempCavas = wx.createCanvas();
        tempCavas.width = imageMap.sizeWith || 360;
        tempCavas.height = imageMap.sizeHeight || 288;
        var context = tempCavas.getContext("2d");
        var image = wx.createImage();
        image.src = imageUrl;
        image.onload = function (event) {
            var ima = event.target;
            context.drawImage(ima,0,0);
            var preTextWidth=0;
            var preTextHeight=0;
            var preX=0;
            var preY=0;
            while (nowIndex < imageMap.extraAdd.length) {
                var extraMap = imageMap.extraAdd[nowIndex];
                if (extraMap.type == "text") {
                    var textInformation = extraMap.textInformation;
                    var text = hall.GlobalFuncs.replaceKeyWordInString(textInformation.textformatString);
                    context.font = textInformation.fontSize + "px Arial";
                    context.fillStyle = textInformation.textColorRGB;
                    context.textAlign = textInformation.textAlign;
                    var textX = textInformation.originPointX;
                    if(textX < 0){
                        if(textX == -1){
                            textX = preX - preTextWidth/2;
                        }else if(textX == -2){
                            textX = preX + preTextWidth/2;
                        }
                    }
                    var textY = textInformation.originPointY;
                    if (textY < 0){
                        if(textY == -1){
                            textY = preY - preTextHeight/2;
                        }if(textY == -2){
                            textY = preY + preTextHeight/2;
                        }
                    }
                    context.fillText(text,textX,textY);
                    preTextWidth = context.measureText(text).width;
                    preTextHeight = context.measureText(text).height;
                    preX = textX;
                    preY = textY;
                    nowIndex ++;
                }else if(extraMap.type == "image") {
                    var imageInformation = extraMap.imageInformation;
                    var image = wx.createImage();
                    image.src = imageInformation.addImageUrl;
                    image.originPointX = imageInformation.originPointX;
                    image.originPointY = imageInformation.originPointY;
                    image.onload = function (event) {
                        var img = event.target;
                        context.drawImage(img,img.originPointX,img.originPointY);
                        var tempFilePath = tempCavas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: imageMap.sizeWith || 360,
                            height: imageMap.sizeHeight || 288,
                            destWidth: imageMap.sizeWith || 360,
                            destHeight: imageMap.sizeHeight || 288
                        });
                        if(callBackF) {
                            callBackF(tempFilePath);
                        }
                    };
                    return;
                }
            }
            var tempFilePath = tempCavas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: imageMap.sizeWith || 360,
                height: imageMap.sizeHeight || 288,
                destWidth: imageMap.sizeWith || 360,
                destHeight: imageMap.sizeHeight || 288
            });
            if(callBackF) {
                callBackF(tempFilePath);
            }
        };
    },

    shareImformation : function (type,imageType,titleString, imagUrl,query,sharePoint,callBackFun) {
        hall.LOGD(null, "shareAppMessage+++++++++++++imagUrl+========+++"+imagUrl);
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeOnClickButton,[type,imageType,ty.SystemInfo.gameId]);
        ty.TuyooSDK.isOnShare = true;
        wx.shareAppMessage({
            title: titleString,
            imageUrl : imagUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (shareTickets,groupMsgInfos) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareSuccess,[type,imageType,ty.SystemInfo.gameId]);
                ddz.matchModel.shareToGetreward(sharePoint);
                if (callBackFun){
                    callBackFun();
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
                ty.UserInfo.wechatType = result.version;
                ty.UserInfo.model = result.model;
                ty.UserInfo.system = result.system;
            },
            fail : function () {
            },
            complete : function () {
            }
        });
    },

    // getShareImage : function () {
    //     var sharetype = ty.UserInfo.clickStatShareType.clickStatShareTypeShareButton;
    //     var shareConfig = ddz.GameWorld.shareConfig.share[sharetype];
    //     var imageList = shareConfig.imageList;
    //     var imageMap = imageList[hall.GlobalFuncs.getRandomNumberBefore(imageList.length)];
    //     if(imageMap.extraAdd){
    //         var callBackF = function (imageUrl) {
    //             ty.SystemInfo.shareImagePath = imageUrl;
    //             ty.SystemInfo.shareImageType = imageMap.imageType;
    //         };
    //         ty.TuyooSDK.getShareImageWithShareMap(0, imageMap,ty.SystemInfo.cdnPath + imageMap.imageUrl, callBackF);
    //     }else {
    //         ty.SystemInfo.shareImagePath = imageMap.imageUrl;
    //         ty.SystemInfo.shareImageType = imageMap.imageType;
    //     }
    // }
};

wx.onShow(function (result) {
    // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
    hall.LOGE('', "+++++++++++++++++onShow+++++++++++++++++"+JSON.stringify(result));
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
    if(result.query && result.query.sourceCode){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickFromCardActive,
            [result.query.sourceCode,result.query.imageType,ty.SystemInfo.gameId]);
    }
    if(scene == 1044){
        var shareTicket = result.shareTicket;
        if(shareTicket && !ty.TuyooSDK.isOnShare){
            ty.SystemInfo.shareTicket = shareTicket;
        }
    }
    ty.TuyooSDK.isOnShare = false;
});

wx.onHide(function () {
    hall.onHide = true;
    var date = new Date().getTime();
    hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.ONHIDE_DATE, date);
    ty.NotificationCenter.trigger(ddz.EventType.GAME_HIDE);
    hall.LOGE('',"+++++++++++++++++onHide+++++++++++++++++");
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

wx.onShareAppMessage(function (result) {

    var titleA = ddz.GameWorld.shareConfig.share.clickStatShareTypeShareButton.massageList;
    var massageMap = titleA[hall.GlobalFuncs.getRandomNumberBefore(titleA.length)];
    var imageArray = ddz.GameWorld.shareConfig.share.clickStatShareTypeShareButton.imageList;
    var imageMap = imageArray[hall.GlobalFuncs.getRandomNumberBefore(imageArray.length)];
    var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
    var imageUrl = ty.SystemInfo.cdnPath+ imageMap.imageUrl;
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeOnClickButton,
        [ty.UserInfo.clickStatShareType.clickStatShareTypeShareButton,
            imageMap.imageType,ty.SystemInfo.gameId]);
    var query = "inviteCode="+ty.UserInfo.userId+
        "&imageType="+imageMap.imageType+
        "&sourceCode="+ty.UserInfo.clickStatShareType.clickStatShareTypeShareButton;
    ty.TuyooSDK.isOnShare = true;
    hall.LOGD(null, "onShareAppMessage+++++++++++++++++"+imageUrl);
    return {
        title: shareTitle,
        imageUrl:imageUrl,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets,groupMsgInfos) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareSuccess,
                [ty.UserInfo.clickStatShareType.clickStatShareTypeShareButton,
                    ty.SystemInfo.shareImageType,ty.SystemInfo.gameId]);
            hall.LOGD(null, "onShareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets));
        },
        fail : function () {
            hall.LOGD(null, JSON.stringify(arguments));
        },
        complete : function () {
        },
    }
});

