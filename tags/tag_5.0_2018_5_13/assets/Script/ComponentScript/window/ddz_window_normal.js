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
        backBg : {
            default : null,
            type  : cc.Button
        },
        titleLabel : {
            default : null,
            type  : cc.Label
        },
        contentLabel : {
            default : null,
            type : cc.RichText
        },
        leftButton : {
            default : null,
            type : cc.Button
        },
        rightButton : {
            default : null,
            type : cc.Button
        },
        centerButton : {
            default : null,
            type : cc.Button
        },
        centerRichText : {
            default : null,
            type : cc.RichText
        },
        leftRichText : {
            default : null,
            type : cc.RichText
        },
        rightRichText : {
            default : null,
            type : cc.RichText
        },
        actionBefore : false, //先有事件,手动close播放消失动画
        clickType : ""
    },

    onLoad : function () {
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);

        this.leftCallFunc = function(){};
        this.rightCallFunc = function(){};
        this.centerCallFunc = function(){};

        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();
    },

    setTitleContentAndButtonsString: function (titleString, contentString, buttons) {
        this.titleLabel.string = titleString;
        this.contentLabel.string = contentString;
        if(buttons.length == 1){
            this.centerButton.node.active = true;
            this.leftButton.node.active = false;
            this.rightButton.node.active = false;
            this.centerRichText.string = buttons[0];
        }else if(buttons.length == 2){
            this.centerButton.node.active = false;
            this.leftButton.node.active = true;
            this.rightButton.node.active = true;
            this.leftRichText.string = buttons[0];
            this.rightRichText.string = buttons[1];
        }
    },
    
    playEndAnimation : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        anim1.on('finished', this.completeAni,this);
        anim1.play();
    },
    completeAni : function () {
        if(this.clickType != ""){
            switch (this.clickType){
                case  'left' : this.leftCallFunc();break;
                case  'right' : this.rightCallFunc();break;
                case  'center' : this.centerCallFunc();break;
                default : break;
            }
        }
        this.node.destroy();
    },
    onClickLeftButton:function (event,type) {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if(!this.actionBefore){
            this.clickType = type;
            this.playEndAnimation();
        }else {
            this.leftCallFunc();
        }
    },
    onClickRightButton:function (event,type) {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        if(!this.actionBefore){
            this.clickType = type;
            this.playEndAnimation();
        }else {
            this.rightCallFunc();
        }
    },
    onClickCenterButton:function (event,type) {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        if(!this.actionBefore){
            this.clickType = type;
            this.playEndAnimation();
        }else {
            this.centerCallFunc();
        }
    },

    onClose:function (event) {
        this.playEndAnimation();
    },

    onDestroy : function () {
    }
});
