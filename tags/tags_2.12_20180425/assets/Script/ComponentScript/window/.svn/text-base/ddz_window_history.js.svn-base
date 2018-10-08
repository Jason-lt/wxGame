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

        this.createCell();
    },

    createCell:function(){
        var max_len = 10;

        if (max_len <= 0) {
            this.noRecordTips.node.active = true;
            return;
        }

        this.noRecordTips.node.active = false;

        var resultArr = [];
        for (var i = 0 ; i < max_len ; i ++){
            var addMap= {};
            var url = [];
            // 战绩三个头像先全部用自己的头像,等消息格式获取了再行转换
            url.push(hall.ME.udataInfo.m_purl);
            url.push(hall.ME.udataInfo.m_purl);
            url.push(hall.ME.udataInfo.m_purl);
            addMap.urls = url;
            addMap.timeS = new Date().getTime();
            addMap.titleS = "经典玩法";     // 现在暂时只有经典玩法,前端先固定
            addMap.score = i + "分";
            resultArr.push(addMap);
        }
        resultArr.reverse();
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