/**
 * 导量广告ICO
 * Created by xujing on 2018/5/16.
 */
hall.adManager = {
    icoBtn:null,
    showAdIco:function () {
        if (!this.icoBtn){
            var that = this;
            cc.loader.loadRes('prefabs/adNode', function (err, prefab) {
                var preFabNode = cc.instantiate(prefab);
                cc.director.getScene().addChild(preFabNode);
                that.icoBtn = preFabNode;
                cc.game.addPersistRootNode(preFabNode);

                cc.loader.load({url: 'https://richqn.nalrer.cn/dizhu/other_game_ico/buyu.png'}, function (err, texture) {
                    if (!err) {
                        var spriteIco = preFabNode.getChildByName('adIcon');
                        spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        var adButton = preFabNode.getChildByName('adButton');
                        adButton.on('click', function () {
                            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["other_fish"]);
                            that.showBigAd();
                        });
                    }
                    else {
                        //加载失败
                    }
                });
            });
        }else{
            this.icoBtn.active = true;
        }
        var curScene = cc.director.getScene();
        if (curScene.name != "Ddz") {
            this.hideAdIco();
        }
    },
    /**
     * 显示广告图
     */
    showBigAd:function () {

        var adPath = 'https://richqn.nalrer.cn/dizhu/other_game_ico/fish/ad_big_fish.jpg';
        wx.previewImage({
            current: adPath,
            urls: [adPath],
            success:function(res){
                ddz.LOGD(null, "预览图片成功！");
            },
            fail:function (res) {
                ddz.LOGD(null, "预览图片失败！");
            }
        });
    },

    hideAdIco:function () {
        if (this.icoBtn){
            this.icoBtn.active = false;
        }
    },

    /**
     * 播放激励广告视频
     * @param adId 广告ID
     * @param type
     */
    showRewardedVideo:function (adId,type) {

        // var adId = 'adunit-8bde7ac62d379503';
        if (!wx.hasOwnProperty('createRewardedVideoAd')){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFailedWatchVideo,
                [type]);
            hall.LOGW(null, '玩家基础库,不支持激励广告视频!');
            ty.NotificationCenter.trigger(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,'您当前版本不支持广告视频');
            return;
        }

        var videoAd = wx.createRewardedVideoAd({
            adUnitId: adId
        });

        var onvVdClose = function (res) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeSuccessWatchVideo,
                [type]);
            ddz.LOGD(null, '广告播放完毕!');
            ty.NotificationCenter.trigger(ddz.EventType.REWARD_VIDEO_COMPLETE, adId);
            videoAd.offClose(onvVdClose);
        };

        videoAd.load().then(function () {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeBeginWatchVideo,
                [type]);
            videoAd.show();
            videoAd.onClose(onvVdClose);
        }).catch(function (err) {
            videoAd.load().then(function () {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeBeginWatchVideo,
                    [type]);
                videoAd.show();
                videoAd.onClose(onvVdClose);
            }).catch(function (err) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFailedWatchVideo,
                    [type]);
                if (err.errMsg == 'no advertisement'){
                    err.errMsg = '系统繁忙、或网络状态较差,请稍后重试!';
                }
                ty.NotificationCenter.trigger(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR, err.errMsg);
                ddz.LOGD(null, err.errMsg)
            });
        });
    }
};