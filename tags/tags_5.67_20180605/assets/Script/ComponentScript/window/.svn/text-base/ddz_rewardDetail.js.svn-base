

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
        if(array.length > 50){
            array.splice(50,array.length-1);
        }

        // ddz.LOGD("", "file = [ddz_rewardDetail.js] fun = [setDataArrayWithArray] array = " + JSON.stringify(array));
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
