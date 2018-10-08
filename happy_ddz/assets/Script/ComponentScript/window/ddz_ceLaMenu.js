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
        userName:cc.Label,
    },

    onLoad:function(){
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_NUMBER,this.updateDiamond,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COIN_NUMBER,this.updateCoin,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_CELA_MENU_INFO,this.updateCeLaMunuInfo,this);
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_GUIDE_ICON_STATE, this.updateGuideNodeState, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COMMON_CONFIG, this.updateNotifyInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SELF_HEAD_IMAGE, this.changeSelfHead,this);
        var _height = ddz.GlobalFuncs.getMainInterY();
        if (_height/1.5){
            this.infoBg.y = _height/1.5;
        }

        this.updateCeLaMunuInfo();
    },

    changeSelfHead:function(data){
        hall.ME.udataInfo.m_purl = data.url;
        hall.ME.udataInfo.m_name = data.name;
        this.updateCeLaMunuInfo();
        // if (this.avatar) {
        //     var avatarCom = this.avatar.getComponent("Avatar");
        //     avatarCom.setAvatarUrl(data.url);
        //     hall.ME.udataInfo.m_purl = data.url;
        //     hall.ME.udataInfo.m_name = data.name;
        // }
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
        this.notifyRedDot.active = (ddz.gameModel.notifyInfo.unReadCount + ddz.gameModel.messageCount) > 0;
    },

    updateCeLaMunuInfo:function(){
        var wimdow = this.avatar.getComponent("Avatar");
        if(ty.UserInfo.userPic && ddz.gameModel.isLimit){
            wimdow.setAvatarUrl(ty.UserInfo.userPic);
            wimdow.hideNameDisplay();
        }

        this.uid.string = "ID " + ty.UserInfo.userId;

        // var personInfo = hall.gameWorld.model.personInfo;
        // if (personInfo) {
        //     this.location.string = personInfo.getProvince();
        //     var _signature = personInfo.getSignature();
        //     if (!_signature || _signature == "") {
        //         this.signature.string = "该玩家很懒,什么也没有留下";
        //     }else {
        //         this.signature.string = personInfo.getSignature();
        //     }
        // }
        this.userName.string = ty.UserInfo.userName;
        this.updateCoin();
        this.updateDiamond();
        // var size = this.infoBg.getContentSize();
        // var _sizeY = ddz.GlobalFuncs.getCeLabgSizeY();
        // size.height = 252 + _sizeY;
        // this.infoBg.setContentSize(size)

        ddz.gameModel.getOldUserChipReward();

        this.updateNotifyInfo();


        var _height = ddz.GlobalFuncs.getMainInterY();
        if (_height/1.5){
            this.infoBg.y = _height/1.5;
        }
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

    onClickEdit:function(){
        
    },

    onClickNotifyBtn:function(){
        //判断网络状态是否可以响应按钮事件
        if(!debugMode){
            if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
                hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
                ddz.LOGD(null, "TCP is not ok! Please wait!");
                return;
            }
        }

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["notice"]);
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        hall.GlobalFuncs.showPopWinByPreFab('prefabs/notifyWindow', function (preFabNode) {
            var window = preFabNode.getComponent('ddz_notifyWindow');
            window.setListType();
        });
    },

    onClickRankBtn:function(){

        //判断网络状态是否可以响应按钮事件
        if(!debugMode){
            if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
                hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
                ddz.LOGD(null, "TCP is not ok! Please wait!");
                return;
            }
        }
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
        // ddz.GlobalFuncs.showShareMomentsItem("invite");
    },

    onClickAddDesktopBtn:function(){
        // ddz.gameModel.getShoreCut();
        // hall.GlobalFuncs.onCollectDeskTop();
    },

    onCloseMenuColumu:function(){
        // this.node.active = false;
        // ty.NotificationCenter.trigger(ty.EventType.GET_AD_MSG_SUCCESS);
    },

    onClickRecharge:function(){
        //判断网络状态是否可以响应按钮事件
        if(!debugMode){
            if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
                hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
                ddz.LOGD(null, "TCP is not ok! Please wait!");
                return;
            }
        }

        if (cc.sys.os == cc.sys.OS_IOS) {
            var curScene = cc.director.getScene();
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["mainClickMall",curScene.name]);
            hall.GlobalFuncs.gotoMallScene();
        }else {
            var curScene = cc.director.getScene();
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["mainClickRecharge",curScene.name]);
            hall.GlobalFuncs.gotoRechargeScene();
        }


    },

    onClickGoldBtn:function(){
        //判断网络状态是否可以响应按钮事件
        if(!debugMode){
            if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
                hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
                ddz.LOGD(null, "TCP is not ok! Please wait!");
                return;
            }
        }
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_WINDOW_ANI);
        var curScene = cc.director.getScene();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["MainClickChipAdd",curScene.name]);
        hall.GlobalFuncs.gotoMallScene();
    },

    onClickDiamond:function(){
        //判断网络状态是否可以响应按钮事件
        if(!debugMode){
            if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
                hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
                ddz.LOGD(null, "TCP is not ok! Please wait!");
                return;
            }
        }
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_WINDOW_ANI);
        var curScene = cc.director.getScene();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["MainClickDiamond",curScene.name]);
        hall.GlobalFuncs.gotoRechargeScene();
    },

    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
    },

});
