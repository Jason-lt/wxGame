// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

ddz.Share = {
    isOnShare : false,
    sharePoint : 0,

    shareWithType : function (type,callBackFun) {
        var shareMap = ddz.gameModel.shareConfig;
        // if(debugMode || !shareMap){
        //     shareMap = ddz.GameWorld.shareConfig.share;
        // }
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
            query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&"+queryString;
        }else {
            query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type+"&imageType="+imageMap.imageType;
        }
        var shareImage = ty.SystemInfo.cdnPath + imageMap.imageUrl;
        if(imageMap.extraAdd && imageMap.extraAdd.length && imageMap.extraAdd.length > 0 ){
            var callBackF = function(imageUrl) {
                ddz.Share.shareImformation(type,imageMap.imageType,shareTitle,imageUrl,query,shareDetail.sharePoint,callBackFun);
            };
            ddz.Share.getShareImageWithShareMap(0,imageMap,shareImage,callBackF);
        }else {
            ddz.Share.shareImformation(type,imageMap.imageType,shareTitle,shareImage,query,shareDetail.sharePoint,callBackFun);
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

    shareImformation : function (type,imageType,titleString, imagUrl,query,sharePoint,callBackFun) {
        hall.LOGD(null, "shareAppMessage+++++++++++++query+========+++"+query);

        if(type == ty.UserInfo.clickStatShareType.clickStatShareTypeInviteFriend){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendClick,
                [ddz.Share.shareKeywordReplace.inviteFriendID]);
        }else {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeOnClickButton,
                [type,imageType,"share",ty.SystemInfo.gameId]);
        }
        ddz.Share.isOnShare = true;
        wx.shareAppMessage({
            title: titleString,
            imageUrl : imagUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (shareTickets,groupMsgInfos) {
                if(type == ty.UserInfo.clickStatShareType.clickStatShareTypeInviteFriend){
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendSuccess,
                        [ddz.Share.shareKeywordReplace.inviteFriendID]);
                }else {
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareSuccess,
                        [type,imageType,"share",ty.SystemInfo.gameId]);
                }

                ddz.Share.sharePoint = sharePoint;
                if (callBackFun){
                    callBackFun();
                }
                hall.LOGD(null, "shareAppMessage+++++++++++++++++"+JSON.stringify(shareTickets)+"+++++++++++++++++"+groupMsgInfos);
            },
            fail : function () {
                hall.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
            }
        });
    },

    shareResults:function (winloses) {
        var shareMap = ddz.gameModel.shareConfig;
        // if(debugMode || !shareMap){
        //     shareMap = ddz.GameWorld.shareConfig.share;
        // }
        if(!shareMap){
            shareMap = ddz.GameWorld.shareConfig.share;
        }
        var shareDetail = shareMap[ty.UserInfo.clickStatShareType.clickStatShareTypeShareResults];
        var massageList = shareDetail.massageList;
        var massageMap = massageList[hall.GlobalFuncs.getRandomNumberBefore(massageList.length)];
        var titleString = hall.GlobalFuncs.replaceKeyWordInString(massageMap.formatString);
        var imageList = shareDetail.imageList;
        var imageMap = imageList[hall.GlobalFuncs.getRandomNumberBefore(imageList.length)];

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
            ddz.Share.shareImformation(ty.UserInfo.clickStatShareType.clickStatShareTypeShareResults,
            "resultImage",titleString,tempFilePath);
            hall.LOGE("","==========tempFilePath================"+tempFilePath);
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
    }
};