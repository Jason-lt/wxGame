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
        if (shot.msgBoxNode) {
            shot.msgBoxNode.closeAction();
        }
        var preFabPath = "shot_prefabs/shot_toast_tips";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode);
            shot.GlobalFuncs.setToCenter(prefabNode);
        if (!msg.hasOwnProperty('icon')){
            msg.icon = 'none';
        }
            shot.msgBoxNode = prefabNode.getComponent('shot_toast_tips');
            shot.msgBoxNode.setTitleWithString(msg.title,msg.time);
        });

        // wx.showToast(msg);
    }

};