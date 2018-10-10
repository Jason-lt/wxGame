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
        if (double.msgBoxNode) {
            double.msgBoxNode.closeAction();
            double.msgBoxNode = null;
        }
        var preFabPath = "double_prefabs/double_toast_tips";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode);
            double.GlobalFuncs.setToCenter(prefabNode);
        if (!msg.hasOwnProperty('icon')){
            msg.icon = 'none';
        }
            double.msgBoxNode = prefabNode.getComponent('double_toast_tips');
            double.msgBoxNode.setTitleWithString(msg.title,msg.time);
        });

        // wx.showToast(msg);
    }

};