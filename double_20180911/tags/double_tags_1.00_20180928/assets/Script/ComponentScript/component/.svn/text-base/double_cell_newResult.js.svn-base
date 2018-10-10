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

        topNode : cc.Node,
        topSprite : {
            default : null,
            type : cc.Sprite
        },
        topLabel : {
            default : null,
            type : cc.Label
        },

        middleNode : cc.Node,
        middleSprite : {
            default : null,
            type : cc.Sprite
        },
        middleLabel : {
            default : null,
            type : cc.Label
        },

        bottomNode : cc.Node,
        bottomSprite : {
            default : null,
            type : cc.Sprite
        },
        bottomLabel : {
            default : null,
            type : cc.Label
        },


        objectSpriteFrameList : [cc.SpriteFrame],
        gunSpriteFrameList : [cc.SpriteFrame],
        objectType : 0,
        lastIndex : 0,
        tempIndex : 0,
        tempNode : {
            default : null,
            type : cc.Node
        },
        endIndex : 0,

        bgY : 0,
        windowHeight : 0,
        changeNumber : 0,

        moveSpeed : 0,
        rollAnimation : false,
        animationTime : 0
    },

    onLoad : function() {
    },

    setRollTypeAndScale : function (type,lastIndex,endIndex) {
        this.objectType = type ;
        this.lastIndex = lastIndex;
        this.endIndex = endIndex;
        if(type == double.windowNewWeaponType.newWeapon){
            this.topLabel.node.active = false;
            this.middleLabel.node.active = false;
            this.bottomLabel.node.active = false;
            // this.nowSpriteFrameList = this.objectSpriteFrameList;
        }else {
            // this.nowSpriteFrameList = this.gunSpriteFrameList;
            this.topLabel.node.active = true;
            this.middleLabel.node.active = true;
            this.bottomLabel.node.active = true;
        }
    },

    setRollTime : function (time,speed) {
        this.animationTime = time;
        this.rollAnimation = true;
        this.moveSpeed = speed;
    },

    update : function(dt) {
        if(!this.rollAnimation){
            return;
        }

        this.bgY = this.middleNode.y - this.moveSpeed* dt;

        this.middleNode.y = this.bgY;
        this.topNode.y = this.bgY + this.windowHeight;
        this.bottomNode.y = this.bgY - this.windowHeight;

        if(this.bgY <= 0){
            if(this.animationTime == 0){
                this.bgY = 0;
                this.middleNode.y = this.bgY;
                this.topNode.y = this.bgY + this.windowHeight;
                this.bottomNode.y = this.bgY - this.windowHeight;
                this.rollAnimation = false;
                ty.NotificationCenter.trigger(double.EventType.GAME_ROLL_STOP,this.objectType);
                return;
            }
            this.changeNumber ++;
            if(this.changeNumber >= 3){
                this.changeNumber = 0;
            }
            this.tempIndex = hall.GlobalFuncs.getRandomNumberBefore(this.lastIndex);
            if(this.animationTime != -1){
                this.animationTime --;
                if(this.animationTime == 0){
                    this.tempIndex = this.endIndex;
                }
            }
            if(this.changeNumber == 0){
                if(this.objectType == double.windowNewWeaponType.newWeapon){
                    this.middleSprite.spriteFrame = this.gunSpriteFrameList[this.tempIndex];
                }else {
                    this.middleSprite.spriteFrame = this.objectSpriteFrameList[this.tempIndex];
                }
                // this.middleSprite.spriteFrame = this.nowSpriteFrameList[this.tempIndex];
                // this.middleLabel.string = double.GameWorld.doubleObjectList[this.tempIndex];
                this.middleLabel.string = double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.tempIndex]].goldNumber;
            }else if(this.changeNumber == 1){
                if(this.objectType == double.windowNewWeaponType.newWeapon){
                    this.topSprite.spriteFrame = this.gunSpriteFrameList[this.tempIndex];
                }else {
                    this.topSprite.spriteFrame = this.objectSpriteFrameList[this.tempIndex];
                }
                // this.topSprite.spriteFrame = this.nowSpriteFrameList[this.tempIndex];
                this.topLabel.string =  double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.tempIndex]].goldNumber;
            }else {
                if(this.objectType == double.windowNewWeaponType.newWeapon){
                    this.bottomSprite.spriteFrame = this.gunSpriteFrameList[this.tempIndex];
                }else {
                    this.bottomSprite.spriteFrame = this.objectSpriteFrameList[this.tempIndex];
                }
                // this.bottomSprite.spriteFrame = this.nowSpriteFrameList[this.tempIndex];
                this.bottomLabel.string =  double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.tempIndex]].goldNumber;
            }
            this.tempNode = this.topNode;
            this.topNode = this.bottomNode;
            this.bottomNode = this.middleNode;
            this.middleNode = this.tempNode;
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
