/**
 * Created by tuyoo on 2018/2/23.
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "enter_queue";
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

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backBtn.node.y = backButtonH;
        }

        var size = cc.director.getWinSize();
        if(this.bgBtn){
            this.bgBtn.node.setContentSize(size);
        }
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TREASURE_BOX);

        var bc = ddz.gameModel.getRoomListBannerConfigJson();
        if (bc) {
            if (!ddz.curAllWidthBannerAd){
                hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
                this.feeText.node.y = -200;
            }
        }
    },

    enterQueue:function(){
        ddz.LOGD("","file = [enter_queue] fun = [enterQueue] ");
        if (ddz.gameModel.isLoadTableScene) {
            this.shutSelf();
        }else {
            this.tipsLabel.string = '匹配中...';
            this.tipsLabel2.string = '';
            this.bgSprite.node.active = true;
            var _queueInfo = ddz.matchModel.getCurQueueInfo();
            if (_queueInfo.roomFee && _queueInfo.roomFee > 0) {
                if (this.feeText) {
                    this.feeText.node.active = true;
                    this.feeText.string = "<color=#ffffff>本局服务费</color><img src='ddz_coin_white'/><color=#FFFFFF>" + _queueInfo.roomFee + "</c>";
                }
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

    /**
     * 播放动画
     * @param value
     */
    playAni : function (value) {
        if (this.node){
            var ani = this.node.getComponent(cc.Animation);
            var anim = ani.getAnimationState('ddz_matching');
            if (value && !ddz.gameModel.isLoadTableScene){
                anim.play();
            }
            else{
                anim.stop();
            }
        }

        this.isPlaying = value;
    },

    shutSelf:function (noDelete) {
        ddz.LOGD("","file = [enter_queue] fun = [shutSelf] this.isPlaying = " + this.isPlaying);
        if (this.isPlaying){
            this.playAni(false);
        }

        if (this.node) {
            var ani = this.node.getComponent(cc.Animation);
            if (ani) {
                ani.stop();
            }
        }
        ty.NotificationCenter.ignoreScope(this);
        if (!noDelete) {
            if (this.node) {
                this.node.destroy();
            }
        }

        if (hall.GlobalFuncs.isInAtScene("TableScene")) {
            hall.adManager.canShowTableBanner = true;
            hall.adManager.canShowTableTopBanner = true;
            ty.NotificationCenter.trigger(ddz.EventType.SHOW_TABLE_BANNER);
        }
    },

    onDestroy:function () {
        hall.adManager.destroyWidthBannerAd();
    }

    // start () {
    //
    // },

    // update (dt) {},
});