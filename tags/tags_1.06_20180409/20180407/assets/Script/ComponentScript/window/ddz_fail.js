
// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor:function () {
        this._curGuangQia = 0;
    },

    properties: {
        resultTitle : {
            default : null,
            type : cc.Node
        },
        buttons : {
            default : null,
            type : cc.Node
        },
        tipWindow : {
            default : null,
            type : cc.Prefab
        },
        numberlabel :{
            default : null,
            type : cc.RichText
        },
        noticelabel :{
            default : null,
            type : cc.RichText
        },
        backButton : {
            default : null,
            type : cc.Button
        },
        titleS : "使用"
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        var sceneName = 'Ddz';
        cc.director.loadScene(sceneName);
    },
    setDiamondCount:function (guangQiaNum) {

        var countNunber = hall.ME.udataInfo.diamondCount;

        this._curGuangQia = guangQiaNum;

        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);

        this.numberlabel.string ="<color=#ffffff>已有 </c><img src='dda_button_diamond' /><size='36' color='#ffffff'> x"+countNunber+" </color>";

        if (countNunber >0){
            this.titleS = "使用";
        }else {
            this.titleS = "邀请得";
        }

        var comBtnList = this.buttons.getComponent('ddz_buttonList');
        comBtnList.changeTopTextWithButton({title :this.titleS,right:"dda_button_diamond_black", bottomType :1});
    },

    over:function (guangQiaNum) {
        this._curGuangQia = guangQiaNum;
        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);
        var comBtnList = this.buttons.getComponent('ddz_buttonList');
        comBtnList.setButtonListWithButtons([{title :'重新闯关',left:'ddz_table_again', bottomType :1}]);
        this.numberlabel.string = "";
        this.noticelabel.string = "";
        this.overed = true;
    },
    gameFlowOver:function (guangQiaNum) {
        this._curGuangQia = guangQiaNum;
        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);
        var comBtnList = this.buttons.getComponent('ddz_buttonList');
        comBtnList.setButtonListWithButtons([{title :'重闯本关',left:'ddz_table_again', bottomType :1}]);
        // this.numberlabel.fontSize = 30;
        this.numberlabel.string = "";
        this.noticelabel.string = "托管不记录成绩,请重闯本关";
        this.gameFlow = true;
    },

    onTopButtonAction : function () {
        ddz.LOGD(null, "onTopButton2");
        if (this.overed){
            this.onTempButtonAction();
        }else if(this.gameFlow){
            //TODO:流局的局数判断
            ddz.matchModel.matchChallenge();
            this.shut();
        } else{
            ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
            if (this.titleS == "使用"){
                ddz.matchModel.matchBack();
                this.shut();
            }
            else{
                ty.TuyooSDK.shareToGetDiamond();
            }
        }
    },
    onTempButtonAction : function () {
        ddz.LOGD(null, "onButtomButtonAction2");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        // var maxIndex = ddz.matchModel.getCurDes().stages.length - 1;
        var maxIndex = 6;
        if (this._curGuangQia > maxIndex - 2){
            this.addTipsWindow(maxIndex - this._curGuangQia+1);
        }
        else{
            if (this._curGuangQia == 0){
                //第一关就死掉,发送重新闯关
                ddz.matchModel.matchSignin();
            }
            else{
                ddz.matchModel.waitSignin = true;
                ddz.matchModel.matchGiveUp();
            }
            this.shut();
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        var window2 = this.buttons.getComponent('ddz_buttonList');
        window2.parentScene = this;

        ddz.AudioHelper.playMusic('/resources/sound/Failure.mp3', false);

        var winSize = cc.director.getWinSize();

        var bg = this.node.getChildByName('ddz_scene_bg_0');

        //全屏适配
        this.node.width = winSize.width;
        this.node.height = winSize.height;

        bg.width = winSize.width;
        bg.height = winSize.height;
    },

    addTipsWindow : function (loss) {
        var tip = cc.instantiate(this.tipWindow);
        this.node.addChild(tip);
        var tipWindow = tip.getComponent("TipsWindow");
        var testArray = [
            {
                title :this.titleS,
                right :"dda_button_diamond",
                bottomType :1
            },
            {
                title :"确定",
                bottomType : 0
            }
        ];
        tipWindow.setTitleContentAndButtons("提示","距离领奖就差"+loss+"关了,确定重新闯关?", testArray);
        tipWindow.parentSce = this;
    },

    onClickLeftButton:function () {
        var countNunber = hall.ME.udataInfo.diamondCount;
        if (countNunber >0){
            //使用钻石
            ddz.matchModel.matchBack();
            this.shut();
        }else {
            //邀请得钻石
            //TODO
            ty.TuyooSDK.shareToGetDiamond();
            this.shut();
            // this.titleS = "邀请得";
        }
    },

    onClickRightButton:function () {
        //重新闯关
        ddz.matchModel.waitSignin = true;
        ddz.matchModel.matchGiveUp();
        this.shut();
    },

    shut:function () {
        ddz.matchResultPanel = null;
        this.node.destroy();
    }

    // update (dt) {},
});
