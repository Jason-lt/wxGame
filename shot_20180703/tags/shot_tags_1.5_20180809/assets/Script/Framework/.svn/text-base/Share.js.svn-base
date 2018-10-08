
var crypto = require('crypto');

shot.Share = {
    LAST_SHARE_TIME : "LAST_SHARE_TIME",//最后一次分享的时间
    // LAST_LOGIN_TIME : "LAST_LOGIN_TIME",//最后一次登录的时间
    SHARETICKETS_LIST : "SHARETICKETS_LIST",//今天的分享群聊信息集合
    shareQuery : "",

    unSensitivePersonage : 0,//0、验证不同群,1、什么都不验证,2、验证群
    sharePoint : 0,
    shareType : "",

    isOnShare : false,
    shareTicket:"",
    resultType : 0,//1、不是群,2、重复群,3、正常

    shareWithType : function (type, successCallBackFun, failCallBackFun, testCfg) {
        // var shareMap = shot.GameWorld.shareConfig;
        // if(!shareMap){
        //     return;
        // }
        var shareMap = shot.GameWorld.shareConfig;
        if(!shareMap){
            hall.LoginToyoo();
            return;
        }
        var shareDetail = shareMap[type];

        var shareCfg = shareDetail.list[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail.list)];
        if (testCfg){
            //配置上线前测试准备
            shareCfg = testCfg;
        }

        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

        var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+shareCfg.shareSchemeId+"&inviteName="+ty.UserInfo.userName;
        if(shareDetail.query){
            shot.Share.shareQuery = shareDetail.query;
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = query+"&"+queryString;
        }else {
            shot.Share.shareQuery = "";
        }

        if(shareDetail.unSensitivePersonage){
            shot.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        }else {
            shot.Share.unSensitivePersonage = 0;
        }

        var shareImage = shareCfg.sharePicUrl;
        if(shareCfg.extraAdd && shareCfg.extraAdd.length && shareCfg.extraAdd.length > 0 ){
            var callBackF = function(imageUrl) {
                shot.Share.shareImformation(type, shareCfg, shareTitle, imageUrl, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
            };
            shot.Share.getShareImageWithShareMap(0, shareCfg.extraAdd, shareImage, callBackF);
        }else {
            shot.Share.shareImformation(type, shareCfg, shareTitle, shareImage, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
        }
    },

    getShareImageWithShareMap : function (nowIndex, extraAdd, imageUrl, callBackF) {
        shot.Share.isOnShare = true;
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
        shot.Share.shareType = type;
        shot.Share.sharePoint = sharePoint;
        shot.Share.isOnShare = true;
        shot.Share.resultType = 0;
        shot.Share.shareTicket = "";

        // var sharePointId = shareCfg.sharePointId;
        var sharePointId = shot.Share.clickStatShareType[type];
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
                    shot.Share.resultType = shot.Share.ShareState.isNotAGroupChat;
                    shot.Share.shareTicket = "";
                    return;
                }
                shot.Share.shareTicket = result.shareTickets[0];
            },
            fail : function () {
                hall.LOGE("shareAppMessage","===shareAppMessage==fail=="+JSON.stringify(arguments)+"==="+query);
                if (failCallBackFun){
                    failCallBackFun();
                }
                shot.Share.isMatchShare = false;
                shot.Share.resultType = shot.Share.ShareState.failToShare;
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
                // hall.LOGE("shareAppMessage","===shareAppMessage==complete=="+JSON.stringify(arguments));
            }
        });
    },

    playAnimationAfterShareWithType:function() {
        hall.LOGE("===","playAnimationAfterShareWithType=="+shot.Share.sharePoint);
        hall.LOGW("","file = [Share] fun = [playAnimationAfterShareWithType] 111 ");
        if(shot.Share.resultType == shot.Share.ShareState.failToShare){
            ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE,shot.Share.shareType);
            return;
        }

        //直接跳转排行榜
        if(shot.Share.shareType == shot.Share.onShareType.clickStatShareTypeRankList){
            if(shot.Share.shareTicket && shot.Share.shareTicket != ""){
                shot.GlobalFuncs.showRankList(shot.Share.shareTicket);
                shot.Share.shareType = "";
                shot.Share.resultType = 0;
                return;
            }
        }

        if(!shot.Share.unSensitivePersonage || shot.Share.unSensitivePersonage == 1){
            this.endWithSuccessShare();
            return;
        }

        if (!shot.GameWorld.gunnerShareSchemeConfig) {
            shot.Share.shareType = shot.Share.ShareState.shareError;
            // this.endWithSuccessShare();
            ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE,shot.Share.shareType);
            return
        }

        //没有分享到群,发送通知结果类型和分享类型通知(没有分享到微信群)
        if (!shot.Share.shareTicket || shot.Share.shareTicket == ""){
            shot.Share.resultType = shot.Share.ShareState.isNotAGroupChat;
            ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE,shot.Share.shareType);
            return;
        }

        //分享点只验证群,好友
        if(shot.Share.unSensitivePersonage == 2){
            //要验证群的处理
            try {
                wx.getShareInfo(
                    {
                        shareTicket :shot.Share.shareTicket,
                        success : function (result) {
                            var shareKey;
                            if(shot.Share.shareType == shot.Share.onShareType.clickStatShareTypeRevial){
                                shareKey = "resurgence";
                                shot.Share.getShareResultWithKey(result,shareKey);
                            }else {
                                shareKey = shot.Share.sharePoint +"";
                                shot.Share.getShareResultWithKey(result,shareKey);
                            }
                        },
                        fail : function () {
                            shot.Share.resultType = shot.Share.ShareState.failToGetShareTicket;
                            ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE,shot.Share.shareType);
                        },
                        complete : function () {
                        }
                    }
                );
            }catch (err){
                hall.LOGE("error:", "shot.Share.unSensitivePersonage——" + JSON.stringify(err));
            }

        }
    },

    getShareResultWithKey : function (result,shareKey) {
        hall.LOGW("","file = [Share] fun = [getShareResultWithKey]  "+result.toString()+"==="+shareKey);
        var iv = result.iv ;
        var encryptedData = result.encryptedData;
        var reultString = shot.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(shot.Share.LAST_SHARE_TIME, "");

        var shareTicketsDic = {};
        if(toDay != lastShareTime){
            shareTicketsDic[shareKey] = [openGId];
            hall.GlobalFuncs.setInLocalStorage(shot.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(shot.Share.LAST_SHARE_TIME, toDay);
        }else {
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(shot.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if(shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length){
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1){
                    shot.Share.resultType = shot.Share.ShareState.repetitionGroupChat;
                    ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE,shot.Share.shareType);
                    hall.LOGW("getShareResultWithKey","UPDATE_SHARE_STATE  ==="+shot.Share.shareType);
                    shot.Share.shareTicket = "";
                    return;
                }
                shareList.push(openGId);
                hall.GlobalFuncs.setInLocalStorage(shot.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }else {
                shareTicketsDic[shareKey] = [openGId];
                hall.GlobalFuncs.setInLocalStorage(shot.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }
        }
        this.endWithSuccessShare();
    },

    endWithSuccessShare : function () {
        hall.LOGW("","file = [Share] fun = [endWithSuccessShare] shot.Share.sharePoint = " + shot.Share.sharePoint);
        shot.Share.resultType = shot.Share.ShareState.suscessShare;
        if(shot.Share.shareType != shot.Share.onShareType.clickStatShareTypeRevial &&
            shot.Share.sharePoint > 10000){
            shot.gameModel.shareToGetreward(shot.Share.sharePoint);
        }
        ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE,shot.Share.shareType);
    },

    getOpenGid:function(shareTicket,_boxUserId){
        var _openGid = "";
        var encryFunc = function(result){
            var iv = result.iv ;
            var encryptedData = result.encryptedData;
            var reultString = shot.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
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

            shot.gameModel.getBoxReward(parseInt(_boxUserId),_boxID,_openGid);
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
                    shot.gameModel.getBoxReward(parseInt(_boxUserId),_boxID,_openGid);
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

        clickStatShareTypeMysteryGiftBag:"clickStatShareTypeMysteryGiftBag",//神秘礼包
        clickStatShareTypeScore : "clickStatShareTypeScore",//炫耀最佳成绩
        clickStatShareTypeLight : "clickStatShareTypeLight",//激光瞄准器
        clickStatShareTypeBullet : "clickStatShareTypeBullet",//无限子弹
        clickStatShareTypeGrenade : "clickStatShareTypeGrenade",//手榴弹
        clickStatShareTypeShareButton : "clickStatShareTypeShareButton",//微信分享按钮
        clickStatShareTypeDiamond : "clickStatShareTypeDiamond",//互助礼邀请群友复活卡
        clickStatShareTypeRankList : "clickStatShareTypeRankList",//查看群排行
        clickStatShareTypeRevial : "clickStatShareTypeRevial",//复活
        clickStatShareTypeBulletGetReward : "clickStatShareTypeBulletGetReward", //分享无限子弹道具
        clickStatShareTypeLightGetReward : "clickStatShareTypeLightGetReward", //分享激光道具
        clickStatShareTypeGrenadeGetReward : "clickStatShareTypeGrenadeGetReward", //分享手榴弹
        clickStatShareTypeMysteryGiftBagGetReward : "clickStatShareTypeMysteryGiftBagGetReward", //分享的钻石

        clickStatShareTypeAddBullet : "clickStatShareTypeAddBullet", //游戏内分享得子弹
        clickStatShareTypeOpenSecretBoxB : "clickStatShareTypeOpenSecretBoxB", //开启神秘宝箱北上广深
        clickStatShareTypeOpenSecretBoxN : "clickStatShareTypeOpenSecretBoxN", //开启神秘宝箱北上广深

        clickStatShareTypeComboContinue : "clickStatShareTypeComboContinue" //分享续连击

    },
    clickStatShareType :{
        clickStatShareTypeMysteryGiftBag:"214",//神秘礼包北上广深
        clickStatShareTypeScore : "213",//炫耀最佳成绩
        clickStatShareTypeLight : "212",//激光瞄准器
        clickStatShareTypeBullet : "211",//无限子弹
        clickStatShareTypeGrenade : "217", //手榴弹
        clickStatShareTypeShareButton : "208",//微信分享按钮
        clickStatShareTypeDiamond : "210",//互助礼邀请群友复活卡
        clickStatShareTypeRankList : "209",//查看群排行
        clickStatShareTypeRevial : "207",//复活
        clickStatShareTypeBulletGetReward : "206",//分享无限子弹道具
        clickStatShareTypeLightGetReward : "205",//分享激光道具
        clickStatShareTypeGrenadeGetReward : "216", //分享手榴弹
        clickStatShareTypeMysteryGiftBagGetReward : "204",//神秘礼包非北上广深

        clickStatShareTypeAddBullet : "203", //游戏内分享得子弹
        clickStatShareTypeOpenSecretBoxB : "202", //开启神秘宝箱北上广深
        clickStatShareTypeOpenSecretBoxN : "201", //开启神秘宝箱非北上广深

        clickStatShareTypeComboContinue : "215" //分享续连击
    },

    SharePointType:{
        getBullet: 10600001,  //获取无限子弹道具
        getLaser: 10600002,  //获取激光道具
        getDiamond: 10600003,  //获取钻石
        shareResurgence: 10600004,  //复活
        getGrenade: 10600005  //获取手榴弹
    },
    
    shareKeywordReplace :{
        boxId :"",
        mysteryGiftBagBoxId :"",
        theScoreForNow : "",
        bestRank : "",
        bestScoreForSelf : 0,
        nickName :""
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
    var type = shot.Share.onShareType.clickStatShareTypeShareButton;
    var shareMap = shot.GameWorld.shareConfig;
    if(!shareMap){
        return;
    }
    var shareDetail = shareMap[type];

    var shareCfg = shareDetail.list[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail.list)];
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

    shot.Share.shareType = type;
    shot.Share.sharePoint = shareDetail.sharePoint;
    shot.Share.isOnShare = true;
    shot.Share.resultType = 0;
    shot.Share.shareTicket = "";
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId, 1, shareSchemeId]);

    return {
        title: shareTitle,
        imageUrl:imageUrl,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets,groupMsgInfos) {
            hall.LOGE("onShareAppMessage","===onShareAppMessage==success=="+JSON.stringify(arguments)+"==="+query);
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId , 2, shareSchemeId]);
        },
        fail : function () {
            hall.LOGE("onShareAppMessage","===onShareAppMessage==fail=="+JSON.stringify(arguments)+"==="+query);
        },
        complete : function () {
            hall.LOGE("onShareAppMessage","===onShareAppMessage==complete=="+JSON.stringify(arguments)+"==="+query);
        }
    }
});

wx.showShareMenu({
    withShareTicket: true
});

