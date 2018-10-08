/**
 * Created by xujing on 2018/3/28.
 */

cc.Class({
    extends: cc.Component,

    properties: {
        rankSprite : cc.Sprite,
    },

    onLoad :function() {

        var openDataContext = ddz.GlobalFuncs.getOpenData();
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 512;
        sharedCanvas.height = 1024;

        //发送消息通知开放数据域，生成sharedCanvas
        openDataContext.postMessage({
            method:'showGroupRank',
            pageIndex: 1
        });

        var main = function () {
            var texture = new cc.Texture2D();
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();

            var spriteFrame = new cc.SpriteFrame(texture);
            this.rankSprite.spriteFrame = spriteFrame;
        };

        // main();

        ty.Timer.setTimer(this, main, 1/60);

    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },

    // start () {
    //
    // },

    // update (dt) {},
});
