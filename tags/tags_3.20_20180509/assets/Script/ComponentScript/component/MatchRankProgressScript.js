/**
 * 比赛进度条
 */
cc.Class({
    extends: cc.Component,

    ctor:function () {
    },

    properties: {
        subPrefab : cc.Prefab
    },

    onLoad:function () {
        // this.initWithPars();
    },

    initWithPars:function (forwardIndex, stages_P) {

        // var states = [{
        //     "index":1,
        //     "name":"90进75",
        //     "riseUserCount":75,
        //     "totalUserCount":90,
        //     "canBack":0,
        //     "backFee":"",
        //     "backFeeCount":0
        // },
        //     {
        //         "index":2,
        //         "name":"75进60",
        //         "riseUserCount":60,
        //         "totalUserCount":75,
        //         "canBack":1,
        //         "backFee":"1个钻石",
        //         "backFeeCount":1
        //     },
        //     {
        //         "index":3,
        //         "name":"60进45",
        //         "riseUserCount":45,
        //         "totalUserCount":60,
        //         "canBack":1,
        //         "backFee":"1个钻石",
        //         "backFeeCount":1
        //     },
        //     {
        //         "index":4,
        //         "name":"45进33",
        //         "riseUserCount":33,
        //         "totalUserCount":45,
        //         "canBack":1,
        //         "backFee":"1个钻石",
        //         "backFeeCount":1
        //     },
        //     {
        //         "index":5,
        //         "name":"33进21",
        //         "riseUserCount":21,
        //         "totalUserCount":33,
        //         "canBack":1,
        //         "backFee":"1个钻石",
        //         "backFeeCount":1
        //     },
        //     {
        //         "index":6,
        //         "name":"21进12",
        //         "riseUserCount":12,
        //         "totalUserCount":21,
        //         "canBack":1,
        //         "backFee":"1个钻石",
        //         "backFeeCount":1
        //     },
        //     {
        //         "index":7,
        //         "name":"12进6",
        //         "riseUserCount":6,
        //         "totalUserCount":12,
        //         "canBack":1,
        //         "backFee":"1个钻石",
        //         "backFeeCount":1
        //     },
        //     {
        //         "index":8,
        //         "name":"6进3",
        //         "riseUserCount":3,
        //         "totalUserCount":6,
        //         "canBack":1,
        //         "backFee":"1个钻石",
        //         "backFeeCount":1
        //     },
        //     {
        //         "index":9,
        //         "name":"决赛",
        //         "riseUserCount":1,
        //         "totalUserCount":3,
        //         "canBack":0,
        //         "backFee":"",
        //         "backFeeCount":0
        //     }
        //     ];

        this._forwardIndex = forwardIndex;
        this._stages = stages_P;
        // this._stages = states;
        // this._forwardIndex = 9;

        var startIndex = (this._forwardIndex - 1) - 1;
        if (startIndex < 0){
            startIndex = 0;
        }

        var endIndex = startIndex + 4;
        if (endIndex > this._stages.length){
            endIndex = this._stages.length;
            startIndex = endIndex - 4;
            if (startIndex < 0){
                startIndex = 0;
            }
        }

        var lsLen = this._stages.length;

        //生成进度条
        var stage, stageNode, obj, viewtype, needShowRight, stageCom;
        for (var i = endIndex-1; i >=startIndex ; i--){
            stage = this._stages[i];
            stageNode = this.createNewStage();
            stageNode.parent = this.node;
            viewtype = stage.index < this._forwardIndex ? 1 : 0;

            needShowRight = i < lsLen-1 && (i == endIndex - 1);

            obj = {
                numLeft  : stage.totalUserCount,
                numRight : stage.riseUserCount,
                type : viewtype,
                listLen : lsLen,
                needShowLeft  : i == startIndex,
                needShowRight : needShowRight
            };
            stageCom = stageNode.getComponent('ProgressBarSub');
            stageCom.initWith(obj);
            if (stage.index == this._forwardIndex){
                stageCom.forward();
            }

        }
    },

    /**
     * 创建一个新节点(也有可能是从池中取出来的)
     */
    createNewStage : function () {
        var stageNode;
        stageNode = cc.instantiate(this.subPrefab);
        return stageNode;
    },

    start () {

    },
    onDestroy:function () {

    }

    // update (dt) {},
});
