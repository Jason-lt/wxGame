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
        userIdLabel : {
            default : null,
            type : cc.Label
        },
        testObjectNameLabel : {
            default : null,
            type : cc.Label
        },
        testObjectIndex : 0,
        testObject : "",

        testLevelIndex : 0,
        testLevelLabel : {
            default : null,
            type : cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        this.userIdLabel.string = "userId  :   "+ ty.UserInfo.userId;
        this.testLevelLabel.string = double.GameWorld.totalLevel;
    },
    addObjectIndex : function () {
        this.testObjectIndex ++;
        if(this.testObjectIndex >= 16){
            this.testObjectIndex = 0;
        }
        this.testObject = double.GameWorld.doubleObjectList[this.testObjectIndex];
        this.testObjectNameLabel.string = double.GameWorld.doubleObjectNameList[this.testObjectIndex];
    },
    sureAction : function () {
        double.GameWorld.testObject = this.testObject;
        this.node.destroy();
    },

    addLevelAction : function () {
        this.testLevelIndex ++;
        this.testLevelLabel.string = this.testLevelIndex;
    },
    levelSureAction : function () {
        double.GameWorld.totalLevel = this.testLevelIndex;
        double.GameWorld.newestObjectIndex = 3;
        var nextNewLevel = 0;
        var addTemp = 2;
        while (nextNewLevel < double.GameWorld.totalLevel){
            nextNewLevel += addTemp;
            if(nextNewLevel < double.GameWorld.totalLevel){
                double.GameWorld.newestObjectIndex ++;
            }
            addTemp ++;
        }
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_NEWEST_OBJECT_INDEX , double.GameWorld.newestObjectIndex);
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_LEVEL ,double.GameWorld.totalLevel);

        this.node.destroy();
    }

    // start () {
    //
    // },

    // update (dt) {},
});
