"use strict";
cc._RF.push(module, '7f3d3CZMcZOl4eIBON5MrO/', 'guideIcon');
// Script/ComponentScript/component/guideIcon.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        redDot: cc.Node

    },
    onLoad: function onLoad() {},

    onClickIcon: function onClickIcon() {
        ddz.gameModel.getShoreCut();
        hall.GlobalFuncs.onCollectDeskTop();
    }
});

cc._RF.pop();