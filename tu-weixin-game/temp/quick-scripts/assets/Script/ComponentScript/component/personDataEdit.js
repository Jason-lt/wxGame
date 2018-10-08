(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/personDataEdit.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5f63e28Jg1FuqLyMnTyu8TN', 'personDataEdit', __filename);
// Script/ComponentScript/component/personDataEdit.js

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
        iconSprte: cc.Sprite,
        sexSpriteFrame: [cc.SpriteFrame],
        conSpriteFrame: [cc.SpriteFrame],
        otherSrpteFrame: [cc.SpriteFrame],
        infoLabel: cc.Label,
        selectBg: cc.Node,
        selectPrefab: cc.Prefab,
        scrollView: cc.ScrollView,
        itemHeight: 58,
        infoProperty: ""
    },

    onLoad: function onLoad() {
        this.content = this.scrollView.content;
        // this.scrollData = {};
        this.personInfo = hall.gameWorld.model.personInfo;
        this.scrollView.node.active = false;
        ty.NotificationCenter.listen(ddz.EventType.SELECT_INFO, this.onSelectInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.CLOSE_XIA_LA_VIEW, this.onCloseXiaLaView, this);
        this.setDefaultInfo();

        this.xingzuoSet = false;
        this.shengfenSet = false;
    },

    setDefaultInfo: function setDefaultInfo() {
        switch (this.infoProperty) {
            case "consttellation":
                //星座
                var str_1 = this.personInfo.getConstellation();
                this.infoLabel.string = str_1;
                if (str_1 == "未设置") {
                    this.iconSprte.spriteFrame = this.otherSrpteFrame[0];
                } else {
                    this.iconSprte.spriteFrame = this.conSpriteFrame[0];

                    var _config = ddz.constellationConfig;
                    var index = _config.indexOf(str_1);
                    if (index == -1) {
                        index = 0;
                    }
                    this.iconSprte.spriteFrame = this.conSpriteFrame[index];
                }

                break;
            case "province":
                //省份
                var str_2 = this.personInfo.getProvince();
                this.infoLabel.string = str_2;
                if (str_2 == "未设置") {
                    this.iconSprte.spriteFrame = this.otherSrpteFrame[0];
                } else {
                    this.iconSprte.spriteFrame = this.otherSrpteFrame[1];
                }

                break;
            case "district":
                //地区
                var str_3 = this.personInfo.getDistrict();
                this.infoLabel.string = str_3;
                if (str_3 == "未设置") {
                    this.iconSprte.spriteFrame = this.otherSrpteFrame[0];
                } else {
                    this.iconSprte.spriteFrame = this.otherSrpteFrame[1];
                }
                break;
            case "sex":
                //性别
                // this.infoLabel.string = this.personInfo.getSex();
                if (hall.ME.udataInfo.m_sex == ddz.Enums.PlayerSexEnum.SEX_MALE) {
                    //男
                    this.iconSprte.spriteFrame = this.sexSpriteFrame[0];
                    this.infoLabel.string = "男";
                } else {
                    this.iconSprte.spriteFrame = this.sexSpriteFrame[1];
                    this.infoLabel.string = "女";
                }
                break;
            default:
                break;
        }
    },

    onSelectInfo: function onSelectInfo(data) {
        // data._proType data.infoStr
        if (this.infoProperty == data._proType) {
            this.infoLabel.string = data.infoStr;
        }

        //抛出数据
        switch (data._proType) {
            case "consttellation":
                //星座
                this.parentCom.constellationString = data.infoStr;

                if (this.infoProperty == data._proType) {
                    var _config = ddz.constellationConfig;
                    var index = _config.indexOf(data.infoStr);
                    if (index == -1) {
                        index = 0;
                    }
                    this.iconSprte.spriteFrame = this.conSpriteFrame[index];
                }

                break;
            case "province":
                //省份
                this.parentCom.provinceString = data.infoStr;
                break;
            case "district":
                //地区
                this.parentCom.districtString = data.infoStr;
                break;
            case "sex":
                //性别

                break;
            default:
                break;
        }
    },
    onCloseXiaLaView: function onCloseXiaLaView() {
        this.scrollView.node.active = false;
        this.selectBg.setScaleY(1);
    },

    setParentCom: function setParentCom(_com) {
        this.parentCom = _com;
    },

    setConDefault: function setConDefault() {
        // 星座
        if (this.xingzuoSet) {
            return;
        }
        if (this.personInfo) {
            var _config = ddz.constellationConfig;
            if (_config.length > 0) {
                this.xingzuoSet = true;
                this.scrollView.content.height = _config.length * this.itemHeight;
                for (var i = 0; i < _config.length; i++) {
                    var item = cc.instantiate(this.selectPrefab);
                    var com = item.getComponent('personInfoSelect');
                    com.updateInfo(_config[i], 0, this.infoProperty, i);
                    this.content.addChild(item);
                    item.y = -i * this.itemHeight - this.itemHeight / 2;
                }
            }
        }
    },

    setProVinceDefault: function setProVinceDefault() {
        // 省份
        if (this.shengfenSet) {
            return;
        }
        var _config = ddz.cityConfig;
        var count = 0;
        for (var key in _config) {
            count++;
        }
        this.scrollView.content.height = count * this.itemHeight;

        var couunt_sig = 0;
        this.shengfenSet = true;
        for (var key in _config) {
            var item = cc.instantiate(this.selectPrefab);
            var com = item.getComponent('personInfoSelect');
            com.updateInfo(key, 1, this.infoProperty);
            this.content.addChild(item);
            item.y = -couunt_sig * this.itemHeight - this.itemHeight / 2;
            couunt_sig++;
        }
    },

    setDistrictDefault: function setDistrictDefault() {
        // 市
        this.content.removeAllChildren();

        var _config = ddz.cityConfig;
        if (this.parentCom.provinceString == "" || this.parentCom.provinceString == "未设置") {
            hall.MsgBoxManager.showToast({ title: '请先设置省份啊!' });
        } else {
            var cityList = _config[this.parentCom.provinceString];
            if (!cityList || cityList.length <= 0) {
                hall.MsgBoxManager.showToast({ title: '请先设置省份啊!' });
                return;
            }
            this.scrollView.content.height = cityList.length * this.itemHeight;
            for (var i = 0; i < cityList.length; i++) {
                var item = cc.instantiate(this.selectPrefab);
                var com = item.getComponent('personInfoSelect');
                com.updateInfo(cityList[i]["市级"], 1, this.infoProperty);
                this.content.addChild(item);
                item.y = -i * this.itemHeight - this.itemHeight / 2;
            }
        }
    },

    setSexDefault: function setSexDefault() {// 性别
        // hall.ME.udataInfo.m_sex

    },

    onClickXiaLaBtn: function onClickXiaLaBtn() {
        // ty.NotificationCenter.trigger(ddz.EventType.CLOSE_XIA_LA_VIEW);
        this.scrollView.node.active = !this.scrollView.node.active;
        this.selectBg.setScaleY(1);
        if (this.scrollView.node.active) {
            this.selectBg.setScaleY(-1);
            switch (this.infoProperty) {
                case "consttellation":
                    //星座
                    this.setConDefault();
                    break;
                case "province":
                    //省份
                    this.setProVinceDefault();
                    break;
                case "district":
                    //地区
                    if (this.parentCom.provinceString == "" || this.parentCom.provinceString == "未设置") {
                        hall.MsgBoxManager.showToast({ title: '请先设置省份啊!' });
                        this.scrollView.node.active = false;
                        return;
                    }
                    this.setDistrictDefault();
                    break;
                case "sex":
                    //性别

                    break;
                default:
                    break;
            }
        }
    },

    onClose: function onClose() {},

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.parentCom = null;
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
        //# sourceMappingURL=personDataEdit.js.map
        