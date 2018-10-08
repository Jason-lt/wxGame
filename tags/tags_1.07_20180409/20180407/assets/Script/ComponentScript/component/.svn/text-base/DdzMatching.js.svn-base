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
        nowIndex : -1,
    },

    onLoad :function() {
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_MATCHING, this.shutSelf, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE,this.shutSelf,this);
        this.changeTxet();
        ty.Timer.setTimer(this, this.changeTxet, 2.5);
    },
    changeTxet : function () {
        this.tipsLabel.string = this.getShowText();
    },
    getShowText : function () {
        var massageList = ddz.GameWorld.matchingMassage;
        if(this.nowIndex < 0){
            this.nowIndex = hall.GlobalFuncs.getRandomNumberBefore(massageList.length);
        }else {
            this.nowIndex ++;
            if(this.nowIndex >= massageList.length){
                this.nowIndex = 0;
            }
        }
       return massageList[this.nowIndex];
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
        this.node.removeFromParent();
    },

    onDestroy:function () {
    },


    // start () {
    //
    // },

    // update (dt) {},
});