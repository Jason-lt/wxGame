/**
 * 导量广告ICO
 * Created by xujing on 2018/5/16.
 */
hall.adManager = {
    // icoBtn:null,
    // openBoxVideoAdId:"adunit-7771c980013f4603",
    // addBulletVideoAdId:"adunit-0f8c4455096206d1",
    // resurgenceVideoAdId:"adunit-547bbb5117a6e8ae",
    videoAdId : "adunit-547bbb5117a6e8ae",
    rewardedVideoType:"",
    videoAdManager : null,
    checkVideoTime : 300000,


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

    /**
     * 播放激励广告视频
     * @param type
     */
    showRewardedVideo:function (type) {

        this.rewardedVideoType = type;

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
            shot.LOGD(null, '广告播放完毕!');
            var playEnded = (!res || (res && res.isEnded));
            if(!playEnded){
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
                    ["noComplete",type]);
            }else {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo,
                    ["success",type]);
            }
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

        var top = 0;
        shot.curBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:0,
                top:top,
                width: screenWidth
            }
        });

        shot.curBannerAd.onResize(function (res) {
            hall.LOGW('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if(shot.curBannerAd){
                // shot.curBannerAd.style.left = (screenWidth - res.width)/2;
                shot.curBannerAd.style.left = 0;
                // shot.curBannerAd.style.top = screenHeight - res.height + 1+75;
                // shot.curBannerAd.style.top = screenHeight - 80;
                top = res.height > 92 ? 92 : res.height;
                shot.curBannerAd.style.top = screenHeight- top;
            }
        });

        shot.curBannerAd.show();
    },

    destroyBannerAd:function () {
        if (shot.curBannerAd){
            shot.curBannerAd.destroy();
            shot.curBannerAd = null;
        }
    },

    //交叉导流

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

                    that.requestADInfo();
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
            cc.loader.loadRes('shot_prefabs/adNode', function (err, prefab) {
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

        var spriteIco = this.adIconBtn.getChildByName('adIconNode').getChildByName('adIcon');
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
                        hall.LOGD('wx.navigateToMiniProgram success');
                        hall.LOGD(res);
                    },
                    fail: function (res) {
                        hall.LOGD('wx.navigateToMiniProgram fail');
                        hall.LOGD(res);

                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, [that.currentAdInfo.icon_id,
                            that.currentWebPage.config_id,
                            that.currentWebPage.webpage_url,
                            that.currentAdInfo.toappid,
                            that.currentAdInfo.togame]);
                    },
                    complete: function (res) {

                        hall.LOGD('navigateToMiniProgram ==== complete');
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
                        from: topath ? topath : '?from=adcross'
                    },
                    success: function(res) {
                        hall.LOGD('wx.navigateToMiniProgram success');
                        hall.LOGD(res);

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