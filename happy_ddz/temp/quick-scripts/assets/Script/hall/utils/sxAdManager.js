(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/utils/sxAdManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4e9940AL0hIsLLCh8/ru2wk', 'sxAdManager', __filename);
// Script/hall/utils/sxAdManager.js

"use strict";

//三消交叉导流
hall.sxAdManager = {
    // sxAdInfo: {
    //     "icons": [
    //         // {
    //         //     "weight": 10,
    //         //     "type": 0,//0为静图，1为动图
    //         //     "imgLink": "https://sanxqn.nalrer.cn/tysanxiao/common/Sbt_melon_1.png",
    //         //     "openType": 0,//0为静图，1为小程序
    //         //     "openData":
    //         //         [
    //         //             { "imgurl": "https://sanxqn.nalrer.cn/tysanxiao/box-worldCup/linkImages/WorldCup_Img_1.jpg", "weight": 50 },
    //         //             { "imgurl": "https://sanxqn.nalrer.cn/tysanxiao/trialine/linkimage/link002.png", "weight": 100 },
    //         //             { "imgurl": "https://sanxqn.nalrer.cn/tysanxiao/1010/linkImages/1010_link_image.png", "weight": 37 },
    //         //         ]
    //         // },
    //         {
    //             "weight": 10,
    //             "type": 1,
    //             "imgLink": "https://sanxqn.nalrer.cn/tysanxiao/box/Ad/1.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/2.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/3.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/4.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/5.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/6.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/7.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/8.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/9.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/10.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/11.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/12.png,https://sanxqn.nalrer.cn/tysanxiao/box/Ad/13.png",
    //             "openType": 0,
    //             "openData":
    //                 [
    //                     { "imgurl": "https://sanxqn.nalrer.cn/tysanxiao/box-worldCup/linkImages/WorldCup_Img_1.jpg", "weight": 80 },
    //                     { "imgurl": "https://sanxqn.nalrer.cn/tysanxiao/1010/linkImages/1010_link_image.png", "weight": 11 },
    //                 ]
    //         }
    //     ],
    //     "framesInterval": 3,
    //     "position": [{ "x": 600, "y": 450 }, { "x": 50, "y": 760 }, { "x": 550, "y": 820 }]
    // },
    sxAdInfo: null,
    opDataWeight: [],
    iconWeight: null,
    iconIndex: null,
    preIconIndex: null,
    isSwitchIcon: false, //true为换icon，false为不换icon
    callback: null,
    isLoadConfig: false,

    show: function show(dx, dy, scale) {
        var _this = this;

        try {
            if (this.adIcon) {
                console.log("sxAdManager: " + "restart adIcon");
                if (dx == 0 && dy == 0) {
                    this.setPositionByScene(0);
                }
                this.adIcon.active = true;
                cc.director.getScheduler().schedule(this.callback, this.adIcon, this.sxAdInfo.framesInterval, !this.isSwitchIcon);
            } else {

                var callback = function callback() {
                    console.log("sxAdManager: " + "first adIcon");
                    _this.adIcon = new cc.Node();

                    _this.adIcon.position = cc.v2(cc.winSize.width - dx, dy);

                    if (dx == 0 && dy == 0) _this.setPositionByScene(0);
                    if (scale) _this.adIcon.scale = scale;

                    if (typeof wx !== 'undefined') {
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
                    }

                    ty.NotificationCenter.trigger(ty.EventType.UPDATE_SXADICON_POS);
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
            this.adIcon.active = false;
            console.log("sxAdManager: " + "Ad hide success");
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

    setPositionByScene: function setPositionByScene(index) {
        if (this.adIcon) {
            var dx = this.sxAdInfo.position[index].x;
            var dy = this.sxAdInfo.position[index].y;

            console.log(index, "x: ", dx, "y: ", dy);
            this.adIcon.position = cc.v2(dx, dy);
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
        if (!this.isLoadConfig) {
            var that = this;
            setTimeout(function () {
                that.loadConfigFile();
            }, 2000);
            // this.scheduleOnce(function () {
            //
            // }, 1);
        }
    },
    switchIcon: function switchIcon() {
        //刷新Icon
        try {
            var num = Math.floor(Math.random() * this.iconWeight);
            this.iconIndex = this.selectItemByWeight(num, this.sxAdInfo.icons);

            if (this.iconIndex != -1) {
                if (this.iconIndex != this.preIconIndex) {
                    if (this.sxAdInfo.icons[this.iconIndex].type == 0) {
                        console.log("sxAdManager: " + "load static Ad");
                        if (this.adIcon.getComponent(cc.Animation)) {
                            //除去动态icon的组件
                            this.adIcon.removeComponent(cc.Animation);
                            this.adIcon.removeComponent(cc.Sprite);
                        }
                        this.loadStaticImg(this.sxAdInfo.icons[this.iconIndex]);
                    } else if (this.sxAdInfo.icons[this.iconIndex].type == 1) {
                        console.log("sxAdManager: " + "load dynamic Ad");
                        if (this.adIcon.getComponent(cc.Sprite)) {
                            //除去静态icon的组件
                            this.adIcon.getComponent(cc.Sprite).spriteFrame = null;
                        }
                        this.loadDynamicImg(this.sxAdInfo.icons[this.iconIndex]);
                    }
                    this.preIconIndex = this.iconIndex;
                }
            }
        } catch (err) {
            console.log("sxAdManager: ", err);
            cc.director.getScheduler().unschedule(this.callback, this.adIcon);
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
        var self = this;
        cc.loader.load(link, function (err, tex) {
            if (self.adIcon.getComponent(cc.Sprite)) {
                //重新调用时可能是同一个静态icon也可能适另一个静态icon
                self.adIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            } else {
                self.adIcon.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            }
        });
    },

    //添加导流入口Icon动画
    loadDynamicImg: function loadDynamicImg(arr) {
        var link = arr.imgLink.split(',');
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
            if (err) {
                for (var i = 0; i < err.length; i++) {
                    console.log("sxAdManager: ", 'load Dynamic img failed' + err[i] + ']: ' + results.getError(err[i]));
                }
            } else {
                adIconFrames.splice(0, adIconFrames.length);

                for (var _i = 0; _i < link.length; _i++) {
                    var tex = results.getContent(link[_i]);
                    adIconFrames.push(new cc.SpriteFrame(tex));
                }
                playFrames();
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
                            success: function success(res) {
                                console.log("sxAdManager: " + 'preview success', res);
                            },
                            fail: function fail(res) {
                                console.log("sxAdManager: " + 'preview fail', res);
                            }
                            // complete: () => {

                            // }
                        });
                    } else if (this.sxAdInfo.icons[iconIndex].openType == 1) {
                        var bi_paramlist = this.sxAdInfo.icons[iconIndex].biparam;
                        console.log(bi_paramlist);
                        console.log(this.sxAdInfo.icons[iconIndex].topath);
                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);
                        wx.navigateToMiniProgram({
                            appId: this.sxAdInfo.icons[iconIndex].openData[index].imgurl,
                            path: this.sxAdInfo.icons[iconIndex].topath,
                            envVersion: 'release',
                            extraData: null,
                            success: function success(res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                                console.log('wx.navigateToMiniProgram success');
                                console.log(res);
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

    selectItemByWeight: function selectItemByWeight(num, arr) {
        var limit = 0;
        for (var i = 0; i < arr.length; i++) {
            var weight = arr[i].weight;
            if (weight) {
                console.log("fuck", weight);
                if (num < weight + limit && num >= limit) {
                    return i;
                }
            }
            limit += weight;
        }
        return -1;
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
        