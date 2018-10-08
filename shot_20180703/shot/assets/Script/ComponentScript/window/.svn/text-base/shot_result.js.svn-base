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
        rankTexture : cc.Texture2D,
        rankSpriteFrame : cc.SpriteFrame,
        rankSprite : cc.Sprite,

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

    showBestToOthers : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["showBest"]);
        shot.GlobalFuncs.showShareResult();
        // shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeScore);
    },
    playAgain : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["playAgain"]);
        ty.NotificationCenter.trigger(shot.EventType.GAME_START,"start");
        this.shotButton.node.stopAllActions();
        this.node.destroy();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {

        ty.NotificationCenter.listen(shot.EventType.UPDATE_RESULT_RANK,this.setRankInfo,this);

        shot.Share.shareKeywordReplace.theScoreForNow = shot.GameWorld.totalScore;
        if(shot.GameWorld.totalScore >= shot.Share.shareKeywordReplace.bestScoreForSelf){
            shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
            shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
        }
        shot.gameModel.saveScore();
        hall.GlobalFuncs.btnScaleEffect(this.shotButton.node,1.13);

        this.nowScoreLabel.string = shot.Share.shareKeywordReplace.theScoreForNow+"";
        this.bestScoreLabel.string = "本周最佳:"+shot.Share.shareKeywordReplace.bestScoreForSelf ;

        this.setRankInfo();
        shot.GlobalFuncs.showAdBtnWithTag(5004,"gameover");

        var count = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_ADBTN_COUNT_TODAY,0);
        count ++;
        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_ADBTN_COUNT_TODAY,count);
    },

    setRankInfo : function () {
        shot.GlobalFuncs.showAdBtnWithTag(5004,"gameover");

        var openDataContext = shot.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 550;
        sharedCanvas.height = 280;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame(this.rankTexture);
        var texture = this.rankTexture;
        var spriteFrame = this.rankSpriteFrame;
        var sprite = this.rankSprite;
        var main = function () {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, 1/10,5000);

        shot.GlobalFuncs.getThirdRankInfo();
    },

    onDestroy:function(){
        shot.GlobalFuncs.hideAdBtnWithTag(5004,false);
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

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
    //保存到相册
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
    //
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
