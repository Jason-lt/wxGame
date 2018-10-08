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

    // login: function() {
    //
    //     ty.ServerStateManager.checkServerState(function () {
    //         ty.TuyooSDK.wechatLogin();
    //     });
    // },
    //
    // // 微信登录
    // wechatLogin: function() {
    //
    //     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginStart, []);
    //     wx.login({
    //         success: function(params) {
    //             hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
    //             ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
    //             if (params.code) {
    //                 var code = params.code;
    //                 var loginByCodeAndInfo = function (code) {
    //                     wx.getUserInfo({
    //                         withCredentials:true,
    //                         success: function(res) {
    //                             ty.TuyooSDK.loginTuyooWithCode(code, res.userInfo, res.iv, res.encryptedData);
    //                         }
    //                     });
    //                 };
    //                 wx.getSetting({
    //                     success:function(res) {
    //                         if (!res.authSetting['scope.userInfo']) {
    //                             ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, [code]);
    //                             wx.authorize({
    //                                 scope : "scope.userInfo",
    //                                 success : function () {
    //                                     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, [code]);
    //                                     loginByCodeAndInfo(code);
    //                                 },
    //                                 fail:function () {
    //                                     ty.NotificationCenter.trigger(shot.EventType.START_AUTHORIZATION_FAILED);
    //                                     shot.needReLogin = true;
    //                                     // hall.MsgBoxManager.showToast({title : "授权失败,请手动进行授权!"});
    //                                     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, [code]);
    //                                 },
    //                                 complete:function () {
    //                                 }
    //                             });
    //                         }
    //                         else{
    //                             loginByCodeAndInfo(code);
    //                         }
    //                     }
    //                 })
    //             }
    //         },
    //
    //         fail: function(params) {
    //             ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
    //             hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
    //         },
    //
    //         complete: function(params) {
    //
    //         }
    //     });
    // },

    wechatLoginNormal: function(code, with_fail_guide) {
        wx.getUserInfo({
            withCredentials:true,
            success: function(res) {
                ty.TuyooSDK.loginTuyooWithCode(code, res.userInfo, res.iv, res.encryptedData);
            },
            fail:function () {
                if (with_fail_guide){
                    //弹出失败的引导
                    wx.showModal({
                        title:'提示',
                        content:'授权失败,点击确定手动进行授权!',
                        showCancel:true,
                        cancelText:'取消',
                        confirmText:'确定',
                        success:function (res) {
                            if (res.confirm) {
                                wx.openSetting();
                            }
                        }
                    });
                    shot.needReLogin = true;
                }
            }
        });
    },

    wechatLoginDirect: function(loginCode) {
        ty.ServerStateManager.checkServerState(function () {

            var doGetInfoAndLogin = function (code_par) {

                shot.GlobalFuncs.getUserInfo();
                var checkUserInfo = function () {
                    var openDataContext = wx.getOpenDataContext();
                    var sharedCanvas = openDataContext.canvas;
                    var context = sharedCanvas.getContext("2d");
                    if (context.hasOwnProperty('game_getUserInfo')) {
                        ty.Timer.cancelTimer(cc.director, checkUserInfo);
                        var userInfo = context['game_getUserInfo'];
                        // ty.TuyooSDK.loginTuyooWithCode(code, {nickName:null,avatarUrl:null,gender:0});
                        ty.TuyooSDK.loginTuyooWithCode(code_par, userInfo);
                    }
                };

                ty.Timer.setTimer(cc.director, checkUserInfo, 1 / 60);
            };

            if (loginCode){
                doGetInfoAndLogin(loginCode);
            }
            else{
                wx.login({
                    success: function (params) {
                        hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                        if (params.code) {
                            //此处在使用开放数据域绕过微信授权
                            doGetInfoAndLogin(params.code);
                        }
                    },
                    fail: function (params) {
                        hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
                    },
                    complete: function (params) {

                    }
                });
            }
        });
    },

    loginTuyooWithCode: function(code, userInfo, iv, encryptedData) {
        // 微信授权成功后使用code登录途游服务器

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

        debugMode = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.gameModel.DEBUG_MODE,debugMode);
        if (debugMode){
            sdkPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, ty.SystemInfo.loginUrl);
        }

        // var sdkPath = 'http://140.143.201.170:8000/';
        shot.Share.shareKeywordReplace.wechatName = userInfo.nickName;

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
                shot.Share.shareKeywordReplace.nickName = hall.GlobalFuncs.sliceStringToLength(ty.UserInfo.userName,10);
                ty.UserInfo.userPic = result.purl;
                ty.UserInfo.authorCode = result.authorCode;
                ty.UserInfo.wxgame_session_key = result.wxgame_session_key;
                hall.LOGD(null, 'userId:' + ty.UserInfo.userId + ' userName:' + ty.UserInfo.userName + ' userPic:' + ty.UserInfo.userPic);

                ty.PropagateInterface.getUserFeatureInfo();//获取用户特征
                // ty.PropagateInterface.getShareConfigInfo();//获取分享配置
                hall.adManager.requestADInfo();

                var token = result.token;
                hall.LOGD(null, 'token:' + token);
                wx.setStorage({
                    key: ty.TuyooSDK.SESSION_KEY,
                    data: token
                });

                // 发送登录成功事件
                // ty.NotificationCenter.trigger(ty.EventType.MSG_LOGIN_SUCCESS);

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

        this.initUserBaseInfo(userInfo);
    },
    
    initUserBaseInfo : function (userInfo) {
        //请求头像

        var _index = 0;
        var loadImage = function(){
            var txImage = wx.createImage();
            txImage.src = userInfo.avatarUrl;
            txImage.onload = function (event) {
                hall.LOGW("","file = [SystemInfo] fun = [loadImage] 加载成功");
                ty.UserInfo.avatarImg = txImage;
            };

            txImage.onerror = function (event) {
                hall.LOGW("","file = [SystemInfo] fun = [loadImage] 加载失败");
                _index++;
                if(_index < 4) {
                    loadImage();
                }
            };
        };

        loadImage();

        var initMyQrCode = function () {
            var sdkPath = ty.SystemInfo.loginUrl;
            var local_uuid = hall.GlobalFuncs.getLocalUuid();

            var pars = {
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                imei: 'null',
                uuid : local_uuid,
                width : 280,
                b64 : true,
                scene : '1,' + ty.UserInfo.userId
            };

            var serPath = sdkPath + 'open/v6/user/Getwxacodeunlimit';

            wx.request({
                url: serPath,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: pars,
                method:'POST',
                success: function(params) {
                    // hall.LOGD(null, 'qrcode success, params:' + JSON.stringify(params));
                    hall.LOGD(null, 'qrcode success');
                    var b64Str =  params.data.result.img;
                    var fs = wx.getFileSystemManager();
                    ty.UserInfo.myQrCodeFilePath = wx.env.USER_DATA_PATH + '/myQr.png';
                    fs.writeFileSync(ty.UserInfo.myQrCodeFilePath ,b64Str , 'base64');
                },
                fail: function(params) {
                },
                complete: function(params) {
                }
            });
        };

        initMyQrCode();
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
    },

    wechatGetFriendDataDebug: function() {
        var openDataContext = shot.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        var context = sharedCanvas.getContext("2d");
        context['game_friendData_success'] = false;
        shot.GlobalFuncs.getFriendInfo();
        var checkUserInfo = function () {
            // var openDataContext = wx.getOpenDataContext();
            // var sharedCanvas = openDataContext.canvas;
            // var context = sharedCanvas.getContext("2d");
            if (context.hasOwnProperty('game_friendData') &&
                context.hasOwnProperty('game_friendData_success') &&
                context['game_friendData_success'] == true) {
                ty.Timer.cancelTimer(cc.director, checkUserInfo);
                shot.GameWorld.game_friendData = context['game_friendData'];
            }
        };
        ty.Timer.setTimer(cc.director, checkUserInfo, 1 / 60);
    }
};

wx.onShow(function (result) {
    // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
    hall.LOGW('', "+++++++++++++++++onShow+++++++++++++++++"+JSON.stringify(result));
    hall.onHide = false;
    ty.UserInfo.onShowParam = result;
    ty.UserInfo.onShowParam.isFirstOpen = true;

    ty.SystemInfo.boxId = "";
    ty.SystemInfo.mysteryGiftBagBoxId = "";

    //取相关参数
    var scene = result.scene;
    var query = result.query;
    //来源处理
    ty.UserInfo.scene_id = scene || 0;
    ty.UserInfo.scene_param = query.from || "";
    ty.UserInfo.invite_id = query.inviteCode || 0;

    var hasUUID = hall.GlobalFuncs.checkLocalUUID();
    var newUserFlag = hasUUID ? 1 : 0;

    if (query && query.gdt_vid && query.weixinadinfo) {
        //从广点通广告跳过来的，from的开头加入gdt标识区分
        var from = "gdt." + query.weixinadinfo;
        ty.UserInfo.scene_param = from;
        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserFrom,[scene, from, newUserFlag]);
    } else if(query && query.sourceCode){//从小程序消息卡片中点入
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.inviteCode,shot.Share.clickStatShareType[query.sourceCode],
            query.imageType,"CardActive",JSON.stringify(result)]);
    }else {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.from,query.appid,
            "CardActive",JSON.stringify(result)]);
    }

    if(query && query.sourceCode){ //从小程序消息卡片中点入
        if(query.sourceCode == shot.Share.onShareType.clickStatShareTypeRankList && scene == 1044){ //群排行榜
            var shareTicket = result.shareTicket;
            if(shareTicket){
                shot.GlobalFuncs.showRankList(shareTicket);
            }
        }
        if (query && query.propBoxID) {
            shot.Share.shareKeywordReplace.boxId = query.propBoxID;
            ty.SystemInfo.boxId = query.propBoxID;
        }

        if (query && query.giftBagBoxId) {
            shot.Share.shareKeywordReplace.mysteryGiftBagBoxId = query.giftBagBoxId;
            ty.SystemInfo.mysteryGiftBagBoxId = query.giftBagBoxId;
        }
    }

    if (shot.needReLogin){
        hall.LoginToyoo();
        shot.needReLogin = null;
    }
    ty.NotificationCenter.trigger(shot.EventType.REPLAY_BG_MUSIC);
});

wx.onHide(function () {
    ty.UserInfo.scene_id = 0;
    ty.UserInfo.onShowParam = null;
    hall.onHide = true;
    hall.LOGW('',"+++++++++++++++++onHide+++++++++++++++++");
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

