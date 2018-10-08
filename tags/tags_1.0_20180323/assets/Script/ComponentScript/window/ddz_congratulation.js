

cc.Class({
    extends: cc.Component,

    properties: {
        progress : {
            default : null,
            type : cc.Node
        },
        buttons:{
            default : null,
            type : cc.Node
        },
        bottom : {
            default : null,
            type : cc.Node
        },
        aniNode: cc.Node,
        // diamondCount : "",//用户钻石数量
        fightState : 1,//闯关状态(1、开始,2、某关中断,3、某关失败)
        nowFight :3,//当前闯关局数
    },
    onLoad : function() {
        var window = this.progress.getComponent('ddz_progress');
        window.setProgress(6, true);

        var window2 = this.buttons.getComponent('ddz_buttonList');
        window2.parentScene = this;

        var window3 = this.bottom.getComponent('ddz_buttomButtons');
        window3.parentScene = this;

        this.setOriginalData();

        ddz.AudioHelper.playMusic('/resources/sound/Victory.mp3', false);


        var winSize = cc.director.getWinSize();

        var bg = this.node.getChildByName('ddz_scene_bg_0');

        //全屏适配
        this.node.width = winSize.width;
        this.node.height = winSize.height;

        bg.width = winSize.width;
        bg.height = winSize.height;

        //先播放开始的,再播放循环的
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.once('finished',  this.startAniFinish,    this);
        ani.play('ddz_congratulation');
    },

    startAniFinish:function (aniState) {
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.play('ddz_congratulation_xunhuan');
    },

    setOriginalData : function () {
        var waitInfo = ddz.matchModel.getCurWaitInfo();
        // this.fightState = 2;
        // this.nowFight = "1";

        if(!waitInfo){
            this.fightState = 1;
            this.nowFight = "0";
        }else {
            if (waitInfo.isLevelUp) {
                this.fightState = 2;
            } else {
                this.fightState = 3;
            }
            this.nowFight = waitInfo.stageIndex;
        }
    },
    removeAni : function () {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        this.node.removeFromParent();
        // ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
    },
    onRankButton: function () {
        this.removeAni();
        var sceneName = 'ddz_rank';
        cc.director.loadScene(sceneName);
    },
    onGetRewardButton: function () {
        this.removeAni();
        var sceneName = 'ddz_reward';
        cc.director.loadScene(sceneName);
    },
    onDiamondButton: function () {
        this.removeAni();
        var sceneName = 'ddz_diamond';
        var fightState = this.fightState;
        var nowFight = this.nowFight;
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_diamond");
            // diamondCount,type,state,guan
            // type(1、开始闯关(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)
            window.setDetailWithDiamondCount(2,fightState,nowFight);
        };
        cc.director.loadScene(sceneName,onLaunched);
    },

    onTopButtonAction : function () {
        ddz.LOGD(null, "分享");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        //TODO:分享图片
        var titleA = ["1、	我获得了今日分奖资格，快来一起赢取现金大奖",
            "斗地主赢现金，这个秘密我只告诉你！",
            "我获得了赢取现金资格，快来一起分奖！"];
        var count = (Math.floor(Math.random()*10))%3;
        ty.TuyooSDK.shareWithInformation(titleA[count],"");
        wx.showToast({title:titleA[count]});
    },
    onTempButtonAction : function () {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.matchModel.matchSignin();
        this.shut();
    },

    shut:function () {
        ddz.matchResultPanel = null;
        this.node.destroy();
    }

    // update (dt) {},
});
