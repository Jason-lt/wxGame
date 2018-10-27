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


    //交叉导流
    adIconBtn: null,                //向其他小游戏的导流入口
    adInfoList : [],                //所有广告信息的列表
    currentAdInfo : null,           //当前做展示的导流信息
    currentWebPage : null,          //当前显示的最终导流游戏的信息
    retryTimes : 3,                 //网络请求失败重试次数//demo数据
    AnimType : {                    //广告显示的动画
        STATIC : 1, //静态
        SHAKE  : 2, //抖动
        FRAME  : 3  //帧动画
    },


    showAdIco:function () {
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
        // this.destroyBannerAd();
        this.destroyWidthBannerAd();

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
            // this.destroyResurgenceBannerAd();
            // this.destroyWidthBannerAd();
            // this.destroyBannerAd();
            this.destroyWidthBannerAd();
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

        // this.destroyBannerAd();
        this.destroyWidthBannerAd();
        // this.destroyResurgenceBannerAd();

        hall.LOGW('showBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);
        var left_x = 0;
        if (screenWidth && screenWidth < 350){
            left_x = -30;
        }
        if (!ddz.curAllWidthBannerAd) {
            ddz.curAllWidthBannerAd = wx.createBannerAd({
                adUnitId: adid,
                style: {
                    left:left_x,
                    top:0,
                    width: 300
                }
            });
        }

        ddz.haveBanner = true;
        // var posx = 0;
        // var posy = 0;
        ddz.curAllWidthBannerAd.onResize(function (res) {
            hall.LOGW('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (ddz.curAllWidthBannerAd){
                ddz.curAllWidthBannerAd.style.left = left_x;
                ddz.curAllWidthBannerAd.style.top = screenHeight - res.height + 10;
                // posx = res.width * (winSize.width/screenWidth);
                // posy = res.height * (winSize.height/screenHeight) - 28;
            }
        });
        ddz.curAllWidthBannerAd.show();
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

        // this.destroyBannerAd();
        this.destroyWidthBannerAd();
        // this.destroyResurgenceBannerAd();

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

            //使用公司自己的banner
            return;
        }
        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;

        this.destroyWidthBannerAd();

        hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        if (!ddz.curAllWidthBannerAd) {
            ddz.curAllWidthBannerAd = wx.createBannerAd({
                adUnitId: adid,
                style: {
                    left:0,
                    top:0,
                    width: screenWidth
                }
            });
        }

        ddz.haveBanner = true;

        var interval = ddz.GlobalFuncs.getBannerIntervalY() || 0;

        ddz.curAllWidthBannerAd.onResize(function (res) {
            hall.LOGW('showAllWidthBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (ddz.curAllWidthBannerAd){
                ddz.curAllWidthBannerAd.style.left = (screenWidth - res.width)/2;
                ddz.curAllWidthBannerAd.style.top = screenHeight - res.height - interval;
            }
        });

        ddz.curAllWidthBannerAd.onError(function(msg){
            hall.LOGW('showAllWidthBannerAd', 'onError,msg :' + JSON.stringify(msg));
            //自己的banner
            if (hall.AdManagerTYWX && hall.AdManagerTYWX.getBannerNodeByTag("tyBanner")) {
                hall.AdManagerTYWX.getBannerNodeByTag("tyBanner").showAdNode();
            }else {
                hall.AdManagerTYWX.showBanner(cc.p(cc.winSize.width/2,83),"tyBanner");
            }
        });
        ddz.curAllWidthBannerAd.show();
        console.log("file = [..........   ......]",ddz.curAllWidthBannerAd);

        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getBannerNodeByTag("tyBanner")) {
            hall.AdManagerTYWX.getBannerNodeByTag("tyBanner").showAdNode();
        }
    },

    showResurgenceBannerAd:function(adid){
        if (!this.canShowBanner()){
            hall.LOGW(null, '玩家基础库,不支持banner!');
            return;
        }
        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;

        // this.destroyBannerAd();
        this.destroyWidthBannerAd();
        // this.destroyResurgenceBannerAd();
        hall.LOGW('showTopBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);
        if (!ddz.curAllWidthBannerAd) {
            ddz.curAllWidthBannerAd = wx.createBannerAd({
                adUnitId: adid,
                style: {
                    left:0,
                    top:0,
                    width: screenWidth
                }
            });
        }

        ddz.haveBanner = true;

        ddz.curAllWidthBannerAd.onResize(function (res) {
            hall.LOGW('showResurgenceBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if (ddz.curAllWidthBannerAd){
                ddz.curAllWidthBannerAd.style.left = (screenWidth - res.width)/2;
                ddz.curAllWidthBannerAd.style.top = screenHeight/2 - res.height;
            }
        });

        ddz.curAllWidthBannerAd.show();
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
        // if (ddz.curAllWidthBannerAd){
        //     if (ddz.curAllWidthBannerAd.destroy) {
        //         ddz.curAllWidthBannerAd.destroy();
        //     }
        //     ddz.curAllWidthBannerAd = null;
        // }
        if (ddz.curAllWidthBannerAd) {
            ddz.curAllWidthBannerAd.hide();
        }

        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getBannerNodeByTag("tyBanner")) {
            hall.AdManagerTYWX.getBannerNodeByTag("tyBanner").hideAdNode();
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
    },


    /**
     * 请求交叉倒流的信息
     */
    requestADInfo : function () {

        // if(!tywx.IsWechatPlatform()) {
        //     return;
        // }
        this.retryTimes--;
        var reqObj = {};
        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getCrossConfig';
        reqObj.time = timeStamp;
        reqObj.game_mark = ty.SystemInfo.cloudid + "-" + ty.SystemInfo.gameId;
        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for(var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        var finalUrl = ty.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');
        var that = this;

        wx.request({
            url : finalUrl,
            method : 'GET',
            success : function (res) {
                if (res.statusCode == 200){

                    var ret = res.data;
                    // console.log('RET:' + JSON.stringify(ret));
                    hall.LOGD("hall.ad",'RET:' + JSON.stringify(ret));
                    that.adInfoList = [];
                    if(ret.retmsg){
                        for(var index in ret.retmsg){

                            that.adInfoList.push(ret.retmsg[index]);

                        }
                    }

                    ty.NotificationCenter.trigger(ty.EventType.GET_AD_MSG_SUCCESS);

                    that.retryTimes = 3;
                }
            },
            fail : function (res) {

                if(that.retryTimes > 0){

                    // that.requestADInfo();
                }else{
                    that.retryTimes = 0;
                }

            }
        });


    },

    /**
     * 获取广告推广节点（可任意添加动画）
     * @returns {null}
     */
    getAdNode : function () {
        return this.adIconBtn;
    },

    /**
     * 对外接口，用于添加广告位
     * position {x, y}
     */
    showAd: function(position) {

        this.genRandomFirstAdInfo();

        if(!this.currentAdInfo){
            return;
        }
        
        if(this.adIconBtn) {
            this.adIconBtn.active = true;
        } else {
            var that = this;
            //动态加载资源必须放在resources目录下,导流入口强制命名为adNode,放在resources/prefabs下
            cc.loader.loadRes('prefabs/adNode', function (err, prefab) {
                var preFabNode = cc.instantiate(prefab);
                preFabNode.position = cc.p(position.x, position.y);
                that.adIconBtn = preFabNode;
                cc.game.addPersistRootNode(preFabNode);
                that.adIconNode();
                var adButton = that.adIconBtn.getChildByName('adButton');
                adButton.on('click', function () {
                    that.onClickAdIconBtn();
                });
            });
        }
    },

    /**
     * 生成随机的一级导流信息
     */
    genRandomFirstAdInfo : function() {

        if(this.adInfoList.length == 0){
            return;
        }

        var weight_list = [
            {
                'weight':0,
                'id':'000'
            }
        ];
        var that = this;

        for(var i in this.adInfoList){

            var _randomObj = {
                'weight' : parseInt(that.adInfoList[i].icon_weight),
                'id' : that.adInfoList[i].icon_id,
            };
            weight_list.push(_randomObj);
        }

        weight_list.sort(function(a, b){
            return a.weight > b.weight;
        });

        var _total = 0;

        for (var i = 0 ; i < weight_list.length ; i ++){
            _total += weight_list[i].weight;
        }
        //     weight_list.forEach(element => {
        //         _total += element.weight;
        // });

        var _randomIndex = parseInt(Math.random()*10000)%(_total+1);

        var _tTotal = 0;

        var _selectIndex = 0;

        for(var i=0; i<(weight_list.length-1);i++){
            _tTotal += weight_list[i].weight;
            if(_tTotal < _randomIndex && (_tTotal+weight_list[i+1].weight) >= _randomIndex){
                _selectIndex = i+1;
                break;
            }
        }
        var _selectObj= weight_list[_selectIndex];

        for (var i = 0 ; i < this.adInfoList.length ; i ++){
            if(this.adInfoList[i].icon_id == _selectObj.id){
                this.currentAdInfo = this.adInfoList[i];
            }
        }
        //     this.adInfoList.forEach(element => {
        //         if(element.icon_id == _selectObj.id){
        //         this.currentAdInfo = element;
        //     }
        // });

    },

    /**
     * 生成随机的二级导流信息
     */
    genRandomSecondAdInfo : function() {

        var _webPages = this.currentAdInfo.webpages;

        if(_webPages.length == 0){
            return;
        }

        var weight_list = [{'weight':0, 'id':'000'}];

        for(var i in _webPages){

            var _randomObj = {
                'weight' : parseInt(_webPages[i].webpage_weight),
                'id' : _webPages[i].config_id
            };

            weight_list.push(_randomObj);
        }

        weight_list.sort(function(a, b){
            return a.weight > b.weight;
        });

        var _total = 0;

        for (var i = 0 ; i < weight_list.length ; i ++){
            _total += weight_list[i].weight;
        }
        //     weight_list.forEach(element => {
        //         _total += element.weight;
        // });

        var _randomIndex = parseInt(Math.random()*10000)%(_total+1);

        var _tTotal = 0;

        var _selectIndex = 0;
        for(var i=0; i<(weight_list.length-1);i++){
            _tTotal +=  weight_list[i].weight;
            if(_tTotal < _randomIndex && (_tTotal+weight_list[i+1].weight) >= _randomIndex){
                _selectIndex = i+1;
                break;
            }
        }
        var _selectObj = weight_list[_selectIndex];


        for (var i = 0 ; i < _webPages.length ; i ++){
            if(_webPages[i].config_id == _selectObj.id){
                this.currentWebPage = _webPages[i];
            }
        }
        //     _webPages.forEach(element => {
        //         if(element.config_id == _selectObj.id){
        //         this.currentWebPage = element;
        //     }
        // });

    },

    adIconNode : function () {

        if(!this.currentAdInfo || !this.adIconBtn){
            return;
        }

        var _animaType = this.currentAdInfo.icon_type;
        var that = this;

        var spriteIco = this.adIconBtn.getChildByName('adIcon');
        var adButton = this.adIconBtn.getChildByName('adButton');

        spriteIco.stopAllActions();
        if(spriteIco.getComponent(cc.Animation)){
            spriteIco.removeComponent(cc.Animation);
        }

        spriteIco.setRotation(0);

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowAdBtn, [that.currentAdInfo.icon_id,
            that.currentAdInfo.icon_type,
            that.currentAdInfo.icon_skip_type,
            that.currentAdInfo.toappid,
            that.currentAdInfo.togame]);

        switch (_animaType){

            case this.AnimType.STATIC:

                cc.loader.load({url: that.currentAdInfo.icon_url[0]}, function (err, texture) {
                    if (!err) {

                        spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }
                    else {

                    }
                });

                break;
            case this.AnimType.SHAKE:

                cc.loader.load({url:that.currentAdInfo.icon_url[0]}, function(error, texture){

                    spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    spriteIco.anchorX = 0.5;
                    spriteIco.anchorY = 0.5;
                    var _act1 = cc.rotateBy(0.06, -20);
                    var _act2 = cc.rotateBy(0.12, 40);
                    var _act3 = cc.rotateBy(0.12, -40);
                    var _act4 = cc.rotateBy(0.06, 20);
                    var _delay = cc.delayTime(1);
                    spriteIco.runAction(cc.repeatForever(cc.sequence(_act1,
                        cc.repeat(cc.sequence(_act2, _act3), 4),
                        _act4,
                        _delay)));
                });


                break;
            case this.AnimType.FRAME:

                var allFrames =[];

                var playFrameAction = function () {

                    if(!spriteIco.getComponent(cc.Animation)) {

                        var animation = spriteIco.addComponent(cc.Animation);
                        var clip = cc.AnimationClip.createWithSpriteFrames(allFrames, 10);
                        clip.name = 'anim_frame';
                        clip.wrapMode = cc.WrapMode.Loop;
                        animation.addClip(clip);
                        animation.play('anim_frame');
                    }
                };

                for(var i = 0; i < that.currentAdInfo.icon_url.length; i++) {

                    cc.loader.load(that.currentAdInfo.icon_url,function (err, results) {


                        if (err) {
                            for (var i = 0; i < err.length; i++) {
                                cc.log('Error url [' + err[i] + ']: ' + results.getError(err[i]));
                            }
                        }

                        for(var i = 0; i < that.currentAdInfo.icon_url.length; i++) {

                            var _frame = new cc.SpriteFrame(results.getContent(that.currentAdInfo.icon_url[i]));
                            allFrames.push(_frame);
                        }
                        playFrameAction();
                    });
                }

                break;
            default:
                break;

        }

    },

    hideAd: function() {
        if(this.adIconBtn) {
            this.adIconBtn.active = false;
        }
    },

    onClickAdIconBtn: function() {

        this.genRandomSecondAdInfo();

        //先尝试直接跳转
        var skip_type =  this.currentAdInfo.icon_skip_type;
        var toappid = this.currentAdInfo.toappid;
        var togame = this.currentAdInfo.togame;
        var topath = this.currentAdInfo.path;
        var second_toappid = this.currentAdInfo.second_toappid;

        console.log('topath ====>' + topath);

        var that = this;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, [that.currentAdInfo.icon_id,
            that.currentAdInfo.toappid,
            that.currentAdInfo.togame]);

        //先尝试直接跳转
        if(wx && wx.navigateToMiniProgram){
            // this.resetBtnIcon();
            if(1 == skip_type){

                wx.navigateToMiniProgram({
                    appId: toappid,
                    path : topath ? topath : '?from=adcross',
                    envVersion: 'release',
                    extraData: {
                        from: topath ? topath : '?from=adcross'
                    },
                    success: function(res) {

                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, [that.currentAdInfo.icon_id,
                            that.currentWebPage.config_id,
                            that.currentWebPage.webpage_url,
                            that.currentAdInfo.toappid,
                            that.currentAdInfo.togame]);
                        console.log('wx.navigateToMiniProgram success');
                        console.log(res);
                    },
                    fail: function (res) {
                        console.log('wx.navigateToMiniProgram fail');
                        console.log(res);

                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, [that.currentAdInfo.icon_id,
                            that.currentWebPage.config_id,
                            that.currentWebPage.webpage_url,
                            that.currentAdInfo.toappid,
                            that.currentAdInfo.togame]);
                    },
                    complete: function (res) {

                        console.log('navigateToMiniProgram ==== complete');
                        that.resetBtnIcon();
                    }
                });

                return;
            }else if(2 == skip_type){

                wx.navigateToMiniProgram({
                    appId: second_toappid,
                    path : topath ? topath : '?from=adcross',
                    envVersion: 'release',
                    extraData: {
                        from: topath ? topath : '?from=adcross',
                    },
                    success: function(res) {
                        console.log('wx.navigateToMiniProgram success');
                        console.log(res);

                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, [that.currentAdInfo.icon_id,
                            that.currentWebPage.config_id,
                            that.currentWebPage.webpage_url,
                            that.currentAdInfo.toappid,
                            that.currentAdInfo.togame]);
                    },
                    fail: function (res) {
                        console.log('wx.navigateToMiniProgram fail');
                        console.log(res);

                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, [that.currentAdInfo.icon_id,
                            that.currentWebPage.config_id,
                            that.currentWebPage.webpage_url,
                            that.currentAdInfo.toappid,
                            that.currentAdInfo.togame]);
                    },
                    complete: function (res) {

                        console.log('navigateToMiniProgram ==== complete');
                        that.resetBtnIcon();
                    }

                });


            }else{
                console.error('Unsupported skip type! Please Check!');
            }


            return;
        }

        //直接跳转接口不好使，展示 小程序/小游戏 二维码图片
        if(!this.currentWebPage){
            return;
        }

        var that = this;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickShowQRCode, [that.currentAdInfo.icon_id,
            that.currentWebPage.config_id,
            that.currentWebPage.webpage_url,
            that.currentAdInfo.toappid,
            that.currentAdInfo.togame]);
        // if(tywx.IsWechatPlatform()) {
        wx.previewImage({
            current: [that.currentWebPage.webpage_url],
            urls: [that.currentWebPage.webpage_url],
            success:function(res){
                hall.LOGD(null, "预览图片成功！");
            },
            fail:function (res) {
                hall.LOGD(null, "预览图片失败！");
            },
            complete :function (res) {
                hall.LOGD('预览图片完成');
                that.resetBtnIcon();
            }
        });
        // }

        this.resetBtnIcon();
    },

    /**
     * 刷新ad按钮的icon
     */
    resetBtnIcon : function() {

        if(!this.adIconBtn){
            return;
        }else{
            this.genRandomFirstAdInfo();
            this.adIconNode();
        }

    },

    /**
     * 计算签名字符串
     * @param reqObj
     * @returns {string}
     */
    getConfigSignStr: function(reqObj) {
        var sortedKeys = Object.keys(reqObj).sort();
        var signStr = '';
        for(var i=0;i<sortedKeys.length;i++){
            var key = sortedKeys[i];
            if(key == 'act' || key == 'sign') {
                continue;
            } else {
                signStr += key + '=' + reqObj[key];
            }
        }
        var finalSign = hall.hex_md5('market.tuyoo.com-api-' + signStr + '-market.tuyoo-api') || '';
        return finalSign;
    }
};
