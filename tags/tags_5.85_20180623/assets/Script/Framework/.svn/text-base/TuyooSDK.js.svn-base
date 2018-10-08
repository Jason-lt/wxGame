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

    /**
     * 首页用
     */
    login: function() {
        ty.ServerStateManager.checkServerState(function () {
            wx.getUserInfo({
                withCredentials:true,
                success: function(res) {
                    if (ty.wxLoginCode){
                        ty.TuyooSDK.loginTuyooWithCode(ty.wxLoginCode, res.userInfo, res.iv, res.encryptedData);
                        ty.wxLoginCode = null;
                    }
                },
                fail:function (res) {
                }
            });
        });
    },

    /**
     * 其它页面用
     */
    wechatLogin: function() {
        ty.ServerStateManager.checkServerState(function () {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginStart, []);
            wx.login({
                success: function(params) {
                    hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
                    if (params.code) {
                        //登录后,重新获取用户信息
                        wx.getUserInfo({
                            withCredentials:true,
                            success: function(res) {
                                ty.TuyooSDK.loginTuyooWithCode(params.code, res.userInfo, res.iv, res.encryptedData);
                            },
                            fail:function (res) {
                            }
                        });
                    }
                },

                fail: function(params) {
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
                    hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
                },

                complete: function(params) {

                }
            });
        });
    },

    wechatLoginDebug: function() {
        ty.ServerStateManager.checkServerState(function () {
            wx.login({
                success: function (params) {
                    hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                    if (params.code) {
                        //此处在使用开放数据域绕过微信授权
                        var code = params.code;
                        ddz.GlobalFuncs.getUserInfo();
                        var checkUserInfo = function () {
                            var openDataContext = wx.getOpenDataContext();
                            var sharedCanvas = openDataContext.canvas;
                            var context = sharedCanvas.getContext("2d");
                            if (context.hasOwnProperty('game_getUserInfo')) {
                                ty.Timer.cancelTimer(cc.director, checkUserInfo);
                                var userInfo = context['game_getUserInfo'];
                                // ty.TuyooSDK.loginTuyooWithCode(code, {nickName:null,avatarUrl:null,gender:0});
                                ty.TuyooSDK.loginTuyooWithCode(code, userInfo);
                            }
                        };

                        ty.Timer.setTimer(cc.director, checkUserInfo, 1 / 60);
                    }
                },

                fail: function (params) {
                    hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
                },
                complete: function (params) {

                }
            });
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
    loginTuyooWithCode: function(code, userInfo, iv, encryptedData) {
        // 微信授权成功后使用code登录途游服务器
        wx.showShareMenu({
            withShareTicket: true
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
        var gender = userInfo.gender;
        // var gender = 0;
        // if (userInfo.gender == 1){
        //     gender = 0;
        // }
        // else if (userInfo.gender == 2){
        //     gender = 1;
        // }

        var local_uuid = hall.GlobalFuncs.getLocalUuid();
        hall.LOGD("local_uuid:",local_uuid);
        var sdkPath = ty.SystemInfo.loginUrl;

        debugMode = hall.GlobalFuncs.ReadBoolFromLocalStorage(ddz.gameModel.DEBUG_MODE,debugMode);
        if (debugMode){
            sdkPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, ty.SystemInfo.loginUrl);
        }

        // var sdkPath = 'http://140.143.201.170:8000/';
        ddz.Share.shareKeywordReplace.wechatName = userInfo.nickName;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeLoginSDKStart, [code, local_uuid, userInfo.nickName]);

        // var tempData = {
        //     appId: ty.SystemInfo.appId,
        //     wxAppId: ty.SystemInfo.wxAppId,
        //     clientId: ty.SystemInfo.clientId,
        //     snsId: 'wxapp:' + code,
        //     uuid : local_uuid,
        //     //以下为上传玩家的微信用户信息
        //     nickName: userInfo.nickName,
        //     avatarUrl: userInfo.avatarUrl,
        //     gender: gender,
        //     login_channel : ty.UserInfo.login_channel,
        //     login_invite_id : ty.UserInfo.login_invite_id || 0
        // };
        // hall.LOGW("==Login===","====tempData====="+JSON.stringify(tempData));

        var postData = {
            appId: ty.SystemInfo.appId,
            wxAppId: ty.SystemInfo.wxAppId,
            clientId: ty.SystemInfo.clientId,
            snsId: 'wxapp:' + code,
            uuid : local_uuid,
            //以下为上传玩家的微信用户信息
            avatarUrl: userInfo.avatarUrl,
            gender: gender,
            scene_id : ty.UserInfo.scene_id || 0,
            scene_param : ty.UserInfo.scene_param || "",
            invite_id : ty.UserInfo.invite_id || 0
        };

        if (userInfo.avatarUrl){
            postData.avatarUrl = userInfo.avatarUrl;
        }

        if (userInfo.nickName){
            postData.nickName = userInfo.nickName;
        }

        if (iv){
            postData.iv = iv;
        }

        if (encryptedData){
            postData.encryptedData = encryptedData;
        }

        hall.LOGW("==Login===","====tempData===== URL = "+JSON.stringify(sdkPath + 'open/v6/user/LoginBySnsIdNoVerify'));
        wx.request({
            url: sdkPath + 'open/v6/user/LoginBySnsIdNoVerify',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: postData,

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
                ty.UserInfo.wxgame_session_key = result.wxgame_session_key;
                hall.LOGD(null, 'userId:' + ty.UserInfo.userId + ' userName:' + ty.UserInfo.userName + ' userPic:' + ty.UserInfo.userPic);

                ty.PropagateInterface.getUserFeatureInfo();//获取用户特征
                ty.PropagateInterface.getShareConfigInfo();//获取分享配置

                var token = result.token;
                hall.LOGD(null, 'token:' + token);
                wx.setStorage({
                    key: ty.TuyooSDK.SESSION_KEY,
                    data: token
                });

                // 发送登录成功事件
                ty.NotificationCenter.trigger(ty.EventType.MSG_LOGIN_SUCCESS);

                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeLoginSDKSuccess, [code, local_uuid, userInfo.nickName, result.userId]);

                var ip = result.tcpsrv.ip;
                var port = result.tcpsrv.wsport || result.tcpsrv.port; //优先使用wsport
                // hall.LOGD(null, 'ip:' + ip + ' port:' + port);
                var webSocketUrl;
                // if (sdkPath.indexOf("https://") > -1){
                //     webSocketUrl = 'wss://' + ip + '/';
                // }
                // else{
                //     webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                // }
                if (sdkPath.indexOf("170") > -1 || sdkPath.indexOf("https://") > -1){
                    webSocketUrl = 'wss://' + ip + '/';
                }
                else{
                    webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                }
                hall.LOGD(null, 'webSocketUrl:' + webSocketUrl);
                ty.SystemInfo.webSocketUrl = webSocketUrl;
                
                // 解析SDK登录返回，userId/tcpsrv信息，根据tcpsrv信息初始化长连接模块
                ty.TCP.connect(ty.SystemInfo.webSocketUrl);
                // ty.TuyooSDK.getShareImage();
            },

            fail: function(params) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeLoginSDKFailed, [code, local_uuid, userInfo.nickName]);
                hall.LOGD(null, 'tuyoo login fail, params:' + JSON.stringify(params));
            },

            complete: function(params) {

            }
        });
    },

    /*
     params prodId:商品ID, prodName:商品名称, prodCount:购买数量
            prodPrice:价格  单位元,
            chargeType:支付方式 wxapp.iap,
            gameId:子游戏id,
            appInfo:透传参数,
            mustcharge:是否支付 默认填 1
     */

    rechargeOrder: function (params){
        var local_uuid = hall.GlobalFuncs.getLocalUuid();
        var sdkPath = ty.SystemInfo.loginUrl;
        // hall.LOGD("","file = [TuyooSDK] fun = [rechargeOrder] params = " + JSON.stringify(params));

        // var data_s = {
        //     userId:ty.UserInfo.userId,
        //     appId: ty.SystemInfo.appId,
        //     wxAppId: ty.SystemInfo.wxAppId,
        //     clientId: ty.SystemInfo.clientId,
        //     imei: 'null',
        //     uuid : local_uuid,
        //     //商品信息
        //     prodId: params.prodId,
        //     prodName: params.prodName,
        //     prodCount: params.prodCount || 1,
        //     prodPrice: params.prodPrice,
        //     chargeType: params.chargeType,
        //     gameId : params.gameId,
        //     appInfo : params.appInfo,
        //     mustcharge : params.mustcharge || 1
        // };
        // hall.LOGD(null, 'file = [TuyooSDK] fun = [rechargeOrder] data_s:' + JSON.stringify(data_s));

        debugMode = hall.GlobalFuncs.ReadBoolFromLocalStorage(ddz.gameModel.DEBUG_MODE,debugMode);
        if (debugMode){
            sdkPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, ty.SystemInfo.loginUrl);
        }

        // hall.LOGD("","file = [TuyooSDK] fun = [rechargeOrder] url = " + sdkPath + 'open/v4/pay/order');
        wx.request({
            url: sdkPath + 'open/v4/pay/order',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId:ty.UserInfo.userId,
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                imei: 'null',
                uuid : local_uuid,
                //商品信息
                prodId: params.prodId,
                prodName: params.prodName,
                prodCount: params.prodCount || 1,
                prodPrice: params.prodPrice,
                chargeType: params.chargeType,
                gameId : params.gameId,
                appInfo : params.appInfo,
                mustcharge : params.mustcharge || 1
            },

            method:'POST',

            success: function(params) {
                hall.LOGW(null, 'tuyoo rechargeOrder success, params:' + JSON.stringify(params));
                // var checkData = params.data;
                // if (checkData.error && checkData.error.code == 1){
                //     console.log('tuyoo createOrder fail...');
                //     return;
                // }
                var results = params.data.result;
                if (results.code == 0) {
                    var chargeInfo = results.chargeInfo;
                    var chargeData = chargeInfo.chargeData;
                    var notifyUrl = chargeData.notifyUrl;
                    var platformOrderId = chargeData.platformOrderId;
                    hall.LOGW(null, 'tuyoo rechargeOrder success 创建订单成功, chargeData.mustcharge =' + chargeData.mustcharge);
                    if (chargeData && chargeData.mustcharge == 1) {
                        // wx.requestMidasPayment  购买微信币
                        wx.requestMidasPayment({
                            mode: chargeData.mode,
                            env: chargeData.env,
                            offerId: chargeData.offerId,
                            buyQuantity: 10 * chargeInfo.chargeTotal,
                            platform:chargeData.platform,
                            currencyType:"CNY",
                            zoneId: chargeData.zoneId,
                            success:function(params) {
                                // 支付成功
                                ty.Recharge.orderCallFunc(notifyUrl,platformOrderId,chargeInfo.chargeCoin);
                            },
                            fail:function(params) {    //{ errMsg, errCode }
                                hall.LOGW(null, '米大师支付 fail params = ' + JSON.stringify(params));
                                // 支付失败
                                // console.log(errMsg, errCode)
                                // hall.MsgBoxManager.showToast({title : '购买失败!'});
                            }
                        });
                    }else if (chargeData && chargeData.mustcharge == 0){
                        ty.Recharge.orderCallFunc(notifyUrl,platformOrderId,chargeInfo.chargeCoin);
                    }
                }else if (results.code == 1) {
                    hall.MsgBoxManager.showToast({title : results.info});
                }else if (results.code == 3) {
                    hall.MsgBoxManager.showToast({title : '微信小程序登陆验证失败!'});
                }
            },
            fail: function(params) {
                hall.MsgBoxManager.showToast({title : '购买失败!'});
            },
            complete: function(params) {
            }
        });
    },

    getSystemType : function (fun) {
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
                ty.SystemInfo.deviceInfo = result;
                var model = result.model;
                var isiPhone = model.indexOf("iPhone") >= 0;
                var windowHeight = result.windowHeight;
                var resultType = 0;
                if (isiPhone){
                    if(windowHeight == 812){   //iPhoneX
                        resultType = ty.UserInfo.SYSTEMTYPE.iPhoneXType;
                    }else if (windowHeight == 736){ // 7p 8p
                        resultType = ty.UserInfo.SYSTEMTYPE.iPhone7P8PType;
                    }else {  //其他iPhone
                        resultType = ty.UserInfo.SYSTEMTYPE.iphoneOtherType;
                    }
                }else { //cc.sys.OS_ANDROID
                    var isvivo85 = model.indexOf("vivo Y85A") >= 0;
                    if(isvivo85){
                        resultType = ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85;
                    }else {
                        resultType = ty.UserInfo.SYSTEMTYPE.ANDROIDOther;
                    }
                }
                ty.UserInfo.systemType = resultType;
                ty.UserInfo.wechatType = result.version;
                ty.UserInfo.model = result.model;
                ty.UserInfo.system = result.system;

                if (fun){
                    fun(result);
                }
            },
            fail : function () {
            },
            complete : function () {
            }
        });
    }
};

wx.onShow(function (result) {
    // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
    hall.LOGW('', "+++++++++++++++++onShow+++++++++++++++++"+JSON.stringify(result));
    hall.onHide = false;
    var date = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.ONHIDE_DATE);
    var date2 = new Date().getTime();
    var timeGap = date2-date;
    if(timeGap < 60000){
        ty.NotificationCenter.trigger(ddz.EventType.CHANGE_TO_SHOW_FROM_HODE,timeGap);
    }
    ddz.AudioHelper.rePlayMusic();
    hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.ONSHOW_PARAMS,JSON.stringify(result));

    ty.UserInfo.onShowParam = result;
    //取相关参数
    var scene = result.scene;
    var query = result.query;
    var queryS = hall.GlobalFuncs.replaceToStringWithDic(query);
    //来源处理
    ty.UserInfo.scene_id = scene || 0;
    ty.UserInfo.scene_param = query.from || "";
    ty.UserInfo.invite_id = query.inviteCode || 0;
    ty.SystemInfo.shareTicket = "";
    ty.SystemInfo.ftID = "";
    ty.SystemInfo.treasureID = "";

    if(query && query.sourceCode){//从小程序消息卡片中点入
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.inviteCode,ddz.Share.clickStatShareType[query.sourceCode],
            query.imageType,"CardActive",JSON.stringify(result)]);
        //好友房打点
        if(query.sourceCode == ddz.Share.onShareType.clickStatShareTypeInviteFriend){
            var ftID = query.ftID ? query.ftID : "";
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendCardClick,
                [ftID,query.inviteCode]);
        }
        //宝箱
        if(query.sourceCode == ddz.Share.onShareType.clickStatShareTypeGiveProp){
            var treasureID = query.treasureID ? query.treasureID : "";
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeGivePropClick,
                [treasureID,query.inviteCode]);
        }
       //特殊场景处理
        if (query && query.ftID && !ddz.Share.isOnShare) {
            //进入好友桌
            ddz.Share.shareKeywordReplace.inviteFriendID = query.ftID;
            ty.SystemInfo.ftID = query.ftID;
        }else if (query && query.treasureID && !ddz.Share.isOnShare) {
            ddz.Share.shareKeywordReplace.inviteTreasureID = query.treasureID;
            ty.SystemInfo.treasureID = query.treasureID;
        }else {
            //进入群排行榜
            if(query.sourceCode == ddz.Share.onShareType.clickStatShareTypeRankList && !ddz.Share.isOnShare && scene == 1044){//群排行榜
                var shareTicket = result.shareTicket;
                if(shareTicket){
                    ty.SystemInfo.shareTicket = shareTicket;
                }
            }
        }
    }else {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.from,query.appid,
            "CardActive",JSON.stringify(result)]);
    }

    if (scene == 1074 && query && query.from == "fuhao_guanfang") { // 公众号会话下发的小程序消息卡片
        if (query.topage&&query.topage == "fuli") {
            // hall.GlobalFuncs.showDiamondWindowWithType('invite');
            ddz.isClickShareReward = true;
            ddz.gameModel.getDayInviteReward();
        }else {
            ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.gongZhongHaoCard);
        }
    }else if(scene == 1035 && query && query.from == "fuhao_guanfang") { // 公众号自定义菜单
        ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.gongZhongHaoMenu);
    }

    if (ddz.needReLogin){
        ty.TuyooSDK.wechatLogin();
        ddz.needReLogin = null;
    }
    ddz.tableChatModel.replay();
});

wx.onHide(function () {
    ty.UserInfo.scene_id = 0;
    ty.UserInfo.onShowParam = null;
    hall.onHide = true;
    var date = new Date().getTime();
    hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.ONHIDE_DATE, date);
    ty.NotificationCenter.trigger(ddz.EventType.GAME_HIDE);
    hall.LOGW('',"+++++++++++++++++onHide+++++++++++++++++");
    ddz.friendModel.isEnterTable = false;
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
    var errMsg = res.message;
    ty.BiLog.uploadLogTimely(errMsg);
});
