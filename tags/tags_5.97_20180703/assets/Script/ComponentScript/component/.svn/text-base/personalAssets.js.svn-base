// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        avatar : {
            default : null,
            type : cc.Node
        },

        coinLabel : {
            default : null,
            type : cc.Label
        },
        diamondLabel : {
            default : null,
            type : cc.Label
        },
        jiPaiQiLabel : {
            default : null,
            type : cc.Label
        }
    },

    onLoad:function () {
        this.diamondLabel.string = hall.ME.udataInfo.diamondCount+"";
        // this.jiPaiQiLabel.string = hall.ME.udataInfo.jiPaiQiCount+"";
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_NUMBER,this.updateDiamond,this);
        this.updateCoin();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COIN_NUMBER,this.updateCoin,this);
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_JIPAIQI,this.updateJiPaiQi,this);
    },

    updateInfo:function () {
        var wimdow = this.avatar.getComponent("Avatar");
        if(ty.UserInfo.userPic){
            wimdow.setAvatarUrl(ty.UserInfo.userPic);
            wimdow.hideNameDisplay();
        }

        this.updateCoin();
        var num = hall.ME.udataInfo.diamondCount;
        this.updateDiamond(num);
    },

    updateCoin: function () {
        var number = hall.ME.getChip();
        // hall.LOGD("","file = [personalAssets] fun = [updateCoin] number = " + number);
        if (number) {
            this.coinLabel.string = hall.GlobalFuncs.formatGold(number);
        }else {
            this.coinLabel.string = 0;
        }
    },

    updateJiPaiQi:function(){
        // this.jiPaiQiLabel.string = hall.ME.udataInfo.jiPaiQiCount+"";
    },

    updateDiamond: function (num) {
        if (num) {
            this.diamondLabel.string = hall.GlobalFuncs.formatGold(num);
        }else {
            this.diamondLabel.string = 0;
        }
    },

    // 点击头像
    onClickHeadBtn: function () {
        var curScene = cc.director.getScene();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["avatar",curScene.name]);
        hall.GlobalFuncs.onPersonalInfo();
    },

    // 点击金币
    onClickCoin: function () {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_WINDOW_ANI);
        var curScene = cc.director.getScene();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["chipAdd",curScene.name]);
        hall.GlobalFuncs.gotoMallScene();
    },

    // 点击钻石
    onClickDiamond: function () {
        var curScene = cc.director.getScene();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["diamondAdd",curScene.name]);
        // hall.GlobalFuncs.showDiamondWindowWithType('new');
        ddz.gameModel.queryNewInviteInfo();
    },

    // 点击记牌器
    onClickJiPaiQi: function () {

    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
});
