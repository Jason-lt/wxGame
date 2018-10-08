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
        backButton : {
            default : null,
            type : cc.Button
        },
        backSprite : {
            default : null,
            type : cc.Sprite
        },
        texture:cc.Texture2D,
        spriteFrame:{
            default : null,
            type : cc.SpriteFrame
        },
        shareButton : {
            default : null,
            type : cc.Button
        },
        ShowySaveButton : {
            default : null,
            type : cc.Button
        },
        ShowyShareButton : {
            default : null,
            type : cc.Button
        },
        loadingNode : {
            default : null,
            type : cc.Node
        },

        backImageUrl : "",
        shareBackImageUrl : "",
        baseUrl : "",
        exWidth : 0,
        exHeight : 0,
        windowHeight : 1136,
        shareType : "",
        // showData : {},
        layoutData : {},
        bottomType : {},
        cardInfoArray : []
        // QRImageUrl : ""
    },

    backAction : function () {
      this.node.destroy();
    },

    onLoad : function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        this.baseUrl = wx.env.USER_DATA_PATH + "/res/raw-assets/resources/table/";
        var winSize = cc.director.getWinSize();
        if(winSize.height/1136 > winSize.width/640){
            this.exWidth = ((winSize.height*640/1136)-640)/2;
            this.exHeight = (winSize.height-1136)/2;
            this.windowHeight = winSize.height;
        }
        hall.adManager.destroyWidthBannerAd();
    },

    //type:
    //invite
    // showy_highPower
    // showy_hughTotal//showy_highTotal
    // showy_spring
    // showy_winningStreak
    setShareImageType : function (type,data) {
        this.loadingNode.active = true;
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow, [type]);
        this.shareType = type;
        // this.showData = data;

        //取对应数值
        this.layoutData = {};
        var momentsConfig = ddz.gameModel.shareMoments;
        if(!momentsConfig){
            momentsConfig = ddz.Share.shareMoments;
        }
        var typeConfigList = momentsConfig[type];
        var bottomType = momentsConfig.bottomType;

        var typeNumberString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.SHARE_MOMENTS_NUMBER, "");
        var countDic = {};
        if(typeNumberString != ""){
            countDic = JSON.parse(typeNumberString);
        }
        var count = 0;
        if(countDic[type] || countDic[type] == 0){
            count = countDic[type];
            count ++;
            if(count >= typeConfigList.length){
                count = 0;
            }
        }
        countDic[type] = count;
        this.layoutData = typeConfigList[count];
        hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.SHARE_MOMENTS_NUMBER, JSON.stringify(countDic));
        this.bottomType = bottomType[this.layoutData.bottomType];

        var tempBackUrl =  this.baseUrl+"shareBackImage/share_moments_invite.jpg";
        this.backImageUrl = tempBackUrl.replace("invite",type);
        // var tempBackUrl;
        if(this.layoutData && this.layoutData.backUrl){
            tempBackUrl = ty.SystemInfo.cdnPath + this.layoutData.backUrl;
            this.backImageUrl = tempBackUrl;
        }


        this.shareBackImageUrl = this.backImageUrl;
        if(type == "invite"){
            // var index = hall.GlobalFuncs.getRandomNumberBefore(4);
            // this.backImageUrl =  this.baseUrl+"shareBackImage/share_moments_invite"+index+".jpg";
            this.changeBackSprite(this.backImageUrl);
        }else {
            this.shareButton.node.active = false;
            this.ShowySaveButton.node.active = true;
            this.ShowyShareButton.node.active = true;
            var number = type == "showy_highTotal" ? data.chips : type == "showy_winningStreak" ?  data.counts : data.multi;
            this.setTitleImage(number,data.percent);
            // var number = type == "showy_highTotal"? 9625000 : 1024;
            // this.setTitleImage(number,99);

            ddz.Share.shareKeywordReplace.goldWinReward = number;
            ddz.Share.shareKeywordReplace.surpassPercent = data.percent;
        }
    },

    changeBackSprite : function (backUrl) {
        this.shareBackImageUrl = backUrl;
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 640;
        tempCanvas.height = this.windowHeight;
        var context = tempCanvas.getContext("2d");
        var image = wx.createImage();
        image.src = backUrl;
        var that = this;
        image.onload = function (event) {
            var img = event.target;
            if(that.shareType == "invite"){
                context.drawImage(img,-that.exWidth,0,640+that.exWidth*2,that.windowHeight);
            }else {
                context.drawImage(img,0,0,640,that.windowHeight);
            }
            that.texture = new cc.Texture2D();
            that.spriteFrame = new cc.SpriteFrame(that.texture);
            that.texture.initWithElement(tempCanvas);
            that.texture.handleLoadedTexture();
            that.backSprite.spriteFrame = that.spriteFrame;
            that.backSprite.spriteFrame._refreshTexture(that.texture);
            that.backSprite.node.height = that.windowHeight;
            that.loadingNode.active = false;
        };
    },

    showySaveToPhone : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["saveToPhone",this.shareType]);
        this.saveToPhoneAddQRAndAvatar(this.shareBackImageUrl);
    },

    showyShareToFriend : function () {
        switch (this.shareType){
            case "showy_highPower":
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGoldHighPower);
                break;
            case "showy_spring":
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGoldSpring);
                break;
            case "showy_winningStreak":
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGoldWinStreak);
                break;
            case "showy_highTotal":
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGoldHighTotal);
                break;
            default:break;
        }
    },

    //邀请好友保存到手机分享
    saveToPhone : function () {
        this.saveToPhoneAddQRAndAvatar(this.shareBackImageUrl);
        // this.setTitleImage(125,"94%","showy_winningStreak");
    },
    //添加宣传标题
    setTitleImage : function (number,pers) {
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 640;
        tempCanvas.height = this.windowHeight;
        var context = tempCanvas.getContext("2d");
        var image = wx.createImage();
        image.src = this.backImageUrl;
        var that = this;
        image.onload = function (event) {
            var img = event.target;
            context.drawImage(img,-that.exWidth,0,640+that.exWidth*2,that.windowHeight);

            context.font = "bold 92px arial";
            // var grd=context.createLinearGradient(0,0,0,88);
            // grd.addColorStop(0,"#f1fffe");
            // grd.addColorStop(0.64,"#f1fffe");
            // grd.addColorStop(0.66,"#bafffb");
            // grd.addColorStop(1,"#bafffb");
            // context.fillStyle=grd;
            context.fillStyle="#FFFFFF";
            context.textAlign = "center";
            var word = that.shareType == "showy_highTotal" ? "总奖金"+hall.GlobalFuncs.formatGold(number) :
                that.shareType == "showy_winningStreak" ? "连胜" : "倍";
            var stokeWord = that.shareType == "showy_highTotal" ? word : "打出"+ number+word;
            // context.fillText(stokeWord,320,88+that.exHeight+55);
            context.fillText(stokeWord,320,143);

            context.font = "50px Arial";
            // context.fillStyle = "#FFFFFF";
            // context.textAlign = "center";
            // context.fillText("超越全国"+pers+"%玩家",320,173+that.exHeight+55);
            context.fillText("超越全国"+pers+"%玩家",320,228);
            var tempFilePath = tempCanvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: 640,
                height:that.windowHeight,
                destWidth: 640,
                destHeight:that.windowHeight

            });
            that.setCardsInformation(tempFilePath);
        };
    },
    //添加手牌
    addCardsWithImage : function (backImageUrl) {
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 640;
        tempCanvas.height = this.windowHeight;
        var context = tempCanvas.getContext("2d");
        var image = wx.createImage();
        image.src = backImageUrl;
        var that = this;
        image.onload = function (event) {
            var img = event.target;
            // context.drawImage(img, 0, 0, 640, 1136);
            context.drawImage(img,0,0,640,that.windowHeight);

            var cardNumbers = that.cardInfoArray.length;
            // var cardNumbers = 17;
            var cardNow = 0;

            var originX = 34;
            var originY = 656+that.exHeight*2;
            var gapX = 46;
            var gapY = 94;
            var breakLine = 10;
            var originWidth = [116,34.5,26,72,74,26];
            var originHeight = [168,36,26,72,62,79.5];
            var exX = 0;
            if(cardNumbers == 17){
                gapX = 49;
                breakLine = 9;
                exX = gapX/2;
            }

            var addCards = function (imageUrlList,toX,toY) {
                var image = wx.createImage();
                image.toX = toX;
                image.toY = toY;
                image.toWidth = originWidth[0];
                image.toHeight = originHeight[0];
                image.onload = function (sunEvent) {
                    var img = sunEvent.target;
                    context.drawImage(img, img.toX,  img.toY, img.toWidth, img.toHeight);
                    var colorU = imageUrlList[2];
                    if(colorU == ""){
                        var sunImage = wx.createImage();
                        sunImage.toX =  toX+8;
                        sunImage.toY =  toY+8;
                        sunImage.toWidth = originWidth[5];
                        sunImage.toHeight = originHeight[5];
                        sunImage.onload = function (event) {
                            var subImg = event.target;
                            context.drawImage(subImg, subImg.toX, subImg.toY, subImg.toWidth, subImg.toHeight);
                            cardCallBack();
                        };
                        sunImage.src = imageUrlList[1];
                    }else {
                        var number = 0;
                        for (var i = 1 ; i < imageUrlList.length ; i ++ ){
                            var sunImage = wx.createImage();
                            sunImage.toX = i == 1 ? toX+8 : i == 2 ? toX+14 : i == 3 ? toX+36 : toX+42;
                            sunImage.toY = i == 1 ? toY+12 : i == 2 ? toY+57 : i == 3 ? toY+84 : toY+0;
                            sunImage.toWidth = originWidth[i];
                            sunImage.toHeight = originHeight[i];
                            sunImage.onload = function (event) {
                                number ++;
                                var subImg = event.target;
                                context.drawImage(subImg, subImg.toX, subImg.toY, subImg.toWidth, subImg.toHeight);
                                if (number == imageUrlList.length-1){
                                    cardCallBack();
                                }
                            };
                            sunImage.src = imageUrlList[i];
                        }
                    }
                };
                // image.src = "res/raw-assets/resources/table/ddz_poker/ddz_card_fore_back.png";
                image.src = imageUrlList[0];
            };
            var cardCallBack = function () {
                cardNow ++;
                if(cardNow < cardNumbers){
                    var toY = cardNow > breakLine ? originY+gapY : originY;
                    var toX = cardNow > breakLine ? originX+gapX*(cardNow-breakLine)+exX : originX+gapX*cardNow;
                    // addCards("res/raw-assets/resources/table/ddz_poker/ddz_card_fore_back.png",toX,toY);
                    var cardIn = that.cardInfoArray[cardNow];
                    var imageList = [that.baseUrl+"ddz_poker/ddz_card_fore_back.png",
                        cardIn.numberUrl,
                        cardIn.colorUrl];
                    if (cardNow == breakLine || cardNow == cardNumbers-1){
                        imageList.push(cardIn.colorUrl);
                        if(cardNumbers == 20){
                            imageList.push(that.baseUrl+"ddz_poker/ddz_dizhutag.png");
                        }
                    }
                    addCards(imageList,toX,toY);

                }else {
                    var tempFilePath = tempCanvas.toTempFilePathSync({
                        x: 0,
                        y: 0,
                        width: 640,
                        height:that.windowHeight,
                        destWidth: 640,
                        destHeight:that.windowHeight

                        // x: 0,
                        // y: 0,
                        // width: 640,
                        // height:1136,
                        // destWidth: 640,
                        // destHeight: 1136
                    });
                    that.changeBackSprite(tempFilePath);
                    // that.saveToPhoneAddQRAndAvatar(tempFilePath);
                    hall.LOGW("========","==============="+tempFilePath);
                }
            };

            var cardIn = that.cardInfoArray[0];
            addCards([that.baseUrl+"ddz_poker/ddz_card_fore_back.png",
                cardIn.numberUrl,
                cardIn.colorUrl],originX,originY);
        };
    },
    //添加微信二维码和个人头像
    saveToPhoneAddQRAndAvatar : function (shareBackImageUrl) {
        var bottomHeight = this.bottomType.bottomHeight || 182;
        var qrX = this.bottomType.qrCenterX || 530 ;
        var qrY = this.bottomType.qrCenterY || 1028;
        var qrR = this.bottomType.qrRadius || 72;
        var r = this.bottomType.avatarRadius || 32;
        // var bottomHeight = 182;
        // var qrX = 530 ;
        // var qrY =  1028;
        // var qrR =  72;
        // var r = 32;
        var tempBackUrl;
        if(this.bottomType && this.bottomType.bottomUrl){
            tempBackUrl = ty.SystemInfo.cdnPath+this.bottomType.bottomUrl ;
        }else {
            tempBackUrl = wx.env.USER_DATA_PATH +  "/res/raw-assets/resources/table/shareBackImage/shareTo_moments_bottom.jpg";
        }
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 640;
        tempCanvas.height = this.windowHeight;
        var context = tempCanvas.getContext("2d");
        var image = wx.createImage();
        image.src = shareBackImageUrl;
        var that = this;
        image.onload = function (event) {
            var img = event.target;
            if(that.shareType == "invite"){
                context.drawImage(img,-that.exWidth,0,640+that.exWidth*2,that.windowHeight);
                // tempBackUrl = wx.env.USER_DATA_PATH +  "/res/raw-assets/resources/table/shareBackImage/shareTo_moments_bottom2.png";
                // bottomHeight = 254;
                // qrX = 508;
                // qrY = 987;
                // qrR = 87;
                // r = 39;
            }else {
                context.drawImage(img,0,0,640,that.windowHeight);
            }
            //添加白色底图
            var seImage = wx.createImage();
            seImage.src = tempBackUrl;
            seImage.onload = function (event) {
                var img = event.target;
                context.drawImage(img,0,1136-bottomHeight+that.exHeight*2,640,bottomHeight);
                context.beginPath();
                context.arc(qrX,qrY+that.exHeight*2,qrR+5,0,2*Math.PI);
                // context.stroke();
                context.clip();
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
                                    context.drawImage(img,qrX-qrR,qrY-qrR+that.exHeight*2,qrR*2,qrR*2);
                                    context.beginPath();
                                    context.arc(qrX,qrY+that.exHeight*2,r,0,2*Math.PI);
                                    context.stroke();
                                    context.clip();
                                    var avatarPic = wx.createImage();
                                    avatarPic.onload = function (event) {
                                        var img = event.target;
                                        context.drawImage(img,qrX-r,qrY-r+that.exHeight*2,r*2,r*2);
                                        var tempFilePath = tempCanvas.toTempFilePathSync({
                                            x: 0,
                                            y: 0,
                                            width: 640,
                                            height:that.windowHeight,
                                            destWidth: 640,
                                            destHeight: that.windowHeight
                                        });
                                        hall.LOGW("========","==============="+tempFilePath);
                                        that.saveImageToPhoneWithUrl(tempFilePath);
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
        };
    },
    //保存到相册
    saveImageToPhoneWithUrl : function (tempFilePath) {
        var that = this;
        var saveImageToPhone = function () {
            wx.saveImageToPhotosAlbum({
                filePath : tempFilePath,
                success:function(res) {
                    ddz.GlobalFuncs.showNormalTipsWindow("图片已保存到手机相册\n快去朋友圈分享吧",[{title:"确定",callFunc:function () {
                        if(that.shareType == "invite"){
                            that.node.destroy();
                        }
                    }}]);
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
                            hall.MsgBoxManager.showToast({title : '授权失败,相册功能不可用,请手动进行授权!'});
                            ty.Timer.setTimer(cc.director, function () {
                                wx.openSetting();
                            }, 2, 0);
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

    setCardsInformation : function (backImageUrl) {
        var saveCardsString =  hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ORIGINCARDS, "{}");
        var saveCardsDic = JSON.parse(saveCardsString);
        var cards = saveCardsDic.myCards;
        if(!cards || !cards.length || cards.length < 17){
            //TODO: 测试
            cards = [52,6,19,8,21,0,13,51,43,42,37,29,25,24,49,23,2,39,15,53];
        }
        // cards = [52,6,19,8,21,0,13,51,43,42,37,29,25,24,49,23,2,39,15,53];
        var cardInfoArray = [];
        if(cards && cards.length && cards.length != 0){
            // var sortedCards =  cards.sort(ddz.GlobalFuncs.SortCardFuncForInfo);
            for (var number in cards){
                var cardNumber = cards[number];
                var cardInfo = new ddz.CardInfo();
                cardInfo.refreshInfoFromNum(cardNumber);
                if(cardInfo._point > 12){
                    cardInfo.colorUrl = "";
                    var colorType = cardInfo._point == 13 ? "ddz_poker/ddz_s_0001.png" : "ddz_poker/ddz_s_0000.png";
                    cardInfo.numberUrl = this.baseUrl + colorType;
                }else {
                    cardInfo.colorUrl = this.baseUrl +"ddz_poker/ddz_big_"+(cardInfo._color-1)+".png";
                    var numberType ;
                    if (cardInfo._color == 1 || cardInfo._color == 3){
                        numberType = "ddz_poker/ddz_b_red_";
                    }else {
                        numberType = "ddz_poker/ddz_b_black_";
                    }
                    cardInfo.numberUrl = this.baseUrl + numberType + cardInfo._point+".png";
                }
                cardInfoArray.push(cardInfo);
            }
            this.cardInfoArray = cardInfoArray.sort(ddz.GlobalFuncs.SortCardFuncForInfo);
            this.addCardsWithImage(backImageUrl);
        }
    },

    //获取二维码
    getQRImage : function () {
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
        var that = this;
        // hall.LOGD(null, 'qrcode,params:' + JSON.stringify(pars));
        wx.request({
            url: sdkPath + 'open/v6/user/Getwxacodeunlimit',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: pars,
            method: 'POST',
            success: function (params) {
                // hall.LOGW("===", "=========" + JSON.stringify(params));
                var b64Str = params.data.result.img;
                var fs = wx.getFileSystemManager();
                var filePath = wx.env.USER_DATA_PATH + '/qr.png';
                fs.writeFileSync(filePath, b64Str, 'base64');
                // that.QRImageUrl = filePath;
            },
            fail: function(params) {
            },
            complete: function(params) {
            }
        });
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});
