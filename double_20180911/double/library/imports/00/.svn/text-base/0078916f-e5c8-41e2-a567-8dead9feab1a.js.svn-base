"use strict";
cc._RF.push(module, '00789Fv5chB4qVnjerZ/qsa', 'double_window_newWeapon');
// Script/ComponentScript/window/double_window_newWeapon.js

"use strict";

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
        titleLabel: {
            default: null,
            type: cc.Label
        },
        newObjectNode: {
            default: null,
            type: cc.Node
        },
        objectSprite: {
            default: null,
            type: cc.Sprite
        },
        objectSpriteFrameList: [cc.SpriteFrame],
        objectNameLabel: {
            default: null,
            type: cc.Label
        },

        newWeaponNode: {
            default: null,
            type: cc.Node
        },
        weaponSprite: {
            default: null,
            type: cc.Sprite
        },
        weaponSpriteFrameList: [cc.SpriteFrame],

        goldNode: {
            default: null,
            type: cc.Node
        },

        btnTitleLabel: {
            default: null,
            type: cc.Label
        },

        checkSprite: {
            default: null,
            type: cc.Sprite
        },

        objectTypeIndex: 0,
        windowType: 0,
        openType: "share"
    },

    // LIFE-CYCLE CALLBACKS:

    blackAction: function blackAction() {},
    backAction: function backAction() {},
    onLoad: function onLoad() {
        ty.NotificationCenter.listen(double.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },
    updateWeaponInfo: function updateWeaponInfo(type, objectTypeIndex) {
        this.windowType = type;
        this.objectTypeIndex = objectTypeIndex;
        //TODO: 更改图片
        switch (type) {
            case double.windowNewWeaponType.newObject:
                {
                    this.titleLabel.string = "解锁新物品";
                    this.btnTitleLabel.string = "确定";
                    this.newObjectNode.active = true;
                    this.newWeaponNode.active = false;
                    this.goldNode.active = false;
                    this.objectSprite.spriteFrame = this.objectSpriteFrameList[objectTypeIndex];
                    this.objectNameLabel.string = double.GameWorld.doubleObjectNameList[objectTypeIndex];
                    break;
                }
            case double.windowNewWeaponType.newWeapon:
                {
                    this.titleLabel.string = "获得新武器";
                    this.btnTitleLabel.string = "装备";
                    this.newObjectNode.active = false;
                    this.newWeaponNode.active = true;
                    this.goldNode.active = false;
                    this.weaponSpriteFrameList.spriteFrame = this.weaponSpriteFrameList[objectTypeIndex];
                    break;
                }
            case double.windowNewWeaponType.goldTreasureChest:
                {
                    this.titleLabel.string = "金币宝箱";
                    this.btnTitleLabel.string = "免费领取";
                    this.newObjectNode.active = false;
                    this.newWeaponNode.active = false;
                    this.goldNode.active = true;
                    break;
                }
            default:
                break;
        }
    },
    changeCheckBoxType: function changeCheckBoxType() {
        this.checkSprite.node.active = !this.checkSprite.node.active;
        this.openType = this.checkSprite.node.active ? "share" : "open";
    },
    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType == double.Share.onShareType.clickStatShareTypeOpenSecretBoxB) {
            var resultType = double.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({ title: '分享到群才有效哦~' });
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({ title: '这个群今天已经打扰过了哦~' });
                    break;
                case 3:
                    this.openBox();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({ title: '分享失败' });
                    break;
                default:
                    hall.MsgBoxManager.showToast({ title: '分享失败了' });
                    break;
            }
        }
        double.Share.resultType = 0;
    },
    onClickOpen: function onClickOpen() {
        if (this.openType == "open") {
            this.openBox();
        } else {
            double.Share.shareWithType(double.Share.onShareType.clickStatShareTypeAddBullet);
        }
    },
    openBox: function openBox() {
        switch (this.windowType) {
            case double.windowNewWeaponType.newObject:
                {
                    //TODO:解锁新物品
                    break;
                }
            case double.windowNewWeaponType.newWeapon:
                {
                    //TODO:获得新武器
                    double.GlobalFuncs.setDoubleGunType(0, this.objectType);
                    break;
                }
            case double.windowNewWeaponType.goldTreasureChest:
                {
                    //TODO:领取金币宝箱
                    break;
                }
            default:
                break;
        }
    },
    closeAction: function closeAction() {
        this.node.removeFromParent();
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});

cc._RF.pop();