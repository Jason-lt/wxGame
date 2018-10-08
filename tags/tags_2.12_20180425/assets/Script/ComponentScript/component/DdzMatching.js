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
        tipsLabel: {
            default : null,
            type : cc.Label
        },
        tipsLabel2: {
            default : null,
            type : cc.Label
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
        this.setTxet();
        ty.Timer.setTimer(this, this.changeTxet, 3,0,-1);
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
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('ddz_matching');
        if (value){
            anim.play();
        }
        else{
            anim.stop();
        }

        this.isPlaying = value;
    },

    shutSelf:function () {
        ddz.LOGD(this._TAG, "shutSelf");
        if (this.isPlaying){
            this.playAni(false);
        }
        ty.NotificationCenter.ignoreScope(this);
        ty.Timer.cancelTimer(this, this.changeTxet);

        var ani = this.node.getComponent(cc.Animation);
        ani.stop();

        this.node.removeFromParent();
    },

    onDestroy:function () {
    },


    // start () {
    //
    // },

    // update (dt) {},
});