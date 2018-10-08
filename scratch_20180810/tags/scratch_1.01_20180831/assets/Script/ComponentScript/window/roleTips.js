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
        titleLabel : {
            default : null,
            type : cc.Label
        },
        detailLabel : {
            default : null,
            type : cc.Label
        },
        buttonLabel : {
            default : null,
            type : cc.Label
        },

        nextButton  : {
            default : null,
            type : cc.Button
        },

        type : ""
    },

    onBlack : function () {

    },
    changeInfo : function (cardID,type) {
        if(cardID){
            this.titleLabel.node.active = false;
            var conditionCount;
            this.type = type;
            switch (type){
                case "continue":
                {
                    conditionCount = scratch.GameWorld.normalConfig.cardConditionDic[cardID].continue;
                    this.detailLabel.string = "连续"+conditionCount+"天登录解锁("+hall.ME.udataInfo.m_nsLoginDays+"/"+conditionCount+")";
                    break;
                }
                case "share":
                {
                    conditionCount = scratch.GameWorld.normalConfig.cardConditionDic[cardID].share;
                    this.detailLabel.string = "分享到"+conditionCount+"个群解锁("+hall.ME.udataInfo.m_shareCount+"/"+conditionCount+")";
                    this.buttonLabel.string = "解锁";
                    this.nextButton.node.active = true;
                    break;
                }
                case "invite":
                {
                    conditionCount = scratch.GameWorld.normalConfig.cardConditionDic[cardID].invite;
                    this.detailLabel.string = "邀请好友帮忙解锁("+scratch.GameWorld.todayInvite+"/"+conditionCount+")";
                    this.buttonLabel.string = "解锁";
                    this.nextButton.node.active = true;
                    break;
                }
                case "scratchCount":
                {
                    conditionCount = scratch.GameWorld.normalConfig.cardConditionDic[cardID].scratchCount;
                    var count = hall.ME.udataInfo.m_rewardDailyCards.length + hall.ME.udataInfo.m_rewardLifeCards.length;
                    this.detailLabel.string = "每天刮开"+conditionCount+"张卡片解锁("+count+"/"+conditionCount+")";
                    break;
                }

                default :break;
            }

        }
    },
    sureAction : function () {
        if(this.type == "share" || this.type == "invite"){
            if(ty.UserInfo.isInBSGS){
                scratch.Share.shareWithType(scratch.Share.onShareType.maincardclickshare);
            }else {
                scratch.Share.shareWithType(scratch.Share.onShareType.unbsgsmaincardclick);
            }
        }else {
            this.node.destroy();
        }
    },

    nextAction : function () {
        this.node.destroy();
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
