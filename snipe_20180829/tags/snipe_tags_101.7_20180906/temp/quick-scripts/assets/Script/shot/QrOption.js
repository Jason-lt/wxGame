(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/shot/QrOption.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '288b7UlCzhIsIhjWi5kL3mY', 'QrOption', __filename);
// Script/shot/QrOption.js

'use strict';

/**
 * 从小程序码启动之后的操作
 * Created by xujing on 2018/4/26.
 */
shot.QrOption = cc.Class({
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
            // shot.gameModel.bindInviteCode(from);
            // shot.gameModel.bindNewInviteCode(from);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=QrOption.js.map
        