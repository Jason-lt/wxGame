(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/models/personInfoMode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2e4fao4woVGYotBZhim71cV', 'personInfoMode', __filename);
// Script/ddz/models/personInfoMode.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

hall.PersonInfo = cc.Class({
    //数据格式
    // "userInfo":{
    //     "micro_signal": ",
    //     "isVisible": 0,
    //     "signature":",
    //     "constellation": ",
    //     "province": ",
    //     "district": ",
    //     "sex": 0
    // }
    micro_signal: "", //微信号
    s_isVisible: false,
    signature: "",
    constellation: "未设置", //星座
    province: "未设置", //省份
    district: "未设置", //区
    sex: "未设置", //性别

    getMicroSignal: function getMicroSignal() {
        return this.micro_signal;
    },

    getSignalIsVisible: function getSignalIsVisible() {
        return this.s_isVisible;
    },

    getSignature: function getSignature() {
        return this.signature;
    },

    getConstellation: function getConstellation() {
        if (this.constellation == "") {
            this.constellation = "未设置";
        }
        return this.constellation;
    },

    getDistrict: function getDistrict() {
        if (this.district == "") {
            this.district = "未设置";
        }
        return this.district;
    },

    getProvince: function getProvince() {
        if (this.province == "") {
            this.province = "未设置";
        }
        return this.province;
    },

    getSex: function getSex() {
        return this.sex;
    },

    getConsttellationConfig: function getConsttellationConfig() {
        return this.constellationConfig;
    },

    getCityConfig: function getCityConfig() {
        return this.cityConfig;
    },

    parseUserInfo: function parseUserInfo(userInfo) {
        hall.LOGW(null, 'file = [personInfoMode] fun = [parseTableInfo]  userInfo =  ' + JSON.stringify(userInfo));
        this.micro_signal = userInfo.micro_signal;
        this.s_isVisible = userInfo.isVisible;
        this.signature = userInfo.signature;
        this.constellation = userInfo.constellation;;
        this.district = userInfo.district;
        this.province = userInfo.province;
        this.sex = userInfo.sex;
    },

    cleanup: function cleanup() {
        this.micro_signal = "";
        this.s_isVisible = false;
        this.signature = "";
        this.constellation = "未设置";
        this.district = "未设置";
        this.province = "未设置";
        this.sex = "未设置";
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
        //# sourceMappingURL=personInfoMode.js.map
        