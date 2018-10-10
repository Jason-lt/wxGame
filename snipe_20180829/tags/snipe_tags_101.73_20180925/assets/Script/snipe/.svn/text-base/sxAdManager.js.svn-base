//三消交叉导流
snipe.sxAdmanager = {
    sxAdInfo: null,
    opDataWeight: [],
    iconWeight: null,
    iconIndex: null,
    preIconIndex: null,
    isSwitchIcon: false,//true为换icon，false为不换icon
    callback: null,
    isLoadConfig: false,


    show: function (dx,dy) {//, scale) {
        try {
            if(this.iconWeight == 0){
                this.hide();
                return;
            }
            if (this.adIcon) {

                this.adIcon.active = true;
                this.adIcon.x = dx;
                this.adIcon.y = dy;
                // hall.LOGE("show","=====show===="+this.adIcon.x+"======"+this.adIcon.y+"===="+this.adIcon.scale);
                cc.director.getScheduler().schedule(
                    this.callback, this.adIcon, this.sxAdInfo.framesInterval, !this.isSwitchIcon);
            } else {

                var that = this;
                var callback = () => {
                    that.adIcon = new cc.Node();

                    // if (typeof wx !== 'undefined') {
                    that.initWeight();
                    that.iconIndex = 0;
                    that.isSwitchIcon = true;
                    that.callback = () => {
                        that.switchIcon();
                    }
                    that.callback();
                    that.adIcon.x = dx;
                    that.adIcon.y = dy;
                    cc.director.getScheduler().schedule(
                        that.callback, that.adIcon, that.sxAdInfo.framesInterval, !that.isSwitchIcon);
                    that.adIcon.addComponent(cc.Button);

                    that.adIcon.on('click', that.onClickAdIconBtn, that);

                    that.adIcon.zIndex = 9999;
                    cc.game.addPersistRootNode(that.adIcon);
                    // }
                };
                this.loadConfigFile(callback);
            }
        } catch (error) {
            console.log("sxAdManager: ", error);

        }
    },

    hide: function () {
        if (this.adIcon) {
            cc.director.getScheduler().unschedule(this.callback, this.adIcon);
            this.adIcon.active = false;
        }

    },

    setPosition: function (dx, dy) {
        if (this.adIcon) {
            this.adIcon.position = cc.v2(cc.winSize.width - dx, dy);
        }
    },

    setScale: function (scale) {
        if (this.adIcon) {
            this.adIcon.scale = scale;
        }
    },

    setPositionById: function (id) {
        if (this.adIcon) {
            let index = -1;
            for (let i = 0; i < this.sxAdInfo.position.length; i++) {
                if (this.sxAdInfo.position[i].id == id)
                    index = i;
            }
            if (index != -1) {
                let widget = this.sxAdInfo.position[index].type;
                let dx = this.sxAdInfo.position[index].x;
                let dy = this.sxAdInfo.position[index].y;
                this.setWidgetPosition(widget, dx, dy);

            }
        }
        else{
            var that = this;
            setTimeout(() => {
                that.setPositionById(id);
        }, 10);
        }
    },
    setWidgetPosition: function (type, x, y) {
        switch (type) {
            case 1://top left
                this.adIcon.position = cc.v2(x, cc.winSize.height - y);
                break;
            case 2://top right
                this.adIcon.position = cc.v2(cc.winSize.width - x, cc.winSize.height - y);
                break;
            case 3://bottom left
                this.adIcon.position = cc.v2(x, y);
                break;
            case 4://bottom right
                this.adIcon.position = cc.v2(cc.winSize.width - x, y);
                break;
            case 5://top HorizontalCenter
                this.adIcon.position = cc.v2(cc.winSize.width / 2 + x, cc.winSize.height - y);
                break;
            case 6://bottom HorizontalCenter
                this.adIcon.position = cc.v2(cc.winSize.width / 2 + x, y);
                break;
            case 7://left VerticalCenter
                this.adIcon.position = cc.v2(x, cc.winSize.height / 2 + y);
                break;
            case 8://right VerticalCenter
                this.adIcon.position = cc.v2(cc.winSize.width - x, cc.winSize.height / 2 + y);
                break;
            case 9://HorizontalCenter VerticalCenter
                this.adIcon.position = cc.v2(cc.winSize.width / 2 + x, cc.winSize.height / 2 + y);
                break;
            default:
                break;
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
            // xhr.open("GET", "https://sanxqn.nalrer.cn/tysanxiao/box/adconfig/configDaoLiu11.json", true);
            xhr.open("GET", "https://nslyqn.nalrer.cn/nsly/supersnipe/growth/adConfigFile/configDaoLiu_2.json", true);
            // https://nslyqn.nalrer.cn/nsly/crazygun/growth/adConfigFile/configDaoLiu.json
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
                            snipe.sxAdmanager.refreshIconsWeight();
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
            var that = this;
            setTimeout(() => {
                that.loadConfigFile(false);
        }, 20000);
        }
    },
    switchIcon: function () {//刷新Icon
        try {
            if(this.iconWeight == 0){
                this.hide();
                return;
            }
            let num = Math.floor(Math.random() * this.iconWeight);
            this.iconIndex = this.selectItemByWeight(num, this.sxAdInfo.icons);

            if (this.iconIndex == -1) {
                this.hide();
                return;
            }

            if (this.iconIndex != this.preIconIndex) {
                if (this.sxAdInfo.icons[this.iconIndex].type == 0) {
                    if (this.adIcon.getComponent(cc.Animation)) {//除去动态icon的组件
                        this.adIcon.removeComponent(cc.Animation);
                        this.adIcon.removeComponent(cc.Sprite);
                    }
                    this.loadStaticImg(this.sxAdInfo.icons[this.iconIndex]);
                } else if (this.sxAdInfo.icons[this.iconIndex].type == 1) {
                    if (this.adIcon.getComponent(cc.Sprite)) {//除去静态icon的组件
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
    refreshIconsWeight: function () {
        for (let i = 0; i < this.sxAdInfo.icons.length; i++) {
            var allWeight = 0;
            for (let j = 0; j < this.sxAdInfo.icons[i].openData.length; j++) {
                if (this.sxAdInfo.icons[i].openData[j].clickHide && this.isClickApp(this.sxAdInfo.icons[i].openData[j].imgurl)) {
                    this.sxAdInfo.icons[i].openData[j].weight = 0;
                }
                else {
                    allWeight += this.sxAdInfo.icons[i].openData[j].weight;
                }
            }
            if (allWeight == 0) {
                this.sxAdInfo.icons[i].weight = 0;
            }
        }
    },

    initWeight: function () {
        this.iconWeight = 0;
        for (let i = 0; i < this.sxAdInfo.icons.length; i++) {
            this.iconWeight += this.sxAdInfo.icons[i].weight;
            this.opDataWeight[i] = 0;
            var openData = this.sxAdInfo.icons[i].openData;
            for (let j = 0; j < openData.length; j++) {
                this.opDataWeight[i] += openData[j].weight;
            }
        }
    },

    //添加导流入口Icon静态图片
    loadStaticImg: function (arr) {
        let link = arr.imgLink;
        let scale = arr.scale;
        let self = this;
        cc.loader.load(link, function (err, tex) {
            try {
                if (self.adIcon.getComponent(cc.Sprite)) {//重新调用时可能是同一个静态icon也可能适另一个静态icon
                    self.adIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                    self.adIcon.scale = scale;
                }
                else {
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
    loadDynamicImg: function (arr) {
        let link = arr.imgLink.split(',');
        let scale = arr.scale;
        let self = this;
        var adIconFrames = [];
        var playFrames = () => {


            if (self.adIcon.getComponent(cc.Animation)) {//重新调用时可能是同一个动态icon也可能适另一个动态icon

                var animation = self.adIcon.getComponent(cc.Animation);

                var clip = cc.AnimationClip.createWithSpriteFrames(adIconFrames, 10);
                clip.name = 'anim_frame';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('anim_frame');
            }
            else {
                var animation = self.adIcon.addComponent(cc.Animation);
                if (!self.adIcon.getComponent(cc.Sprite))
                    self.adIcon.addComponent(cc.Sprite);

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
                    self.adIcon.scale = scale;
                    playFrames();
                } catch (err) {
                    console.log(err);
                    adIconFrames.push(null);
                }
            }
        );
    },

    onClickAdIconBtn: function () {
        if (typeof wx !== 'undefined') {
            try {
                let iconIndex = this.iconIndex;
                let num = Math.floor(Math.random() * this.opDataWeight[iconIndex]);
                let index = this.selectItemByWeight(num, this.sxAdInfo.icons[iconIndex].openData);

                if (index != -1) {
                    if (this.sxAdInfo.icons[iconIndex].openType == 0) {
                        wx.previewImage({
                                // current: ''; // 当前要显示的图片url
                                urls: [this.sxAdInfo.icons[iconIndex].openData[index].imgurl], // 需要预览的图片url列表
                                success: (res) => {
                            },
                            fail: (res) => {
                        },
                        // complete: () => {

                        // }
                    });
                    }
                    else if (this.sxAdInfo.icons[iconIndex].openType == 1) {
                        var bi_paramlist = this.sxAdInfo.icons[iconIndex].biparam;
                        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);
                        wx.navigateToMiniProgram({
                            appId: this.sxAdInfo.icons[iconIndex].openData[index].imgurl,
                            path: this.sxAdInfo.icons[iconIndex].topath,
                            envVersion: 'release',
                            extraData: null,
                            success: function (res) {
                                snipe.sxAdmanager.saveItem(snipe.sxAdmanager.sxAdInfo.icons[iconIndex].openData[index].imgurl);
                                //刷新权重
                                snipe.sxAdmanager.refreshIconsWeight();
                                snipe.sxAdmanager.initWeight();
                                //刷新icon
                                snipe.sxAdmanager.switchIcon();
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
    },

    //随机权重
    selectItemByWeight(num, arr) {
        let limit = 0;
        for (let i = 0; i < arr.length; i++) {
            let weight = arr[i].weight;
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
    isClickApp: function (appid) {
        let storedata = cc.sys.localStorage.getItem("sxad-data");
        if (storedata && storedata !== '' && storedata.indexOf(appid) >= 0) {
            return true;
        }
        return false;
    },

    //app点击，保存appID到本地
    saveItem: function (appid) {
        let storedata = cc.sys.localStorage.getItem("sxad-data");
        if (storedata && storedata !== '') {
            storedata += appid + ',';
        } else {
            storedata = appid + ',';
        }
        cc.sys.localStorage.setItem("sxad-data", storedata);
    }
};
