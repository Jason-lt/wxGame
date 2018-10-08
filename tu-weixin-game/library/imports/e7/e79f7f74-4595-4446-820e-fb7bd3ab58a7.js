"use strict";
cc._RF.push(module, 'e79f790RZVERoIO+3vTq1in', 'ddz_window_save_match_result');
// Script/ComponentScript/window/ddz_window_save_match_result.js

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
        titleLable: {
            default: null,
            type: cc.Label
        },
        tipDes: {
            default: null,
            type: cc.Label
        },
        matchInfo1: {
            default: null,
            type: cc.Label
        },
        matchInfo2: {
            default: null,
            type: cc.Label
        },
        OKButton: {
            default: null,
            type: cc.Button
        }
    },

    onLoad: function onLoad() {
        //this.matchInfoList = ['轮次: 7/9', '积分: 666'];
        //this.updateByMatchInfo(this.matchInfoList);
    },

    updateByMatchInfo: function updateByMatchInfo(matchInfoList) {
        if (matchInfoList.length >= 1) {
            this.matchInfo1.node.active = true;
            this.matchInfo1.string = matchInfoList[0];
            this.matchInfo2.node.active = false;
        }

        if (matchInfoList.length >= 2) {
            this.matchInfo2.node.active = true;
            this.matchInfo2.string = matchInfoList[1];
        }
        ddz.matchModel.cleanWaitInfo();
    },

    removeAni: function removeAni() {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        this.node.removeFromParent();
    },

    onClickBack: function onClickBack() {
        this.removeAni();
        hall.GlobalFuncs.popScene();
        ty.NotificationCenter.trigger(ddz.EventType.ARENA_BACK_TO_SCENE);
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});

cc._RF.pop();