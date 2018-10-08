/**
 * 战绩
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "ddz_window_gameDetail";

    },

    properties: {

        bgBtn: {
            default : null,
            type : cc.Button
        },

        closeBtn : {
            default : null,
            type : cc.Button
        },

        tableView : cc.Node,
        noRecordTips:cc.Label,

    },

    onLoad :function() {
        ddz.LOGD("", "file = [ddz_window_history] fun = [onLoad] ");
        this.bgBtn.node.active = true;
        this.closeBtn.node.on("click",this.closeGameHistory,this);
        this.createHistory();
    },

    createHistory:function(){
        var historyDdata = ddz.historyModel.getHistoryData();
        if (historyDdata.length <= 0){
            this.noRecordTips.node.active = true;
            return
        }
        this.noRecordTips.node.active = false;
        var resultArr = [];
        for (var i = 0; i < historyDdata.length; i++){
            var addMap = {};
            addMap.avatars = ddz.historyModel.getAvatars(i);
            addMap.timeS = ddz.historyModel.getTimer(i);
            addMap.titleS = "经典玩法";     // 现在暂时只有经典玩法,前端先固定
            addMap.score = ddz.historyModel.getScore(i) + "分";
            resultArr.push(addMap);
        }
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(resultArr);
    },

    closeGameHistory:function(){
        ddz.LOGD("", "file = [ddz_window_history] fun = [closeGameDetail] ");
        this.bgBtn.node.active = false;

        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState(animation.getClips()[1].name);
        anim1.once('finished', function(){
            this.node.destroy();
        },this);
        anim1.play();
    },


});