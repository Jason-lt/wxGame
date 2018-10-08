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

        // parentScene :{
        //     default : null,
        // },

        contentSpr : {
            default : null,
            type : cc.Node
        },
        contentLabel : {
            default : null,
            type  : cc.Label
        },
        shade : {
            default : null,
            type : cc.Node
        },
        initialLabel : {
            default : null,
            type  : cc.Label
        },
        signLabel : {
            default : null,
            type  : cc.Label
        },

    },

    onLoad : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();
        this.backBg.node.active = true;
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);
        this.shade.setContentSize(size);
    },

    setOrigData : function (dataA) {
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(dataA);
    },

    updateWind:function(isScroll){
        this.tableView.active = isScroll;
        this.contentSpr.active = !isScroll;
        this.shade.active = isScroll;
    },

    setShowInitialLabel:function(isVal){
        this.initialLabel.node.active = isVal
    },

    setContent:function(str,singStr){
        this.contentLabel.string = str || "";
        this.signLabel.string = singStr || "";
    },

    setTitleLabe:function(str){
        this.titleLabe.string = str;
    },

    playEndAnimation : function () {
        // var animation = this.getComponent(cc.Animation);
        this.backBg.node.active = false;
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        anim1.on('finished', function(){
            this.isAction = false;
            this.node.destroy();
        },this);
        anim1.play();
    },

    onClose:function (event) {
        if (this.isAction){
            return
        }
        this.isAction = true;
        this.playEndAnimation();
    },
    onDestroy : function () {
    }
});
