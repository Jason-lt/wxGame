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
        avatar : cc.Sprite,
        detailrichText : cc.RichText,

        getButton : cc.Button,
        haveSpritr : cc.Sprite,
        unInterface: cc.Sprite,

        inviteedCode :"",
        state : 0,//0:未达到标准,1、可领取,2、已领取

        resultMap : null,
    },
    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },

    setDetailInformation:function (resultMap) {

        this.resultMap = resultMap;
        this.setGetButtonState(resultMap.rewardState);

        this.detailrichText.string =
            "<color=#1A6951>邀请到"+resultMap.count +"位好友（"+resultMap.nowCount+"/"+resultMap.count+"）</c>" +
            "<br/>" + "<color=#1A6951>奖励：</c>" +
            "<img src='dda_button_diamond_black' height=34 width=42/><color=#1A6951> +"+resultMap.bindRewardCount+"</c>";

        this.inviteedCode = resultMap.userId;

        if(resultMap.pic && resultMap.pic.length > 3){
            ty.SystemInfo.getImageWithURL(resultMap.pic,this.avatar);
        }else {
            ty.SystemInfo.getImageWithURL("res/raw-assets/resources/table/nopack/ddz_avatar_default.png",this.avatar);
        }
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
        ddz.gameModel.getInviteReward(this.inviteedCode);
        this.setGetButtonState(2);
        hall.LOGE("===","=====onGetRewardAction=========");
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_DIAMOND_COUNT,this.resultMap.bindRewardCount);

    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});
