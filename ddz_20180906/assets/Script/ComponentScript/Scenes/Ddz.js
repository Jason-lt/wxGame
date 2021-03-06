console.log("Ddz loaded");
cc.Class({
    extends: cc.Component,

    properties: {
        _TAG : 'Ddz.js',
        bg : cc.Node,
        mainScene : cc.Node,
        // windowCreateRoom : {
        //     default : null,
        //     type : cc.Prefab
        // },
        loadingNode : {
            default : null,
            type : cc.Node
        },
        lblVersion: cc.Label,

        topUpButton : cc.Button,

        completeType : '',
        nodeAuthorizationFailed:cc.Sprite,
        lblTimer : cc.Label
    },

    ctor : function () {
        cc.rendererWebGL._clearColor =  {
            r: 21/255,
            g: 173/255,
            b: 163/255,
            a: 1
        };
    },

    onShowAuthorizationFailed:function () {
        this.nodeAuthorizationFailed.node.active = true;
        var timeCount = 3;
        this.lblTimer.string = timeCount+"";
        var that = this;
        var tickFun = function () {
            timeCount--;
            that.lblTimer.string = timeCount+"";
            if (timeCount <= 0){
                that.nodeAuthorizationFailed.node.active = false;
                that.lblTimer.string = "3";
                wx.openSetting();
                ty.Timer.cancelTimer(this, tickFun);
            }
        };

        ty.Timer.setTimer(this, tickFun, 1, 3);
    },

    onHideDdzMain:function(){
        if (this.mainScene) {
            ddz.LOGD("","file = [Ddz] fun = [onHideDdzMain]");
            this.mainScene.active = false;
        }
    },

    
    // use this for initialization
    onLoad: function () {
        ddz.GlobalFuncs.drawGameCanvas();

        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.parentScene = this;
        this.isAction = false;

        ty.NotificationCenter.listen(ty.EventType.TCP_OPENED, this.onReciveHallInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.START_AUTHORIZATION_FAILED, this.onShowAuthorizationFailed, this);
        ty.NotificationCenter.listen(ddz.EventType.HIDE_DDZ_MAIN, this.onHideDdzMain, this);
        ty.NotificationCenter.listen(ddz.EventType.GET_USER_INFO, this.onGetUserInfo, this);
        ty.NotificationCenter.listen(ty.EventType.WX_LOGIN_SUCCESS, this.onWxLoginSuccess, this);
        ty.NotificationCenter.listen(ty.EventType.MSG_LOGIN_SUCCESS, this.onUserSDKLoginSuccess, this);

        this.lblVersion.string = this.lblVersion.string.replace("{version}", ty.SystemInfo.version);

        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDOther ||
            ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85){
            this.topUpButton.node.active = false;
        }
        hall.adManager.showAdIco();

        var that = this;
        this.onWxLoginSuccess();

        wx.getSetting({
            success:function(res) {
                if (!res.authSetting['scope.userInfo']) {
                    //把授权按钮显示在礼包位置
                    hall.loginBtnManager.showHideAuthorizeBtn(ddz.GlobalFuncs.giftBtnClick);
                }
            }
        });

        var showFailMsg = function () {
            hall.MsgBoxManager.showToast({title : '资源加载失败!请重启游戏再试!'});
        };

        var fs = wx.getFileSystemManager();

        var filePath = wx.env.USER_DATA_PATH + '/res.zip';

        var preLogin = function () {
            //检查本地是否有加载过远程资源
            fs.access({
                path: filePath,
                success: function () {
                    ty.hasRes = true;
                    that.checkLoading();
                },
                fail: function (res) {

                    that.showLoading();

                    //下载文件,并解压
                    var remoteFilePath = ty.SystemInfo.cdnPath + ty.SystemInfo.remotePackPath;
                    ddz.LOGD(null, "remote res path:" + remoteFilePath);
                    wx.downloadFile({
                        url: remoteFilePath,
                        success: function (res) {
                            var tempFilePath = res.tempFilePath;
                            if (res.statusCode === 404) {
                                hall.LOGE(null, "Download file failed: " + remoteFilePath);
                                //下载失败
                                showFailMsg();
                            }
                            else if (tempFilePath) {
                                wx.saveFile({
                                    tempFilePath: tempFilePath,
                                    filePath: filePath,
                                    success: function (res) {
                                        //解压文件
                                        fs.unzip({
                                            zipFilePath : filePath,
                                            targetPath : wx.env.USER_DATA_PATH + "/",
                                            success : function (res) {
                                                ty.hasRes = true;
                                                that.checkLoading();
                                            },
                                            fail : function (res) {
                                                fs.unlinkSync(filePath);
                                                showFailMsg();
                                            }
                                        });

                                        //删除临时文件
                                        fs.unlinkSync(tempFilePath);
                                    },
                                    fail: function (res) {
                                        showFailMsg();
                                    }
                                });
                            }
                        },
                        fail: function (res) {
                            showFailMsg();
                        }
                    })
                }
            });
        };

        var needLoadRemoteRes = hall.GlobalFuncs.checkNeedLoadRemoteRes();
        if (needLoadRemoteRes){
            //版本发生变更,删除本地缓存文件
            ddz.LOGD(null, "version is changed ,need load remote res....");

            fs.access({
                path: filePath,
                success: function () {
                    fs.unlinkSync(filePath);
                    preLogin();
                },
                fail:function () {
                    preLogin();
                }
            });
        }
        else{
            preLogin();
        }

        if (wx.hasOwnProperty("getUpdateManager")){
            var updateManager = wx.getUpdateManager();

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                ddz.LOGD(null, res.hasUpdate)
            });

            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            fs.unlinkSync(filePath); //删除本地资源文件
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })

            });

            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
            });
        }
        
        hall.adManager.checkVideoAd(); //Load广告
        
        // this.getAdMsg();
        ty.NotificationCenter.listen(ty.EventType.GET_AD_MSG_SUCCESS,this.showCrossButton,this);

        hall.loginBtnManager.destroyTableBtn();
        this.initAdManager();
        this.showCrossButton();
    },

    initAdManager:function(){
        if(hall && hall.AdManagerTYWX){
            hall.AdManagerTYWX.init();
            ty.NotificationCenter.listen(ty.EventType.GET_ADMANAGER_ICON_INFO_SUCCESS, this.createCrossButton, this);
        }
    },

    createCrossButton: function(){
        if(hall && hall.AdManagerTYWX){
            var size = cc.director.getWinSize();

            // hall.AdManagerTYWX.showAd(cc.p(posX, posY));
            if (hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
                hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").showAdNode();
            }else {
                hall.AdManagerTYWX.showAd({x:size.width - 80,y:size.height/2 + 50},"myFirstAdNode");
            }

            this._isAdManagerCreated = true;
        }
    },

    showCrossButton: function(){
        if(hall && hall.AdManagerTYWX){
            if(this._isAdManagerCreated){
                // if(Global.mainLayer != null || Global.rankLayer != null){
                //     return;
                // }
                if (hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
                    hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").showAdNode();
                }

            }else{
                this.scheduleOnce(this.showCrossButton, 1)
            }
        }
    },

    getAdMsg : function () {
        var winSize = cc.director.getWinSize();
        // hall.adManager.showAd({x:80,y:winSize.height/2});
        hall.AdManagerTYWX.showAd({x:80,y:winSize.height/2},"myFirstAdNode");

        // hall.adManager.showAd({x:100,y:100});
    },

    onUserSDKLoginSuccess:function () {
        this.checkLoading();
    },

    onWxLoginSuccess:function () {
        if (ty.wxLoginCode){
            //如果已经登录成功了,就检查授权
            var that = this;
            wx.getSetting({
                success:function(res) {
                    if (!res.authSetting['scope.userInfo']) {
                        //没有授权过,需要显示授权按钮
                        that.showLoading();
                        if (!ddz.GlobalFuncs.getOpenData(true)){
                            //不能使用开放数据域的版本,还是需要使用原来的方式
                            // hall.loginBtnManager.showLoginBtn();
                            ddz.LOGD("","file = [Ddz] fun = [onWxLoginSuccess] 111");
                            ty.TuyooSDK.loginWithOutAuthorization(ty.wxLoginCode);
                        }
                        else{
                            ty.TuyooSDK.loginWithOutAuthorization(ty.wxLoginCode);
                            ddz.LOGD("","file = [Ddz] fun = [onWxLoginSuccess] 222");
                        }
                        //把授权按钮显示在礼包位置
                    }
                    else{
                        // ty.wxUserInfo = true;
                        // that.onGetUserInfo(res);
                        // 已经授权的,直接登录
                        ddz.LOGD("","file = [Ddz] fun = [onWxLoginSuccess] 已经授权,直接登录");
                        ty.TuyooSDK.login();
                    }
                }
            });
        }
    },

    showLoading : function () {
        if(!debugMode){
            this.loadingAction();
        }
    },

    // checkLogin:function () {
    //     if (!ty.UserInfo.userId){
    //         //TODO:加载页
    //         // if (ty.wxUserInfo && ty.hasRes){
    //         //     this.showLoading();
    //         //     //用户授权并且资源加载完成,进行登录
    //         //     ty.TuyooSDK.login();
    //         // }
    //     }else {
    //         this.unLoadingAction();
    //         ddz.matchModel.matchUpdate();
    //     }
    // },

    checkLoading:function () {
        if (ty.UserInfo.userId && ty.hasRes){
            this.unLoadingAction();
            ddz.matchModel.matchUpdate();
        }
    },

    onGetUserInfo:function (needShowLoading) {
        hall.LOGE("","file = [Ddz] fun = [onGetUserInfo]")
        if (needShowLoading){
            this.showLoading();
        }
        ty.TuyooSDK.login();
    },

    loadingAction : function () {
        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.loadingAction();
        this.loadingNode.active = true;
    },
    unLoadingAction : function () {
        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.unLoadingAction();
        this.loadingNode.active = false;
        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDOther ||
            ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85){
            this.topUpButton.node.active = false;
        }
    },

    //播放消失动画
    enterTable: function () {
        var animation = this.mainScene.getComponent(cc.Animation);
        animation.play('ddz_main_xiaoshi');
        // this.startAnimationWithType(null,"start");
    },

    startAnimationWithType : function (event, type) {
        //按钮打点
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [type]);
        // 控制短时间内不能二次响应
        if (this.isAction){return}
        this.isAction = true;
        var that = this;
        ty.Timer.setTimer(this, function(){
            that.isAction = false;
        }, 0.6, 1, 0);
        //判断网络状态是否可以响应按钮事件
        if(!debugMode){
            if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
                hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
                ddz.LOGD(null, "TCP is not ok! Please wait!");
                return;
            }
        }

        this.completeType = type;
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        //有关开始游戏的事件处理暂时不播放消失动画,直接进行事件处理
        if(type == "begin" || type == 'friend' ||type == 'gold' || type == 'match'|| type == 'giftBag' || type == 'helpBox'){
            ty.NotificationCenter.listen(ddz.EventType.ACTION_ENTER_TABLE,this.enterTable,this);//进入牌桌前播放消失动画
            this.chooseActionForType();
            return;
        }
        if (type == "diamondNew" || type == "diamondInvite"){
            this.chooseActionForType();
        }else {
            var animation = this.mainScene.getComponent(cc.Animation);
            animation.once('finished', this.completeAni,this);
            animation.play('ddz_main_xiaoshi');
        }
    },
    completeAni : function () {
        this.node.getChildByName('ddz_main').active = false; //防止出场动画播放完成后,按钮还可以点的BUG.
        this.chooseActionForType();
    },
    chooseActionForType : function () {
        var type = this.completeType;
        switch (type){
            case 'detail':{
                this.onDetailButton();
                break;
            }
            case 'begin':{
                if (!ty.UserInfo.isInBSGS && !ddz.gameModel.isNewUser) {
                    var bc = ddz.gameModel.getSkipCustomsConfigJson();
                    if (bc && bc.oldCustoms > 0) {
                        var curWaitInfo = ddz.matchModel.getCurWaitInfo();
                        if (!curWaitInfo || curWaitInfo.stageIndex < bc.oldCustoms){
                            var continuousLogin = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.CONTINUOUSLOGIN, false);
                            var yesterdayShare = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.YESTERDAYSHARE, true);
                            if (continuousLogin){
                                if (!yesterdayShare){
                                    hall.GlobalFuncs.onSkipCustom(2);
                                    return
                                }
                            }else {
                                hall.GlobalFuncs.onSkipCustom(3);
                                return
                            }
                        }
                    }
                }
                ddz.matchModel.startMatchProgress();
                break;
            }
            case 'friend':{
                this.onEnterFriend();
                break;
            }
            case 'gold':{
                hall.GlobalFuncs.gotoRoomListScene();
                break;
            }
            case 'match':{
                //ddz.GlobalFuncs.showNormalTipsWindow("<color=#1A6951>即将上线,敬请期待~</c>");
                //TODO:比赛赢奖
                this.onMatchListButton();
                break;
            }
            case 'rank':{
                this.onRankButton();
                break;
            }
            case 'topUp':{
                //TODO:充值
                // hall.GlobalFuncs.gotoRechargeScene();
                break;
            }
            case 'diamondNew':{
                // ddz.gameModel.queryNewInviteInfo();
                break;
            }
            case 'diamondInvite':{
                ddz.isClickShareReward = true;
                ddz.gameModel.getDayInviteReward();
                break;
            }
            case 'helpBox':{
                ddz.isClickOpenBox = true;
                ddz.gameModel.getOpenBox();
                break;
            }
            case 'reward':{
                this.onGetRewardButton();
                break;
            }
            case 'giftBag':{
                if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
                    hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
                    ddz.LOGD(null, "TCP is not ok! Please wait!");
                    return;
                }
                if (hall.loginBtnManager.canShowUserInfoBtn()){
                    //如果可以显示授权按钮,在未授权的情况下,这个按钮会被授权按钮挡住,不用做特殊处理
                    ddz.GlobalFuncs.giftBtnClick();
                }
                else{
                    //不能显示授权按钮的情况,需要特殊处理,因为在未授权情况下,事件会直接作用到到这个按钮上
                    wx.getSetting({
                        success:function(res) {
                            if (!res.authSetting['scope.userInfo']) {
                                hall.loginBtnManager.onlyAuthorizeAndLogin(ddz.GlobalFuncs.giftBtnClick)
                            }
                            else{
                                ddz.GlobalFuncs.giftBtnClick();
                            }
                        }
                    });
                }
                break;
            }
        }
    },
    onEnterFriend : function () {
        hall.GlobalFuncs.showPopWinByPreFab('prefabs/ddz_window_createRoom', function (preFabNode) {
        });
    },
    onDetailButton : function () {
        var sceneName = 'ddz_detail';
        var onLaunched = function () {
        };
        // cc.director.loadScene(sceneName,onLaunched);
        hall.GlobalFuncs.pushScene(sceneName,onLaunched);
    },
    onRankButton : function () {
        var sceneName = 'ddz_rank';
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_rank");
            window.showRankListForShare();
        };
        // cc.director.loadScene(sceneName,onLaunched);
        hall.GlobalFuncs.pushScene(sceneName,onLaunched);
        ddz.LOGD(null, "onRankButton");
    },

    onMatchListButton: function() {
        var sceneName = 'MatchListScene';
        var onLaunched = function () {
            //var logicScene = cc.director.getScene();
            //var no = logicScene.children[0];
            //var window = no.getComponent("ddz_rank");
            //window.showRankListForShare();
        };
        // cc.director.loadScene(sceneName,onLaunched);
        hall.GlobalFuncs.pushScene(sceneName,onLaunched);
    },

    onGetRewardButton : function () {
        var sceneName = 'ddz_reward';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.pushScene(sceneName);
    },
    /*============业务方法==============*/

    onReciveHallInfo : function () {
        ddz.LOGD(this._TAG, "onReciveHallInfo");
        this.unLoadingAction();
    },
    update: function (dt) {
    },
    onDestroy : function () {
        // hall.adManager.hideAdIco();
        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }
        ty.NotificationCenter.ignoreScope(this);
        hall.loginBtnManager.destroyHideBtn();
    }
});
