
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
        titleS : "使用",
        count : "1"
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
        var count = ddz.matchModel.getDiamondCountNeeded();

        this._curGuangQia = guangQiaNum;

        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);

        this.numberlabel.string ="<color=#ffffff>已有 </c><img src='dda_button_diamond' /><size='36' color='#ffffff'> x"+countNunber+" </color>";

        if (countNunber >= count){
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
    gameFlowOver:function (guangQiaNum,tipsString) {
        this._curGuangQia = guangQiaNum;
        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);
        var comBtnList = this.buttons.getComponent('ddz_buttonList');
        comBtnList.setButtonListWithButtons([{title :'重闯本关',left:'ddz_table_again', bottomType :1}]);
        // this.numberlabel.fontSize = 30;
        this.numberlabel.string = "";
        this.noticelabel.string = tipsString;
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
                ddz.Share.shareWithType(ty.UserInfo.clickStatShareType.clickStatShareTypeGetDiamondFail);
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

        var count = ddz.matchModel.getDiamondCountNeeded();
        this.noticelabel.string = "<color=#ffffff>使用 </c><img src='dda_button_diamond' /><color=#ffffff> x "+count+" 继续挑战本关</color>";
    },

    addTipsWindow : function (loss) {
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :that.titleS,
                    right :"dda_button_diamond",
                    bottomType :1
                },
                {
                    title :"确定",
                    bottomType : 0
                }
            ];
            window.setTitleContentAndButtons("提示","距离领奖就差"+loss+"关了,确定重新闯关?", testArray);
        });
    },

    onClickLeftButton:function () {
        var countNunber = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();
        if (countNunber >= count){
            //使用钻石
            ddz.matchModel.matchBack();
            this.shut();
        }else {
            //邀请得钻石
            //TODO
            ddz.Share.shareWithType(ty.UserInfo.clickStatShareType.clickStatShareTypeGetDiamondFail);
            // this.shut();
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
        this.resultTitle.removeFromParent();
        this.node.destroy();
    },
    _onPreDestroy:function () {
        this._super();
        //删除动画
        this.resultTitle.removeFromParent();
    }

    // update (dt) {},
});
