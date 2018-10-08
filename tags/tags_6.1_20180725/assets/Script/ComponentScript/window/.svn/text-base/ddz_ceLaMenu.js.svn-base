// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        avatar:cc.Node,
        uid:cc.Label,
        location:cc.Label,
        signature:cc.Label,
        goldNum:cc.Label,
        diamondNum:cc.Label,

        infoBg:cc.Node,

        guideIconNode:cc.Node,

        notifyRedDot:cc.Node,
    },

    onLoad:function(){
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_NUMBER,this.updateDiamond,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COIN_NUMBER,this.updateCoin,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_CELA_MENU_INFO,this.updateCeLaMunuInfo,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_GUIDE_ICON_STATE, this.updateGuideNodeState, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_NOTIFY_COUNT, this.updateNotifyCount.bind(this), this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COMMON_CONFIG, this.updateNotifyInfo, this);
    },

    updateDiamond:function(){
        var num = hall.ME.udataInfo.diamondCount;
        if (num) {
            this.diamondNum.string = hall.GlobalFuncs.formatGold(num);
        }else {
            this.diamondNum.string = 0;
        }
    },

    updateCoin:function(){
        var number = hall.ME.getChip();
        if (number) {
            this.goldNum.string =  hall.GlobalFuncs.formatGold(number);
        }else {
            this.goldNum.string = 0;
        }
    },

    updateNotifyInfo:function(){
        this.notifyRedDot.active = ddz.gameModel.notifyInfo.unReadCount > 0;
    },

    updateCeLaMunuInfo:function(){
        var wimdow = this.avatar.getComponent("Avatar");
        if(ty.UserInfo.userPic){
            wimdow.setAvatarUrl(ty.UserInfo.userPic);
            wimdow.hideNameDisplay();
        }

        this.uid.string = "ID " + ty.UserInfo.userId;

        var personInfo = hall.gameWorld.model.personInfo;
        if (personInfo) {
            this.location.string = personInfo.getProvince();
            var _signature = personInfo.getSignature();
            if (!_signature || _signature == "") {
                this.signature.string = "该玩家很懒,什么也没有留下";
            }else {
                this.signature.string = personInfo.getSignature();
            }
        }
        this.updateCoin();
        this.updateDiamond();
        var size = this.infoBg.getContentSize();
        var _sizeY = ddz.GlobalFuncs.getCeLabgSizeY();
        size.height = 252 + _sizeY;
        this.infoBg.setContentSize(size)

        ddz.gameModel.getOldUserChipReward();

        this.updateNotifyInfo();
    },

    updateGuideNodeState:function(isShow){
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if (this.guideIconNode) {
                this.guideIconNode.active = isShow;
            }

        }else {
            if (this.guideIconNode) {
                this.guideIconNode.active = false;
            }
        }
    },

    updateNotifyCount : function () {
        // if(ddz.gameModel.notifyInfo.getInfo) {
        //     if (ddz.gameModel.notifyInfo.autoShowCount) {
        //         this.giftBagNode.active = false;
        //     } else {
        //         if (ddz.gameModel.gongZhonghaoCardPoint > 0) {
        //             this.giftBagNode.active = true;
        //             var tips = "关注公众号,领豪华礼包";
        //             hall.GlobalFuncs.onBubbleTips(this.mainBottom, tips);
        //         } else {
        //             this.giftBagNode.active = ddz.gameModel.gongZhonghaoMenuPoint > 0;
        //         }
        //     }
        // }
    },

    onClickEdit:function(){
        hall.GlobalFuncs.onEditPersonInfo();
    },

    onClickNotifyBtn:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["notice"]);
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        hall.GlobalFuncs.showPopWinByPreFab('prefabs/notifyWindow', function (preFabNode) {
            var window = preFabNode.getComponent('ddz_notifyWindow');
            window.setListType();
        });
    },

    onClickRankBtn:function(){
        var sceneName = 'ddz_rank';
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var window = no.getComponent("ddz_rank");
            window.showRankListForShare();
        };
        // cc.director.loadScene(sceneName,onLaunched);
        hall.GlobalFuncs.pushScene(sceneName,onLaunched);
    },

    onClickShareCircleBtn:function(){
        ddz.GlobalFuncs.showShareMomentsItem("invite");
    },

    onClickAddDesktopBtn:function(){
        ddz.gameModel.getShoreCut();
        hall.GlobalFuncs.onCollectDeskTop();
    },

    onCloseMenuColumu:function(){
        this.node.active = false;
    },

    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
    },

});
