"use strict";
cc._RF.push(module, '2f66fR8deJF0Kd+iuSrBMRa', 'ddz_buttonList_2');
// Script/ComponentScript/component/ddz_buttonList_2.js

"use strict";

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

        buttonBgList: [cc.SpriteFrame],

        topButton: {
            default: null,
            type: cc.Button
        },
        topRichText: {
            default: null,
            type: cc.RichText
        },
        bottomButton: {
            default: null,
            type: cc.Button
        },
        bottomRichText: {
            default: null,
            type: cc.RichText
        }

    },

    onLoad: function onLoad() {
        if (!this.topCallFunc) {
            this.topCallFunc = function () {
                hall.LOGW("====", "====topCallFunc===");
            };
        }
        if (!this.bottomCallFunc) {
            this.bottomCallFunc = function () {
                hall.LOGW("====", "====bottomCallFunc===");
            };
        }

        this.topButton.node.on("click", this.topButtonCallFunc, this);
        this.bottomButton.node.on("click", this.bottomButtonCallFunc, this);
        // this.setButtons();
    },

    setButtonListWithButtons2: function setButtonListWithButtons2(buttons) {
        var buttonCount = buttons.length;
        if (buttonCount == 1) {
            //只要一个,留下面那个
            this.topButton.node.active = false;
            this.bottomButton.node.active = true;
            var sprite = this.bottomButton._sprite;
            sprite.spriteFrame = this.buttonBgList[buttons[0].bottomType];
            this.bottomRichText.string = this.setRichTextWithButton(buttons[0]);
            this.bottomCallFunc = buttons[0].callFunc;
        } else if (buttonCount == 2) {
            this.topButton.node.active = true;
            this.bottomButton.node.active = true;
            var topSprite = this.topButton._sprite;
            topSprite.spriteFrame = this.buttonBgList[buttons[0].bottomType];
            this.topRichText.string = this.setRichTextWithButton(buttons[0]);
            this.topCallFunc = buttons[0].callFunc;
            var bottomSprite = this.bottomButton._sprite;
            bottomSprite.spriteFrame = this.buttonBgList[buttons[1].bottomType];
            this.bottomRichText.string = this.setRichTextWithButton(buttons[1]);
            this.bottomCallFunc = buttons[1].callFunc;
        }
    },
    setRichTextWithButton: function setRichTextWithButton(button) {
        var textS = "<color=#ffffff> " + button.title + " </color>";
        var labelS = textS;
        if (button.right) {
            if (button.right = 'dda_button_diamond') {
                labelS = textS + "<img src='" + button.right + "' height=34 width=42/>";
            } else {
                labelS = textS + "<img src='" + button.right + "' />";
            }
        } else if (button.left) {
            labelS = "<img src='" + button.left + "' />" + textS;
        }
        ddz.LOGD(null, "file = [ddz_buttonList] fun = [setRichTextWithButton] labelS = " + JSON.stringify(labelS));
        return labelS;
    },
    setTopTextWithButton: function setTopTextWithButton(string) {
        ddz.LOGD(null, "file = [ddz_buttonList_2] fun = [setTopTextWithButton] string = " + JSON.stringify(string));
        this.topRichText.string = string;
    },

    setBottomTextWithButton: function setBottomTextWithButton(string) {
        this.bottomRichText.string = string;
    },

    hideBottomBtn: function hideBottomBtn(isShow) {
        this.bottomButton.node.active = isShow;
    },

    // setTopBtnCallBack:function(_topCall,_bottomCall){
    //     this.topCallFunc = _topCall;
    //     this.bottomCallFunc = _bottomCall;
    // },
    setBtnCallBack: function setBtnCallBack(_topCall, _bottomCall) {
        this.topCallFunc = _topCall;
        this.bottomCallFunc = _bottomCall;
    },

    topButtonCallFunc: function topButtonCallFunc() {
        hall.LOGW("====", "====topButtonCallFunc===");
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
            hall.MsgBoxManager.showToast({ title: "正在登录，请稍候" });
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        this.topCallFunc();
    },
    bottomButtonCallFunc: function bottomButtonCallFunc() {
        hall.LOGW("====", "====bottomButtonCallFunc===");
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
            hall.MsgBoxManager.showToast({ title: "正在登录，请稍候" });
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        this.bottomCallFunc();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // updte (dt) {},
});

cc._RF.pop();