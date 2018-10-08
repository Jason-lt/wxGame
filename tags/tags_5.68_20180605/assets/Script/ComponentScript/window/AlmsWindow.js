/**
 * 救济金窗口
 */
cc.Class({
    extends: cc.Component,

    properties: {
        txtTitle : cc.Label,
        txtDesc : cc.RichText,
        txtOkBtn : cc.RichText,
        btnOk : cc.Button,
        txtCancel : cc.RichText,
    },

    initWithPar:function (par) {

        // par = {
        //     "buttonText1":"观看广告",
        //     "buttonText2":"点击放弃>",
        //     "content":"金币不够啦，\n看广告可以领1000金币哦~",
        //     "failCountMax":100,
        //     "failCountMin":6,
        //     "resurgenceCondition":{
        //         "adIds":[
        //             "adunit-8bde7ac62d379503"
        //         ],
        //         "conditionType":"ad",
        //         "requestCount":1,
        //         "sharePointId":67890013
        //     },
        //     "title":"提示"
        // };

        this.condition = par.resurgenceCondition;

        this.txtTitle.string = par.title;
        this.txtDesc.string = par.content;
        this.txtOkBtn.string = par.buttonText1;
        this.txtCancel.string = par.buttonText2;
        var that = this;
        this.scheduleOnce(function () {
            var ani = that.node.getComponent(cc.Animation);
            ani.play('btnTick');
        }, 1);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function () {

        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.removeLoopAni, this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE, this.onAdComplete, this);

        // var that = this;
        // this.scheduleOnce(function () {
        //     var ani = that.node.getComponent(cc.Animation);
        //     ani.play('btnTick');
        // }, 1);
    },

    onAdComplete:function (adId) {
        if (this.condition.adIds.indexOf(adId) > -1){
            //中了,发金币
            this.getReward();
        }
        this.shut();
    },

    getReward:function () {
        ddz.gameModel.shareToGetreward(this.condition.sharePointId);
        // ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.alms)
    },

    removeLoopAni:function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.stop();
    },

    onClose :function () {
        this.shut();
    },

    onCancel : function () {
        this.shut();
    },

    onOk:function () {
        if (this.condition.conditionType == "ad"){
            var aidx;
            if (this.condition.adIds.length == 1){
                aidx = 0;
            }
            else{
                aidx = Math.floor(this.condition.adIds.length * Math.random());
            }
            var adid = this.condition.adIds[aidx];
            hall.adManager.showRewardedVideo(adid, 'alms')
        }
        else{
            ddz.Share.shareWithType(this.condition['shareConfigId']);
            this.shut();
        }
    },
    
    shut:function () {
        ddz.almsWindow = null;
        this.removeLoopAni();
        this.node.destroy();
    },
    
    
    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
    }

    // update (dt) {},
});