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
        btnText:cc.Label,
        closeAdBtn:cc.Button,
        yindao:cc.Node,
    },

    onLoad:function(){
        this.closeAdBtn.interactable = false;
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.closeAdBtn.node.y = backButtonH;
        }
        this.updateBtnTextTimer();

        if (!ddz.resurgenceBannerAd){
            hall.adManager.showResurgenceBannerAd('adunit-811cc4e234425489');
        }
        var ani = this.yindao.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {

        });
        anim.play();
    },

    updateBtnTextTimer:function(){
        var bc = ddz.gameModel.getBannerResurgenceConfigJson();
        var timer = 15;
        if (bc){
            if (bc.delay) {
                timer = bc.delay;
            }
        }
        this.setBtnSize(timer);
        var that = this;
        var callBack = function(){
            timer--;
            if (timer <=0) {
                ty.Timer.cancelTimer(that, function(){

                });
                that.closeAdBtn.interactable = true;
                that.setBtnSize("关闭广告");
            }else {
                that.setBtnSize(timer);
            }
        };
        ty.Timer.setTimer(this, callBack, 1);
    },

    setBtnSize:function(_string){
        this.btnText.string = _string;
        var size = this.closeAdBtn.node.getContentSize();

        if (_string == "关闭广告") {
            size.width = 160;
        }else {
            size.width = 80;
        }
        this.closeAdBtn.node.setContentSize(size);
        this.btnText.node.x = size.width/2;
    },

    onClickCenterBtn:function(){
        var matchCondition = ddz.GlobalFuncs.getFailCondition("match",ddz.GlobalFuncs.checkFailCount("match"));
        if (matchCondition) {
            var _toNext = matchCondition.resurgenceCondition.toNext;
            if (_toNext){
                ddz.matchModel.matchBackNextLevel();
                this.onClose();
                return;
            }
            else{
                var needCount = ddz.matchModel.getDiamondCountNeeded();
                ddz.waitGetRevial = {
                    type : 'waitRecive',
                    curCount : 0,
                    needCount : needCount
                };
            }
            var needCountR = ddz.waitGetRevial.needCount;
            //发送得钻石的消息
            for (var i = 0; i < needCountR; i++){
                ddz.gameModel.shareToGetreward(ddz.waitGetRevial.sharePoint || ddz.Share.SharePointType.firstFail);
            }
            this.onClose();
        }else {
            this.onClose();
        }
    },

    onClose:function(){
        ddz.bannerResurgenceWindow = null;
        var ani = this.yindao.getComponent(cc.Animation);
        ani.stop();
        this.yindao.removeFromParent();
        this.node.destroy();
    },

    onDestroy:function () {
        hall.adManager.destroyResurgenceBannerAd();
    }

});
