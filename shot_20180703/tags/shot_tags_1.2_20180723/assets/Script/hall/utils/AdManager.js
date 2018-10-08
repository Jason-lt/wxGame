/**
 * 导量广告ICO
 * Created by xujing on 2018/5/16.
 */
hall.adManager = {
    // icoBtn:null,
    videoAdId:"adunit-547bbb5117a6e8ae",
    videoAdManager : null,
    checkVideoTime : 300000,

    /**
     * 播放激励广告视频
     * @param type
     */
    showRewardedVideo:function (type) {

        // var adId = 'adunit-8bde7ac62d379503';
        if (!wx.hasOwnProperty('createRewardedVideoAd')){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
                ["no_support",type]);
            hall.LOGW(null, '玩家基础库,不支持激励广告视频!');
            ty.NotificationCenter.trigger(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR,'您的微信版本过低,请升级至6.6.6以上');
            return;
        }

        this.destroyBannerAd();

        // if (!this.videoAdManager){
        //     this.videoAdManager = wx.createRewardedVideoAd({
        //         adUnitId: hall.adManager.videoAdId
        //     });
        // }

        var onvVdClose = function (res) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
                ["success",type]);
            shot.LOGD(null, '广告播放完毕!');
            var playEnded = (!res || (res && res.isEnded));
            //只有播放完成才发奖
            ty.NotificationCenter.trigger(shot.EventType.REWARD_VIDEO_COMPLETE, playEnded);
            hall.adManager.videoAdManager.offClose(onvVdClose);
            hall.adManager.canPlay = false;
            hall.adManager.checkVideoAd();
        };

        if (hall.adManager.canPlay){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["begin", type]);
            hall.adManager.videoAdManager.show();
            this.destroyBannerAd();
            hall.adManager.videoAdManager.onClose(onvVdClose);
        }else{
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["fail", type]);
            ty.NotificationCenter.trigger(shot.EventType.REWARD_VIDEO_COMPLETE, true);
        }
        // videoAd.load().then(function () {
        //     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
        //         ["begin",type]);
        //     videoAd.show();
        //     videoAd.onClose(onvVdClose);
        // }).catch(function (err) {
        //     videoAd.load().then(function () {
        //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
        //             ["begin",type]);
        //         videoAd.show();
        //         videoAd.onClose(onvVdClose);
        //     }).catch(function (err) {
        //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
        //             ["fail",type]);
        //         if (err.errMsg == 'no advertisement'){
        //             err.errMsg = '系统繁忙、或网络状态较差,请稍后重试!';
        //         }
        //         ty.NotificationCenter.trigger(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR, err.errMsg);
        //         shot.LOGD(null, err.errMsg)
        //     });
        // });
    },

    checkVideoAd:function () {
        if (!wx.hasOwnProperty('createRewardedVideoAd')){
            hall.adManager.canPlay = false;
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["not support"]);
            hall.LOGW(null, '玩家基础库,不支持激励广告视频!');
            return;
        }

        if (!this.videoAdManager){
            this.videoAdManager = wx.createRewardedVideoAd({
                adUnitId: hall.adManager.videoAdId
            });
        }

        this.videoAdManager.load().then(function () {
            hall.LOGW("====== 成功获取广告");
            hall.adManager.canPlay = true;
        }).catch(function (err) {
            hall.LOGW("====== 获取广告失败,继续获取", JSON.stringify(err));
            hall.adManager.canPlay = false;

            setTimeout(function () {
                hall.adManager.checkVideoAd();
            }, hall.adManager.checkVideoTime);
        });
    },

    getSysInfo:function () {
        if (!this.sysInfo){
            this.sysInfo = wx.getSystemInfoSync();
        }
        return this.sysInfo;
    },

    canShowBanner:function () {
        return wx.hasOwnProperty('createBannerAd');
    },
    /**
     * 展示Banner广告
     * @param adid 广告ID
     */
    showBannerAd:function (adid) {
        if(!shot.GameWorld.gunnerShareSchemeConfig || !shot.GameWorld.gunnerShareSchemeConfig.showBanner){
            return;
        }
        if (!this.canShowBanner){
            hall.LOGW(null, '玩家基础库,不支持banner!');
            return;
        }

        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;

        this.destroyBannerAd();

        hall.LOGW('showBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        shot.curBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:0,
                top:0,
                width: 300
            }
        });

        shot.curBannerAd.onResize(function (res) {
            hall.LOGW('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            shot.curBannerAd.style.left = (screenWidth - res.width)/2;
            // shot.curBannerAd.style.top = screenHeight - res.height + 1+75;
            shot.curBannerAd.style.top = screenHeight - 80;
        });

        shot.curBannerAd.show();
    },

    destroyBannerAd:function () {
        if (shot.curBannerAd){
            shot.curBannerAd.destroy();
            shot.curBannerAd = null;
        }
    }
};