/**
 * 开奖提示窗口
 */
cc.Class({
    extends: cc.Component,

    properties: {
        btnClose : cc.Button,
        btnOK : cc.Button,
        txtMiddle : cc.RichText,
        txtTop : cc.RichText
    },

    onLoad:function() {
    },

    /**
     * 设置窗口数据
     * @param showType 1:即时开奖消息驱动, 2:Match_des驱动
     * @param valArr ['2018-04-10 18:00', 10000, 23988, 10.21]
     */
    setWinType:function (showType, valArr) {
        this.updateMatchInfo();
        var topText, middleText;
        // if (showType == 1){
            //即时开奖消息驱动
            topText = "<color=#FFFFFF>上期你共通关</c><color=#F9FF47> " + this.count + " </color><color=#FFFFFF>次</c>";
            middleText = "<color=#353535><size=80>"+ this.money +"</s></c> <color=#353535>奖金</color>";
        // }else{
        //     //Match_des驱动
        // }
        this.setContent(topText, middleText);
    },

    setContent:function (topText, middleText) {
        this.txtTop.string = topText;
        this.txtMiddle.string = middleText;
    },

    onClose:function () {
        this.playCloseAni(function (scope) {
            scope.node.destroy();
        });
    },

    onOK:function () {
        var titleA = ddz.GameWorld.shareMassageList.getRewardForMain;
        var imageA = ddz.GameWorld.shareImageList.getRewardForMain;
        ty.TuyooSDK.shareWithTitleArrayAndImageArray(titleA, imageA, this.money, this.count ,function () {
            ddz.matchModel.shareToGetreward();
        });
    },

    playCloseAni:function (fun) {
        var ani = this.getComponent(cc.Animation);
        var anim = ani.getAnimationState('lottery_win_close');
        anim.once("finished", function () {
            if (fun){
                fun(this);
            }
        }, this);
        anim.play();
    },

    updateMatchInfo: function () {
        /*
         　"histories":{
         　　　　　　"winnerCount":2,
         　　　　　　"matchCount":2,
         　　　　　　"curLottery":{
         　　　　　　　　"winnerCount":2,
         　　　　　　　　"lotteryTime":"2018-04-08 19:15",
         　　　　　　　　"rewards":[
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":2,
         　　　　　　　　　　　　"itemId":"item:1311"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":1200000,
         　　　　　　　　　　　　"itemId":"user:chip"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":10000,
         　　　　　　　　　　　　"itemId":"user:coupon"
         　　　　　　　　　　}
         　　　　　　　　]
         　　　　　　},
                    "lastLottery":{
         　　　　　　　　"winnerCount":2,
         　　　　　　　　"lotteryTime":"2018-04-08 19:15",
         　　　　　　　　"rewards":[
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":2,
         　　　　　　　　　　　　"itemId":"item:1311"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":1200000,
         　　　　　　　　　　　　"itemId":"user:chip"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":10000,
         　　　　　　　　　　　　"itemId":"user:coupon"
         　　　　　　　　　　}
         　　　　　　　　]
         　　　　　　},
         　　　　　　"records":Array[2]
         　　　　},
         */
        var matchDes = ddz.matchModel.getCurDes();
        var histories = matchDes.histories;
        if (histories){
            var yestodayM = histories.lastLottery;
            var rewards = yestodayM.rewards;
            this.count = yestodayM.winnerCount;
            this.money = 0;

            var allRecord = 0;
            if(!rewards.length){
                return;
            }
            for (var i = 0; i < rewards.length; i ++){
                var itemId = rewards[i].itemId;
                if (itemId == 'user:coupon'){
                    var count = rewards[i].count;
                    allRecord += count;
                }
            }
            this.money = allRecord/100;
        }
    },
    
    onDestroy:function () {
        
    }

    // update (dt) {},
});
