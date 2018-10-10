"use strict";
cc._RF.push(module, '79ecff30gtA062ONiSPI4nd', 'shot_addScoreAni');
// Script/ComponentScript/component/shot_addScoreAni.js

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
        addScoreLabel: {
            default: null,
            type: cc.Label
        }
    },
    setAddScore: function setAddScore(score) {
        this.addScoreLabel.string = "+" + score;
        // var ani = this.node.getComponent(cc.Animation);
        // var clipName = ani.getClips()[0].name;
        // var addScoreAnimation = ani.getAnimationState(clipName);
        // // addScoreAnimation.once("finished", function () {
        // // });
        // addScoreAnimation.play();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();