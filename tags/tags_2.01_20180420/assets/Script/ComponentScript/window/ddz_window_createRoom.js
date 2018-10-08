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
        backBg : {
            default : null,
            type  : cc.Button
        },
        createItem1 : {
            default : null,
            type : cc.Node
        },
        createItem2 : {
            default : null,
            type : cc.Node
        },
        createItem3 : {
            default : null,
            type : cc.Node
        },
        createItem4 : {
            default : null,
            type : cc.Node
        },
        createItem5 : {
            default : null,
            type : cc.Node
        },

        roundCount : 6,
        modeType : 0,

        creatItem : {
            default : null,
            type : cc.Prefab
        },

        parentScene : {
            default : null
        }
    },

    onItemAction1 : function () {
        var window = this.createItem1.getComponent("ddz_item_createRoom");
        if(window.count == this.roundCount){
            return;
        }
        this.roundCount = window.count;
        window.setSelectedState(true);
        var window2 = this.createItem2.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        var window3 = this.createItem3.getComponent("ddz_item_createRoom");
        window3.setSelectedState(false);
        hall.LOGE("","=============onItemAction============="+this.roundCount + "======"+this.modeType);
    },
    onItemAction2 : function () {
        var window = this.createItem2.getComponent("ddz_item_createRoom");
        if(window.count == this.roundCount){
            return;
        }
        this.roundCount = window.count;
        window.setSelectedState(true);
        var window2 = this.createItem1.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        var window3 = this.createItem3.getComponent("ddz_item_createRoom");
        window3.setSelectedState(false);
        hall.LOGE("","=============onItemAction============="+this.roundCount + "======"+this.modeType);
    },
    onItemAction3 : function () {
        var window = this.createItem3.getComponent("ddz_item_createRoom");
        if(window.count == this.roundCount){
            return;
        }
        this.roundCount = window.count;
        window.setSelectedState(true);
        var window2 = this.createItem1.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        var window3 = this.createItem2.getComponent("ddz_item_createRoom");
        window3.setSelectedState(false);
        hall.LOGE("","=============onItemAction============="+this.roundCount + "======"+this.modeType);
    },
    onItemAction4 : function () {
        var window = this.createItem4.getComponent("ddz_item_createRoom");
        if(window.count == this.modeType){
            return;
        }
        this.modeType = window.count;
        window.setSelectedState(true);
        var window2 = this.createItem5.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        hall.LOGE("","=============onItemAction============="+this.roundCount + "======"+this.modeType);
    },
    onItemAction5 : function () {
        var window = this.createItem5.getComponent("ddz_item_createRoom");
        if(window.count == this.modeType){
            return;
        }
        this.modeType = window.count;
        window.setSelectedState(true);
        var window2 = this.createItem4.getComponent("ddz_item_createRoom");
        window2.setSelectedState(false);
        hall.LOGE("","=============onItemAction============="+this.roundCount + "======"+this.modeType);
    },

    createPanelWithList : function () {
        var row = 4;
        var rowHeightList = [];
        for (var i = 0 ; i < row ; i ++){
            var rowHeight = 166-i*66;
            rowHeightList.push(rowHeight);
        }

        var col = 2;
        var gap = (438-20*col)/col;
        for (var i = 0 ; i < col ; i ++) {
            var item = cc.instantiate(this.creatItem);
            item.x = gap*i - 94;
        }
    },

    onCreateButton : function () {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomCreateClick, []);
        // this.playEndAnimation();
        if (ddz.matchModel.getCurWaitInfo()){
            ddz.MsgFactory.saveMatch();
        }
        else {
            hall.GlobalFuncs.setInLocalStorage(ddz.friendModel.CREATE_ROUND_COUNT, this.roundCount);
            hall.GlobalFuncs.setInLocalStorage(ddz.friendModel.CREATE_MODE_TYPE, this.modeType);
            ddz.friendModel.createFriendRoom(this.roundCount,0,"123",this.modeType);
        }
    },
    onSeeButton : function () {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        hall.GlobalFuncs.onHistory();
    },
    onCloseButton : function () {
        this.playEndAnimation();
    },
    playEndAnimation : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        anim1.on('finished', this.completeAni,this);
        anim1.play();
    },
    onBlackButton : function () {
    },
    completeAni : function () {
        this.node.removeFromParent();
    },
    onSaveMatch:function () {
        ddz.friendModel.createFriendRoom(this.roundCount,0,"123",this.modeType);
    },
    onLoad : function () {
        ty.NotificationCenter.listen(ddz.EventType.SAVE_MATCH_SUCCESS, this.onSaveMatch, this);
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();

        this.roundCount = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.friendModel.CREATE_ROUND_COUNT, 6);
        this.modeType = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.friendModel.CREATE_MODE_TYPE, 0);

        var window,window2,window3,window4,window5;
        window = this.createItem1.getComponent("ddz_item_createRoom");
        window2 = this.createItem2.getComponent("ddz_item_createRoom");
        window3 = this.createItem3.getComponent("ddz_item_createRoom");
        window4 = this.createItem4.getComponent("ddz_item_createRoom");
        window5 = this.createItem5.getComponent("ddz_item_createRoom");

        if(this.roundCount == 6){
            window.setSelectedState(true);
            window2.setSelectedState(false);
            window3.setSelectedState(false);
        }else if(this.roundCount == 15){
            window.setSelectedState(false);
            window2.setSelectedState(true);
            window3.setSelectedState(false);
        }else if(this.roundCount == 24){
            window.setSelectedState(false);
            window2.setSelectedState(false);
            window3.setSelectedState(true);
        }

        if(this.modeType == 0){
            window4.setSelectedState(true);
            window5.setSelectedState(false);
        }else {
            window4.setSelectedState(false);
            window5.setSelectedState(true);
        }

    },
    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},
});
