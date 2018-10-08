(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_personInfoEdit.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '623a4A0oh1HhJgzpzKhfNGL', 'ddz_personInfoEdit', __filename);
// Script/ComponentScript/window/ddz_personInfoEdit.js

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

cc.Class({
    extends: cc.Component,

    properties: {
        signatureEditBox: {
            default: null,
            type: cc.EditBox
        },

        avatar: cc.Node,

        wechatEditBox: {
            default: null,
            type: cc.EditBox
        },

        personInfoNode_1: cc.Node,
        personInfoNode_2: cc.Node,
        personInfoNode_3: cc.Node,
        personInfoNode_4: cc.Node

    },

    onLoad: function onLoad() {

        var personInfo = hall.gameWorld.model.personInfo;

        this.signatureEditBox.node.on("text-changed", this.editChangeInfo, this);
        this.signatureEditBox.node.on("editing-did-ended", this.editEndInfo, this);

        this.wechatEditBox.node.on("text-changed", this.wechatEditChangeInfo, this);
        this.wechatEditBox.node.on("editing-did-ended", this.wechatEditEndInfo, this);
        this.microSignalString = "";
        this.signatureString = "";
        if (personInfo) {
            var signature = personInfo.getSignature();
            if (signature != "" && signature != "未设置") {
                this.signatureEditBox.string = signature;
                this.signatureString = signature;
            }
            var micro_signal = personInfo.getMicroSignal();
            if (micro_signal != "" && micro_signal != "未设置") {
                this.wechatEditBox.string = micro_signal;
                this.microSignalString = micro_signal;
            }

            this.wechatVisible = personInfo.getSignalIsVisible();

            this.constellationString = personInfo.getConstellation();
            this.provinceString = personInfo.getProvince();
            this.districtString = personInfo.getDistrict();
            this.sex = personInfo.getSex();
        }

        for (var i = 1; i < 5; i++) {
            var com = this["personInfoNode_" + i].getComponent("personDataEdit");
            com.setParentCom(this);
        }
        this.setAvatar();
    },

    setAvatar: function setAvatar() {
        var wimdow = this.avatar.getComponent("Avatar");
        if (ty.UserInfo.userPic && ddz.gameModel.isLimit) {
            wimdow.setAvatarUrl(ty.UserInfo.userPic);
            wimdow.hideNameDisplay();
        }
    },

    editChangeInfo: function editChangeInfo(event) {
        var changedString = event.detail.string;

        if (!changedString || changedString.length < 1 || changedString == NaN) {
            changedString = "";
        }

        if (changedString && changedString.length > 20) {
            hall.MsgBoxManager.showToast({ title: '长度不能超出20个字符!' });
        }
        var signatureString = changedString + "";
        this.signatureEditBox.string = signatureString;
    },

    editEndInfo: function editEndInfo(event) {
        var changedString = event.detail.string;

        if (!changedString || changedString.length < 1 || changedString == NaN) {
            changedString = "";
        }

        if (changedString && changedString.length > 20) {
            hall.MsgBoxManager.showToast({ title: '长度不能超出20个字符!' });
        }

        this.signatureString = changedString + "";
        this.signatureEditBox.string = this.signatureString;
    },

    wechatEditChangeInfo: function wechatEditChangeInfo(event) {
        var changedString = event.detail.string;
        if (!changedString || changedString.length < 1 || changedString == NaN) {
            changedString = "";
        }

        var microSignalString = changedString + "";
        if (microSignalString && microSignalString.length > 20) {
            hall.MsgBoxManager.showToast({ title: '长度不能超出20个字符!' });
        }
        // var reg = new RegExp(key,"g");
        var reg = /[\u4e00-\u9fa5]/g;
        var fuBen = "";
        fuBen = microSignalString;
        var chinese = fuBen.match(reg);
        if (chinese && chinese.length > 0) {
            hall.MsgBoxManager.showToast({ title: '微信号不能输入汉字!' });
            microSignalString = "";
        }

        this.wechatEditBox.string = microSignalString;
    },

    wechatEditEndInfo: function wechatEditEndInfo(event) {
        var changedString = event.detail.string;

        if (!changedString || changedString.length < 1 || changedString == NaN) {
            changedString = "";
        }

        if (changedString && changedString.length <= 20) {} else if (changedString && changedString.length > 20) {
            hall.MsgBoxManager.showToast({ title: '长度不能超出20个字符!' });
        }

        var reg = /[\u4e00-\u9fa5]/g;
        var fuBen = "";
        fuBen = changedString + "";
        var chinese = fuBen.match(reg);
        if (chinese && chinese.length > 0) {
            hall.MsgBoxManager.showToast({ title: '微信号不能输入汉字!' });
            changedString = "";
        }
        this.microSignalString = changedString + "";
        this.wechatEditBox.string = this.microSignalString + "";
    },

    onClickWeChatVisible: function onClickWeChatVisible() {
        this.wechatVisible = !this.wechatVisible;
        // this.selectGou.active = this.wechatVisible;
    },

    onClickBgBtn: function onClickBgBtn() {
        ty.NotificationCenter.trigger(ddz.EventType.CLOSE_XIA_LA_VIEW);
    },

    onClose: function onClose() {
        // setPersonInfo: function(micro_signal,isVisible,signature,constellation,province,district)
        var isDiff = false;
        var personInfo = hall.gameWorld.model.personInfo;
        if (!personInfo) {
            isDiff = true;
        } else {
            if (this.microSignalString != personInfo.getMicroSignal()) {
                isDiff = true;
            }
            if (this.signatureString != personInfo.getSignature()) {
                isDiff = true;
            }

            if (this.constellationString != personInfo.getConstellation()) {
                isDiff = true;
            }

            if (this.provinceString != personInfo.getProvince()) {
                isDiff = true;
            }

            if (this.districtString != personInfo.getDistrict()) {
                isDiff = true;
            }
        }
        if (isDiff) {
            ddz.gameModel.setPersonInfo(this.microSignalString, true, this.signatureString, this.constellationString, this.provinceString, this.districtString);
        }
        this.node.destroy();
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
        //# sourceMappingURL=ddz_personInfoEdit.js.map
        