
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
        messageNode : {
            default : null,
            type : cc.Node
        },
        messageCount : {
            default : null,
            type : cc.Label
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
        // this.updateMessageCount();
        ddz.gameModel.queryInviteInfo();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_COUNT, this.updateMessageCount.bind(this), this);
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

    updateMessageCount : function () {
        var count = ddz.gameModel.allCount;
        hall.LOGD("=="," file = [ddz_buggomButtons] fun = [updateMessageCount] count = " + count);
        if (count && count > 0) {
            this.messageNode.active = true;
            if (count > 99){
                count = 99;
            }
            this.messageCount.string = count;
        }else {
            this.messageNode.active = false;
        }
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});
