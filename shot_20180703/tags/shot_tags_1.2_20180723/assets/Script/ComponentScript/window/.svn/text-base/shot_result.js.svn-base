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
        nowScoreLabel : {
            default : null,
            type : cc.Label
        },
        bestScoreLabel : {
            default : null,
            type : cc.Label
        },
        preAvatarNode : {
            default : null,
            type : cc.Node
        },
        selfAvatarNode : {
            default : null,
            type : cc.Node
        },
        nextAvatarNode : {
            default : null,
            type : cc.Node
        },
        // aniSpriteNode :{
        //     default : null,
        //     type : cc.Node
        // },
        shotButton :{
            default : null,
            type : cc.Button
        }
    },

    onBlack : function () {

    },
    onBackButton : function () {
        this.shotButton.node.stopAllActions();
        var sceneName = 'shot_begin';
        var onLaunched = function () {
        };
        cc.director.loadScene(sceneName,onLaunched);
        this.node.destroy();
    },
    showAllRank : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["showAllRank"]);
        shot.GlobalFuncs.showRankList("");
        // this.node.destroy();
    },
    // secretGift : function () {
    //     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["secretGift"]);
    //     shot.GlobalFuncs.showMysteryGifgBag();
    // },

    inviteFriend : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["inviteFriend"]);
        shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeDiamond);
    },
    showBestToOthers : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["showBest"]);
        shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeScore);
    },
    playAgain : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["playAgain"]);
        ty.NotificationCenter.trigger(shot.EventType.GAME_START,"start");
        this.shotButton.node.stopAllActions();
        this.node.destroy();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {

        // ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE,this.updateShareResult,this);

        shot.Share.shareKeywordReplace.theScoreForNow = shot.GameWorld.totalScore;
        shot.gameModel.saveScore();
        hall.GlobalFuncs.btnScaleEffect(this.shotButton.node,1.13);
        // var lastHighScore = 0;
        var userDataList = JSON.parse(shot.GameWorld.game_friendData);
        var middleInfo = {};
        middleInfo.rank = 1;
        middleInfo.avatarUrl = ty.UserInfo.userPic;
        middleInfo.nickname = ty.UserInfo.userName;
        middleInfo.sumScore = shot.GameWorld.totalScore;
        var haveScore = false;
        var rank = 1;
        if(userDataList && userDataList.length){
            var lengthNumber = userDataList.length;
            for (var  i = 0 ; i < lengthNumber ; i ++){
                var user = userDataList[i];
                if(user.sumScore < shot.GameWorld.totalScore){
                    shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
                    shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
                    haveScore = true;
                    middleInfo.rank = i+1;
                    rank = i+1;
                    var tempUserInfo = middleInfo;
                    for (var j = i ; j < lengthNumber ; j ++){
                        var tempUser = userDataList[j];
                        if(tempUser.userId != ty.UserInfo.userId){
                            tempUserInfo.rank = j+1;
                            userDataList[j].rank = j + 2;
                            var temp = userDataList[j];
                            userDataList[j] = tempUserInfo;
                            tempUserInfo = temp;
                        }else {
                            userDataList[j] = tempUserInfo;
                            break;
                        }
                    }
                    break;
                }
                if(user.userId == ty.UserInfo.userId){
                    shot.Share.shareKeywordReplace.bestScoreForSelf = user.sumScore;
                    haveScore = true;
                    rank = i+1;
                    // this.showAvatar(userDataList,rank);
                    break;
                }
            }
        }else {
            rank = 1;
            userDataList = [];
            userDataList.push(middleInfo);
            shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
            shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
        }
        if(!haveScore){
            rank = userDataList.length +1;
            middleInfo.rank = rank;
            userDataList.push(middleInfo);
            shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
            shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
        }
        this.showAvatar(userDataList,rank);
    },
    showAvatar : function (userDataList,rank) {
        shot.Share.shareKeywordReplace.bestRank = rank;
        if(userDataList.length == 1){
            this.showAvatarOnlyOne(userDataList[0]);
        }else if(userDataList.length == 2){
            this.showAvatarOnlyTwo(userDataList);
        }else {
            this.showAvatarMore(userDataList,rank);
        }
        this.nowScoreLabel.string = shot.Share.shareKeywordReplace.theScoreForNow+"";
        this.bestScoreLabel.string = "本周最佳:"+shot.Share.shareKeywordReplace.bestScoreForSelf ;
    },
    showAvatarOnlyOne : function (bestScoreInfo) {
        this.preAvatarNode.active = false;
        this.nextAvatarNode.active = false;
        var selfAvatar = this.selfAvatarNode.getComponent('shot_avatar');
        selfAvatar.setPersonInformation(bestScoreInfo,true,1);
    },
    showAvatarOnlyTwo : function (avatarList) {
        this.nextAvatarNode.active = false;
        this.preAvatarNode.x = -120;
        this.selfAvatarNode.x = 120;
        var selfAvatar = this.selfAvatarNode.getComponent('shot_avatar');
        var preAvatar = this.preAvatarNode.getComponent('shot_avatar');
        if(avatarList[0].userId == ty.UserInfo.userId){
            preAvatar.setPersonInformation(avatarList[0],true,1);
            selfAvatar.setPersonInformation(avatarList[1],false,2);
        }else {
            preAvatar.setPersonInformation(avatarList[0],false,0);
            selfAvatar.setPersonInformation(avatarList[1],true,1);
        }
    },
    showAvatarMore : function (userDataList,rank) {
        var selfAvatar = this.selfAvatarNode.getComponent('shot_avatar');
        var preAvatar = this.preAvatarNode.getComponent('shot_avatar');
        var nextAvatar = this.nextAvatarNode.getComponent('shot_avatar');
        if(rank == 1){
            preAvatar.setPersonInformation(userDataList[0],true,1);
            selfAvatar.setPersonInformation(userDataList[1],false,0);
            nextAvatar.setPersonInformation(userDataList[2],false,2);
        }else if(rank == userDataList.length){
            preAvatar.setPersonInformation(userDataList[rank-3],false,0);
            selfAvatar.setPersonInformation(userDataList[rank-2],false,2);
            nextAvatar.setPersonInformation(userDataList[rank -1],true,1);
        }else {
            preAvatar.setPersonInformation(userDataList[rank-2],false,0);
            selfAvatar.setPersonInformation(userDataList[rank-1],true,1);
            nextAvatar.setPersonInformation(userDataList[rank],false,2);
        }
    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // update :function(dt) {
    //     // this.aniSpriteNode.rotation += 1;
    // }

    // //添加微信二维码和个人头像
    // saveToPhoneAddQRAndAvatar : function (shareBackImageUrl) {
    //     var qrX = 454 ;
    //     var qrY =  542;
    //     var qrR =  68;
    //     var r = 30;
    //     var textPositionX = 135;
    //     var textPositionY = 588;
    //     var tempCanvas = wx.createCanvas();
    //     tempCanvas.width = 584;
    //     tempCanvas.height = 651;
    //     var context = tempCanvas.getContext("2d");
    //     var image = wx.createImage();
    //     image.src = shareBackImageUrl;
    //     var that = this;
    //     image.onload = function (event) {
    //         var img = event.target;
    //         context.drawImage(img,0,0,584,651);
    //
    //         context.font = "45px arial";
    //         context.fillStyle="#FFFFFF";
    //         context.textAlign = "left";
    //         // var stokeWord = hall.GlobalFuncs.formatGold(shot.gameModel.totalScore) + "米";
    //         var stokeWord = shot.gameModel.totalScore + "米";
    //         context.fillText(stokeWord,textPositionX,textPositionY);
    //
    //         var qrImage = wx.createImage();
    //         qrImage.onload = function (event) {
    //             var img = event.target;
    //             context.drawImage(img,qrX-qrR,qrY-qrR,qrR*2,qrR*2);
    //             context.beginPath();
    //             context.arc(qrX,qrY,r,0,2*Math.PI);
    //             context.arc(86,570,r,0,2*Math.PI);
    //             // context.stroke();
    //             context.clip();
    //             // var avatarPic = wx.createImage();
    //             // avatarPic.onload = function (event) {
    //             //     var img = event.target;
    //             // context.drawImage(img,qrX-r,qrY-r,r*2,r*2);
    //             // context.drawImage(img,56,540,60,60);
    //             context.drawImage(ty.UserInfo.avatarImg,qrX-r,qrY-r,r*2,r*2);
    //             context.drawImage(ty.UserInfo.avatarImg,56,540,60,60);
    //             var tempFilePath = tempCanvas.toTempFilePathSync({
    //                 x: 0,
    //                 y: 0,
    //                 width: 584,
    //                 height:651,
    //                 destWidth: 584,
    //                 destHeight: 651
    //             });
    //             hall.LOGW("========","==============="+tempFilePath);
    //             that.shareBackImageUrl = tempFilePath;
    //             ty.SystemInfo.getImageWithURL(tempFilePath,that.shareSprite);
    //             // };
    //             // avatarPic.src = ty.UserInfo.userPic;
    //         };
    //         qrImage.onerror = function (event) {
    //             hall.LOGW("========","========qrImage.onerror======="+JSON.stringify(arguments));
    //             context.beginPath();
    //             // context.arc(qrX,qrY,r,0,2*Math.PI);
    //             context.arc(86,570,r,0,2*Math.PI);
    //             // context.stroke();
    //             context.clip();
    //             // context.drawImage(ty.UserInfo.avatarImg,qrX-r,qrY-r,r*2,r*2);
    //             context.drawImage(ty.UserInfo.avatarImg,56,540,60,60);
    //             var tempFilePath = tempCanvas.toTempFilePathSync({
    //                 x: 0,
    //                 y: 0,
    //                 width: 584,
    //                 height:651,
    //                 destWidth: 584,
    //                 destHeight: 651
    //             });
    //             hall.LOGW("========","==============="+tempFilePath);
    //             that.shareBackImageUrl = tempFilePath;
    //             ty.SystemInfo.getImageWithURL(tempFilePath,that.shareSprite);
    //         };
    //         qrImage.src = ty.UserInfo.myQrCodeFilePath;
    //     };
    // },
    //
    // //添加微信二维码和个人头像
    // saveToPhoneAddQRAndAvatarOrigin : function (shareBackImageUrl) {
    //     var qrX = 454 ;
    //     var qrY =  542;
    //     var qrR =  68;
    //     var r = 30;
    //     var textPositionX = 150;
    //     var textPositionY = 588;
    //     // if(this.bottomType){
    //     //     qrX = this.bottomType.qrCenterX ;
    //     //     qrY = this.bottomType.qrCenterY ;
    //     //     qrR =  this.bottomType.qrRadius ;
    //     //     r = this.bottomType.avatarRadius ;
    //     //     textPositionX = this.bottomType.textPositionX ;
    //     //     textPositionY = this.bottomType.textPositionY ;
    //     // }
    //     var tempCanvas = wx.createCanvas();
    //     tempCanvas.width = 584;
    //     tempCanvas.height = 651;
    //     var context = tempCanvas.getContext("2d");
    //     var image = wx.createImage();
    //     image.src = shareBackImageUrl;
    //     var that = this;
    //     image.onload = function (event) {
    //         var img = event.target;
    //         context.drawImage(img,0,0,584,651);
    //
    //         context.font = "45px arial";
    //         context.fillStyle="#FFFFFF";
    //         context.textAlign = "left";
    //         // var stokeWord = hall.GlobalFuncs.formatGold(shot.gameModel.totalScore) + "米";
    //         var stokeWord = shot.gameModel.totalScore + "米";
    //         context.fillText(stokeWord,textPositionX,textPositionY);
    //
    //         // context.beginPath();
    //         // context.arc(qrX,qrY+that.exHeight*2,qrR+5,0,2*Math.PI);
    //         // context.clip();
    //         var local_uuid = hall.GlobalFuncs.getLocalUuid();
    //         var sdkPath = ty.SystemInfo.loginUrl;
    //         var pars = {
    //             appId: ty.SystemInfo.appId,
    //             wxAppId: ty.SystemInfo.wxAppId,
    //             clientId: ty.SystemInfo.clientId,
    //             imei: 'null',
    //             uuid : local_uuid,
    //             width : 280,
    //             b64 : true,
    //             scene : '1,' + ty.UserInfo.userId
    //         };
    //         hall.LOGD(null, 'qrcode,params:' + JSON.stringify(pars));
    //         wx.request({
    //             url: sdkPath + 'open/v6/user/Getwxacodeunlimit',
    //             header: {
    //                 'content-type': 'application/x-www-form-urlencoded'
    //             },
    //             data: pars,
    //             method:'POST',
    //             success: function(params) {
    //                 // hall.LOGW("===","========="+JSON.stringify(params));
    //                 var b64Str =  params.data.result.img;
    //                 var fs = wx.getFileSystemManager();
    //                 var filePath = wx.env.USER_DATA_PATH + '/qr.png';
    //                 // fs.writeFileSync(filePath ,b64Str , 'base64');
    //                 fs.writeFile({
    //                     filePath : filePath,
    //                     data : b64Str,
    //                     encoding : 'base64',
    //                     success : function () {
    //                         var qrImage = wx.createImage();
    //                         qrImage.onload = function (event) {
    //                             var img = event.target;
    //                             context.drawImage(img,qrX-qrR,qrY-qrR,qrR*2,qrR*2);
    //                             context.beginPath();
    //                             context.arc(qrX,qrY,r,0,2*Math.PI);
    //                             context.arc(86,570,r,0,2*Math.PI);
    //                             // context.stroke();
    //                             context.clip();
    //                             var avatarPic = wx.createImage();
    //                             avatarPic.onload = function (event) {
    //                                 var img = event.target;
    //                                 context.drawImage(img,qrX-r,qrY-r,r*2,r*2);
    //                                 context.drawImage(img,56,540,60,60);
    //                                 var tempFilePath = tempCanvas.toTempFilePathSync({
    //                                     x: 0,
    //                                     y: 0,
    //                                     width: 584,
    //                                     height:651,
    //                                     destWidth: 584,
    //                                     destHeight: 651
    //                                 });
    //                                 hall.LOGW("========","==============="+tempFilePath);
    //                                 that.shareBackImageUrl = tempFilePath;
    //                                 ty.SystemInfo.getImageWithURL(tempFilePath,that.shareSprite);
    //                             };
    //                             avatarPic.src = ty.UserInfo.userPic;
    //                         };
    //                         qrImage.onerror = function (event) {
    //                             hall.LOGW("========","========qrImage.onerror======="+JSON.stringify(arguments));
    //                         };
    //                         qrImage.src = filePath;
    //                     },
    //                     fail: function(params) {
    //                     },
    //                     complete: function(params) {
    //                     }
    //                 });},
    //             fail: function(params) {
    //             },
    //             complete: function(params) {
    //             }
    //         });
    //     };
    // },
    // //保存到相册
    // saveImageToPhoneWithUrl : function (tempFilePath) {
    //     var saveImageToPhone = function () {
    //         wx.saveImageToPhotosAlbum({
    //             filePath : tempFilePath,
    //             success:function(res) {
    //                 shot.GlobalFuncs.showNoDiamondToastTip("保存成功");
    //                 hall.LOGW("========","=======success========"+JSON.stringify(res));
    //             },
    //             fail: function(params) {
    //                 hall.LOGW("========","=======fail========"+JSON.stringify(params));
    //             },
    //             complete: function(params) {
    //             }
    //         });
    //     };
    //     wx.getSetting({
    //         success:function(res) {
    //             if (!res.authSetting['scope.writePhotosAlbum']) {
    //                 wx.authorize({
    //                     scope : "scope.writePhotosAlbum",
    //                     success : function () {
    //                         saveImageToPhone();
    //                     },
    //                     fail:function () {
    //                         hall.LOGW(null, "授权使用相册失败!");
    //                         wx.showModal({
    //                             title:'提示',
    //                             content:'保存图片,需要您授权使用相册,点击确定手动进行授权!',
    //                             showCancel:true,
    //                             cancelText:'取消',
    //                             confirmText:'确定',
    //                             success:function (res) {
    //                                 if (res.confirm) {
    //                                     wx.openSetting();
    //                                 }
    //                             }
    //                         });
    //
    //                     },
    //                     complete:function () {
    //                     }
    //                 });
    //             }
    //             else{
    //                 saveImageToPhone();
    //             }
    //         }
    //     });
    // },

    // onDebugButton : function () {
    //     this.debugCount ++ ;
    //     if(this.debugCount == 10){
    //         shot.GlobalFuncs.showDebugPanel();
    //     }
    // },
    // saveWechatMoments : function () {
    //     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["saveWechatMoments"]);
    //     this.saveImageToPhoneWithUrl(this.shareBackImageUrl);
    // },
    // updateShareResult : function (shareType) {
    //     hall.LOGE("=====","====shot.Share.resultType==="+shot.Share.resultType);
    //     if(shareType == shot.Share.onShareType.clickStatShareTypeShowHighTotalFirst ||
    //         shareType == shot.Share.onShareType.clickStatShareTypeShowHighTotalSecond ||
    //         shareType == shot.Share.onShareType.clickStatShareTypeShowHighTotalThird){
    //         if(shot.Share.resultType == shot.Share.ShareState.isNotAGroupChat){
    //             shot.GlobalFuncs.showNoDiamondToastTip("需要分享到群");
    //         }else if(shot.Share.resultType == shot.Share.ShareState.suscessShare){
    //             shot.GlobalFuncs.showNoDiamondToastTip("分享成功");
    //         }
    //     }else if(shareType == shot.Share.onShareType.clickStatShareTypeInviteFriendTOBattle){
    //         shot.GlobalFuncs.showNoDiamondToastTip("分享成功");
    //     }
    // },
});
