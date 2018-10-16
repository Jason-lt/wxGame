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
    LAST_SHARE_TIMELIST : "LAST_SHARE_TIMELIST",//分享日期数组
    YESTERDAY_SHARE_NUMBER : "YESTERDAY_SHARE_NUMBER",//昨天分享次数
    shareQuery : "",

    unSensitivePersonage : 0,//0、验证不同群,1、什么都不验证,2、验证群
    sharePoint : 0,
    shareType : "",

    isOnShare : false,
    isMatchShare : false,
    shareTicket:"",
    resultType : 0,//1、不是群,2、重复群,3、正常

    shareWithType : function (type, successCallBackFun, failCallBackFun, testCfg) {
        if(type == ddz.Share.onShareType.clickStatShareTypeRevial){
            ddz.Share.isMatchShare = true;
        }
        var shareMap = ddz.gameModel.shareConfig;
        if(!shareMap){
            //TODO:取不到分享配置信息
            return;
            // shareMap = ddz.Share.shareConfig.share;
        }
        var shareDetail = shareMap[type];

        // var shareCfg = shareDetail[hall.GlobalFuncs.getRandomNumberBefore(shareDetail.length)];
        var shareCfg = shareDetail[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail)];

        if (testCfg){
            //配置上线前测试准备
            shareCfg = testCfg;
        }

        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

        var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+shareCfg.shareSchemeId+"&inviteName="+ty.UserInfo.userName;
        if(shareDetail.query){
            ddz.Share.shareQuery = shareDetail.query;
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = query+"&"+queryString;
        }else {
            ddz.Share.shareQuery = "";
        }

        if(shareDetail.unSensitivePersonage){
            ddz.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        }else {
            ddz.Share.unSensitivePersonage = 0;
        }

        var shareImage = shareCfg.sharePicUrl;
        if(shareCfg.extraAdd && shareCfg.extraAdd.length && shareCfg.extraAdd.length > 0 ){
            var callBackF = function(imageUrl) {
                ddz.Share.shareImformation(type, shareCfg, shareTitle, imageUrl, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
            };
            ddz.Share.getShareImageWithShareMap(0, shareCfg.extraAdd, shareImage, callBackF);
        }else {
            ddz.Share.shareImformation(type, shareCfg, shareTitle, shareImage, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
        }
    },

    getShareImageWithShareMap : function (nowIndex, extraAdd, imageUrl, callBackF) {

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
                        hall.LOGW("==","============加载头像失败==========="+sunImage.src+"===="+imageInformation.addImageUrl+"====");
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
            hall.LOGW("==","============加载底图失败==========="+img.src);
        };
    },

    shareImformation : function (type, shareCfg, titleString, imageUrl, query, sharePoint, successCallBackFun, failCallBackFun) {
        ddz.Share.shareType = type;
        ddz.Share.sharePoint = sharePoint;
        ddz.Share.isOnShare = true;
        ddz.Share.resultType = 0;
        ddz.Share.shareTicket = "";

        var sharePointId = shareCfg.sharePointId;
        var shareSchemeId = shareCfg.shareSchemeId;

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId, 1, shareSchemeId]);

        if(type == ddz.Share.onShareType.clickStatShareTypeInviteFriend){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendClick,
                [ddz.Share.shareKeywordReplace.inviteFriendID]);
        }

        wx.shareAppMessage({
            title: titleString,
            imageUrl : imageUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (result) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId, 2, shareSchemeId]);
                if(type == ddz.Share.onShareType.clickStatShareTypeInviteFriend){
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendSuccess,
                        [ddz.Share.shareKeywordReplace.inviteFriendID]);
                }
                // 免费宝箱
                if(type == ddz.Share.onShareType.clickStatShareTypeGiveProp){
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeGiveProp,
                        [ddz.Share.shareKeywordReplace.inviteTreasureID]);
                }

                if (successCallBackFun){
                    successCallBackFun(result);
                }
                hall.LOGW(null, "shareAppMessage+++++++++++++++++"+JSON.stringify(result));
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
                ddz.Share.isMatchShare = false;
                ddz.Share.resultType = ddz.Share.ShareState.failToShare;
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
            }
        });
    },

    shareResults:function (winloses) {
        var shareMap = ddz.gameModel.shareConfig;
        if(!shareMap){
            shareMap = ddz.Share.shareConfig.share;
        }
        var type = ddz.Share.onShareType.clickStatShareTypeShareResults;

        var shareDetail = shareMap[type];
        if(shareDetail.unSensitivePersonage){
            ddz.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        }else {
            ddz.Share.unSensitivePersonage = 0;
        }

        var shareCfg = shareDetail[hall.GlobalFuncs.getRandomNumberBefore(shareDetail.length)];
        var titleString = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

        var imageType = shareCfg.sharePointId + "_" + shareCfg.shareSchemeId;

        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 360;
        tempCanvas.height = 288;
        var context = tempCanvas.getContext("2d");
        var callBack = function () {
            var tempFilePath = tempCanvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: tempCanvas.width,
                height:tempCanvas.height,
                destWidth: tempCanvas.width,
                destHeight: tempCanvas.height
            });
            var query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + imageType + "&inviteName=" + ty.UserInfo.userName;
            if(shareDetail.query){
                var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
                query = query+"&"+queryString;
            }
            ddz.Share.shareImformation(ddz.Share.onShareType.clickStatShareTypeShareResults, shareCfg, titleString, tempFilePath, query);
        };
        var image = wx.createImage();
        image.src = shareCfg.sharePicUrl;

        var avatars = ddz.detailsModel.avatars;
        var nicknNames = ddz.detailsModel.nickNames;
        var scores = ddz.detailsModel.sumScores;
        // 分享出去按分数排序,从高到底
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
        hall.LOGW("","==========分享排序================"+JSON.stringify(_info));

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
                    context.fillText(hall.GlobalFuncs.SliceStringToLength(_info[j].nicknName,7),150,height);
                }else {
                    context.fillText("你的好友",150,height);
                }
                context.textAlign = "right";
                if (_info[j].score >  0){
                    context.fillStyle = "#fd5051";
                    context.fillText("+"+_info[j].score+"分",325,height);
                }else {
                    context.fillStyle = "#1593c1";
                    context.fillText(_info[j].score+"分",325,height);
                }
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
                avatarImage.onerror = function (event) {
                    imageIndex ++;
                    if(imageIndex >= 3){
                        callBack();
                    }
                };
            }
        };
    },

    playAnimationAfterShareWithType : function () {
        hall.LOGW("","file = [Share] fun = [playAnimationAfterShareWithType]");

        var toDayList = hall.GlobalTimer.getCurDayList();
        var lastShareTimeList = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_SHARE_TIMELIST, []);

        if(toDayList.toString() != lastShareTimeList.toString()){
            if (toDayList[0] == lastShareTimeList[0] && toDayList[1] == lastShareTimeList[1]){
                if (toDayList[2] == lastShareTimeList[2] + 1){
                    hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.YESTERDAYSHARE, true);
                }else {
                    hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.YESTERDAYSHARE, false);
                }
            }
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.LAST_SHARE_TIMELIST, toDayList);
        }


        if(ddz.Share.resultType == ddz.Share.ShareState.failToShare){
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
            return;
        }
        //直接跳转排行榜
        if(ddz.Share.shareType == ddz.Share.onShareType.clickStatShareTypeRankList){
            if(ddz.Share.shareTicket && ddz.Share.shareTicket != ""){
                hall.GlobalFuncs.gotoRank(ddz.Share.shareTicket);
                ddz.Share.shareType = "";
                ddz.Share.resultType = 0;
                return;
            }
        }

        //不是分享点,不做任何处理
        if((!ddz.Share.sharePoint || ddz.Share.sharePoint == 0)
            && ddz.Share.shareType != ddz.Share.onShareType.clickStatShareTypeRevial){
            ddz.Share.shareType = "";
            ddz.Share.resultType = 0;
            return;
        }
        //分享点什么都不验证,直接发钻石
        if(ddz.Share.unSensitivePersonage == 1 && ddz.Share.shareType != ddz.Share.onShareType.clickStatShareTypeRevial){
            this.endWithSuccessShare();
            return;
        }
        //没有分享到群,发送通知结果类型和分享类型通知(没有分享到微信群)
        if (!ddz.Share.shareTicket || ddz.Share.shareTicket == ""){
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
            return;
        }
        //分享点只验证群,直接发钻石
        if(ddz.Share.unSensitivePersonage == 2 && ddz.Share.shareType != ddz.Share.onShareType.clickStatShareTypeRevial){
            this.endWithSuccessShare();
            return;
        }
        
        var that = this;

        hall.LOGW("","file = [Share] fun = [playAnimationAfterShareWithType] shareTicket = "+JSON.stringify(ddz.Share.shareTicket));

        //要验证群的处理
        wx.getShareInfo(
            {
                shareTicket :ddz.Share.shareTicket,
                success : function (result) {
                    var shareKey;
                    if(ddz.Share.shareType == ddz.Share.onShareType.clickStatShareTypeRevial){
                        shareKey = ddz.matchModel.revivalShareKey;
                        ddz.Share.getShareResultWithKey(result,shareKey);
                    }else {
                        shareKey = ddz.Share.sharePoint +"";
                        ddz.Share.getShareResultWithKey(result,shareKey);
                    }
                },
                fail : function () {
                    ddz.Share.resultType = ddz.Share.ShareState.failToGetShareTicket;
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
                    hall.LOGE("","====getShareInfo=fail====="+JSON.stringify(arguments));
                },
                complete : function () {
                }
            }
        );
    },

    getShareResultWithKey : function (result,shareKey) {
        // var shareKey = ddz.Share.sharePoint +"";get_box_reward
        var iv = result.iv ;
        var encryptedData = result.encryptedData;
        var reultString = ddz.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
        // hall.LOGW("","file = [Share] fun = [getShareResultWithKey] reultString = "+JSOclickStatShareTypeWithChipN.stringify(reultString));
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_SHARE_TIME, "");
        var shareNumber = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 0);

        var shareTicketsDic = {};
        if(toDay != lastShareTime){
            shareTicketsDic[shareKey] = [openGId];
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.LAST_SHARE_TIME, toDay);
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 1);
        }else {
            shareNumber++;
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, shareNumber);
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if(shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length){
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1){
                    ddz.Share.resultType = ddz.Share.ShareState.repetitionGroupChat;
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
                    ddz.Share.shareTicket = "";
                    return;
                }
                shareList.push(openGId);
                hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }else {
                shareTicketsDic[shareKey] = [openGId];
                hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }
        }
        this.endWithSuccessShare();
    },

    getOpenGid:function(shareTicket,_boxUserId){

        var _openGid = "";

        var encryFunc = function(result){
            var iv = result.iv ;
            var encryptedData = result.encryptedData;
            var reultString = ddz.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
            // hall.LOGW("","file = [Share] fun = [getShareResultWithKey] reultString = "+JSON.stringify(reultString));
            // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
            var informationMap = JSON.parse(reultString);
            var openGId = informationMap.openGId;
            _openGid = openGId;
            if(!ddz.gameModel.isBringVersion){
                ddz.gameModel.getBoxReward(parseInt(_boxUserId),ty.SystemInfo.treasureID,_openGid);
            }

            hall.LOGW("","file = [Share] fun = [getOpenGid] _openGid = "+JSON.stringify(_openGid));
        };

        wx.getShareInfo(
            {
                shareTicket :shareTicket,
                success : function (result) {
                    encryFunc(result);
                },
                fail : function () {
                    hall.LOGW("","file = [Share] fun = [getOpenGid] fail ");
                    if(!ddz.gameModel.isBringVersion){
                        ddz.gameModel.getBoxReward(parseInt(_boxUserId),ty.SystemInfo.treasureID,_openGid);
                    }
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

    endWithSuccessShare : function () {
        ddz.Share.resultType = ddz.Share.ShareState.sucessShare;
        if(ddz.Share.shareType != ddz.Share.onShareType.clickStatShareTypeRevial){
            // if(ddz.Share.shareType == ddz.Share.onShareType.clickStatShareTypeWithDraw ||
            //     ddz.Share.shareType == ddz.Share.onShareType.clickStatShareTypeGetDiamondHall ||
            //     ddz.Share.shareType == ddz.Share.onShareType.clickStatShareTypeMainTips){
            //
            //     ddz.gameModel.saveRewardToBox(ddz.Share.sharePoint);
            // }else {
            //     ddz.gameModel.shareToGetreward(ddz.Share.sharePoint);
            // }

            ddz.gameModel.shareToGetreward(ddz.Share.sharePoint);
            // var _config = ddz.gameModel.getCongratulationGetRewardJson();
            // if (_config && _config.saveToBox){
            //     // ddz.gameModel.saveRewardToBox(ddz.Share.sharePoint);
            //     ddz.gameModel.shareToGetreward(ddz.Share.sharePoint);
            // }
            //
        }
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
    },

    onShareType :{
        clickStatShareTypeMainTips : "clickStatShareTypeMainTips",//发奖弹窗现金分享
        clickStatShareTypeCongratulation : "clickStatShareTypeCongratulation",//恭喜通关
        clickStatShareTypeWithDraw : "clickStatShareTypeWithDraw",//提现成功分享
        clickStatShareCash : "clickStatShareCash",//提现前分享
        clickStatShareTypeShareButton : "clickStatShareTypeShareButton",//微信分享按钮
        clickStatShareTypeRankList : "clickStatShareTypeRankList",//查看群排行榜
        clickStatShareTypeGetDiamondFail : "clickStatShareTypeGetDiamondFail",//邀请得钻石(闯关失败)
        clickStatShareTypeGetDiamondFailSix : "clickStatShareTypeGetDiamondFailSix",//邀请得钻石(第六关闯关失败)
        clickStatShareTypeGetDiamondFailWindow : "clickStatShareTypeGetDiamondFailWindow",//邀请得钻石(第六关闯关失败)弹窗按钮
        clickStatShareTypeMainRestartWindow : "clickStatShareTypeMainRestartWindow",//首页开始重新闯关弹窗按钮
        clickStatShareTypeGetDiamondHall : "clickStatShareTypeGetDiamondHall",//邀请得钻石(钻石主页分享到群)
        clickStatShareTypeInviteFriend : "clickStatShareTypeInviteFriend", //邀请好友进桌(好友桌)
        clickStatShareTypeShareResults : "clickStatShareTypeShareResults",//分享战绩
        clickStatShareTypeRevial : "clickStatShareTypeRevial",//每日首次失败分享复活
        clickStatShareTypeWinAward : "clickStatShareTypeWinAward",//金币场赢牌分享获得奖励
        clickStatShareTypeFailDamage : "clickStatShareTypeFailDamage",//金币场输牌分享获得赔偿
        clickStatShareTypeInviteNewFriend : "clickStatShareTypeInviteNewFriend",//邀请新人朋友
        clickStatShareTypeArenaLose : "clickStatShareTypeArenaLose",//arena比赛失败
        clickStatShareTypeArenaWin : "clickStatShareTypeArenaWin",//arena比赛成功
        clickStatShareTypeGongZhongHaoCard : "clickStatShareTypeGongZhongHaoCard",// 公众号会话
        clickStatShareTypeGongZhongHaoMenu : "clickStatShareTypeGongZhongHaoMenu",// 公众号自定义菜单
        clickStatShareTypeGoldHighPower : "clickStatShareTypeGoldHighPower",//金币场赢牌分享高倍
        clickStatShareTypeGoldSpring : "clickStatShareTypeGoldSpring",//金币场赢牌分享春天
        clickStatShareTypeGoldWinStreak : "clickStatShareTypeGoldWinStreak",//金币场赢牌分享连胜
        clickStatShareTypeGoldHighTotal : "clickStatShareTypeGoldHighTotal",//金币场赢牌分享总分
        clickStatShareTypeMatchFirst : "clickStatShareTypeMatchFirst",//比赛场第一名
        clickStatShareTypeMatchSecond : "clickStatShareTypeMatchSecond",//比赛场第二名
        clickStatShareTypeMatchThird : "clickStatShareTypeMatchThird",//比赛场第三名
        clickStatShareTypeFirstWithDraw : "clickStatShareTypeGongZhongHaoMenu",//首次提现
        clickStatShareTypeWithChip : "clickStatShareTypeWithChip",//发奖弹窗金币分享
        clickStatShareTypeGetRedPacket : "clickStatShareTypeGetRedPacket",//分享领取红包
        clickStatShareTypeAlms : "clickStatShareTypeAlms",//分享领取救济金
        clickStatShareTypeGiveProp : "clickStatShareTypeGiveProp",//免费送道具
        clickStatShareTypeSeekHelpFriend : "clickStatShareTypeSeekHelpFriend",//求助好友开宝箱
        clickStatShareTypeCustomsSuccess : "clickStatShareTypeCustomsSuccess",//闯关成功分享
        clickStatShareTypeNewUserGifts : "clickStatShareTypeNewUserGifts",//新人限时宝箱
        clickStatShareTypeSkipCustom : "clickStatShareTypeSkipCustom",//跳关
        clickStatShareTypeSkipCustomNewer : "clickStatShareTypeSkipCustomNewer"//新人跳关
    },

    clickStatShareType :{
        clickStatShareTypeShareButton : "004",//微信分享按钮
        clickStatShareTypeGetDiamondHall :"005",//邀请得钻石(钻石主页分享到群)
        clickStatShareTypeGetDiamondFail :"006",//邀请得钻石(闯关失败)
        clickStatShareTypeMainTips : "007",//发奖弹窗现金分享
        clickStatShareTypeWithDraw : "008",//提现成功分享
        clickStatShareTypeCongratulation : "009",//恭喜通关
        clickStatShareTypeRankList : "010",//查看群排行榜
        clickStatShareTypeMatchFirst : "011",//比赛场第一名
        clickStatShareTypeMatchSecond : "012",//比赛场第二名
        clickStatShareTypeMatchThird : "013",//比赛场第三名
        clickStatShareTypeInviteNewFriend : "014",//邀请新人朋友
        clickStatShareTypeArenaLose : "015",//arena比赛失败
        clickStatShareTypeArenaWin : "016",//arena比赛成功
        clickStatShareTypeRevial :"017",//每日首次失败分享复活
        clickStatShareTypeGoldHighPower : "018",//金币场赢牌分享高倍
        clickStatShareTypeGoldSpring : "019",//金币场赢牌分享春天
        clickStatShareTypeGoldWinStreak : "020",//金币场赢牌分享连胜
        clickStatShareTypeGoldHighTotal : "021",//金币场赢牌分享总分
        clickStatShareTypeInviteFriend :"022", //邀请好友进桌(好友桌)
        clickStatShareTypeShareResults :"023",//分享战绩
        clickStatShareTypeSeekHelpFriend : "058",//求助好友开宝箱
        clickStatShareTypeGiveProp : "071",//免费送道具
        clickStatShareTypeCustomsSuccess : "098",//闯关成功分享
        clickStatShareTypeGetDiamondFailSix : "099",//第六关闯关失败分享
        clickStatShareTypeNewUserGifts : "100",//新人限时宝箱
        clickStatShareTypeGongZhongHaoCard : "101",// 公众号会话
        clickStatShareTypeGongZhongHaoMenu : "102",// 公众号自定义菜单
        clickStatShareTypeWithChip : "147",//发奖弹窗现金分享兑换金币
        clickStatShareTypeGetRedPacket : "148",//分享领取红包
        clickStatShareTypeSkipCustom : "280",//跳关
        clickStatShareTypeSkipCustomNewer : "282",//新人跳关
        clickStatShareCash : "4",//提现前分享
        clickStatShareTypeWinAward :"12",//金币场赢牌分享获得奖励
        clickStatShareTypeFailDamage :"13",//金币场输牌分享获得赔偿
        clickStatShareTypeFirstWithDraw : "26",//首次提现
        clickStatShareTypeAlms : "29",//分享领取救济金
        clickStatShareTypeGetDiamondFailWindow : 29,//邀请得钻石(第六关闯关失败)弹窗按钮
        clickStatShareTypeMainRestartWindow : 29//首页开始重新闯关弹窗按钮
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
        "curBonusOnlyChip":"0", //自己本次获得奖励兑换金币
        "selfTotalBonus":0,//个人所得总奖励
        "selfAllWinnerCount": 0,//个人全部通关次数
        //好友桌
        "inviteFriendID":"10001",//好友桌邀请好友进桌房间ID
        "totalRound":0, //总局数
        "displayName":"经典",//玩法选择
        "goodCard":"标准",//发牌模式
        //金币场分享
        "goldWinReward":"0",//金币场赢取奖励while
        "surpassPercent":0, //超越比例
        //arena比赛场分享
        "arenaWinRewardMoney":"0",//arena比赛赢取奖励金钱
        "arenaWinRewardChip":"0",//arena比赛赢取奖励金币
        "arenaRanking":0, //arena比赛名次
        //复活弹窗
        "repeatNumber":1,
        "stageIndex":1,
        "hadNumber":0,
        "diamondPicture":"<img src='dda_button_diamond' height=34 width=42/>",
        "redDiamondPicture":"<img src='ddz_diamond_red' height=34 width=42/>",
        "coinPicture":"<img src='ddz_main_chip' height=48 width=48/>",
        "inviteTreasureID":"0",//免费宝箱ID;
        "newerTreasureID":"0"//新人限时宝箱ID
    },

    SharePointType:{
        firstFail : 67890001,  //首败
        userGroup : 67890002,   //分享到三个群
        tongGuan : 67890003,   //通关后分享
        redPacket : 67890003,   //提现后分享
        arenaPoint1 : 67890005,   //比赛1的分享点
        arenaPoint2 : 67890006,   //比赛2的分享点
        arenaPoint3 : 67890007,   //比赛3的分享点
        arenaPoint4 : 67890008,   //比赛4的分享点
        gongZhongHaoCard : 67890009,   //公众号会话卡片
        gongZhongHaoMenu : 67890010,   //公众号自定义菜单
        lottery : 67890003,   //发奖分享,
        alms:67890013, //救济金
        firstWithDraw : 67890012,  //首次提现
        withChip : 67890003,  //发奖金币弹窗分享
        getRedPacket : 67890015,  //分享领取红包
        boxShare : 67890016,  //宝箱分享
        shareFriend : 67890017, //首页邀请好友
        customsSuccess : 67890018, //闯关成功分享
        failSix : 67890003, //第六关闯关失败
        firstUseJiPaiQi:67890020, //首次送记牌器match_back
        adGetJiPaiQi:67890021, //看广告领取记牌器
        getDayFirstLogin:67890022, //看广告领取记牌器
        failDiamond:67890023, //闯关失败求助得钻石
        skipCustom:67890024, //跳关
        addApplet:67890025, //加入小程序
        failWindw:67890026, //闯关失败重新闯关弹窗分享点
        mainRestart:67890027, //首页重新闯关弹窗分享点
    },

    ShareState:{
        isNotAGroupChat : 1,   //不是群聊
        repetitionGroupChat : 2,  //重复群聊
        sucessShare : 3, //正常分享
        exShare : 4,
        failToGetShareTicket : 5,
        failToShare : 6
    },

    resurgenceConfig: {
        "arenaMatch": {
            "oldUser": [{
                "stageIndexMin": 1,
                "stageIndexMax": 3,
                "failCondition": [{
                    "failCountMin": 1,
                    "failCountMax": 1,
                    "resurgenceCondition": {
                        "conditionType": "ad",
                        "requestCount": 1,
                        "adIds":["adunit-8bde7ac62d379503"]
                    },
                    "title": "提示",
                    "content": "晋级失败\n观看广告即可免费复活",
                    "buttonText1": "观看广告复活",
                    "buttonText2": "点击放弃>"
                },
                    {
                        "failCountMin": 2,
                        "failCountMax": 4,
                        "resurgenceCondition": {
                            "conditionType": "share",
                            "requestCount": 1
                        },
                        "title": "提示",
                        "content": "晋级失败\n分享游戏给朋友即可免费复活",
                        "buttonText1": "分享",
                        "buttonText2": "点击放弃>"
                    },
                    {
                        "failCountMin": 5,
                        "failCountMax": 20,
                        "resurgenceCondition": {
                            "conditionType": "ad",
                            "requestCount": 1,
                            "adIds":["adunit-8bde7ac62d379503"]
                        },
                        "title": "提示",
                        "content": "晋级失败\n观看广告即可免费复活",
                        "buttonText1": "观看广告复活",
                        "buttonText2": "点击放弃>"
                    }
                    ]
            }],
            "newUser": [{
                "stageIndexMin": 1,
                "stageIndexMax": 3,
                "failCondition": [{
                    "failCountMin": 1,
                    "failCountMax": 2,
                    "resurgenceCondition": {
                        "conditionType": "ad",
                        "requestCount": 1,
                        "adIds":["adunit-8bde7ac62d379503"]
                    },
                    "title": "提示",
                    "content": "晋级失败\n观看广告即可免费复活",
                    "buttonText1": "观看广告复活",
                    "buttonText2": "点击放弃>"
                },
                    {
                        "failCountMin": 3,
                        "failCountMax": 5,
                        "resurgenceCondition": {
                            "conditionType": "share",
                            "requestCount": 1
                        },
                        "title": "提示",
                        "content": "晋级失败\n分享游戏给朋友即可免费复活",
                        "buttonText1": "分享",
                        "buttonText2": "点击放弃>"
                    },
                    {
                        "failCountMin": 6,
                        "failCountMax": 20,
                        "resurgenceCondition": {
                            "conditionType": "ad",
                            "requestCount": 1,
                            "adIds":["adunit-8bde7ac62d379503"]
                        },
                        "title": "提示",
                        "content": "晋级失败\n观看广告即可免费复活",
                        "buttonText1": "观看广告复活",
                        "buttonText2": "点击放弃>"
                    }
                    ]
            }]
        },
        "fightMatch": {
            "oldUser": [
                {
                "stageIndexMin": 2,
                "stageIndexMax": 3,
                "failCondition": [{
                    "failCountMin": 1,
                    "failCountMax": 1,
                    "resurgenceCondition": {
                        "conditionType": "ad",
                        "requestCount": 1,
                        "adIds":["adunit-8bde7ac62d379503"]
                    },
                    "title": "提示",
                    "content": "观看广告即可免费复活\n继续挑战第stageIndex关",
                    "buttonText1": "观看广告复活",
                    "buttonText2": "点击放弃>"
                },
                    {
                        "failCountMin": 2,
                        "failCountMax": 4,
                        "resurgenceCondition": {
                            "conditionType": "share",
                            "requestCount": 1
                        },
                        "title": "提示",
                        "content": "分享游戏给朋友即可免费复活\n继续挑战第stageIndex关",
                        "buttonText1": "分享",
                        "buttonText2": "点击放弃>"
                    },
                    {
                        "failCountMin": 5,
                        "failCountMax": 10,
                        "resurgenceCondition": {
                            "conditionType": "ad",
                            "requestCount": 1,
                            "adIds":["adunit-8bde7ac62d379503"]
                        },
                        "title": "提示",
                        "content": "观看广告即可免费复活\n继续挑战第stageIndex关",
                        "buttonText1": "观看广告复活",
                        "buttonText2": "点击放弃>"
                    }
                    ]
            },
                {
                    "stageIndexMin": 4,
                    "stageIndexMax": 5,
                    "failCondition": [{
                        "failCountMin": 1,
                        "failCountMax": 1,
                        "resurgenceCondition": {
                            "conditionType": "ad",
                            "requestCount": 2,
                            "adIds":["adunit-8bde7ac62d379503"]
                        },
                        "title": "提示",
                        "content": "看repeatNumber次广告可免费复活\n继续挑战第stageIndex关",
                        "buttonText1": "观看广告(hadNumber/repeatNumber)",
                        "buttonText2": "点击放弃>"
                    },
                        {
                            "failCountMin": 2,
                            "failCountMax": 4,
                            "resurgenceCondition": {
                                "conditionType": "share",
                                "requestCount": 3
                            },
                            "title": "提示",
                            "content": "分享游戏到repeatNumber个群即可免费复活\n继续挑战第stageIndex关",
                            "buttonText1": "邀请好友(hadNumber/repeatNumber)",
                            "buttonText2": "点击放弃>"
                        },
                        {
                            "failCountMin": 5,
                            "failCountMax": 10,
                            "resurgenceCondition": {
                                "conditionType": "ad",
                                "requestCount": 3,
                                "adIds":["adunit-8bde7ac62d379503"]
                            },
                            "title": "提示",
                            "content": "看repeatNumber次广告可免费复活\n继续挑战第stageIndex关",
                            "buttonText1": "观看广告(hadNumber/repeatNumber)",
                            "buttonText2": "点击放弃>"
                        }
                        ]
                }
                ],
            "newUser": [{
                "stageIndexMin": 2,
                "stageIndexMax": 5,
                "failCondition": [{
                    "failCountMin": 1,
                    "failCountMax": 2,
                    "resurgenceCondition": {
                        "conditionType": "ad",
                        "requestCount": 1,
                        "adIds":["adunit-8bde7ac62d379503"]
                        },
                    "title": "提示",
                    "content": "观看广告即可免费复活\n继续挑战第stageIndex关",
                    "buttonText1": "观看广告复活",
                    "buttonText2": "点击放弃>"
                    },
                    {
                        "failCountMin": 3,
                        "failCountMax": 5,
                        "resurgenceCondition": {
                            "conditionType": "share",
                            "requestCount": 1
                        },
                        "title": "提示",
                        "content": "分享游戏给朋友即可免费复活\n继续挑战第stageIndex关",
                        "buttonText1": "分享",
                        "buttonText2": "点击放弃>"
                    },
                    {
                        "failCountMin": 6,
                        "failCountMax": 20,
                        "resurgenceCondition": {
                            "conditionType": "ad",
                            "requestCount": 1,
                            "adIds":["adunit-8bde7ac62d379503"]
                        },
                        "title": "提示",
                        "content": "观看广告即可免费复活\n继续挑战第stageIndex关",
                        "buttonText1": "观看广告复活",
                        "buttonText2": "点击放弃>"
                    }
                    ]
                }]
        }
    },

    shareMoments:{
        "invite":[
            {
                "backUrl":"share_moments/share_moments_invite0.jpg",
                "bottomType":"type0"
            },
            {
                "backUrl":"share_moments/share_moments_invite1.jpg",
                "bottomType":"type0"
            },
            {
                "backUrl":"share_moments/share_moments_invite2.jpg",
                "bottomType":"type0"
            },
            {
                "backUrl":"share_moments/share_moments_invite3.jpg",
                "bottomType":"type0"
            }
        ],
        "showy_highPower":[
            {
                "backUrl":"share_moments/share_moments_showy_highPower.jpg",
                "bottomType":"type1"
            }
        ],
        "showy_highTotal":[
            {
                "backUrl":"share_moments/share_moments_showy_highTotal.jpg",
                "bottomType":"type1"
            }
        ],
        "showy_spring":[
            {
                "backUrl":"share_moments/share_moments_showy_spring.jpg",
                "bottomType":"type1"
            }
        ],
        "showy_winningStreak":[
            {
                "backUrl":"share_moments/share_moments_showy_winningStreak.jpg",
                "bottomType":"type1"
            }
        ],
        "bottomType":{
            "type0":{
                "bottomUrl":"share_moments/shareTo_moments_bottom2.png",
                "bottomHeight":254,
                "qrCenterX":508,
                "qrCenterY":987,
                "qrRadius":87,
                "avatarRadius":39
            },
            "type1":{
                "bottomUrl":"share_moments/shareTo_moments_bottom.jpg",
                "bottomHeight":182,
                "qrCenterX":530,
                "qrCenterY":1028,
                "qrRadius":72,
                "avatarRadius":32
            }
        }
    }
};

wx.onShareAppMessage(function (result) {
    var type = ddz.Share.onShareType.clickStatShareTypeShareButton;
    var shareMap = ddz.gameModel.shareConfig;
    if(!shareMap){
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
    if(shareDetail.query){
        var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
        query = "inviteCode=" + ty.UserInfo.userId+"&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName + "&" + queryString;
    }else {
        query = "inviteCode=" + ty.UserInfo.userId+"&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName;
    }

    if(shareDetail.unSensitivePersonage){
        ddz.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
    }else {
        ddz.Share.unSensitivePersonage = 0;
    }

    ddz.Share.shareType = type;
    ddz.Share.sharePoint = shareDetail.sharePoint;
    ddz.Share.isOnShare = true;
    ddz.Share.resultType = 0;
    ddz.Share.shareTicket = "";
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId, 1, shareSchemeId]);

    return {
        title: shareTitle,
        imageUrl:imageUrl,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets, groupMsgInfos) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[sharePointId , 2, shareSchemeId]);
            hall.LOGD(null, "onShareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets));
        },
        fail : function () {
            hall.LOGD(null, JSON.stringify(arguments));
        },
        complete : function () {
        }
    }
});