/**
 * 从小程序码启动之后的操作
 * Created by xujing on 2018/4/26.
 */
ddz.QrOption = cc.Class({
    ctor:function () {
        this.OP_TYPE = {
            BIND_INVITE : 1,
            BIND_QUDAO : 2
        };

        this.quDaoMap = [
        ];
    },

    withQrCode:function (scene) {
        var sa = [1047, 1048, 1049];
        return sa.indexOf(scene) > -1;
    },

    runOption:function (parStr , scene) {
        if (!parStr) return;
        var val = parStr.replace('.html','');
        val = decodeURIComponent(val);

        var pars = val.split(',');

        var op = parseInt(pars.shift());
        switch (op){
            case this.OP_TYPE.BIND_INVITE:{
                this.bindInvite(pars, scene);
                break;
            }
            case this.OP_TYPE.BIND_QUDAO:{
                this.bindQuDao(pars, scene);
                break;
            }
        }
    },

    setQuDao:function (arr) {
        this.quDaoMap = arr;
    },

    bindInvite:function (pars, scene) {
        var from = parseInt(pars[0]);
        if (from){
            ddz.gameModel.bindInviteCode(from);
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene, from]);
        }
    },

    bindQuDao:function (pars, scene) {
        var from = "";
        if (this.quDaoMap.length > 0){
            from = this.quDaoMap[parseInt(pars[0])];
        }
        if (from){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene, from]);
        }
    },

});