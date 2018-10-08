
var crypto = require('crypto');

scratch.Share = {
    LAST_SHARE_TIME : "LAST_SHARE_TIME",//最后一次分享的时间
    // LAST_LOGIN_TIME : "LAST_LOGIN_TIME",//最后一次登录的时间
    SHARETICKETS_LIST : "SHARETICKETS_LIST",//今天的分享群聊信息集合

    MAIN_SHARE_COUNT : "MAIN_SHARE_COUNT",

    shareQuery : "",

    unSensitivePersonage : 0,//0、验证不同群,1、什么都不验证,2、验证群
    sharePoint : 0,
    shareType : "",

    isOnShare : false,
    shareTicket:"",
    resultType : 0,//1、不是群,2、重复群,3、正常

    shareWithType : function (type, successCallBackFun, failCallBackFun, testCfg) {
        // var shareMap = scratch.GameWorld.shareConfig;
        // if(!shareMap){
        //     return;
        // }
        var shareMap = scratch.GameWorld.shareConfig;
        if(!shareMap){
            hall.LoginToyoo();
            return;
        }
        var shareDetail = shareMap[type];

        var shareCfg = shareDetail[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail)];
        if (testCfg){
            //配置上线前测试准备
            shareCfg = testCfg;
        }

        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

        var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+shareCfg.shareSchemeId+"&inviteName="+ty.UserInfo.userName;
        if(shareDetail.query){
            scratch.Share.shareQuery = shareDetail.query;
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = query+"&"+queryString;
        }else {
            scratch.Share.shareQuery = "";
        }

        if(shareDetail.unSensitivePersonage){
            scratch.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        }else {
            scratch.Share.unSensitivePersonage = 0;
        }

        var shareImage = shareCfg.sharePicUrl;
        if(shareCfg.extraAdd && shareCfg.extraAdd.length && shareCfg.extraAdd.length > 0 ){
            var callBackF = function(imageUrl) {
                scratch.Share.shareImformation(type, shareCfg, shareTitle, imageUrl, query, shareCfg.sharePointId, successCallBackFun, failCallBackFun);
            };
            scratch.Share.getShareImageWithShareMap(0, shareCfg.extraAdd, shareImage, callBackF);
        }else {
            scratch.Share.shareImformation(type, shareCfg, shareTitle, shareImage, query, shareCfg.sharePointId, successCallBackFun, failCallBackFun);
        }
    },

    getShareImageWithShareMap : function (nowIndex, extraAdd, imageUrl, callBackF) {
        scratch.Share.isOnShare = true;
        var tempCavas = wx.createCanvas();
        tempCavas.width =  360;
        tempCavas.height =  288;

        var context = tempCavas.getContext("2d");
        var image = wx.createImage();
        image.src = imageUrl;

        image.onload = function (event) {
            var ima = event.target;
            context.drawImage(ima,0,0);
            var preTextWidth=0;
            var preTextHeight=0;
            var preX=0;
            var preY=0;
            while (nowIndex < extraAdd.length) {
                var extraMap = extraAdd[nowIndex];
                if (extraMap.type == "text") {
                    var textInformation = extraMap.textInformation;
                    var text = hall.GlobalFuncs.replaceKeyWordInString(textInformation.textformatString);
                    context.font = textInformation.fontSize + "px Arial";
                    if (textInformation.textColorRGB.indexOf('#') == -1){
                        textInformation.textColorRGB = "#" + textInformation.textColorRGB;
                    }
                    context.fillStyle = textInformation.textColorRGB;
                    context.textAlign = textInformation.textAlign.replace('middle','center');
                    var textX = parseInt(textInformation.originPointX);
                    if(textX < 0){
                        if(textX == -1){
                            textX = preX - preTextWidth/2;
                        }else if(textX == -2){
                            textX = preX + preTextWidth/2;
                        }
                    }
                    var textY = parseInt(textInformation.originPointY);
                    if (textY < 0){
                        if(textY == -1){
                            textY = preY - preTextHeight/2;
                        }if(textY == -2){
                            textY = preY + preTextHeight/2;
                        }
                    }
                    context.fillText(text,textX,textY);
                    preTextWidth = context.measureText(text).width;
                    preTextHeight = context.measureText(text).height;
                    preX = textX;
                    preY = textY;
                    nowIndex ++;
                }else if(extraMap.type == "image") {
                    var imageInformation = extraMap.imageInformation;
                    var sunImage = wx.createImage();
                    // sunImage.src = imageInformation.addImageUrl;
                    if(imageInformation.addImageUrl == "avatar"){
                        sunImage.src = ty.UserInfo.userPic;
                    }else {
                        sunImage.src = imageInformation.addImageUrl;
                    }

                    sunImage.originPointX = parseInt(imageInformation.originPointX);
                    sunImage.originPointY = parseInt(imageInformation.originPointY);
                    sunImage.sizeWidth = parseInt(imageInformation.sizeWidth);
                    sunImage.sizeHeight = parseInt(imageInformation.sizeHeight);
                    if(imageInformation.shape && imageInformation.shape == 2){
                        context.beginPath();
                        context.arc(sunImage.originPointX+sunImage.sizeWidth/2,sunImage.originPointY+sunImage.sizeHeight/2,sunImage.sizeWidth/2,0,2*Math.PI);
                        context.stroke();
                        context.clip();
                    }
                    sunImage.onload = function (event) {
                        var img = event.target;
                        context.drawImage(img,img.originPointX,img.originPointY,img.sizeWidth,img.sizeHeight);
                        var tempFilePath = tempCavas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: tempCavas.width,
                            height: tempCavas.height,
                            destWidth: tempCavas.width,
                            destHeight: tempCavas.height
                        });
                        if(callBackF) {
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
                        if(callBackF) {
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
            if(callBackF) {
                callBackF(tempFilePath);
            }
        };
        image.onerror = function (event) {
            var img = event.target;
            // hall.LOGW("==","============加载底图失败==========="+img.src);
        };
    },

    shareImformation : function (type, shareCfg, titleString, imageUrl, query, sharePoint, successCallBackFun, failCallBackFun) {
        scratch.Share.shareType = type;
        scratch.Share.sharePoint = sharePoint;
        scratch.Share.isOnShare = true;
        scratch.Share.resultType = 0;
        scratch.Share.shareTicket = "";

        // var sharePointId = shareCfg.sharePointId;
        var sharePointId = sharePoint;
        var shareSchemeId = shareCfg.shareSchemeId;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId, 1, shareSchemeId]);

        wx.shareAppMessage({
            title: titleString,
            imageUrl : imageUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (result) {
                hall.LOGE("shareAppMessage","===shareAppMessage==success=="+JSON.stringify(arguments)+"==="+query);
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId, 2, shareSchemeId]);
                if (successCallBackFun){
                    successCallBackFun(result);
                }
                if(!result.shareTickets || !result.shareTickets[0]){
                    scratch.Share.resultType = scratch.Share.ShareState.isNotAGroupChat;
                    scratch.Share.shareTicket = "";
                    return;
                }
                scratch.Share.shareTicket = result.shareTickets[0];
            },
            fail : function () {
                hall.LOGE("shareAppMessage","===shareAppMessage==fail=="+JSON.stringify(arguments)+"==="+query);
                if (failCallBackFun){
                    failCallBackFun();
                }
                scratch.Share.isMatchShare = false;
                scratch.Share.resultType = scratch.Share.ShareState.failToShare;
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
                // hall.LOGE("shareAppMessage","===shareAppMessage==complete=="+JSON.stringify(arguments));
            }
        });
    },

    playAnimationAfterShareWithType:function() {
        hall.LOGE("===","playAnimationAfterShareWithType=="+scratch.Share.unSensitivePersonage+"==="+scratch.Share.sharePoint);
        // hall.LOGW("","file = [Share] fun = [playAnimationAfterShareWithType] 111 ");
        if(scratch.Share.resultType == scratch.Share.ShareState.failToShare){
            ty.NotificationCenter.trigger(scratch.EventType.UPDATE_SHARE_STATE,scratch.Share.shareType);
            return;
        }

        if(!scratch.Share.unSensitivePersonage || scratch.Share.unSensitivePersonage == 0){
            this.endWithSuccessShare();
            return;
        }

        //没有分享到群,发送通知结果类型和分享类型通知(没有分享到微信群)
        if (!scratch.Share.shareTicket || scratch.Share.shareTicket == ""){
            scratch.Share.resultType = scratch.Share.ShareState.isNotAGroupChat;
            ty.NotificationCenter.trigger(scratch.EventType.UPDATE_SHARE_STATE,scratch.Share.shareType);
            return;
        }

        if(scratch.Share.unSensitivePersonage == 1){
            this.endWithSuccessShare();
            return;
        }

        if(scratch.Share.unSensitivePersonage == 2){
            //要验证群的处理
            try {
                wx.getShareInfo(
                    {
                        shareTicket :scratch.Share.shareTicket,
                        success : function (result) {
                            var shareKey;
                            if(!scratch.Share.sharePoint){
                                shareKey = scratch.Share.SharePointType.openCardCondition;
                                scratch.Share.getShareResultWithKey(result,shareKey);
                            }else {
                                shareKey = scratch.Share.sharePoint;
                                scratch.Share.getShareResultWithKey(result,shareKey);
                            }
                        },
                        fail : function () {
                            scratch.Share.resultType = scratch.Share.ShareState.failToGetShareTicket;
                            ty.NotificationCenter.trigger(scratch.EventType.UPDATE_SHARE_STATE,scratch.Share.shareType);
                        },
                        complete : function () {
                        }
                    }
                );
            }catch (err){
                hall.LOGE("error:", "scratch.Share.unSensitivePersonage——" + JSON.stringify(err));
            }

        }
    },

    getShareResultWithKey : function (result,shareKey) {
        hall.LOGW("","file = [Share] fun = [getShareResultWithKey]  "+result.toString()+"==="+shareKey);
        var iv = result.iv ;
        var encryptedData = result.encryptedData;
        var reultString = scratch.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(scratch.Share.LAST_SHARE_TIME, "");

        var shareTicketsDic = {};
        if(toDay != lastShareTime){
            shareTicketsDic[shareKey] = [openGId];
            hall.GlobalFuncs.setInLocalStorage(scratch.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(scratch.Share.LAST_SHARE_TIME, toDay);
        }else {
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(scratch.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if(shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length){
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1){
                    scratch.Share.resultType = scratch.Share.ShareState.repetitionGroupChat;
                    ty.NotificationCenter.trigger(scratch.EventType.UPDATE_SHARE_STATE,scratch.Share.shareType);
                    hall.LOGW("getShareResultWithKey","UPDATE_SHARE_STATE  ==="+scratch.Share.shareType);
                    scratch.Share.shareTicket = "";
                    return;
                }
                shareList.push(openGId);
                hall.GlobalFuncs.setInLocalStorage(scratch.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }else {
                shareTicketsDic[shareKey] = [openGId];
                hall.GlobalFuncs.setInLocalStorage(scratch.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }
        }
        this.endWithSuccessShare();
    },

    endWithSuccessShare : function () {
        hall.LOGW("","file = [Share] fun = [endWithSuccessShare] scratch.Share.sharePoint = " + scratch.Share.sharePoint);
        scratch.Share.resultType = scratch.Share.ShareState.suscessShare;
        // if(scratch.Share.shareType != scratch.Share.onShareType.clickStatShareTypeRevial &&
        //     scratch.Share.sharePoint > 10000){
        //     // scratch.gameModel.shareToGetreward(scratch.Share.sharePoint);
        // }
        ty.NotificationCenter.trigger(scratch.EventType.UPDATE_SHARE_STATE,scratch.Share.shareType);
    },

    getOpenGid:function(shareTicket,_boxUserId){
        var _openGid = "";
        var encryFunc = function(result){
            var iv = result.iv ;
            var encryptedData = result.encryptedData;
            var reultString = scratch.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
            // hall.LOGW("","file = [Share] fun = [getShareResultWithKey] reultString = "+JSON.stringify(reultString));
            // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
            var informationMap = JSON.parse(reultString);
            var openGId = informationMap.openGId;
            _openGid = openGId;
            var _boxID = "";
            if (ty.SystemInfo.boxId && ty.SystemInfo.boxId != "") {
                _boxID = ty.SystemInfo.boxId;
            }else if (ty.SystemInfo.mysteryGiftBagBoxId && ty.SystemInfo.mysteryGiftBagBoxId != "") {
                _boxID = ty.SystemInfo.mysteryGiftBagBoxId;
            }

            // scratch.gameModel.getBoxReward(parseInt(_boxUserId),_boxID,_openGid);
            hall.LOGW("","file = [Share] fun = [getOpenGid] ty.SystemInfo.boxId = "+JSON.stringify(ty.SystemInfo.boxId));
            hall.LOGW("","file = [Share] fun = [getOpenGid] _openGid = "+JSON.stringify(_openGid));
            hall.LOGW("","file = [Share] fun = [getOpenGid] _boxID = " + JSON.stringify(_boxID));
        };

        wx.getShareInfo(
            {
                shareTicket :shareTicket,
                success : function (result) {
                    encryFunc(result);
                },
                fail : function () {

                    var _boxID = "";
                    if (ty.SystemInfo.boxId && ty.SystemInfo.boxId != "") {
                        _boxID = ty.SystemInfo.boxId;
                    }else if (ty.SystemInfo.mysteryGiftBagBoxId && ty.SystemInfo.mysteryGiftBagBoxId != "") {
                        _boxID = ty.SystemInfo.mysteryGiftBagBoxId;
                    }
                    // scratch.gameModel.getBoxReward(parseInt(_boxUserId),_boxID,_openGid);
                    hall.LOGW("","file = [Share] fun = [getOpenGid] fail  _boxID = " + _boxID);
                },
                complete : function () {
                }
            }
        );

    },

    decrypt :function(key, iv, crypted) {
        crypted = new Buffer(crypted, 'base64');
        iv = new Buffer(iv, 'base64');
        key = new Buffer(key, 'base64');
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    },

    onShareType :{
        weixinthreepointshare : "weixinthreepointshare", //微信分享
        maincardclickshare : "maincardclickshare",
        unbsgsmaincardclick : "unbsgsmaincardclick",
        cardawardshare : "cardawardshare", //获得奖励弹窗分享
        luckyzhuanpanshare : "luckyzhuanpanshare", //转盘分享
        goldcoininvitenewfriends : "goldcoininvitenewfriends", //邀请得金币
        jdcardexchangeshare : "jdcardexchangeshare", //邀请好友兑换
        tixianRMBshare : "tixianRMBshare", //提现成功
        jdcardgetsuccessedshare : "jdcardgetsuccessedshare", //兑换成功
        cardshareunlock : "cardshareunlock", //分享到群解锁卡片
        unbsgscardshareunlock : "unbsgscardshareunlock" //非北上广深分享到群解锁卡片

    },
    clickStatShareType :{
        weixinthreepointshare : 626, //微信分享
        maincardclickshare : 647,
        cardawardshare : 648,
        luckyzhuanpanshare : 649,
        goldcoininvitenewfriends : 650,
        jdcardexchangeshare : 651,
        tixianRMBshare : 652,
        jdcardgetsuccessedshare : 653,
        unbsgsmaincardclick : 690,
        cardshareunlock : 701, //分享到群解锁卡片
        unbsgscardshareunlock : 702 //非北上广深分享到群解锁卡片

    },

    SharePointType:{
        watchVideoToGetChip : 10900001, //看视频得金币
        openCardCondition : 647 //解锁卡片
    },
    
    shareKeywordReplace :{
        tixianrmb : "0",
        jdcardrmb : "0"
    },
    ShareState:{
        isNotAGroupChat : 1,   //不是群聊
        repetitionGroupChat : 2,  //重复群聊
        suscessShare : 3, //正常分享
        exShare : 4,
        failToGetShareTicket : 5,
        failToShare : 6,
        userInfoError : 7,
        shareError : 8
    }
};

wx.onShareAppMessage(function (result) {
    var type = scratch.Share.onShareType.weixinthreepointshare;
    var shareMap = scratch.GameWorld.shareConfig;
    if(!shareMap){
        return;
    }
    var shareDetail = shareMap[type];

    var shareCfg = shareDetail[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail)];
    var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

    var imageUrl = shareCfg.sharePicUrl;
    var sharePointId = shareCfg.sharePointId;
    var shareSchemeId = shareCfg.shareSchemeId;

    var query;
    if(shareDetail.query){
        var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
        query = "inviteCode=" + ty.UserInfo.userId+"&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName + "&" + queryString;
    }else {
        query = "inviteCode=" + ty.UserInfo.userId+"&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName;
    }

    scratch.Share.shareType = type;
    scratch.Share.sharePoint = sharePointId;
    scratch.Share.isOnShare = true;
    scratch.Share.resultType = 0;
    scratch.Share.shareTicket = "";
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId, 1, shareSchemeId]);

    return {
        title: shareTitle,
        imageUrl:imageUrl,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets,groupMsgInfos) {
            // hall.LOGE("onShareAppMessage","===onShareAppMessage==success=="+JSON.stringify(arguments)+"==="+query);
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId , 2, shareSchemeId]);
        },
        fail : function () {
            // hall.LOGE("onShareAppMessage","===onShareAppMessage==fail=="+JSON.stringify(arguments)+"==="+query);
        },
        complete : function () {
            // hall.LOGE("onShareAppMessage","===onShareAppMessage==complete=="+JSON.stringify(arguments)+"==="+query);
        }
    }
});

wx.showShareMenu({
    withShareTicket: true
});

