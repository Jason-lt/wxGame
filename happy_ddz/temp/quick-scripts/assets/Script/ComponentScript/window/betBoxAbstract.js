(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/betBoxAbstract.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bb7bc7GCyBJ0ZSMQslsVQ7u', 'betBoxAbstract', __filename);
// Script/ComponentScript/window/betBoxAbstract.js

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
        tipsNode_1: cc.Node,
        tipsNode_2: cc.Node,
        tipsNode_3: cc.Node,
        tipsNode_4: cc.Node
    },

    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.CLOSE_BETBOXABSTRACT, this.onClose, this);
    },

    setParentScene: function setParentScene(params) {
        this.parentScene = params;
    },

    updateInfo: function updateInfo() {
        if (this.parentScene) {
            var tableinfo = this.parentScene.tableInfo();
            var boxConfig = tableinfo.m_boxConfig;
            ddz.LOGD("", "file = [betBoxAblstract] fun = [updateInfo] boxConfig = " + JSON.stringify(boxConfig));

            if (boxConfig) {
                if (boxConfig.length && boxConfig.length > 0) {
                    for (var i = 0; i < boxConfig.length; i++) {
                        if (this["tipsNode_" + (i + 1)]) {
                            var com = this["tipsNode_" + (i + 1)].getComponent("boxTipsNode");
                            com.setBoxTips(boxConfig[i].windoubles, boxConfig[i].boxType, i);
                        }
                    }
                }
            }
        }
    },

    onClose: function onClose() {
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.parentScene = null;
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
        //# sourceMappingURL=betBoxAbstract.js.map
        