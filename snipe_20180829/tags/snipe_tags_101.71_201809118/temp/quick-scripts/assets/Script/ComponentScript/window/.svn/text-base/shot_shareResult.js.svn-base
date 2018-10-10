(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/shot_shareResult.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd89c4qBZlpANIFVE03n2+lV', 'shot_shareResult', __filename);
// Script/ComponentScript/window/shot_shareResult.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor: function ctor() {
        this.tempCanvas = null;
        this.context = null;
    },

    properties: {

        shareMomentSprite: {
            default: null,
            type: cc.Sprite
        },
        texture: cc.Texture2D,
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },

        aniSprite: {
            default: null,
            type: cc.Sprite
        },
        aniSpriteFrame: cc.SpriteFrame,
        aniSpriteNode: {
            default: null,
            type: cc.Node
        },
        countDown: 0,
        saveImageUrl: null,

        // exWidth : 0,
        // exHeight : 0,
        windowHeight: 1136
    },

    onShareToFriend: function onShareToFriend() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["showToFriend"]);
        shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeScore);
    },

    onShareMoments: function onShareMoments() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["shareMoments"]);
        if (this.saveImageUrl) {
            this.saveImageToPhoneWithUrl(this.saveImageUrl);
            this.shareMomentSprite.node.active = true;
            this.aniSprite.spriteFrame = this.aniSpriteFrame;
            var animation = this.aniSpriteNode.getComponent(cc.Animation).getAnimationState("share_bg_ani");
            var that = this;
            animation.once("finished", function () {
                that.changeAniSprite();
            });
            animation.play();
        }
    },
    shareBackAction: function shareBackAction() {
        this.shareMomentSprite.node.active = false;
    },
    backAction: function backAction() {
        this.node.destroy();
    },
    onBlack: function onBlack() {},
    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        if (winSize.height / 1136 > winSize.width / 640) {
            // this.exWidth = ((winSize.height*640/1136)-640)/2;
            // this.exHeight = (winSize.height-1136)/2;
            this.windowHeight = winSize.height;
        }
        this.windowHeight = winSize.height;
        this.shareMomentSprite.node.active = false;
        var that = this;
        var levelNameList = ["见习枪手", "初级枪手", "高级枪手", "资深枪手", "精英枪手", "宗师枪手", "神枪手"];
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 640;
        tempCanvas.height = this.windowHeight;
        var context = tempCanvas.getContext("2d");
        this.tempCanvas = tempCanvas;
        this.context = context;
        var image1 = wx.createImage();
        image1.onload = function (event) {
            var img1 = event.target;
            context.drawImage(img1, 0, 0, 640, that.windowHeight);
            //分数
            context.font = "bold 60px arial";
            context.fillStyle = "#4a0707";
            context.textAlign = "center";
            context.fillText(shot.Share.shareKeywordReplace.bestScoreForSelf + "", 320, 203);
            //等级
            var level = that.judgeScoreLevel();
            if (level < 5) {
                context.font = "bold 92px arial";
                context.fillText(levelNameList[level - 1], 320, 350);
                that.changeShowSprite(tempCanvas, context);
            } else {
                var image3 = wx.createImage();
                image3.onload = function (event) {
                    var img3 = event.target;
                    context.drawImage(img3, (640 - img3.width) / 2, that.windowHeight - img3.height, img3.width, img3.height);
                    that.changeShowSprite(tempCanvas, context);
                };
                image3.src = ty.SystemInfo.cdnPath_shareMoment + "shot_shareMoment_level" + level + ".png";
            }
        };
        image1.src = ty.SystemInfo.cdnPath_shareMoment + "shot_shareMoment_bg_2.png";
    },

    changeShowSprite: function changeShowSprite(tempCanvas, context) {
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        this.texture.initWithElement(tempCanvas);
        this.texture.handleLoadedTexture();
        this.shareMomentSprite.spriteFrame = this.spriteFrame;
        this.shareMomentSprite.spriteFrame._refreshTexture(this.texture);
        this.shareMomentSprite.node.height = this.windowHeight;
        this.getSaveImageUrl(context, tempCanvas);
    },
    changeAniSprite: function changeAniSprite() {
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        this.texture.initWithElement(this.tempCanvas);
        this.texture.handleLoadedTexture();
        this.aniSprite.spriteFrame = this.spriteFrame;
        this.aniSprite.spriteFrame._refreshTexture(this.texture);
        this.aniSprite.node.height = this.windowHeight;
        this.aniSprite.node.active = true;
        this.countDown = 120;
    },
    update: function update(dt) {
        if (this.countDown) {
            this.countDown--;
            if (this.countDown == 0) {
                this.aniSprite.node.active = false;
            }
            if (this.countDown < 60) {
                this.aniSprite.node.x -= 3;
            }
        }
    },
    getSaveImageUrl: function getSaveImageUrl(context, tempCanvas) {
        var image3 = wx.createImage();
        var that = this;
        image3.onload = function (event) {
            var img3 = event.target;
            context.drawImage(img3, 0, that.windowHeight - 269, 640, 269);
            that.saveImageUrl = tempCanvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: 640,
                height: that.windowHeight,
                destWidth: 640,
                destHeight: that.windowHeight
            });
        };
        image3.src = ty.SystemInfo.cdnPath_shareMoment + "shot_shareMoment_bottom_2.png";
    },

    judgeScoreLevel: function judgeScoreLevel() {
        var score = shot.Share.shareKeywordReplace.bestScoreForSelf;
        var level = 0;
        if (score < 2000) {
            level = 1; //见习枪手
        } else if (score < 10000) {
            level = 2; //初级枪手
        } else if (score < 20000) {
            level = 3; //高级枪手
        } else if (score < 50000) {
            level = 4; //资深枪手
        } else if (score < 100000) {
            level = 5; //精英枪手(图)
        } else if (score < 500000) {
            level = 6; //宗师枪手(图)
        } else {
            level = 7; //神枪手(图)
        }
        return level;
    },

    saveImageToPhoneWithUrl: function saveImageToPhoneWithUrl(tempFilePath) {
        var saveImageToPhone = function saveImageToPhone() {
            wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: function success(res) {
                    hall.MsgBoxManager.showToast({ "title": "图片已保存到手机相册\n请到朋友圈分享", "time": 3 });
                    // hall.LOGW("========","=======success========"+JSON.stringify(res));
                },
                fail: function fail(params) {
                    hall.LOGW("========", "=======fail========" + JSON.stringify(params));
                },
                complete: function complete(params) {}
            });
        };
        wx.getSetting({
            success: function success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: "scope.writePhotosAlbum",
                        success: function success() {
                            saveImageToPhone();
                        },
                        fail: function fail() {
                            hall.LOGW(null, "授权使用相册失败!");
                            wx.showModal({
                                title: '提示',
                                content: '保存图片,需要您授权使用相册,点击确定手动进行授权!',
                                showCancel: true,
                                cancelText: '取消',
                                confirmText: '确定',
                                success: function success(res) {
                                    if (res.confirm) {
                                        wx.openSetting();
                                    }
                                }
                            });
                        },
                        complete: function complete() {}
                    });
                } else {
                    saveImageToPhone();
                }
            }
        });
    }

    // LIFE-CYCLE CALLBACKS:


    // start () {
    //
    // },
});

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
        //# sourceMappingURL=shot_shareResult.js.map
        