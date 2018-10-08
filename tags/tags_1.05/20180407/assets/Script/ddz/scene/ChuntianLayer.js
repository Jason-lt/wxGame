// chuntian_layer.js

ddz.ChuntianLayer = cc.Class({

    ctor: function () {
        this._TAG = "chuntianLayer";
        this._swallowTouch = true;
        this._meWin = arguments[0];
        var winSize = cc.winSize;
        var w = winSize.width;
        var h = winSize.height;
        this.BGPOS = cc.p(w * 0.5, h * 0.6);

        this.init();
    },
    init: function () {
        var colorlayer = new cc.LayerColor(cc.color(0, 0, 0, 125));//这里不支持了,想个办法
        this.addChild(colorlayer);

        var light = new cc.Sprite("#game_chuntian_light.png");
        light.setPosition(this.BGPOS);
        this.addChild(light);

        var bg = new cc.Sprite("#game_chuntian_bg.png");
        bg.setPosition(this.BGPOS);
        this.addChild(bg);

        var bgSize = bg.getContentSize();

        var titleName = this._meWin ? "#game_chuntian_0.png" : "#game_chuntian_1.png";
        var title = new cc.Sprite(titleName);
        title.setPosition(bgSize.width / 2, bgSize.height / 2);
        bg.addChild(title);

        light.setScale(0.1);
        var mvAct = cc.sequence(cc.scaleTo(0.08,1.4),cc.scaleTo(0.02,1));
        var rotation = cc.rotateBy(6,360);

        var call = function () {
            light.runAction(rotation.repeatForever());
        };

        light.runAction(cc.sequence(mvAct,cc.callFunc(call,light)));
        bg.runAction(mvAct.clone());


    }
});