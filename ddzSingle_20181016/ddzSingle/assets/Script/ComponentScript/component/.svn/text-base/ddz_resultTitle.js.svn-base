
// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_resultTitle');
// window.setDetailInformation("五",false);

cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel : {
            default : null,
            type : cc.Label
        },
        resultLabel : {
            default : null,
            type : cc.Label
        },

    },
    setTitle:function (number, result) {
        var numberString = "";
        numberString = "一二三四五六七"[number];
        var  resultS = result ? "成功" : "失败";

        this.titleLabel.string = "第"+numberString+"关";
        this.resultLabel.string = "闯关"+resultS;
        ddz.LOGD(this._TAG, this.titleLabel.string+this.resultLabel.string);
    },
});
