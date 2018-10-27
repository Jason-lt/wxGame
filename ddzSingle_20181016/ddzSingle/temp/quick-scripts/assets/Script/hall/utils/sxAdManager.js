(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/utils/sxAdManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4e9940AL0hIsLLCh8/ru2wk', 'sxAdManager', __filename);
// Script/hall/utils/sxAdManager.js

"use strict";

//三消交叉导流
hall.sxAdManager = {
    sxAdInfo: null,
    opDataWeight: [],
    iconWeight: null,
    iconIndex: null,
    preIconIndex: null,
    isSwitchIcon: false, //true为换icon，false为不换icon
    callback: null,
    isLoadConfig: false,

    show: function show() {
        var _this = this;

        //, scale) {
        try {
            console.log("sxAdManager ad Show");
            if (this.adIcon) {
                this.adIcon.active = true;
                cc.director.getScheduler().schedule(this.callback, this.adIcon, this.sxAdInfo.framesInterval, !this.isSwitchIcon);
            } else {

                var callback = function callback() {
                    _this.adIcon = new cc.Node();

                    // if (typeof wx !== 'undefined') {
                    _this.initWeight();
                    _this.iconIndex = 0;
                    _this.isSwitchIcon = true;
                    _this.callback = function () {
                        _this.switchIcon();
                    };
                    _this.callback();
                    cc.director.getScheduler().schedule(_this.callback, _this.adIcon, _this.sxAdInfo.framesInterval, !_this.isSwitchIcon);
                    _this.adIcon.addComponent(cc.Button);

                    _this.adIcon.on('click', _this.onClickAdIconBtn, _this);

                    cc.game.addPersistRootNode(_this.adIcon);

                    // }
                };
                this.loadConfigFile(callback);
            }
        } catch (error) {
            console.log("sxAdManager: ", error);
        }
    },

    hide: function hide() {
        if (this.adIcon) {
            cc.director.getScheduler().unschedule(this.callback, this.adIcon);
            console.log("sxAdManager ad hide");
            this.adIcon.active = false;
        }
    },

    setPosition: function setPosition(dx, dy) {
        if (this.adIcon) {
            // this.adIcon.position = cc.v2(cc.winSize.width - dx, dy);
            this.adIcon.position = cc.v2(dx, dy);
        }
    },

    setScale: function setScale(scale) {
        if (this.adIcon) {
            this.adIcon.scale = scale;
        }
    },

    setPositionById: function setPositionById(id) {
        var _this2 = this;

        if (this.adIcon) {
            var index = -1;
            for (var i = 0; i < this.sxAdInfo.position.length; i++) {
                if (this.sxAdInfo.position[i].id == id) index = i;
            }
            if (index != -1) {
                var widget = this.sxAdInfo.position[index].type;
                var dx = this.sxAdInfo.position[index].x;
                var dy = this.sxAdInfo.position[index].y;
                this.setWidgetPosition(widget, dx, dy);
            }
        } else {
            setTimeout(function () {
                _this2.setPositionById(id);
            }, 10);
        }
    },
    setWidgetPosition: function setWidgetPosition(type, x, y) {
        switch (type) {
            case 1:
                //top left
                this.adIcon.position = cc.v2(x, cc.winSize.height - y);
                break;
            case 2:
                //top right
                this.adIcon.position = cc.v2(cc.winSize.width - x, cc.winSize.height - y);
                break;
            case 3:
                //bottom left
                this.adIcon.position = cc.v2(x, y);
                break;
            case 4:
                //bottom right
                this.adIcon.position = cc.v2(cc.winSize.width - x, y);
                break;
            case 5:
                //top HorizontalCenter
                this.adIcon.position = cc.v2(cc.winSize.width / 2 + x, cc.winSize.height - y);
                break;
            case 6:
                //bottom HorizontalCenter
                this.adIcon.position = cc.v2(cc.winSize.width / 2 + x, y);
                break;
            case 7:
                //left VerticalCenter
                this.adIcon.position = cc.v2(x, cc.winSize.height / 2 + y);
                break;
            case 8:
                //right VerticalCenter
                this.adIcon.position = cc.v2(cc.winSize.width - x, cc.winSize.height / 2 + y);
                break;
            case 9:
                //HorizontalCenter VerticalCenter
                this.adIcon.position = cc.v2(cc.winSize.width / 2 + x, cc.winSize.height / 2 + y);
                break;
            default:
                break;
        }
    },
    loadConfigFile: function loadConfigFile(callback) {
        ddz.gameModel.getDiversionConfig();
        var self = this;

        var loadConfig = function loadConfig() {
            try {
                if (ddz.gameModel.getDiversionConfigJson()) {
                    self.isLoadConfig = true;
                    self.sxAdInfo = ddz.gameModel.getDiversionConfigJson();
                    callback();
                } else {
                    // ddz.gameModel.getDiversionConfig();
                    // if (ddz.gameModel.getDiversionConfigJson()) {
                    //     self.sxAdInfo = ddz.gameModel.getDiversionConfigJson();
                    //     callback();
                    // }

                    if (!self.isLoadConfig) {
                        setTimeout(function () {
                            loadConfig();
                        }, 2000);
                        // this.scheduleOnce(function () {
                        //
                        // }, 1);
                    }
                }
            } catch (error) {
                ddz.gameModel.getDiversionConfig();
            }
        };

        loadConfig();
    },
    retryConfigFile: function retryConfigFile() {
        var _this3 = this;

        if (!this.isLoadConfig) {
            setTimeout(function () {
                _this3.loadConfigFile(false);
            }, 20000);
        }
    },
    switchIcon: function switchIcon() {
        //刷新Icon
        try {
            var num = Math.floor(Math.random() * this.iconWeight);
            this.iconIndex = this.selectItemByWeight(num, this.sxAdInfo.icons);

            var isClick = 0;
            var count = 0;
            for (var i = 0; i < this.sxAdInfo.icons.length; i++) {
                for (var j = 0; j < this.sxAdInfo.icons[i].openData.length; j++) {
                    if (this.isClickApp(this.sxAdInfo.icons[i].openData[j].imgurl)) {
                        isClick++;
                    }
                    count++;
                }
            }

            if (this.iconIndex == -1 || isClick == count) {
                this.hide();
                return;
            }

            if (this.iconIndex != this.preIconIndex) {
                if (this.sxAdInfo.icons[this.iconIndex].type == 0) {
                    if (this.adIcon.getComponent(cc.Animation)) {
                        //除去动态icon的组件
                        this.adIcon.removeComponent(cc.Animation);
                        this.adIcon.removeComponent(cc.Sprite);
                    }
                    this.loadStaticImg(this.sxAdInfo.icons[this.iconIndex]);
                } else if (this.sxAdInfo.icons[this.iconIndex].type == 1) {
                    if (this.adIcon.getComponent(cc.Sprite)) {
                        //除去静态icon的组件
                        this.adIcon.getComponent(cc.Sprite).spriteFrame = null;
                    }
                    this.loadDynamicImg(this.sxAdInfo.icons[this.iconIndex]);
                }
                this.preIconIndex = this.iconIndex;
            }
        } catch (err) {
            cc.director.getScheduler().unschedule(this.callback, this.adIcon);
        }
    },

    //重新刷新
    refreshIconsWeight: function refreshIconsWeight() {
        for (var i = 0; i < this.sxAdInfo.icons.length; i++) {
            var allWeight = 0;
            for (var j = 0; j < this.sxAdInfo.icons[i].openData.length; j++) {
                if (this.sxAdInfo.icons[i].openData[j].clickHide && this.isClickApp(this.sxAdInfo.icons[i].openData[j].imgurl)) {
                    this.sxAdInfo.icons[i].openData[j].weight = 0;
                } else {
                    allWeight += this.sxAdInfo.icons[i].openData[j].weight;
                }
            }
            if (allWeight == 0) {
                this.sxAdInfo.icons[i].weight = 0;
            }
        }
    },

    initWeight: function initWeight() {
        this.iconWeight = 0;
        for (var i = 0; i < this.sxAdInfo.icons.length; i++) {
            this.iconWeight += this.sxAdInfo.icons[i].weight;
            this.opDataWeight[i] = 0;
            var openData = this.sxAdInfo.icons[i].openData;
            for (var j = 0; j < openData.length; j++) {
                this.opDataWeight[i] += openData[j].weight;
            }
        }
    },

    //添加导流入口Icon静态图片
    loadStaticImg: function loadStaticImg(arr) {
        var link = arr.imgLink;
        var scale = arr.scale;
        var self = this;
        cc.loader.load(link, function (err, tex) {
            try {
                if (self.adIcon.getComponent(cc.Sprite)) {
                    //重新调用时可能是同一个静态icon也可能适另一个静态icon
                    self.adIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                    self.adIcon.scale = scale;
                } else {
                    self.adIcon.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                    self.adIcon.scale = scale;
                }
            } catch (err) {
                console.log(err);
                self.adIcon.addComponent(cc.Sprite).spriteFrame = null;
            }
        });
    },

    //添加导流入口Icon动画
    loadDynamicImg: function loadDynamicImg(arr) {
        var link = arr.imgLink.split(',');
        var scale = arr.scale;
        var self = this;
        var adIconFrames = [];
        var playFrames = function playFrames() {

            if (self.adIcon.getComponent(cc.Animation)) {
                //重新调用时可能是同一个动态icon也可能适另一个动态icon

                var animation = self.adIcon.getComponent(cc.Animation);

                var clip = cc.AnimationClip.createWithSpriteFrames(adIconFrames, 10);
                clip.name = 'anim_frame';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('anim_frame');
            } else {
                var animation = self.adIcon.addComponent(cc.Animation);
                if (!self.adIcon.getComponent(cc.Sprite)) self.adIcon.addComponent(cc.Sprite);

                var clip = cc.AnimationClip.createWithSpriteFrames(adIconFrames, 10);
                clip.name = 'anim_frame';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('anim_frame');
            }
        };
        cc.loader.load(link, function (err, results) {
            // if (err) {
            //     for (var i = 0; i < err.length; i++) {
            //         console.log("sxAdManager: ", 'load Dynamic img failed' + err[i] + ']: ' + results.getError(err[i]));
            //     }
            // }
            // else {
            try {
                adIconFrames.splice(0, adIconFrames.length);

                for (var i = 0; i < link.length; i++) {
                    var tex = results.getContent(link[i]);
                    adIconFrames.push(new cc.SpriteFrame(tex));
                }
                if (scale != null) {
                    self.adIcon.scale = scale;
                }
                playFrames();
            } catch (err) {
                console.log(err);
                adIconFrames.push(null);
            }
        });
    },

    onClickAdIconBtn: function onClickAdIconBtn() {
        if (typeof wx !== 'undefined') {
            try {
                var iconIndex = this.iconIndex;
                var num = Math.floor(Math.random() * this.opDataWeight[iconIndex]);
                var index = this.selectItemByWeight(num, this.sxAdInfo.icons[iconIndex].openData);

                if (index != -1) {
                    if (this.sxAdInfo.icons[iconIndex].openType == 0) {
                        wx.previewImage({
                            // current: ''; // 当前要显示的图片url
                            urls: [this.sxAdInfo.icons[iconIndex].openData[index].imgurl], // 需要预览的图片url列表
                            success: function success(res) {},
                            fail: function fail(res) {}
                            // complete: () => {

                            // }
                        });
                    } else if (this.sxAdInfo.icons[iconIndex].openType == 1) {
                        var bi_paramlist = this.sxAdInfo.icons[iconIndex].biparam;
                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);
                        wx.navigateToMiniProgram({
                            appId: this.sxAdInfo.icons[iconIndex].openData[index].imgurl,
                            path: this.sxAdInfo.icons[iconIndex].topath,
                            envVersion: 'release',
                            extraData: null,
                            success: function success(res) {
                                hall.sxAdManager.saveItem(hall.sxAdManager.sxAdInfo.icons[iconIndex].openData[index].imgurl);
                                //刷新权重
                                hall.sxAdManager.refreshIconsWeight();
                                hall.sxAdManager.initWeight();
                                //刷新icon
                                hall.sxAdManager.switchIcon();
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                            },
                            fail: function fail(res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                console.log('wx.navigateToMiniProgram fail');
                                console.log(res);
                            },
                            complete: function complete(res) {
                                console.log('navigateToMiniProgram ==== complete');
                            }
                        });
                    }
                }
            } catch (error) {
                console.log("sxAdManager: ", error);
            }
        }
    },

    //随机权重
    selectItemByWeight: function selectItemByWeight(num, arr) {
        var limit = 0;
        for (var i = 0; i < arr.length; i++) {
            var weight = arr[i].weight;
            if (weight) {
                if (num <= weight + limit && num >= limit) {
                    return i;
                }
            }
            limit += weight;
        }
        return -1;
    },


    //当前app是否被点击过
    isClickApp: function isClickApp(appid) {
        var storedata = cc.sys.localStorage.getItem("sxad-data");
        if (storedata && storedata !== '' && storedata.indexOf(appid) >= 0) {
            return true;
        }
        return false;
    },

    //app点击，保存appID到本地
    saveItem: function saveItem(appid) {
        var storedata = cc.sys.localStorage.getItem("sxad-data");
        if (storedata && storedata !== '') {
            storedata += appid + ',';
        } else {
            storedata = appid + ',';
        }
        cc.sys.localStorage.setItem("sxad-data", storedata);
    }
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=sxAdManager.js.map
        