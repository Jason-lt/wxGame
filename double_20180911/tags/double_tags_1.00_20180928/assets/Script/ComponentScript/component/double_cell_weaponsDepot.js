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
        weaponBgSprite : {
            default : null,
            type : cc.Sprite
        },
        weaponSprite : {
            default : null,
            type : cc.Sprite 
        },
        weaponType : ""
    },
    
    changeBackgroundColor : function (type) {
        this.weaponBgSprite.node.color = type;
    },
    changeWeaponSpriteFrame : function (spriteF) {
        this.weaponSprite.spriteFrame = spriteF;
    },
    setWeaponType : function (type) {
        this.weaponType = type;
    },
    chooseAction : function () {
        hall.GlobalFuncs.nodeColorChangeEffect2(this.weaponBgSprite.node);
    },
    chooseActionAnimation : function () {
        hall.GlobalFuncs.nodeColorChangeEffect3(this.weaponBgSprite.node);
    },
    chooseActionAnimation2 : function () {
        hall.GlobalFuncs.nodeColorChangeEffect4(this.weaponBgSprite.node);
    },
    beChooseWeapon : function () {
        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleWeaponsDepotChoose,false);
        if(double.GameWorld.weaponUnlockState[this.weaponType]){
            double.GameWorld.weaponNow = this.weaponType;
            hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_NOW,this.weaponType);
            // this.weaponBgSprite.node.color = double.weaponsPageCellColor.weaponBgBlue;
            ty.NotificationCenter.trigger(double.EventType.CHANGE_WEAPONSDEPOT_STATE);
        }
    },

    blackAction : function () {

    },
    backAction : function () {

    },
    onLoad : function() {

    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    //
    // start () {
    //
    // },

    // update (dt) {},
});
