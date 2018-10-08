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
        cellSprite : {
            default : null,
            type : cc.Sprite
        },
        moneyLabel : {
            default : null,
            type : cc.Label
        },
        moneySprite : {
            default : null,
            type : cc.Sprite
        },
        moneySpriteFrameList : [cc.SpriteFrame],

        freeNode : {
            default : null,
            type : cc.Node
        },
        tipsNode : {
            default : null,
            type : cc.Node
        },
        tipsLabel : {
            default : null,
            type : cc.Label
        },


        cardID : "",
        conditionDic : null
    },

    addDataWithObject : function (objc) {
        this.cardID = objc;
        if(objc == "2000"){
            this.freeNode.active = true;
            this.cellSprite.node.active = false;
        }else {
            this.freeNode.active = false;
            this.cellSprite.node.active = true;
            ty.SystemInfo.getImageWithURL(ty.SystemInfo.cdnCardPath+objc+".png",this.cellSprite);
            this.conditionDic = scratch.GameWorld.normalConfig.cardConditionDic[this.cardID];
            if(scratch.GameWorld.cardListInfo[objc][4]){
                this.moneyLabel.string = ""+hall.GlobalFuncs.getMoneyStringWithCouponsToZero(scratch.GameWorld.cardListInfo[objc][4]);
                this.moneySprite.spriteFrame = this.moneySpriteFrameList[0];
            }else {
                this.moneyLabel.string = ""+hall.GlobalFuncs.getChipStringWithChipCount(scratch.GameWorld.cardListInfo[objc][5]);
                this.moneySprite.spriteFrame = this.moneySpriteFrameList[1];
            }

            this.tipsNode.active = false;
            if(this.conditionDic.continue){
                this.tipsNode.active = true;
                this.tipsLabel.string = "连续"+this.conditionDic.continue+"天登录解锁";
            }
            // if(this.conditionDic.share){
            //     this.tipsNode.active = true;
            //     this.tipsLabel.string = "分享到"+this.conditionDic.share+"个群解锁";
            // }
            // if(this.conditionDic.invite){
            //     this.tipsNode.active = true;
            //     this.tipsLabel.string = "邀请"+this.conditionDic.invite+"个好友解锁";
            // }
            // if(this.conditionDic.scratchCount){
            //     this.tipsNode.active = true;
            //     this.tipsLabel.string = "每天刮开"+this.conditionDic.scratchCount+"张卡片解锁";
            // }
        }
        // this.setDetailInformation(objc);
    },

    // setDetailInformation:function (resultMap) {
    //     ty.getImageWithURL("",this.cellSprite)
    // },

    onCellAction : function () {
        scratch.gameModel.nowCardID = 0;
        if(this.cardID == "2000"){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["chipGiftCenter"]);
            scratch.GlobalFuncs.showGoldGift();
            return;
        }
        if(this.cardID < 1030){
            scratch.gameModel.scratchCountNow ++;
            if(scratch.gameModel.scratchCountNow >= 4 ){
                scratch.gameModel.nowCardID = this.cardID;
                if(!ty.SystemInfo.isCheckVersion && scratch.GameWorld.normalConfig.illegalConfig.noCheckState.mainCard){
                    if(ty.UserInfo.isInBSGS){
                        scratch.Share.shareWithType(scratch.Share.onShareType.maincardclickshare);
                    }else {
                        scratch.Share.shareWithType(scratch.Share.onShareType.unbsgsmaincardclick);
                    }
                    return;
                }
            }
        }

        if(this.conditionDic.continue){
            if(hall.ME.udataInfo.m_nsLoginDays <  this.conditionDic.continue){
                scratch.GlobalFuncs.showRoleTips(this.cardID,"continue");
                return;
            }
        }
        if(this.conditionDic.share){
            if(!ty.SystemInfo.isCheckVersion && scratch.GameWorld.normalConfig.illegalConfig.noCheckState.cardCondition){
                scratch.gameModel.nowCardID = this.cardID;
                if(ty.UserInfo.isInBSGS){
                    scratch.Share.shareWithType(scratch.Share.onShareType.cardshareunlock);
                }else {
                    scratch.Share.shareWithType(scratch.Share.onShareType.unbsgscardshareunlock);
                }
                return;
            }
        }
        if(this.conditionDic.invite){
            if(scratch.GameWorld.todayInvite < this.conditionDic.invite){
                if(!ty.SystemInfo.isCheckVersion && scratch.GameWorld.normalConfig.illegalConfig.noCheckState.cardCondition){
                    scratch.GlobalFuncs.showRoleTips(this.cardID,"invite");
                    return;
                }
            }
        }
        if(this.conditionDic.scratchCount){
            var count = hall.ME.udataInfo.m_rewardDailyCards.length + hall.ME.udataInfo.m_rewardLifeCards.length;
            if(count <  this.conditionDic.scratchCount){
                scratch.GlobalFuncs.showRoleTips(this.cardID,"scratchCount");
                return;
            }
        }

        var cardID = this.cardID;
        var sceneName = 'scratch_scrate';
        var onLaunched = function () {
            var logicScene = cc.director.getScene();
            var no = logicScene.children[0];
            var com = no.getComponent("scratch_scrate");
            com.setCardID(cardID);
        };
        cc.director.loadScene(sceneName,onLaunched);
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});
