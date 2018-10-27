(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Framework/Share.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ee0fdYHP2JCGoKMaD5jMG7p', 'Share', __filename);
// Script/Framework/Share.js

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
var crypto = require('crypto');

ddz.Share = {
    LAST_SHARE_TIME: "LAST_SHARE_TIME", //最后一次分享的时间
    LAST_LOGIN_TIME: "LAST_LOGIN_TIME", //最后一次登录的时间
    SHARETICKETS_LIST: "SHARETICKETS_LIST", //今天的分享群聊信息集合
    LAST_SHARE_TIMELIST: "LAST_SHARE_TIMELIST", //分享日期数组
    YESTERDAY_SHARE_NUMBER: "YESTERDAY_SHARE_NUMBER", //昨天分享次数
    shareQuery: "",

    unSensitivePersonage: 0, //0、验证不同群,1、什么都不验证,2、验证群
    sharePoint: 0,
    shareType: "",

    isOnShare: false,
    isMatchShare: false,
    shareTicket: "",
    shareTime: "", //点击分享时间
    resultType: 0, //1、不是群,2、重复群,3、正常

    shareWithType: function shareWithType(type, successCallBackFun, failCallBackFun, testCfg) {
        if (type == ddz.Share.onShareType.clickStatShareTypeRevial) {
            ddz.Share.isMatchShare = true;
        }
        var shareMap = ddz.gameModel.shareConfig;
        if (!shareMap) {
            //TODO:取不到分享配置信息
            shareMap = ddz.gameConfig.shareConfig;
        }
        if (!shareMap) {
            return;
        }
        var shareDetail = shareMap[type];

        // var shareCfg = shareDetail[hall.GlobalFuncs.getRandomNumberBefore(shareDetail.length)];
        var shareCfg = shareDetail[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail)];

        if (testCfg) {
            //配置上线前测试准备
            shareCfg = testCfg;
        }

        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

        var query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + shareCfg.shareSchemeId + "&inviteName=" + ty.UserInfo.userName;
        if (shareDetail.query) {
            ddz.Share.shareQuery = shareDetail.query;
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = query + "&" + queryString;
        } else {
            ddz.Share.shareQuery = "";
        }

        if (shareDetail.unSensitivePersonage) {
            ddz.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        } else {
            ddz.Share.unSensitivePersonage = 0;
        }

        var shareImage = shareCfg.sharePicUrl;
        if (shareCfg.extraAdd && shareCfg.extraAdd.length && shareCfg.extraAdd.length > 0) {
            var callBackF = function callBackF(imageUrl) {
                ddz.Share.shareImformation(type, shareCfg, shareTitle, imageUrl, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
            };
            ddz.Share.getShareImageWithShareMap(0, shareCfg.extraAdd, shareImage, callBackF);
        } else {
            ddz.Share.shareImformation(type, shareCfg, shareTitle, shareImage, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
        }
    },

    getShareImageWithShareMap: function getShareImageWithShareMap(nowIndex, extraAdd, imageUrl, callBackF) {

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
                        hall.LOGW("==", "============加载头像失败===========" + sunImage.src + "====" + imageInformation.addImageUrl + "====");
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
            hall.LOGW("==", "============加载底图失败===========" + img.src);
        };
    },

    shareImformation: function shareImformation(type, shareCfg, titleString, imageUrl, query, sharePoint, successCallBackFun, failCallBackFun) {
        ddz.Share.shareType = type;
        ddz.Share.sharePoint = sharePoint;
        ddz.Share.isOnShare = true;
        ddz.Share.resultType = 0;
        ddz.Share.shareTicket = "";
        ddz.Share.shareTime = new Date().getTime();
        var sharePointId = shareCfg.sharePointId;
        var shareSchemeId = shareCfg.shareSchemeId;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 1, shareSchemeId]);

        wx.shareAppMessage({
            title: titleString,
            imageUrl: imageUrl, //5:4
            query: query, //'key1=val1&key2=val2',
            success: function success(result) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 2, shareSchemeId]);

                if (successCallBackFun) {
                    successCallBackFun(result);
                }
                hall.LOGW(null, "shareAppMessage+++++++++++++++++" + JSON.stringify(result));
                if (!result.shareTickets || !result.shareTickets[0]) {
                    ddz.Share.resultType = ddz.Share.ShareState.isNotAGroupChat;
                    ddz.Share.shareTicket = "";
                    return;
                }
                ddz.Share.shareTicket = result.shareTickets[0];
            },
            fail: function fail() {
                if (failCallBackFun) {
                    failCallBackFun();
                }
                ddz.Share.isMatchShare = false;
                ddz.Share.resultType = ddz.Share.ShareState.failToShare;
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete: function complete() {}
        });
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType() {
        hall.LOGW("", "file = [Share] fun = [playAnimationAfterShareWithType]");

        if (ddz.Share.shareTime) {
            var _time = new Date().getTime();
            var _interval = ddz.gameConfig.shareInterval;
            if (parseInt(_time / 1000) - parseInt(ddz.Share.shareTime / 1000) >= _interval) {
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE, ddz.Share.shareType);
                ddz.Share.shareType = "";
                ddz.Share.resultType = 0;
            }
        }

        // //要验证群的处理
        // wx.getShareInfo(
        //     {
        //         shareTicket :ddz.Share.shareTicket,
        //         success : function (result) {
        //             var shareKey;
        //             if(ddz.Share.shareType == ddz.Share.onShareType.clickStatShareTypeRevial){
        //                 shareKey = ddz.matchModel.revivalShareKey;
        //                 ddz.Share.getShareResultWithKey(result,shareKey);
        //             }else {
        //                 shareKey = ddz.Share.sharePoint +"";
        //                 ddz.Share.getShareResultWithKey(result,shareKey);
        //             }
        //         },
        //         fail : function () {
        //             ddz.Share.resultType = ddz.Share.ShareState.failToGetShareTicket;
        //             // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
        //             hall.LOGE("","====getShareInfo=fail====="+JSON.stringify(arguments));
        //         },
        //         complete : function () {
        //         }
        //     }
        // );
    },

    getShareResultWithKey: function getShareResultWithKey(result, shareKey) {
        // var shareKey = ddz.Share.sharePoint +"";get_box_reward
        var iv = result.iv;
        var encryptedData = result.encryptedData;
        var reultString = ddz.Share.decrypt(ty.UserInfo.wxgame_session_key, iv, encryptedData);
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_SHARE_TIME, "");
        var shareNumber = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 0);

        var shareTicketsDic = {};
        if (toDay != lastShareTime) {
            shareTicketsDic[shareKey] = [openGId];
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.LAST_SHARE_TIME, toDay);
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 1);
        } else {
            shareNumber++;
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, shareNumber);
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if (shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length) {
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1) {
                    ddz.Share.resultType = ddz.Share.ShareState.repetitionGroupChat;
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE, ddz.Share.shareType);
                    ddz.Share.shareTicket = "";
                    return;
                }
                shareList.push(openGId);
                hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            } else {
                shareTicketsDic[shareKey] = [openGId];
                hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }
        }
        this.endWithSuccessShare();
    },

    getOpenGid: function getOpenGid(shareTicket, _boxUserId) {

        var _openGid = "";

        var encryFunc = function encryFunc(result) {
            var iv = result.iv;
            var encryptedData = result.encryptedData;
            var reultString = ddz.Share.decrypt(ty.UserInfo.wxgame_session_key, iv, encryptedData);
            // hall.LOGW("","file = [Share] fun = [getShareResultWithKey] reultString = "+JSON.stringify(reultString));
            // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
            var informationMap = JSON.parse(reultString);
            var openGId = informationMap.openGId;
            _openGid = openGId;
            if (!ddz.gameModel.isBringVersion) {
                ddz.gameModel.getBoxReward(parseInt(_boxUserId), ty.SystemInfo.treasureID, _openGid);
            }

            hall.LOGW("", "file = [Share] fun = [getOpenGid] _openGid = " + JSON.stringify(_openGid));
        };

        wx.getShareInfo({
            shareTicket: shareTicket,
            success: function success(result) {
                encryFunc(result);
            },
            fail: function fail() {
                hall.LOGW("", "file = [Share] fun = [getOpenGid] fail ");
                if (!ddz.gameModel.isBringVersion) {
                    ddz.gameModel.getBoxReward(parseInt(_boxUserId), ty.SystemInfo.treasureID, _openGid);
                }
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

    endWithSuccessShare: function endWithSuccessShare() {
        ddz.Share.resultType = ddz.Share.ShareState.sucessShare;
        if (ddz.Share.shareType != ddz.Share.onShareType.clickStatShareTypeRevial) {}
        // ddz.gameModel.shareToGetreward(ddz.Share.sharePoint);

        // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
    },

    onShareType: {
        clickStatShareTypeShareButton: "100", //微信分享按钮 转发
        clickStatShareTypeShareJiPaiQi: "101", //记牌器分享
        clickStatShareTypeRestart: "102", //重新发牌分享
        clickStatShareTypeGoldDoubleHalve: "103", //金币翻倍减半

        clickStatShareTypeRankList: "0000", //查看群排行榜  预占位
        clickStatShareTypeRevial: "0000" //每日首次失败分享复活

    },

    clickStatShareType: {
        clickStatShareTypeShareButton: "100", //微信分享按钮 转发
        clickStatShareTypeShareJiPaiQi: "101", //记牌器分享
        clickStatShareTypeRestart: "102", //重新发牌分享
        clickStatShareTypeGoldDoubleHalve: "103", //金币翻倍减半

        clickStatShareTypeRankList: "0000", //查看群排行榜  预占位
        clickStatShareTypeRevial: "0000" //每日首次失败分享复活

    },

    shareKeywordReplace: {
        "wechatName": "。", //微信昵称
        // 比赛场
        "withDrawMoney": "0", //提现金额
        "curBonusOnlyChip": "0", //自己本次获得奖励兑换金币
        "selfTotalBonus": 0, //个人所得总奖励
        "selfAllWinnerCount": 0, //个人全部通关次数
        //好友桌
        "inviteFriendID": "10001", //好友桌邀请好友进桌房间ID
        "totalRound": 0, //总局数
        "displayName": "经典", //玩法选择
        "goodCard": "标准", //发牌模式
        //金币场分享
        "goldWinReward": "0", //金币场赢取奖励while
        "surpassPercent": 0, //超越比例
        //arena比赛场分享
        "arenaWinRewardMoney": "0", //arena比赛赢取奖励金钱
        "arenaWinRewardChip": "0", //arena比赛赢取奖励金币
        "arenaRanking": 0, //arena比赛名次
        //复活弹窗
        "repeatNumber": 1,
        "stageIndex": 1,
        "hadNumber": 0,
        "diamondPicture": "<img src='dda_button_diamond' height=34 width=42/>",
        "redDiamondPicture": "<img src='ddz_diamond_red' height=34 width=42/>",
        "coinPicture": "<img src='ddz_main_chip' height=48 width=48/>"
    },

    SharePointType: {
        firstFail: 67890001, //首败
        userGroup: 67890002, //分享到三个群
        tongGuan: 67890003, //通关后分享
        redPacket: 67890003, //提现后分享
        arenaPoint1: 67890005, //比赛1的分享点
        arenaPoint2: 67890006, //比赛2的分享点
        arenaPoint3: 67890007, //比赛3的分享点
        arenaPoint4: 67890008, //比赛4的分享点
        gongZhongHaoCard: 67890009, //公众号会话卡片
        gongZhongHaoMenu: 67890010, //公众号自定义菜单
        lottery: 67890003, //发奖分享,
        alms: 67890013, //救济金
        firstWithDraw: 67890012, //首次提现
        withChip: 67890003, //发奖金币弹窗分享
        getRedPacket: 67890015, //分享领取红包
        boxShare: 67890016, //宝箱分享
        shareFriend: 67890017, //首页邀请好友
        customsSuccess: 67890018, //闯关成功分享
        failSix: 67890003, //第六关闯关失败
        firstUseJiPaiQi: 67890020, //首次送记牌器match_back
        adGetJiPaiQi: 67890021, //看广告领取记牌器
        getDayFirstLogin: 67890022, //看广告领取记牌器
        failDiamond: 67890023, //闯关失败求助得钻石
        skipCustom: 67890024, //跳关
        addApplet: 67890025, //加入小程序
        failWindw: 67890026, //闯关失败重新闯关弹窗分享点
        mainRestart: 67890027 //首页重新闯关弹窗分享点
    },

    ShareState: {
        isNotAGroupChat: 1, //不是群聊
        repetitionGroupChat: 2, //重复群聊
        sucessShare: 3, //正常分享
        exShare: 4,
        failToGetShareTicket: 5,
        failToShare: 6
    }
};

wx.onShareAppMessage(function (result) {
    var type = ddz.Share.onShareType.clickStatShareTypeShareButton;
    var shareMap = ddz.gameModel.shareConfig;
    if (!shareMap) {
        //TODO:取不到分享配置信息
        return;
    }

    var shareDetail = shareMap.clickStatShareTypeShareButton;

    var shareCfg = shareDetail[hall.GlobalFuncs.getRandomNumberBefore(shareDetail.length)];
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

    if (shareDetail.unSensitivePersonage) {
        ddz.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
    } else {
        ddz.Share.unSensitivePersonage = 0;
    }

    ddz.Share.shareType = type;
    ddz.Share.sharePoint = shareDetail.sharePoint;
    ddz.Share.isOnShare = true;
    ddz.Share.resultType = 0;
    ddz.Share.shareTicket = "";
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 1, shareSchemeId]);

    return {
        title: shareTitle,
        imageUrl: imageUrl,
        query: query, //'key1=val1&key2=val2',
        success: function success(shareTickets, groupMsgInfos) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [sharePointId, 2, shareSchemeId]);
            hall.LOGD(null, "onShareAppMessage+++++++++++++++++" + JSON.stringify(shareTickets));
        },
        fail: function fail() {
            hall.LOGD(null, JSON.stringify(arguments));
        },
        complete: function complete() {}
    };
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
        