/**
 * 导量广告ICO
 * Created by xujing on 2018/5/16.
 */
hall.adManager = {
    icoBtn:null,
    videoAdId:"adunit-18726a0b6953b0d2",
    checkVideoTime : 300000,
    canShowTableBanner : false,
    canShowTableTopBanner : false,
    canShowListSceneBanner : false,
    sysInfo:null,
    showAdIco:function () {
        /*
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
        }*/
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
    showRewardedVideo:function (adId,type) {
        // throw new Error('许敬测试的错误!');
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
            ty.NotificationCenter.trigger(ddz.EventType.REWARD_VIDEO_COMPLETE, playEnded);
            hall.adManager.videoAdManager.offClose(onvVdClose);
            hall.adManager.canPlay = false;
            hall.adManager.checkVideoAd();
        };

        if (hall.adManager.canPlay){
            this.canShowTableBanner = false;
            this.canShowTableTopBanner = false;
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["begin", type]);
            hall.adManager.videoAdManager.show();
            this.destroyResurgenceBannerAd();
            this.destroyWidthBannerAd();
            this.destroyBannerAd();
            hall.adManager.videoAdManager.onClose(onvVdClose);
        }
        else{
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, ["fail", type]);
            ty.NotificationCenter.trigger(ddz.EventType.REWARD_VIDEO_COMPLETE, true);
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
        this.destroyWidthBannerAd();
        this.destroyResurgenceBannerAd();

        hall.LOGW('showBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        ddz.curBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:0,
                top:0,
                width: 300
            }
        });
        ddz.haveBanner = true;
        // var posx = 0;
        // var posy = 0;
        ddz.curBannerAd.onResize(function (res) {
            hall.LOGW('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (ddz.curBannerAd){
                ddz.curBannerAd.style.left = 0;
                ddz.curBannerAd.style.top = screenHeight - res.height + 10;
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
        ddz.curBannerAd.show();
    },

    /**
     * 展示Banner广告
     * @param adid 广告ID
     */
    showTopBannerAd:function (adid) {
        if (!this.canShowBanner()){
            hall.LOGW(null, '玩家基础库,不支持banner!');
            return;
        }

        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;

        this.destroyBannerAd();
        this.destroyWidthBannerAd();
        this.destroyResurgenceBannerAd();

        hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        ddz.curTpoBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:0,
                top:-10,
                width: 300
            }
        });
        ddz.haveBanner = true;
        ddz.curTpoBannerAd.onResize(function (res) {
            hall.LOGW('showTopBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (ddz.curTpoBannerAd){
                ddz.curTpoBannerAd.style.left = (screenWidth - res.width)/2;
                ddz.curTpoBannerAd.style.top = -10;
            }
        });

        ddz.curTpoBannerAd.show();
    },

    showAllWidthBannerAd:function (adid) {
        if (!this.canShowBanner()){
            hall.LOGW(null, '玩家基础库,不支持banner!');
            return;
        }
        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;

        this.destroyBannerAd();
        this.destroyWidthBannerAd();
        this.destroyResurgenceBannerAd();

        hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        ddz.curAllWidthBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:0,
                top:0,
                width: screenWidth
            }
        });

        ddz.haveBanner = true;

        ddz.curAllWidthBannerAd.onResize(function (res) {
            hall.LOGW('showAllWidthBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (ddz.curAllWidthBannerAd){
                ddz.curAllWidthBannerAd.style.left = (screenWidth - res.width)/2;
                ddz.curAllWidthBannerAd.style.top = screenHeight - res.height;
            }
        });

        ddz.curAllWidthBannerAd.show();
    },

    showResurgenceBannerAd:function(adid){
        if (!this.canShowBanner()){
            hall.LOGW(null, '玩家基础库,不支持banner!');
            return;
        }
        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;

        this.destroyBannerAd();
        this.destroyWidthBannerAd();
        this.destroyResurgenceBannerAd();
        hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        ddz.resurgenceBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:0,
                top:0,
                width: screenWidth
            }
        });

        ddz.haveBanner = true;

        ddz.resurgenceBannerAd.onResize(function (res) {
            hall.LOGW('showResurgenceBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (ddz.resurgenceBannerAd){
                ddz.resurgenceBannerAd.style.left = (screenWidth - res.width)/2;
                ddz.resurgenceBannerAd.style.top = screenHeight/2 - res.height;
            }
        });

        ddz.resurgenceBannerAd.show();
    },

    hideBannerAd:function () {
        if (ddz.curBannerAd) {
            ddz.curBannerAd.hide();
        }

        if (ddz.curTpoBannerAd) {
            ddz.curTpoBannerAd.hide();
        }

        if (ddz.curAllWidthBannerAd) {
            ddz.curAllWidthBannerAd.hide();
        }
        ddz.haveBanner = false;
    },

    destroyBannerAd:function () {
        ddz.haveBanner = false;
        if (ddz.curBannerAd){
            if (ddz.curBannerAd.destroy) {
                ddz.curBannerAd.destroy();
            }
            ddz.curBannerAd = null;
        }
        if (ddz.curTpoBannerAd){
            if (ddz.curTpoBannerAd.destroy) {
                ddz.curTpoBannerAd.destroy();
            }
            ddz.curTpoBannerAd = null;
        }

        // if (ddz.bannerCloseBtn) {
        //     ddz.bannerCloseBtn.onClose();
        // }
    },
    
    destroyWidthBannerAd:function(){
        ddz.haveBanner = false;
        if (ddz.curAllWidthBannerAd){
            if (ddz.curAllWidthBannerAd.destroy) {
                ddz.curAllWidthBannerAd.destroy();
            }
            ddz.curAllWidthBannerAd = null;
        }
    },

    destroyResurgenceBannerAd:function(){
        ddz.haveBanner = false;
        if (ddz.resurgenceBannerAd){
            if (ddz.resurgenceBannerAd.destroy) {
                ddz.resurgenceBannerAd.destroy();
            }
            ddz.resurgenceBannerAd = null;
        }
    }
};
