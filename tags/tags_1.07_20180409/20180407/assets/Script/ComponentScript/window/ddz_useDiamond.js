

// var ddz_useDiamond = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_useDiamond);
// var window = ddz_useDiamond.getComponent('ddz_useDiamond');
// window.setDetailWithDiamondCount("10",2);
//type(1、开始闯关(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)

cc.Class({
    extends: cc.Component,

    properties: {
        titleL : {
            default : null,
            type : cc.Label
        },
        detailText : {
            default : null,
            type : cc.RichText
        },
        coutLabel : {
            default : null,
            type : cc.RichText
        },
        buttons : {
            default : null,
            type : cc.Node
        },
        bottom : {
            default : null,
            type : cc.Prefab
        },
        tipWindow : {
            default : null,
            type : cc.Prefab
        },

        diamondCount : "",//用户钻石数量
        fightState : 1,//闯关状态(1、开始,2、某关中断,3、某关失败)
        nowFight :3,//当前闯关局数//(1、(活动详情),2、钻石主页,3、闯关失败,4、继续挑战)
        sceneType :"",
        parentScene: {
            default: null,
            serializable: false
        }
    },
    onLoad : function () {
        this.titleL.node.active = false;
        // this.setDetailWithDiamondCount("5",3,"七");
        //屏幕适配
        // var widthScaling = ddz.GlobalFuncs.getWindowWidthscaling();
        // this.titleL.fontSize = this.titleL.fontSize*widthScaling;
        // this.detailText.fontSize = this.detailText.fontSize*widthScaling;
        // this.coutLabel.fontSize = this.coutLabel.fontSize*widthScaling;
    },

    //type(1、开始闯关(活动详情),2、钻石主页,)
    setDetailWithDiamondCount:function(type,state,guan){
        var diamondCount = hall.ME.udataInfo.diamondCount;

        ddz.LOGD(null, "backActio======setDetailWithDiamondCount"+diamondCount+type+state+guan);
        this.diamondCount = diamondCount;
        this.fightState = state;
        this.nowFight = guan;
        this.sceneType = type;
        var buttonA = [];
        var isHasCount = false;
        if (this.sceneType == 1){
            isHasCount = false;
            // this.addBottomButtons();
            var titlS = "";
            if (this.fightState == 1){
                titlS = " 开始闯关";
            }else {
                titlS = " 继续闯关";
            }
            buttonA = [{title :titlS, left :'ddz_main_tri', bottomType :1}];
            this.titleL.node.active = true;
            this.detailText.horizontalAlign = 0;
            this.detailText.string =
                "<img src='ddz_white_circle' height=8 width=8/><color=#ffffff> 闯过七关可平分每天奖金</color><br/>" +
                "<img src='ddz_white_circle' height=8 width=8/><color=#fffffff> 闯关失败可使用 <img src='dda_button_diamond' height=38 width=44/> 复活</color><br/>"+
                "<img src='ddz_white_circle' height=8 width=8 /><color=#ffffff> 每天首次登录得 </color>" +
                "<img src='dda_button_diamond'  height=38 width=44/><size='36' color=#fffffff> x1</color><br/>"+
                "<img src='ddz_white_circle' height= 8 width=8 /><color=#ffffff> 邀请朋友每天第一次登录得 </color>" +
                "<img src='dda_button_diamond' height=38 width=44/><size='36' color=#fffffff> x1</color>";
        }else if(this.sceneType == 2){
            isHasCount = true;
            buttonA = [{title :"邀请得", right :"dda_button_diamond_black", bottomType :1}];
            this.detailText.horizontalAlign = 0;
            this.detailText.string = "<img src='ddz_white_circle' height=8 width=8/><color=#ffffff> 每天首次登录得 </color>" +
                "<img src='dda_button_diamond' height=38 width=44/><size=36 color=#fffffff> x1</color><br/>"+
                "<img src='ddz_white_circle'  height=8 width=8/><color=#ffffff> 邀请朋友每天第一次登录得 </color>" +
                "<img src='dda_button_diamond' height=38 width=44/><size=36 color=#fffffff> x1</color>";
        }
        //3、闯关失败,4、继续挑战
        // else if(type == 3){
        //     isHasCount = true;
        //     // this.addBottomButtons();
        //     buttonA = [{title :titleS, right :'black', bottomType :1},{title :"重新闯关", bottomType :2}];
        //     this.detailText.string = "<color=#ffffff>第"+guan +"局闯关失败<br/>邀请好友首次进入游戏得钻石</color>";
        // } else if(type == 4){
        //     isHasCount = true;
        //     // this.addBottomButtons();
        //     buttonA = [{title :titleS, right :'black', bottomType :1},{title :"重新闯关", bottomType :2}];
        //     this.detailText.string = "<color=#ffffff>使用 </c><img src='dda_button_diamond' /><color=#fffffff> X1继续挑战第"+guan+"关</color>";
        // }

        if(isHasCount){
            this.coutLabel.node.active = true;
            this.coutLabel.string = "<color=#ffffff>已有：</c><img src='dda_button_diamond' height=38 width=44/><color=#ffffff> x"+this.diamondCount+"</color>";
        }else {
            this.coutLabel.node.active = false;
        }

        var window2 = this.buttons.getComponent('ddz_buttonList');
        window2.setButtonListWithButtons(buttonA);
        window2.parentScene = this;
    },
    // addBottomButtons:function () {
    //     var buttom = cc.instantiate(this.bottom);
    //     this.node.addChild(buttom);
    //     var window = buttom.getComponent('ddz_buttomButtons');
    //     window.parentScene = this;
    // },

    setActiveForFalse : function () {
        this.titleL.node.active = false;
        this.detailText.node.active = false;
        this.coutLabel.node.active = false;
        this.buttons.active = false;
    },

    onTopButtonAction : function () {
        ddz.LOGD(null, "onTopButton2");
        if (this.sceneType == 1){//活动详情---闯关
            if (this.fightState == 1){
                ddz.matchModel.matchSignin();
                this.setActiveForFalse();
            }else if(this.fightState == 2){
                ddz.matchModel.matchChallenge();
                this.setActiveForFalse();
            }else if (this.fightState == 3){
                var tipsW = cc.instantiate(this.tipWindow);
                this.node.addChild(tipsW);
                var window = tipsW.getComponent("TipsWindow");
                window.parentSce = this;
                var buttonS = "";
                var tipS = "";
                if (this.diamondCount >0){
                    buttonS = "使用";
                    tipS = "使用钻石继续挑战";
                }else {
                    buttonS = "邀请得";
                    tipS = "第"+this.nowFight+"关挑战失败,邀请好友首次进入游戏得钻石"
                }
                var testArray = [{
                    title :"重新闯关",
                    bottomType : 0

                }, {
                    title :buttonS,
                    right :"dda_button_diamond",
                    bottomType :1
                }
                ];
                window.setTitleContentAndButtons("提示",tipS,testArray);
            }
        }else if (this.sceneType == 2){//钻石主页--邀请得钻石
            this.shareToInvite();
        }
    },
    onClickLeftButton:function (event) {
        ddz.matchModel.matchSignin();
        this.setActiveForFalse();
        ddz.LOGD(null, "onClickLeftButton");
    },
    onClickRightButton:function (event) {
        // this.parentSce.onClickRightButton();
        ddz.LOGD(null, "onClickRightButton");
        if (this.diamondCount >0) {
            ddz.matchModel.matchBack();
            this.setActiveForFalse();
        }else{
          this.shareToInvite();
        }
    },
    shareToInvite : function () {
        ty.TuyooSDK.shareToGetDiamond();
    },
});
