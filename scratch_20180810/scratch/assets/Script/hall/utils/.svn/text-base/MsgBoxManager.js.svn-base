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
        if (scratch.msgBoxNode) {
            scratch.msgBoxNode.closeAction();
            scratch.msgBoxNode = null;
        }
        var preFabPath = "prefabs/scratch_toast_tips";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode);
            scratch.GlobalFuncs.setToCenter(prefabNode);
        if (!msg.hasOwnProperty('icon')){
            msg.icon = 'none';
        }
            scratch.msgBoxNode = prefabNode.getComponent('scratch_toast_tips');
            scratch.msgBoxNode.setTitleWithString(msg.title);
        });

        // wx.showToast(msg);
    }

};