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
        rewardMain : {
            default : null,
            type : cc.Node
        },
        withDraw : {
            default: null,
            type: cc.Node
        },
        detail : {
            default : null,
            type : cc.Node
        },
        redPacket : {
            default : null,
            type : cc.Node
        },
        getRewardButton : {
            default : null,
            type : cc.Button
        },
        moreButton : {
            default : null,
            type : cc.Button
        },
        drawButton : {
            default : null,
            type : cc.Button
        },
        backButton : {
            default : null,
            type : cc.Button
        },
        dataArray :[],
        nowType : 1,//1、主界面,2、提现界面,3、奖励明细,4、领取红包成功
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        if (this.nowType == 1){
            var sceneName = 'Ddz';
            cc.director.loadScene(sceneName);
        }else  if(this.nowType ==2){
            this.withDraw.active = false;
            this.rewardMain.active = true;
            this.nowType = 1;
        }else  if(this.nowType == 3){
            this.detail.active = false;
            this.rewardMain.active = true;
            this.nowType = 1;
        }else  if(this.nowType == 4){
            this.redPacket.active = false;
            this.withDraw.active = true;
            this.nowType = 2;
        }
    },
    ctor : function () {
        // ddz.GlobalFuncs.drawGameCanvas();
    },
    onLoad :function() {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        this.getRewardButton.node.on("click",this.onRewardButton,this);
        this.moreButton.node.on("click",this.onMoreButton,this);
        this.drawButton.node.on("click",this.onDrawButton,this);
        this.nowType = 1;

        // this.setOriginalData();

        hall.MsgFactory.getUserRewardInfo();
        ty.NotificationCenter.listen(ddz.EventType.RECIVE_MESSAGE_LIST,this.onReciveMessageList,this);
    },
    // setOriginalData : function () {
    //     ddz.LOGD(null, "主界面初始信息设置");
    //     var couponCount = hall.ME.udataInfo.m_couponCount;
    //     var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
    //     var window = this.rewardMain.getComponent("ddz_getReward_main");
    //     window.setInformationWithTotalAndLoss((couponCount+exchangedCoupon)/100+"",couponCount/100+"");
    // },
    setsetOriginalDataArray : function (dataArray) {
        this.dataArray = dataArray;
        var window = this.rewardMain.getComponent("ddz_getReward_main");
        window.setDitailList(this.dataArray);
    },
    onMoreButton : function () {
        ddz.LOGD(null, "onMoreButton进入奖励明细界面");
        var window = this.detail.getComponent('ddz_rewardDetail');
        window.setDataArrayWithArray(this.dataArray);
        this.rewardMain.active = false;
        this.detail.active = true;
        this.nowType = 3;
    },
    onRewardButton : function () {
        ddz.LOGD(null, "onRewardButton进入提现页面");
        // var window = this.withDraw.getComponent('ddz_getReward_Withdraw');
        // window.setLossMoneyNumber(this.lossMoney);
        this.rewardMain.active = false;
        this.withDraw.active = true;
        this.nowType = 2;
    },
    onDrawButton:function () {

        //TODO:提现操作
        var draw = this.withDraw.getComponent('ddz_getReward_Withdraw');
        if(!draw || draw == 0){
            ddz.LOGD(null, "没有钱");
            //TODO:提现失败提示
            return;
        }
        var window = this.redPacket.getComponent('ddz_getRedPacket');
        window.setRedPacketNumber(draw.drawMoeyString);
        this.withDraw.active = false;
        this.redPacket.active = true;
        this.nowType = 4;
    },
    onDestroy : function () {
        // this.getRewardButton.node.off("click",this.onRewardButton,this);
        // this.moreButton.node.off("click",this.onMoreButton,this);
        // this.drawButton.node.off("click",this.onDrawButton,this);
    },
    start:function () {
    },

    update :function(dt) {
    },

    onReciveMessageList: function (result) {
        var list = result.msgs;
        if (typeof(list) != 'undefined'){
            var resultArr = [];
            for (var i = 0 ; i < list.length ; i ++){
                var resultMap = list[i];
                var timeS = resultMap.time;
                var textS = resultMap.text;
                if (textS.indexOf("提现") > 0){
                    // 恭喜您提现10元至微信现金成功！
                    var addMap= {};
                    var startIndex = textS.indexOf("提现")+2;
                    var endIndex = textS.indexOf("元");
                    addMap.timeS = timeS;
                    addMap.numberString = textS.substring(startIndex,endIndex);;
                    addMap.titleS = "提现";
                    resultArr.push(addMap);
                }else if (textS.indexOf("红包券") > 0){
                    // 恭喜来宾01e3NUsOJ获得20万元奖金彩池奖励红包券69，奖励已下发，继续参加后面的比赛赢取更多奖励吧",
                    var addMap= {};
                    var startIndex = textS.indexOf("获得")+2;
                    var endIndex = textS.indexOf("红包券");
                    var endIndex2 = textS.indexOf("，");
                    addMap.timeS = timeS;
                    addMap.titleS = textS.substring(startIndex,endIndex);
                    addMap.numberString = textS.substring(endIndex+3,endIndex2);
                    resultArr.push(addMap);
                }else if (textS.indexOf("奖券") > 0){
                    // "恭喜百万英雄闯关赛闯关成功，获得奖励复活赛门票1张+60万金币+5000奖券和平分20万元奖金的资格",
                    var addMap= {};
                    var endIndex = textS.indexOf("奖券");
                    var startIndex = textS.indexOf("+",endIndex-8) +1;
                    addMap.timeS = timeS;
                    addMap.titleS = "闯关奖励";
                    addMap.numberString = textS.substring(startIndex,endIndex);
                    resultArr.push(addMap);
                }
            }
            this.setsetOriginalDataArray(resultArr);
        }
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },
});
