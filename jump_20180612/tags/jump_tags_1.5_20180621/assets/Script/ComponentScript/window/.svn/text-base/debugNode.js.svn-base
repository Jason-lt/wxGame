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
        numberEditBox : {
            default : null,
            type : cc.EditBox
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onBlack : function () {

    },
    onLoad : function() {
        hall.GlobalFuncs.setInLocalStorage(jump.gameModel.DEBUG_MODE,true);
        this.numberEditBox.node.on("text-changed",this.numberEditChange,this);
        this.numberEditBox.node.on("editing-did-ended",this.numberEditEnd,this);
        this.numberEditBox.string = "0";
    },
    numberEditChange:function (event) {
        // var changedString = event.detail.string;
        this.numberEditBox.string = event.detail.string;
    },

    numberEditEnd : function (event) {
        var changedString = event.detail.string;
        this.numberEditBox.string = changedString;
        if(changedString == '20180621'){
            hall.GlobalFuncs.setInLocalStorage(jump.gameModel.DEBUG_MODE,false);
            this.node.destroy();
            return;
        }
        if(changedString == '20180613'){
            this.node.destroy();
        }
    },

    updateScoreCloud : function () {
        jump.gameModel.totalScore = this.numberEditBox.string;
        jump.GlobalFuncs.upDateRankData(jump.gameModel.totalScore);
    },

    changeInitScore : function () {
        // var score = parseInt(this.numberEditBox.string);
        jump.gameModel.initScore = parseInt(this.numberEditBox.string);
    },

    changeServerUrl : function () {
        var type = parseInt(this.numberEditBox.string);
        switch (type){
            case 1:{
                hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY,"http://192.168.20.108:8000/");
                break;
            }
            case 2:{
                hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY,"https://fz.nalrer.cn/");
                break;
            }
            case 3:{
                hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY,"https://openrich.nalrer.cn/");
                break;
            }
            default : break;
        }
    }

    // update (dt) {},
});
