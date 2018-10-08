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
        infoLabel:cc.Label,
    },

    onLoad:function(){

    },

    updateInfo:function(str,state,_proType,index){
        this._proType = _proType;
        this.infoStr = str;
        // if (state == 0){ // 星座
        //     if (index != null) {
        //         this.iconSpr.spriteFrame = this.conSprFrame[index];
        //     }
        //
        // }else if (state == 1){ // 地区
        //     this.iconSpr.spriteFrame = this.otherSprFrame[1];
        // }
        this.infoLabel.string = str;
    },

    onClickSelect:function(){
        var data = {};
        data._proType = this._proType;
        data.infoStr = this.infoStr;
        ty.NotificationCenter.trigger(ddz.EventType.SELECT_INFO, data);
    },
});
