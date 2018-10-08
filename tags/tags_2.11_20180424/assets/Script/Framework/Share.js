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
    LAST_SHARE_TIME : "LAST_SHARE_TIME",//最后一次分享的时间
    LAST_LOGIN_TIME : "LAST_LOGIN_TIME",//最后一次登录的时间
    SHARETICKETS_LIST : "SHARETICKETS_LIST",//今天的分享群聊信息集合

    resultType : 0,//1、不是群,2、重复群,3、正常
    isOnShare : false,
    sharePoint : 0,
    shareType : "",
    // shareCount : 0,
    shareTicket:"",

    shareWithType : function (type, successCallBackFun, failCallBackFun) {
        var shareMap = ddz.gameModel.shareConfig;
        if(!shareMap){
            shareMap = ddz.GameWorld.shareConfig.share;
        }
        var shareDetail = shareMap[type];
        var massageList = shareDetail.massageList;
        var massageMap = massageList[hall.GlobalFuncs.getRandomNumberBefore(massageList.length)];
        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
        var imageList = shareDetail.imageList;
        var imageMap = imageList[hall.GlobalFuncs.getRandomNumberBefore(imageList.length)];

        if(massageMap.focusImage && massageMap.focusImage.length &&  massageMap.focusImage.length > 0){
            var index = massageMap.focusImage[hall.GlobalFuncs.getRandomNumberBefore(massageMap.focusImage.length)];
            imageMap = imageList[index];
        }

        var query;
        if(shareDetail.query){
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName+"&"+queryString;
        }else {
            query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type+"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
        }

        var shareImage = ty.SystemInfo.cdnPath + imageMap.imageUrl;
        if(imageMap.extraAdd && imageMap.extraAdd.length && imageMap.extraAdd.length > 0 ){
            var callBackF = function(imageUrl) {
                ddz.Share.shareImformation(type, imageMap.imageType, shareTitle, imageUrl, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
            };
            ddz.Share.getShareImageWithShareMap(0,imageMap,shareImage,callBackF);
        }else {
            ddz.Share.shareImformation(type, imageMap.imageType, shareTitle, shareImage, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
        }
    },

    getShareImageWithShareMap : function (nowIndex,imageMap,imageUrl,callBackF) {
        var tempCavas = wx.createCanvas();
        tempCavas.width = imageMap.sizeWith || 360;
        tempCavas.height = imageMap.sizeHeight || 288;
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
            while (nowIndex < imageMap.extraAdd.length) {
                var extraMap = imageMap.extraAdd[nowIndex];
                if (extraMap.type == "text") {
                    var textInformation = extraMap.textInformation;
                    var text = hall.GlobalFuncs.replaceKeyWordInString(textInformation.textformatString);
                    context.font = textInformation.fontSize + "px Arial";
                    context.fillStyle = textInformation.textColorRGB;
                    context.textAlign = textInformation.textAlign;
                    var textX = textInformation.originPointX;
                    if(textX < 0){
                        if(textX == -1){
                            textX = preX - preTextWidth/2;
                        }else if(textX == -2){
                            textX = preX + preTextWidth/2;
                        }
                    }
                    var textY = textInformation.originPointY;
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
                    var image = wx.createImage();
                    image.src = imageInformation.addImageUrl;
                    image.originPointX = imageInformation.originPointX;
                    image.originPointY = imageInformation.originPointY;
                    image.onload = function (event) {
                        var img = event.target;
                        context.drawImage(img,img.originPointX,img.originPointY);
                        var tempFilePath = tempCavas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: imageMap.sizeWith || 360,
                            height: imageMap.sizeHeight || 288,
                            destWidth: imageMap.sizeWith || 360,
                            destHeight: imageMap.sizeHeight || 288
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
                width: imageMap.sizeWith || 360,
                height: imageMap.sizeHeight || 288,
                destWidth: imageMap.sizeWith || 360,
                destHeight: imageMap.sizeHeight || 288
            });
            if(callBackF) {
                callBackF(tempFilePath);
            }
        };
    },

    shareImformation : function (type,imageType,titleString, imagUrl,query,sharePoint,successCallBackFun,failCallBackFun) {
        ddz.Share.resultType = 0;
        ddz.Share.shareTicket = "";
        ddz.Share.shareType = type;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeOnClickButton,
            [type,imageType,"share",ty.SystemInfo.gameId]);
        if(type == ddz.Share.clickStatShareType.clickStatShareTypeInviteFriend){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendClick,
                [ddz.Share.shareKeywordReplace.inviteFriendID]);
        }
        ddz.Share.isOnShare = true;
        wx.shareAppMessage({
            title: titleString,
            imageUrl : imagUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (result) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareSuccess,
                    [type,imageType,"share",ty.SystemInfo.gameId]);
                if(type == ddz.Share.clickStatShareType.clickStatShareTypeInviteFriend){
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendSuccess,
                        [ddz.Share.shareKeywordReplace.inviteFriendID]);
                }
                ddz.Share.sharePoint = sharePoint;
                if (successCallBackFun){
                    successCallBackFun(result);
                }
                hall.LOGD(null, "shareAppMessage+++++++++++++++++"+JSON.stringify(result));
                if(!result.shareTickets || !result.shareTickets[0]){
                    ddz.Share.resultType = ddz.Share.ShareState.isNotAGroupChat;
                    ddz.Share.shareTicket = "";
                    return;
                }
                ddz.Share.shareTicket = result.shareTickets[0];
            },
            fail : function () {
                if (failCallBackFun){
                    failCallBackFun();
                }
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
            }
        });
    },

    shareResults:function (winloses) {
        ddz.Share.resultType = 0;
        ddz.Share.shareTicket = "";
        var shareMap = ddz.gameModel.shareConfig;
        if(!shareMap){
            shareMap = ddz.GameWorld.shareConfig.share;
        }
        ddz.Share.shareType = ddz.Share.clickStatShareType.clickStatShareTypeShareResults;
        var shareDetail = shareMap[ddz.Share.clickStatShareType.clickStatShareTypeShareResults];
        var massageList = shareDetail.massageList;
        var massageMap = massageList[hall.GlobalFuncs.getRandomNumberBefore(massageList.length)];
        var titleString = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
        var imageList = shareDetail.imageList;
        var imageMap = imageList[hall.GlobalFuncs.getRandomNumberBefore(imageList.length)];

        var type = ddz.Share.clickStatShareType.clickStatShareTypeShareResults;

        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 360;
        tempCanvas.height = 288;
        var context = tempCanvas.getContext("2d");
        var callBack = function () {
            var tempFilePath = tempCanvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: 360,
                height:288,
                destWidth: 360,
                destHeight: 288
            });
            var query;
            if(shareDetail.query){
                var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
                query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName+"&"+queryString;
            }else {
                query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type+"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
            }
            ddz.Share.shareImformation(ddz.Share.clickStatShareType.clickStatShareTypeShareResults,
            "resultImage",titleString,tempFilePath,query);
            // hall.LOGE("","==========tempFilePath================"+tempFilePath);
        };
        var image = wx.createImage();
        image.src = ty.SystemInfo.cdnPath + imageMap.imageUrl;
        var avatars = ddz.detailsModel.avatars;
        var nicknNames = ddz.detailsModel.nickNames;
        var scores = ddz.detailsModel.sumScores;

        // 分享出去分数排序,从高到底
        var _info = [];
        for (var i = 0;i < 3; i++){
            var player_info = {};
            player_info.avatar = avatars[i];
            player_info.nicknName = nicknNames[i];
            player_info.score = scores[i];
            _info.push(player_info);
        }

        _info.sort(function(a, b) {
            return b.score - a.score;
        });
        hall.LOGE("","==========分享排序================"+JSON.stringify(_info));
        image.onload = function (event) {
            // var imageD = event.target;
            context.drawImage(image,0,0);
            context.font = "25px Arial";
            var imageIndex = 0;
            for (var j = 0; j < 3; j ++){
                var height = 70 + j * 72;
                context.fillStyle = "#202020";
                context.textAlign = "left";

                if(_info[j].nicknName){
                    context.fillText(hall.GlobalFuncs.SliceStringToLength(_info[j].nicknName,6),150,height);
                }else {
                    context.fillText("你的好友",150,height);
                }
                if (_info[j].score >  0){
                    context.fillStyle = "#fd5051";
                }else {
                    context.fillStyle = "#1593c1";
                }
                context.textAlign = "right";
                context.fillText(_info[j].score+"分",325,height);
                var avatarImage = wx.createImage();
                if(_info[j].avatar){
                    avatarImage.src = _info[j].avatar;
                }else {
                    avatarImage.src = "res/raw-assets/resources/table/nopack/ddz_avatar_default.png";
                }
                avatarImage.toY = 35+ j *72;
                avatarImage.onload = function (event) {
                    var img = event.target;
                    context.drawImage(img,85,img.toY,50,50);
                    imageIndex ++;
                    if(imageIndex >= 3){
                        callBack();
                    }
                };
            }
        };
    },

    getShareTicketInformation : function (result) {
        // if(ddz.Share.sharePoint != ddz.Share.SharePointType.userGroup &&
        //     ddz.Share.sharePoint != ddz.Share.SharePointType.firstFail &&
        //     ddz.Share.sharePoint != ddz.Share.SharePointType.lottery){ //钻石主页分享到群
        //     ddz.Share.sharePoint = 0;
        //     return;
        // }
        var shareKey = ddz.Share.sharePoint +"";
        var iv = result.iv ;
        var encryptedData = result.encryptedData;
        var reultString = ddz.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;

        // var toDay = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.TODAY_TIME, "");
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_SHARE_TIME, "");

        var shareTickets = {};
        if(toDay != lastShareTime){
            shareTickets[shareKey] = [openGId];
            // ddz.Share.shareCount = 1;
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTickets));
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.LAST_SHARE_TIME, toDay);
        }else {
            shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.SHARETICKETS_LIST, "");
            var nowShareMap = JSON.parse(shareTickets);
            if(nowShareMap && nowShareMap[shareKey] && nowShareMap[shareKey].length){
                var shareList = nowShareMap[shareKey];
                // if(shareList.length >= 300){
                //     ddz.Share.shareCount = 3;
                //     ddz.Share.resultType = ddz.Share.ShareState.exShare;
                //     ddz.Share.sharePoint = 0;
                //     return;
                //     //TODO: 今日分享群已达上限
                // }else {
                    if (shareList.indexOf(openGId) > -1){
                        // ddz.Share.shareCount = shareList.length;
                        ddz.Share.resultType = ddz.Share.ShareState.repetitionGroupChat;
                        ddz.Share.shareTicket = "";
                        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
                        return;
                    }
                    shareList.push(openGId);
                    hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(nowShareMap));
                // }
            }else {
                nowShareMap[shareKey] = [openGId];
                hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(nowShareMap));
            }
        }
        ddz.gameModel.shareToGetreward(ddz.Share.sharePoint);
        ddz.Share.resultType = ddz.Share.ShareState.suscessShare;
        ddz.Share.shareTicket = "";
        ddz.Share.sharePoint = 0;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
        hall.LOGE("","====reultStringopenGId====="+openGId);
    },

    playAnimationAfterShareWithType : function () {
        if (!ddz.Share.shareTicket){
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
            return;
        }
        wx.getShareInfo(
            {
                shareTicket :ddz.Share.shareTicket,
                success : function (result) {
                    hall.LOGE("","====getShareInfo=success====="+JSON.stringify(arguments));
                    ddz.Share.getShareTicketInformation(result);
                },
                fail : function () {
                    hall.LOGE("","====getShareInfo=fail====="+JSON.stringify(arguments));
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

    clickStatShareType :{
        clickStatShareTypeMainTips : "clickStatShareTypeMainTips",//首页奖励弹窗分享
        clickStatShareTypeCongratulation : "clickStatShareTypeCongratulation",//恭喜通关
        clickStatShareTypeWithDraw : "clickStatShareTypeWithDraw",//提现成功
        clickStatShareCash : "clickStatShareCash",//提现成功
        clickStatShareTypeShareButton : "clickStatShareTypeShareButton",//微信分享按钮
        clickStatShareTypeRankList : "clickStatShareTypeRankList",//查看群排行榜
        clickStatShareTypeGetDiamondFail : "clickStatShareTypeGetDiamondFail",//邀请得钻石(闯关失败)
        clickStatShareTypeGetDiamondHall : "clickStatShareTypeGetDiamondHall",//邀请得钻石(钻石主页分享到群)
        clickStatShareTypeInviteFriend : "clickStatShareTypeInviteFriend", //邀请好友进桌(好友桌)
        clickStatShareTypeShareResults : "clickStatShareTypeShareResults",//分享战绩
        clickStatShareTypeRevial : "clickStatShareTypeRevial"//每日首次失败分享复活
    },

    shareKeywordReplace :{
        "wechatName":"。",//微信昵称
        // 比赛场
        "allWinnerCount":"0",//当前通关人数
        "bonusTotal":"0",      //平分奖励金额
        "withDrawMoney":"0",//提现金额
        "lastWinnerCount":"0",//自己上次通关人次
        "lastBonusOnly":"0",//自己上次获得奖励
        "curWinnerCount":"0",//自己本次次通关人次
        "curBonusOnly":"0",//自己本次获得奖励
        //好友桌
        "inviteFriendID":"10001",//好友桌邀请好友进桌房间ID
        "totalRound":0, //总局数
        "displayName":"经典",//玩法选择
        "goodCard":"标准"//发牌模式
    },

    SharePointType:{
        lottery : 67890000,   //开奖分享
        firstFail : 67890001,  //首败
        userGroup : 67890002,   //分享到三个群
        tongGuan : 67890003,   //通关后分享
        redPacket : 67890004,   //提现后分享
    },
    ShareState:{
        isNotAGroupChat : 1,   //不是群聊
        repetitionGroupChat : 2,  //重复群聊
        suscessShare : 3, //正常分享
        exShare : 4
    }
};

wx.onShareAppMessage(function (result) {
    var type = ddz.Share.clickStatShareType.clickStatShareTypeShareButton;
    ddz.Share.shareType = type;
    var shareDetail = ddz.GameWorld.shareConfig.share.clickStatShareTypeShareButton;
    var titleA = shareDetail.massageList;
    var massageMap = titleA[hall.GlobalFuncs.getRandomNumberBefore(titleA.length)];
    var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
    var imageArray = shareDetail.imageList;
    var imageMap ;
    if(massageMap.focusImage && massageMap.focusImage.length > 0){
        var imgIndex = massageMap.focusImage[hall.GlobalFuncs.getRandomNumberBefore(massageMap.focusImage.length)];
        imageMap = imageArray[imgIndex];
    }else {
        imageMap = imageArray[hall.GlobalFuncs.getRandomNumberBefore(imageArray.length)];
    }
    var imageUrl = ty.SystemInfo.cdnPath+ imageMap.imageUrl;

    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeOnClickButton,
        [type,imageMap.imageType,"share",ty.SystemInfo.gameId]);

    var query;
    if(shareDetail.query){
        var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
        query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName+"&"+queryString;
    }else {
        query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type+"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
    }

    ddz.Share.isOnShare = true;

    return {
        title: shareTitle,
        imageUrl:imageUrl,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets,groupMsgInfos) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareSuccess,
                [type, imageMap.imageType,"share",ty.SystemInfo.gameId]);
            hall.LOGD(null, "onShareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets));
        },
        fail : function () {
            hall.LOGD(null, JSON.stringify(arguments));
        },
        complete : function () {
        }
    }
});