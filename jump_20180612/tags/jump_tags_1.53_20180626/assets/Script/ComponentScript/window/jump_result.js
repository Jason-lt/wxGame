// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        shareSprite : {
            default : null,
            type : cc.Sprite
        },
        countLabel : {
            default : null,
            type : cc.Label
        },

        shareBackImageUrl : "",

        layoutData : null,
        bottomType : null,
        scoreType : "",
        debugCount : 0
    },
    onDebugButton : function () {
        this.debugCount ++ ;
        if(this.debugCount == 10){
            jump.GlobalFuncs.showDebugPanel();
        }
    },
    onBackButton : function () {
        var sceneName = 'jump_begin';
        var onLaunched = function () {
        };
        cc.director.loadScene(sceneName,onLaunched);
        this.node.destroy();
    },
    playAgainAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["playAgain"]);
        ty.NotificationCenter.trigger(jump.EventType.GAME_RESTART,"start");
        this.node.destroy();
    },
    onBlack : function () {

    },
    saveWechatMoments : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["saveWechatMoments"]);
        this.saveImageToPhoneWithUrl(this.shareBackImageUrl);
    },
    diamondAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["resultDiamond"]);
        jump.GlobalFuncs.showDiamondGift(0);
    },
    inviteFriend : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["inviteFriendBattle"]);
        jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeInviteFriendTOBattle);
    },
    showBestToOthers : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["showBest"]);
        switch (this.scoreType){
            case "show_level_01":{
                jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeShowHighTotalFirst);
                break;
            }
            case "show_level_02":{
                jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeShowHighTotalSecond);
                break;
            }
            case "show_level_03":{
                jump.Share.shareWithType(jump.Share.onShareType.clickStatShareTypeShowHighTotalThird);
                break;
            }
            default : break;
        }
    },
    updateShareResult : function (shareType) {
        hall.LOGE("=====","====jump.Share.resultType==="+jump.Share.resultType);
        if(shareType == jump.Share.onShareType.clickStatShareTypeShowHighTotalFirst ||
            shareType == jump.Share.onShareType.clickStatShareTypeShowHighTotalSecond ||
            shareType == jump.Share.onShareType.clickStatShareTypeShowHighTotalThird){
            if(jump.Share.resultType == jump.Share.ShareState.isNotAGroupChat){
                jump.GlobalFuncs.showNoDiamondToastTip("需要分享到群");
            }else if(jump.Share.resultType == jump.Share.ShareState.suscessShare){
                jump.GlobalFuncs.showNoDiamondToastTip("分享成功");
            }
        }else if(shareType == jump.Share.onShareType.clickStatShareTypeInviteFriendTOBattle){
            jump.GlobalFuncs.showNoDiamondToastTip("分享成功");
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        // var avatarUrl = ty.UserInfo.userPic;
        // if(!avatarUrl || avatarUrl == ""){
        //     avatarUrl = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
        // }
        // ty.SystemInfo.getImageWithURL(avatarUrl,this.avatarSprite);
        // this.scoreLabel.string = jump.gameModel.totalScore + "分";

        ty.NotificationCenter.listen(jump.EventType.UPDATE_SHARE_STATE,this.updateShareResult,this);
        this.countLabel.string = "x"+jump.gameModel.assetsCounts;

        jump.Share.shareKeywordReplace.theHighForMe = jump.gameModel.totalScore;

        var lastHighScore = 0;
        var userDataList = JSON.parse(jump.gameModel.game_friendData);
        var haveScore = false;
        if(userDataList && userDataList.length){
            for (var i = userDataList.length-1 ; i >= 0 ; i --){
                var user = userDataList[i];
                var score = user.sumScore;
                if(user.userId == ty.UserInfo.userId){
                    lastHighScore = score;
                    haveScore = true;
                    if(score < jump.gameModel.totalScore && ty.UserInfo.userId != 0){
                        jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
                        jump.Share.shareKeywordReplace.bestScoreForSelf = jump.gameModel.totalScore + "";
                    }else {
                        jump.Share.shareKeywordReplace.bestScoreForSelf = score + "";
                    }
                }
            }
        }else if(ty.UserInfo.userId != 0){
            jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
            jump.Share.shareKeywordReplace.bestScoreForSelf = jump.gameModel.totalScore + "";
        }
        if(!haveScore && ty.UserInfo.userId != 0){
            jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
            jump.Share.shareKeywordReplace.bestScoreForSelf = jump.gameModel.totalScore + "";
        }


        var type = "show_level_01";
        this.shareBackImageUrl = "res/raw-assets/resources/table/nopack/shareMoment_level1_0611_01.png";
        if(jump.gameModel.totalScore < 5000){
            type = "show_level_03";
            this.shareBackImageUrl = "res/raw-assets/resources/table/nopack/shareMoment_level3_0611_01.png";
        }else if(lastHighScore > jump.gameModel.totalScore){
            type = "show_level_02";
            this.shareBackImageUrl = "res/raw-assets/resources/table/nopack/shareMoment_level2_0611_01.png";
        }
        this.scoreType = type;

        this.saveToPhoneAddQRAndAvatar(this.shareBackImageUrl);

        // var momentsConfig = jump.gameModel.shareMoments;
        // if(!momentsConfig){
        //     momentsConfig = jump.Share.shareMoments;
        // }
        // // var momentsConfig = jump.Share.shareMoments;
        // var typeConfigList = momentsConfig[type];
        //
        // var typeNumberString = hall.GlobalFuncs.ReadStringFromLocalStorage(jump.gameModel.SHARE_MOMENTS_NUMBER, "");
        // var countDic = {};
        // if(typeNumberString != ""){
        //     countDic = JSON.parse(typeNumberString);
        // }
        // var count = 0;
        // if(countDic[type] || countDic[type] == 0){
        //     count = countDic[type];
        //     count ++;
        //     if(count >= typeConfigList.length){
        //         count = 0;
        //     }
        // }
        // countDic[type] = count;
        // this.layoutData = typeConfigList[count];
        // hall.GlobalFuncs.setInLocalStorage(jump.gameModel.SHARE_MOMENTS_NUMBER, JSON.stringify(countDic));
        // this.shareBackImageUrl = "res/raw-assets/resources/table/nopack/adPic.png";
        // // var tempBackUrl;
        // if(this.layoutData && this.layoutData.backUrl){
        //     this.shareBackImageUrl = ty.SystemInfo.cdnPath + this.layoutData.backUrl;
        // }

        // this.shareBackImageUrl = "res/raw-assets/resources/table/nopack/adPic.png";
        // this.bottomType = momentsConfig.bottomType[this.layoutData.bottomType];
        //
        // // this.shareBackImageUrl = "res/raw-assets/resources/table/nopack/adPic.png";
        // this.saveToPhoneAddQRAndAvatar(this.shareBackImageUrl);
    },
    //添加微信二维码和个人头像
    saveToPhoneAddQRAndAvatar : function (shareBackImageUrl) {
        var qrX = 454 ;
        var qrY =  542;
        var qrR =  68;
        var r = 30;
        var textPositionX = 135;
        var textPositionY = 588;
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 584;
        tempCanvas.height = 651;
        var context = tempCanvas.getContext("2d");
        var image = wx.createImage();
        image.src = shareBackImageUrl;
        var that = this;
        image.onload = function (event) {
            var img = event.target;
            context.drawImage(img,0,0,584,651);

            context.font = "45px arial";
            context.fillStyle="#FFFFFF";
            context.textAlign = "left";
            // var stokeWord = hall.GlobalFuncs.formatGold(jump.gameModel.totalScore) + "米";
            var stokeWord = jump.gameModel.totalScore + "米";
            context.fillText(stokeWord,textPositionX,textPositionY);

            var qrImage = wx.createImage();
            qrImage.onload = function (event) {
                var img = event.target;
                context.drawImage(img,qrX-qrR,qrY-qrR,qrR*2,qrR*2);
                context.beginPath();
                context.arc(qrX,qrY,r,0,2*Math.PI);
                context.arc(86,570,r,0,2*Math.PI);
                // context.stroke();
                context.clip();
                // var avatarPic = wx.createImage();
                // avatarPic.onload = function (event) {
                //     var img = event.target;
                // context.drawImage(img,qrX-r,qrY-r,r*2,r*2);
                // context.drawImage(img,56,540,60,60);
                context.drawImage(ty.UserInfo.avatarImg,qrX-r,qrY-r,r*2,r*2);
                context.drawImage(ty.UserInfo.avatarImg,56,540,60,60);
                var tempFilePath = tempCanvas.toTempFilePathSync({
                    x: 0,
                    y: 0,
                    width: 584,
                    height:651,
                    destWidth: 584,
                    destHeight: 651
                });
                hall.LOGW("========","==============="+tempFilePath);
                that.shareBackImageUrl = tempFilePath;
                ty.SystemInfo.getImageWithURL(tempFilePath,that.shareSprite);
                // };
                // avatarPic.src = ty.UserInfo.userPic;
            };
            qrImage.onerror = function (event) {
                hall.LOGW("========","========qrImage.onerror======="+JSON.stringify(arguments));
                context.beginPath();
                // context.arc(qrX,qrY,r,0,2*Math.PI);
                context.arc(86,570,r,0,2*Math.PI);
                // context.stroke();
                context.clip();
                // context.drawImage(ty.UserInfo.avatarImg,qrX-r,qrY-r,r*2,r*2);
                context.drawImage(ty.UserInfo.avatarImg,56,540,60,60);
                var tempFilePath = tempCanvas.toTempFilePathSync({
                    x: 0,
                    y: 0,
                    width: 584,
                    height:651,
                    destWidth: 584,
                    destHeight: 651
                });
                hall.LOGW("========","==============="+tempFilePath);
                that.shareBackImageUrl = tempFilePath;
                ty.SystemInfo.getImageWithURL(tempFilePath,that.shareSprite);
            };
            qrImage.src = ty.UserInfo.myQrCodeFilePath;
        };
    },

    //添加微信二维码和个人头像
    saveToPhoneAddQRAndAvatarOrigin : function (shareBackImageUrl) {
        var qrX = 454 ;
        var qrY =  542;
        var qrR =  68;
        var r = 30;
        var textPositionX = 150;
        var textPositionY = 588;
        // if(this.bottomType){
        //     qrX = this.bottomType.qrCenterX ;
        //     qrY = this.bottomType.qrCenterY ;
        //     qrR =  this.bottomType.qrRadius ;
        //     r = this.bottomType.avatarRadius ;
        //     textPositionX = this.bottomType.textPositionX ;
        //     textPositionY = this.bottomType.textPositionY ;
        // }
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 584;
        tempCanvas.height = 651;
        var context = tempCanvas.getContext("2d");
        var image = wx.createImage();
        image.src = shareBackImageUrl;
        var that = this;
        image.onload = function (event) {
            var img = event.target;
            context.drawImage(img,0,0,584,651);

            context.font = "45px arial";
            context.fillStyle="#FFFFFF";
            context.textAlign = "left";
            // var stokeWord = hall.GlobalFuncs.formatGold(jump.gameModel.totalScore) + "米";
            var stokeWord = jump.gameModel.totalScore + "米";
            context.fillText(stokeWord,textPositionX,textPositionY);

            // context.beginPath();
            // context.arc(qrX,qrY+that.exHeight*2,qrR+5,0,2*Math.PI);
            // context.clip();
            var local_uuid = hall.GlobalFuncs.getLocalUuid();
            var sdkPath = ty.SystemInfo.loginUrl;
            var pars = {
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                imei: 'null',
                uuid : local_uuid,
                width : 280,
                b64 : true,
                scene : '1,' + ty.UserInfo.userId
            };
            hall.LOGD(null, 'qrcode,params:' + JSON.stringify(pars));
            wx.request({
                url: sdkPath + 'open/v6/user/Getwxacodeunlimit',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: pars,
                method:'POST',
                success: function(params) {
                    // hall.LOGW("===","========="+JSON.stringify(params));
                    var b64Str =  params.data.result.img;
                    var fs = wx.getFileSystemManager();
                    var filePath = wx.env.USER_DATA_PATH + '/qr.png';
                    // fs.writeFileSync(filePath ,b64Str , 'base64');
                    fs.writeFile({
                        filePath : filePath,
                        data : b64Str,
                        encoding : 'base64',
                        success : function () {
                            var qrImage = wx.createImage();
                            qrImage.onload = function (event) {
                                var img = event.target;
                                context.drawImage(img,qrX-qrR,qrY-qrR,qrR*2,qrR*2);
                                context.beginPath();
                                context.arc(qrX,qrY,r,0,2*Math.PI);
                                context.arc(86,570,r,0,2*Math.PI);
                                // context.stroke();
                                context.clip();
                                var avatarPic = wx.createImage();
                                avatarPic.onload = function (event) {
                                    var img = event.target;
                                    context.drawImage(img,qrX-r,qrY-r,r*2,r*2);
                                    context.drawImage(img,56,540,60,60);
                                    var tempFilePath = tempCanvas.toTempFilePathSync({
                                        x: 0,
                                        y: 0,
                                        width: 584,
                                        height:651,
                                        destWidth: 584,
                                        destHeight: 651
                                    });
                                    hall.LOGW("========","==============="+tempFilePath);
                                    that.shareBackImageUrl = tempFilePath;
                                    ty.SystemInfo.getImageWithURL(tempFilePath,that.shareSprite);
                                };
                                avatarPic.src = ty.UserInfo.userPic;
                            };
                            qrImage.onerror = function (event) {
                                hall.LOGW("========","========qrImage.onerror======="+JSON.stringify(arguments));
                            };
                            qrImage.src = filePath;
                        },
                        fail: function(params) {
                        },
                        complete: function(params) {
                        }
                    });},
                fail: function(params) {
                },
                complete: function(params) {
                }
            });
        };
    },
    //保存到相册
    saveImageToPhoneWithUrl : function (tempFilePath) {
        var saveImageToPhone = function () {
            wx.saveImageToPhotosAlbum({
                filePath : tempFilePath,
                success:function(res) {
                    jump.GlobalFuncs.showNoDiamondToastTip("保存成功");
                    hall.LOGW("========","=======success========"+JSON.stringify(res));
                },
                fail: function(params) {
                    hall.LOGW("========","=======fail========"+JSON.stringify(params));
                },
                complete: function(params) {
                }
            });
        };
        wx.getSetting({
            success:function(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope : "scope.writePhotosAlbum",
                        success : function () {
                            saveImageToPhone();
                        },
                        fail:function () {
                            hall.LOGW(null, "授权使用相册失败!");
                            wx.showModal({
                                title:'提示',
                                content:'保存图片,需要您授权使用相册,点击确定手动进行授权!',
                                showCancel:true,
                                cancelText:'取消',
                                confirmText:'确定',
                                success:function (res) {
                                    if (res.confirm) {
                                        wx.openSetting();
                                    }
                                }
                            });

                        },
                        complete:function () {
                        }
                    });
                }
                else{
                    saveImageToPhone();
                }
            }
        });
    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
