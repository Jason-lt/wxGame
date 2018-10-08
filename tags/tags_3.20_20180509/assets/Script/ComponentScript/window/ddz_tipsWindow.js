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
        coloseButton : {
            default : null,
            type : cc.Button
        },

        titleLabel : {
            default : null,
            type  : cc.Label
        },
        buttonListNode : {
            default : null,
            type : cc.Node
        },
        contentLabel : {
            default : null,
            type : cc.RichText
        },
        tipstLabel : {
            default : null,
            type : cc.Label
        },
        tipsRichText : {
            default : null,
            type : cc.RichText
        },
        progressNode : {
            default : null,
            type : cc.Node
        },

        clickType : 0,
        parentScene :{
            default : null
        },
        noDissolve : false, //为true时点击左右按钮弹窗不消失
        lossTime : 0,//倒计时时间
        isCreator : false,//是否是解散牌桌发起者窗口
        agreeState : false,//是否同意解散牌桌
        havaAnswer : false
    },

    onLoad : function () {
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);
        // this.coloseButton.node.on('click', this.onClose, this);

        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();
    },
    setTitleContentAndButtons: function (titleString, contentString, buttons,diamondCount) {
        this.titleLabel.string = titleString;
        this.contentLabel.string = "<color=#1A6951>" + contentString + "</color>";
        var buttonManager =   this.buttonListNode.getComponent('ddz_item_tipsWindow_buttonNode');
        buttonManager.setButtons(buttons,diamondCount);
        this.progressNode.active = false;
        this.buttonListNode.active = true;
        this.tipsRichText.node.active = false;
        this.contentLabel.node.y = 20;
    },

    updatePos:function(timer,tips_2){
        if (timer){
            this.contentLabel.node.y = 50;
            this.tipstLabel.node.active = true;
            this.tipstLabel.string = tips_2;
            ty.Timer.setTimer(this, function(){
                this.tipstLabel.node.active = false;
            }, timer, 1, 0);
        }else {
            this.contentLabel.node.y = 17;
            this.tipstLabel.node.active = false;
        }

    },

    playEndAnimation : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        anim1.on('finished', this.completeAni,this);
        anim1.play();
    },
    completeAni : function () {
        if(this.clickType == 1){
            if(this.parentScene){
                this.parentScene.onClickLeftButton();
            }
        }else if(this.clickType == 2){
            if(this.parentScene){
                this.parentScene.onClickRightButton();
            }
        }else if(this.clickType == 3){
            if(this.parentScene) {
                this.parentScene.onClickCenterButton();
            }
        }
        this.node.removeFromParent();
    },
    onClickLeftButton:function (event) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);

        if(this.noDissolve){
            this.clickType = 0;
            if(this.parentScene){
                this.parentScene.onClickLeftButton();
            }
        }else {
            this.clickType = 1;
            this.playEndAnimation();
        }
    },
    onClickRightButton:function (event) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if(this.noDissolve){
            this.clickType = 0;
            if(this.parentScene){
                this.parentScene.onClickRightButton();
            }
        }else {
            this.clickType = 2;
            this.playEndAnimation();
        }
    },
    onClickCenterButton:function (event) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if(this.noDissolve){
            this.clickType = 0;
            if(this.parentScene){
                this.parentScene.onClickCenterButton();
            }
        }else {
            this.clickType = 3;
            this.playEndAnimation();
        }
    },

    onClose:function (event) {
        // 排行榜startButton 弹出二级弹窗点击关闭后
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_RANK_LIST);
        this.clickType = 0;
        this.playEndAnimation();
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
                    this.contentLabel.string = "<color=#1A6951>使用 </color><img src='dda_button_diamond_black' height=34 width=42/>" +
                        "<color=#1A6951> x"+ count+"继续挑战第"+guanS+"关</color>";
                    return;
                }
            }
        }
        this.contentLabel.string = "<color=#1A6951>使用 </color><img src='dda_button_diamond_black' height=34 width=42/><color=#1A6951> 1继续挑战第"+guanS+"关</color>";
    },

    //房主发起的显示窗口
    setDissolvePregrossForCreator : function (lossTime,progress) {
        this.coloseButton.node.active = false;
        this.lossTime = lossTime;
        this.buttonListNode.active = false;
        this.tipsRichText.node.active = false;
        this.progressNode.active = true;
        this.contentLabel.string = "<color=#1A6951>你已发起解散牌桌</c><br/><color=#1A6951>请等待其他玩家确定("+this.lossTime+"s)</c>";
        this.contentLabel.node.y = 55;
        this.progressNode.y = -50;
        var progressManager =   this.progressNode.getComponent('ddz_item_tipswindow_progress');
        progressManager.setDissolvePregross(progress);
        this.isCreator = true;
        this.havaAnswer = true;
        ty.Timer.setTimer(this,this.countDown,1);
    },
    //等待玩家确认是否解散牌桌的窗口
    setDissolvePregrossForAnswer : function (lossTime,progress,name) {
        this.coloseButton.node.active = false;
        this.lossTime = lossTime;
        this.titleLabel.string = "解散牌桌";
        this.buttonListNode.active = true;
        this.tipsRichText.node.active = false;
        this.progressNode.active = true;
        this.contentLabel.string = "<color=#1A6951>玩家  </c><color=#FD5051>"+name+"</c><color=#1A6951>  发起解散牌桌</c><br/><color=#1A6951>是否同意？</c>";
        this.contentLabel.node.y = 75;

        var progressManager =   this.progressNode.getComponent('ddz_item_tipswindow_progress');
        progressManager.setDissolvePregross(progress);
        var testArray = [
            {title :"解散("+this.lossTime+"s)"}, {title :"不解散"}
        ];
        var buttonManager =   this.buttonListNode.getComponent('ddz_item_tipsWindow_buttonNode');
        buttonManager.setButtons(testArray);
        this.isCreator = false;
        this.havaAnswer = false;
        ty.Timer.setTimer(this,this.countDown,1);
    },
    // isCreator : false,//是否是解散牌桌发起者窗口
    // agreeState : false,//是否同意解散牌桌
    // havaAnswer : false
    countDown : function () {
        this.lossTime -- ;
        if(this.lossTime <= 0){
            if(!this.havaAnswer){
                this.onClickLeftButton();
                this.onClose();
            }else {
                this.onClose();
            }
            return;
        }
        if(this.isCreator){
            this.contentLabel.string = "<color=#1A6951>你已发起解散牌桌</c><br/><color=#1A6951>请等待其他玩家确定("+this.lossTime+"s)</c>";
        }else {
            if(this.havaAnswer){
                if(this.agreeState){
                    this.contentLabel.string = "<color=#1A6951>你同意解散牌桌，等待牌友确认("+this.lossTime+"s)</c>";
                }else {
                    this.contentLabel.string = "<color=#1A6951>你不同意解散牌桌，等待牌友确认("+this.lossTime+"s)</c>";
                }
            }else {
                var testArray = [
                    {title :"解散("+this.lossTime+"s)"}, {title :"不解散"}
                ];
                var buttonManager =   this.buttonListNode.getComponent('ddz_item_tipsWindow_buttonNode');
                buttonManager.setButtons(testArray);
            }
        }
        if(this.lossTime){

        }
    },
    //更新解散进度
    changePregross : function (progress) {
        var progressManager =   this.progressNode.getComponent('ddz_item_tipswindow_progress');
        progressManager.setDissolvePregross(progress);
    },
    //等待第三个人回复
    changeStateToWait : function (anser) {
        this.havaAnswer = true;
        this.buttonListNode.active = false;
        this.tipsRichText.node.active = false;
        this.progressNode.active = true;
        if(anser == 1){
            this.agreeState = true;
            this.contentLabel.string = "<color=#1A6951>你同意解散牌桌，等待牌友确认("+this.lossTime+"s)</c>";
        }else {
            this.agreeState = false;
            this.contentLabel.string = "<color=#1A6951>你不同意解散牌桌，等待牌友确认("+this.lossTime+"s)</c>";
        }
        // this.contentLabel.string = "<color=#1A6951>玩家  </c><color=#FD5051>"+name+"</c><color=#1A6951>  发起介绍牌桌</c><br/><color=#1A6951>是否同意？</c>";
        this.contentLabel.node.y = 55;
        this.progressNode.y = -50;
    },
    onDestroy : function () {
        // ddz.friendModel.tipsWindow = null;
        this.unscheduleAllCallbacks();
    },
    
    onBlock : function () {
        
    }

    // update (dt) {},
});
