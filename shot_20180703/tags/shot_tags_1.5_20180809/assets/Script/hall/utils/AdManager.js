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
    retryTimes : 3, //3次网络重试的机会

    AnimType : {
        STATIC : 1, //静态
        SHAKE  : 2, //抖动
        FRAME  : 3  //帧动画

    },

    adNodeList :[],
    allAdInfoList : [],

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
                // top = res.height > 92 ? 92 : res.height;
                top = res.height;
                if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType){
                    shot.curBannerAd.style.top = screenHeight- top - 30;
                }else {
                    shot.curBannerAd.style.top = screenHeight- top;
                }
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

    //创建导流icon，每调用一次就会创建一个
    showAd: function(position) {

        var _adnode = new hall.adManager.adNodeClass();
        _adnode.adInfoList = JSON.parse(JSON.stringify(hall.adManager.allAdInfoList));

        _adnode.createAdNode(position);

        hall.adManager.adNodeList.push(_adnode);

    },

    //获取所有导流icon节点的列表
    getAdNodeList : function () {
        return this.adNodeList;
    },

    //获取当前所有导流信息
    getAdInfoList : function () {
        return this.allAdInfoList;
    },

    adNodeClass : function () {

        this.adIconBtn = null;
        this.currentAdInfo = null;
        this.currentWebPage = null;
        this.adInfoList = [];
    },

    adNodeObj  : {


        createAdNode : function (pos) {

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
                    preFabNode.position = cc.p(pos.x, pos.y);
                    that.adIconBtn = preFabNode;
                    // shot.adIconBtn = preFabNode;
                    var curScene = cc.director.getScene();
                    if(curScene) {
                        curScene.addChild(preFabNode);
                    }
                    // cc.game.addPersistRootNode(preFabNode);
                    that.adIconNode();
                    var adButton = that.adIconBtn.getChildByName('adButton');
                    adButton.on('click', function () {
                        that.onClickAdIconBtn();
                    });
                });
            }

        },

        genRandomFirstAdInfo : function() {

            var that = this;

            if(this.adInfoList.length == 0){
                return;
            }

            var weight_list = [
                {
                    'weight':0,
                    'id':'000'
                }
            ];

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

            weight_list.forEach(function (element){
                _total += element.weight;
            });

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

            this.adInfoList.forEach(function (element){
                if(element.icon_id == _selectObj.id){
                    that.currentAdInfo = element;
                }
            });

        },

        genRandomSecondAdInfo : function() {

            var that = this;

            var _webPages = this.currentAdInfo.webpages;

            if(_webPages.length == 0){
                return;
            }

            var weight_list = [{'weight':0, 'id':'000'}];

            for(var i in _webPages){

                var _randomObj = {
                    'weight' : parseInt(_webPages[i].webpage_weight),
                    'id' : _webPages[i].config_id
                }

                weight_list.push(_randomObj);
            }

            weight_list.sort(function(a, b){
                return a.weight > b.weight;
            });

            var _total = 0;

            weight_list.forEach(function (element){
                _total += element.weight;
            });

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


            _webPages.forEach(function(element){
                if(element.config_id == _selectObj.id){
                    that.currentWebPage = element;
                }
            });

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
            spriteIco.removeComponent(cc.Animation);

            spriteIco.setRotation(0);

            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowAdBtn, [that.currentAdInfo.icon_id,
                that.currentAdInfo.icon_type,
                that.currentAdInfo.icon_skip_type,
                that.currentAdInfo.toappid,
                that.currentAdInfo.togame]);
            switch (_animaType){

                case hall.adManager.AnimType.STATIC:

                    cc.loader.load({url: that.currentAdInfo.icon_url[0]}, function (err, texture) {
                        if (!err) {

                            spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            if(texture && texture.width && texture.height){
                                spriteIco.setContentSize(cc.size(texture.width, texture.height));
                            }
                        }
                        else {

                        }
                    });

                    break;
                case hall.adManager.AnimType.SHAKE:

                    cc.loader.load({url:that.currentAdInfo.icon_url[0]}, function(error, texture){

                        spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        if(texture && texture.width && texture.height){
                            spriteIco.setContentSize(cc.size(texture.width, texture.height));
                        }
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
                case hall.adManager.AnimType.FRAME:

                    var allFrames =[];

                    var playFrameAction = function () {
                        spriteIco.stopAllActions();
                        spriteIco.removeComponent(cc.Animation);
                        var _firstFrameIcon = allFrames[0].getTexture();
                        if (_firstFrameIcon && _firstFrameIcon.width && _firstFrameIcon.height) {
                            spriteIco.setContentSize(cc.size(_firstFrameIcon.width, _firstFrameIcon.height));
                        }

                        var animation = spriteIco.addComponent(cc.Animation);
                        var clip = cc.AnimationClip.createWithSpriteFrames(allFrames, 10);
                        clip.name = 'anim_frame';
                        clip.wrapMode = cc.WrapMode.Loop;
                        animation.addClip(clip);
                        animation.play('anim_frame');
                    };

                    cc.loader.load(that.currentAdInfo.icon_url,function (err, results) {

                        if (err) {
                            for (var i = 0; i < err.length; i++) {
                                cc.log('Error url [' + err[i] + ']: ' + results.getError(err[i]));
                            }
                        }

                        for(var i = 0; i < that.currentAdInfo.icon_url.length; i++) {
                            if(results.getContent(that.currentAdInfo.icon_url[i])) {
                                var _frame = new cc.SpriteFrame(results.getContent(that.currentAdInfo.icon_url[i]));
                                allFrames.push(_frame);
                            }
                        }

                        playFrameAction();
                    });

                    break;
                default:
                    break;

            }

        },

        onClickAdIconBtn: function() {

            try {
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

                // //先尝试直接跳转
                if(wx && wx.navigateToMiniProgram){
                    if(1 == skip_type){

                        wx.navigateToMiniProgram({
                            appId: toappid,
                            path : topath ? topath : '?from=fkqs',
                            envVersion: 'release',
                            extraData: {
                                from: topath ? topath : '?from=fkqs'
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
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, [that.currentAdInfo.icon_id,
                                    that.currentWebPage.config_id,
                                    that.currentWebPage.webpage_url,
                                    that.currentAdInfo.toappid,
                                    that.currentAdInfo.togame]);
                                console.log('wx.navigateToMiniProgram fail');
                                console.log(res);
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
                            path : topath ? topath : '?from=fkqs',
                            envVersion: 'release',
                            extraData: {
                                from: topath ? topath : '?from=fkqs'
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
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, [that.currentAdInfo.icon_id,
                                    that.currentWebPage.config_id,
                                    that.currentWebPage.webpage_url,
                                    that.currentAdInfo.toappid,
                                    that.currentAdInfo.togame]);
                                console.log('wx.navigateToMiniProgram fail');
                                console.log(res);
                            },
                            complete: function (res) {
                                that.resetBtnIcon();
                                console.log('navigateToMiniProgram ==== complete');

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

                console.log('当前要预览的图============》' + that.currentWebPage.webpage_url);

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
                            console.log('预览图片完成');
                            that.resetBtnIcon();
                        }
                    });
                // }
            } catch(err) {
                hall.LOGE("error:", "tywx.AdManager.onClickAdIconBtn——" + JSON.stringify(err));
            }
        },

        resetBtnIcon : function() {

            if(!this.adIconBtn){
                return;
            }else{
                this.genRandomFirstAdInfo();
                this.adIconNode();
            }

        },

        onForeGround : function () {
            this.adIconNode();
        },

        showAdNode : function () {
            if(this.adIconBtn){
                if(this.adIconBtn) {
                    this.adIconBtn.active = true;
                }
            }

        },

        hideAdNode : function () {

            if(this.adIconBtn){
                if(this.adIconBtn) {
                    this.adIconBtn.active = false;
                }
            }

        }

    },

    /**
     * 请求交叉倒流的信息
     */
    requestADInfo : function () {
        try {
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
                        that.allAdInfoList = [];
                        if(ret.retmsg){
                            for(var index in ret.retmsg){

                                var _iconInfo = ret.retmsg[index];

                                if(_iconInfo.icon_weight == undefined){
                                    _iconInfo.icon_weight = 0;
                                }

                                if(Math.floor(_iconInfo.icon_weight) > 0.1){  //处理配置成小数的情形  0.1以下直接默认不显示
                                    that.allAdInfoList.push(_iconInfo);
                                }
                            }
                        }

                    }else{
                        if(that.retryTimes >0) {
                            that.requestADInfo();
                        }else{
                            that.retryTimes = 3;
                        }
                    }

                },
                fail : function (res) {

                    if(that.retryTimes >0) {
                        that.requestADInfo();
                    }else{
                        that.retryTimes = 3;
                    }
                }
            });
        } catch(err) {
            hall.LOGE("error:", "tywx.AdManager.requestADInfo——" + JSON.stringify(err));
        }

    },

    //定时刷新导流icon
    freshAdIconByTime : function () {

        if(0 == hall.adManager.adNodeList.length){
            return;
        }

        for(var i=0; i<hall.adManager.adNodeList.length;i++){
            var _adNode = hall.adManager.adNodeList[i];
            _adNode && _adNode.resetBtnIcon && _adNode.resetBtnIcon();
        }

    },

    //开始定时刷新导流icon
    startFreshAdIcon :function () {

        var default_interval = 10 ;//默认是10s刷新一次

        for(var i=0; i< this.allAdInfoList.length;i++){

            var _icon_interval = this.allAdInfoList[i].icon_interval;

            if(_icon_interval){
                default_interval = parseInt(_icon_interval) > 0?  parseInt(_icon_interval):default_interval;
                break;
            }

        }

        ty.Timer.cancelTimer(cc.director, hall.adManager.freshAdIconByTime);
        ty.Timer.setTimer(cc.director, hall.adManager.freshAdIconByTime,default_interval, cc.macro.REPEAT_FOREVER,default_interval);

    },

    //从后台回到前台
    onForeGround : function () {

        for(var i=0; i<this.adNodeList.length;i++){
            var _adNode = this.adNodeList[i];
            _adNode && _adNode.onForeGround && _adNode.onForeGround();
        }
        this.startFreshAdIcon();
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

hall.adManager.adNodeClass.prototype = hall.adManager.adNodeObj;
hall.adManager.requestADInfo();