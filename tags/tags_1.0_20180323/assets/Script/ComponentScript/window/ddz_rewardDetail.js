

cc.Class({
    extends: cc.Component,

    properties: {
        tableView : {
            default : null,
            type : cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        // ty.NotificationCenter.listen(ddz.EventType.SCROLLTOBOTTOM, this.scrollViewToBottom, this);
    },
    setDataArrayWithArray : function (array) {
        var window = this.tableView.getComponent('ddz_tableView');
        // var testA = [];
        // for (var  i = 0;i < 15 ; i ++){
        //     var obj = {"data" :["---","----","---",i+""]};
        //     testA.push(obj);
        // }
        if(array.length > 8){
            array.splice(8,array.length-8);
        }
        window.setDataArray(array);
    },
    // scrollViewToBottom : function () {
    //
    //     this.addDataArrayWithArray(array);
    // },
    addDataArrayWithArray : function (array) {
        var window = this.tableView.getComponent('ddz_tableView');
        window.addDataArray(array);
    },

    // update (dt) {},
});
