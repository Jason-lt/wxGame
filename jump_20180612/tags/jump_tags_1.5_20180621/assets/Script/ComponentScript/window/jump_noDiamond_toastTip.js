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
        tanIconSprite : {
            default : null,
            type : cc.Sprite
        },
        okIconSprite : {
            default : null,
            type : cc.Sprite
        },
        noDiamondLabel : {
            default : null,
            type : cc.Label
        },
        normalLabel : {
            default : null,
            type : cc.Label
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        ty.Timer.setTimer(this, this.closeAction, 2.5)
    },

    changeTitle : function (titleString) {
        this.noDiamondLabel.node.active = false;
        this.normalLabel.node.active = true;
        this.normalLabel.string = titleString;
        if(titleString != "需要分享到群"){
            this.tanIconSprite.node.active = false;
            this.okIconSprite.node.active = true;
        }
    },

    onBlack : function () {
        
    },
    closeAction : function () {
        this.node.destroy();
    },
    onDestroy:function(){
        this.unscheduleAllCallbacks();
        ty.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});
