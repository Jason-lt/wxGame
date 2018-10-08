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
        topNode : {
            default : null,
            type : cc.Node
        },
        bottomNode : {
            default : null,
            type : cc.Node
        },

        allCountLabel : {
            default : null,
            type : cc.Label
        },
        tableView : {
            default : null,
            type : cc.Node
        },

        tipsNode : {
            default : null,
            type : cc.Node
        }
    },

    onBlack : function () {

    },
    onLoad : function() {

        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType || ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 ){
            this.topNode.y = cc.director.getWinSize().height/2-100;
            this.bottomNode.y = -cc.director.getWinSize().height/2+70;
        }else {
            this.topNode.y = cc.director.getWinSize().height/2;
            this.bottomNode.y = -cc.director.getWinSize().height/2;
        }

        var lastListString = hall.GlobalFuncs.ReadStringFromLocalStorage(scratch.gameModel.GET_CASH_LIST,"[]");
        var lastList = JSON.parse(lastListString);
        var tableViewCom = this.tableView.getComponent("scratch_tableView");
        tableViewCom.setDataArray(lastList);

        var allCount = 0;
        for (var i = 0 ; i < lastList.length ; i ++){
            allCount += lastList[i].value;
        }
        this.allCountLabel.string = "累计提现金额："+ allCount.toFixed(2);

        this.tipsNode.active = lastList.length == 0;
    },

    backAction : function () {
        this.node.destroy();
    }

    // LIFE-CYCLE CALLBACKS:



    // start () {
    //
    // },

    // update (dt) {},
});
