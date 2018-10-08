

// var ddz_rewardCell = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_rewardCell);
// var window = ddz_rewardCell.getComponent('ddz_rewardCell');
// window.setDetailInformation("我们都是好孩子","一直都是好孩子","+58.69","2018-02-05");
cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel : {
            default : null,
            type : cc.Label
        },
        stateLabel : {
            default : null,
            type : cc.Label
        },
        numberLabel : {
            default : null,
            type : cc.Label
        },
        dateLabel : {
            default : null,
            type : cc.Label
        },
        bottomLine : {
            default : null,
            type : cc.Sprite
        },


    },

    addDataWithObject : function (objc) {
        // var  arr = objc.data;
        this.setDetailInformation(objc);
    },
    setDetailInformation:function (resultMap) {
        this.titleLabel.string = resultMap.titleS;
        if(resultMap.numberString != '--'){
            this.numberLabel.string = hall.GlobalFuncs.getMoneyStringWithCoupons(parseFloat(resultMap.numberString));
        }else {
            this.numberLabel.string = resultMap.numberString;
        }
        this.dateLabel.string = resultMap.timeS;
        // this.stateLabel.string = resultMap.stateS;
        this.stateLabel.string = "";
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        // this.setDetailInformation("--","--","--","--");
    },


    // update (dt) {},
});
