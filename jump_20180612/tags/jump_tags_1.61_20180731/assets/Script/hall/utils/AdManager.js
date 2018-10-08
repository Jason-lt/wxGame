/**
 * 导量广告ICO
 * Created by xujing on 2018/5/16.
 */
hall.adManager = {
    videoAdId : "adunit-8cd7118e9aa59021",
    checkVideoTime : 300000,
    canShowTableBanner : false,
    canShowTableTopBanner : false,
    canShowListSceneBanner : false,
    canPlay : true,
    sysInfo:null,

    getSysInfo:function () {
        if (!this.sysInfo){
            this.sysInfo = wx.getSystemInfoSync();
        }
        return this.sysInfo;
    },

    /**
     * 播放激励广告视频
     * @param adId 广告ID
     * @param type
     */
    // showRewardedVideo:function (adId,type) {
    //
    //     // var adId = 'adunit-8bde7ac62d379503';
    //     if (!wx.hasOwnProperty('createRewardedVideoAd')){
    //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
    //             ["no_support",type]);
    //         hall.LOGW(null, '玩家基础库,不支持激励广告视频!');
    //         ty.NotificationCenter.trigger(jump.EventType.REWARD_VIDEO_COMPLETE_ERROR,'您当前版本不支持广告视频');
    //         return;
    //     }
    //
    //     // this.destroyBannerAd();
    //
    //     var videoAd = wx.createRewardedVideoAd({
    //         adUnitId: adId
    //     });
    //
    //     var onvVdClose = function (res) {
    //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
    //             ["success",type]);
    //         jump.LOGD(null, '广告播放完毕!');
    //         var playEnded = (!res || (res && res.isEnded));
    //         ty.NotificationCenter.trigger(jump.EventType.REWARD_VIDEO_COMPLETE, playEnded);
    //         videoAd.offClose(onvVdClose);
    //     };
    //
    //     videoAd.load().then(function () {
    //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
    //             ["begin",type]);
    //         videoAd.show();
    //         videoAd.onClose(onvVdClose);
    //     }).catch(function (err) {
    //         videoAd.load().then(function () {
    //             ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
    //                 ["begin",type]);
    //             videoAd.show();
    //             videoAd.onClose(onvVdClose);
    //         }).catch(function (err) {
    //             ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
    //                 ["fail",type]);
    //             if (err.errMsg == 'no advertisement'){
    //                 err.errMsg = '系统繁忙、或网络状态较差,请稍后重试!';
    //             }
    //             ty.NotificationCenter.trigger(jump.EventType.REWARD_VIDEO_COMPLETE_ERROR, err.errMsg);
    //             jump.LOGD(null, err.errMsg)
    //         });
    //     });
    // },

    // /**
    //  * 播放激励广告视频
    //  * @param adId 广告ID
    //  * @param type
    //  */
    showRewardedVideo:function (adId,type) {
        if (!wx.hasOwnProperty('createRewardedVideoAd')){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["not support",type]);
            hall.LOGW(null, '玩家基础库,不支持激励广告视频!');
            hall.MsgBoxManager.showToast({title:'您的微信版本过低,请升级至6.6.6以上'});
            return;
        }

        this.destroyBannerAd();

        var onvVdClose = function (res) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["success",type]);
            hall.LOGW(null, '广告播放完毕!' + JSON.stringify(res));
            var playEnded = (!res || (res && res.isEnded));
            //只有播放完成才发奖
            ty.NotificationCenter.trigger(jump.EventType.REWARD_VIDEO_COMPLETE, playEnded);
            hall.adManager.videoAdManager.offClose(onvVdClose);
            hall.adManager.canPlay = false;
            hall.adManager.checkVideoAd();
        };

        if (hall.adManager.canPlay){
            this.canShowTableBanner = false;
            this.canShowTableTopBanner = false;
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["begin", type]);
            hall.adManager.videoAdManager.show();
            // this.destroyResurgenceBannerAd();
            // this.destroyWidthBannerAd();
            this.destroyBannerAd();
            hall.adManager.videoAdManager.onClose(onvVdClose);
        }
        else{
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["fail", type]);
            ty.NotificationCenter.trigger(jump.EventType.REWARD_VIDEO_COMPLETE, true);
        }
    },

    checkVideoAd:function () {
        if (!wx.hasOwnProperty('createRewardedVideoAd')){
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

    canShowBanner:function () {
        return wx.hasOwnProperty('createBannerAd');
    },

    /**
     * 展示Banner广告
     * @param adid 广告ID
     */
    showBannerAd:function (adid) {
        if (!this.canShowBanner()){
            hall.LOGW(null, '玩家基础库,不支持banner!');
            return;
        }

        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;
        var winSize = cc.director.getWinSize();

        this.destroyBannerAd();
        // this.destroyWidthBannerAd();
        // this.destroyResurgenceBannerAd();

        hall.LOGW('showBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);
        var left_x = 0;
        // if (screenWidth && screenWidth < 350){
        //     left_x = -30;
        // }

        jump.curBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:left_x,
                top:0,
                width: 600
            }
        });
        jump.haveBanner = true;
        // var posx = 0;
        // var posy = 0;
        jump.curBannerAd.onResize(function (res) {
            hall.LOGW('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (jump.curBannerAd){
                jump.curBannerAd.style.left = left_x;
                jump.curBannerAd.style.top = screenHeight - res.height + 10;
                // posx = res.width * (winSize.width/screenWidth);
                // posy = res.height * (winSize.height/screenHeight) - 28;
            }
        });
        // ddz.curBannerAd.onLoad(function(){
        //     if (ddz.bannerCloseBtn) {
        //         ddz.bannerCloseBtn.updatePos(posx,posy);
        //     }else {
        //         ddz.GlobalFuncs.onBannerCloseBtn(posx,posy);
        //     }
        // });
        jump.curBannerAd.show();
    },

    destroyBannerAd:function () {
        jump.haveBanner = false;
        if (jump.curBannerAd){
            if (jump.curBannerAd.destroy) {
                jump.curBannerAd.destroy();
            }
            jump.curBannerAd = null;
        }
        if (jump.curTpoBannerAd){
            if (jump.curTpoBannerAd.destroy) {
                jump.curTpoBannerAd.destroy();
            }
            jump.curTpoBannerAd = null;
        }

        // if (ddz.bannerCloseBtn) {
        //     ddz.bannerCloseBtn.onClose();
        // }
    }
    //
    // /**
    //  * 展示Banner广告
    //  * @param adid 广告ID
    //  */
    // showTopBannerAd:function (adid) {
    //     if (!this.canShowBanner()){
    //         hall.LOGW(null, '玩家基础库,不支持banner!');
    //         return;
    //     }
    //
    //     var sysInfo = this.getSysInfo();
    //     var screenWidth = sysInfo.screenWidth;
    //     var screenHeight = sysInfo.screenHeight;
    //
    //     this.destroyBannerAd();
    //     this.destroyWidthBannerAd();
    //     this.destroyResurgenceBannerAd();
    //
    //     hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);
    //
    //     ddz.curTpoBannerAd = wx.createBannerAd({
    //         adUnitId: adid,
    //         style: {
    //             left:0,
    //             top:-10,
    //             width: 300
    //         }
    //     });
    //     ddz.haveBanner = true;
    //     ddz.curTpoBannerAd.onResize(function (res) {
    //         hall.LOGW('showTopBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
    //         if (ddz.curTpoBannerAd){
    //             ddz.curTpoBannerAd.style.left = (screenWidth - res.width)/2;
    //             ddz.curTpoBannerAd.style.top = -10;
    //         }
    //     });
    //
    //     ddz.curTpoBannerAd.show();
    // },
    //
    // showAllWidthBannerAd:function (adid) {
    //     if (!this.canShowBanner()){
    //         hall.LOGW(null, '玩家基础库,不支持banner!');
    //         return;
    //     }
    //     var sysInfo = this.getSysInfo();
    //     var screenWidth = sysInfo.screenWidth;
    //     var screenHeight = sysInfo.screenHeight;
    //
    //     this.destroyBannerAd();
    //     this.destroyWidthBannerAd();
    //     this.destroyResurgenceBannerAd();
    //
    //     hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);
    //
    //     ddz.curAllWidthBannerAd = wx.createBannerAd({
    //         adUnitId: adid,
    //         style: {
    //             left:0,
    //             top:0,
    //             width: screenWidth
    //         }
    //     });
    //
    //     ddz.haveBanner = true;
    //
    //     ddz.curAllWidthBannerAd.onResize(function (res) {
    //         hall.LOGW('showAllWidthBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
    //         if (ddz.curAllWidthBannerAd){
    //             ddz.curAllWidthBannerAd.style.left = (screenWidth - res.width)/2;
    //             ddz.curAllWidthBannerAd.style.top = screenHeight - res.height;
    //         }
    //     });
    //
    //     ddz.curAllWidthBannerAd.show();
    // },
    //
    // showResurgenceBannerAd:function(adid){
    //     if (!this.canShowBanner()){
    //         hall.LOGW(null, '玩家基础库,不支持banner!');
    //         return;
    //     }
    //     var sysInfo = this.getSysInfo();
    //     var screenWidth = sysInfo.screenWidth;
    //     var screenHeight = sysInfo.screenHeight;
    //
    //     this.destroyBannerAd();
    //     this.destroyWidthBannerAd();
    //     this.destroyResurgenceBannerAd();
    //     hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);
    //
    //     ddz.resurgenceBannerAd = wx.createBannerAd({
    //         adUnitId: adid,
    //         style: {
    //             left:0,
    //             top:0,
    //             width: screenWidth
    //         }
    //     });
    //
    //     ddz.haveBanner = true;
    //
    //     ddz.resurgenceBannerAd.onResize(function (res) {
    //         hall.LOGW('showResurgenceBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
    //         if (ddz.resurgenceBannerAd){
    //             ddz.resurgenceBannerAd.style.left = (screenWidth - res.width)/2;
    //             ddz.resurgenceBannerAd.style.top = screenHeight/2 - res.height;
    //         }
    //     });
    //
    //     ddz.resurgenceBannerAd.show();
    // },

    // hideBannerAd:function () {
    //     if (ddz.curBannerAd) {
    //         ddz.curBannerAd.hide();
    //     }
    //
    //     if (ddz.curTpoBannerAd) {
    //         ddz.curTpoBannerAd.hide();
    //     }
    //
    //     if (ddz.curAllWidthBannerAd) {
    //         ddz.curAllWidthBannerAd.hide();
    //     }
    //     ddz.haveBanner = false;
    // },

    //
    // destroyWidthBannerAd:function(){
    //     jump.haveBanner = false;
    //     if (jump.curAllWidthBannerAd){
    //         if (jump.curAllWidthBannerAd.destroy) {
    //             jump.curAllWidthBannerAd.destroy();
    //         }
    //         jump.curAllWidthBannerAd = null;
    //     }
    // },
    //
    // destroyResurgenceBannerAd:function(){
    //     jump.haveBanner = false;
    //     if (jump.resurgenceBannerAd){
    //         if (jump.resurgenceBannerAd.destroy) {
    //             jump.resurgenceBannerAd.destroy();
    //         }
    //         jump.resurgenceBannerAd = null;
    //     }
    // }
};
