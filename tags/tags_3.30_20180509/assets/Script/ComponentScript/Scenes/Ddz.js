console.log("Ddz loaded");
cc.Class({
    extends: cc.Component,

    properties: {
        _TAG : 'Ddz.js',
        bg : cc.Node,
        mainScene : cc.Node,
        windowCreateRoom : {
            default : null,
            type : cc.Prefab
        },
        startRichText : {
            default : null,
            type : cc.RichText
        },
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
            this.mainScene.active = false;
        }
    },

    
    // use this for initialization
    onLoad: function () {
        ddz.GlobalFuncs.drawGameCanvas();

        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.parentScene = this;
        this.isAction = false;

        this.changeEnterBtnState(ddz.matchModel.getStageIndex());

        ty.NotificationCenter.listen(ty.EventType.TCP_OPENED, this.onReciveHallInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WAIT_INFO, this.changeEnterBtnState, this);
        ty.NotificationCenter.listen(ddz.EventType.RECIVE_MATCH_RECORD, this.changeEnterBtnState, this);
        ty.NotificationCenter.listen(ddz.EventType.START_AUTHORIZATION_FAILED, this.onShowAuthorizationFailed, this);
        ty.NotificationCenter.listen(ddz.EventType.HIDE_DDZ_MAIN, this.onHideDdzMain, this);

        this.lblVersion.string = this.lblVersion.string.replace("{version}", ty.SystemInfo.version);

        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDOther ||
            ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85){
            this.topUpButton.node.active = true;
        }

        var that = this;
        var showLoading = function () {
            if(!debugMode){
                that.loadingAction();
            }
        };

        var checkLogin = function () {
            if (!ty.UserInfo.userId){
                //TODO:加载页
                showLoading();
                // ty.BiLog.clickStat(67890000,["Test",ty.SystemInfo.gameId]);
                // ddz.matchModel.testMatching();
                ty.TuyooSDK.login();
            }else {
                ddz.matchModel.matchUpdate();
            }
        };

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
                    checkLogin();
                },
                fail: function (res) {

                    showLoading();

                    //下载文件,并解压
                    // var remoteFilePath = ty.SystemInfo.cdnPath + ty.SystemInfo.remotePackPath + "?" + ty.SystemInfo.version;
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
                                                checkLogin();
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
            this.topUpButton.node.active = true;
        }
    },

    changeEnterBtnState:function (_stageIndex) {
        hall.LOGD("","file = [Ddz] fun = [changeEnterBtnState] ddz.matchModel.showBack() = " + ddz.matchModel.showBack());
        if (ddz.matchModel.showBack()) {
            hall.LOGD("","file = [Ddz] fun = [changeEnterBtnState] _stageIndex = " + _stageIndex);
            if (_stageIndex > 1) {
                this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续第"+_stageIndex+ "关" + " </color>";
            }else {
                this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff>   开始游戏</color>";
            }
        }else {
            this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff>   开始游戏</color>";
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
        if(type == "begin" || type == 'friend' ||type == 'gold' || type == 'match'){
            ty.NotificationCenter.listen(ddz.EventType.ACTION_ENTER_TABLE,this.enterTable,this);//进入牌桌前播放消失动画
            this.chooseActionForType();
            return;
        }
        var animation = this.mainScene.getComponent(cc.Animation);
        animation.once('finished', this.completeAni,this);
        animation.play('ddz_main_xiaoshi');
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
                ddz.GlobalFuncs.showNormalTipsWindow("<color=#1A6951>即将上线,敬请期待~</c>");
                //TODO:比赛赢奖
                break;
            }
            case 'rank':{
                this.onRankButton();
                break;
            }
            case 'topUp':{
                //TODO:充值
                hall.GlobalFuncs.gotoRechargeScene();
                break;
            }
            case 'diamondNew':{
                hall.GlobalFuncs.showDiamondWindowWithType('new');
                break;
            }
            case 'diamondInvite':{
                hall.GlobalFuncs.showDiamondWindowWithType('invite');
                break;
            }
            case 'reward':{
                this.onGetRewardButton();
                break;
            }
        }
    },
    onEnterFriend : function () {
        var tipsW = cc.instantiate(this.windowCreateRoom);
        this.node.addChild(tipsW);
    },
    onDetailButton : function () {
        var sceneName = 'ddz_detail';
        var onLaunched = function () {
        };
        cc.director.loadScene(sceneName,onLaunched);
    },
    onRankButton : function () {
        var sceneName = 'ddz_rank';
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_rank");
            window.showRankListForShare();
        };
        cc.director.loadScene(sceneName,onLaunched);
        ddz.LOGD(null, "onRankButton");
    },
    onGetRewardButton : function () {
        var sceneName = 'ddz_reward';
        cc.director.loadScene(sceneName);
    },
    /*============业务方法==============*/

    onReciveHallInfo : function () {
        ddz.LOGD(this._TAG, "onReciveHallInfo");
        this.unLoadingAction();
    },
    update: function (dt) {
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
});
