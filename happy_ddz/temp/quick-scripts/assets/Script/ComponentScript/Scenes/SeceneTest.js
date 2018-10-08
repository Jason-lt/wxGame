(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/Scenes/SeceneTest.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '529cbFclihE6KyG2p/qizuj', 'SeceneTest', __filename);
// Script/ComponentScript/Scenes/SeceneTest.js

'use strict';

/**
 * Created by xujing on 2018/3/28.
 */

cc.Class({
    extends: cc.Component,

    properties: {
        rankSprite: cc.Sprite
    },

    onLoad: function onLoad() {

        var openDataContext = ddz.GlobalFuncs.getOpenData();
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = 512;
        sharedCanvas.height = 1024;

        if (!openDataContext) {
            return;
        }

        //发送消息通知开放数据域，生成sharedCanvas
        openDataContext.postMessage({
            method: 'showGroupRank',
            pageIndex: 1
        });

        var main = function main() {
            var texture = new cc.Texture2D();
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();

            var spriteFrame = new cc.SpriteFrame(texture);
            this.rankSprite.spriteFrame = spriteFrame;
        };

        // main();

        ty.Timer.setTimer(this, main, 1 / 60);
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    }

    // start () {
    //
    // },

    // update (dt) {},
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
        //# sourceMappingURL=SeceneTest.js.map
        