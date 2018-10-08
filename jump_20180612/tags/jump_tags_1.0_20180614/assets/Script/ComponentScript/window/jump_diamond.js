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
        diamondContentNode : cc.Node,
        haveFriendNode : cc.Node,
        nameLabel : {
            default : null,
            type : cc.Label
        },

        countLabel : {
            default : null,
            type : cc.Label
        },

        buttonTitleLabel : {
            default : null,
            type : cc.Label
        },

        state : 0
    },
    onCloseButton : function () {
        this.node.destroy();
    },
    onInviteAction : function () {
        if(this.state == 0){
            jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeInviteFriend);
        }else {
            this.node.destroy();
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onBlack : function () {

    },

    onLoad :function() {
    },

    changeStateWithInfo : function (state,result) {
        this.state = state;
        if(state == 0){
            jump.gameModel.queryMutualInviteAssets();
            ty.NotificationCenter.listen(jump.EventType.UPDATE_ASSETS_COUNT,this.getAsstsCount,this);

            // this.countLabel.string = " x"+jump.gameModel.assetsCounts;
            // this.diamondContentNode.active = true;
            // this.haveFriendNode.active = false;
            // this.buttonTitleLabel.string = "邀请群友";
        }else {
            //帮助该好友获得的钻石数量
            this.countLabel.string = " x"+result.counts;
            this.diamondContentNode.active = false;
            this.haveFriendNode.active = true;
            this.nameLabel.string = hall.GlobalFuncs.sliceStringToLength(result.name,10);
            this.buttonTitleLabel.string = "确 定";
        }
    },
    getAsstsCount : function (result) {
        this.countLabel.string = " x"+jump.gameModel.assetsCounts;
        this.diamondContentNode.active = true;
        this.haveFriendNode.active = false;
        this.buttonTitleLabel.string = "邀请群友";
    },
    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
