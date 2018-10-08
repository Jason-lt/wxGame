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

    ctor: function () {
        this.rewardCanvas = null;
        this.rewardContext = null;
        this.exCanvas = null;
        this.exContext = null;
        this.effectPlayManager = null;
    },

    properties: {
        topNode : {
            default : null,
            type : cc.Node
        },
        bottomNode : {
            default : null,
            type : cc.Node
        },


        backButton: {
            default: null,
            type: cc.Button
        },

        rewardLabel: {
            default: null,
            type: cc.Label
        },
        rewardTypeSprite: {
            default: null,
            type: cc.Sprite
        },

        rewardConditionSprite: {
            default: null,
            type: cc.Sprite
        },

        rewardSpriteList: [cc.Sprite],

        rewardDownSprite: {
            default: null,
            type: cc.Sprite
        },
        rewardUpSprite: {
            default: null,
            type: cc.Sprite
        },
        rewardUpTexture: {
            default: null,
            type: cc.Texture2D
        },
        rewardUpSpriteFrame: cc.SpriteFrame,

        exRewardLabel: {
            default: null,
            type: cc.Label
        },
        exRewardSprite: {
            default: null,
            type: cc.Sprite
        },
        exDownSprite: {
            default: null,
            type: cc.Sprite
        },
        exUpSprite: {
            default: null,
            type: cc.Sprite
        },
        exUpTexture: {
            default: null,
            type: cc.Texture2D
        },
        exUpSpriteFrame: cc.SpriteFrame,

        rewardSpriteFrameList: [cc.SpriteFrame],

        exTurnTableSprite: {
            default: null,
            type: cc.Sprite
        },

        cardID: "",
        cardInfo: null,
        cardOpenCount: 0,

        clearWidth: 100,

        rewardCountDown : 0,
        rewardYindaoSprite : cc.Sprite,
        rewardHandSprite : cc.Sprite,
        exCountDown : 0,
        exYindaoSprite : cc.Sprite,
        exHandSprite : cc.Sprite,
        onCountDown : 0,

        checkRewardCountDown : 0,
        checkExCountDown : 0,

        resultCountDown : 0
    },

    onLoad: function () {
        // hall.adManager.showBannerAd("");

        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType || ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 ){
            this.topNode.y = cc.director.getWinSize().height/2-100;
            this.bottomNode.y = -cc.director.getWinSize().height/2+70;
        }else {
            this.topNode.y = cc.director.getWinSize().height/2;
            this.bottomNode.y = -cc.director.getWinSize().height/2;
        }

        this.backButton.enableAutoGrayEffect = true;
        this.backButton.interactable = true;

        this.rewardCanvas = wx.createCanvas();
        this.rewardCanvas.width = 617;
        this.rewardCanvas.height = 459;
        this.rewardContext = this.rewardCanvas.getContext("2d");
        this.rewardContext.fillRect(0,0,617,459);
        var image = wx.createImage();
        image.src = "res/raw-assets/10/1051289e-1dc8-4489-8423-8a1ad0e27b9a.png";
        var that = this;
        image.onload = function (event) {
            var ima = event.target;
            that.rewardContext.drawImage(ima, 0, 0);
            that.resetRewardSprite(true);
        };
        if (!this.rewardUpTexture) {
            this.rewardUpTexture = new cc.Texture2D();
        }
        if (!this.rewardUpSpriteFrame) {
            this.rewardUpSpriteFrame = new cc.SpriteFrame(this.rewardUpTexture);
        }
        this.rewardUpSprite.spriteFrame = this.rewardUpSpriteFrame;
        this.resetRewardSprite(true);

        this.exCanvas = wx.createCanvas();
        this.exCanvas.width = 617;
        this.exCanvas.height = 102;
        this.exContext = this.exCanvas.getContext("2d");
        this.exContext.fillRect(0,0,617,102);
        var image2 = wx.createImage();
        image2.src = "res/raw-assets/10/1051289e-1dc8-4489-8423-8a1ad0e27b9a.png";
        image2.onload = function (event) {
            var ima = event.target;
            that.exContext.drawImage(ima, 0, -357);
            that.resetExSprite(true);
        };
        if (!this.exUpTexture) {
            this.exUpTexture = new cc.Texture2D();
        }
        if (!this.exUpSpriteFrame) {
            this.exUpSpriteFrame = new cc.SpriteFrame(this.exUpTexture);
        }
        this.exUpSprite.spriteFrame = this.exUpSpriteFrame;
        this.resetExSprite(true);

        var newUser = hall.GlobalFuncs.ReadBoolFromLocalStorage(scratch.gameModel.NEW_USER, true);
        if (newUser) {
            this.rewardUpSprite.color = cc.color(144, 144, 144);
            this.rewardYindaoSprite.node.active = true;
            this.rewardHandSprite.node.active = true;
            this.rewardCountDown = 120;
        }

        this.rewardDownSprite.node.on(cc.Node.EventType.TOUCH_START, this.rewardButtonTouchStart, this, true);
        this.rewardDownSprite.node.on(cc.Node.EventType.TOUCH_MOVE, this.rewardButtonTouchMoved, this, true);
        this.rewardDownSprite.node.on(cc.Node.EventType.TOUCH_END, this.rewardButtonTouchEnded, this, true);
        this.exDownSprite.node.on(cc.Node.EventType.TOUCH_START, this.exButtonTouchStart, this, true);
        this.exDownSprite.node.on(cc.Node.EventType.TOUCH_MOVE, this.exButtonTouchMoved, this, true);
        this.exDownSprite.node.on(cc.Node.EventType.TOUCH_END, this.exButtonTouchEnded, this, true);
    },

    resetRewardSprite: function () {
        this.rewardUpTexture.initWithElement(this.rewardCanvas);
        this.rewardUpTexture.handleLoadedTexture();
        this.rewardUpSprite.spriteFrame._refreshTexture(this.rewardUpTexture);
    },

    checkRewardSprite : function () {
        if (this.rewardEndCheck(this.rewardContext, this.rewardCanvas)) {
            if (this.cardOpenCount == 1 || this.cardOpenCount == 3) {
                return;
            }
            this.rewardUpSprite.node.active = false;
            this.cardOpenCount += 1;
            if (this.cardOpenCount == 3) {
                this.getRewardForCard();
            } else {
                this.afterOneScratch();
            }
        }
    },

    resetExSprite: function () {
        this.exUpTexture.initWithElement(this.exCanvas);
        this.exUpTexture.handleLoadedTexture();
        this.exUpSprite.spriteFrame._refreshTexture(this.exUpTexture);
    },

    checkExSprite : function () {
        if (this.rewardEndCheck(this.exContext, this.exCanvas)) {
            if(this.cardOpenCount == 2 || this.cardOpenCount == 3){
                return;
            }
            this.exUpSprite.node.active = false;
            this.cardOpenCount += 2;
            if(this.cardOpenCount == 3){
                this.getRewardForCard();
            }else {
                this.afterOneScratch();
            }
        }
    },

    setCardID: function (cardID) {
        this.cardID = cardID;
        this.cardInfo = scratch.GameWorld.cardListInfo[cardID];

        if (this.cardInfo[4] != 0) {
            this.rewardLabel.string = hall.GlobalFuncs.getMoneyStringWithCouponsToZero(this.cardInfo[4]);
            // this.rewardRewardCount.string = ",可赢取"+parseInt(this.cardInfo[4]/100).toFixed(2);
            this.rewardTypeSprite.spriteFrame = this.rewardSpriteFrameList[1];
        } else {
            this.rewardLabel.string = hall.GlobalFuncs.getChipStringWithChipCount(this.cardInfo[5]);
            // this.rewardRewardCount.string = ",可赢取"+ this.cardInfo[5];
            this.rewardTypeSprite.spriteFrame = this.rewardSpriteFrameList[0];
        }

        if (this.cardInfo[1] != 0) {
            this.exRewardLabel.string = hall.GlobalFuncs.getMoneyStringWithCouponsToZero(this.cardInfo[1]);
            this.exRewardSprite.spriteFrame = this.rewardSpriteFrameList[1];
        } else {
            this.exRewardLabel.string = hall.GlobalFuncs.getChipStringWithChipCount(this.cardInfo[2]);
            this.exRewardSprite.spriteFrame = this.rewardSpriteFrameList[0];
        }

        var iconList = [];
        while (iconList.length < this.cardInfo[0]) {
            var tempNumber = hall.GlobalFuncs.getRandomNumberBefore(6);
            if (iconList.indexOf(tempNumber) == -1) {
                iconList.push(tempNumber);
            }
        }

        ty.SystemInfo.getImageWithURL(ty.SystemInfo.cdnCardLittleIconPath + cardID + ".png", this.rewardConditionSprite);
        var tempID;
        for (var i = 0; i < 6; i++) {
            if (iconList.indexOf(i) != -1) {
                ty.SystemInfo.getImageWithURL(ty.SystemInfo.cdnCardSelectPath + cardID + ".png", this.rewardSpriteList[i]);
            } else {
                tempID = this.cardID;
                while (tempID == this.cardID) {
                    tempID = hall.GlobalFuncs.getRandomNumberBefore(28) + 1001;
                }
                ty.SystemInfo.getImageWithURL(ty.SystemInfo.cdnCardUnselectedPath + tempID + ".png", this.rewardSpriteList[i]);
            }
        }

        if (this.cardInfo[3] != 0) {
            this.exTurnTableSprite.node.active = true;
        }
    },

    clearArcFun : function(x, y, r, cxt) {

        var stepClear = 1;
        clearArc(x, y, r);

        function clearArc(x, y, radius) {
            var calcWidth = radius - stepClear;
            var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);

            var posX = x - calcWidth;
            var posY = y - calcHeight;

            var widthX = 2 * calcWidth;
            var heightY = 2 * calcHeight;

            if (stepClear <= radius) {
                cxt.clearRect(posX, posY, widthX, heightY);
                stepClear += 1;
                clearArc(x, y, radius);
            }
        }
    },

    rewardButtonTouchStart: function (event) {
        this.beforeScratch();
        this.checkRewardCountDown = 1;
        var point = event.touch.getLocation();
        point = this.rewardUpSprite.node.convertToNodeSpaceAR(point);
        this.clearArcFun(point.x + 309, 230 - point.y, this.clearWidth / 2, this.rewardContext);
        this.resetRewardSprite();
    },
    rewardButtonTouchMoved: function (event) {
        var point = event.touch.getLocation();
        point = this.rewardUpSprite.node.convertToNodeSpaceAR(point);
        this.clearArcFun(point.x + 309, 230 - point.y, this.clearWidth / 2, this.rewardContext);

        this.resetRewardSprite();
    },
    rewardButtonTouchEnded: function (event) {
        this.checkRewardCountDown = 0;
        if (this.effectPlayManager) {
            scratch.AudioHelper.stopEffectWithPlayManager(this.effectPlayManager);
        }
        var point = event.touch.getLocation();
        point = this.rewardUpSprite.node.convertToNodeSpaceAR(point);
        this.clearArcFun(point.x + 309, 230 - point.y, this.clearWidth / 2, this.rewardContext);
        this.resetRewardSprite();

        this.checkRewardSprite();
    },

    rewardEndCheck: function (ctx, canvas) {
        var imageDate = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var allPX = imageDate.width * imageDate.height;
        var iNum = 0;

        for (var i = 0; i < allPX; i = i + 6) {
            if (imageDate.data[i * 4 + 3] == 0) {
                iNum++;
            }
        }
        return iNum * 6 >= allPX * 0.75;
    },

    exButtonTouchStart: function (event) {
        this.beforeScratch();
        this.checkExCountDown = 1;
        var point = event.touch.getLocation();
        point = this.exUpSprite.node.convertToNodeSpaceAR(point);
        this.clearArcFun(point.x + 309, 51 - point.y, this.clearWidth / 2, this.exContext);
        this.resetExSprite();
    },
    exButtonTouchMoved: function (event) {
        var point = event.touch.getLocation();
        point = this.exUpSprite.node.convertToNodeSpaceAR(point);
        this.clearArcFun(point.x + 309, 51 - point.y, this.clearWidth / 2, this.exContext);
        this.resetExSprite();
    },
    exButtonTouchEnded: function (event) {
        this.checkExCountDown = 0;
        if (this.effectPlayManager) {
            scratch.AudioHelper.stopEffectWithPlayManager(this.effectPlayManager);
        }
        var point = event.touch.getLocation();
        point = this.exUpSprite.node.convertToNodeSpaceAR(point);
        this.clearArcFun(point.x + 309, 51 - point.y, this.clearWidth / 2, this.exContext);
        this.resetExSprite();

        this.checkExSprite();
    },

    beforeScratch: function () {
        if (!this.cardOpenCount) {
            this.backButton.interactable = false;
        }
        if (this.effectPlayManager) {
            scratch.AudioHelper.stopEffectWithPlayManager(this.effectPlayManager);
        }
        this.effectPlayManager = scratch.AudioHelper.playEffect(scratch.EffectPath_mp3.scratch_scrate_main,true,2);
        if (this.exCountDown) {
            this.exCountDown = 0;
            this.exUpSprite.color = cc.color(255, 255, 255);
            this.exYindaoSprite.node.active = false;
            this.exHandSprite.node.active = false;
        }
        if (this.rewardCountDown) {
            this.rewardCountDown = 0;
            this.rewardUpSprite.color = cc.color(255, 255, 255);
            this.rewardYindaoSprite.node.active = false;
            this.rewardHandSprite.node.active = false;
        }
    },
    afterOneScratch: function () {
        var newUser = hall.GlobalFuncs.ReadBoolFromLocalStorage(scratch.gameModel.NEW_USER, true);
        if (newUser) {
            this.afterOneCountDown();
        } else {
            if (this.cardOpenCount != 3) {
                this.onCountDown = 480;
            }
        }
    },
    afterOneCountDown: function () {
        if (this.cardOpenCount == 1) {
            this.exUpSprite.color = cc.color(144, 144, 144);
            this.exYindaoSprite.node.active = true;
            this.exHandSprite.node.active = true;
            this.exCountDown = 120;
        } else if (this.cardOpenCount == 2) {
            this.rewardUpSprite.color = cc.color(144, 144, 144);
            this.rewardYindaoSprite.node.active = true;
            this.rewardHandSprite.node.active = true;
            this.rewardCountDown = 120;
        } else {
            this.onCountDown = 0
        }
    },


    getRewardForCard: function () {
        this.onCountDown = 0;
        this.backButton.interactable = true;
        hall.GlobalFuncs.setInLocalStorage(scratch.gameModel.NEW_USER, false);
        this.resultCountDown= 48;
    },

    showResultWindow : function () {
        scratch.gameModel.haveEx = false;
        if (this.cardInfo[3] != 0) {
            scratch.gameModel.haveEx = true;
            scratch.GlobalFuncs.showTurnTable(this.cardInfo[3], this.cardID);
        }else {
            scratch.gameModel.getLuckyReward(this.cardID);
        }
    },


    backAction: function () {
        var sceneName = 'scratch_main';
        var onLaunched = function () {
            // var logicScene = cc.director.getScene();
            // var no = logicScene.children[0];
        };
        cc.director.loadScene(sceneName, onLaunched);
    },
    detailAction: function () {
        scratch.GlobalFuncs.showRoleTips();
    },


    update: function (dt) {
        if(this.checkRewardCountDown != 0){
            this.checkRewardCountDown -= dt;
            if(this.checkRewardCountDown <= 0){
                this.checkRewardSprite();
                this.checkRewardCountDown = 1;
            }
        }
        if(this.checkExCountDown != 0){
            this.checkExCountDown -= dt;
            if(this.checkExCountDown <= 0){
                this.checkExSprite();
                this.checkExCountDown = 1;
            }
        }
        if (this.rewardCountDown) {
            this.rewardCountDown--;
            this.rewardHandSprite.node.x = 300 - 600 / 120 * this.rewardCountDown;
            if (this.rewardCountDown == 1) {
                this.rewardCountDown = 120;
            }
        }
        if (this.exCountDown) {
            this.exCountDown--;
            this.exHandSprite.node.x = 300 - 600 / 120 * this.exCountDown;
            if (this.exCountDown == 1) {
                this.exCountDown = 120;
            }
        }
        if (this.onCountDown) {
            this.onCountDown--;
            if (this.onCountDown == 0) {
                this.afterOneCountDown();
            }
        }
        if(this.resultCountDown){
            this.resultCountDown -- ;
            if(this.resultCountDown == 0){
                this.showResultWindow();
            }
        }
    },

    onDestroy: function () {
        ty.NotificationCenter.ignoreScope(this);
        // this.unscheduleAllCallbacks();
    }

    // LIFE-CYCLE CALLBACKS:

    // start () {
    //
    // },

});