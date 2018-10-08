

// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_buttonList');
// var testArray = [{
//     title :"邀请得",
//     right :true,
//     bottomType :1
// }, {
//     title :"重新闯关",
//     bottomType : 0
// }];
// window.setButtonListWithButtons(testArray);
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
                this.setButtonWithButtonTextAndHeight(buttons[0],this.bottomButton,this.bottomText,0);
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
        var textHeight = height;
        if (buttonMap.bottomType == 1){
            this.colorString = "202020";
            textHeight += 5;
        }else {
            this.colorString = "ffffff";
        }
        button.node.active = true;
        text.string = this.setRichTextWithButton(buttonMap);
        text.node.y = textHeight;
        button.node.y = height;
    },

    changeTopTextWithButton : function (button) {
        this.topText.string = this.setRichTextWithButton(button);
    },
    changeBottomTextWithButton : function (button) {
        this.bottomText.string = this.setRichTextWithButton(button);
    },
    setRichTextWithButton:function(button){
        var  textS = "<color=#"+this.colorString+"> "+button.title+" </color>";
        var labelS = textS;
        if (button.right){
            labelS = textS + "<img src='"+button.right+"' />";
        }else if (button.left){
            labelS = "<img src='"+button.left+"' />" + textS;
        }
        return labelS;
    },

    onTopButton : function () {
        ddz.LOGD(null, "onTopButton");
        if(this.parentScene){
            this.parentScene.onTopButtonAction();
        }
    },
    onButtomButton : function () {
        ddz.LOGD(null, "onButtomButton");
        if(this.parentScene){
            this.parentScene.onButtomButtonAction();
        }
    },
    onTempButton : function () {
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

    },
    // update (dt) {},
});
