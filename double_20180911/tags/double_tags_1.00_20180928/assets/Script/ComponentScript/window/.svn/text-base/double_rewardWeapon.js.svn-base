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
        levelLabel : {
            default : null,
            type : cc.Label
        },

        getRewardNode : {
            default : null,
            type : cc.Node
        },
        getRewardButton : {
            default : null,
            type : cc.Button
        },

        nBsgsOpenTypeNode : {
            default : null,
            type : cc.Node
        },

        checkNode : {
            default : null,
            type : cc.Node
        },
        checkBoxSprite : {
            default : null,
            type : cc.Sprite
        },

        rollNode : {
            default : null,
            type : cc.Node
        },

        yellowTriNode1 : {
            default : null,
            type : cc.Node
        },
        yellowTriNode2 : {
            default : null,
            type : cc.Node
        },
        yellowTriNode3 : {
            default : null,
            type : cc.Node
        },
        yellowTriNode4 : {
            default : null,
            type : cc.Node
        },
        yellowBgNode : {
            default : null,
            type : cc.Node
        },

        resultIndex : 0,
        isStartAni : false,
        isEndAni : false,

        openType : "share"
    },
    // LIFE-CYCLE CALLBACKS:

    blackAction : function () {

    },
    backAction : function () {

    },
    onLoad : function() {
        ty.NotificationCenter.listen(double.EventType.GAME_ROLL_STOP,this.stopAnimation,this);
        ty.NotificationCenter.listen(double.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },

    updateRewardInfo : function () {
        //
        this.yellowTriNode1.active = false;
        this.yellowTriNode2.active = false;
        this.yellowTriNode3.active = false;
        this.yellowTriNode4.active = false;

        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleWeaponReward,false);
        this.levelLabel.string = "第"+(double.GameWorld.totalLevel-1)+"关";
        this.getRewardNode.active = false;
        this.openType = "share";
        this.checkBoxSprite.node.active = true;

        this.openType = double.GlobalFuncs.getRewardOpenType("weaponMachine");
        this.changeCheckState();

        this.resultIndex = hall.GlobalFuncs.getRandomNumberBefore(9);
        while (double.GameWorld.weaponUnlockState[double.GameWorld.doubleRewardWeaponList[this.resultIndex]]){
            this.resultIndex = hall.GlobalFuncs.getRandomNumberBefore(9);
        }
        this.rollNode.getComponent("double_cell_newResult").setRollTypeAndScale(double.windowNewWeaponType.newWeapon,8,this.resultIndex);
        // this.rollNode.getComponent("double_cell_newResult").setRollTime(50,500);
        this.startRollAnimation();
    },
    changeCheckState : function () {
        if(this.openType == "checkBox") {
            this.checkNode.active = true;
            this.checkBoxSprite.node.active = true;
            this.openType = "share";
            this.nBsgsOpenTypeNode.active = false;
        }else {
            this.checkNode.active = false;
            if(this.openType == "share"){
                this.nBsgsOpenTypeNode.active = true;
            }
        }
    },

    startRollAnimation : function () {
        this.isStartAni = true;
        this.rollNode.getComponent("double_cell_newResult").setRollTime(30,1700);
    },

    onCheckBox : function () {
        this.checkBoxSprite.node.active = !this.checkBoxSprite.node.active;
        this.openType = this.checkBoxSprite.node.active ? "share" : "direct";
    },

    onGetRewardWeapon : function () {
        if(this.openType == "share"){
            if(ty.UserInfo.isInBSGS){
                double.Share.shareWithType(double.Share.onShareType.weaponluckymachine);
            }else {
                double.Share.shareWithType(double.Share.onShareType.unbsgsweaponluckymachine);
            }
        }else {
            this.getRewardWeapon();
        }
    },

    getRewardWeapon : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        double.GameWorld.weaponNow = double.GameWorld.doubleRewardWeaponList[this.resultIndex];
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_NOW,double.GameWorld.weaponNow);
        double.GameWorld.weaponUnlockState[double.GameWorld.weaponNow] = true;
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_LOCK_STATE,JSON.stringify(double.GameWorld.weaponUnlockState));

        var nextNewLevel = 0;
        var addTemp = 2;
        while (nextNewLevel < double.GameWorld.totalLevel-1){
            nextNewLevel += addTemp;
            if(nextNewLevel == double.GameWorld.totalLevel-1){
                this.node.removeFromParent();
                double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.newObject,double.GameWorld.newestObjectIndex);
                return;
            }
            addTemp ++;
        }
        this.node.removeFromParent();
        ty.NotificationCenter.trigger(double.EventType.GAME_START_LEVEL_UP);
    },
    ignoreReward : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        this.node.removeFromParent();
        ty.NotificationCenter.trigger(double.EventType.GAME_START_LEVEL_UP);
    },

    stopAnimation : function (aniType) {
        if(aniType != double.windowNewWeaponType.newWeapon){
            return;
        }
        this.isEndAni = true;
        this.yellowTriNode1.active = true;
        this.yellowTriNode2.active = true;
        this.yellowTriNode3.active = true;
        this.yellowTriNode4.active = true;
        hall.GlobalFuncs.nodeActiveChangeEffect(this.yellowTriNode1);
        hall.GlobalFuncs.nodeActiveChangeEffect(this.yellowTriNode2);
        hall.GlobalFuncs.nodeActiveChangeEffect(this.yellowTriNode3);
        hall.GlobalFuncs.nodeActiveChangeEffect(this.yellowTriNode4);
        hall.GlobalFuncs.nodeColorChangeEffect(this.yellowBgNode);

        this.getRewardNode.active = true;
        hall.GlobalFuncs.btnScaleEffect(this.getRewardButton.node,1.13);
        // this.nBsgsOpenTypeNode.active = !ty.UserInfo.isInBSGS;
        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleWeaponRewardEnd,false);
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && (shareType == double.Share.onShareType.weaponluckymachine || shareType == double.Share.onShareType.unbsgsweaponluckymachine)) {
            var resultType = double.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                    break;
                case 3:
                    this.getRewardWeapon();
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

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
