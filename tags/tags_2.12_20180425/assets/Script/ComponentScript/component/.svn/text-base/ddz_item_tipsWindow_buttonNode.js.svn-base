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
        leftButton : {
            default : null,
            type : cc.Button
        },
        leftLabel : {
            default : null,
            type  : cc.RichText
        },
        rightButton : {
            default : null,
            type : cc.Button
        },
        rightLabel : {
            default : null,
            type  : cc.RichText
        },
        centerButton : {
            default : null,
            type : cc.Button
        },
        centerLabel : {
            default : null,
            type  : cc.RichText
        },
        countLabel : {
            default : null,
            type  : cc.Label
        }
    },
    setButtons: function (buttons,diamondCoount) {
        if(diamondCoount && diamondCoount != 0){
            this.countLabel.node.active = true;
            this.countLabel.string = "已有:"+diamondCoount;
        }
        var number = buttons.length;
        if(number == 1){
            this.rightButton.node.active = false;
            this.leftButton.node.active = false;
            this.centerButton.node.active = true;
            this.centerLabel.string = this.setRichTextWithButton(buttons[0]);
        }else {
            this.leftButton.node.active = true;
            this.rightButton.node.active = true;
            this.centerButton.node.active = false;
            this.leftLabel.string =  this.setRichTextWithButton(buttons[0]);
            this.rightLabel.string =  this.setRichTextWithButton(buttons[1]);
        }
    },

    setRichTextWithButton:function(button){
        var  textS = "<color=#ffffff> "+button.title+" </color>";
        var labelS = textS;
        if (button.right){
            if (button.count){
                labelS = textS + "<img src='"+button.right+"' />x<color=#fffffff>"+button.count+"</color>";
            }else {
                labelS = textS + "<img src='"+button.right+"' />";
            }
        }else if (button.left){
            labelS = "<img src='"+button.left+"' />" + textS;
        }
        return labelS;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},



    // update (dt) {},
});
