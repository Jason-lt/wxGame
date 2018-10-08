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
        avatar :{
            default : null,
            type :cc.Sprite
        },

        detailrichText : cc.RichText,

        getButton : cc.Button,
        haveSpritr : cc.Sprite,
        unInterface: cc.Sprite,

        inviteedCode :"",
        state : 0,//0:未达到标准,1、可领取,2、已领取

        resultMap : null,

        defaultSpriteFrame : cc.SpriteFrame
    },
    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },

    setDetailInformation:function (resultMap) {

        this.resultMap = resultMap;
        this.setGetButtonState(resultMap.rewardState);

        this.inviteedCode = resultMap.userId || resultMap.inviteedCode;

        this.detailrichText.string =
            "<color=#9C7343>成功邀请"+resultMap.count +"位新人（"+resultMap.nowCount+"/"+resultMap.count+"）</c>" +
            "<br/>" + "<color=#9C7343>奖励：</c>" +
            "<img src='ddz_welfare_diamond_1' height=34 width=42/><color=#9C7343> +"+resultMap.bindRewardCount+"</c>";
    },

    setGetButtonState : function (state) {
        this.state = state;

        switch (state){
            case 0 :{
                this.getButton.node.active = false;
                this.haveSpritr.node.active = false;
                this.unInterface.node.active = true;}
                break;
            case 1 :{
                this.getButton.node.active = true;
                this.haveSpritr.node.active = false;
                this.unInterface.node.active = false;}
                break;
            case 2 :{
                this.getButton.node.active = false;
                this.haveSpritr.node.active = true;
                this.unInterface.node.active = false;}
                break;
            default:
                break;
        }
    },

    onGetRewardAction : function () {
        this.resultMap.rewardState = 2;
        if(!this.avatar){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
                ["getNewDiamond",this.resultMap.count]);
            ddz.gameModel.getNewInviteReward(this.inviteedCode);
        }else {
            ddz.gameModel.getInviteReward(this.inviteedCode);
        }
        this.setGetButtonState(2);
        hall.LOGW("===","=====onGetRewardAction=========");
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_DIAMOND_COUNT,this.resultMap.bindRewardCount);

        // ddz.gameModel.getNewInviteReward(this.inviteedCode);
    },

    onClickInviteBtn:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShareFriendToCell"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeInviteNewFriend);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});
