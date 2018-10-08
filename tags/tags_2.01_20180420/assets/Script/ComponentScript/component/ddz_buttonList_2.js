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

        buttonBgList :[cc.SpriteFrame],

        topButton : {
            default : null,
            type : cc.Button
        },

        bottomButton : {
            default : null,
            type : cc.Button
        }

    },

    onLoad : function () {
        this.topCallFunc = function(){};
        this.bottomCallFunc = function(){};
        this.topButton.node.on("click",this.topCallFunc,this);
        this.bottomButton.node.on("click",this.bottomCallFunc,this);
    },
    setButtons : function () {
        this.topButton.sprite.getSpriteFrame();
        this.topButton.normalSprite = this.buttonBgList[1];

    },

    setTopBtnCallBack:function(_topCall,_bottomCall){
        this.topCallFunc = _topCall;
        this.bottomCallFunc = _bottomCall;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // updte (dt) {},
});
