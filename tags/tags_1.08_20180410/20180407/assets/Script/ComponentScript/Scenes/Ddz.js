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
        tipWindow : {
            default : null,
            type : cc.Prefab
        },
        startRichText : {
            default : null,
            type : cc.RichText
        },
        testLabel : {
            default : null,
            type : cc.Label
        },
        loadingNode : {
            default : null,
            type : cc.Node
        },

        serviceNode : {
            default : null,
            type : cc.Node
        },

        completeType : 0,
        // diamondCount : "",//用户钻石数量
        fightState : 1,//闯关状态(1、开始,2、某关中断,3、某关失败)
        nowFight :3,//当前闯关局数
    },

    ctor : function () {
        cc.rendererWebGL._clearColor =  {
            r: 21/255,
            g: 173/255,
            b: 163/255,
            a: 1
        };
    },
    // use this for initialization
    onLoad: function () {
        ddz.GlobalFuncs.drawGameCanvas();

        var bottomWin = this.bottom.getComponent("ddz_buttomButtons");
        bottomWin.parentScene = this;

        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.parentScene = this;

        this.testLabel.node.active = debugMode;

        this.setOriginalData();

        ty.NotificationCenter.listen(ddz.EventType.RECIVE_MATCH_LIST_INFO, this.onReciveHallInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WAIT_INFO, this.setOriginalData, this);

        if (!ty.UserInfo.userId){
            this.loadingAction();
            ty.TuyooSDK.login();
        }else {
            ddz.matchModel.matchUpdate();
        }

    },
    loadingAction : function () {
        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.loadingAction();
        this.loadingNode.active = true;
        this.testLabel.node.active = false;
        this.serviceNode.active = false;
    },
    unLoadingAction : function () {
        var mainW = this.mainScene.getComponent("ddz_main");
        mainW.unLoadingAction();
        this.loadingNode.active = false;
        this.testLabel.node.active = true;
        this.serviceNode.active = true;
    },

    setOriginalData : function () {
        var waitInfo = ddz.matchModel.getCurWaitInfo();

        if(!waitInfo){
            this.fightState = 1;
            this.nowFight = "0";
        }else {
            // {
            //     "cmd":"room",
            //     "result":{
            //         "gameId":6,
            //         "cardCount":1,
            //         "isLevelUp":true,
            //         "stageIndex":2,
            //         "matchId":6789,
            //         "userId":10127,
            //         "state":2,
            //         "action":"wait",
            //         "roomId":67891000
            //     }
            // }

            if (waitInfo.state == 2) {
                this.fightState = 2;
            } else {
                this.fightState = 3;
            }
            this.nowFight = waitInfo.stageIndex;
        }
        if (ddz.matchModel.showBack()) {
            this.startRichText.string = "<img src='ddz_main_tri'/><color=#202020> 继续闯关</color>";
        }
    },

    testWithString : function (string) {
        // this.mainScene
        this.testLabel.string = string;
    },

    startAnimationWithType : function (type) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        this.completeType = type;
        var animation = this.mainScene.getComponent(cc.Animation);
        animation.once('finished', this.completeAni,this);
        animation.play('ddz_main_xiaoshi');
    },
    completeAni : function () {
        this.node.getChildByName('ddz_main').active = false; //防止出场动画播放完成后,按钮还可以点的BUG.
        if (this.completeType == 1){
            if (ddz.matchModel.showBack()){
                if (ddz.matchModel.getCurWaitInfo().state == 2){
                    ddz.matchModel.matchChallenge();
                }
                else{
                    //重新开始
                    ddz.matchModel.waitSignin = true;
                    ddz.matchModel.matchGiveUp();
                }
            }
            else{
                ddz.matchModel.matchSignin();
            }
            // this.callback1();
        }else if (this.completeType == 2){
            this.onRankButton2();
        }else if (this.completeType == 3){
            this.onGetRewardButton3();
        }else if (this.completeType == 4){
            this.onDiamondButton4();
        }else if (this.completeType == 5){
            this.onDetailButton5();
        }else if (this.completeType == 6){
            ddz.matchModel.matchChallenge();
        } else if (this.completeType == 7){
            ddz.matchModel.matchBack();
        }
    },
    // called every frame
    update: function (dt) {
    },

    onRankButton2 : function () {
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
    onGetRewardButton3 : function () {
        var sceneName = 'ddz_reward';
        cc.director.loadScene(sceneName);
    },
    onDiamondButton4 : function () {
        // ddz.LOGD(null, "onDiamondButton4");
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
    onDetailButton5 : function () {
        // ddz.LOGD(null, "onDetailButton5");
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
    callback: function (event) {
        ddz.LOGD(null, "callback");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if (this.fightState == 3){
            var tipsW = cc.instantiate(this.tipWindow);
            this.node.addChild(tipsW);
            var window = tipsW.getComponent("TipsWindow");
            window.parentSce = this;
            var buttonS = "";
            var tipS = "";
            var diamondCount = hall.ME.udataInfo.diamondCount;
            var count = ddz.matchModel.getDiamondCountNeeded();
            if (diamondCount >= count){
                buttonS = "使用";
                tipS = "使用钻石继续挑战";
            }else {
                buttonS = "邀请得";
                tipS = "使用钻石继续挑战"
            }
            var testArray = [{
                title :"重新闯关",
                bottomType : 0
            },
                {
                    title :buttonS,
                    right :"dda_button_diamond",
                    bottomType :1

                }
            ];
            window.setTitleContentAndButtons("提示",tipS,testArray,diamondCount);
            window.changeContentLabelString(this.nowFight);
        }else if(this.fightState == 1){
            this.startAnimationWithType(1);
        }else if(this.fightState == 2){
            this.startAnimationWithType(6);
        }
    },
    onClickLeftButton:function (event) {
        // ddz.matchModel.matchBack();
        this.startAnimationWithType(1);
        ddz.LOGD(null, "onClickLeftButton");
    },
    onClickRightButton:function (event) {
        ddz.LOGD(null, "onClickRightButton");
        var diamondCount = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();
        if (diamondCount >= count) {
            this.startAnimationWithType(7);
        }else{
            ty.TuyooSDK.shareToGetDiamond();
        }
    },
    onRankButton : function () {
        // var sceneName = 'ddz_rank';
        // cc.director.preloadScene(sceneName);
        this.startAnimationWithType(2);
    },
    onGetRewardButton : function () {
        var sceneName = 'ddz_reward';
        cc.director.preloadScene(sceneName);
        this.startAnimationWithType(3);
    },
    onDiamondButton : function () {
        var sceneName = 'ddz_diamond';
        // var fightState = this.fightState;
        // var nowFight = this.nowFight;
        // var onLaunched = function () {
        //     var logicScene = cc.director.getScene();
        //     var no = logicScene.children[0];
        //     var window = no.getComponent("ddz_diamond");
        //     // diamondCount,type,state,guan
        //     // type(1、开始闯关(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)
        //     // ddz.LOGD(null, 'Scene ' + sceneName + ' launched'+logicScene.name+window+"----"+that.fightState+"---"+that.nowFight);
        //     window.setDetailWithDiamondCount(2,fightState,nowFight);
        //
        // };
        cc.director.preloadScene(sceneName);
        this.startAnimationWithType(4);
    },
    onDetailButton : function () {
        var sceneName = 'ddz_diamond';
        // var fightState = this.fightState;
        // var nowFight = this.nowFight;
        // var onLaunched = function () {
        //     var logicScene = cc.director.getScene();
        //     var no = logicScene.children[0];
        //     var window = no.getComponent("ddz_diamond");
        //
        //     // diamondCount,type,state,guan
        //     // type(1、开始闯关(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)
        //     window.setDetailWithDiamondCount(1,fightState,nowFight);
        //     // console.log('Scene ' + sceneName + ' launched'+logicScene.name+window);
        // };
        cc.director.preloadScene(sceneName);
        this.startAnimationWithType(5);
    },
    /*============业务方法==============*/

    onReciveHallInfo : function () {
        ddz.LOGD(this._TAG, "onReciveHallInfo");
        this.unLoadingAction();


        // cc.audioEngine.playMusic("http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46", true);
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
    },
});
