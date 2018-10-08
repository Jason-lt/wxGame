/**
 * 互动表情
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "UserChat";

    },

    setArguments:function(tableId,_roomId,from,to,_url,_name){
        this.tableId = tableId;
        this.roomId = _roomId;
        this.from = from;
        this.to = to;
        this._url = _url;
        this._name = _name;

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
    },

    updatePos: function(index) {
        this.index = index;
        if (index == ddz.LOCATION_SIGN.LEFT){
            this.bgSpr.x = -50;
            this.bgSpr.y = 150;
            this.nameLabel.node.setAnchorPoint(cc.p(0, 0.5));
            this.nameLabel.node.x = -126;
            this.avatar.x = -175;
        }else if (index == ddz.LOCATION_SIGN.RIGHT){
            this.bgSpr.x = 50;
            this.bgSpr.y = 150;
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
    },

    onLoad :function() {
        this.emoButtonFlower.node.on("click",this.onEmoButtonFlower,this);
        this.emoButtonDiamond.node.on("click",this.onEmoButtonDiamond,this);
        this.emoButtonEgg.node.on("click",this.onEmoButtonEgg,this);
        this.emoButtonBrick.node.on("click",this.onEmoButtonBrick,this);
        this.bgBtn.node.on("click",this.onBgBtn,this);

        // this.avatar.node.setContentSize(102, 102);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COOLING_TIMER, this.isCooling, this);
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_REMOVE_CHAT, this.removeChat(), this);
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
        this.coolLabel_1.node.active = isVal;
        this.coolLabel_1.string = num;

        this.coolLabel_2.node.active = isVal;
        this.coolLabel_2.string = num;

        this.coolLabel_3.node.active = isVal;
        this.coolLabel_3.string = num;

        this.coolLabel_4.node.active = isVal;
        this.coolLabel_4.string = num;

        this.shade_1.active = isVal;
        this.shade_2.active = isVal;
        this.shade_3.active = isVal;
        this.shade_4.active = isVal;

        var isActive = !isVal;

        this.emoButtonFlower.node.active = isActive;
        this.emoButtonDiamond.node.active = isActive;
        this.emoButtonEgg.node.active = isActive;
        this.emoButtonBrick.node.active = isActive;

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
        ddz.LOGD(null, "onBgBtn: 点击背景" );
        this.popWinAction(false);
    },

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
                // that.removeChat();
                // ty.NotificationCenter.ignore(ddz.EventType.UPDATE_COOLING_TIMER, this.isCooling, this);
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

    removeChat:function(){
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_COOLING_TIMER, this.isCooling, this);
        // ty.NotificationCenter.ignore(ddz.EventType.UPDATE_REMOVE_CHAT, this.windClose(), this);
        // this.node.removeFromParent();
    }

});
