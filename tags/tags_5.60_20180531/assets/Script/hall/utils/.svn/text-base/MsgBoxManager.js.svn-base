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

        var preFabPath = "prefabs/match/ddz_toast_cell";
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(preFabNode);
            ddz.GlobalFuncs.setToCenter(preFabNode);

            var com = preFabNode.getComponent("ddz_toast_cell");
            com.setTitleWithString(msg.title);
        });

        // wx.showToast(msg);
    }

};