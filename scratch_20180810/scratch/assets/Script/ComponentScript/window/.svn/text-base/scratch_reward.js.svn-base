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
        rewardTitleLabel : {
            default : null,
            type : cc.Label
        },
        rewardSprite : {
            default : null,
            type : cc.Sprite
        },
        rewardNeed : {
            default : null,
            type : cc.Label
        },

        rewardDetailRich : {
            default : null,
            type : cc.RichText
        },

        inviteButton : {
            default : null,
            type : cc.Button
        },
        buttonTitleLabel : {
            default : null,
            type : cc.Label
        },
        resultMap : null
    },

    onBlack : function () {

    },

    backAction : function () {
        this.node.destroy();
    },
    onLoad : function() {
        this.inviteButton.enableAutoGrayEffect = true;
        this.inviteButton.interactable = false;
        ty.NotificationCenter.listen(scratch.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },
    updateTipsInfo : function (resultMap) {
        this.resultMap = resultMap;
        this.rewardTitleLabel.string = resultMap.displayName ;
        scratch.Share.shareKeywordReplace.jdcardrmb = parseInt(resultMap.displayName);

        ty.SystemInfo.getImageWithURL(resultMap.pic,this.rewardSprite);
        this.rewardNeed.string = hall.GlobalFuncs.getChipStringWithChipCount(resultMap.cost.count);

        var gapCount = resultMap.cost.count - hall.ME.udataInfo.m_chip;
        gapCount = gapCount< 0 ? 0 : gapCount;
        if(gapCount){
            if(ty.SystemInfo.isCheckVersion){
                this.rewardDetailRich.node.active = false;
                this.buttonTitleLabel.string = "兑换";
            }else {
                this.inviteButton.interactable = true;
                this.rewardDetailRich.node.active = true;
                this.rewardDetailRich.string = "<color=#C5AA3B>还差</c><color=#FFE400>"+hall.GlobalFuncs.getChipStringWithChipCount(gapCount)+"</color>" +
                    "<color=#C5AA3B>游戏币可兑换<br/>每邀请一名好友即可获得</c><color=#FFE400>" +
                    hall.GlobalFuncs.getChipStringWithChipCount(scratch.GameWorld.normalConfig.inviteGetRewardCount)+"</color><color=#C5AA3B>游戏币</c>";
                this.buttonTitleLabel.string = "邀请好友";
            }
        }else {
            this.inviteButton.interactable = true;
            this.rewardDetailRich.node.active = false;
            this.buttonTitleLabel.string = "兑换";
        }
    },

    inviteFriendAction : function () {
        if(this.buttonTitleLabel.string == "邀请好友"  ){
            scratch.Share.shareWithType(scratch.Share.onShareType.jdcardexchangeshare);
        }else {
            scratch.GlobalFuncs.showChangePanel(this.resultMap);
        }
    },
    //
    // playAnimationAfterShareWithType : function () {
    //     scratch.GlobalFuncs.showChangePanel(this.resultMap);
    // },

    playAnimationAfterShareWithType : function (shareType) {
        if(shareType != scratch.Share.onShareType.jdcardexchangeshare){
            return;
        }
        switch (scratch.Share.resultType){
            case scratch.Share.ShareState.isNotAGroupChat : {
                hall.MsgBoxManager.showToast({"title":"送给群友试试吧！"});
                break;
            }
            case scratch.Share.ShareState.repetitionGroupChat : {
                hall.MsgBoxManager.showToast({"title":"频繁打扰同一个群不礼貌哦！"});
                break;
            }
            case scratch.Share.ShareState.suscessShare : {
                scratch.GlobalFuncs.showChangePanel(this.resultMap);
                break;
            }
            case scratch.Share.ShareState.failToGetShareTicket : {
                break;
            }
            case scratch.Share.ShareState.failToShare : {
                hall.MsgBoxManager.showToast({"title":"分享失败"});
                break;
            }
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }


    // LIFE-CYCLE CALLBACKS:


    //
    // start () {
    //
    // },

    // update (dt) {},
});
