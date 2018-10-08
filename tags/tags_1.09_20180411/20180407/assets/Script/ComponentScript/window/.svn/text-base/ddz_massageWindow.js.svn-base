// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {

        tableView : {
            default : null,
            type : cc.Node
        },
        backBg : {
            default : null,
            type  : cc.Button
        },
        titleLabe : {
            default : null,
            type  : cc.Label
        },
        coloseButton : {
            default : null,
            type : cc.Button
        },
        parentScene :{
            default : null,
        },
    },

    onLoad : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();

        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);
    },

    setOrigData : function (dataA) {
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(dataA);
    },

    playEndAnimation : function () {
        // var animation = this.getComponent(cc.Animation);
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        anim1.on('finished', this.completeAni,this);
        anim1.play();
    },
    completeAni : function () {
        hall.LOGD(this._TAG, "completeAni -------------------------");
        if(this.parentScene){
            this.parentScene.hideTipsButton();
        }
        this.node.removeFromParent();
    },
    onClose:function (event) {
        this.playEndAnimation();
    },
    onDestroy : function () {
    }
});
