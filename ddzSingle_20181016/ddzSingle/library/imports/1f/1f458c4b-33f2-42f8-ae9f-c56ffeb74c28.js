"use strict";
cc._RF.push(module, '1f458xLM/JC+K6fxW/+t0wo', 'ddz_rewardCell');
// Script/ComponentScript/component/ddz_rewardCell.js

"use strict";

// var ddz_rewardCell = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_rewardCell);
// var window = ddz_rewardCell.getComponent('ddz_rewardCell');
// window.setDetailInformation("我们都是好孩子","一直都是好孩子","+58.69","2018-02-05");
cc.Class({
    extends: cc.Component,

    properties: {
        bgSpr: {
            default: null,
            type: cc.Node
        },
        titleLabel: {
            default: null,
            type: cc.Label
        },
        stateLabel: {
            default: null,
            type: cc.Label
        },
        numberLabel: {
            default: null,
            type: cc.Label
        },
        dateLabel: {
            default: null,
            type: cc.Label
        },
        bottomLine: {
            default: null,
            type: cc.Sprite
        }

    },

    addDataWithObject: function addDataWithObject(objc) {
        // var  arr = objc.data;
        this.setDetailInformation(objc);
    },
    setDetailInformation: function setDetailInformation(resultMap) {
        this.titleLabel.string = resultMap.titleS;
        if (resultMap.numberString != '--') {
            this.numberLabel.string = hall.GlobalFuncs.getMoneyStringWithCoupons(parseFloat(resultMap.numberString));
        } else {
            this.numberLabel.string = resultMap.numberString;
        }
        this.dateLabel.string = resultMap.timeS;
        // this.stateLabel.string = resultMap.stateS;
        this.stateLabel.string = "";
        // if (this.index){
        //     if (this.index % 2 == 0){
        //         // this.bgSpr.active = true;
        //         this.setBgSpr(true);
        //     }else {
        //         // this.bgSpr.active = false;
        //         this.setBgSpr(false);
        //     }
        // }
    },

    setBgSpr: function setBgSpr(_isActive) {
        this.bgSpr.active = _isActive;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.setDetailInformation("--","--","--","--");
    }

    // update (dt) {},
});

cc._RF.pop();