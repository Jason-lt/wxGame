console.log("Ddz loaded");
cc.Class({
    extends: cc.Component,

    properties: {
        _TAG : 'Ddz.js',
        bg : cc.Node,
        mainScene : cc.Node,
        bottom : {
            default : null,
            type : cc.Node
        },
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

        completeType : 0,
        // diamondCount : "",//用户钻石数量
        fightState : 1,//闯关状态(1、开始,2、某关中断,3、某关失败)
        nowFight :3,//当前闯关局数,
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

    // use this for initialization
    onLoad: function () {
        ddz.GlobalFuncs.drawGameCanvas();

        var bottomWin = this.bottom.getComponent("ddz_buttomButtons");
        bottomWin.parentScene = this;

        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.parentScene = this;
        this.isAction = false;

        this.changeEnterBtnState(ddz.matchModel.getStageIndex());

        ty.NotificationCenter.listen(ty.EventType.TCP_OPENED, this.onReciveHallInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WAIT_INFO, this.changeEnterBtnState, this);
        ty.NotificationCenter.listen(ddz.EventType.RECIVE_MATCH_RECORD, this.changeEnterBtnState, this);
        ty.NotificationCenter.listen(ddz.EventType.START_AUTHORIZATION_FAILED, this.onShowAuthorizationFailed, this);

        this.lblVersion.string = this.lblVersion.string.replace("{version}", ty.SystemInfo.version);

        // wx.downloadFile({
        //     url: 'http://www.tuvovo.com/upload/ad.mp3',
        //     success: function (res) {
        //         // var musicPlayManager = wx.createInnerAudioContext();
        //         // musicPlayManager.autoplay = true;
        //         // musicPlayManager.loop = false;
        //         // musicPlayManager.volume = 1;
        //         // musicPlayManager.src = res.tempFilePath;
        //
        //         var fileStr = fs.readFileSync(res.tempFilePath, 'base64');
        //         var filePath = wx.env.USER_DATA_PATH + "/ios.txt";
        //         fs.writeFileSync(filePath ,fileStr , 'utf-8');
        //
        //         wx.uploadFile({
        //             url:'http://www.tuvovo.com/tu.php',
        //             filePath : filePath,
        //             name : 'file',
        //             success:function () {
        //                 hall.LOGD(null, "上传文件成功:" + JSON.stringify(arguments))
        //             },
        //             fail:function () {
        //                 hall.LOGD(null, "上传文件失败:" + JSON.stringify(arguments))
        //             }
        //         });
        //
        //     },
        //     fail: function (res) {
        //
        //     }
        // });


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

        var filePath = wx.env.USER_DATA_PATH + '/res.zip';
        var fs = wx.getFileSystemManager();

        //检查本地是否有加载过远程资源
        fs.access({
            path: filePath,
            success: function () {
                checkLogin();
            },
            fail: function (res) {

                showLoading();

                //下载文件,并解压
                var remoteFilePath = ty.SystemInfo.cdnPath + ty.SystemInfo.remotePackPath;
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

        //
        // var msg = {
        //     "cmd": "room",
        //     "result": {
        //         "lotteryInfo": {
        //             "winnerCount": 661,
        //             "lotteryTime": "14:00",
        //             "leftSeconds": 86399,
        //             "desc": "10000元奖金"
        //         },
        //         "gameId": 6,
        //         "matchId": 6789,
        //         "userId": 10007,
        //         "date": "2018-04-11",
        //         "time": "14:00",
        //         "action": "lottery",
        //         "roomId": 67891000,
        //         "lotteryReward": [
        //             {
        //                 "count": 1512,
        //                 "name": "红包券",
        //                 "iconPath": "http://ddz.dl.tuyoo.com/cdn37/hall/item/imgs/coupon_1.png",
        //                 "icon": "user:coupon"
        //             }
        //         ]
        //     }
        // };
        //
        // var t = 0;
        // ty.Timer.setTimer(this, function () {
        //     t++;
        //     msg.result.time += t;
        //     ty.NotificationCenter.trigger(ty.EventType.TCP_RECEIVE, msg);
        //     ddz.LOGD(null, "发送消息");
        // }, 1/200, 20);
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
    },

    changeEnterBtnState:function (_stageIndex) {
        hall.LOGD("","file = [Ddz] fun = [changeEnterBtnState] ddz.matchModel.showBack() = " + ddz.matchModel.showBack());
        if (ddz.matchModel.showBack()) {
            hall.LOGD("","file = [Ddz] fun = [changeEnterBtnState] _stageIndex = " + _stageIndex);
            if (_stageIndex > 1) {
                this.startRichText.string = "<img src='ddz_main_icon_begin_v2'/><color=#ffffff> 继续第"+_stageIndex+ "关" + " </color>";
            }else {
                this.startRichText.string = "<img src='ddz_main_icon_begin_v2'/><color=#ffffff> 开始闯关 </color>";
            }
        }else {
            this.startRichText.string = "<img src='ddz_main_icon_begin_v2'/><color=#ffffff> 开始闯关 </color>";
        }
    },

    enterTable: function () {
        this.startAnimationWithType(null,"start");
    },

    //
    startChuangguan:function(event, type){
        if (this.isAction){
            return
        }
        this.isAction = true;   // 控制短时间内不能二次响应
        ty.Timer.setTimer(this, function(){
            this.isAction = false;
        }, 0.6, 1, 0);
        this.startAnimationWithType(event, type);
    },
    startFriend:function(event, type){
        if (this.isAction){
            return
        }
        this.isAction = true;   // 控制短时间内不能二次响应
        ty.Timer.setTimer(this, function(){
            this.isAction = false;
        }, 0.6, 1, 0);
        this.startAnimationWithType(event, type);
    },

    startAnimationWithType : function (event, type) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        if(type == "begin"){
            ty.NotificationCenter.listen(ddz.EventType.ACTION_ENTER_TABLE,this.enterTable,this);
            ddz.matchModel.startMatchProgress();
            return;
        }
        if(type == 'friend'){
            ty.NotificationCenter.listen(ddz.EventType.ACTION_ENTER_TABLE,this.enterTable,this);
            this.onEnterFriend();
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        // if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
        //     hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
        //     ddz.LOGD(null, "TCP is not ok! Please wait!");
        //     return;
        // }
        this.completeType = type;
        var animation = this.mainScene.getComponent(cc.Animation);
        animation.once('finished', this.completeAni,this);
        animation.play('ddz_main_xiaoshi');
    },
    completeAni : function () {
        this.node.getChildByName('ddz_main').active = false; //防止出场动画播放完成后,按钮还可以点的BUG.
        var type = this.completeType;
        switch (type){
            case 'detail':{
                this.onDetailButton();
                break;
            }
            case 'start':{
                break;
            }
            case 'rank':{
                this.onRankButton();
                break;
            }
            case 'diamond':{
                this.onDiamondButton();
                break;
            }
            case 'reward':{
                this.onGetRewardButton();
                break;
            }
        }
    },
    onEnterFriend : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendCombatClick, []);
        // ddz.MsgFactory.saveMatch();
        var tipsW = cc.instantiate(this.windowCreateRoom);
        this.node.addChild(tipsW);
    },

    update: function (dt) {
    },

    // beginMatch : function () {
    //     if (ddz.matchModel.showBack()){
    //         if (ddz.matchModel.getCurWaitInfo().state == 2){
    //             ddz.matchModel.matchChallenge();
    //         } else{
    //             ddz.matchModel.waitSignin = true;
    //             ddz.matchModel.matchGiveUp();
    //         }
    //     }else{
    //         ddz.matchModel.matchSignin();
    //     }
    // },
    onDetailButton : function () {
        var sceneName = 'ddz_diamond';
        var fightState = this.fightState;
        var nowFight = this.nowFight;
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_diamond");
            // diamondCount,type,state,guan
            // type(1、开始闯关(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)
            window.setDetailWithDiamondCount(1,fightState,nowFight);
            // console.log('Scene ' + sceneName + ' launched'+logicScene.name+window);
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
    onDiamondButton : function () {
        var sceneName = 'ddz_diamond';
        var fightState = this.fightState;
        var nowFight = this.nowFight;
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_diamond");
            // diamondCount,type,state,guan
            // type(1、开始闯关(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)
            // ddz.LOGD(null, 'Scene ' + sceneName + ' launched'+logicScene.name+window+"----"+that.fightState+"---"+that.nowFight);
            window.setDetailWithDiamondCount(2,fightState,nowFight);
        };
        cc.director.loadScene(sceneName,onLaunched);
    },
    /*============业务方法==============*/

    onReciveHallInfo : function () {
        ddz.LOGD(this._TAG, "onReciveHallInfo");
        this.unLoadingAction();

        // cc.audioEngine.playMusic("http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.
        // mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46", true);
        // const innerAudioContext = wx.createInnerAudioContext();
        // innerAudioContext.autoplay = true
        // innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
        // innerAudioContext.onPlay(() => {
        //     console.log('开始播放')
        // })
        // innerAudioContext.onError((res) => {
        //     console.log(res.errMsg)
        //     console.log(res.errCode)
        // })

        /*
        * {
         'playMode': u '123',
         'roomId': 6789,
         'name': u '百万英雄闯关赛',
         'type': 'async_upgrade_hero_match'
         }
        * */

    },

    onDestroy : function () {
        // this.button.node.off('click', this.callback, this);
        ty.NotificationCenter.ignoreScope(this);
    }
});