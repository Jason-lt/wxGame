"use strict";
cc._RF.push(module, '529cbFclihE6KyG2p/qizuj', 'SeceneTest');
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