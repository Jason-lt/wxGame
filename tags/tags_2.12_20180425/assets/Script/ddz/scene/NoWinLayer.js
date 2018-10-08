// nowin_layer.js
// created by wangjunpeng 11.13



ddz.NoWinLayer = cc.Class({

	ctor: function() {
		var bFinished = arguments[0];
		this._TAG = "noWinLayer";
		this._swallowTouch = true;
		this._bg = null;
		var winSize = cc.winSize;
		var w = winSize.width;
		var h = winSize.height;

		this._restartItem = null;
		this._stopItem = null;

		this.BGSIZE = cc.size(w * 0.75, h * 0.36);
		this.BGPOS = cc.p(w * 0.5, h * 0.5);
		this.init(bFinished);
	},

	init: function(bFinished) {

		// var bgLayer = new cc.LayerColor(cc.color(0, 0, 0, 155));
		// this.addChild(bgLayer);
		// this._bg = cc.Scale9Sprite.createWithSpriteFrameName("common_back.png");
		// this._bg.setContentSize(this.BGSIZE);
		this.addChild(this._bg);
		this._bg.setPosition(this.BGPOS);

		var bgSize = this._bg.getContentSize();
		var bw = bgSize.width;
		var bh = bgSize.height;

		var tip = new cc.Sprite("#nowin_bg.png");
		tip.setPosition(bw * 0.53, bh * 0.6);
		this._bg.addChild(tip);

		// var start_item = this._restartItem = new cc.MenuItemSprite(new cc.Sprite("#pop_continue_btn_on.png"), new cc.Sprite("#pop_continue_btn_down.png"), null, this._onContinue, this);
		// var stop_item = this._stopItem = new cc.MenuItemSprite(new cc.Sprite("#pop_stop_btn_on.png"), new cc.Sprite("#pop_stop_btn_down.png"), null, this.onStopClick, this);
		// start_item.setPosition(bw * 0.5, bh * 0.23);
		// stop_item.setPosition(bw * 0.5, bh * 0.23);
		// var menu = new cc.Menu(start_item, stop_item);
		// menu.setPosition(0, 0);
		// this._bg.addChild(menu);
		// stop_item.setVisible(false);

		if(bFinished) {
			this._onRoomResult();
		}

		// this.bake();

	},

	_registerListener: function() {
		ty.NotificationCenter.listen(ddz.EventType.MSG_ROOM_RESULT, this._onRoomResult, this);
	},

	_removeListener: function() {
		ty.NotificationCenter.ignore(ddz.EventType.MSG_ROOM_RESULT, this._onRoomResult, this);
	},

	_onRoomResult: function() {
		this._restartItem.setVisible(false);
		this._stopItem.setVisible(true);
	},

	onStopClick: function() {
		// ddz.AudioHelper.playEffect(ddz.EffectPath.button_click_sound, false);
		// var tableid = h5.playScene.tableInfo().m_customTableId;
		// var room = hall.CustomRoomManager.getCustomRoomById(tableid);
		// if(room) {
		// 	var scene = h5.ResultLayer.create(room);
		// 	cc.director.runScene(scene);
		// } else {
		// 	var scene = h5.EntranceLayer.createScene();
		// 	cc.director.runScene(scene);
		// }
	},

	_onContinue: function() {
		// ddz.AudioHelper.playEffect(ddz.EffectPath.button_click_sound, false);
		// this.removeFromParent();
		// h5.playScene.reStart();
	}
});