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
        titleLabel : {
            default : null,
            type : cc.Label
        },
        newObjectNode : {
            default : null,
            type : cc.Node
        },
        objectSprite : {
            default : null,
            type : cc.Sprite
        },
        objectSpriteFrameList : [cc.SpriteFrame],
        objectNameLabel : {
            default : null,
            type : cc.Label
        },

        newWeaponNode : {
            default : null,
            type : cc.Node
        },
        weaponSprite : {
            default : null,
            type : cc.Sprite
        },
        weaponSpriteFrameList : [cc.SpriteFrame],

        goldNode : {
            default : null,
            type : cc.Node
        },
        goldNumberLabel : {
            default : null,
            type : cc.Label
        },
        goldChipNode : {
            default : null,
            type : cc.Node
        },

        btnTitleLabel : {
            default : null,
            type : cc.Label
        },

        bottomButton : {
            default : null,
            type : cc.Button
        },
        ignoreButton : {
            default : null,
            type : cc.Button
        },

        checkNode : {
            default : null,
            type : cc.Node
        },

        checkSprite : {
            default : null,
            type : cc.Sprite
        },

        // chipAniPrefab : {
        //     default : null,
        //     type : cc.Prefab
        // },
        // chipAniNode : {
        //     default : null,
        //     type : cc.Node
        // },
        // coinAniToNode : {
        //     default : null,
        //     type : cc.Node
        // },

        // objectTypeIndex : 0,
        windowType : 0,
        openType : "share",
        originOpenType : "share",

        showGoldGetBtnCount : 0
    },

    // LIFE-CYCLE CALLBACKS:

    blackAction : function () {

    },
    backAction : function () {

    },
    onLoad : function() {
        ty.NotificationCenter.listen(double.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(double.EventType.REWARD_VIDEO_COMPLETE,this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(double.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.rewardVideoCompleteError, this);
    },
    updateWeaponInfo : function (type,objectTypeIndex) {
        this.windowType = type;
        // this.objectTypeIndex = objectTypeIndex;
        var ani;
        var animation;
        this.bottomButton.node.stopAllActions();
        this.ignoreButton.node.active = false;
        this.checkNode.active = false;
        switch (type){
            case double.windowNewWeaponType.newObject : {
                this.openType = double.GlobalFuncs.getRewardOpenType("newObject");
                this.changeCheckState();
                this.titleLabel.string = "解锁新物品";
                this.btnTitleLabel.string = "领取";
                this.newObjectNode.active = true;
                this.newWeaponNode.active = false;
                this.goldNode.active = false;
                this.objectSprite.spriteFrame = this.objectSpriteFrameList[objectTypeIndex];
                this.objectNameLabel.string = double.GameWorld.doubleObjectNameList[objectTypeIndex];
                break;
            }
            case double.windowNewWeaponType.newWeapon : {
                this.openType = double.GlobalFuncs.getRewardOpenType("newWeapon");
                this.changeCheckState();
                this.titleLabel.string = "获得新武器";
                this.btnTitleLabel.string = "装备";
                this.newObjectNode.active = false;
                this.newWeaponNode.active = true;
                this.goldNode.active = false;
                this.weaponSprite.spriteFrame = this.weaponSpriteFrameList[objectTypeIndex];
                ani = this.newWeaponNode.getComponent(cc.Animation);
                animation = ani.getAnimationState(ani.getClips()[0].name);
                animation.once("finished", function () {
                });
                animation.play();
                break;
            }
            case double.windowNewWeaponType.goldTreasureChest : {

                this.titleLabel.string = "金币宝箱";
                this.btnTitleLabel.string = "免费领取";
                this.newObjectNode.active = false;
                this.newWeaponNode.active = false;
                this.goldNode.active = true;
                this.goldChipNode.active = false;
                this.bottomButton.node.active = false;
                this.openType = double.GlobalFuncs.getRewardOpenType("chipBox");
                this.changeCheckState();
                if(this.openType == "ad"){
                    this.btnTitleLabel.string = "看广告领取";
                }else {
                    this.btnTitleLabel.string = "免费领取";
                }
                this.goldNumber = 0;
                if(double.GameWorld.totalLevel == 5){
                    this.goldNumber = hall.GlobalFuncs.getRandomNumberBefore(
                            double.GameWorld.boxConfig[0].maxBoxChip -double.GameWorld.boxConfig[0].minBoxChip + 1) + double.GameWorld.boxConfig[0].minBoxChip;
                }else {
                    for (var i = 0 ; i < double.GameWorld.boxConfig.length ; i ++){
                        if(double.GameWorld.totalLevel >= double.GameWorld.boxConfig[i].minLevel &&
                            double.GameWorld.totalLevel <= double.GameWorld.boxConfig[i].maxLevel){
                            this.goldNumber = hall.GlobalFuncs.getRandomNumberBefore(
                                    double.GameWorld.boxConfig[i].maxBoxChip -double.GameWorld.boxConfig[i].minBoxChip + 1) + double.GameWorld.boxConfig[i].minBoxChip;
                            break;
                        }
                    }
                }

                // this.goldNumberLabel.string = this.goldNumber;
                ani = this.goldNode.getComponent(cc.Animation);
                animation = ani.getAnimationState(ani.getClips()[0].name);
                // var that = this;

                // this.goldChipNode.active = false;
                // hall.GlobalFuncs.btnScaleEffectGold(this.goldChipNode);
                this.bottomButton.node.active = true;

                animation.once("finished", function () {
                    // that.goldChipNode.active = true;
                    // hall.GlobalFuncs.btnScaleEffectGold(that.goldChipNode);
                    // that.bottomButton.node.active = true;
                    // hall.GlobalFuncs.btnScaleEffect(that.bottomButton.node,1.13);

                    // that.showGoldGetBtnCount = 60;
                    // ani.getAnimationState(ani.getClips()[1].name).play();

                    // that.openType = double.GlobalFuncs.getRewardOpenType("chipBox");
                    // that.changeCheckState();
                });
                animation.play();
                break
            }
            default : break;
        }
    },
    changeCheckState : function () {
        this.originOpenType = this.openType;
        if(this.openType == "omit"){
            this.bottomButton.node.active = false;
            return;
        }else {
            this.bottomButton.node.active = true;
        }
        if(this.openType.indexOf("checkBox") > -1) {
            this.checkNode.active = true;
            this.ignoreButton.node.active = false;
            this.checkSprite.node.active = true;
            this.openType = "share";
        }else {
            this.checkNode.active = false;
            if(this.windowType == double.windowNewWeaponType.goldTreasureChest && this.openType.indexOf("share") > -1){
                if(this.originOpenType == "shareClick"){
                    this.openType = "share";
                }
                this.ignoreButton.node.active = true;
            }
        }
    },
    changeCheckBoxType : function () {
        this.checkSprite.node.active = !this.checkSprite.node.active;
        this.openType = this.checkSprite.node.active ? "share" : "direct";
    },
    ignoreAction : function () {
        if(this.originOpenType == "shareClick"){
            var tempType = "";
            switch (this.windowType){
                case double.windowNewWeaponType.newObject : {
                    tempType = "newObject";
                    break;
                }
                case double.windowNewWeaponType.newWeapon : {
                    tempType = "newWeapon";
                    break;
                }
                case double.windowNewWeaponType.goldTreasureChest : {
                    tempType = "chipBox";
                    break
                }
                default : break;
            }
            double.GlobalFuncs.changeShareState(tempType);
        }
        switch (this.windowType){
            case double.windowNewWeaponType.newObject : {
                ty.NotificationCenter.trigger(double.EventType.GAME_START_LEVEL_UP);
                this.closeAction();
                break;
            }
            case double.windowNewWeaponType.newWeapon : {
                this.newWeaponNode.stopAllActions();
                this.closeAction();
                break;
            }
            case double.windowNewWeaponType.goldTreasureChest : {
                this.goldNode.stopAllActions();
                this.closeWithCoinAni();
                break
            }
            default : break;
        }
    },

    onClickOpen : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        if(this.openType == "direct") {
            if(this.originOpenType == "checkBoxClick"){
                var tempType = "";
                switch (this.windowType){
                    case double.windowNewWeaponType.newObject : {
                        tempType = "newObject";
                        break;
                    }
                    case double.windowNewWeaponType.newWeapon : {
                        tempType = "newWeapon";
                        break;
                    }
                    case double.windowNewWeaponType.goldTreasureChest : {
                        tempType = "chipBox";
                        break
                    }
                    default : break;
                }
                double.GlobalFuncs.changeCheckBoxState(tempType);
            }
            this.openBox();
        }else if(this.openType == "ad"){
            hall.adManager.showRewardedVideo("window"+this.windowType);
        }else {
            switch (this.windowType){
                case double.windowNewWeaponType.newObject : {
                    double.Share.shareWithType(double.Share.onShareType.unlocknewitemshare);
                    break;
                }
                case double.windowNewWeaponType.newWeapon : {
                    double.Share.shareWithType(double.Share.onShareType.getnewweaponshare);
                    break;
                }
                case double.windowNewWeaponType.goldTreasureChest : {
                    if(ty.UserInfo.isInBSGS){
                        double.Share.shareWithType(double.Share.onShareType.goldcoinluckybox);
                    }else {
                        double.Share.shareWithType(double.Share.onShareType.unbsgsgoldcoinluckybox);
                    }
                    break
                }
                default : break;
            }
        }
    },
    openBox : function () {
        switch (this.windowType){
            case double.windowNewWeaponType.newObject : {
                ty.NotificationCenter.trigger(double.EventType.GAME_START_LEVEL_UP);
                this.closeAction();
                break;
            }
            case double.windowNewWeaponType.newWeapon : {
                this.newWeaponNode.stopAllActions();
                this.closeAction();
                break;
            }
            case double.windowNewWeaponType.goldTreasureChest : {
                hall.MsgBoxManager.showToast({"title":"恭喜获得"+this.goldNumber+"金币"});
                this.goldNode.stopAllActions();
                double.GameWorld.chipNumber += this.goldNumber;
                hall.GlobalFuncs.setInLocalStorage(double.GameWorld.GAME_COIN_NUMBER,double.GameWorld.chipNumber);
                this.closeWithCoinAni();
                break
            }
            default : break;
        }
    },
    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && (shareType == double.Share.onShareType.unlocknewitemshare ||
            shareType == double.Share.onShareType.getnewweaponshare ||
            shareType == double.Share.onShareType.shakeluckybox ||
            shareType == double.Share.onShareType.goldcoinluckybox ||
            shareType == double.Share.onShareType.unbsgsgoldcoinluckybox)) {
            if(!double.Share.shareTimeEnough){
                hall.MsgBoxManager.showToast({title : '换个群试试吧'});
                return;
            }
            var resultType = double.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                    break;
                case 3:
                    this.openBox();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({title : '分享失败'});
                    break;
                default:
                    hall.MsgBoxManager.showToast({title : '分享失败了'+resultType});
                    break;
            }
            double.Share.resultType = 0;
        }
    },
    rewardVideoComplete : function(isEnd){
        if(hall.adManager.rewardedVideoType != "window1" && hall.adManager.rewardedVideoType != "window2" && hall.adManager.rewardedVideoType != "window3"){
            return;
        }
        if(isEnd){
            this.openBox();
            // hall.adManager.hideBannerAd();
            // this.onClose();
            // //复活
            // ty.NotificationCenter.trigger(shot.EventType.GAME_START);
            // hall.MsgBoxManager.showToast({title:'复活成功!'});
        }else {
            hall.MsgBoxManager.showToast({"title":"视频播放未完成"});
        }
    },
    rewardVideoCompleteError : function (errorMsg) {
        if(hall.adManager.rewardedVideoType != "window1" && hall.adManager.rewardedVideoType != "window2" && hall.adManager.rewardedVideoType != "window3"){
            return;
        }
        hall.MsgBoxManager.showToast({"title":errorMsg});
    },
    closeWithCoinAni : function (){
        ty.NotificationCenter.trigger(double.EventType.GAME_OBJECT_UP);
        this.closeAction();
    },
    closeAction : function () {
        this.node.removeFromParent();
    },
    onCloseAction : function () {
        switch (this.windowType){
            case double.windowNewWeaponType.newObject : {
                ty.NotificationCenter.trigger(double.EventType.GAME_START_LEVEL_UP);
                this.closeAction();
                break;
            }
            case double.windowNewWeaponType.newWeapon : {
                this.newWeaponNode.stopAllActions();
                this.closeAction();
                break;
            }
            case double.windowNewWeaponType.goldTreasureChest : {
                this.goldNode.stopAllActions();
                this.closeWithCoinAni();
                break
            }
            default : break;
        }
    },
    update : function(dt) {
        // if(this.showGoldGetBtnCount){
        //     this.showGoldGetBtnCount -- ;
        //     if(this.showGoldGetBtnCount == 0){
        //         this.bottomButton.node.active = true;
        //         // hall.GlobalFuncs.btnScaleEffect(this.bottomButton.node,1.13);
        //         this.openType = double.GlobalFuncs.getRewardOpenType("chipBox");
        //         this.changeCheckState();
        //     }
        // }
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }


});
