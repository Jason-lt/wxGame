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
        backSprite : cc.Sprite,
        createItem4 : {
            default : null,
            type : cc.Node
        },
        createItem5 : {
            default : null,
            type : cc.Node
        },
        createButton : cc.Button,

        creatItem : {
            default : null,
            type : cc.Prefab
        },
        roundCount : 6,
        modeType : 0,
        roundWindowList : []

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
        //
        // hall.LOGE("null","========"+this.roundCount+"==="+this.modeType);
        // return;
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.Share.shareKeywordReplace.totalRound = this.roundCount;
        ddz.Share.shareKeywordReplace.goodCard = this.modeType == 0 ? "标准" : "炸弹";
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomCreateClick, []);
        // this.playEndAnimation();
        if (ddz.matchModel.getCurWaitInfo()){
            ddz.MsgFactory.saveMatch();
        } else {
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
        ddz.friendModel.getHisToryInfo();
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

        ddz.friendModel.getFriendConf();
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_GET_CONF,this.getFriendConfigAction,this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_CHANGE_ROUND_SELECT,this.cahngeFriendRoundConfigAction,this);

        this.roundCount = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.friendModel.CREATE_ROUND_COUNT, 6);
        this.modeType = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.friendModel.CREATE_MODE_TYPE, 0);

        var window4,window5;
        window4 = this.createItem4.getComponent("ddz_item_createRoom");
        window5 = this.createItem5.getComponent("ddz_item_createRoom");
        if(this.modeType == 0){
            window4.setSelectedState(true);
            window5.setSelectedState(false);
        }else {
            window4.setSelectedState(false);
            window5.setSelectedState(true);
        }

        this.createButton.interactable = false;
    },
    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
    },
    getFriendConfigAction : function (value) {
        this.createButton.interactable = true;
        var rounds = value.rounds;
        var xList = [-106,34,174];
        var windowList = [];
        var haveRound = false;
        for (var i = 0 ; i < rounds.length ; i ++){
            var window = cc.instantiate(this.creatItem);
            window.x = xList[i];
            window.y = 58;
            this.backSprite.node.addChild(window);
            var windowManager = window.getComponent("ddz_item_createRoom");
            windowManager.type = 1;
            windowManager.setRoundCount(rounds[i].nRound);
            windowList.push(windowManager);
            if(this.roundCount == rounds[i].nRound){
                windowManager.setSelectedState(true);
                haveRound = true;
            }else {
                windowManager.setSelectedState(false);
            }
        }
        this.roundWindowList = windowList;
        if(!haveRound){
            this.roundCount = rounds[0].nRound;
            var windowmanager = this.roundWindowList[0];
            windowmanager.setSelectedState(true);
        }
    },
    cahngeFriendRoundConfigAction : function (round) {
        for (var i = 0 ; i < this.roundWindowList.length ; i ++ ){
            var windowmanager = this.roundWindowList[i];
            if(windowmanager.count == round){
                windowmanager.setSelectedState(true);
            }else {
                windowmanager.setSelectedState(false);
            }
        }
        this.roundCount = round;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},
});
