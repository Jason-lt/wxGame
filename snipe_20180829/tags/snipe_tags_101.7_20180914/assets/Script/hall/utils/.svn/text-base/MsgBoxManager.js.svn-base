/**
 * Created by tuyoo on 2018/2/1.
 */
hall.MsgBoxManager = {
    /**
     * 显示弹出信息框
     * @param msg 例如
     * {
            title: '成功',
            icon: 'success',
            duration: 2000
        }
     */
    showToast : function (msg) {
        var that = this;
        if (snipe.msgBoxNode) {
            snipe.msgBoxNode.closeAction();
            snipe.msgBoxNode = null;
        }
        var preFabPath = "snipe_prefabs/shot_toast_tips";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode);
            snipe.GlobalFuncs.setToCenter(prefabNode);
        if (!msg.hasOwnProperty('icon')){
            msg.icon = 'none';
        }
            snipe.msgBoxNode = prefabNode.getComponent('shot_toast_tips');
            snipe.msgBoxNode.setTitleWithString(msg.title);
        });

        // wx.showToast(msg);
    }

};