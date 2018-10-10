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


    retryCrossTimes : 3, //3次网络重试的机会
    retryBannerTimes : 3, //3次网络重试的机会

    AnimType : {
        STATIC : 1, //静态
        SHAKE  : 2, //抖动
        FRAME  : 3  //帧动画

    },

    adNodeList :[],         //存放icon节点列表
    bannerNodeList : [],    //存放banner节点列表
    allAdInfoList : [],     //存放icon信息列表
    allBannerInfoList : [], //存放banner信息列表
    rawAdInfoList : [],     //存放服务端返回的原始icon信息
    rawBannerInfoList : [], //存放服务端返回的原始banner信息

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
    showBannerAd:function (adid,refresh) {
        if(!shot.GameWorld.gunnerShareSchemeConfig || !shot.GameWorld.gunnerShareSchemeConfig.showBanner){
            return;
        }
        if (!this.canShowBanner()){
            hall.LOGW(null, '玩家基础库,不支持banner!');
            return;
        }

        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;
        //
        // hall.adManager.showBanner({x:cc.director.getWinSize().width/2,y:83});
        // return;

        // this.destroyBannerAd();

        hall.LOGW('showBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        var top = 0;
        if(!shot.curBannerAd){
            shot.curBannerAd = wx.createBannerAd({
                adUnitId: adid,
                style: {
                    left:0,
                    top:top,
                    width: screenWidth
                }
            });
        }else {
            if(refresh){
                this.destroyBannerAd();
                shot.curBannerAd = wx.createBannerAd({
                    adUnitId: adid,
                    style: {
                        left:0,
                        top:top,
                        width: screenWidth
                    }
                });
            }
        }
        // shot.curBannerAd = wx.createBannerAd({
        //     adUnitId: adid,
        //     style: {
        //         left:0,
        //         top:top,
        //         width: screenWidth
        //     }
        // });
        shot.curBannerAd.onError(function (err) {
            hall.adManager.showBanner({x:cc.director.getWinSize().width/2,y:83});
            hall.LOGW('shot.curBannerAd.onError:' + err);
        });

        shot.curBannerAd.onResize(function (res) {
            hall.LOGW('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
            if(shot.curBannerAd){
                // shot.curBannerAd.style.left = (screenWidth - res.width)/2;
                // shot.curBannerAd.style.left = 0;
                // shot.curBannerAd.style.top = screenHeight - res.height + 1+75;
                // shot.curBannerAd.style.top = screenHeight - 80;
                // top = res.height > 92 ? 92 : res.height;

                shot.curBannerAd.style.left = 0;
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

    hideBannerAd : function () {
        if(shot.curBannerAd){
            shot.curBannerAd.hide();
        }
    },

    destroyBannerAd:function () {
        if (shot.curBannerAd){
            shot.curBannerAd.destroy();
            shot.curBannerAd = null;
        }
    },

    //交叉导流

    //创建导流icon，每调用一次就会创建一个
    showAd: function(position, tag) {

        var _adnode = new hall.adManager.adNodeClass();
        _adnode.adInfoList = JSON.parse(JSON.stringify(hall.adManager.allAdInfoList));
        _adnode.adType = 1;
        _adnode.adTag = tag;

        _adnode.createAdNode(position);

        hall.adManager.adNodeList.push(_adnode);

    },

    //创建导流banner, 每调用一次就会创建一个
    showBanner: function (position, tag) {

        var _adnode = new hall.adManager.adNodeClass();
        _adnode.adInfoList = JSON.parse(JSON.stringify(hall.adManager.allBannerInfoList));
        _adnode.adType = 2;
        _adnode.adTag = tag;

        _adnode.createAdNode(position);

        hall.adManager.bannerNodeList.push(_adnode);

    },

    //获取所有导流icon节点的列表
    getAdNodeList : function () {
        return this.adNodeList;
    },

    //根据自定义的tag, 获取添加到界面上的导流icon节点
    getAdNodeByTag : function (tag) {

        if(!tag) return null;
        for(var n in this.adNodeList){
            if(this.adNodeList[n].adTag.toString() == tag.toString()){
                return this.adNodeList[n];
            }

        }
        return null;
    },

    //获取所有导流banner节点的列表
    getBannerNodeList : function () {
        return this.bannerNodeList;
    },

    //根据自定义的tag, 获取添加导界面上的导流banner节点
    getBannerNodeByTag : function (tag) {

        if(!tag) return null;
        for(var n in this.bannerNodeList){
            if(this.bannerNodeList[n].adTag.toString() == tag.toString()){
                return this.bannerNodeList[n];
            }

        }
        return null;
    },

    //获取当前所有导流icon的信息
    getAdInfoList : function () {
        return this.allAdInfoList;
    },

    //获取当前所有导流banner的信息
    getBannerInfoList :function () {
        return this.allBannerInfoList;
    },

    adNodeClass : function () {
        this.adType = 0; //1 icon   2 banner
        this.adIconBtn = null;
        this.currentAdInfo = null;
        this.currentWebPage = null;
        this.adInfoList = [];
        this.adTag = '';
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

                    var _pos = pos?pos:{x:0, y:0};

                    preFabNode.position = cc.p(_pos.x, _pos.y);
                    that.adIconBtn = preFabNode;
                    preFabNode.zIndex = 999;
                    cc.game.addPersistRootNode(preFabNode);
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

            if(typeof _webPages === 'undefined' || _webPages.length == 0){
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

            // var spriteIco = this.adIconBtn.getChildByName('adIcon');
            // var adButton = this.adIconBtn.getChildByName('adButton');

            var spriteIco = this.adIconBtn.getChildByName('adIconNode').getChildByName('adIcon');  
            var adButton = this.adIconBtn.getChildByName('adButton');

            spriteIco.stopAllActions();
            spriteIco.removeComponent(cc.Animation);

            spriteIco.setRotation(0);

            // hall.LOGE("===","===SHAKE==_animaType====="+_animaType);

            // tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeShowAdBtn, [that.currentAdInfo.icon_id,
            //     '0',
            //     '',
            //     that.currentAdInfo.toappid,
            //     that.currentAdInfo.togame,
            //     '0',
            //     that.adType]);
            switch (_animaType){

                case hall.adManager.AnimType.STATIC:

                    cc.loader.load({url: that.currentAdInfo.icon_url[0]}, function (err, texture) {
                        if (!err) {

                            spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            if(texture && texture.width && texture.height){
                                spriteIco.setContentSize(cc.size(texture.width, texture.height));
                                adButton.setContentSize(cc.size(texture.width, texture.height));
                            }
                        }
                        else {

                        }
                    });

                    break;
                case hall.adManager.AnimType.SHAKE:
                    // hall.LOGE("===","===SHAKE==hall.adManager.AnimType.SHAKE====="+that.currentAdInfo.icon_url[0]);

                    cc.loader.load({url:that.currentAdInfo.icon_url[0]}, function(error, texture){
                        // if(error){
                        //     hall.LOGE("===","===SHAKE==error====="+JSON.stringify(error));
                        // }
                        // hall.LOGE("===","===SHAKE==texture====="+texture);

                        spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        if(texture && texture.width && texture.height){
                            spriteIco.setContentSize(cc.size(texture.width, texture.height));
                            adButton.setContentSize(cc.size(texture.width, texture.height));
                        }
                        // hall.LOGE("===","===SHAKE==texture==width===width==="+texture.width+"==="+texture.height);
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
                            adButton.setContentSize(cc.size(_firstFrameIcon.width, _firstFrameIcon.height))
                        }

                        var _time_interval = that.currentAdInfo.time_interval;
                        var _frameRate = (_time_interval && _time_interval>0)? 1000/_time_interval :10;

                        var animation = spriteIco.addComponent(cc.Animation);
                        var clip = cc.AnimationClip.createWithSpriteFrames(allFrames, _frameRate);
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

        clickAdIconResult : function () {
            var adInfoList = JSON.parse(JSON.stringify(hall.adManager.allAdInfoList));

            if(adInfoList.length == 0){
                return;
            }

            var weight_list = [
                {
                    'weight':0,
                    'id':'000'
                }
            ];

            for(var i in adInfoList){

                var _randomObj = {
                    'weight' : parseInt(adInfoList[i].icon_weight),
                    'id' : adInfoList[i].icon_id,
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

            var that = this;
            adInfoList.forEach(function (element){
                if(element.icon_id == _selectObj.id){
                    that.currentAdInfo = element;
                }
            });



            //先尝试直接跳转
            var skip_type =  this.currentAdInfo.icon_skip_type;
            var toappid = this.currentAdInfo.toappid;
            var togame = this.currentAdInfo.togame;
            var topath = this.currentAdInfo.path;
            var icon_id = this.currentAdInfo.icon_id;
            var config_id = '0';
            var webpage_url = '';
            var webpage_id = '0';

            var bi_paramlist = [icon_id, config_id, webpage_url, toappid, togame, webpage_id, 1];
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);

            // //先尝试直接跳转
            if(wx && wx.navigateToMiniProgram){
                if(1 == skip_type){

                    wx.navigateToMiniProgram({
                        appId: toappid,
                        path : topath ? topath : '?from=adcross',
                        envVersion: 'release',
                        extraData: {
                            from: topath ? topath : '?from=adcross'
                        },
                        success: function(res) {

                            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);

                            hall.LOGW('wx.navigateToMiniProgram success');
                            hall.LOGW(res);
                        },
                        fail: function (res) {
                            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                            hall.LOGW('wx.navigateToMiniProgram fail');
                            hall.LOGW(res);
                        },
                        complete: function (res) {
                        }
                    });
                }else if(2 == skip_type){
                    wx.navigateToMiniProgram({
                        appId: second_toappid,
                        path : topath ? topath : '?from=adcross',
                        envVersion: 'release',
                        extraData: {
                            from: topath ? topath : '?from=adcross'
                        },
                        success: function(res) {
                            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                            hall.LOGW('wx.navigateToMiniProgram success');
                            hall.LOGW(res);
                        },
                        fail: function (res) {
                            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                            hall.LOGW('wx.navigateToMiniProgram fail');
                            hall.LOGW(res);
                        },
                        complete: function (res) {
                        }
                    });

                }else{
                    console.error('Unsupported skip type! Please Check!');
                }
            }
        },

        onClickAdIconBtn: function() {
            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_ADBTN_TYPE_TODAY,'CO');

            try {

                this.genRandomSecondAdInfo();

                //先尝试直接跳转
                var skip_type =  this.currentAdInfo.icon_skip_type;
                var toappid = this.currentAdInfo.toappid;
                var togame = this.currentAdInfo.togame;
                var topath = this.currentAdInfo.path;
                var second_toappid = this.currentAdInfo.second_toappid;

                hall.LOGW('topath ====>' + topath);

                var that = this;

                var icon_id = this.currentAdInfo.icon_id;
                var config_id = '0';
                var webpage_url = '';
                var webpage_id = '0';

                if(this.currentWebPage && 1 == this.adType){
                    webpage_url = this.currentWebPage.webpage_url;
                    config_id = this.currentWebPage.config_id;
                    webpage_id = this.currentWebPage.webpage_id;
                }

                var bi_paramlist = [icon_id, config_id, webpage_url, toappid, togame, webpage_id, that.adType];

                hall.LOGW('bi_paramlist ====> ' + JSON.stringify(bi_paramlist));

                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);


                // //先尝试直接跳转
                if(wx && wx.navigateToMiniProgram){
                    if(1 == skip_type){

                        wx.navigateToMiniProgram({
                            appId: toappid,
                            path : topath ? topath : '?from=adcross',
                            envVersion: 'release',
                            extraData: {
                                from: topath ? topath : '?from=adcross',
                            },
                            success: function(res) {

                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);

                                hall.LOGW('wx.navigateToMiniProgram success');
                                hall.LOGW(res);
                            },
                            fail: function (res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                hall.LOGW('wx.navigateToMiniProgram fail');
                                hall.LOGW(res);
                            },
                            complete: function (res) {
                                hall.LOGW('navigateToMiniProgram ==== complete');
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
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                                hall.LOGW('wx.navigateToMiniProgram success');
                                hall.LOGW(res);
                            },
                            fail: function (res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                hall.LOGW('wx.navigateToMiniProgram fail');
                                hall.LOGW(res);
                            },
                            complete: function (res) {
                                that.resetBtnIcon();
                                hall.LOGW('navigateToMiniProgram ==== complete');
                            }
                        });

                    }else{
                        console.error('Unsupported skip type! Please Check!');
                    }

                    return;
                }

                //直接跳转接口不好使，展示 小程序/小游戏 二维码图片

                if(!that.currentWebPage || !that.currentWebPage.webpage_url){
                    that.resetBtnIcon();
                    return;
                }

                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickShowQRCode, bi_paramlist);

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
                            hall.LOGW('预览图片完成');
                            that.resetBtnIcon();
                        }
                    });
                // }
            } catch(err) {
                hall.LOGW("error:", "tywx.AdManager.onClickAdIconBtn——" + JSON.stringify(err));
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

    //定时刷新导流icon
    freshAdIconByTime : function () {

        hall.adManager.adNodeList.forEach(function (_adNode) {
            _adNode && _adNode.resetBtnIcon && _adNode.resetBtnIcon();
        });
    },

    //定时刷新导流banner
    freshAdBannerByTime :function () {
        hall.adManager.bannerNodeList.forEach(function (_adNode) {
            _adNode && _adNode.resetBtnIcon && _adNode.resetBtnIcon();
        });
    },

    //开始定时刷新导流icon
    startFreshAdIcon :function () {

        //定时刷新icon
        var icon_interval = 10 ;//默认是10s刷新一次
        for(var i=0; i< this.allAdInfoList.length;i++){
            var _icon_interval = this.allAdInfoList[i].icon_interval;
            if(_icon_interval){
                icon_interval = parseInt(_icon_interval) > 0?  parseInt(_icon_interval):icon_interval;
                break;
            }
        }
        ty.Timer.cancelTimer(cc.director, hall.adManager.freshAdIconByTime);
        ty.Timer.setTimer(cc.director, hall.adManager.freshAdIconByTime,icon_interval, cc.macro.REPEAT_FOREVER,icon_interval);

        //定时刷新banner
        var banner_interval = 10 ;//默认是10s刷新一次
        for(var i=0; i< this.allBannerInfoList.length;i++){
            var _icon_interval = this.allBannerInfoList[i].icon_interval;
            if(_icon_interval){
                banner_interval = parseInt(_icon_interval) > 0?  parseInt(_icon_interval):banner_interval;
                break;
            }
        }
        ty.Timer.cancelTimer(cc.director, hall.adManager.freshAdBannerByTime);
        ty.Timer.setTimer(cc.director, hall.adManager.freshAdBannerByTime,banner_interval, cc.macro.REPEAT_FOREVER,banner_interval);

    },

    //从后台回到前台
    onForeGround : function () {

        this.freshAdIconByTime();
        this.freshAdBannerByTime();
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
    },

    /**
     * 请求交叉倒流的信息
     */
    requestADInfo : function () {
        try {
            // if(!tywx.IsWechatPlatform()) {
            //     return;
            // }
            this.retryCrossTimes--;
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
            var finalUrl = ty.SystemInfo.shareManagerUrlShare + '?' + paramStrList.join('&');
            var that = this;

            wx.request({
                url : finalUrl,
                method : 'GET',
                success : function (res) {
                    if (res.statusCode == 200){

                        var ret = res.data;
                        that.allAdInfoList = [];
                        if(ret.retmsg){
                            that.rawAdInfoList = ret.retmsg;
                            that.processRawConfigInfo();
                            // tywx.NotificationCenter.trigger(tywx.EventType.GET_ADMANAGER_ICON_INFO_SUCCESS);
                        }
                        that.retryCrossTimes=3;

                    }else{
                        if(that.retryCrossTimes >0) {
                            that.requestADInfo();
                        }else{
                            that.retryCrossTimes = 3;
                        }
                    }

                },
                fail : function (res) {

                    if(that.retryCrossTimes >0) {
                        that.requestADInfo();
                    }else{
                        that.retryCrossTimes = 3;
                    }
                }
            });
        } catch(err) {
            hall.LOGE("error:", "tywx.AdManager.requestADInfo——" + JSON.stringify(err));
        }
    },


    /**
     * 请求交叉倒流banner的信息
     */
    requestBannerInfo : function () {
        try {
            // if(!tywx.IsWechatPlatform()) {
            //     return;
            // }
            this.retryBannerTimes--;
            var reqObj = {};
            var timeStamp = new Date().getTime();
            reqObj.act = 'api.getBannerConfig';
            reqObj.time = timeStamp;
            reqObj.game_mark = ty.SystemInfo.cloudid + "-" + ty.SystemInfo.gameId;
            var signStr = this.getConfigSignStr(reqObj);
            var paramStrList = [];
            for(var key in reqObj) {
                paramStrList.push(key + '=' + reqObj[key]);
            }
            paramStrList.push('sign=' + signStr);
            var finalUrl = ty.SystemInfo.shareManagerUrlShare + '?' + paramStrList.join('&');
            var that = this;

            wx.request({
                url : finalUrl,
                method : 'GET',
                success : function (res) {
                    if (res.statusCode == 200){

                        var ret = res.data;
                        that.allBannerInfoList = [];
                        if(ret.retmsg){
                            that.rawBannerInfoList = ret.retmsg;
                            that.processRawConfigInfo();
                            // ty.NotificationCenter.trigger(tywx.EventType.GET_ADMANAGER_BANNER_INFO_SUCCESS);
                        }
                        that.retryBannerTimes=3;

                    }else{
                        if(that.retryBannerTimes>0) {
                            that.requestBannerInfo();
                        }else{
                            that.retryBannerTimes=3;
                        }
                    }

                },
                fail : function (res) {

                    if(that.retryBannerTimes >0) {
                        that.requestBannerInfo();
                    }else{
                        that.retryBannerTimes = 3;
                    }
                }
            });
        } catch(err) {
            hall.LOGE("error:", "tywx.AdManager.requestADInfo——" + JSON.stringify(err));
        }
    },

    /**
     * 请求本地的IP、地域等信息
     */
    requestLocalIPInfo : function () {
        var that = this;
        var _url = 'https://iploc.ywdier.com/api/iploc5/search/city';
        wx.request({
            url: _url,
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data && res.data.loc) {
                        that.ipLocInfo = res.data;
                    }

                    that.processRawConfigInfo();
                }
                if(res.data.loc && res.data.loc[2]){
                    ty.UserInfo.isInBSGS = hall.GlobalFuncs.checkBSGS(res.data.loc[2]); //是否在北上广深
                    // //TODO:TEST
                    // ty.UserInfo.isInBSGS = true;
                }
                // console.error('requestLocalIPInfo ==>' + JSON.stringify(res));
            },
            fail: function (res) {
            }
        });

    },

    /**
     * 处理服务端返回的信息（根据城市白名单等进行过滤筛选）
     */
    processRawConfigInfo : function () {

        var that = this;
        this.allBannerInfoList = [];
        this.allAdInfoList = [];
        if(this.ipLocInfo && this.ipLocInfo.loc && this.ipLocInfo.loc[1]){         //获取到了本地的ip信息

            var _locProvince = this.ipLocInfo.loc[1];

            this.rawAdInfoList.forEach(function (v) {

                if(v.icon_weight == undefined || Math.floor(v.icon_weight) <= 0.1){
                    v.icon_weight = 0;
                }

                v.icon_weight =10;

                var isForbidden = true;
                if(v.province && (v.province instanceof Array)){

                    if(v.province.length == 0){
                        isForbidden = false;
                    }else {
                        for (var i in v.province) {
                            var _iProvince = v.province[i];
                            if (_iProvince.indexOf(_locProvince) > -1) {          //在允许显示的城市配置内
                                isForbidden = false;
                                break;
                            }
                        }
                    }
                }else{
                    isForbidden = false;
                }

                if(!isForbidden){
                    that.allAdInfoList.push(v);
                }
            });

            this.rawBannerInfoList.forEach(function (v) {
                if(v.icon_weight == undefined || Math.floor(v.icon_weight) <= 0.1){
                    v.icon_weight = 0;
                }

                v.icon_weight=10;
                var isForbidden = true;
                if(v.province && (v.province instanceof Array)){

                    if(v.province.length == 0){
                        isForbidden = false;
                    }else {
                        for (var i in v.province) {
                            var _iProvince = v.province[i];
                            if (_iProvince.indexOf(_locProvince) > -1) {          //在允许显示的城市配置内
                                isForbidden = false;
                                break;
                            }
                        }
                    }
                }else{
                    isForbidden = false;
                }

                if(!isForbidden){
                    that.allBannerInfoList.push(v);
                }
            });

        }else{

            this.rawAdInfoList.forEach(function (v) {
                if(v.icon_weight == undefined || Math.floor(v.icon_weight) <= 0.1){
                    v.icon_weight = 0;
                }

                if(!v.province || ((v.province instanceof Array) && v.province.length == 0)){
                    that.allAdInfoList.push(v);
                }
            });
            this.rawBannerInfoList.forEach(function (v) {
                if(v.icon_weight == undefined || Math.floor(v.icon_weight) <= 0.1){
                    v.icon_weight = 0;
                }

                if(!v.province || ((v.province instanceof Array) && v.province.length == 0)){
                    that.allBannerInfoList.push(v);
                }
            });

        }
    },

    /**
     * 初始化交叉导流模块
     */
    init : function () {
        this.requestLocalIPInfo();
        this.requestADInfo();
        this.requestBannerInfo();

    }
};

hall.adManager.adNodeClass.prototype = hall.adManager.adNodeObj;
hall.adManager.requestADInfo();