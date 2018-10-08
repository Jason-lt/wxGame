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
    shareQuery : "",

    unSensitivePersonage : 0,//0、验证不同群,1、什么都不验证,2、验证群
    sharePoint : 0,
    shareType : "",

    isOnShare : false,
    isMatchShare : false,
    shareTicket:"",
    resultType : 0,//1、不是群,2、重复群,3、正常

    shareWithType : function (type, successCallBackFun, failCallBackFun) {
        if(type == ddz.Share.onShareType.clickStatShareTypeRevial){
            ddz.Share.isMatchShare = true;
        }
        var shareMap = ddz.gameModel.shareConfig;
        if(!shareMap){
            shareMap = ddz.Share.shareConfig.share;
        }
        var shareDetail = shareMap[type];
        var massageList = shareDetail.massageList;
        var massageMap = massageList[hall.GlobalFuncs.getRandomNumberBefore(massageList.length)];
        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
        var imageList = shareDetail.imageList;
        var imageMap;

        if(massageMap.focusImage && massageMap.focusImage.length &&  massageMap.focusImage.length > 0){
            var index = massageMap.focusImage[hall.GlobalFuncs.getRandomNumberBefore(massageMap.focusImage.length)];
            imageMap = imageList[index];
        }else {
            imageMap = imageList[hall.GlobalFuncs.getRandomNumberBefore(imageList.length)];
        }

        var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
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
                    if(imageInformation.addImageUrl == "avatar"){
                        image.src = ty.UserInfo.userPic;
                    }else {
                        image.src = ty.SystemInfo.cdnPath+imageInformation.addImageUrl;
                    }
                    image.originPointX = imageInformation.originPointX;
                    image.originPointY = imageInformation.originPointY;
                    image.sizeWidth = imageInformation.sizeWidth;
                    image.sizeHeight = imageInformation.sizeHeight;
                    if(imageInformation.shape && imageInformation.shape == 2){
                        context.beginPath();
                        context.arc(image.originPointX+image.sizeWidth/2,image.originPointY+image.sizeHeight/2,image.sizeWidth/2,0,2*Math.PI);
                        context.stroke();
                        context.clip();
                    }
                    image.onload = function (event) {
                        var img = event.target;
                        context.drawImage(img,img.originPointX,img.originPointY,img.sizeWidth,img.sizeHeight);
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

    shareImformation : function (type,imageType,titleString, imageUrl,query,sharePoint,successCallBackFun,failCallBackFun) {
        ddz.Share.shareType = type;
        ddz.Share.sharePoint = sharePoint;
        ddz.Share.isOnShare = true;
        ddz.Share.resultType = 0;
        ddz.Share.shareTicket = "";

        if (type == ddz.Share.onShareType.clickStatShareTypeWinAward || type == ddz.Share.onShareType.clickStatShareTypeFailDamage){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[ddz.Share.clickStatShareType[type], 1,imageType,ddz.Share.shareQuery]);
        }else {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[ddz.Share.clickStatShareType[type], 1,imageType]);
        }
        if(type == ddz.Share.onShareType.clickStatShareTypeInviteFriend){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendClick,
                [ddz.Share.shareKeywordReplace.inviteFriendID]);
        }

        wx.shareAppMessage({
            title: titleString,
            imageUrl : imageUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (result) {
                if (type == ddz.Share.onShareType.clickStatShareTypeWinAward || type == ddz.Share.onShareType.clickStatShareTypeFailDamage){
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[ddz.Share.clickStatShareType[type], 2,imageType,ddz.Share.shareQuery]);
                }else {
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[ddz.Share.clickStatShareType[type],2,imageType]);
                }
                if(type == ddz.Share.onShareType.clickStatShareTypeInviteFriend){
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendSuccess,
                        [ddz.Share.shareKeywordReplace.inviteFriendID]);
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
        var shareDetail = shareMap[ddz.Share.onShareType.clickStatShareTypeShareResults];
        if(shareDetail.unSensitivePersonage){
            ddz.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        }else {
            ddz.Share.unSensitivePersonage = 0;
        }
        var massageList = shareDetail.massageList;
        var massageMap = massageList[hall.GlobalFuncs.getRandomNumberBefore(massageList.length)];
        var titleString = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
        var imageList = shareDetail.imageList;
        var imageMap = imageList[hall.GlobalFuncs.getRandomNumberBefore(imageList.length)];

        var type = ddz.Share.onShareType.clickStatShareTypeShareResults;

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
            var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
            if(shareDetail.query){
                var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
                query = query+"&"+queryString;
            }
            ddz.Share.shareImformation(ddz.Share.onShareType.clickStatShareTypeShareResults,
                imageMap.imageType,titleString,tempFilePath,query);
        };
        var image = wx.createImage();
        image.src = ty.SystemInfo.cdnPath + imageMap.imageUrl;

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

    shareWindowTips : function(_shareType) {
        // if (_shareType && _shareType == ddz.Share.onShareType.clickStatShareTypeInviteNewFriend ||
        //     _shareType == ddz.Share.onShareType.clickStatShareTypeGetDiamondHall ||
        //     _shareType == ddz.Share.onShareType.clickStatShareTypeRevial) {
        //     hall.LOGD("=="," file = [Share] fun = [shareWindowTips] return _shareType = " + _shareType);
        //     return;
        // }
        //
        // var type = ddz.Share.resultType;
        // hall.LOGD("=="," file = [Share] fun = [shareWindowTips] _shareType = " + _shareType);
        // switch (type){
        //     case 1:
        //
        //         var tips = "只有分享到微信群才能领取奖励哦";
        //         var _string = hall.GlobalFuncs.getButtonTitle(_shareType);
        //         var preFabPath = "prefabs/ddz_window_normal";
        //         var  comName = "ddz_window_normal";
        //         hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
        //             var window = preFabNode.getComponent(comName);
        //             var tiString = _string;
        //             window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tips + "</c>",[{title:tiString,callFunc:function () {
        //                 ddz.Share.shareWithType(_shareType);
        //             }}]);
        //         });
        //         // var timer = 3;
        //         break;
        //     case 2:
        //         var tips = "这个群已经分享过啦，分享到其他群吧";
        //         var _string = hall.GlobalFuncs.getButtonTitle(_shareType);
        //         var preFabPath = "prefabs/ddz_window_normal";
        //         var  comName = "ddz_window_normal";
        //         hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
        //             var window = preFabNode.getComponent(comName);
        //             var tiString = _string;
        //             window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tips + "</c>",[{title:tiString,callFunc:function () {
        //                 ddz.Share.shareWithType(_shareType);
        //             }}]);
        //         });
        //         break;
        //     case 3:
        //         break;
        //     default:
        //         break;
        // }
        // ddz.Share.resultType = 0;


    },

    playAnimationAfterShareWithType : function () {
        if(ddz.Share.resultType == ddz.Share.ShareState.failToShare){
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
            this.shareWindowTips(ddz.Share.shareType);
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
            this.shareWindowTips(ddz.Share.shareType);
            return;
        }
        //分享点只验证群,直接发钻石
        if(ddz.Share.unSensitivePersonage == 2 && ddz.Share.shareType != ddz.Share.onShareType.clickStatShareTypeRevial){
            this.endWithSuccessShare();
            return;
        }
        
        var that = this;
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
                    that.shareWindowTips(ddz.Share.shareType);
                    hall.LOGE("","====getShareInfo=fail====="+JSON.stringify(arguments));
                },
                complete : function () {
                }
            }
        );
    },

    getShareResultWithKey : function (result,shareKey) {
        // var shareKey = ddz.Share.sharePoint +"";
        var iv = result.iv ;
        var encryptedData = result.encryptedData;
        var reultString = ddz.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
        // hall.LOGW("","file = [Share] fun = [getShareResultWithKey] reultString = "+JSON.stringify(reultString));
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wxbfebdafc2fc60b54"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;

        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_SHARE_TIME, "");

        var shareTicketsDic = {};
        if(toDay != lastShareTime){
            shareTicketsDic[shareKey] = [openGId];
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(ddz.Share.LAST_SHARE_TIME, toDay);
        }else {
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if(shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length){
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1){
                    ddz.Share.resultType = ddz.Share.ShareState.repetitionGroupChat;
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
                    this.shareWindowTips(ddz.Share.shareType);
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
        ddz.Share.resultType = ddz.Share.ShareState.suscessShare;
        if(ddz.Share.shareType != ddz.Share.onShareType.clickStatShareTypeRevial){
            ddz.gameModel.shareToGetreward(ddz.Share.sharePoint);
        }
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_SHARE_STATE,ddz.Share.shareType);
        this.shareWindowTips(ddz.Share.shareType);
    },

    onShareType :{
        clickStatShareTypeMainTips : "clickStatShareTypeMainTips",//发奖弹窗现金分享
        clickStatShareTypeCongratulation : "clickStatShareTypeCongratulation",//恭喜通关
        clickStatShareTypeWithDraw : "clickStatShareTypeWithDraw",//提现成功分享
        clickStatShareCash : "clickStatShareCash",//提现前分享
        clickStatShareTypeShareButton : "clickStatShareTypeShareButton",//微信分享按钮
        clickStatShareTypeRankList : "clickStatShareTypeRankList",//查看群排行榜
        clickStatShareTypeGetDiamondFail : "clickStatShareTypeGetDiamondFail",//邀请得钻石(闯关失败)
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
        clickStatShareTypeAlms : "clickStatShareTypeAlms"//分享领取救济金
    },

    clickStatShareType :{
        clickStatShareTypeMainTips : 1,//发奖弹窗现金分享
        clickStatShareTypeCongratulation : 2,//恭喜通关
        clickStatShareTypeWithDraw : 3,//提现成功分享
        clickStatShareCash : 4,//提现前分享
        clickStatShareTypeShareButton : 5,//微信分享按钮
        clickStatShareTypeRankList : 6,//查看群排行榜
        clickStatShareTypeGetDiamondFail :7,//邀请得钻石(闯关失败)
        clickStatShareTypeGetDiamondHall :8,//邀请得钻石(钻石主页分享到群)
        clickStatShareTypeInviteFriend :9, //邀请好友进桌(好友桌)
        clickStatShareTypeShareResults :10,//分享战绩
        clickStatShareTypeRevial :11,//每日首次失败分享复活
        clickStatShareTypeWinAward :12,//金币场赢牌分享获得奖励
        clickStatShareTypeFailDamage :13,//金币场输牌分享获得赔偿
        clickStatShareTypeInviteNewFriend : 14,//邀请新人朋友
        clickStatShareTypeArenaLose : 15,//arena比赛失败
        clickStatShareTypeArenaWin : 16,//arena比赛成功
        clickStatShareTypeGongZhongHaoCard : 17,// 公众号会话
        clickStatShareTypeGongZhongHaoMenu : 18,// 公众号自定义菜单
        clickStatShareTypeGoldHighPower : 19,//金币场赢牌分享高倍
        clickStatShareTypeGoldSpring : 20,//金币场赢牌分享春天
        clickStatShareTypeGoldWinStreak : 21,//金币场赢牌分享连胜
        clickStatShareTypeGoldHighTotal : 22,//金币场赢牌分享总分
        clickStatShareTypeMatchFirst : 23,//比赛场第一名
        clickStatShareTypeMatchSecond : 24,//比赛场第二名
        clickStatShareTypeMatchThird : 25,//比赛场第三名
        clickStatShareTypeFirstWithDraw : 26,//首次提现
        clickStatShareTypeWithChip : 27,//发奖弹窗现金分享
        clickStatShareTypeGetRedPacket : 28//分享领取红包
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
        //好友桌
        "inviteFriendID":"10001",//好友桌邀请好友进桌房间ID
        "totalRound":0, //总局数
        "displayName":"经典",//玩法选择
        "goodCard":"标准",//发牌模式
        //金币场分享
        "goldWinReward":"0",//金币场赢取奖励
        "surpassPercent":0, //超越比例
        //arena比赛场分享
        "arenaWinRewardMoney":"0",//arena比赛赢取奖励金钱
        "arenaWinRewardChip":"0",//arena比赛赢取奖励金币
        "arenaRanking":0, //arena比赛名次
        //复活弹窗
        "repeatNumber":1,
        "stageIndex":1,
        "hadNumber":0,
        "diamondPicture":"<img src='dda_button_diamond' height=34 width=42/>"
    },

    SharePointType:{
        firstFail : 67890001,  //首败
        userGroup : 67890002,   //分享到三个群
        tongGuan : 67890003,   //通关后分享
        redPacket : 67890004,   //提现后分享
        arenaPoint1 : 67890005,   //比赛1的分享点
        arenaPoint2 : 67890006,   //比赛2的分享点
        arenaPoint3 : 67890007,   //比赛3的分享点
        arenaPoint4 : 67890008,   //比赛4的分享点
        gongZhongHaoCard : 67890009,   //公众号会话卡片
        gongZhongHaoMenu : 67890010,   //公众号自定义菜单
        lottery : 67890011,   //发奖分享,
        alms:67890013, //救济金
        firstWithDraw : 67890012,  //首次提现
        withChip : 67890014,  //发奖金币弹窗分享
        getRedPacket : 67890015  //分享领取红包
    },

    ShareState:{
        isNotAGroupChat : 1,   //不是群聊
        repetitionGroupChat : 2,  //重复群聊
        suscessShare : 3, //正常分享
        exShare : 4,
        failToGetShareTicket : 5,
        failToShare : 6
    },

    shareConfig :{
        "share": {
            "clickStatShareTypeArenaWin": {
                "massageList": [{
                    "formatString": "马上分bonusTotal了，点一下帮帮我！",
                    "focusImage": [0]
                },
                    {
                        "formatString": "惊呆！斗地主居然能得奖金！快来和我平分bonusTotal！",
                        "focusImage": [1]
                    },
                    {
                        "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                        "focusImage": [2]
                    },
                    {
                        "formatString": "二师兄，大师兄和师傅叫你过来斗地主！",
                        "focusImage": [3]
                    },
                    {
                        "formatString": "我马上获胜啦！咦？好像有哪里怪怪的……",
                        "focusImage": [4]
                    },
                    {
                        "formatString": "比弹一弹好玩100倍！居然还能赢奖金！",
                        "focusImage": [5]
                    },
                    {
                        "formatString": "一只手玩的斗地主，操作简单还能赚红包！点击就玩",
                        "focusImage": [6]
                    },
                    {
                        "formatString": "全新版本今日上线！简单有趣、玩法最全的斗地主！",
                        "focusImage": [7]
                    },
                    {
                        "formatString": "新版今日上线！来就送1万金币，今日有效，机不可失！",
                        "focusImage": [8]
                    },
                    {
                        "formatString": "新版今日上线！新增癞子玩法、欢乐玩法，还送金币哦",
                        "focusImage": [9]
                    },
                    {
                        "formatString": "新版今日上线，快来跟我一起玩新玩法，点击就玩",
                        "focusImage": [10]
                    },
                    {
                        "formatString": "史上最大更新，快来尝鲜体验，今天还送1万金币哦",
                        "focusImage": [11]
                    },
                    {
                        "formatString": "新版更新了，加了好多功能，快来试一试，还送金币哦",
                        "focusImage": [12]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/t102.jpg?v=1",
                    "imageType": "10110102"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t406.jpg?v=1",
                        "imageType": "10403406"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t500.jpg?v=1",
                        "imageType": "10102500"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/l603.jpg?v=1",
                        "imageType": "p10100603"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t505.jpg?v=1",
                        "imageType": "10503505"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t305.jpg?v=1",
                        "imageType": "10301305"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t506.jpg?v=1",
                        "imageType": "10000506"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t608.jpg?v=1",
                        "imageType": "10123608"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t608.jpg?v=1",
                        "imageType": "10124608"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t607.jpg?v=1",
                        "imageType": "10125607"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t608.jpg?v=1",
                        "imageType": "10126608"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t607.jpg?v=1",
                        "imageType": "10127607"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t607.jpg?v=1",
                        "imageType": "10128607"
                    }
                ]
            },
            "clickStatShareTypeArenaLose": {
                "massageList": [{
                    "formatString": "马上分bonusTotal了，点一下帮帮我！",
                    "focusImage": [0]
                },
                    {
                        "formatString": "惊呆！斗地主居然能得奖金！快来和我平分bonusTotal！",
                        "focusImage": [1]
                    },
                    {
                        "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                        "focusImage": [2]
                    },
                    {
                        "formatString": "闯关全靠实力，没有人民币玩家",
                        "focusImage": [3]
                    },
                    {
                        "formatString": "二师兄，大师兄和师傅叫你过来斗地主！",
                        "focusImage": [4]
                    },
                    {
                        "formatString": "我马上获胜啦！咦？好像有哪里怪怪的……",
                        "focusImage": [5]
                    },
                    {
                        "formatString": "比弹一弹好玩100倍！居然还能赢奖金！",
                        "focusImage": [6]
                    },
                    {
                        "formatString": "一只手玩的斗地主，操作简单还能赚红包！点击就玩",
                        "focusImage": [7]
                    },
                    {
                        "formatString": "全新版本今日上线！简单有趣、玩法最全的斗地主！",
                        "focusImage": [8]
                    },
                    {
                        "formatString": "新版今日上线！来就送1万金币，今日有效，机不可失！",
                        "focusImage": [9]
                    },
                    {
                        "formatString": "新版今日上线！新增癞子玩法、欢乐玩法，还送金币哦",
                        "focusImage": [10]
                    },
                    {
                        "formatString": "新版今日上线，快来跟我一起玩新玩法，点击就玩",
                        "focusImage": [11]
                    },
                    {
                        "formatString": "史上最大更新，快来尝鲜体验，今天还送1万金币哦",
                        "focusImage": [12]
                    },
                    {
                        "formatString": "新版更新了，加了好多功能，快来试一试，还送金币哦",
                        "focusImage": [13]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/t102.jpg?v=1",
                    "imageType": "11110102"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t406.jpg?v=1",
                        "imageType": "11403406"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t500.jpg?v=1",
                        "imageType": "11102500"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t206.jpg?v=1",
                        "imageType": "11210206"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/l603.jpg?v=1",
                        "imageType": "p11100603"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t505.jpg?v=1",
                        "imageType": "11503505"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t305.jpg?v=1",
                        "imageType": "11301305"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t506.jpg?v=1",
                        "imageType": "11000506"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t608.jpg?v=1",
                        "imageType": "11123608"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t608.jpg?v=1",
                        "imageType": "11124608"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t607.jpg?v=1",
                        "imageType": "11125607"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t608.jpg?v=1",
                        "imageType": "11126608"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t607.jpg?v=1",
                        "imageType": "11127607"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/t607.jpg?v=1",
                        "imageType": "11128607"
                    }
                ]
            },
            "clickStatShareTypeMainTips": {
                "massageList": [{
                        "formatString": "我玩斗地主赢了lastBonusOnly奖励！太容易啦，哈哈",
                        "focusImage": [0]
                    },
                    {
                        "formatString": "我玩斗地主赢了lastBonusOnly奖励！太容易啦，哈哈",
                        "focusImage": [1]
                    },
                    {
                        "formatString": "我昨天又赢了lastBonusOnly奖励！平分bonusTotal，说走就走！",
                        "focusImage": [2]
                    },
                    {
                        "formatString": "大白天的不要随便许愿，万一实现了呢？",
                        "focusImage": [3]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/13.jpg?v=1",
                    "imageType": "010011"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/19.jpg?v=1",
                        "imageType": "010012"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/tu1.2.jpg?v=1",
                        "imageType": "010021"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/tu1.5.jpg?v=1",
                        "imageType": "010051"
                    }
                ],
                "sharePoint": 67890000,
                "buttonTitle" : "分享"
            },
            "clickStatShareTypeCongratulation": {
                "massageList": [{
                    "formatString": "我是第allWinnerCount位通关的，平分bonusTotal！还有sei！",
                    "focusImage": [0]
                },
                    {
                        "formatString": "轻松闯过7关，我马上就要平分bonusTotal啦！",
                        "focusImage": [1]
                    },
                    {
                        "formatString": "分享下最好玩的斗地主小游戏，我已经通关curWinnerCount遍了！",
                        "focusImage": [2]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/14.jpg?v=1",
                    "imageType": "020011"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/222.jpg?v=1",
                        "imageType": "020021"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/223.jpg?v=1",
                        "imageType": "020031"
                    }
                ],
                "sharePoint": 67890003,
                "query": ""
            },
            "clickStatShareTypeWithDraw": {
                "massageList": [{
                    "formatString": "我在富豪斗地主领取了奖金，你也可以！",
                    "focusImage": [0]
                },
                    {
                        "formatString": "【wechatName@你】玩斗地主，发家致富！你也来试试！",
                        "focusImage":[1]
                    },
                    {
                        "formatString": "自从玩了富豪斗地主，我的钱包再也没biĕ过！",
                        "focusImage": [2]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/231.jpg?v=1",
                    "imageType": "030011",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "withDrawMoney",
                            "fontSize": 76,
                            "textColorRGB": "#feff99",
                            "textAlign": "center",
                            "originPointX": 180,
                            "originPointY": 260
                        }
                    },
                        {
                            "type": "text",
                            "textInformation": {
                                "textformatString": "元",
                                "fontSize": 20,
                                "textColorRGB": "#feff99",
                                "textAlign": "left",
                                "originPointX": -2,
                                "originPointY": 260
                            }
                        },
                        {
                            "type": "text",
                            "textInformation": {
                                "textformatString": "恭喜你获得",
                                "fontSize": 20,
                                "textColorRGB": "#fef864",
                                "textAlign": "center",
                                "originPointX": 180,
                                "originPointY": 190
                            }
                        }
                    ],
                    "sizeWith": 360,
                    "sizeHeight": 288
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/232.jpg?v=1",
                        "imageType": "030021"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/233.jpg?v=1",
                        "imageType": "030031"
                    }
                ],
                "sharePoint": 67890004,
                "buttonTitle" : "分享"
            },
            "clickStatShareCash": {
                "massageList": [{
                    "formatString": "你得到了一张刮刮卡，立即刮奖>>>",
                    "focusImage": [0]
                },
                    {
                        "formatString": "比跳一跳好玩100倍！居然还能赢奖金！",
                        "focusImage":[1]
                    },
                    {
                        "formatString": "加班苦，生活累，富豪送点加班费。",
                        "focusImage": [2]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/tu7.1.jpg?v=1",
                    "imageType": "070011"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/tu7.2.jpg?v=1",
                        "imageType": "070021"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/tu7.3.jpg?v=1",
                        "imageType": "070031"
                    }
                ],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeShareButton": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [
                    {
                        "imageUrl": "res/raw-assets/resources/share/242.jpg?v=1",
                        "imageType": "040021"
                    }
                ],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeRankList": {
                "massageList": [{
                    "formatString": "本群斗地主实力排名！看看你上榜了吗？"
                }],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/262.jpg?v=1",
                    "imageType": "060021"
                }],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeGetDiamondFail": {
                "massageList": [{
                    "formatString": "马上分bonusTotal了，点一下帮帮我！",
                    "focusImage": [0]
                },
                    {
                        "formatString": "惊呆！斗地主居然能得奖金！快来和我平分bonusTotal！",
                        "focusImage": [1]
                    },
                    {
                        "formatString": "两个萌妹子斗地主二缺一，要去一起玩吗？",
                        "focusImage": [2]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050011"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/252.jpg?v=1",
                        "imageType": "050021"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/tu5.4.jpg?v=1",
                        "imageType": "050041"
                    }
                ],
                "sharePoint": "67890001"
            },
            "clickStatShareTypeGetDiamondHall": {
                "massageList": [{
                    "formatString": "马上分bonusTotal了，点一下帮帮我！",
                    "focusImage": [0]
                },
                    {
                        "formatString": "惊呆！斗地主居然能得奖金！快来和我平分bonusTotal！",
                        "focusImage": [1]
                    },
                    {
                        "formatString": "两个萌妹子斗地主二缺一，要去一起玩吗？",
                        "focusImage": [2]
                    }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                },
                    {
                        "imageUrl": "res/raw-assets/resources/share/252.jpg?v=1",
                        "imageType": "050022"
                    },
                    {
                        "imageUrl": "res/raw-assets/resources/share/tu5.4.jpg?v=1",
                        "imageType": "050042"
                    }
                ],
                "sharePoint": 67890002
            },
            "clickStatShareTypeInviteFriend": {
                "massageList": [{
                    "formatString": "房间已建好,totalRound局,displayName玩法,goodCard场,速来"}
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/yqhy.jpg??v=1",
                    "imageType": "050012"
                }],
                "sharePoint": "67890001",
                "query" : "ftID=inviteFriendID"
            },
            "clickStatShareTypeShareResults": {
                "massageList": [{
                    "formatString": "新一轮战绩排名出来了，快来围观！"
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/20.jpg?v=1",
                    "imageType": "050012"
                }],
                "sharePoint": "67890001",
                "query" : ""
            },
            "clickStatShareTypeRevial": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeWinAward": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeFailDamage": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeInviteNewFriend": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeGongZhongHaoCard": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [1]
                }
                ],
                "imageList": [
                    {
                        "imageUrl": "res/raw-assets/resources/share/p615.jpg?v=2",
                        "imageType": "p05215615"
                    }
                ],
                "sharePoint": 67890009
            },
            "clickStatShareTypeGongZhongHaoMenu": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [1]
                }
                ],
                "imageList": [
                    {
                        "imageUrl": "res/raw-assets/resources/share/p615.jpg?v=2",
                        "imageType": "p05215615"
                    }
                ],
                "sharePoint": 67890010
            },
            "clickStatShareTypeFirstWithDraw": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [1]
                }
                ],
                "imageList": [
                    {
                        "imageUrl": "res/raw-assets/resources/share/p615.jpg?v=2",
                        "imageType": "p05215615"
                    }
                ],
                "sharePoint": 67890012
            },
            "clickStatShareTypeWithChip": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [1]
                }
                ],
                "imageList": [
                    {
                        "imageUrl": "res/raw-assets/resources/share/p615.jpg?v=2",
                        "imageType": "p05215615"
                    }
                ],
                "sharePoint": 67890014
            },
            "clickStatShareTypeGetRedPacket": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [1]
                }
                ],
                "imageList": [
                    {
                        "imageUrl": "res/raw-assets/resources/share/p615.jpg?v=2",
                        "imageType": "p05215615"
                    }
                ],
                "sharePoint": 67890015
            },
            "clickStatShareTypeGoldHighPower": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeGoldSpring": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeGoldWinStreak": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeGoldHighTotal": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeMatchFirst": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeMatchSecond": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            },
            "clickStatShareTypeMatcchThird": {
                "massageList": [{
                    "formatString": "轻松有趣还能赢奖金的斗地主！点开即玩！",
                    "focusImage": [0]
                }
                ],
                "imageList": [{
                    "imageUrl": "res/raw-assets/resources/share/17.jpg?v=1",
                    "imageType": "050012"
                }
                ]
            }
        }
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
                            "buttonText1": "分享到群(hadNumber/repeatNumber)",
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
        shareMap = ddz.Share.shareConfig.share;
    }
    var shareDetail = shareMap.clickStatShareTypeShareButton;
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

    var query;
    if(shareDetail.query){
        var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
        query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName+"&"+queryString;
    }else {
        query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type+"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
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
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[ddz.Share.clickStatShareType[type],1,imageMap.imageType]);

    return {
        title: shareTitle,
        imageUrl:imageUrl,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets,groupMsgInfos) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[ddz.Share.clickStatShareType[type],2,imageMap.imageType]);
            hall.LOGD(null, "onShareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets));
        },
        fail : function () {
            hall.LOGD(null, JSON.stringify(arguments));
        },
        complete : function () {
        }
    }
});