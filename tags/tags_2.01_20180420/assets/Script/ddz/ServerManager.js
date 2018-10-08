// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        txtServer : cc.EditBox,
        btnChange : cc.Button,
        btnReset : cc.Button
    },

    onLoad:function () {
        var that = this;
        this.node.active = debugMode;
        var serPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");
        this.btnChange.node.on('click', function (evet) {
            hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, that.txtServer.string);
            hall.MsgBoxManager.showToast({title:'服务器地址已更新,请退出重新登录!'});
        });

        this.btnReset.node.on('click', function (evet) {
            that.txtServer.string = "";
            hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");

            hall.MsgBoxManager.showToast({title:'服务器地址已重置'});
        });

        ddz.LOGD(null, "当前的SDK地址:" + serPath);

        this.txtServer.string = serPath;
    }

});