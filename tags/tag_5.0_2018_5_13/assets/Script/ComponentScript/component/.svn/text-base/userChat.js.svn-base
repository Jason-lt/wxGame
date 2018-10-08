/**
 * 互动表情
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "UserChat";

    },

    setArguments:function(tableId,_roomId,from,to,_url,_name,_parentScene){
        this.tableId = tableId;
        this.roomId = _roomId;
        this.from = from;
        this.to = to;
        this._url = _url;
        this._name = _name;
        this._parentScene = _parentScene;
    },
    
    properties: {
        emoButtonFlower : {     // 花
            default : null,
            type : cc.Button
        },
        emoButtonDiamond : {    // 钻石
            default : null,
            type : cc.Button
        },
        emoButtonEgg : {       // 鸡蛋
            default : null,
            type : cc.Button
        },
        emoButtonBrick : {      // 板砖
            default : null,
            type : cc.Button
        },

        bgBtn : {      //
            default : null,
            type : cc.Button
        },

        nameLabel : cc.Label,
        avatar : cc.Node,
        bgSpr : cc.Node,
        flowerSpr : cc.Node,
        diamondSpr : cc.Node,
        eggSpr : cc.Node,
        brickSpr : cc.Node,

        coolLabel_1 : cc.Label,
        coolLabel_2 : cc.Label,
        coolLabel_3 : cc.Label,
        coolLabel_4 : cc.Label,

        shade_1 : cc.Node,
        shade_2 : cc.Node,
        shade_3 : cc.Node,
        shade_4 : cc.Node,

        leftBtn : {
            default : null,
            type : cc.Button
        },

        rightBtn : {
            default : null,
            type : cc.Button
        },
    },

    updatePos: function(index) {
        this.index = index;
        if (index == ddz.LOCATION_SIGN.LEFT){
            this.bgSpr.setAnchorPoint(cc.p(0, 1));
            // this.bgSpr.x = -50;
            // this.bgSpr.y = 150;
            this.bgSpr.x = -285;
            this.bgSpr.y = 258;
            this.nameLabel.node.setAnchorPoint(cc.p(0, 0.5));
            this.nameLabel.node.x = -126;
            this.avatar.x = -175;
        }else if (index == ddz.LOCATION_SIGN.RIGHT){
            this.bgSpr.setAnchorPoint(cc.p(1, 1));
            // this.bgSpr.x = 50;
            // this.bgSpr.y = 150;
            this.bgSpr.x = 285;
            this.bgSpr.y = 258;
            this.nameLabel.node.setAnchorPoint(cc.p(1, 0.5));
            this.nameLabel.node.x = 126;
            this.avatar.x = 175;
        }

        this.avatar.active = true;
        this.nameLabel.active = true;

        var com = this.avatar.getComponent('Avatar');
        com.hideNameDisplay();
        if (this._name) {
            var slice_name = hall.GlobalFuncs.SliceStringToLength(this._name, 10);
            this.nameLabel.string = slice_name;
        }else {
            this.nameLabel.active = false;
        }

        if (this._url) {
            com.setAvatarUrl(this._url);
        }else {
            this.avatar.active = false;
        }

        var l_pos = this.node.convertToNodeSpace(this._parentScene.head_left.convertToWorldSpace(cc.p(0,0)));
        this.leftBtn.node.x = l_pos.x;
        this.leftBtn.node.y = l_pos.y;

        var r_pos = this.node.convertToNodeSpace(this._parentScene.head_regiht.convertToWorldSpace(cc.p(0,0)));
        this.rightBtn.node.x = r_pos.x;
        this.rightBtn.node.y = r_pos.y;
    },

    onLoad :function() {
        this.emoButtonFlower.node.on("click",this.onEmoButtonFlower,this);
        this.emoButtonDiamond.node.on("click",this.onEmoButtonDiamond,this);
        this.emoButtonEgg.node.on("click",this.onEmoButtonEgg,this);
        this.emoButtonBrick.node.on("click",this.onEmoButtonBrick,this);
        this.bgBtn.node.on("click",this.onBgBtn,this);
        
        this.popWinAction(true);
        this.btnCooling(false,0);
    },

    isCooling:function(num){
        if(num > 0) {
            this.btnCooling(true,num)
        }else
        {
            this.btnCooling(false,0);
        }
    },

    // 按钮冷却
    btnCooling: function(isVal,num) {
        for (var i = 1; i <= 4; i++){
            this['coolLabel_' + i].node.active = isVal;
            this['coolLabel_' + i].string = num;
            this['shade_' + i].active = isVal;
        }
        this.emoButtonFlower.node.active = !isVal;
        this.emoButtonDiamond.node.active = !isVal;
        this.emoButtonEgg.node.active = !isVal;
        this.emoButtonBrick.node.active = !isVal;
    },

    // 点击 花
    onEmoButtonFlower : function () {
        // roomId:6789, roomId现在暂时写死的,后面会变动
        ddz.MsgFactory.sendTableChat(this.roomId , this.tableId, this.from, this.to, 'flower', 1);
        this.btnCooling();
        this.popWinAction(false);
    },

    // 点击 钻石
    onEmoButtonDiamond : function () {
        ddz.MsgFactory.sendTableChat(this.roomId , this.tableId, this.from, this.to, 'diamond', 1);
        this.btnCooling();
        this.popWinAction(false);
    },

    // 点击 鸡蛋
    onEmoButtonEgg : function () {
        ddz.LOGD(null, "onEmoButtonEgg: 点击鸡蛋" );
        ddz.MsgFactory.sendTableChat(this.roomId , this.tableId, this.from, this.to, 'egg', 1);
        this.btnCooling();
        this.popWinAction(false);
    },

    // 点击 板砖
    onEmoButtonBrick : function () {
        ddz.MsgFactory.sendTableChat(this.roomId , this.tableId, this.from, this.to, 'brick', 1);
        this.btnCooling();
        this.popWinAction(false);
    },

    onBgBtn : function () {
        this.popWinAction(false);
    },

    onClickLeftBtn : function () {
        ty.NotificationCenter.trigger(ddz.EventType.CLICK_HEAD_BTN, ddz.LOCATION_SIGN.LEFT);
    },

    onClickRightBtn : function () {
        ty.NotificationCenter.trigger(ddz.EventType.CLICK_HEAD_BTN, ddz.LOCATION_SIGN.RIGHT);
    },

    // 点击头像区域,弹出表情面板


    // 弹出窗的显示和隐藏效果
    popWinAction:function(isVisible){
        var that = this;
        this.bgSpr.stopAllActions();
        var scaleAction = null;
        var actionTime = 0.2;

        if(isVisible == true){
            this.bgSpr.setScale(0);
            scaleAction = cc.scaleTo(actionTime,1);
            this.bgSpr.runAction(scaleAction);
        }else{
            this.bgBtn.active = false;
            scaleAction = cc.scaleTo(actionTime - 0.15,0);
            this.bgSpr.runAction(cc.sequence(scaleAction,cc.callFunc(function () {
                that.setChatNode(false);
            },this.bgSpr)));
        }
    },

    setChatNode:function(isActive,_reSet){
        this.node.active = isActive;
        this.popWinAction(isActive);
        if (_reSet) {
            this.btnCooling(false,0);
        }
    },
    
});
