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
        countDown : 0
    },
    setTitleWithString : function (titleString) {
        // this.bgSprite.width = titleString.length * 10;
        this.titleLabel.string = titleString;
        this.countDown = 100;

        // ty.Timer.setTimer(this, this.closeAction, 1.5)
    },

    closeAction : function () {
        this.node.destroy();
        scratch.msgBoxNode = null;
    },
    update : function(dt) {
        if(this.countDown){
            this.countDown --;
            if(this.countDown == 0){
                this.closeAction();
            }
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },


});
