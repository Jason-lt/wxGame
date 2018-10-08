


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
        tipsButton : {
            default : null,
            type : cc.Button
        },
        inviteeList :[],
        massageWindow : {
            default : null,
            type : cc.Prefab
        },
        parentScene: {
            default: null,
            serializable: false
        },
        count : "",
        money : "",
    },
    onLoad :function () {
        // hall.MsgFactory.getBagInfo();
        // this.addTipsWindowWith("4","10","5");
        this.rewardDes = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.MATCH_REWARD_DES, "20万元奖金");
        this.setTitleString("闯七关平分" + this.rewardDes);
        
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_INFO, this.onUpDateMatchInfo, this);

        ddz.matchModel.getMatchDes();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_DES, this.updateMatchInfo, this);
        // ty.NotificationCenter.listen(ddz.EventType.GET_TIMESTAMP, this.reciveTimeStamp, this);

        ddz.matchModel.queryInviteInfo();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);
        ty.NotificationCenter.listen(ddz.EventType.CHANE_COUNT_LABEL, this.changeCountLabel, this);

        this.detailButton.node.x = -this.detailLabel.node.width-20;
    },
    loadingAction : function () {
        this.buttom.active = false;
        this.startButtonList.active = false;
        this.timeLabel.node.active = false;
        this.detailLabel.node.active = false;
        this.timeLabel.node.active = false;
    },
    unLoadingAction : function () {
        this.buttom.active = true;
        this.startButtonList.active = true;
        this.timeLabel.node.active = true;
        this.detailLabel.node.active = true;
        this.timeLabel.node.active = true;
    },
    onUpDateMatchInfo:function () {
        var info = ddz.matchModel.getCurUpdateInfo();
        var num = info.lotteryInfo.winnerCount;
        var rewardDes = info.lotteryInfo.desc;
        ddz.GameWorld.shareKeywordReplace.bonusTotal = rewardDes;

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

    changeCountLabel:function (val) {
        this.countLabel.node.active = val;
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
         　　　　　　"records":Array[2]
         　　　　},
         */
        var matchDes = ddz.matchModel.getCurDes();
        this.changeCountLabel(false);
        var histories = matchDes.histories;
        if (histories){
            var todayM = histories.curLottery;
            if(todayM && todayM.winnerCount && todayM.winnerCount > 0){
                ddz.GameWorld.shareKeywordReplace.curWinnerCount = todayM.winnerCount;
                this.countLabel.string = "本期已通关"+todayM.winnerCount+"次";
                this.changeCountLabel(true);
            }
        }
    },

    setTitleString : function (titleString) {
        hall.LOGD(this._TAG, "setTitleString -------------------------"+titleString.length);
        var fontSize = 48;
        if(titleString.length > 11){
            fontSize = 45;
        }
        this.titleLabel.fontSize = fontSize;
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
            count : sCount
        }];
        ddz.GameWorld.shareKeywordReplace.lastWinnerCount = count;
        ddz.GameWorld.shareKeywordReplace.lastBonusOnly = money;
        window.setTitleContentAndButtons("恭喜你!","上期通关"+count+"次获得"+money+"元奖励",testArray);
        window.parentSce = this;
    },
    onClickCenterButton:function (event) {
        var shareType = ty.UserInfo.clickStatShareType.clickStatShareTypeMainTips;
        ty.TuyooSDK.shareWithType(shareType);
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

    updateRewardMassage : function (result) {
        // "result":{
        //     "gameId":6,
        //         "bindRewardCount":2,
        //         "state":1,
        //         "action":"query_invite_info",
        //         "totalReward":0,
        //         "inviteeList":[
        //         {
        //             "rewardState":1,
        //             "pic":"http://ddz.dl.tuyoo.com/cdn37/hall/avatar/New_avatar_170803.png",
        //             "userId":10666,
        //             "name":"来宾029aseFGg"
        //         }
        //     ]
        // }

        var resultMap;
        if(result){
            resultMap = result.result;
        }
        var showList = [];
        if(resultMap && resultMap.inviteeList && resultMap.inviteeList.length > 0){
            var inviteeList = resultMap.inviteeList;
            for (var i = 0; i < inviteeList.length; i ++){
                if(inviteeList[i].rewardState == 1){
                    inviteeList[i].bindRewardCount = resultMap.bindRewardCount;
                    inviteeList[i].type = 1;
                    showList.push(inviteeList[i]);
                }
            }
        }

        //查询未展示的登录奖励
        var tips =   hall.GlobalFuncs.ReadValueFromLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD, []);
        if(tips[0]){
            var tipsList = tips[0].split(',');
            if(tipsList && tipsList.length > 0){
                for (var i = 0 ; i < tipsList.length ; i ++ ){
                    var reward = {};
                    reward.type = 2;
                    reward.bindRewardCount = tipsList[i];
                    showList.push(reward);
                }
            }
        }

        if(showList.length > 0){
            this.showTipsButton();
            this.inviteeList = showList;
        }
    },
    showTipsButton : function () {
        this.tipsButton.node.active = true;
    },
    hideTipsButton : function () {
        hall.LOGD(this._TAG, "hideTipsButton -------------------------");
        this.tipsButton.node.active = false;
    },
    onTipsButton : function () {
        for (var i = 0; i < this.inviteeList.length; i ++){
            var inviteeId = this.inviteeList[i].userId;
            ddz.matchModel.getInviteReward(inviteeId);
        }
        hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD,[]);
        var tipsW = cc.instantiate(this.massageWindow);
        this.node.addChild(tipsW);
        var window = tipsW.getComponent('ddz_massageWindow');
        window.parentScene = this;
        window.setOrigData(this.inviteeList);
    },
});
