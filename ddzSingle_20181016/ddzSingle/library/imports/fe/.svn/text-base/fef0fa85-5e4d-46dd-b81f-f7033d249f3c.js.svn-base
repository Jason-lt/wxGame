"use strict";
cc._RF.push(module, 'fef0fqFXk1G3bgf9wM9JJ88', 'ddz_resultTitle');
// Script/ComponentScript/component/ddz_resultTitle.js

"use strict";

// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_resultTitle');
// window.setDetailInformation("五",false);

cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: {
            default: null,
            type: cc.Label
        },
        resultLabel: {
            default: null,
            type: cc.Label
        }

    },
    setTitle: function setTitle(number, result) {
        var numberString = "";
        numberString = "一二三四五六七"[number];
        var resultS = result ? "成功" : "失败";

        this.titleLabel.string = "第" + numberString + "关";
        this.resultLabel.string = "闯关" + resultS;
        ddz.LOGD(this._TAG, this.titleLabel.string + this.resultLabel.string);
    }
});

cc._RF.pop();