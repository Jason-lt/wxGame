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


        mainScrollView : {
            default : null,
            type : cc.ScrollView
        },
        cellHeight : 300,

        cellPrefab : {
            default : null,
            type : cc.Prefab
        },
        windowWidth : 0
    },

    onLoad : function() {

        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType || ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 ){
            this.topNode.y = cc.director.getWinSize().height/2-100;
            this.bottomNode.y = -cc.director.getWinSize().height/2+70;
        }else {
            this.topNode.y = cc.director.getWinSize().height/2;
            this.bottomNode.y = -cc.director.getWinSize().height/2;
        }

        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width;
        this.updateProductList();
        ty.NotificationCenter.listen(scratch.EventType.GET_STORE_PRODUCT_LIST,this.updateProductList, this);
    },

    updateProductList : function () {
        var dataList = scratch.GameWorld.productList;

        var row = dataList.length/2 >> 0;
        if(dataList.length%2 != 0){
            row += 1;
        }
        this.mainScrollView.content.height = row * this.cellHeight;

        var cell;
        var obj;
        for (var i = 0 ; i < dataList.length ; i ++){
            cell = cc.instantiate(this.cellPrefab);
            obj = dataList[i];
            cell.y =  - ((i/2 >> 0) * this.cellHeight + this.cellHeight/2);
            if(i%2 == 0){
                cell.x = -this.windowWidth/4+10;
            }else {
                cell.x = this.windowWidth/4-10;
            }
            this.mainScrollView.content.addChild(cell,1);
            var rewardCellS = cell.getComponent("scratch_cell_change_main");
            if (obj) {
                rewardCellS.addDataWithObject(obj);
            }
        }


    },

    onBlack : function () {

    },
    backAction : function () {
        this.node.destroy();
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        // this.unscheduleAllCallbacks();
    }

    // LIFE-CYCLE CALLBACKS:



    // start () {
    //
    // },

    // update (dt) {},
});
