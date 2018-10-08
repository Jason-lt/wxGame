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
        titleSprite : {
            default : null,
            type : cc.Sprite
        },
        titleSpriteFrameList : [cc.SpriteFrame],

        chipSprite : {
            default : null,
            type : cc.Sprite
        },
        chipLabel : {
            default : null,
            type : cc.Label
        },
        addLabel : {
            default : null,
            type : cc.Label
        },
        couponSprite : {
            default : null,
            type : cc.Sprite
        },
        couponLabel : {
            default : null,
            type : cc.Label
        },

        // rewardSprite : {
        //     default : null,
        //     type : cc.Sprite
        // },
        // rewardSpriteFrameList : [cc.SpriteFrame],
        // rewardNumberLabel : {
        //     default : null,
        //     type : cc.Label
        // },

        detailRich : {
            default : null,
            type : cc.RichText
        },

        buttonLabel : {
            default : null,
            type : cc.Label
        },

        backButton : {
            default : null,
            type : cc.Button
        },

        rewardType : 0,
        getReward : false,

        originCount : 0,
        exCount : 0,
        reward : "",
        countDown : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {

    },

    onBlack : function () {

    },
    updateTipsInfo : function (getReward,resultValue) {
        this.couponSprite.node.active = false;
        this.couponLabel.node.active = false;
        this.chipSprite.node.active = false;
        this.chipLabel.node.active = false;
        this.addLabel.node.active = false;
        this.rewardType = 0;
        this.getReward = getReward;
        if(getReward){ //恭喜获得
            this.chipSprite.node.active = true;
            this.chipLabel.node.active = true;
            this.titleSprite.spriteFrame = this.titleSpriteFrameList[0];
            if(resultValue){
                this.chipLabel.string = hall.GlobalFuncs.getChipStringWithChipCount( resultValue.rewards[0].count);
            }
            return;
        }
        if(resultValue){ //恭喜中奖
            this.titleSprite.spriteFrame = this.titleSpriteFrameList[1];
            if( resultValue.coupon){
                // this.rewardSprite.spriteFrame = this.rewardSpriteFrameList[1];//奖券
                this.couponSprite.node.active = true;
                this.couponLabel.node.active = true;
                this.originCount = resultValue.coupon;
                this.reward = "coupon";
                this.couponLabel.string =hall.GlobalFuncs.getMoneyStringWithCoupons(resultValue.coupon);
                this.buttonLabel.string = "炫耀一下";
                this.rewardType = 1;
                this.backButton.node.active = true;
                if(resultValue.zhuanpan){
                    this.countDown = 90;
                    this.exCount = (resultValue.zhuanpan - 1) * this.originCount;
                }
            }
            if(resultValue.chip){
                this.chipSprite.node.active = true;
                this.chipLabel.node.active = true;
                // this.rewardSprite.spriteFrame = this.rewardSpriteFrameList[0];//金币
                this.originCount = resultValue.chip;
                if(this.reward == "coupon"){
                    this.addLabel.node.active = true;
                }
                this.reward = "chip";
                this.chipLabel.string = hall.GlobalFuncs.getChipStringWithChipCount(resultValue.chip);
                if(resultValue.chip >= scratch.GameWorld.normalConfig.shareChipCountLimit){
                    this.buttonLabel.string = "炫耀一下";
                    this.rewardType = 1;
                    this.backButton.node.active = true;
                }
                if(resultValue.zhuanpan){
                    if(resultValue.chip*resultValue.zhuanpan >= scratch.GameWorld.normalConfig.shareChipCountLimit){
                        this.buttonLabel.string = "炫耀一下";
                        this.rewardType = 1;
                        this.backButton.node.active = true;
                    }
                    this.countDown = 90;
                    this.exCount = (resultValue.zhuanpan - 1) * this.originCount;
                }
            }
            // if(resultValue.zhuanpan){
            //     this.countDown = 90;
            //     this.exCount = (resultValue.zhuanpan - 1) * this.originCount;
            // }
        }

    },

    nextAction : function () {
        if(this.rewardType == 1){
            scratch.Share.shareWithType(scratch.Share.onShareType.cardawardshare);
        }else {
            if(this.getReward){
                scratch.gameModel.queryNewInviteStatus();
                this.node.destroy();
            }else {
                this.backAction();
            }
        }
    },

    backAction : function () {
        var sceneName = 'scratch_main';
        var onLaunched = function () {
            // var logicScene = cc.director.getScene();
            // var no = logicScene.children[0];
        };
        cc.director.loadScene(sceneName,onLaunched);
    },

    update : function(dt) {
        if(this.countDown){
            this.countDown -- ;
            if(this.countDown == 0){
                if(this.reward == "coupon"){
                    this.couponLabel.string =hall.GlobalFuncs.getMoneyStringWithCoupons(this.originCount+this.exCount);
                }else {
                    this.chipLabel.string = hall.GlobalFuncs.getChipStringWithChipCount(this.originCount+this.exCount);
                }
                return;
            }
            if(this.countDown%2 == 0){
                if(this.reward == "coupon"){
                    this.couponLabel.string =hall.GlobalFuncs.getMoneyStringWithCoupons((this.originCount+(90-this.countDown)*this.exCount/90) >> 0);
                }else {
                    this.chipLabel.string = hall.GlobalFuncs.getChipStringWithChipCount((this.originCount+(90-this.countDown)*this.exCount/90) >> 0);
                }
            }
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }

    // start () {
    //
    // },


});
