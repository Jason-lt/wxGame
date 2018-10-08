/**
 * 战绩 信息
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "ddz_gameDetail_cell";

    },

    properties: {
        rank_1 : cc.Node,
        rank_2 : cc.Node,
        numLabel : cc.Label,
        scoreLable_1 : cc.Label,
        scoreLable_2 : cc.Label,
        scoreLable_3 : cc.Label,
    },

    updateinfo: function(_num, myIndex, info ) {
        
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);
        
        this.rank_1.active = false;
        this.rank_2.active = true;
        this.numLabel.string = "第" + _num + "局";

        if (info){
            this['scoreLable_1'].string = info[myIndex - 1];
            this['scoreLable_2'].string = info[rightindex - 1];
            this['scoreLable_3'].string = info[leftindex -1];
        } else {
            this['scoreLable_1'].string = '--';
            this['scoreLable_2'].string = '--';
            this['scoreLable_3'].string = '--';
        }
    },

    onLoad :function() {


    },

    

});
