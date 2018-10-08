// bill_layer.js
// create by wangjunpeng 15.11.02


ddz.PopResultLayer = cc.Class({

	/**
	 *
	 * @param data
	 * @param bFinished
	 * @param type
     */
	ctor: function() {

		var data = arguments[0];
		var bFinished = arguments[1];
		var type = arguments[2];

		this._swallowTouch = true;
		this._result = data;

		this._leftItem = null;
		this._rightItem = null;

		this._bFinished = false;

		this.init(bFinished);
	},

	init: function(bFinished) {
		this._super();


		// h5.WxConfig.customize_wxshare();

		var result = this._result;
		var winsize = cc.winSize;

		var colorLayer = new cc.LayerColor(cc.color(0,0,0,50), winsize.width, winsize.height);
		this.addChild(colorLayer);

		var bg = new cc.Sprite(h5.Resources.DDZ_RESULT_BACK);
		bg.setPosition(winsize.width * 0.5, winsize.height * 0.47);
		this.addChild(bg);

		var bgsize = bg.getContentSize();
		var bw = bgsize.width; //525
		var bh = bgsize.height; //450

		var picName = result["win"] ? "#ddz_pop_win_title.png" : "#ddz_pop_lose_title.png";
		var title = new cc.Sprite(picName);
		title.setPosition(bw / 2, bh * 1.15);
		bg.addChild(title);

		var info = result["skillInfo"];
		var current = info["score"];
		var last = info["premaxscore"];
		var next = info["curmaxscore"];
		var level = info["level"] || "零";
		var total = next - last;
		var now = current - last;
		var str = h5.globalFunc.numberToChinese(level) + "段(" + now + "/" + total + ")";
		var label = new cc.LabelTTF(str, "Arial", 34);
		label.setFontFillColor(cc.color(221,210,140));
		label.setPosition(bw * 0.5, bh * 0.86);
		bg.addChild(label);

		var ppos = cc.p(bw * 0.5, bh * 0.73);
		var pback = new cc.Sprite("#ddz_pop_progress_back.png");
		pback.setPosition(ppos);
		bg.addChild(pback);
		var progress = new cc.ProgressTimer(new cc.Sprite("#ddz_pop_progress.png"));
		progress.setType(cc.ProgressTimer.TYPE_BAR);
		progress.setBarChangeRate(cc.p(1, 0));
		progress.setMidpoint(cc.p(0, 0.5));
		progress.setPosition(ppos);
		bg.addChild(progress);
		progress.setPercentage(now * 100 /total);

		var coins = result["coins"];
		var seats = result["seatInfos"];
		var dzindex = result["dzindex"];
		var originy = 263;
		var deltay = 54;
		var mycolor = cc.color(255, 246, 40);
		var thcolor = cc.color(143, 244, 255);
		for (var i = 0, len = coins.length; i < len; i++) {
			var posy = originy - deltay * i;
			if(i === dzindex) {
				var dztag = new cc.Sprite("#head_dz.png");
				dztag.setPosition(40, posy);
				bg.addChild(dztag);
			}

			var name = hall.GlobalFuncs.SliceStringToLength(seats[i].model.user_info.udataInfo.m_name, 15);
			var nameLabel = new cc.LabelTTF(name, "Arial", 26);
			nameLabel.setAnchorPoint(cc.p(0, 0.5));
			nameLabel.setFontFillColor(i == 0 ? mycolor : thcolor);
			nameLabel.setPosition(63, posy);
			bg.addChild(nameLabel);
			var coinSprite = new cc.Sprite("#ddz_pop_coin.png");
			coinSprite.setPosition(316, posy);
			bg.addChild(coinSprite);
			var coinLabel = new cc.LabelTTF("" + coins[i], "Arial", 26);
			coinLabel.setAnchorPoint(cc.p(0, 0.5));
			coinLabel.setFontFillColor(i == 0 ? mycolor : thcolor);
			coinLabel.setPosition(347, posy);
			bg.addChild(coinLabel);
		}


		var leftitem = this._leftItem = h5.globalFunc.createSimpleButton("#common_red_button.png", this._onClickLeft, this);
		var rightitem = this._rightItem = h5.globalFunc.createSimpleButton("#lr_green_button.png", this._onClickRight, this);
		rightitem.setPosition(416, 30);
		leftitem.setPosition(109, 30);

		var continueText = new cc.Sprite("#ddz_pop_continue.png");
		var rsize = rightitem.getContentSize();
		continueText.setPosition(rsize.width * 0.5, rsize.height * 0.55);
		rightitem.addChild(continueText);

		var leftText = leftitem._tysub = result["customTableId"] ? new cc.Sprite("#ddz_pop_stand.png") : new cc.Sprite("#ddz_pop_change.png"); //组局为站起，正常为换桌
		var lsize = leftitem.getContentSize();
		leftText.setPosition(lsize.width * 0.5, lsize.height * 0.55);
		leftitem.addChild(leftText);

		bg.addChild(leftitem);
		bg.addChild(rightitem);

		if (bFinished) {
			this._onRoomResult();
		}
	},

	_registerListener: function() {
		this._super();
		ty.NotificationCenter.listen(ddz.EventType.MSG_ROOM_RESULT, this._onRoomResult, this);
	},

	_removeListener: function() {
		this._super();
		ty.NotificationCenter.ignore(ddz.EventType.MSG_ROOM_RESULT, this._onRoomResult, this);
	},

	_onRoomResult: function() {
		this._bFinished = true;
		this._rightItem.setVisible(false);
		var left = this._leftItem;
		left._tysub.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("ddz_pop_finish.png"));
		left.setPosition(262, 0);
	},

	_onClickLeft: function() {
		ddz.AudioHelper.playEffect(ddz.EffectPath.button_click_sound, false);
		var cid = this._result["customTableId"];
		if (this._bFinished) {
			var room = hall.CustomRoomManager.getCustomRoomById(cid);
			var scene = h5.ResultLayer.create(room);
			cc.director.runScene(scene);
		} else {
			if (cid) { //组局
				h5.playScene.leaveTable();
			} else {
				h5.playScene.reStart(true);
			}
			this.removeFromParent();
		}
	},

	_onClickRight: function() {
		ddz.AudioHelper.playEffect(ddz.EffectPath.button_click_sound, false);
		this.removeFromParent();
		h5.playScene.reStart(false);
	}

});