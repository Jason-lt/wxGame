"use strict";
cc._RF.push(module, '1c3ebEHYAdOjLw5MwLqbkYW', 'ddz_banner_close');
// Script/ComponentScript/component/ddz_banner_close.js

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

    properties: {},

    onLoad: function onLoad() {},

    onBannerClose: function onBannerClose() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["banner", "close"]);
        // hall.adManager.destroyBannerAd();
        hall.adManager.destroyWidthBannerAd();
        this.onClose();
    },

    updatePos: function updatePos(posx, posy) {
        this.node.x = posx;
        this.node.y = posy;
    },

    onClose: function onClose() {
        this.node.destroy();
        ddz.bannerCloseBtn = null;
    }
});

cc._RF.pop();