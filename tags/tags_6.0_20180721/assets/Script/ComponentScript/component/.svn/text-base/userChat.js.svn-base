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
    },
    
    properties: {
        bgBtn : {
            default : null,
            type : cc.Node
        },
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

        nameLabel : cc.Label,
        avatar : cc.Node,

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

        infoNode : cc.Node,

        chatPanel : cc.Node,

        info_1 : cc.Label,
        info_2 : cc.Label,
        info_3 : cc.Label,
        info_4 : cc.Label,
    },

    updatePos: function() {
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

    hideChat:function(isShow){
        this.chatPanel.active = isShow;
    },

    onLoad :function() {
        this.emoButtonFlower.node.on("click",this.onEmoButtonFlower,this);
        this.emoButtonDiamond.node.on("click",this.onEmoButtonDiamond,this);
        this.emoButtonEgg.node.on("click",this.onEmoButtonEgg,this);
        this.emoButtonBrick.node.on("click",this.onEmoButtonBrick,this);

        var size = cc.director.getWinSize();
        this.bgBtn.setContentSize(size);

        this.popWinAction(true);
        this.btnCooling(false,0);

        this.info_1.string = "";
        this.info_2.string = "";
        this.info_3.string = "";
        this.info_4.string = "";
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

    updatePersonalInfo:function(_playinfo,_type){
        // {"playcount":0,"winrate":0,"windoubles":0,"winchip":0},
        // {"playcount":0,"winrate":0,"throughcount":0,"wincoupon":0}
        // {"signcount":0,"rewardrate":0,"riserate":0,"get1st":0},
        switch (_type){
            case 'chip':{
                this.info_1.string = "对局次数：" + _playinfo.playcount;
                this.info_2.string = "胜率：" + parseInt(_playinfo.winrate*100) + "%";
                this.info_3.string = "最大连胜：" + _playinfo.winstreakmax;
                this.info_4.string = "总赢取：" + _playinfo.winchip;
                break;
            }
            case 'friend':{
                this.info_1.string = "对局次数：" + _playinfo.playcount;
                this.info_2.string = "胜率：" + parseInt(_playinfo.winrate*100) + "%";
                this.info_3.string = "最高倍数：" + _playinfo.windoubles;
                this.info_4.string = "总赢分：" + _playinfo.winchip;
                break;
            }
            case 'chuangguan':{
                this.info_1.string = "闯关次数：" + _playinfo.playcount;
                this.info_2.string = "胜率：" + parseInt(_playinfo.winrate*100) + "%";
                this.info_3.string = "通关数：" + _playinfo.throughcount;
                this.info_4.string = "总奖金：" + _playinfo.wincoupon/100;
                break;
            }
            case 'match':{
                this.info_1.string = "参赛次数：" + _playinfo.signcount;
                this.info_2.string = "晋级率：" + parseInt(_playinfo.riserate*100) + "%";
                this.info_3.string = "冠军次数：" + _playinfo.get1st;
                this.info_4.string = "获奖率：" + parseInt(_playinfo.rewardrate*100) + "%";
                break;
            }
        }
    },

    // 点击 花
    onEmoButtonFlower : function () {
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

    onClose : function () {

        this.popWinAction(false);
    },

    // 刷新个人信息
    updateInfo:function(){

    },

    // 弹出窗的显示和隐藏效果
    popWinAction:function(isVisible){
        if(isVisible == true){
            this.node.active = true;
        }else{
            this.setChatNode(false);
        }
    },

    setChatNode:function(isActive,_reSet){
        this.node.active = isActive;
        // this.popWinAction(isActive);
        if (_reSet) {
            this.btnCooling(false,0);
        }
    },
    
});
