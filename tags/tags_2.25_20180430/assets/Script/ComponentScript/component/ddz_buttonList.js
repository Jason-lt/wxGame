
/* {
 title :
 left :
 right :
 bottomType : (1白底,2白框)
 }
 */
cc.Class({
    extends: cc.Component,

    properties: {
        topButton :{
            default : null,
            type : cc.Button
        },//白底
        bottomButton :{
            default : null,
            type : cc.Button
        },//白框
        tempButton :{
            default : null,
            type : cc.Button
        },//白底
        topText :{
            default : null,
            type : cc.RichText
        },//白底
        bottomText :{
            default : null,
            type : cc.RichText
        },//白框
        tempText :{
            default : null,
            type : cc.RichText
        },//白框
        colorString : "202020",
        parentScene: {
            default: null,
            serializable: false
        }
    },

    setButtonListWithButtons : function (buttons) {
        var buttonCount = buttons.length;
        this.topButton.node.active = false;
        this.bottomButton.node.active = false;
        this.tempButton.node.active = false;
        if (buttonCount == 1){
            if (buttons[0].bottomType == 1){
                this.setButtonWithButtonTextAndHeight(buttons[0],this.topButton,this.topText,0);
            }else {
                hall.LOGE("","file = [ddz_buttonList] fun = [setButtonListWithButtons] bottomType != 1");
                this.setButtonWithButtonTextAndHeight(buttons[0],this.tempButton,this.tempText,0);
            }
            return;
        }

        this.setButtonWithButtonTextAndHeight(buttons[0],this.topButton,this.topText,128);
        if (buttons[1].bottomType == 1){
            this.setButtonWithButtonTextAndHeight(buttons[1],this.tempButton,this.tempText,0);
        }else {
            this.setButtonWithButtonTextAndHeight(buttons[1],this.bottomButton,this.bottomText,0);
        }
    },

    setButtonWithButtonTextAndHeight:function (buttonMap,button,text,height) {
        // if (buttonMap.bottomType == 1){
        //     this.colorString = ffffff;
        // }else {
        //     this.colorString = ffffff;
        // }
        button.node.active = true;
        text.string = this.setRichTextWithButton(buttonMap);
        text.node.y = 12;
        button.node.y = height;
    },

    changeTopTextWithButton : function (button) {
        this.topText.string = this.setRichTextWithButton(button);
    },

    setTopTextWithButton : function (string){
        this.topText.string = string;
    },

    changeBottomTextWithButton : function (button) {
        this.bottomText.string = this.setRichTextWithButton(button);
    },
    setRichTextWithButton:function(button){
        var  textS = "<color=#ffffff> "+button.title+" </color>";
        var labelS = textS;
        if (button.right){
            if(button.right = 'dda_button_diamond'){
                labelS = textS + "<img src='"+button.right+"' height=34 width=42/>";
            }else {
                labelS = textS + "<img src='"+button.right+"' />";
            }

        }else if (button.left){
            labelS = "<img src='"+button.left+"' />" + textS;
        }
        ddz.LOGD(null,"file = [ddz_buttonList] fun = [setRichTextWithButton] labelS = " + JSON.stringify(labelS));
        return labelS;
    },

    onTopButton : function () {

        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.LOGD(null, "onTopButton");
        if(this.parentScene){
            this.parentScene.onTopButtonAction();
        }
    },
    onButtomButton : function () {

        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.LOGD(null, "onButtomButton");
        if(this.parentScene){
            this.parentScene.onButtomButtonAction();
        }
    },
    onTempButton : function () {

        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }

        ddz.LOGD(null, "onTempButton");
        if(this.parentScene){
            this.parentScene.onTempButtonAction();
        }
    },
    onLoad :function () {
        this.topButton.node.on("click",this.onTopButton,this);
        this.bottomButton.node.on("click",this.onButtomButton,this);
        this.tempButton.node.on("click",this.onTempButton,this);
        //test
        // var testArray = [{
        //     title :"邀请得",
        //     right :"black",
        //     bottomType :1
        // }
        // , {
        //     title :"重新闯关",
        //         left : "ddz_main_tri",
        //     bottomType : 0
        // }
        // ];
        // this.setButtonListWithButtons(testArray);

        // var widthScaling = ddz.GlobalFuncs.getWindowWidthscaling();
        // this.topText.fontSize = this.topText.fontSize*widthScaling;
        // this.bottomText.fontSize = this.bottomText.fontSize*widthScaling;
        // this.tempText.fontSize = this.tempText.fontSize*widthScaling;
        // this.topButton.node.width = this.topButton.node.width*widthScaling;
        // this.bottomButton.node.width = this.bottomButton.node.width*widthScaling;
        // this.tempButton.node.width = this.tempButton.node.width*widthScaling;

    }
    // update (dt) {},
});
