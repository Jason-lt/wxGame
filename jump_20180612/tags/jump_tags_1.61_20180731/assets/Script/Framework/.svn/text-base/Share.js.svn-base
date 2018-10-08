
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
    shareTicket:"",
    resultType : 0,//1、不是群,2、重复群,3、正常

    shareWithType : function (type, successCallBackFun, failCallBackFun) {
        if(!ty.UserInfo.wxgame_session_key){
            hall.LoginToyoo();
        }
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
                    jump.Share.playAnimationAfterShareWithType();
                    return;
                }
                jump.Share.shareTicket = result.shareTickets[0];
                jump.Share.playAnimationAfterShareWithType();
            },
            fail : function () {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction,[jump.Share.clickStatShareType[type],3,imageType]);
                if (failCallBackFun){
                    failCallBackFun();
                }
                jump.Share.resultType = jump.Share.ShareState.failToShare;
                hall.LOGD(null, JSON.stringify(arguments));
                jump.Share.playAnimationAfterShareWithType();
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
        if(!ty.UserInfo.wxgame_session_key){
            jump.Share.resultType = jump.Share.ShareState.userInfoError;
            ty.NotificationCenter.trigger(jump.EventType.UPDATE_SHARE_STATE,jump.Share.shareType);
            return;
        }
        if(!iv || !encryptedData){
            jump.Share.resultType = jump.Share.ShareState.shareError;
            ty.NotificationCenter.trigger(jump.EventType.UPDATE_SHARE_STATE,jump.Share.shareType);
            return;
        }
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
        clickStatShareTypeInviteFriendTOBattle : "clickStatShareTypeInviteFriendTOBattle",//结算页邀请好友挑战
        clickStatShareTypeInviteFriendResurgence:"clickStatShareTypeInviteFriendResurgence"//邀请好友复活
    },
    clickStatShareType :{
        clickStatShareTypeRankList : 1,//排行榜
        clickStatShareTypeShareButton : 2,
        clickStatShareTypeInviteFriend:3,
        clickStatShareTypeShowHighTotalFirst:4,//炫耀最佳成绩(新添等级1)
        clickStatShareTypeShowHighTotalSecond:5,//炫耀最佳成绩(新添等级2)
        clickStatShareTypeShowHighTotalThird:6,//炫耀最佳成绩(新添等级3)
        clickStatShareTypeInviteFriendTOBattle : 7,
        clickStatShareTypeInviteFriendResurgence : 8
    },
    shareKeywordReplace :{
        theHighForMe :"",
        bestScoreForSelf: ""
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
                    "formatString": "朋友,上来吃西瓜吗?",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/shareButton_0613_001.png?v=1",
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
                    "focusImage": [0, 1, 2]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/battle_0611_01.png?v=2",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "theHighForMe米",
                            "fontSize": 18,
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
                                "sizeWidth": 28,
                                "sizeHeight": 28
                            }
                        }
                    ],
                    "imageType": "0611004"
                },
                    {
                        "imageUrl": "jump/share/shareChat/battle_0611_02.png?v=2",
                        "extraAdd": [{
                            "type": "text",
                            "textInformation": {
                                "textformatString": "theHighForMe米",
                                "fontSize": 18,
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
                                    "sizeWidth": 28,
                                    "sizeHeight": 28
                                }
                            }
                        ],
                        "imageType": "0611005"
                    },
                    {
                        "imageUrl": "jump/share/shareChat/battle_0611_03.png?v=2",
                        "extraAdd": [{
                            "type": "text",
                            "textInformation": {
                                "textformatString": "theHighForMe米",
                                "fontSize": 18,
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
                                    "sizeWidth": 28,
                                    "sizeHeight": 28
                                }
                            }
                        ],
                        "imageType": "0611007"
                    }
                ],
                "sharePoint":"000001"
            },
            "clickStatShareTypeShowHighTotalFirst": {
                "sharePoint":"000001",
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
                            "fontSize": 18,
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
                "sharePoint":"000001",
                "massageList": [{
                    "formatString": "我在theHighForMe米等你,你上得来吗?",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/show_0611_02.png?v=2",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "theHighForMe米",
                            "fontSize": 18,
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
                "sharePoint":"000001",
                "massageList": [{
                    "formatString": "我在theHighForMe米等你,你上得来吗?",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/show_0611_01.png?v=2",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "theHighForMe米",
                            "fontSize": 18,
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
                                "sizeWidth": 28,
                                "sizeHeight": 28
                            }
                        }
                    ],
                    "imageType": "0611008"
                }
                ]
            },
            "clickStatShareTypeInviteFriendResurgence": {
                "sharePoint":"67990001",
                "massageList": [{
                    "formatString": "救我一命，立即获得神秘道具助你上天！",
                    "focusImage": [0]
                }],
                "imageList": [{
                    "imageUrl": "jump/share/shareChat/shareResurgence_0626_01.png?v=1",
                    "imageType": "0626001",
                    "extraAdd": [{
                        "type": "text",
                        "textInformation": {
                            "textformatString": "分数:bestScoreForSelf",
                            "fontSize": 25,
                            "textColorRGB": "#010101",
                            "textAlign": "center",
                            "originPointX": 180,
                            "originPointY": 180
                        }
                    },
                        {
                            "type": "image",
                            "imageInformation": {
                                "addImageUrl": "avatar",
                                "shape": 1,
                                "originPointX": 152,
                                "originPointY": 98,
                                "sizeWidth": 56,
                                "sizeHeight": 56
                            }
                        }
                    ]
                }]
            }
        }
    },
    resurgenceConfig : {
        "goOnWindow" : {
            "bsgsUser":{
                "showType":0,
                "resurgenceType":"share"
            },
            "noBsgsUser":{
                "showType":0,
                "resurgenceType":"share"
            }
        }
    },
    speedConfig : {
        "horizontalVelocityCoefficient": 1700,
        "verticalAcceleratedSpeed": 1500,
        "verticalInitialSpeed": 950,
        "verticalInitialSpeedFirst": 1250,
        "pedalVerticalAcceleratedSpeed":1500,
        "horizontalDetectionSection": 80,
        "verticalDetectionSection": 12,
        "roleTopY":0,
        "resurgenceCount":1,
        "minDisablePedalGap" : 150
    },
    toolList: {
        "normalPedal": {
            "pedalType":"normalPedal",
            "shapeSpriteType":0,
            "toolPrefabType":-1,
            "hidePedal":0,
            "canMove":0,
            "treadCount": 1000
        },
        "shortPedal": {
            "pedalType":"shortPedal",
            "shapeSpriteType":3,
            "toolPrefabType":-1,
            "hidePedal":0,
            "canMove":0,
            "treadCount": 1000,
            "sectionWidth": 20,
            "horizontalDetectionSection":56
        },
        "oncePedal": {
            "pedalType":"oncePedal",
            "shapeSpriteType":1,
            "toolPrefabType":-1,
            "hidePedal":0,
            "canMove":0,
            "aniType":"disable",
            "treadCount": 1
        },
        "movePedal": {
            "pedalType":"movePedal",
            "shapeSpriteType":2,
            "toolPrefabType":-1,
            "hidePedal":0,
            "canMove":1,
            "horizontalSpeed": 150,
            "treadCount": 1000
        },
        "disablePedal": {
            "pedalType":"disablePedal",
            "shapeSpriteType":0,
            "toolPrefabType":0,
            "hidePedal":1,
            "canMove":0,
            "aniType":"pedalAni",
            "treadCount": 0,
            "positionX": 0,
            "positionY": 0
        },
        "springRing": {
            "pedalType":"springRing",
            "shapeSpriteType":0,
            "toolPrefabType":1,
            "hidePedal":0,
            "canMove":0,
            "aniType":"pedalAni",
            "initialSpeed": 1800,
            "treadCount": 1000,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 50,
            "backOnRoleX": 40,
            "backOnRoleY": 40
        },
        "springRing2": {
            "pedalType":"springRing2",
            "shapeSpriteType":3,
            "toolPrefabType":1,
            "hidePedal":0,
            "canMove":0,
            "aniType":"pedalAni",
            "initialSpeed": 1800,
            "treadCount": 1000,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 50,
            "backOnRoleX": 40,
            "backOnRoleY": 40
        },
        "trampoline": {
            "pedalType":"trampoline",
            "shapeSpriteType":0,
            "toolPrefabType":2,
            "hidePedal":0,
            "canMove":0,
            "aniType":"pedalAni",
            "initialSpeed": 2100,
            "treadCount": 1000,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 50,
            "backOnRoleX": 40,
            "backOnRoleY": 40
        },
        "bambooDragonfly": {
            "pedalType":"bambooDragonfly",
            "shapeSpriteType":0,
            "toolPrefabType":3,
            "hidePedal":0,
            "canMove":0,
            "aniType":"backPack",
            "flySpeed": 2500,
            "timeOfDuration": 2,
            "treadCount": 1,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 50,
            "backOnRoleX": 3,
            "backOnRoleY": 76,
            "beforeRole":1
        },
        "bambooDragonfly2": {
            "pedalType":"bambooDragonfly2",
            "shapeSpriteType":3,
            "toolPrefabType":3,
            "hidePedal":0,
            "canMove":0,
            "aniType":"backPack",
            "flySpeed": 2500,
            "timeOfDuration": 2,
            "treadCount": 1,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 50,
            "backOnRoleX": 3,
            "backOnRoleY": 76,
            "beforeRole":1
        },
        "rocketTube": {
            "pedalType":"rocketTube",
            "shapeSpriteType":0,
            "toolPrefabType":4,
            "hidePedal":0,
            "canMove":0,
            "aniType":"backPack",
            "flySpeed": 2500,
            "timeOfDuration": 3,
            "treadCount": 1,
            "positionX": 0,
            "positionY": 0,
            "sectionWidth": 50,
            "backOnRoleX": 4,
            "backOnRoleY": 8,
            "beforeRole":0
        },
        "monsterdisable": {
            "pedalType":"monsterdisable",
            "shapeSpriteType":4,
            "toolPrefabType":-1,
            "hidePedal":0,
            "canMove":0,
            "verticalShortSpeed":160,
            "moveShort":10,
            "aniType":"addSpeed",
            "addVerticalSpeed":1000,
            "isMonster":1,
            "verticalDetection":120,
            "horizontalDetectionSection": 60,
            "treadCount": 1
        },
        "monsterdisable2": {
            "pedalType":"monsterdisable2",
            "shapeSpriteType":5,
            "toolPrefabType":-1,
            "hidePedal":0,
            "canMove":1,
            "horizontalSpeed":200,
            "moveShort":10,
            "aniType":"addSpeed",
            "addVerticalSpeed":1000,
            "isMonster":1,
            "verticalDetection":120,
            "horizontalDetectionSection": 60,
            "treadCount": 1
        },
        "monster3": {
            "pedalType":"monster3",
            "shapeSpriteType":6,
            "toolPrefabType":-1,
            "hidePedal":0,
            "canMove":1,
            "horizontalSpeed": 200,
            "aniType":"addSpeed",
            "addVerticalSpeed":1000,
            "isMonster":1,
            "verticalDetection":120,
            "horizontalDetectionSection": 60,
            "treadCount": 1
        }
    },
    pedalList: [
        {
            "minScore": 0,
            "maxScore": 1000,
            "gapY": 50,
            "gameLevel":0,
            "movePedalHorizontalSpeed" :120,
            "roleHorizontalVelocityCoefficient": 1700,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 30,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 0,
                "movePedal": 0,
                "springRing2": 0,
                "trampoline":0,
                "bambooDragonfly2": 0,
                "rocketTube": 0
            }
        },
        {
            "minScore": 1000,
            "maxScore": 2000,
            "gapY": 90,
            "gameLevel":1,
            "movePedalHorizontalSpeed" :120,
            "roleHorizontalVelocityCoefficient": 1700,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 15,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 8,
                "movePedal": 0,
                "springRing": 2,
                "trampoline":0,
                "bambooDragonfly": 0,
                "rocketTube": 0
            }
        },
        {
            "minScore": 2000,
            "maxScore": 3000,
            "gapY": 120,
            "gameLevel":2,
            "movePedalHorizontalSpeed" :120,
            "roleHorizontalVelocityCoefficient": 1700,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 22,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 10,
                "springRing": 2,
                "trampoline":1,
                "bambooDragonfly": 1,
                "rocketTube": 0
            }
        },
        {
            "minScore": 3000,
            "maxScore": 5000,
            "gapY": 120,
            "gameLevel":3,
            "movePedalHorizontalSpeed" :120,
            "roleHorizontalVelocityCoefficient": 1700,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal":25,
                "shortPedal":15,
                "oncePedal": 0,
                "disablePedal": 20,
                "movePedal": 10,
                "springRing": 2,
                "trampoline":1,
                "bambooDragonfly": 1,
                "rocketTube": 0
            }
        },
        {
            "minScore": 5000,
            "maxScore": 7000,
            "gapY":160,
            "gameLevel":4,
            "movePedalHorizontalSpeed" :120,
            "roleHorizontalVelocityCoefficient": 1700,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 25,
                "shortPedal":25,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 0,
                "springRing": 2,
                "trampoline":1,
                "bambooDragonfly": 1,
                "rocketTube": 0,
                "monsterdisable":0,
                "monsterdisable2":3,
                "monster3":0
            }
        },
        {
            "minScore": 7000,
            "maxScore": 9000,
            "gapY": 100,
            "gameLevel":5,
            "movePedalHorizontalSpeed" :120,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 30,
                "shortPedal":10,
                "oncePedal": 0,
                "disablePedal": 20,
                "movePedal": 10,
                "springRing": 3,
                "trampoline":0,
                "bambooDragonfly": 0,
                "rocketTube": 1,
                "monsterdisable":1,
                "monsterdisable2":2,
                "monster3":0
            }
        },
        {
            "minScore": 9000,
            "maxScore": 11000,
            "gapY": 160,
            "gameLevel":6,
            "movePedalHorizontalSpeed" :140,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 10,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 20,
                "movePedal": 20,
                "springRing": 3,
                "trampoline":0,
                "bambooDragonfly": 1,
                "rocketTube": 0,
                "monsterdisable":0,
                "monsterdisable2":2,
                "monster3":2
            }
        },
        {
            "minScore": 11000,
            "maxScore": 13000,
            "gapY": 130,
            "gameLevel":7,
            "movePedalHorizontalSpeed" :140,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 10,
                "shortPedal":5,
                "oncePedal": 5,
                "disablePedal": 10,
                "movePedal": 0,
                "springRing": 3,
                "trampoline":1,
                "bambooDragonfly": 0,
                "rocketTube": 1,
                "monsterdisable":0,
                "monsterdisable2":1,
                "monster3":0
            }
        },
        {
            "minScore": 13000,
            "maxScore": 15000,
            "gapY": 160,
            "gameLevel":8,
            "movePedalHorizontalSpeed" :150,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 25,
                "shortPedal":0,
                "oncePedal": 10,
                "disablePedal": 10,
                "movePedal": 5,
                "springRing": 2,
                "trampoline":0,
                "bambooDragonfly": 1,
                "rocketTube": 1,
                "monsterdisable":1,
                "monsterdisable2":0,
                "monster3":2
            }
        },
        {
            "minScore": 15000,
            "maxScore": 16000,
            "gapY": 160,
            "gameLevel":9,
            "movePedalHorizontalSpeed" :150,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 8,
                "shortPedal":0,
                "oncePedal": 20,
                "disablePedal": 10,
                "movePedal": 0,
                "springRing": 1,
                "trampoline":1,
                "bambooDragonfly": 0,
                "rocketTube": 2
            }
        },
        {
            "minScore": 16000,
            "maxScore": 18000,
            "gapY": 130,
            "gameLevel":10,
            "movePedalHorizontalSpeed" :150,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 40,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 10,
                "springRing": 2,
                "trampoline":0,
                "bambooDragonfly": 1,
                "rocketTube": 1,
                "monsterdisable":0,
                "monsterdisable2":2,
                "monster3":0
            }
        },
        {
            "minScore": 18000,
            "maxScore": 20000,
            "gapY": 160,
            "gameLevel":11,
            "movePedalHorizontalSpeed" :160,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 10,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 20,
                "springRing": 2,
                "trampoline":0,
                "bambooDragonfly": 1,
                "rocketTube": 1,
                "monsterdisable":0,
                "monsterdisable2":2,
                "monster3":2
            }
        },
        {
            "minScore": 20000,
            "maxScore": 22000,
            "gapY": 160,
            "gameLevel":12,
            "movePedalHorizontalSpeed" :170,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 10,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 30,
                "springRing": 2,
                "trampoline":1,
                "bambooDragonfly": 1,
                "rocketTube": 0,
                "monsterdisable":2,
                "monsterdisable2":2,
                "monster3":0
            }
        },
        {
            "minScore": 22000,
            "maxScore": 23000,
            "gapY": 160,
            "gameLevel":13,
            "movePedalHorizontalSpeed" :170,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 5,
                "shortPedal":15,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 5,
                "springRing": 1,
                "trampoline":0,
                "bambooDragonfly2": 1,
                "rocketTube": 0
            }
        },
        {
            "minScore": 23000,
            "maxScore": 24000,
            "gapY": 160,
            "gameLevel":14,
            "movePedalHorizontalSpeed" :170,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 20,
                "shortPedal":5,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 0,
                "springRing": 2,
                "trampoline":0,
                "bambooDragonfly": 0,
                "rocketTube": 1
            }
        },
        {
            "minScore": 24000,
            "maxScore": 26000,
            "gapY": 160,
            "gameLevel":15,
            "movePedalHorizontalSpeed" :180,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 0,
                "shortPedal":10,
                "oncePedal": 0,
                "disablePedal": 0,
                "movePedal": 20,
                "springRing2": 2,
                "trampoline":0,
                "bambooDragonfly2": 2,
                "rocketTube": 0,
                "monsterdisable":1,
                "monsterdisable2":0,
                "monster3":2
            }
        },
        {
            "minScore": 26000,
            "maxScore": 28000,
            "gapY": 160,
            "gameLevel":16,
            "movePedalHorizontalSpeed" :180,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 5,
                "shortPedal":10,
                "oncePedal": 8,
                "disablePedal": 10,
                "movePedal": 0,
                "springRing2": 3,
                "trampoline":0,
                "bambooDragonfly2": 1,
                "rocketTube": 1,
                "monsterdisable":1,
                "monsterdisable2":2,
                "monster3":0
            }
        },
        {
            "minScore": 28000,
            "maxScore": 30000,
            "gapY": 100,
            "gameLevel":17,
            "movePedalHorizontalSpeed" :200,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 10,
                "shortPedal":10,
                "oncePedal": 0,
                "disablePedal": 0,
                "movePedal": 10,
                "springRing": 2,
                "trampoline":1,
                "bambooDragonfly": 0,
                "rocketTube": 0,
                "monsterdisable":0,
                "monsterdisable2":2,
                "monster3":2
            }
        },
        {
            "minScore": 30000,
            "maxScore": 32000,
            "gapY": 160,
            "gameLevel":18,
            "movePedalHorizontalSpeed" :200,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 5,
                "shortPedal":0,
                "oncePedal": 0,
                "disablePedal": 20,
                "movePedal": 35,
                "springRing": 3,
                "trampoline":0,
                "bambooDragonfly": 2,
                "rocketTube": 1,
                "monsterdisable":0,
                "monsterdisable2":0,
                "monster3":0
            }
        },
        {
            "minScore": 32000,
            "maxScore": 38000,
            "gapY": 160,
            "gameLevel":19,
            "movePedalHorizontalSpeed" :200,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 0,
                "shortPedal":10,
                "oncePedal": 0,
                "disablePedal": 10,
                "movePedal": 20,
                "springRing2": 3,
                "trampoline":0,
                "bambooDragonfly2": 2,
                "rocketTube": 1,
                "monsterdisable":0,
                "monsterdisable2":2,
                "monster3":2
            }
        },
        {
            "minScore": 38000,
            "maxScore": 58000,
            "gapY": 160,
            "gameLevel":20,
            "movePedalHorizontalSpeed" :220,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 0,
                "shortPedal":0,
                "oncePedal": 10,
                "disablePedal": 18,
                "movePedal": 30,
                "springRing": 3,
                "trampoline":0,
                "bambooDragonfly": 2,
                "rocketTube": 1,
                "monsterdisable":0,
                "monsterdisable2":3,
                "monster3":2
            }
        },
        {
            "minScore": 58000,
            "maxScore": 88000,
            "gapY": 170,
            "gameLevel":21,
            "movePedalHorizontalSpeed" :240,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 5,
                "shortPedal":0,
                "oncePedal": 20,
                "disablePedal": 20,
                "movePedal": 50,
                "springRing": 3,
                "trampoline":0,
                "bambooDragonfly": 1,
                "rocketTube": 1,
                "monsterdisable":2,
                "monsterdisable2":0,
                "monster3":4
            }
        },
        {
            "minScore": 88000,
            "maxScore": 520000000000000,
            "gapY": 190,
            "gameLevel":21,
            "movePedalHorizontalSpeed" :260,
            "roleHorizontalVelocityCoefficient": 1800,
            "roleVerticalInitialSpeed": 950,
            "roleVerticalAcceleratedSpeed":1600,
            "pedalComponent": {
                "normalPedal": 8,
                "shortPedal":0,
                "oncePedal": 10,
                "disablePedal": 18,
                "movePedal": 40,
                "springRing": 3,
                "trampoline":0,
                "bambooDragonfly": 2,
                "rocketTube": 1,
                "monsterdisable":2,
                "monsterdisable2":0,
                "monster3":4
            }
        }],

    shareWithTypeTest : function (type, successCallBackFun, failCallBackFun, testCfg) {
        if(!ty.UserInfo.wxgame_session_key){
            hall.LoginToyoo();
        }
        var shareMap = jump.gameModel.shareConfig;
        if(!shareMap){
            shareMap = jump.Share.shareConfig.share;
        }
        var shareDetail = shareMap[type];

        var shareCfg = shareDetail[hall.GlobalFuncs.getRandomNumberBefore(shareDetail.length)];

        if (testCfg){
            //配置上线前测试准备
            shareCfg = testCfg;
        }

        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);

        var imageType = shareCfg.sharePointId + "_" + shareCfg.shareSchemeId;
        var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageType+"&inviteName="+ty.UserInfo.userName;
        if(shareDetail.query){
            jump.Share.shareQuery = shareDetail.query;
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
    }
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

wx.showShareMenu({
    withShareTicket: true
});

