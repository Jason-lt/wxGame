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
    },

    onLoad :function() {
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_MATCHING, this.shutSelf, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE,this.shutSelf,this);
        var massageList = ddz.GameWorld.matchingMassage;
        var index = hall.GlobalFuncs.getRandomNumberBefore(massageList.length);
        this.tipsLabel.string = massageList[index];
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
        this.node.removeFromParent();
    },

    onDestroy:function () {
    },


    // start () {
    //
    // },

    // update (dt) {},
});