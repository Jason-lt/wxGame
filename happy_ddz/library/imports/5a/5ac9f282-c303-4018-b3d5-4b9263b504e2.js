"use strict";
cc._RF.push(module, '5ac9fKCwwNAGLPVS5JjtQTi', 'ddz_zuanShiAni');
// Script/ComponentScript/component/ddz_zuanShiAni.js

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
        drawButton: { // 花
            default: null,
            type: cc.Button
        },
        diamondAniNode: cc.Node,
        chipAniNode: cc.Node,
        hongBaoAniNode: cc.Node,
        getchipAniNode: cc.Node,
        getJiPaaiQiAni: cc.Node,
        countNumberLabel: cc.Label,
        tipsRichText: cc.RichText,
        parentScene: {
            default: null
        }
    },

    onLoad: function onLoad() {},

    setTipsRichText: function setTipsRichText(isVal) {
        this.tipsRichText.node.active = false;
        if (isVal) {
            this.tipsRichText.node.active = true;
        }
    },

    setCountWithNumber: function setCountWithNumber(number) {
        this.countNumberLabel.string = "+" + number;
    },
    changeDiamondToChip: function changeDiamondToChip() {
        this.diamondAniNode.active = false;
        this.chipAniNode.active = true;
        this.getJiPaaiQiAni.active = false;
        var ani = this.getchipAniNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {});
        anim.play();
    },
    changeDiamondToHongbao: function changeDiamondToHongbao() {
        this.diamondAniNode.active = false;
        this.hongBaoAniNode.active = true;
        this.getJiPaaiQiAni.active = false;
        var ani = this.hongBaoAniNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {});
        anim.play();
    },
    changeDiamondToJiPaiQi: function changeDiamondToJiPaiQi() {
        this.diamondAniNode.active = false;
        this.hongBaoAniNode.active = false;
        this.getJiPaaiQiAni.active = true;
        var ani = this.getJiPaaiQiAni.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {});
        anim.play();
    },
    getDiamond: function getDiamond() {
        this.node.removeFromParent();
        if (this.parentScene && this.parentScene.getDiamondAniFinish) {
            this.parentScene.getDiamondAniFinish();
        }

        ty.NotificationCenter.trigger(ddz.EventType.BOX_ON_CLOSE);
    }
});

cc._RF.pop();