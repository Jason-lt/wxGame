"use strict";
cc._RF.push(module, 'e0ad3HCstBEI7lmcR9r+M4+', 'sxAdManager');
// Script/shot/sxAdManager.js

"use strict";

//三消交叉导流
double.sxAdmanager = {
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

    adIcon: null,

    show: function show(dx, dy, scale) {
        try {
            if (this.adIcon) {
                hall.LOGW("sxAdManager: " + "restart adIcon");
                if (dx == 0 && dy == 0) {
                    this.setPositionByScene(0);
                } else {
                    this.adIcon.position = cc.v2(dx, dy);
                }
                this.adIcon.active = true;
                cc.director.getScheduler().schedule(this.callback, this.adIcon, this.sxAdInfo.framesInterval, !this.isSwitchIcon);
            } else {

                var that = this;
                var callback = function callback() {
                    hall.LOGW("sxAdManager: " + "first adIcon");
                    that.adIcon = new cc.Node();

                    // this.adIcon.position = cc.v2(cc.winSize.width - dx, dy);
                    that.adIcon.position = cc.v2(dx, dy);

                    if (dx == 0 && dy == 0) that.setPositionByScene(0);
                    if (scale) that.adIcon.scale = scale;

                    if (typeof wx !== 'undefined') {
                        that.initWeight();
                        that.iconIndex = 0;
                        that.isSwitchIcon = true;
                        that.callback = function () {
                            that.switchIcon();
                        };
                        that.callback();
                        cc.director.getScheduler().schedule(that.callback, that.adIcon, that.sxAdInfo.framesInterval, !that.isSwitchIcon);
                        that.adIcon.addComponent(cc.Button);
                        that.adIcon.on('click', that.onClickAdIconBtn, that);

                        that.adIcon.zIndex = 999;
                        cc.game.addPersistRootNode(that.adIcon);
                    }
                };
                this.loadConfigFile(callback);
            }
        } catch (error) {
            hall.LOGW("sxAdManager: ", error);
        }
    },

    hide: function hide() {
        if (this.adIcon) {
            cc.director.getScheduler().unschedule(this.callback, this.adIcon);
            this.adIcon.active = false;
            hall.LOGW("sxAdManager: " + "Ad hide success");
        }
    },

    setPosition: function setPosition(dx, dy) {
        if (this.adIcon) {
            this.adIcon.position = cc.v2(cc.winSize.width - dx, dy);
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

            hall.LOGW(index, "x: ", dx, "y: ", dy);
            this.adIcon.position = cc.v2(dx, dy);
        }
    },

    loadConfigFile: function loadConfigFile(callback) {
        try {
            hall.LOGW('getConfigFile');
            var self = this;
            var xhr = cc.loader.getXMLHttpRequest();
            var timedOut = false;
            var timer = setTimeout(function () {
                timedOut = true;
                xhr.abort();
            }, 3000);
            // xhr.open("GET", "https://sanxqn.nalrer.cn/tysanxiao/box/adconfig/configDaoLiu7.json", true);
            xhr.open("GET", "https://nslyqn.nalrer.cn/nsly/crazygun/growth/adConfigFile/configDaoLiu.json", true);
            xhr.onreadystatechange = function () {
                if (timedOut) {
                    return;
                }
                clearTimeout(timer);
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        self.isLoadConfig = true;
                        hall.LOGW("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                        try {
                            var ret = JSON.parse(xhr.responseText);
                            hall.LOGW('get config', ret);

                            // 游戏开关
                            self.sxAdInfo = ret;
                            hall.LOGW('sxAdInfo:', self.sxAdInfo);
                            callback();

                            //Global.Gameversion = true;
                        } catch (e) {
                            // if (param) {
                            // self.loadIp();
                            // }
                            self.retryConfigFile();
                            hall.LOGW("err:" + e);
                        }
                    } else {
                        // if (param) {
                        //     self.loadIp();
                        // }
                        self.retryConfigFile();
                        hall.LOGW('get config error', xhr);
                    }
                }
                // self.loadIp();
            };

            xhr.onerror = function () {
                clearTimeout(timer);
                // if (param) {
                //     // self.loadIp();
                //     self.retryConfigFile();
                // }
            };

            xhr.send();
        } catch (error) {
            // if (param) {
            //     // self.loadIp();
            //     self.retryConfigFile();
            // }
            hall.LOGW(' get config error', error);
        }
    },
    retryConfigFile: function retryConfigFile() {
        var _this = this;

        if (!this.isLoadConfig) {
            setTimeout(function () {
                _this.loadConfigFile(false);
            }, 20000);
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
                        hall.LOGW("sxAdManager: " + "load static Ad");
                        if (this.adIcon.getComponent(cc.Animation)) {
                            //除去动态icon的组件
                            this.adIcon.removeComponent(cc.Animation);
                            this.adIcon.removeComponent(cc.Sprite);
                        }
                        this.loadStaticImg(this.sxAdInfo.icons[this.iconIndex]);
                    } else if (this.sxAdInfo.icons[this.iconIndex].type == 1) {
                        hall.LOGW("sxAdManager: " + "load dynamic Ad");
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
            hall.LOGW("sxAdManager: ", err);
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
                    hall.LOGW("sxAdManager: ", 'load Dynamic img failed' + err[i] + ']: ' + results.getError(err[i]));
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
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.OPEN_ADBTN_TYPE_TODAY, 'STU');
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
                                hall.LOGW("sxAdManager: " + 'preview success', res);
                            },
                            fail: function fail(res) {
                                hall.LOGW("sxAdManager: " + 'preview fail', res);
                            }
                            // complete: () => {

                            // }
                        });
                    } else if (this.sxAdInfo.icons[iconIndex].openType == 1) {
                        var bi_paramlist = this.sxAdInfo.icons[iconIndex].biparam;
                        hall.LOGW(bi_paramlist);
                        hall.LOGW(this.sxAdInfo.icons[iconIndex].topath);
                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);
                        wx.navigateToMiniProgram({
                            appId: this.sxAdInfo.icons[iconIndex].openData[index].imgurl,
                            path: this.sxAdInfo.icons[iconIndex].topath,
                            envVersion: 'release',
                            extraData: null,
                            success: function success(res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                                hall.LOGW('wx.navigateToMiniProgram success');
                                hall.LOGW(res);
                            },
                            fail: function fail(res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                hall.LOGW('wx.navigateToMiniProgram fail');
                                hall.LOGW(res);
                            },
                            complete: function complete(res) {
                                hall.LOGW('navigateToMiniProgram ==== complete');
                            }
                        });
                    }
                }
            } catch (error) {
                hall.LOGW("sxAdManager: ", error);
            }
        }
    },

    selectItemByWeight: function selectItemByWeight(num, arr) {
        var limit = 0;
        for (var i = 0; i < arr.length; i++) {
            var weight = arr[i].weight;
            if (weight) {
                if (num < weight + limit && num > limit) {
                    return i;
                }
            }
            limit += weight;
        }
        return -1;
    }
};

cc._RF.pop();