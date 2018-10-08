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
        if (ddz.toastNode) {
            ddz.toastNode.closeAction();
        }
        var preFabPath = "prefabs/match/ddz_toast_cell";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var prefabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(prefabNode,888888);
            ddz.GlobalFuncs.setToCenter(prefabNode);

            ddz.toastNode = prefabNode.getComponent("ddz_toast_cell");
            ddz.toastNode.setTitleWithString(msg.title);
        });

        // wx.showToast(msg);
    }

};