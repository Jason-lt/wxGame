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
        massageListWeight :[],
        nowIndex : 1,
    },

    onLoad :function() {
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_MATCHING, this.shutSelf, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE,this.shutSelf,this);
        this.massageListWeight = [0,1,2,3,4,5];
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
        var massageList = ddz.GameWorld.matchingMassage;
        if(!this.massageListWeight || !this.massageListWeight.length || this.massageListWeight.length < 1){
            return null;
        }
        var massageIndex = hall.GlobalFuncs.getRandomNumberBefore(this.massageListWeight.length);
        var index = this.massageListWeight[massageIndex];
        var textS = massageList[index];

        //删除已出现索引
        var  i = 0;
        while (i < this.massageListWeight.length){
            if (this.massageListWeight[i] == index){
                this.massageListWeight.splice(i,1);
            }else {
                i ++;
            }
        }

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