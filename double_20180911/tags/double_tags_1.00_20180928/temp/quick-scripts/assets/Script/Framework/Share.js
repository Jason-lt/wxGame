(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Framework/Share.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2d3834c6XVBmbt4j7A41PFd', 'Share', __filename);
// Script/Framework/Share.js

"use strict";

var crypto = require('crypto');

double.Share = {
    LAST_SHARE_TIME: "LAST_SHARE_TIME", //最后一次分享的时间
    // LAST_LOGIN_TIME : "LAST_LOGIN_TIME",//最后一次登录的时间
    SHARETICKETS_LIST: "SHARETICKETS_LIST", //今天的分享群聊信息集合
    shareQuery: "",

    unSensitivePersonage: 0, //0、验证不同群,1、什么都不验证,2、验证群
    sharePoint: 0,
    shareType: "",

    isOnShare: false,
    shareTicket: "",
    resultType: 0, //1、不是群,2、重复群,3、正常

    shareWithType: function shareWithType(type, successCallBackFun, failCallBackFun, testCfg) {
        // var shareMap = double.GameWorld.shareConfig;
        // if(!shareMap){
        //     return;
        // }
        var shareMap = double.GameWorld.shareConfig;
        if (!shareMap) {
            hall.LoginToyoo();
            return;
        }
        var shareDetail = shareMap[type];

        var shareCfg = shareDetail.list[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail.list)];
        if (testCfg) {
            //配置上线前测试准备
            shareCfg = testCfg;
        }

        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

        var query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + shareCfg.shareSchemeId + "&inviteName=" + ty.UserInfo.userName;
        if (shareDetail.query) {
            double.Share.shareQuery = shareDetail.query;
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = query + "&" + queryString;
        } else {
            double.Share.shareQuery = "";
        }

        if (shareDetail.unSensitivePersonage) {
            double.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        } else {
            double.Share.unSensitivePersonage = 0;
        }

        var shareImage = shareCfg.sharePicUrl;
        if (shareCfg.extraAdd && shareCfg.extraAdd.length && shareCfg.extraAdd.length > 0) {
            var callBackF = function callBackF(imageUrl) {
                double.Share.shareImformation(type, shareCfg, shareTitle, imageUrl, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
            };
            double.Share.getShareImageWithShareMap(0, shareCfg.extraAdd, shareImage, callBackF);
        } else {
            double.Share.shareImformation(type, shareCfg, shareTitle, shareImage, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
        }
    },

    getShareImageWithShareMap: function getShareImageWithShareMap(nowIndex, extraAdd, imageUrl, callBackF) {
        double.Share.isOnShare = true;
        var tempCavas = wx.createCanvas();
        tempCavas.width = 360;
        tempCavas.height = 288;

        var context = tempCavas.getContext("2d");
        var image = wx.createImage();
        image.src = imageUrl;

        image.onload = function (event) {
            var ima = event.target;
            context.drawImage(ima, 0, 0);
            var preTextWidth = 0;
            var preTextHeight = 0;
            var preX = 0;
            var preY = 0;
            while (nowIndex < extraAdd.length) {
                var extraMap = extraAdd[nowIndex];
                if (extraMap.type == "text") {
                    var textInformation = extraMap.textInformation;
                    var text = hall.GlobalFuncs.replaceKeyWordInString(textInformation.textformatString);
                    context.font = textInformation.fontSize + "px Arial";
                    if (textInformation.textColorRGB.indexOf('#') == -1) {
                        textInformation.textColorRGB = "#" + textInformation.textColorRGB;
                    }
                    context.fillStyle = textInformation.textColorRGB;
                    context.textAlign = textInformation.textAlign.replace('middle', 'center');
                    var textX = parseInt(textInformation.originPointX);
                    if (textX < 0) {
                        if (textX == -1) {
                            textX = preX - preTextWidth / 2;
                        } else if (textX == -2) {
                            textX = preX + preTextWidth / 2;
                        }
                    }
                    var textY = parseInt(textInformation.originPointY);
                    if (textY < 0) {
                        if (textY == -1) {
                            textY = preY - preTextHeight / 2;
                        }if (textY == -2) {
                            textY = preY + preTextHeight / 2;
                        }
                    }
                    context.fillText(text, textX, textY);
                    preTextWidth = context.measureText(text).width;
                    preTextHeight = context.measureText(text).height;
                    preX = textX;
                    preY = textY;
                    nowIndex++;
                } else if (extraMap.type == "image") {
                    var imageInformation = extraMap.imageInformation;
                    var sunImage = wx.createImage();
                    // sunImage.src = imageInformation.addImageUrl;
                    if (imageInformation.addImageUrl == "avatar") {
                        sunImage.src = ty.UserInfo.userPic;
                    } else {
                        sunImage.src = imageInformation.addImageUrl;
                    }

                    sunImage.originPointX = parseInt(imageInformation.originPointX);
                    sunImage.originPointY = parseInt(imageInformation.originPointY);
                    sunImage.sizeWidth = parseInt(imageInformation.sizeWidth);
                    sunImage.sizeHeight = parseInt(imageInformation.sizeHeight);
                    if (imageInformation.shape && imageInformation.shape == 2) {
                        context.beginPath();
                        context.arc(sunImage.originPointX + sunImage.sizeWidth / 2, sunImage.originPointY + sunImage.sizeHeight / 2, sunImage.sizeWidth / 2, 0, 2 * Math.PI);
                        context.stroke();
                        context.clip();
                    }
                    sunImage.onload = function (event) {
                        var img = event.target;
                        context.drawImage(img, img.originPointX, img.originPointY, img.sizeWidth, img.sizeHeight);
                        var tempFilePath = tempCavas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: tempCavas.width,
                            height: tempCavas.height,
                            destWidth: tempCavas.width,
                            destHeight: tempCavas.height
                        });
                        if (callBackF) {
                            callBackF(tempFilePath);
                        }
                    };
                    sunImage.onerror = function (event) {
                        var img = event.target;
                        // hall.LOGW("==","============加载头像失败==========="+sunImage.src+"===="+imageInformation.addImageUrl+"====");
                        var tempFilePath = tempCavas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: tempCavas.width,
                            height: tempCavas.height,
                            destWidth: tempCavas.width,
                            destHeight: tempCavas.height
                        });
                        if (callBackF) {
                            callBackF(tempFilePath);
                        }
                    };
                    return;
                }
            }
            var tempFilePath = tempCavas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: tempCavas.width,
                height: tempCavas.height,
                destWidth: tempCavas.width,
                destHeight: tempCavas.height
            });
            if (callBackF) {
                callBackF(tempFilePath);
            }
        };
        image.onerror = function (event) {
            var img = event.target;
            // hall.LOGW("==","============加载底图失败==========="+img.src);
        };
    },

    shareImformation: function shareImformation(type, shareCfg, titleString, imageUrl, query, sharePoint, successCallBackFun, failCallBackFun) {
        double.Share.shareType = type;
        double.Share.sharePoint = sharePoint;
        double.Share.isOnShare = true;
        double.Share.resultType = 0;
        double.Share.shareTicket = "";

        // var sharePointId = shareCfg.sharePointId;
        var sharePointId = double.Share.clickStatShareType[type];
        var shareSchemeId = shareCfg.shareSchemeId;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 1, shareSchemeId]);

        wx.shareAppMessage({
            title: titleString,
            imageUrl: imageUrl, //5:4
            query: query, //'key1=val1&key2=val2',
            success: function success(result) {
                hall.LOGE("shareAppMessage", "===shareAppMessage==success==" + JSON.stringify(arguments) + "===" + query);
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 2, shareSchemeId]);
                if (successCallBackFun) {
                    successCallBackFun(result);
                }
                if (!result.shareTickets || !result.shareTickets[0]) {
                    double.Share.resultType = double.Share.ShareState.isNotAGroupChat;
                    double.Share.shareTicket = "";
                    return;
                }
                double.Share.shareTicket = result.shareTickets[0];
            },
            fail: function fail() {
                hall.LOGE("shareAppMessage", "===shareAppMessage==fail==" + JSON.stringify(arguments) + "===" + query);
                if (failCallBackFun) {
                    failCallBackFun();
                }
                double.Share.isMatchShare = false;
                double.Share.resultType = double.Share.ShareState.failToShare;
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete: function complete() {
                // hall.LOGE("shareAppMessage","===shareAppMessage==complete=="+JSON.stringify(arguments));
            }
        });
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType() {
        hall.LOGE("===", "playAnimationAfterShareWithType==" + double.Share.sharePoint);
        // hall.LOGW("","file = [Share] fun = [playAnimationAfterShareWithType] 111 ");
        if (double.Share.resultType == double.Share.ShareState.failToShare) {
            ty.NotificationCenter.trigger(double.EventType.UPDATE_SHARE_STATE, double.Share.shareType);
            return;
        }

        //直接跳转排行榜
        if (double.Share.shareType == double.Share.onShareType.clickStatShareTypeRankList) {
            if (double.Share.shareTicket && double.Share.shareTicket != "") {
                double.GlobalFuncs.showRankList(double.Share.shareTicket);
                double.Share.shareType = "";
                double.Share.resultType = 0;
                return;
            }
        }

        if (!double.Share.unSensitivePersonage || double.Share.unSensitivePersonage == 1) {
            this.endWithSuccessShare();
            return;
        }

        if (!double.GameWorld.gunnerShareSchemeConfig) {
            double.Share.shareType = double.Share.ShareState.shareError;
            // this.endWithSuccessShare();
            ty.NotificationCenter.trigger(double.EventType.UPDATE_SHARE_STATE, double.Share.shareType);
            return;
        }

        //没有分享到群,发送通知结果类型和分享类型通知(没有分享到微信群)
        if (!double.Share.shareTicket || double.Share.shareTicket == "") {
            double.Share.resultType = double.Share.ShareState.isNotAGroupChat;
            ty.NotificationCenter.trigger(double.EventType.UPDATE_SHARE_STATE, double.Share.shareType);
            return;
        }

        //分享点只验证群,好友
        if (double.Share.unSensitivePersonage == 2) {
            //要验证群的处理
            try {
                wx.getShareInfo({
                    shareTicket: double.Share.shareTicket,
                    success: function success(result) {
                        var shareKey;
                        if (double.Share.shareType == double.Share.onShareType.clickStatShareTypeRevial) {
                            shareKey = "resurgence";
                            double.Share.getShareResultWithKey(result, shareKey);
                        } else {
                            shareKey = double.Share.sharePoint + "";
                            double.Share.getShareResultWithKey(result, shareKey);
                        }
                    },
                    fail: function fail() {
                        double.Share.resultType = double.Share.ShareState.failToGetShareTicket;
                        ty.NotificationCenter.trigger(double.EventType.UPDATE_SHARE_STATE, double.Share.shareType);
                    },
                    complete: function complete() {}
                });
            } catch (err) {
                hall.LOGE("error:", "double.Share.unSensitivePersonage——" + JSON.stringify(err));
            }
        }
    },

    getShareResultWithKey: function getShareResultWithKey(result, shareKey) {
        hall.LOGW("", "file = [Share] fun = [getShareResultWithKey]  " + result.toString() + "===" + shareKey);
        var iv = result.iv;
        var encryptedData = result.encryptedData;
        var reultString = double.Share.decrypt(ty.UserInfo.wxgame_session_key, iv, encryptedData);
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(double.Share.LAST_SHARE_TIME, "");

        var shareTicketsDic = {};
        if (toDay != lastShareTime) {
            shareTicketsDic[shareKey] = [openGId];
            hall.GlobalFuncs.setInLocalStorage(double.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(double.Share.LAST_SHARE_TIME, toDay);
        } else {
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(double.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if (shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length) {
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1) {
                    double.Share.resultType = double.Share.ShareState.repetitionGroupChat;
                    ty.NotificationCenter.trigger(double.EventType.UPDATE_SHARE_STATE, double.Share.shareType);
                    hall.LOGW("getShareResultWithKey", "UPDATE_SHARE_STATE  ===" + double.Share.shareType);
                    double.Share.shareTicket = "";
                    return;
                }
                shareList.push(openGId);
                hall.GlobalFuncs.setInLocalStorage(double.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            } else {
                shareTicketsDic[shareKey] = [openGId];
                hall.GlobalFuncs.setInLocalStorage(double.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }
        }
        this.endWithSuccessShare();
    },

    endWithSuccessShare: function endWithSuccessShare() {
        hall.LOGW("", "file = [Share] fun = [endWithSuccessShare] double.Share.sharePoint = " + double.Share.sharePoint);
        double.Share.resultType = double.Share.ShareState.suscessShare;
        if (double.Share.shareType != double.Share.onShareType.clickStatShareTypeRevial && double.Share.sharePoint > 10000) {
            // double.gameModel.shareToGetreward(double.Share.sharePoint);
        }
        ty.NotificationCenter.trigger(double.EventType.UPDATE_SHARE_STATE, double.Share.shareType);
    },

    getOpenGid: function getOpenGid(shareTicket, _boxUserId) {
        var _openGid = "";
        var encryFunc = function encryFunc(result) {
            var iv = result.iv;
            var encryptedData = result.encryptedData;
            var reultString = double.Share.decrypt(ty.UserInfo.wxgame_session_key, iv, encryptedData);
            // hall.LOGW("","file = [Share] fun = [getShareResultWithKey] reultString = "+JSON.stringify(reultString));
            // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
            var informationMap = JSON.parse(reultString);
            var openGId = informationMap.openGId;
            _openGid = openGId;
            var _boxID = "";
            if (ty.SystemInfo.boxId && ty.SystemInfo.boxId != "") {
                _boxID = ty.SystemInfo.boxId;
            } else if (ty.SystemInfo.mysteryGiftBagBoxId && ty.SystemInfo.mysteryGiftBagBoxId != "") {
                _boxID = ty.SystemInfo.mysteryGiftBagBoxId;
            }

            // double.gameModel.getBoxReward(parseInt(_boxUserId),_boxID,_openGid);
            hall.LOGW("", "file = [Share] fun = [getOpenGid] ty.SystemInfo.boxId = " + JSON.stringify(ty.SystemInfo.boxId));
            hall.LOGW("", "file = [Share] fun = [getOpenGid] _openGid = " + JSON.stringify(_openGid));
            hall.LOGW("", "file = [Share] fun = [getOpenGid] _boxID = " + JSON.stringify(_boxID));
        };

        wx.getShareInfo({
            shareTicket: shareTicket,
            success: function success(result) {
                encryFunc(result);
            },
            fail: function fail() {

                var _boxID = "";
                if (ty.SystemInfo.boxId && ty.SystemInfo.boxId != "") {
                    _boxID = ty.SystemInfo.boxId;
                } else if (ty.SystemInfo.mysteryGiftBagBoxId && ty.SystemInfo.mysteryGiftBagBoxId != "") {
                    _boxID = ty.SystemInfo.mysteryGiftBagBoxId;
                }
                // double.gameModel.getBoxReward(parseInt(_boxUserId),_boxID,_openGid);
                hall.LOGW("", "file = [Share] fun = [getOpenGid] fail  _boxID = " + _boxID);
            },
            complete: function complete() {}
        });
    },

    decrypt: function decrypt(key, iv, crypted) {
        crypted = new Buffer(crypted, 'base64');
        iv = new Buffer(iv, 'base64');
        key = new Buffer(key, 'base64');
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    },

    onShareType: {

        clickStatShareTypeMysteryGiftBag: "clickStatShareTypeMysteryGiftBag", //神秘礼包
        clickStatShareTypeScore: "clickStatShareTypeScore", //炫耀最佳成绩
        clickStatShareTypeLight: "clickStatShareTypeLight", //激光瞄准器
        clickStatShareTypeBullet: "clickStatShareTypeBullet", //无限子弹
        clickStatShareTypeGrenade: "clickStatShareTypeGrenade", //手榴弹
        clickStatShareTypeShareButton: "clickStatShareTypeShareButton", //微信分享按钮
        clickStatShareTypeDiamond: "clickStatShareTypeDiamond", //互助礼邀请群友复活卡
        clickStatShareTypeRankList: "clickStatShareTypeRankList", //查看群排行
        clickStatShareTypeRevial: "clickStatShareTypeRevial", //复活
        clickStatShareTypeBulletGetReward: "clickStatShareTypeBulletGetReward", //分享无限子弹道具
        clickStatShareTypeLightGetReward: "clickStatShareTypeLightGetReward", //分享激光道具
        clickStatShareTypeGrenadeGetReward: "clickStatShareTypeGrenadeGetReward", //分享手榴弹
        clickStatShareTypeMysteryGiftBagGetReward: "clickStatShareTypeMysteryGiftBagGetReward", //分享的钻石

        clickStatShareTypeAddBullet: "clickStatShareTypeAddBullet", //游戏内分享得子弹
        clickStatShareTypeOpenSecretBoxB: "clickStatShareTypeOpenSecretBoxB", //开启神秘宝箱北上广深
        clickStatShareTypeOpenSecretBoxN: "clickStatShareTypeOpenSecretBoxN", //开启神秘宝箱北上广深

        clickStatShareTypeComboContinue: "clickStatShareTypeComboContinue" //分享续连击

    },
    clickStatShareType: {
        clickStatShareTypeMysteryGiftBag: "214", //神秘礼包北上广深
        clickStatShareTypeScore: "213", //炫耀最佳成绩
        clickStatShareTypeLight: "212", //激光瞄准器
        clickStatShareTypeBullet: "211", //无限子弹
        clickStatShareTypeGrenade: "217", //手榴弹
        clickStatShareTypeShareButton: "208", //微信分享按钮
        clickStatShareTypeDiamond: "210", //互助礼邀请群友复活卡
        clickStatShareTypeRankList: "209", //查看群排行
        clickStatShareTypeRevial: "207", //复活
        clickStatShareTypeBulletGetReward: "206", //分享无限子弹道具
        clickStatShareTypeLightGetReward: "205", //分享激光道具
        clickStatShareTypeGrenadeGetReward: "216", //分享手榴弹
        clickStatShareTypeMysteryGiftBagGetReward: "204", //神秘礼包非北上广深

        clickStatShareTypeAddBullet: "203", //游戏内分享得子弹
        clickStatShareTypeOpenSecretBoxB: "202", //开启神秘宝箱北上广深
        clickStatShareTypeOpenSecretBoxN: "201", //开启神秘宝箱非北上广深

        clickStatShareTypeComboContinue: "215" //分享续连击
    },

    SharePointType: {
        getBullet: 10600001, //获取无限子弹道具
        getLaser: 10600002, //获取激光道具
        getDiamond: 10600003, //获取钻石
        shareResurgence: 10600004, //复活
        getGrenade: 10600005, //获取手榴弹

        getFreeTool: 10600006
    },

    shareKeywordReplace: {
        boxId: "",
        mysteryGiftBagBoxId: "",
        theScoreForNow: "",
        bestRank: "",
        bestScoreForSelf: 0,
        nickName: ""
    },
    ShareState: {
        isNotAGroupChat: 1, //不是群聊
        repetitionGroupChat: 2, //重复群聊
        suscessShare: 3, //正常分享
        exShare: 4,
        failToGetShareTicket: 5,
        failToShare: 6,
        userInfoError: 7,
        shareError: 8
    }
};

wx.onShareAppMessage(function (result) {
    var type = double.Share.onShareType.clickStatShareTypeShareButton;
    var shareMap = double.GameWorld.shareConfig;
    if (!shareMap) {
        return;
    }
    var shareDetail = shareMap[type];

    var shareCfg = shareDetail.list[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail.list)];
    var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

    var imageUrl = shareCfg.sharePicUrl;
    var sharePointId = shareCfg.sharePointId;
    var shareSchemeId = shareCfg.shareSchemeId;

    var query;
    if (shareDetail.query) {
        var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
        query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName + "&" + queryString;
    } else {
        query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName;
    }

    double.Share.shareType = type;
    double.Share.sharePoint = shareDetail.sharePoint;
    double.Share.isOnShare = true;
    double.Share.resultType = 0;
    double.Share.shareTicket = "";
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 1, shareSchemeId]);

    return {
        title: shareTitle,
        imageUrl: imageUrl,
        query: query, //'key1=val1&key2=val2',
        success: function success(shareTickets, groupMsgInfos) {
            hall.LOGE("onShareAppMessage", "===onShareAppMessage==success==" + JSON.stringify(arguments) + "===" + query);
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 2, shareSchemeId]);
        },
        fail: function fail() {
            hall.LOGE("onShareAppMessage", "===onShareAppMessage==fail==" + JSON.stringify(arguments) + "===" + query);
        },
        complete: function complete() {
            // hall.LOGE("onShareAppMessage","===onShareAppMessage==complete=="+JSON.stringify(arguments)+"==="+query);
        }
    };
});

wx.showShareMenu({
    withShareTicket: true
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
        //# sourceMappingURL=Share.js.map
        