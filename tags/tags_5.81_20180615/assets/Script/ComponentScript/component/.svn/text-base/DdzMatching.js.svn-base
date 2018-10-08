/**
 * Created by tuyoo on 2018/2/23.
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "DdzMatching";
        this.isPlaying = false;
    },

    properties: {
        bgBtn: {
            default : null,
            type : cc.Button
        },
        tipsLabel: {
            default : null,
            type : cc.Label
        },
        tipsLabel2: {
            default : null,
            type : cc.Label
        },
        bgSprite: {
            default : null,
            type : cc.Sprite
        },
        backBtn: {
            default : null,
            type : cc.Button
        },
        feeText: {
            default : null,
            type : cc.RichText
        },
        nowIndex : 1,
        massageList :null
    },

    onLoad :function() {
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_MATCHING, this.shutSelf, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE,this.shutSelf,this);
        this.massageList = ddz.gameModel.matchingMassage;
        if (!this.massageList){
            this.massageList = ddz.GameWorld.matchingMassage;
        }

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backBtn.node.y = backButtonH;
        }

        this.backBtn.node.active = false;
        this.setTxet();
        ty.Timer.setTimer(this, this.changeTxet,3,cc.macro.REPEAT_FOREVER,-1);

        var size = cc.director.getWinSize();
        if(this.bgBtn){
            this.bgBtn.node.setContentSize(size);
        }
        hall.adManager.hideAdIco();
    },

    clearMessageList: function() {
        this.massageList = [''];
        this.tipsLabel.string = '匹配中...';
        this.tipsLabel2.string = '';
        this.bgSprite.node.active = true;
        ty.Timer.cancelTimer(this, this.changeTxet);
    },

    enterQueue:function(){
        this.backBtn.node.active = true;
        this.massageList = [''];
        this.tipsLabel.string = '匹配中...';
        this.tipsLabel2.string = '';
        this.bgSprite.node.active = true;
        ty.Timer.cancelTimer(this, this.changeTxet);
        var _queueInfo = ddz.matchModel.getCurQueueInfo();
        if (_queueInfo.roomFee && _queueInfo.roomFee > 0) {

            if (this.feeText) {
                this.feeText.node.active = true;
                this.feeText.string = "<color=#ffffff>本局服务费</color><img src='ddz_coin_white'/><color=#FFFFFF> " + _queueInfo.roomFee + "</c>";
            }

        }
    },

    backAction:function(){
        var _queueInfo = ddz.matchModel.getCurQueueInfo();
        this.shutSelf();
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var _mixID = _queueInfo.mixId;
        var _mixedRoomId = _queueInfo.mixedRoomId;
        ddz.MsgFactory.getRoomLeave(_queueInfo.roomId, null, null, _mixID,_mixedRoomId);
    },

    setTxet : function () {
        this.tipsLabel.string = this.getShowText();
    },

    changeTxet : function () {
        var ani = this.node.getComponent(cc.Animation);
        if(this.nowIndex == 1){
            this.tipsLabel2.opacity = 0;
            this.tipsLabel2.string = this.getShowText();
            if(this.tipsLabel2.string == null){
                return;
            }
            var anim = ani.getAnimationState('changeTips');
            anim.play();
            this.nowIndex = 2;
        }else {
            this.tipsLabel.string = this.getShowText();
            if(this.tipsLabel.string == null){
                return;
            }
            var anim = ani.getAnimationState('changeTips2');
            anim.play();
            this.nowIndex = 1;
        }
    },
    // completeAniChange : function () {
    // },

    getShowText : function () {
        var massageIndex = hall.GlobalFuncs.getRandomNumberBefore(this.massageList.length);
        var textS = this.massageList[massageIndex];
        return textS;
    },

    /**
     * 播放动画
     * @param value
     */
    playAni : function (value) {
        if (this.node && cc.isValid(this.node)){
            var ani = this.node.getComponent(cc.Animation);
            var anim = ani.getAnimationState('ddz_matching');
            if (value){
                anim.play();
            }
            else{
                anim.stop();
            }
            this.isPlaying = value;
        }
    },

    shutSelf:function () {
        ddz.LOGD(this._TAG, "shutSelf");
        if (this.isPlaying){
            this.playAni(false);
        }
        ty.NotificationCenter.ignoreScope(this);
        ty.Timer.cancelTimer(this, this.changeTxet);

        if (this.node) {
            var ani = this.node.getComponent(cc.Animation);
            if (ani) {
                ani.stop();
                this.node.removeFromParent();
            }
        }

        var curScene = cc.director.getScene();
        // if (curScene.name == "Ddz") {
        //     hall.adManager.showAdIco();
        // }
        // this.node.destroy();
    },

    onDestroy:function () {
    }


    // start () {
    //
    // },

    // update (dt) {},
});