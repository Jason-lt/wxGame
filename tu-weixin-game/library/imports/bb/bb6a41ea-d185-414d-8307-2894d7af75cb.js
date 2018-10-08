"use strict";
cc._RF.push(module, 'bb6a4Hq0YVBTYMHKJTXr3XL', 'personInfoSelect');
// Script/ComponentScript/component/personInfoSelect.js

"use strict";

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
        infoLabel: cc.Label,
        bg: cc.Node
    },

    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.CHOOSE_BAR, this.setBgVisible, this);
    },

    updateInfo: function updateInfo(str, state, _proType, index) {
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

    setBgVisible: function setBgVisible(isShow) {
        this.bg.active = isShow;
    },

    onClickSelect: function onClickSelect() {
        var data = {};
        data._proType = this._proType;
        data.infoStr = this.infoStr;
        ty.NotificationCenter.trigger(ddz.EventType.SELECT_INFO, data);
        ty.NotificationCenter.trigger(ddz.EventType.CHOOSE_BAR, false);
        this.setBgVisible(true);
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    }
});

cc._RF.pop();