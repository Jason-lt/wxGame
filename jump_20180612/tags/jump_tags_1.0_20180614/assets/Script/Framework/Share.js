
var crypto = require('crypto');

jump.Share = {
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
        var shareMap = jump.gameModel.shareConfig;
        if(!shareMap){
            shareMap = jump.Share.shareConfig.share;
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
            jump.Share.shareQuery = shareDetail.query;
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = query+"&"+queryString;
        }else {
            jump.Share.shareQuery = "";
        }

        if(shareDetail.unSensitivePersonage){
            jump.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
        }else {
            jump.Share.unSensitivePersonage = 0;
        }

        var shareImage = ty.SystemInfo.cdnPath + imageMap.imageUrl;
        if(imageMap.extraAdd && imageMap.extraAdd.length && imageMap.extraAdd.length > 0 ){
            var callBackF = function(imageUrl) {
                jump.Share.shareImformation(type, imageMap.imageType, shareTitle, imageUrl, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
            };
            jump.Share.getShareImageWithShareMap(0,imageMap,shareImage,callBackF);
        }else {
            jump.Share.shareImformation(type, imageMap.imageType, shareTitle, shareImage, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
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
                        // image.src = ty.UserInfo.userPic || "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
                        if(imageInformation.shape && imageInformation.shape == 2){
                            context.beginPath();
                            context.arc(imageInformation.originPointX+imageInformation.sizeWidth/2,
                                imageInformation.originPointY+imageInformation.sizeHeight/2,imageInformation.sizeWidth/2,0,2*Math.PI);
                            context.stroke();
                            context.clip();
                        }
                        context.drawImage(ty.UserInfo.avatarImg,imageInformation.originPointX,
                            imageInformation.originPointY,imageInformation.sizeWidth,imageInformation.sizeHeight);
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
                        return;
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
                    image.onerror = function (event) {
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
        image.onerror = function (event) {
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
        jump.Share.shareType = type;
        jump.Share.sharePoint = sharePoint;
        jump.Share.isOnShare = true;
        jump.Share.resultType = 0;
        jump.Share.shareTicket = "";

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[jump.Share.clickStatShareType[type], 1,imageType]);

        wx.shareAppMessage({
            title: titleString,
            imageUrl : imageUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (result) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[jump.Share.clickStatShareType[type],2,imageType]);

                if (successCallBackFun){
                    successCallBackFun(result);
                }
                hall.LOGW(null, "shareAppMessage+++++++++++++++++"+JSON.stringify(result));
                if(!result.shareTickets || !result.shareTickets[0]){
                    jump.Share.resultType = jump.Share.ShareState.isNotAGroupChat;
                    jump.Share.shareTicket = "";
                    return;
                }
                jump.Share.shareTicket = result.shareTickets[0];
            },
            fail : function () {
                if (failCallBackFun){
                    failCallBackFun();
                }
                jump.Share.resultType = jump.Share.ShareState.failToShare;
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
            }
        });
    },

    shareWindowTips : function(_shareType) {
    },

    playAnimationAfterShareWithType : function () {
        hall.LOGW("======","=========playAnimationAfterShareWithType==========");
        if(jump.Share.resultType == jump.Share.ShareState.failToShare){
            ty.NotificationCenter.trigger(jump.EventType.UPDATE_SHARE_STATE,jump.Share.shareType);
            this.shareWindowTips(jump.Share.shareType);
            return;
        }
        //直接跳转排行榜
        if(jump.Share.shareType == jump.Share.onShareType.clickStatShareTypeRankList){
            if(jump.Share.shareTicket && jump.Share.shareTicket != ""){
                jump.GlobalFuncs.showRankList(jump.Share.shareTicket);
                jump.Share.shareType = "";
            }else {
                jump.GlobalFuncs.showNoDiamondToastTip("发送到群才有效哦~");
            }
            return;
        }
        //不是分享点,不做任何处理
        if(!jump.Share.sharePoint || jump.Share.sharePoint == 0){
            jump.Share.shareType = "";
            return;
        }
        //分享点什么都不验证,直接发钻石
        if(jump.Share.unSensitivePersonage == 1){
            this.endWithSuccessShare();
            return;
        }
        //没有分享到群,发送通知结果类型和分享类型通知(没有分享到微信群)
        if (!jump.Share.shareTicket || jump.Share.shareTicket == ""){
            ty.NotificationCenter.trigger(jump.EventType.UPDATE_SHARE_STATE,jump.Share.shareType);
            this.shareWindowTips(jump.Share.shareType);
            return;
        }
        //分享点只验证群,直接发钻石
        if(jump.Share.unSensitivePersonage == 2){
            this.endWithSuccessShare();
            return;
        }
        
        var that = this;
        //要验证群的处理
        wx.getShareInfo(
            {
                shareTicket :jump.Share.shareTicket,
                success : function (result) {
                    var shareKey;
                    shareKey = jump.Share.sharePoint +"";
                    jump.Share.getShareResultWithKey(result,shareKey);
                },
                fail : function () {
                    jump.Share.resultType = jump.Share.ShareState.failToGetShareTicket;
                    ty.NotificationCenter.trigger(jump.EventType.UPDATE_SHARE_STATE,jump.Share.shareType);
                    that.shareWindowTips(jump.Share.shareType);
                    hall.LOGE("","====getShareInfo=fail====="+JSON.stringify(arguments));
                },
                complete : function () {
                }
            }
        );
    },

    getShareResultWithKey : function (result,shareKey) {
        // var shareKey = jump.Share.sharePoint +"";
        var iv = result.iv ;
        var encryptedData = result.encryptedData;
        var reultString = jump.Share.decrypt(ty.UserInfo.wxgame_session_key,iv,encryptedData);
        // hall.LOGW("","file = [Share] fun = [getShareResultWithKey] reultString = "+JSON.stringify(reultString));
        // {"openGId":"tGXVqG5IZmqkGArWBhZNJwn2NsqaQ","watermark":{"timestamp":1524292994,"appid":"wx1fd01947adfea285"}}
        var informationMap = JSON.parse(reultString);
        var openGId = informationMap.openGId;

        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(jump.Share.LAST_SHARE_TIME, "");

        var shareTicketsDic = {};
        if(toDay != lastShareTime){
            shareTicketsDic[shareKey] = [openGId];
            hall.GlobalFuncs.setInLocalStorage(jump.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(jump.Share.LAST_SHARE_TIME, toDay);
        }else {
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(jump.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if(shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length){
                var shareList = shareTicketsDic[shareKey];
                if (shareList.indexOf(openGId) > -1){
                    jump.Share.resultType = jump.Share.ShareState.repetitionGroupChat;
                    ty.NotificationCenter.trigger(jump.EventType.UPDATE_SHARE_STATE,jump.Share.shareType);
                    this.shareWindowTips(jump.Share.shareType);
                    jump.Share.shareTicket = "";
                    return;
                }
                shareList.push(openGId);
                hall.GlobalFuncs.setInLocalStorage(jump.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }else {
                shareTicketsDic[shareKey] = [openGId];
                hall.GlobalFuncs.setInLocalStorage(jump.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
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
        jump.Share.resultType = jump.Share.ShareState.suscessShare;
        ty.NotificationCenter.trigger(jump.EventType.UPDATE_SHARE_STATE,jump.Share.shareType);
        this.shareWindowTips(jump.Share.shareType);
    },

    onShareType :{
        clickStatShareTypeRankList : "clickStatShareTypeRankList",//获取群排行榜
        clickStatShareTypeShareButton : "clickStatShareTypeShareButton",//微信分享按钮
        clickStatShareTypeInviteFriend:"clickStatShareTypeInviteFriend",//邀请好友
        clickStatShareTypeShowHighTotalFirst:"clickStatShareTypeShowHighTotalFirst",//炫耀最佳成绩(新添)
        clickStatShareTypeShowHighTotalSecond:"clickStatShareTypeShowHighTotalSecond",//炫耀最佳成绩(新添)
        clickStatShareTypeShowHighTotalThird:"clickStatShareTypeShowHighTotalThird",//炫耀最佳成绩(新添)
        clickStatShareTypeInviteFriendTOBattle : "clickStatShareTypeInviteFriendTOBattle"//结算页邀请好友挑战
    },

    clickStatShareType :{
        clickStatShareTypeRankList : 1,//排行榜
        clickStatShareTypeShareButton : 2,
        clickStatShareTypeInviteFriend:3,
        clickStatShareTypeShowHighTotalFirst:4,//炫耀最佳成绩(新添等级1)
        clickStatShareTypeShowHighTotalSecond:5,//炫耀最佳成绩(新添等级2)
        clickStatShareTypeShowHighTotalThird:6,//炫耀最佳成绩(新添等级3)
        clickStatShareTypeInviteFriendTOBattle : 7
    },

    shareKeywordReplace :{
        theHighForMe :""
    },

    ShareState:{
        isNotAGroupChat : 1,   //不是群聊
        repetitionGroupChat : 2,  //重复群聊
        suscessShare : 3, //正常分享
        exShare : 4,
        failToGetShareTicket : 5,
        failToShare : 6
    },

    shareMoments:{
        "show_level_01": [{
            "backUrl": "jump/share/shareMoments/shareMoment_level1_0611_01.png?v=1",
            "bottomType": "type0"
        }],
        "show_level_02": [{
            "backUrl": "jump/share/shareMoments/shareMoment_level2_0611_01.png?v=1",
            "bottomType": "type0"
        }],
        "show_level_03": [{
            "backUrl": "jump/share/shareMoments/shareMoment_level3_0611_01.png?v=1",
            "bottomType": "type0"
        }],
        "bottomType": {
            "type0": {
                "bottomUrl": "share_moments/shareTo_moments_bottom2.png",
                "bottomHeight": 254,
                "qrCenterX": 454,
                "qrCenterY": 542,
                "qrRadius": 68,
                "avatarRadius": 30,
                "textPositionX": 150,
                "textPositionY": 588
            }
        }
    },

    shareConfig :{
        "share": {
            "clickStatShareTypeShareButton": {
                "massageList": [{
                    "formatString": "救我一命，立即获得神秘道具助你上天！",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/shareButton_0611_01.png?v=1",
                    "imageType": "0611001"
                }]
            },
            "clickStatShareTypeRankList": {
                "massageList": [{
                    "formatString": "看看本群排行，到底是谁上天了?",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/rank_0611_01.png?v=1",
                    "imageType": "0611002"
                }]
            },
            "clickStatShareTypeInviteFriend": {
                "massageList": [{
                    "formatString": "救我一命，立即获得神秘道具助你上天！",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/invite_0611_01.png?v=1",
                    "imageType": "0611003"
                }]
            },
            "clickStatShareTypeInviteFriendTOBattle": {
                "massageList": [{
                    "formatString": "我在theHighForMe米等你,你上得来吗?",
                    "focusImage": [0,1,2]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/battle_0611_01.png?v=1",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "theHighForMe米",
                            "fontSize": 18,
                            "textColorRGB": "#ffffff",
                            "textAlign": "left",
                            "originPointX": 66,
                            "originPointY": 264
                        }
                    },
                        {
                            "type": "image",
                            "imageInformation": {
                                "addImageUrl": "avatar",
                                "shape": 2,
                                "originPointX": 32,
                                "originPointY": 245,
                                "sizeWidth": 28,
                                "sizeHeight": 28
                            }
                        }
                    ],
                    "imageType": "0611004"
                },
                    {
                        "imageUrl": "jump/share/shareChat/battle_0611_02.png?v=1",
                        "extraAdd": [{
                            "type": "text",
                            "textInformation": {
                                "textformatString": "theHighForMe米",
                                "fontSize": 18,
                                "textColorRGB": "#ffffff",
                                "textAlign": "left",
                                "originPointX": 66,
                                "originPointY": 264
                            }
                        },
                            {
                                "type": "image",
                                "imageInformation": {
                                    "addImageUrl": "avatar",
                                    "shape": 2,
                                    "originPointX": 32,
                                    "originPointY": 245,
                                    "sizeWidth": 28,
                                    "sizeHeight": 28
                                }
                            }
                        ],
                        "imageType": "0611005"
                    },
                    {
                        "imageUrl": "jump/share/shareChat/battle_0611_03.png?v=1",
                        "extraAdd": [{
                            "type": "text",
                            "textInformation": {
                                "textformatString": "theHighForMe米",
                                "fontSize": 18,
                                "textColorRGB": "#ffffff",
                                "textAlign": "left",
                                "originPointX": 66,
                                "originPointY": 264
                            }
                        },
                            {
                                "type": "image",
                                "imageInformation": {
                                    "addImageUrl": "avatar",
                                    "shape": 2,
                                    "originPointX": 32,
                                    "originPointY": 245,
                                    "sizeWidth": 28,
                                    "sizeHeight": 28
                                }
                            }
                        ],
                        "imageType": "0611007"
                    }
                ]
            },
            "clickStatShareTypeShowHighTotalFirst": {
                "massageList": [{
                    "formatString": "我在theHighForMe米等你,你上得来吗?",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/show_0611_01.png?v=1",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "theHighForMe米",
                            "fontSize": 18,
                            "textColorRGB": "#ffffff",
                            "textAlign": "left",
                            "originPointX": 66,
                            "originPointY": 264
                        }
                    },
                        {
                            "type": "image",
                            "imageInformation": {
                                "addImageUrl": "avatar",
                                "shape": 2,
                                "originPointX": 32,
                                "originPointY": 245,
                                "sizeWidth": 28,
                                "sizeHeight": 28
                            }
                        }
                    ],
                    "imageType": "0611008"
                }
                ]
            },
            "clickStatShareTypeShowHighTotalSecond": {
                "massageList": [{
                    "formatString": "我在theHighForMe米等你,你上得来吗?",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/show_0611_02.png?v=1",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "theHighForMe米",
                            "fontSize": 18,
                            "textColorRGB": "#ffffff",
                            "textAlign": "left",
                            "originPointX": 66,
                            "originPointY": 264
                        }
                    },
                        {
                            "type": "image",
                            "imageInformation": {
                                "addImageUrl": "avatar",
                                "shape": 2,
                                "originPointX": 32,
                                "originPointY": 245,
                                "sizeWidth": 28,
                                "sizeHeight": 28
                            }
                        }
                    ],
                    "imageType": "0611008"
                }
                ]
            },
            "clickStatShareTypeShowHighTotalThird": {
                "massageList": [{
                    "formatString": "我在theHighForMe米等你,你上得来吗?",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/show_0611_03.png?v=2",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "theHighForMe米",
                            "fontSize": 32,
                            "textColorRGB": "#ffffff",
                            "textAlign": "left",
                            "originPointX": 195,
                            "originPointY": 255
                        }
                    },
                        {
                            "type": "image",
                            "imageInformation": {
                                "addImageUrl": "avatar",
                                "shape": 2,
                                "originPointX": 152,
                                "originPointY": 228,
                                "sizeWidth": 38,
                                "sizeHeight": 38
                            }
                        }
                    ],
                    "imageType": "0611008"
                }
                ]
            }
        }
    },

    speedConfig : {
        "horizontalVelocityCoefficient": 800,
        "verticalAcceleratedSpeed": 1000,
        "verticalInitialSpeed": 1500,
        "pedalVerticalAcceleratedSpeed":1000,
        "horizontalDetectionSection": 80,
        "verticalDetectionSection": 8,
        "roleTopY":100,
        "resurgenceCount":1,
        "minDisablePedalGap" : 150
    },
    toolList:  {
        "normalPedal": {
            "treadCount": 1000
        },
        "oncePedal": {
            "treadCount": 1
        },
        "movePedal": {
            "horizontalSpeed": 20,
            "treadCount": 1000
        },
        "disablePedal": {
            "treadCount": 0,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 80
        },
        "springRing": {
            "initialSpeed": 500,
            "treadCount": 1000,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 20,
            "backOnRoleX": 40,
            "backOnRoleY": 40
        },
        "trampoline": {
            "initialSpeed": 500,
            "treadCount": 1000,
            "timeOfDuration": 3,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 20,
            "backOnRoleX": 40,
            "backOnRoleY": 40
        },
        "bambooDragonfly": {
            "flySpeed": 700,
            "timeOfDuration": 3,
            "treadCount": 1,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 20,
            "backOnRoleX": 0,
            "backOnRoleY": 40,
            "beforeRole":1
        },
        "rocketTube": {
            "flySpeed": 1000,
            "timeOfDuration": 5,
            "treadCount": 1,
            "positionX": 50,
            "positionY": 0,
            "sectionWidth": 20,
            "backOnRoleX": 40,
            "backOnRoleY": 40,
            "beforeRole":0
        }
    },
    pedalList: [{
        "minScore": 0,
        "maxScore": 4000,
        "gapY": 80,
        "gameLevel":0,
        "movePedalHorizontalSpeed" :200,
        "pedalComponent": {
            "normalPedal": 10,
            "oncePedal": 10,
            "disablePedal": 10,
            "movePedal": 10,
            "springRing": 10,
            "trampoline":10,
            "bambooDragonfly": 10,
            "rocketTube": 10
        }}, {
        "minScore": 4000,
        "maxScore": 100000000,
        "gapY": 160,
        "gameLevel":1,
        "movePedalHorizontalSpeed" :200,
        "pedalComponent": {
                "normalPedal": 10,
                "oncePedal": 0,
                "disablePedal": 0,
                "movePedal": 10,
                "springRing": 10,
                "trampoline":10,
                "bambooDragonfly": 10,
                "rocketTube": 10
            }
        }]
};

wx.onShareAppMessage(function (result) {
    var type = jump.Share.onShareType.clickStatShareTypeShareButton;
    var shareMap = jump.gameModel.shareConfig;
    if(!shareMap){
        shareMap = jump.Share.shareConfig.share;
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
        jump.Share.unSensitivePersonage = shareDetail.unSensitivePersonage;
    }else {
        jump.Share.unSensitivePersonage = 0;
    }
    jump.Share.shareType = type;
    jump.Share.sharePoint = shareDetail.sharePoint;
    jump.Share.isOnShare = true;
    jump.Share.resultType = 0;
    jump.Share.shareTicket = "";
    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[jump.Share.clickStatShareType[type],1,imageMap.imageType]);

    return {
        title: shareTitle,
        imageUrl:imageUrl,
        query : query,//'key1=val1&key2=val2',
        success : function (shareTickets,groupMsgInfos) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[jump.Share.clickStatShareType[type],2,imageMap.imageType]);
            hall.LOGD(null, "onShareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets));
        },
        fail : function () {
            hall.LOGD(null, JSON.stringify(arguments));
        },
        complete : function () {
        }
    }
});