"use strict";
cc._RF.push(module, 'ee1989hC45JPLejoxGGsLev', 'QrOption');
// Script/shot/QrOption.js

'use strict';

/**
 * 从小程序码启动之后的操作
 * Created by xujing on 2018/4/26.
 */
double.QrOption = cc.Class({
    ctor: function ctor() {
        this.OP_TYPE = {
            BIND_INVITE: 1,
            BIND_QUDAO: 2
        };

        this.quDaoMap = [];
    },

    withQrCode: function withQrCode(scene) {
        var sa = [1047, 1048, 1049];
        return sa.indexOf(scene) > -1;
    },

    runOption: function runOption(parStr, scene) {
        if (!parStr) return;
        var val = parStr.replace('.html', '');
        val = decodeURIComponent(val);

        var pars = val.split(',');

        var op = parseInt(pars.shift());
        switch (op) {
            case this.OP_TYPE.BIND_INVITE:
                {
                    this.bindInvite(pars, scene);
                    break;
                }
            case this.OP_TYPE.BIND_QUDAO:
                {
                    this.bindQuDao(pars, scene);
                    break;
                }
        }
    },

    setQuDao: function setQuDao(arr) {
        this.quDaoMap = arr;
    },

    bindInvite: function bindInvite(pars, scene) {
        var from = parseInt(pars[0]);
        if (from) {
            // double.gameModel.bindInviteCode(from);
            // double.gameModel.bindNewInviteCode(from);
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [scene, from]);
        }
    },

    bindQuDao: function bindQuDao(pars, scene) {
        var from = parseInt(pars[0]);
        // if (this.quDaoMap.length > 0){
        //     // from = this.quDaoMap[parseInt(pars[0])];
        //
        // }
        if (from) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [scene, from]);
        }
    }
});

cc._RF.pop();