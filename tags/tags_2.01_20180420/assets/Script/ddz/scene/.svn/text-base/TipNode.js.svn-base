
ddz.TipNode = cc.Class({
	ctor: function() {

		this._swallowTouch = true;
		var winSize = cc.winSize;
		var w = winSize.width;
		var h = winSize.height;

		this._exitSpr = null;
		this._trustSpr = null;

		this.BGPOS = cc.p(w * 0.19, h * 0.755);

		this._exit = null;

		this.init();
	},
	init: function() {

		var bg = new cc.Sprite("#tip_bg.png");
		bg.setPosition(this.BGPOS);
		this.addChild(bg);

		var bgSize = bg.getContentSize();
		var bw = bgSize.width;
		var bh = bgSize.height;

		var exitSpr = this._exitSpr = new cc.Sprite("#tip_exit.png");
		exitSpr.setPosition(bw * 0.5, bh * 0.82);
		bg.addChild(exitSpr);
		exitSpr.setTag(1);

		var trustSpr = this._trustSpr = new cc.Sprite("#tip_trust.png");
		trustSpr.setPosition(bw * 0.5, bh * 0.6);
		bg.addChild(trustSpr);
		trustSpr.setTag(2);

		var settingSpr = new cc.Sprite("#tip_setting.png");
		settingSpr.setPosition(bw * 0.5, bh * 0.35);
		bg.addChild(settingSpr);
		settingSpr.setTag(3);

		var roleSpr = new cc.Sprite("#tip_role.png");
		roleSpr.setPosition(bw * 0.5, bh * 0.143);
		bg.addChild(roleSpr);
		roleSpr.setTag(4);

		var SpriteArry = [exitSpr, trustSpr, settingSpr, roleSpr];

		var that = this;
		for (var i = 0; i < 4; i++) {
			var obj = SpriteArry[i];
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: false,
				onTouchBegan: function(touch, event) {
					var target = event.getCurrentTarget();
					var pos = target.convertToNodeSpace(touch.getLocation());
					var s = target.getContentSize();
					var rect = cc.rect(0, 0, s.width, s.height);
					if (cc.rectContainsPoint(rect, pos)) {
						target.setScale(1.3);
						return true;
					}
					return false;
				},
				onTouchEnded: function(touch, event) {
					var target = event.getCurrentTarget();
					var tag = target.getTag();
					that._ruaction(tag);
					target.setScale(1);
				}
			}, obj);
		};



		this._touchEndCall = function(touch, event) {
			var pos = touch.getLocation();
			var rect = bg.getBoundingBox();
			if (!cc.rectContainsPoint(rect, pos)) {
				this.removeFromParent();
			}
		}

		if (h5.playScene._isOnReady) {
			this._exitSpr.removeFromParent();
			var exitSpr = new cc.Sprite("#tip_exit_disable.png");
			exitSpr.setPosition(bw * 0.5, bh * 0.82);
			bg.addChild(exitSpr);

		};

		if (h5.playScene._isTrustEnable == false) {
			this._trustSpr.removeFromParent();
			var trustSpr = new cc.Sprite("#tip_trust_disable.png");
			trustSpr.setPosition(bw * 0.5, bh * 0.6);
			bg.addChild(trustSpr);

		};

	},
	_ruaction: function(tag) {
		switch (tag) {
			case 1:
				if (h5.playScene._isOnReady) {
            		return;
        		}
				h5.playScene.leaveTable();
				this.removeFromParent();
				break;
			case 2:
				h5.playScene.startDeposite();
				this.removeFromParent();
				break;
			case 3:
				var layer = new h5.SettingLayer();
				h5.playScene.addChild(layer,99);
				this.removeFromParent();
				break;
			case 4:
				h5.playScene._helpNode.setVisible(true);
				this.removeFromParent();
				break;
		}
		
	}
});