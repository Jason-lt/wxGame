"use strict";
cc._RF.push(module, 'b2d85gezntAJbTMvT+uUb2I', 'SystemInfo');
// Script/Framework/SystemInfo.js

"use strict";

/**
 * @author zhaoliang
 * @date 1.28
 * 
 * 全局对象
 * 系统信息
 * 包括clientId，loginUrl等
 */
console.log("SystemInfo loaded");
ty.SystemInfo = {
    DEBUG_SER_KEY: "DEBUG_SER_KEY",
    clientId: 'H5_5.0_weixin.weixin.0-hall6.weixin.huanlzrddz',
    clientIdInt: 24502,
    cloudid: 24,

    version: "1.1.1",
    //
    // loginUrl: 'https://fz.nalrer.cn/', //仿真地址
    // loginUrl: 'http://140.143.201.170:8000/', //仿真地址
    //
    // webSocketUrl: 'ws://39.107.104.141/',
    // loginUrl: 'http://192.168.20.108:8000/',
    // webSocketUrl: 'ws://192.168.10.88/',
    //
    loginUrl: 'https://openrich.nalrer.cn/', //正式

    // webSocketUrl: 'wss://richwss.nalrer.cn/',

    // loginUrl : 'http://140.143.250.132/',
    // webSocketUrl: 'ws://140.143.250.132/',

    deviceId: 'wechatGame',
    wxAppId: 'wx5f900edfc70560a0',
    wxAppId_fuhao: 'wxbfebdafc2fc60b54',
    appId: 9999,
    hallId: 9999,
    gameId: 6,
    tableBgMusicVolume: 0.4,
    cdnPath: "https://richqn.nalrer.cn/dizhu/",

    remotePackPath: "happyDdz/remote_res/resNew13.zip",

    m_server_ip: "https://cbi.touch4.me/api/bilog5/text",
    // m_server_ip : "https://47.94.79.1/api/bilog5/text",
    // m_server_ip : "http://172.16.3.24",

    shareManagerUrl: 'https://market.touch4.me/',

    shareImagePath: "",
    shareImageType: "",
    shareTicket: "",
    ftID: "",
    treasureID: "",
    mostImgCount: 40,
    imageDicArray: [],
    imageDic: {},
    bsgsCitys: ['北京', '上海', '广州', '深圳', '杭州', '成都'],

    getImageWithURL: function getImageWithURL(urlStringO, nowSprite) {
        var urlString = hall.hex_md5(urlStringO);
        var setOldSize = function setOldSize(nowSprite, texture) {
            var oldSize = cc.size(nowSprite.node.width, nowSprite.node.height);
            nowSprite.spriteFrame = texture;
            nowSprite.node.setContentSize(oldSize);
        };

        if (ty.SystemInfo.imageDic[urlString]) {
            if (ty.SystemInfo.imageDic[urlString].texture) {
                // hall.LOGD(null, "缓存在这里缓存在这里缓存在这里缓存在这里缓存在这里");
                setOldSize(nowSprite, ty.SystemInfo.imageDic[urlString].texture);
            } else {
                if (ty.SystemInfo.imageDic[urlString].textureArray) {
                    ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
                } else {
                    ty.SystemInfo.imageDic[urlString].textureArray = [];
                    ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
                }
            }
        } else {
            ty.SystemInfo.imageDic[urlString] = {};
            ty.SystemInfo.imageDic[urlString].textureArray = [];
            ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
            if (ty.SystemInfo.imageDicArray.length >= ty.SystemInfo.mostImgCount) {
                var tempURL = ty.SystemInfo.imageDicArray[0];
                ty.SystemInfo.imageDic[tempURL] = null;
                delete ty.SystemInfo.imageDic[tempURL];
                ty.SystemInfo.imageDicArray.splice(0, 1);
            }
            ty.SystemInfo.imageDicArray.push(urlString);

            var _index = 0;
            var loadImage = function loadImage() {
                var txImage = wx.createImage();
                txImage.src = urlStringO;
                txImage.onload = function (event) {
                    hall.LOGW("", "file = [SystemInfo] fun = [loadImage] 加载成功");
                    var texture = new cc.Texture2D();
                    texture.initWithElement(txImage);
                    texture.handleLoadedTexture();
                    ty.SystemInfo.imageDic[urlString].texture = new cc.SpriteFrame(texture);
                    var tempA = ty.SystemInfo.imageDic[urlString].textureArray;
                    for (var i = 0; i < tempA.length; i++) {
                        var sprit = tempA[i];
                        if (sprit) {
                            // hall.LOGD(null, "不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片");
                            setOldSize(sprit, ty.SystemInfo.imageDic[urlString].texture);
                        }
                    }
                };
                txImage.onerror = function (event) {
                    hall.LOGW("", "file = [SystemInfo] fun = [loadImage] 加载失败");
                    _index++;
                    if (_index < 4) {
                        ty.Timer.setTimer(cc.director, function () {
                            loadImage();
                        }, 1, 1, 0);
                    }
                };
            };

            loadImage();
        }
    },
    getImageWithURLBig: function getImageWithURLBig(urlStringO, nowSprite) {
        ddz.LOGD("", "file = [SystemInfo] fun = [getImageWithURLBig] urlStringO = " + urlStringO);
        var urlStr_2 = urlStringO;
        var jpg_index = urlStringO.indexOf(".jpg");
        if (jpg_index == -1) {
            var index = urlStringO.indexOf("/132");
            if (index > 0) {
                urlStr_2 = urlStr_2.replace('/132', '/0');
            }
        }
        var urlString = hall.hex_md5(urlStr_2);
        var setOldSize = function setOldSize(nowSprite, texture) {
            var oldSize = cc.size(nowSprite.node.width, nowSprite.node.height);
            nowSprite.spriteFrame = texture;
            nowSprite.node.setContentSize(oldSize);
        };

        if (ty.SystemInfo.imageDic[urlString]) {
            if (ty.SystemInfo.imageDic[urlString].texture) {
                // hall.LOGD(null, "缓存在这里缓存在这里缓存在这里缓存在这里缓存在这里");
                setOldSize(nowSprite, ty.SystemInfo.imageDic[urlString].texture);
            } else {
                if (ty.SystemInfo.imageDic[urlString].textureArray) {
                    ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
                } else {
                    ty.SystemInfo.imageDic[urlString].textureArray = [];
                    ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
                }
            }
        } else {
            ty.SystemInfo.imageDic[urlString] = {};
            ty.SystemInfo.imageDic[urlString].textureArray = [];
            ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
            if (ty.SystemInfo.imageDicArray.length >= ty.SystemInfo.mostImgCount) {
                var tempURL = ty.SystemInfo.imageDicArray[0];
                ty.SystemInfo.imageDic[tempURL] = null;
                delete ty.SystemInfo.imageDic[tempURL];
                ty.SystemInfo.imageDicArray.splice(0, 1);
            }
            ty.SystemInfo.imageDicArray.push(urlString);

            var _index = 0;
            var loadImage = function loadImage() {
                var txImage = wx.createImage();
                txImage.src = urlStr_2;
                txImage.onload = function (event) {
                    hall.LOGW("", "file = [SystemInfo] fun = [loadImage] 加载成功");
                    var texture = new cc.Texture2D();
                    texture.initWithElement(txImage);
                    texture.handleLoadedTexture();
                    ty.SystemInfo.imageDic[urlString].texture = new cc.SpriteFrame(texture);
                    var tempA = ty.SystemInfo.imageDic[urlString].textureArray;
                    for (var i = 0; i < tempA.length; i++) {
                        var sprit = tempA[i];
                        if (sprit) {
                            // hall.LOGD(null, "不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片");
                            setOldSize(sprit, ty.SystemInfo.imageDic[urlString].texture);
                        }
                    }
                };
                txImage.onerror = function (event) {
                    hall.LOGW("", "file = [SystemInfo] fun = [loadImage] 加载失败");
                    _index++;
                    if (_index < 4) {
                        ty.Timer.setTimer(cc.director, function () {
                            loadImage();
                        }, 1, 1, 0);
                    }
                };
            };

            loadImage();
        }
    }
};

cc._RF.pop();