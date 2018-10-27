"use strict";
cc._RF.push(module, 'b894aWIy8tOh7/ialb2cOIA', 'ddz_gameDetail_cell');
// Script/ComponentScript/component/ddz_gameDetail_cell.js

"use strict";

/**
 * 战绩 信息
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._TAG = "ddz_gameDetail_cell";
    },

    properties: {
        numLabel: cc.Label,
        scoreLable_1: cc.Label,
        scoreLable_2: cc.Label,
        scoreLable_3: cc.Label
    },

    updateinfo: function updateinfo(_num, myIndex, info) {

        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        // this.numLabel.string = "第" + _num + "局";
        this.numLabel.string = _num + "";

        if (info) {
            this['scoreLable_1'].string = info[myIndex - 1] > 0 ? "+" + info[myIndex - 1] : info[myIndex - 1];
            this['scoreLable_2'].string = info[rightindex - 1] > 0 ? "+" + info[rightindex - 1] : info[rightindex - 1];
            this['scoreLable_3'].string = info[leftindex - 1] > 0 ? "+" + info[leftindex - 1] : info[leftindex - 1];
        } else {
            this['scoreLable_1'].string = '--';
            this['scoreLable_2'].string = '--';
            this['scoreLable_3'].string = '--';
        }
    },

    onLoad: function onLoad() {}

});

cc._RF.pop();