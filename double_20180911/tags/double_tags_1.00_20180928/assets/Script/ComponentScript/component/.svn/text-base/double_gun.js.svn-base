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
        gunNode : {
            default : null,
            type : cc.Node
        },
        gunSprite : {
            default : null,
            type : cc.Sprite
        },
        gunSpriteFrameList : [cc.SpriteFrame],
        dankeNode : {
            default : null,
            type : cc.Node
        },

        bowNode : {
            default : null,
            type : cc.Node
        },
        bowSprite : {
            default : null,
            type : cc.Sprite
        },
        bowstringSprite : {
            default : null,
            type : cc.Sprite
        },
        bowSpriteFrameList : [cc.SpriteFrame],
        bowstringSpriteFrameList : [cc.SpriteFrame],

        // arrowNode : {
        //     default : null,
        //     type : cc.Node
        // },

        parentScene: {
            default: null,
            serializable: false
        },

        locationX : 0,
        locationY : 0,

        rotationNow : 0,
        // elevation : 0,
        scaleXMirror : false,

        gunAnimation : {
            default : null,
            type : cc.AnimationState
        },
        bowAnimation : {
            default : null,
            type : cc.AnimationState
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        ty.NotificationCenter.listen(double.EventType.CHANGE_GUN_TYPE,this.changeGunType,this);

        this.gunAnimation = this.gunNode.getComponent(cc.Animation).getAnimationState("qiang_01");
        // this.gunAnimation.on("finished", function () {
        // });
        this.bowAnimation = this.bowNode.getComponent(cc.Animation).getAnimationState("gongjian_02");
        // this.bowAnimation.on("finished", function () {
        // });
    },
    changeGunType : function (index) {
        if(double.GameWorld.weaponType == 0){//枪
            this.gunNode.active = true;
            this.bowNode.active = false;
            this.gunSprite.spriteFrame = this.gunSpriteFrameList[index];
        }else { //弓箭
            // this.bowstringSprite.
            this.gunNode.active = false;
            this.bowNode.active = true;
            this.bowSprite.spriteFrame = this.bowSpriteFrameList[index];
            this.bowstringSprite.spriteFrame = this.bowstringSpriteFrameList[index];
        }
    },

    sendArrow : function () {
        double.AudioHelper.playEffect(double.EffectPath_mp3.gunHits,false);
        if(double.GameWorld.weaponType == 0){//枪
            this.gunAnimation.stop();
            this.dankeNode.rotation = 360-this.node.rotation;
            this.gunAnimation.play();
        }else { //弓箭
            this.bowAnimation.stop();
            this.bowAnimation.play();
        }
    },

    getGunAngle : function () {
        if(this.scaleXMirror){
            return (Math.PI-this.rotationNow);
        }else {
            return (Math.PI*2-this.rotationNow);
        }
    },

    changeGunRotation : function () {
        this.rotationNow = Math.atan((double.GameWorld.objectNowLocationY-this.locationY)/(double.GameWorld.objectNowLocationX-this.locationX));
        if(this.scaleXMirror){
            if(this.rotationNow < 0){
                this.rotationNow = -this.rotationNow;
            }else {
                this.rotationNow = Math.PI -this.rotationNow;
            }
            if(double.GameWorld.objectNowLocationY < this.locationY){
                this.rotationNow += Math.PI;
            }
        }else {
            if(this.rotationNow < 0){
                this.rotationNow = -this.rotationNow;
                if(double.GameWorld.objectNowLocationY > this.locationY){
                    this.rotationNow += Math.PI;
                }
            }else {
                this.rotationNow = 2*Math.PI -this.rotationNow;
                if(double.GameWorld.objectNowLocationY < this.locationY){
                    this.rotationNow -= Math.PI;
                }
            }
        }
        this.node.rotation = this.rotationNow/(Math.PI*2)*360;
    },

    update : function (dt) {
        this.changeGunRotation();
    }
});
