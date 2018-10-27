/*
	File: ddz_robot_chat.js
	Fucntion : 单机斗地主机器人说话
*/

// ddz.STRING.DDZ_PLAY_CHAT_STRING_1000: '我等的假花儿都谢了!', 0 
// ddz.STRING.DDZ_PLAY_CHAT_STRING_1001: '真怕猪一样的队友！',  1
// ddz.STRING.DDZ_PLAY_CHAT_STRING_1002: '一走一停真有型,一秒一卡好潇洒。', 2
// ddz.STRING.DDZ_PLAY_CHAT_STRING_1003: '我炸你个桃花朵朵开! ', 3
// ddz.STRING.DDZ_PLAY_CHAT_STRING_1004: '姑娘,你真是条汉子。', 4 
// ddz.STRING.DDZ_PLAY_CHAT_STRING_1005: '风吹鸡蛋壳,牌去人安乐。',  5
// ddz.STRING.DDZ_PLAY_CHAT_STRING_1006: '搏一搏,单车变摩托。', 6
// ddz.STRING.DDZ_PLAY_CHAT_STRING_1007: '炸得好!', 7

// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1001 = '真怕猪一样的队友！';
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1000 = '我等的假花儿都谢了!';
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1003 = '我炸你个桃花朵朵开! ';
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1002 = '一走一停真有型,一秒一卡好潇洒。';
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1005 = '风吹鸡蛋壳,牌去人安乐。';
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1004 = '姑娘,你真是条汉子。';
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1007 = '炸得好!',
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1006 = '搏一搏,单车变摩托。';
// ddz.stringMode.DDZ_PLAY_CHAT_STRING_1008 = '请输入要发送的信息';

require("ddzsingle_string_resource");

ddz.chatMsg = [
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1000,
		'index' : 0
	},
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1001,
		'index' : 1
	},
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1002,
		'index' : 2
	},
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1003,
		'index' : 3
	},
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1004,
		'index' : 4
	},
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1005,
		'index' : 5
	},
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1006,
		'index' : 6
	},
	{
		'msg': ddz.stringMode.DDZ_PLAY_CHAT_STRING_1007,
		'index' : 7
	}
];

ddz.AIChat = cc.Class({
	ctor: function() {
		// _dizhuPlayer这里放的是左右玩家，这个为空时，我是地主
		this._dizhuPlayer = [];
		this._nongminPlayer = [];
	},

	setDizuPlayer: function(val) {
		this._dizhuPlayer = [];
		if (val) {
			this._dizhuPlayer.push(val);
		}
	},

	setNontminPlayer: function() {
		this._nongminPlayer = [];
		var len = arguments.length;
		for(var i=0; i<len; i++) {
			this._nongminPlayer.push(arguments[i]);
		}
	},

	// 1，超过8秒玩家未出牌，非同伙的AI会说，如果两个都是敌方，则随机一人会说。38秒循环随机一人会说。
	// 目前的系统中只有玩家操作时会出现38秒还不出牌
	startUrgeTimer: function() {
		ty.Timer.setTimer(this, this._urgeTalk, 38, cc.REPEAT_FOREVER, 0);
	},

	stopUrgeTimer: function() {
		ty.Timer.cancelTimer(this, this._urgeTalk);
	},

	stopAllTimer: function() {
		ty.Timer.cancelTimer(this, this._urgeTalk);
	},

	_urgeTalk: function() {
		// 我不是地主
		var chatInfo = ddz.chatMsg[0];
		if (this._dizhuPlayer.length > 0) {
			this._dizhuPlayer[0].showChat(chatInfo);
			return;
		}
		// 我是地主，随机一个id 0/1
		var id = ddz.GlobalFuncs.getZeroOrOne();
		this._nongminPlayer[id].showChat(chatInfo);
	},
	// 0<val<=1
	_isIn: function(val) {
		var get = Math.random();
		cc.log('_isIn get = ' + get + ' val = ' + val);
		return get <= val;
	},

	// 平常出牌的话语
	commonPlayTalk: function(playerController) {
		if (!this._isIn(1/8)) {
			return;
		}
		
		var msgId = [2, 6];
		var id = ddz.GlobalFuncs.getZeroOrOne();
		var chatInfo = ddz.chatMsg[msgId[id]];
		playerController.showChat(ddz.chatMsg[msgId[id]]);
	},

	// 炸弹出牌说话
	bombPlayTalk: function(playerController) {
		if (!this._isIn(1/2)) {
			return;
		}
		playerController.showChat(ddz.chatMsg[3]);
	},

	// 玩家使用炸弹后的处理
	playerUseBomb: function() {
		if (!this._isIn(1/3)) {
			return false;
		}
		
		// 我是地主
		if (this._dizhuPlayer.length < 1) {
			var res = this._cpuIsEnemyWhenPlayerUseBomb(this._nongminPlayer[0]);
			this._cpuIsEnemyWhenPlayerUseBomb(this._nongminPlayer[1], res);
			return true;
		}

		// 我不是地主，地主哭/扔鸡蛋
		this._cpuIsEnemyWhenPlayerUseBomb(this._dizhuPlayer[0]);
		// 我的同伙
		this._cpuIsFriendWhenPlayerUseBomb(this._nongminPlayer[0]);
		
		return true;
	},

	_cpuIsFriendWhenPlayerUseBomb:function(playerController) {
		if (!playerController) {
			return false;
		}

		if (!this._isIn(1/2)) {
			playerController.showChat(ddz.chatMsg[7]);
			return;
		}

		playerController.playChatEmoAction(8);
	},

	// 电脑是我的敌人
	_cpuIsEnemyWhenPlayerUseBomb: function(playerController, res) {
		if (!playerController) {
			return false;
		}

		if (typeof(res)!='undefined') {
			if (res) {
				playerController.playChatEmoAction(5);
				return;
			}
			playerController.useInterEmo();
			return;
		}

		if (!this._isIn(1/2)) {
			playerController.useInterEmo();
			return true;
		}

		playerController.playChatEmoAction(5);
		return false;
	}
});