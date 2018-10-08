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

    },

    onLoad :function() {
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_MATCHING, this.shutSelf, this);
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