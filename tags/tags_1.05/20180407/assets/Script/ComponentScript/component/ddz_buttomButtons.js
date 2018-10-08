
cc.Class({
    extends: cc.Component,

    properties: {
        rankButton : {
            default : null,
            type : cc.Button
        },
        diamondButton : {
            default : null,
            type : cc.Button
        },
        getRewardButton : {
            default : null,
            type : cc.Button
        },
        parentScene: {
            default: null,
            serializable: false
        }
    },

    onLoad :function () {
        this.rankButton.node.on("click",this.onRankButton,this);
        this.getRewardButton.node.on("click",this.onGetRewardButton,this);
        this.diamondButton.node.on("click",this.onDiamondButton,this);
    },
    onRankButton : function () {
        ddz.LOGD(null, "onRankButton");
        this.parentScene.onRankButton();
    },
    onGetRewardButton : function () {
        ddz.LOGD(null, "onGetRewardButton");
        this.parentScene.onGetRewardButton();
    },
    onDiamondButton : function () {
        ddz.LOGD(null, "onDiamondButton");
        this.parentScene.onDiamondButton();
    },


    // update (dt) {},
});
