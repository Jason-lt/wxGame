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
        backBg : {
            default : null,
            type  : cc.Button
        },
        coloseButton : {
            default : null,
            type : cc.Button
        },

        centerButton : {
            default : null,
            type : cc.Button
        },
        
        btnText:cc.Label,
        descLabel:cc.Label,
        tips_1:cc.RichText,
        tips_2:cc.RichText,

        boxSprite:cc.Sprite,
        boxSpritex:cc.Sprite,
        boxSpriteFrame:[cc.SpriteFrame],

        bgLight:cc.Node,

    },

    onLoad : function () {
        this.isAction = true;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TREASURE_BOX, this.playEndAnimation, this);
        ty.NotificationCenter.listen(ddz.EventType.BOX_ON_CLOSE, this.onClose, this);

        var ani = this.node.getComponent(cc.Animation);
        var anim1 = ani.getAnimationState('awad_tips_show_box');
        var that = this;
        anim1.once("finished", function () {
            that.isAction = false;
            // var anim2 = ani.getAnimationState('awad_tips_show_xunhuan');
            // anim2.play();

        });
        anim1.play();
    },

    playAnimationAfterShareWithType : function (shareType) {
        var bt = ddz.gameModel.getBoxShareSuccessTipsJson();
        // if (type == ddz.Share.onShareType.clickStatShareTypeGiveProp) {
        //     hall.MsgBoxManager.showToast({title : '宝箱可以重复送给更多的朋友哦~'});
        // }

        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeGiveProp) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                if (!ddz.gameModel.isBringVersion) {
                    var tips_1 = '请分享到微信群哦~';
                    if (bt && bt.shareToFriend) {
                        tips_1 = bt.shareToFriend;
                    }
                    hall.MsgBoxManager.showToast({title : tips_1});
                }

                break;
            case 2:
                if (!ddz.gameModel.isBringVersion) {
                    if (ty.UserInfo.isInBSGS) {
                        var tips_2 = ['点击分享卡片可以获得奖励~'];
                        if (bt && bt.shareToCrowd) {
                            tips_2 = bt.shareToCrowd;
                        }
                        var index = hall.GlobalFuncs.getRandomNumberBefore(tips_2.length);
                        hall.MsgBoxManager.showToast({title : tips_2[index]});
                    }else {
                        hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                    }
                }
                break;
            case 3:
                if (ty.UserInfo.isInBSGS) {
                    if (!ddz.gameModel.isBringVersion) {
                        var tips_2 = ['分享到多个群可以获得多个奖励哦~'];
                        if (bt && bt.shareToCrowd) {
                            tips_2 = bt.shareToCrowd;
                        }
                        var index = hall.GlobalFuncs.getRandomNumberBefore(tips_2.length);
                        hall.MsgBoxManager.showToast({title : tips_2[index]});
                    }
                }else {
                    ddz.gameModel.getBoxReward(parseInt(ty.UserInfo.userId),this.treasureID);
                }

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },
    
    setBoxShareInfo:function(info,windoubles){
        if (info) {
            this.treasureID = info.boxId;
            this.isClickGet = info.getRewardDirectly == 1 ? true : false;
            this.descLabel.string = info.desc;
            this.desc = info.desc;
        }
        

        if (this.isClickGet){
            this.btnText.string = "打开宝箱";
        }else {
            if (ty.UserInfo.isInBSGS){
                this.btnText.string = "炫耀到群";
                this.tips_1.node.active = false;
                this.tips_2.node.active = false;
            }else {
                this.btnText.string = "分享到群领取";
            }
        }
        switch(this.desc){
            case "青铜宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[0];
                this.boxSpritex.spriteFrame = this.boxSpriteFrame[0];
                break;
            case "白银宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[1];
                this.boxSpritex.spriteFrame = this.boxSpriteFrame[1];
                break;
            case "黄金宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[2];
                this.boxSpritex.spriteFrame = this.boxSpriteFrame[2];
                break;
            case "春天宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[3];
                this.boxSpritex.spriteFrame = this.boxSpriteFrame[3];
                break;
            default:
                break;
        }
    },

    clickCenterBtn:function(){
        if(this.isClickGet){
            ddz.gameModel.getBoxReward(parseInt(ty.UserInfo.userId),this.treasureID);
            this.onClose();
        }else{
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGiveProp);
        }
    },

    playEndAnimation : function () {
        if (this.node) {
            this.node.destroy();
        }
    },

    onClose:function () {
        if (this.isAction){
            return
        }

        var ani = this.node.getComponent(cc.Animation);
        var anim_1 = ani.getAnimationState('awad_tips_show_box');
        anim_1.stop();

        var anim_2 = ani.getAnimationState('awad_tips_show_xunhuan');
        anim_2.stop();

        if (ddz.matchResultPanel) {
            ddz.matchResultPanel.showResults(true);
        }
        
        this.isAction = true;
        this.playEndAnimation();
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },

    update:function (dt) {
        if (!this.isAction){
            this.bgLight.rotation += 0.5;
        }

    },
});

