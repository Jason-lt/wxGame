


// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_main');
// window.setTitleString("闯八关平分100万奖金");
// window.setDetailInformation("12345678","12:54:51");

cc.Class({
    extends: cc.Component,
    ctor:function () {
        this._counter = 0;
        this._TAG = "ddz_main.js";
    },

    properties: {

        leftSeconds:0,
        winnerCount : 0,
        rewardDes : "",
        titleLabel: {
            default : null,
            type : cc.Label
        },
        detailLabel : {
            default : null,
            type : cc.RichText
        },
        timeLabel: {
            default : null,
            type : cc.Label
        },
        detailButton : {
            default : null,
            type : cc.Button
        },
        countLabel: {
            default : null,
            type : cc.Label
        },
        startButtonList : {
            default : null,
            type : cc.Node
        },
        buttom : {
            default : null,
            type : cc.Node
        },
        tipsWindow : {
            default : null,
            type : cc.Prefab
        },
        parentScene: {
            default: null,
            serializable: false
        }
    },
    onLoad :function () {
        // hall.MsgFactory.getBagInfo();
        // this.addTipsWindowWith("4","10","5");
        this.rewardDes = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.MATCH_REWARD_DES, "20万元奖金");
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_INFO, this.onUpDateMatchInfo, this);

        ddz.matchModel.getMatchDes();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_DES, this.updateMatchInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.GET_TIMESTAMP, this.reciveTimeStamp, this);

        this.detailButton.node.x = -this.detailLabel.node.width-20;
    },
    onUpDateMatchInfo:function () {
        var info = ddz.matchModel.getCurUpdateInfo();
        var num = info.lotteryInfo.winnerCount;
        var rewardDes = info.lotteryInfo.desc;

        this.leftSeconds = info.lotteryInfo.leftSeconds;
        var timeStr = ddz.GlobalFuncs.formatTime(this.leftSeconds);

        if (this.winnerCount == num){
            this.timeLabel.string = timeStr;
        }else {
            this.winnerCount = num;
            this.setDetailInformation(num, timeStr);
        }
        if (this.rewardDes != rewardDes){
            this.rewardDes = rewardDes;
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.MATCH_REWARD_DES, rewardDes);
            this.setTitleString("闯七关平分" + rewardDes);
        }
    },
    updateMatchInfo: function () {
        /*
         "todayMatchInfo":{
         "winnerCount":0,
         "prizeDesc":"",
         "rewards":[

         ]
         },
         "winnerCount":5,
         "matchCount":6,
         "yestodayMatchInfo":{
         "winnerCount":4,
         "prizeDesc":"1枚钻石600000个金币5134张红包券",
         "rewards":[
         {
         "count":1,
         "itemId":"item:1311"
         },
         {
         "count":600000,
         "itemId":"user:chip"
         },
         {
         "count":5134,
         "itemId":"user:coupon"
         }
         ]
         },
         */
        var matchDes = ddz.matchModel.getCurDes();
        var histories = matchDes.histories;
        if (typeof(histories) != 'undefined'){
            var todayM = histories.todayMatchInfo;
            var todaywinnerCount = todayM.winnerCount;
            if(todaywinnerCount >0){
                this.countLabel.string = "本轮已通关"+todaywinnerCount+"次";
                this.countLabel.node.active = true;
            }else {
                this.countLabel.node.active = false;
            }

            var yestodayM = histories.yestodayMatchInfo;
            var yestodayCount = yestodayM.winnerCount;
            if (yestodayCount != 0){
                this.yestodayM = yestodayM;
                hall.MsgFactory.getTimeStamp();
                //
                // var dateTime = new Date();
                // var nowDate = (dateTime.getMonth()+1)+""+dateTime.getDate()+""+ty.UserInfo.userId;
                // var lastDate =   hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.matchModel.LAST_REWARD_DATE, "");
                // if (nowDate != lastDate){
                //     var rewards = yestodayM.rewards;
                //     var allRecord = 0;
                //     for (var i = 0; i < rewards.length; i ++){
                //         var itemId = rewards[i].itemId;
                //         if (itemId == 'user:coupon'){
                //             var count = rewards[i].count;
                //             allRecord += count;
                //         }
                //     }
                //     this.addTipsWindowWith(yestodayCount,allRecord/100+"","1");
                //     hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_REWARD_DATE, nowDate);
                // }


            }
        }
    },

    reciveTimeStamp : function (result) {
        // "result":{
        //     "action":"sync_timestamp",
        //         "gameId":9999,
        //         "userId":10200,
        //         "current_ts":1520826049
        // }
        var dateTime = result.current_ts;
        var nowDate = dateTime+"_"+ty.UserInfo.userId;
        var lastDate =   hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_REWARD_DATE, "");
        if (!this.yestodayM){
            return;
        }
        var nowTime = lastDate.split('_')[0];
        if(parseInt(dateTime/(24*60*60)) != parseInt(nowTime/(24*60*60))){
            var rewards = this.yestodayM.rewards;
            var allRecord = 0;
            for (var i = 0; i < rewards.length; i ++){
                var itemId = rewards[i].itemId;
                if (itemId == 'user:coupon'){
                    var count = rewards[i].count;
                    allRecord += count;
                }
            }
            this.addTipsWindowWith(this.yestodayM.winnerCount,allRecord/100+"","1");
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_REWARD_DATE, nowDate);
        }
    },

    setTitleString : function (titleString) {
        this.titleLabel.string = titleString;
    },

    setDetailInformation:function (peopel,timeS) {
        // <img src='ddz_main_acticityDetail' height=40 width=40 />
        this.detailLabel.string =
            "<color=#ffffff>   本期已有"+peopel+"人次通关 </c>";
        this.timeLabel.string = timeS;

        var richL = this.detailLabel.node.width;
        var timeL = this.timeLabel.node.width+5;
        var allL = richL + timeL;
        var richRight = richL- allL/2;
        this.detailLabel.node.x = richRight;
        this.timeLabel.node.x = richRight;
        this.detailButton.node.x = -richL-20;
    },
    updataTime :function () {
        this.leftSeconds--;
        var timeStr = ddz.GlobalFuncs.formatTime(this.leftSeconds);
        this.timeLabel.string = timeStr;
    },

    addTipsWindowWith : function (count,money,sCount) {
        var tipsWindow = cc.instantiate(this.tipsWindow);
        this.node.addChild(tipsWindow);
        var window = tipsWindow.getComponent('TipsWindow');
        var testArray = [{
            title :"分享送",
            right :"dda_button_diamond",
            bottomType :3,
            count : sCount,
        }];
        window.setTitleContentAndButtons("恭喜你!","昨天通关"+count+"次获得"+money+"元奖励",testArray);
        window.parentSce = this;
    },
    onClickCenterButton:function (event) {
        //TODO:分享图片
        var titleA = ["单手玩转斗地主，更多现金奖励等你来拿！",
            "我正在玩斗地主赢现金，快跟我一起来玩吧！",
            "玩斗地主赢现金，这个秘密我只告诉你，快一起来玩吧!"];
        var count = (Math.floor(Math.random()*10))%3;
        ty.TuyooSDK.shareWithInformation(titleA[count],"");
        wx.showToast({title:titleA[count]});
    },

    update:function (dt) {
        this._counter++;
        if (this._counter >= 360){
            //6秒刷新一次奖池信息
            ddz.matchModel.matchUpdate();
            this._counter = 0;
            ddz.LOGD(this._TAG, "刷新一次奖池信息");
        }else if(this._counter%60 == 0){
            if (this.leftSeconds > 0){
                this.updataTime();
            }
        }
    },
    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
    },

    onDetailButton : function () {
        if (this.parentScene){
            this.parentScene.onDetailButton();
        }
    },
});
