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

        buttonBgList :[cc.SpriteFrame],

        topButton : {
            default : null,
            type : cc.Button
        },
        topRichText : {
            default : null,
            type : cc.RichText
        },
        bottomButton : {
            default : null,
            type : cc.Button
        },
        bottomRichText : {
            default : null,
            type : cc.RichText
        }

    },

    onLoad : function () {
        this.topCallFunc = function(){};
        this.bottomCallFunc = function(){};
        this.topButton.node.on("click",this.topButtonCallFunc,this);
        this.bottomButton.node.on("click",this.bottomButtonCallFunc,this);
        // this.setButtons();
    },

    setButtons : function (buttons) {
        var buttonCount = buttons.length;
        if(buttonCount == 1){//只要一个,留下面那个
            this.topButton.node.active = false;
            this.bottomButton.node.active = true;
            var sprite = this.topButton._sprite;
            sprite.spriteFrame = this.buttonBgList[buttons[0].bottomType];
            this.bottomRichText.string = this.setRichTextWithButton(buttons[0]);
        }else if(buttonCount == 1){
            this.topButton.node.active = true;
            this.bottomButton.node.active = true;
            var topSprite = this.topButton._sprite;
            topSprite.spriteFrame = this.buttonBgList[buttons[0].bottomType];
            this.topRichText.string = this.setRichTextWithButton(buttons[0]);
            var bottomSprite = this.bottomButton._sprite;
            bottomSprite.spriteFrame = this.buttonBgList[buttons[1].bottomType];
            this.bottomRichText.string = this.setRichTextWithButton(buttons[1]);
        }
    },
    setRichTextWithButton:function(button){
        var textS = "<color=#ffffff> "+button.title+" </color>";
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

    // setButtonWith

    // setTopBtnCallBack:function(_topCall,_bottomCall){
    //     this.topCallFunc = _topCall;
    //     this.bottomCallFunc = _bottomCall;
    // },
    setBtnCallBack:function(_topCall,_bottomCall){
        this.topCallFunc = _topCall;
        this.bottomCallFunc = _bottomCall;
    },

    topButtonCallFunc : function () {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        this.topCallFunc();
    },
    bottomButtonCallFunc : function () {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        this.bottomCallFunc();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // updte (dt) {},
});
