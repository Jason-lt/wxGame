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
        drawButton : {     // 花
            default : null,
            type : cc.Button
        },
        diamondAniNode : cc.Node,
        chipAniNode : cc.Node,
        hongBaoAniNode : cc.Node,
        getchipAniNode : cc.Node,
        getJiPaaiQiAni : cc.Node,
        countNumberLabel : cc.Label,
        tipsRichText : cc.RichText,
        parentScene : {
            default : null
        }
    },

    onLoad:function(){

    },

    setTipsRichText:function(isVal){
        this.tipsRichText.node.active = false;
        if (isVal) {
            this.tipsRichText.node.active = true;
        }
    },

    setCountWithNumber : function (number) {
        this.countNumberLabel.string = "+"+number;
    },
    changeDiamondToChip : function () {
        this.diamondAniNode.active = false;
        this.chipAniNode.active = true;
        this.getJiPaaiQiAni.active = false;
        var ani = this.getchipAniNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {
        });
        anim.play();
    },
    changeDiamondToHongbao : function () {
        this.diamondAniNode.active = false;
        this.hongBaoAniNode.active = true;
        this.getJiPaaiQiAni.active = false;
        var ani = this.hongBaoAniNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {
        });
        anim.play();
    },
    changeDiamondToJiPaiQi : function () {
        this.diamondAniNode.active = false;
        this.hongBaoAniNode.active = false;
        this.getJiPaaiQiAni.active = true;
        var ani = this.getJiPaaiQiAni.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {
        });
        anim.play();
    },
    getDiamond:function(){
        this.node.removeFromParent();
        if(this.parentScene && this.parentScene.getDiamondAniFinish){
            this.parentScene.getDiamondAniFinish();
        }
    }
});

