//三消交叉导流
shot.sxAdmanager2 = {
    sxAdInfo: null,
    callback: null,
    isLoadConfig: false,
    adIcons: [],
    content: null,
    isGalleryStop: false,
    cellwidth: 0,

    show: function () {//, scale) {
        shot.Ad = this;
        try {
            if (this.adIcon) {
                this.adIcon.active = true;
                if (this.adIcons.length > this.sxAdInfo.viewAdCounts) {
                    var _act = cc.moveBy(this.sxAdInfo.framesInterval, -cc.winSize.width, 0);
                    this.content.runAction(cc.repeatForever(_act));
                    cc.director.getScheduler().schedule(this.callback, this.content, 0, false);
                }
            } else {
                var callback = () => {
                    if (this.sxAdInfo.switch == 1) {
                        this.adIcon = new cc.Node();

                        // if (typeof wx !== 'undefined') {

                        this.iconIndex = 0;
                        this.setAd();
                        if (this.adIcons.length > this.sxAdInfo.viewAdCounts) {
                            this.callback = () => {
                                if (Math.abs(this.content.x / this.cellwidth) > 1) {

                                    var reNode = this.content.children[0];
                                    this.content.children[0].removeFromParent();
                                    this.content.addChild(reNode);
                                    this.content.x = 0;
                                }
                            }
                            var _act = cc.moveBy(this.sxAdInfo.framesInterval, -cc.winSize.width, 0);
                            this.content.runAction(cc.repeatForever(_act));
                            cc.director.getScheduler().schedule(this.callback, this.content, 0, false);
                        }
                        cc.game.addPersistRootNode(this.adIcon);

                        // }

                    }
                };
                this.loadConfigFile(callback);
            }
        } catch (error) {
            console.log("sxAdManager: ", error);

        }
    },

    setAd: function () {

        //遮罩
        var view = new cc.Node('view');
        this.adIcon.addChild(view);
        view.addComponent(cc.Mask);//.type = cc.Mask.Type.RECT;
        var scrollview = view.addComponent(cc.ScrollView);

        var content = new cc.Node('content');
        content.anchorX = 0;
        scrollview.content = content;
        scrollview.horizontal = true;
        scrollview.vertical = false;
        this.content = content;
        view.addChild(content);

        var layout = content.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.GRID;
        layout.resizeMode = cc.Layout.ResizeMode.CHILDREN;
        layout.startAxis = cc.Layout.AxisDirection.VERTICAL;
        layout.paddingTop = 13;
        layout.paddingBottom = 5;
        layout.spacingX = 5;

        this.loadAllAd();
        var cellwidth = cc.winSize.width / this.sxAdInfo.viewAdCounts - layout.spacingX;
        this.cellwidth = cellwidth;
        layout.cellSize = cc.size(cellwidth, cellwidth * 178 / 147);
        // console.log(cellwidth * 178 / 147);
        this.adIcon.anchorX = 0;
        this.adIcon.anchorY = 0;
        this.adIcon.width = cc.winSize.width;
        this.adIcon.height = layout.cellSize.height + layout.paddingBottom + layout.paddingTop;
        this.adIcon.x = 0;
        this.adIcon.y = 0;

        view.anchorX = 0;
        view.anchorY = 0;
        view.x = 0;
        view.y = 0;
        view.width = this.adIcon.width;
        view.height = this.adIcon.height;


        let self = this;
        //创建单色80%透明度的黑色背景
        cc.loader.load({ url: this.sxAdInfo.bg }, function (err, texture) {
            if (!err) {
                self.adIcon.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                self.adIcon.width = cc.winSize.width;
                self.adIcon.height = layout.cellSize.height + layout.paddingBottom + layout.paddingTop;
            }
            else {
            }
        });
        //添加“猜你喜欢”文字
        cc.loader.load({ url: this.sxAdInfo.label }, function (err, texture) {
            if (!err) {
                var node = new cc.Node();
                node.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                node.x = self.adIcon.width / 2;
                node.y = self.adIcon.height;
                self.adIcon.addChild(node);
                // if (texture && texture.width && texture.height && self.adType != 2) {
                //     spriteIco.setContentSize(cc.size(texture.width, texture.height));
                //     adButton.setContentSize(cc.size(texture.width, texture.height));
                // } 
            }
            else {
            }
        });

        //添加item
        for (let i = 0; i < this.adIcons.length; i++) {
            var index;
            for (let j = 0; j < this.adIcons.length; j++) {
                if (this.sxAdInfo.icons[j].index == i) {
                    index = j;
                    break;
                }
            }

            content.addChild(this.adIcons[index]);
            this.adIcons[index].addComponent(cc.Button);
            this.adIcons[i].on('click', () => {
                this.onClickAdIconBtn(i)
            }, this);
        }

    },

    hide: function () {
        if (this.adIcon) {
            if (this.callback) {
                cc.director.getScheduler().unschedule(this.callback, this.content);
                this.content.stopAllActions();
            }
            this.adIcon.active = false;
        }

    },

    loadAllAd: function () {

        for (let i = 0; i < this.sxAdInfo.icons.length; i++) {

            var newAd = new cc.Node();
            if (this.sxAdInfo.icons[i].type == 0) {
                if (newAd.getComponent(cc.Animation)) {//除去动态icon的组件
                    newAd.removeComponent(cc.Animation);
                    newAd.removeComponent(cc.Sprite);
                }
                this.loadStaticImg(this.sxAdInfo.icons[i], newAd);
            } else if (this.sxAdInfo.icons[i].type == 1) {
                if (newAd.getComponent(cc.Sprite)) {//除去静态icon的组件
                    newAd.getComponent(cc.Sprite).spriteFrame = null;
                }
                this.loadDynamicImg(this.sxAdInfo.icons[i], newAd);
            }
            this.adIcons.push(newAd);
        }
    },

    loadConfigFile: function (callback) {
        try {
            let self = this;
            let xhr = cc.loader.getXMLHttpRequest();
            var timedOut = false;
            var timer = setTimeout(function () {
                timedOut = true;
                xhr.abort();
            }, 3000);
            xhr.open("GET", "https://nslyqn.nalrer.cn/nsly/crazygun/growth/adConfigFile/configLike.json", true);
            xhr.onreadystatechange = function () {
                if (timedOut) {
                    return;
                }

                clearTimeout(timer);
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300)) {
                        self.isLoadConfig = true;
                        try {
                            let ret = JSON.parse(xhr.responseText);

                            // 游戏开关
                            self.sxAdInfo = ret;
                            // ctr.sxAdmanager.refreshIconsWeight();
                            callback();

                            //Global.Gameversion = true;
                        } catch (e) {
                            // if (param) {
                            // self.loadIp();
                            // }
                            self.retryConfigFile();
                        }
                    } else {
                        // if (param) {
                        //     self.loadIp();
                        // }
                        self.retryConfigFile();
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
            console.log(' get config error', error);
        }
    },
    retryConfigFile: function () {
        if (!this.isLoadConfig) {
            setTimeout(() => {
                this.loadConfigFile(false);
            }, 20000);
        }
    },

    //添加导流入口Icon静态图片
    loadStaticImg: function (arr, adNode) {
        let link = arr.imgLink;
        let scale = arr.scale;
        let self = this;
        cc.loader.load(link, function (err, tex) {
            try {
                if (adNode.getComponent(cc.Sprite)) {//重新调用时可能是同一个静态icon也可能适另一个静态icon
                    adNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                }
                else {
                    adNode.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                }
            } catch (err) {
                console.log(err);
                adNode.addComponent(cc.Sprite).spriteFrame = null;
            }
        });
    },

    //添加导流入口Icon动画
    loadDynamicImg: function (arr, adNode) {
        let link = arr.imgLink.split(',');
        // let scale = arr.scale;
        let self = this;
        var adIconFrames = [];
        var playFrames = () => {


            if (adNode.getComponent(cc.Animation)) {//重新调用时可能是同一个动态icon也可能适另一个动态icon

                var animation = adNode.getComponent(cc.Animation);

                var clip = cc.AnimationClip.createWithSpriteFrames(adIconFrames, 10);
                clip.name = 'anim_frame';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('anim_frame');
            }
            else {
                var animation = adNode.addComponent(cc.Animation);
                if (!adNode.getComponent(cc.Sprite))
                    adNode.addComponent(cc.Sprite);

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

                for (let i = 0; i < link.length; i++) {
                    var tex = results.getContent(link[i]);
                    adIconFrames.push(new cc.SpriteFrame(tex));
                }

                playFrames();
            } catch (err) {
                console.log(err);
                adIconFrames.push(null);
            }
        }
        );
    },

    onClickAdIconBtn: function (index) {
        hall.LOGE("=====","===onClickAdIconBtn==="+index);

        if (typeof wx !== 'undefined') {
            try {
                if (index != -1) {
                    if (this.sxAdInfo.icons[index].openType == 0) {
                        wx.previewImage({
                            // current: ''; // 当前要显示的图片url
                            urls: [this.sxAdInfo.icons[index].openUrl], // 需要预览的图片url列表
                            success: (res) => {
                            },
                            fail: (res) => {
                            },
                            // complete: () => {

                            // }
                        });
                    }
                    else if (this.sxAdInfo.icons[index].openType == 1) {
                        var bi_paramlist = this.sxAdInfo.icons[index].biparam;
                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);
                        wx.navigateToMiniProgram({
                            appId: this.sxAdInfo.icons[index].openUrl,
                            path: this.sxAdInfo.icons[index].topath,
                            envVersion: 'release',
                            extraData: null,
                            success: function (res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                            },
                            fail: function (res) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                                console.log('wx.navigateToMiniProgram fail');
                                console.log(res);
                            },
                            complete: function (res) {
                                console.log('navigateToMiniProgram ==== complete');
                            }
                        });
                    }

                }

            } catch (error) {
                console.log("sxAdManager: ", error);
            }
        }
    }
};