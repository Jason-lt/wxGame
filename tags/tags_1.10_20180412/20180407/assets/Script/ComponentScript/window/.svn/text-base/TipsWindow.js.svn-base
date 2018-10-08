


//use
// var tipsWindow = cc.instantiate(this.tipsWindow);
// this.node.addChild(tipsWindow);
// var window = tipsWindow.getComponent('TipsWindow');
// window.setTitleContentAndButtons("你好","再见",["再也不见"]);

cc.Class({
    extends: cc.Component,

    properties: {

        forTipsNode : {
            default : null,
            type  : cc.Node
        },

        backBg : {
            default : null,
            type  : cc.Button
        },
        titleLabe : {
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
        leftLabe : {
            default : null,
            type  : cc.RichText
        },
        rightButton : {
            default : null,
            type : cc.Button
        },
        rightLabe : {
            default : null,
            type  : cc.RichText
        },
        centerButton : {
            default : null,
            type : cc.Button
        },
        centerLabe : {
            default : null,
            type  : cc.RichText
        },
        countLabel : {
            default : null,
            type  : cc.Label
        },
        coloseButton : {
            default : null,
            type : cc.Button
        },
        clickType : 0,
        parentSce :{
            default : null,
        },

        forQRNode : {
            default : null,
            type  : cc.Node
        },
        titlLabel : {
            default : null,
            type  : cc.Label
        },
        tipLabel : {
            default : null,
            type  : cc.Label
        },
    },

    onLoad : function () {
        // var testArray = [{
        //     title :"邀请了就",
        //     right :"dda_button_diamond",
        //     bottomType :1
        // },
        //     {
        //     title :"重新闯关",
        //     bottomType : 0
        // }
        // ];
        // this.setTitleContentAndButtons("提示~","距离领航就差3关了,确定要放弃么?",testArray);
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        // anim1.on('finished', this.completeAni,this);
        anim1.play();
    },

    //type:1、关注公众号 2、领奖成功
    setQRType: function (type) {
        this.forTipsNode.active = false;
        this.forQRNode.active = true;
        if (type == 2){
            this.titlLabel.string = "领取成功";
            this.tipLabel.string = "奖励通过微信公众号发放";
        }
        this.coloseButton.node.on('click', this.onClose, this);
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);
    },
    
    setTitleContentAndButtons: function (titleString, contentString, buttons,diamondCoount) {
        var size = cc.director.getWinSize();
        ddz.LOGD(null, "cc.director.getWinSize()"+size.width+"++++"+size.height);
        this.backBg.node.setContentSize(size);
        this.titleLabe.string = titleString;
        this.contentLabel.string = "<color=#292929>"+contentString+"</color>";
        if(diamondCoount && diamondCoount != 0){
            this.countLabel.node.active = true;
            this.countLabel.string = "已有:"+diamondCoount;
        }
        var number = buttons.length;
        if(number == 1){
            this.rightButton.node.active = false;
            this.leftButton.node.active = false;
            this.centerButton.node.active = true;
            this.centerLabe.string = this.setRichTextWithButton(buttons[0]);
            this.centerButton.node.on('click', this.onClickCenterButton, this);
        }else {
            this.leftButton.node.active = true;
            this.rightButton.node.active = true;
            this.centerButton.node.active = false;
            this.leftLabe.string =  this.setRichTextWithButton(buttons[0]);
            this.rightLabe.string =  this.setRichTextWithButton(buttons[1]);
            this.leftButton.node.on('click', this.onClickLeftButton, this);
            this.rightButton.node.on('click', this.onClickRightButton, this);
        }
        this.coloseButton.node.on('click', this.onClose, this);
    },
    changeContentLabelString : function (guanS) {
        var guan = ddz.matchModel.getStageIndex()-1;
        var desInfo = ddz.matchModel.getCurDes();
        if(desInfo && desInfo.detailStages){
            var stageInfo = desInfo.detailStages;
            if(stageInfo && stageInfo.length > guan){
                var des = stageInfo[guan];
                var count = des.count;
                if(count){
                    this.contentLabel.string = "<color=#292929>使用 </color><img src='dda_button_diamond_black' height=38 width=44/> x"+count+"继续挑战第"+guanS+"关";
                    return;
                }
            }
        }
        this.contentLabel.string = "<color=#292929>使用 </color><img src='dda_button_diamond_black' height=38 width=44/> x1继续挑战第"+guanS+"关";
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
    },
    playEndAnimation : function () {
        // var animation = this.getComponent(cc.Animation);
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        anim1.on('finished', this.completeAni,this);
        anim1.play();
    },
    completeAni : function () {
        if(this.clickType == 1){
            this.parentSce.onClickLeftButton();
        }else if(this.clickType == 2){
            this.parentSce.onClickRightButton();
        }else if(this.clickType == 3){
            this.parentSce.onClickCenterButton();
        }
        this.node.removeFromParent();
    },
    onClickLeftButton:function (event) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        // this.parentSce.onClickLeftButton();
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        this.clickType = 1;
        this.playEndAnimation();
    },
    onClickRightButton:function (event) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        // this.parentSce.onClickRightButton();
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        this.clickType = 2;
        this.playEndAnimation();
        // console.log("onClickRightButton");
    },
    onClickCenterButton:function (event) {
        // this.parentSce.onClickCenterButton();
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        this.clickType = 3;
        this.playEndAnimation();
        // console.log("onClickCenterButton");
    },
    onClose:function (event) {
        //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Button 组件
        // var button = event.detail;
        // console.log("onClose");
        this.playEndAnimation();
    },
    onDestroy : function () {
    }
});
