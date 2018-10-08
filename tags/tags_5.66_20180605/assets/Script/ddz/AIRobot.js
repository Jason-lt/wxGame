//
//  ddz_robot.js
//  ddz
//
//  Created by weitongming on 14-04-28.
//  封装robot的操作

// 网络版的流程
// client      server
// 1、quickStart
// 			2 quickStart
// 			  tableInfo
// 3、每个玩家发 ready （之前是有个sit的协议的）
// 			4、广播ready给每个人
// 			5、发回gameReady
// 			6、发回next操作（这时客户端决定要显示叫地主还是打牌的按钮）
// 7、点击叫地主的按钮
// 			8、广播给玩家叫地主消息
// 			9、叫完地主之后发回game_start(打开托管按钮)
// 			   设置癞子牌
// 10、card（出牌）
// 			11、广播card
// 			    可选的设置为托管
// 			12、最后发 game_win

// 单机ai流程梳理
// client              AI
// 					1、init 设置玩法、生成每个seat的牌和seatId、底牌、癞子牌 + sit +ready （client可以不依赖这个ready的回调来设置界面）
// 2、玩家叫地主并通知AI
// 					3、AI决定2个机器人是否叫地主，并反馈给client（玩家一定是2号，左手边是1号，右手边是0号，可以玩家先坐下，之后生成上家和下家；一定是玩家第一个叫地主，单机时如果不出牌就一定是等待）
// 					4、反馈game_start( 决定谁是地主)
// 5、自己出牌（需要有提示功能和判断牌型功能）或让AI主动出牌
// 6、通知AI牌的变化
// 					7、反馈一局游戏结束

require('AILongestType');

ddz.AIRobot = cc.Class({
	// --------- 公共部分
	ctor: function() {
		ddz.LOGD(null, " in ctor new ddz.AIRobot");
		this._isGrab = false; //是不是抢地主模式
		this.playerCards = []; // 3个玩家的手牌，单机模式下我的seatIndex = 1, 然后是右边玩家seatIndex =2, 左边seatIndex = 3。 出牌叫地主按从玩家起逆时针顺序
		this.called = []; //叫地主的分
		this.cards = []; // 一副牌，里面存的是number  0-53 + [54, 63]
		this.cardNum = 54; // 共54张牌
		this.dizhuPos = 0; // 地主所在的位置（叫地主后确定）

		this.currentPlayPos = 0; // 当前在打牌的位置
		this.lastPlayPos = 0; //上次出牌的玩家位置，如果与当前的一致，则表示主动出牌
		this.playerNum = 3; // 玩家人数
		this.dipai = []; // 底牌（共3张），叫地主时会被放入地主的手中

		this.topCards = []; //不存储this.top_type，需要的时候重新计算，因为在上家出牌的时候虽然能知道是什么牌型，但是毕竟在出牌策略中夹杂一些保存card_type的东西，会影响复杂。算一遍card_type本身代价不大

		//数据统计	
		this.callMulti = 1; //	叫分倍数,最高叫几分为几
		this.bombCount = 0; //统计一局中炸弹数量, 有几次炸弹为几
		this.chuntian = 1; //	如果有打出春天，则为2
		this.bcmulti = 1; //底牌, 备用
		this.showmulti = 1; //明牌, 备用
		this.seatPlayCardCount = [0, 0, 0]; // 玩家出牌的次数,index:0为自己，1为右上角玩家，2为左上角玩家
		this.winStreakNum = 0; // 记录我连胜的次数

		//拖动出牌，选出最长牌
		this._longestType = new ddz.AILongestType(this);
	},

	addBombCount: function() {
		this.bombCount++;
	},

	setIsGrab: function(bIsGrab) {
		this._isGrab = bIsGrab;
	},

	reset: function() {
		ddz.LOGD(null, "reset in AI.................");
		this.playerCards = [];
		this.called = [];
		this.cards = [];
		this.dizhuPos = 0;

		this.currentPlayPos = 0;
		this.lastPlayPos = 0;
		this.dipai = [];

		this.topCards = [];

		//数据统计	
		this.callMulti = 1;
		this.bombCount = 0;
		this.chuntian = 1;
		this.bcmulti = 1;
		this.showmulti = 1;
	},

	// 洗牌
	shuffle: function() {
		var deck = this.cards;
		// 先设置初始值，之后进行随机
		var i = 0;
		for (i = 0; i < this.cardNum; i++) {
			deck[i] = i;
		}
		for (i = this.cardNum - 1; i > 0; i--) {
			var r = Math.floor(Math.random() * (i + 1));
			var tmp;
			tmp = deck[i];
			deck[i] = deck[r];
			deck[r] = tmp;
			// ddz.LOGD(null, i + '------->' + r);
		}
	},

	// 发牌，在shuffle之后
	fapai: function(argument) {
		for (var i = 0; i < this.playerNum; i++) {
			this.playerCards[i] = this.cards.slice(17 * i, 17 * (i + 1));
		}
		this.dipai = this.cards.slice(51, 54); // 最后3张是底牌
	},

	setCall: function(call, seatIndex) { //设定seatIndex位置叫的分数，目前只用于设定玩家叫分
		if (seatIndex < 1 || seatIndex > 3) {
			ddz.LOGD(null, "error seat index in set call!!! return");
			return;
		}
		this.called[seatIndex - 1] = call;
		if (!this._isGrab && call == 3) {
			this.dizhuPos = 1;
		}
		//如果是抢地主模式，且是玩家第二次叫分，则确定地主pos
		if (this._isGrab && this.called.length > 1) {
			if (call == 1) {
				this.dizhuPos = 1;
				this.callMulti *= 2;
			} else { //最后一个抢地主的为地主
				this.dizhuPos = this.called[2] == 1 ? 3 : 2;
			}
		}
	},

	//命令某座位玩家叫分，并返回所叫分，如果是玩家座位(seatIndex == 1)，则直接返回， 否则会生成分。
	getCall: function(seatIndex) {
		if (seatIndex < 1 || seatIndex > 3) {
			ddz.LOGD(null, "error seat index in set call!!! return");
			return;
		}
		if (this.called.length >= seatIndex) { //因为是命令叫分，所以不考虑重复让某玩家叫分的情况（已经叫过的话，get直接取值返回），一局游戏中此方法对一个seatIndex只会调用一次
			ddz.LOGD(null, "this seatindex called, error ,return");
			return;
		}
		var call;
		if (this._isGrab) { //抢地主模式
			if (seatIndex == 2) { //右边玩家随机
				call = Math.floor(Math.random() * 2); //随机为0或者1
				if (call > 0) {
					this.callMulti *= 2;
				}
				this.called[1] = call;
			} else if (seatIndex == 3) { //左边玩家，如果前2个都没叫，则一定叫，否则随机
				if (this.called[0] == 0 && this.called[1] == 0) {
					call = 1;
				} else {
					call = Math.floor(Math.random() * 2); //随机为0或者1
					if (call > 0) {
						this.callMulti *= 2;
					}
				}
				this.called[2] = call;
			} else { //should not enter this scope
				call = this.called[0];
			}
			//抢地主模式下，只有这2种情况可以确定地主
			//如果玩家没有叫地主，则左边玩家叫完后，直接确定地主座位
			if (this.called[0] == 0) {
				this.dizhuPos = this.called[2] == 1 ? 3 : 2; //如果左边玩家叫分为1，则一定是左边地主，否则一定是右边地主
			} else {
				if (this.called.length == 3 && this.called[1] == 0 && this.called[2] == 0) { //必须用length来判断，否则undefined == 0
					this.dizhuPos = 1;
				}
			}

		} else { //叫地主模式
			if (seatIndex == 1) { //should not enter this scope
				call = this.called[0];
			} else if (seatIndex == 2) { //右边玩家，必须比玩家分大，或者不叫
				do {
					call = Math.floor(Math.random() * 4); //0,1,2,3
				} while (call != 0 && call <= this.called[0]);
				this.called[1] = call;
				if (call > 0) {
					this.callMulti = call;
				}
			} else { //左边玩家叫分，只要轮到左边玩家叫，一定叫3分,防止了都不叫开不了游戏
				call = 3;
				this.callMulti = 3;
				this.called[2] = call;
			}
			if (call == 3) { //有叫3分的，直接该座位为地主
				this.dizhuPos = seatIndex;
			}
		}
		return call;
	},

	onDestroy: function() {
		// 释放
		// todo：释放图片资源什么的
		ddz.LOGD(null, " onDestroy ---->ddz.AIRobot");
	},

	playAGame: function() {
		this.initGame();
	},

	// 初始化，参数依次是
	initGame: function() {
		ddz.LOGD(null, "init game in AI");
		this.shuffle();
		this.fapai();
		// this.zhengli(); // 整理成一定的数据结构，以便进行进一步的处理

		// this.jisuanfenshu(); // 计算分数
		// this.jiaopai();			// 叫牌

		// this.setLoard(); // 确定地主

		// this.play();            //  开始打牌的流程
	},

	playCards: function(seatIndex, cards) { //某个座位的玩家出牌, 这里也不需要删除，因为在playcontroller会进行删除
		this.currentPlayPos = ddz.GlobalFuncs.GetNextIndex(this.currentPlayPos);
		if (cards.length == 0) {
			return;
		}
		// 统计玩家出牌的次数
		this.seatPlayCardCount[seatIndex - 1] += 1;
		this.lastPlayPos = seatIndex;
		this.topCards = cards;
		ddz.LOGD(null, "this.topCards = " + this.topCards);
	},

	// 让AI打一手牌,返回打的牌（num的数组）,主动出牌不传topcards参数，即为undefined
	genOneStep: function() {
		var cards;
		if (this.lastPlayPos == 0 || this.lastPlayPos == this.currentPlayPos) {
			//主动出牌
			ddz.LOGD(null, "play cards actively......");
			cards = this.playActively(this.currentPlayPos);
		} else {
			//被动出牌
			cards = this._passivityCards();
		}
		this.playCards(this.currentPlayPos, cards);

		return cards;
	},

	_passivityCards: function() {
		//被动出牌，管topcard
		var types = ddz.RobotGlobal.judgeType(this.topCards, false);
		if (types.length == 0) {
			ddz.LOGD(null, "error!!! top cards illegal...");
			hall.GlobalFuncs.PrintArray(this.topCards);
		}

		if (!this._isIntervene(types[0])) {
			ddz.LOGD(null, "not isIntervene, this.currentPlayPos = " + this.currentPlayPos);
			return [];
		}

		var win_cards = this.findWinCardsFromArray(types[0], this.playerCards[this.currentPlayPos - 1]); //[[2,3], [4, 5]]...所有能赢的数组，挑第一个传出去即可

		//过滤跟牌，当前出牌的为非地主且上次出牌的也不是地主
		if (!this._isDizhu(this.currentPlayPos) && !this._isDizhu(this.lastPlayPos) && win_cards.length > 0) {
			win_cards = this._filterFollowCards(win_cards);
		}

		return win_cards.length > 0 ? win_cards[0] : [];
	},

	/*
	 *是否管上家出的牌
	 *argu : cardType,上家的牌类型
	 */
	_isIntervene: function(cardType) {
		//原则：1，地主总要出；2，上次出牌的是我同伙，不出；否则，出；
		if (this.dizhuPos == this.currentPlayPos) {
			return true;
		}
		if (this.dizhuPos == this.lastPlayPos) {
			//上次是地主出的，管上
			return true;
		}

		return this._isIntervenePartner(cardType);
	},

	//是否干预队友
	_isIntervenePartner: function(cardType) {
		//进入到此函数中时，上次出牌的一定是队友
		if (this.dizhuPos == this.lastPlayPos) {
			ddz.LOGD(null, "Error，not my partner !!!!");
			return true;
		}

		//1，只有一张牌时干预队友
		if (this._getCardsCnt(this.currentPlayPos) == 1) {
			return true;
		}

		//2，队友只有一张牌了，不干预
		if (this._getCardsCnt(this.lastPlayPos) <= 1) {
			return false;
		}

		//策划需求：当手牌≤2张时，按现有AI出牌方式出牌
		if (this._getCardsCnt(this.currentPlayPos) <= 2) {
			return true;
		}

		//根据牌型判断是否跟进队友的牌
		return this._isFollowUpPartner(cardType);
	},

	//是否跟进队友的牌
	_isFollowUpPartner: function(cardType) {
		if (this._isDizhu(this.lastPlayPos)) {
			return true;
		}

		if (this._isDizhu(ddz.GlobalFuncs.getPreIndex(this.currentPlayPos))) {
			//我的上家是地主，此时地主没有出牌，不跟
			return false;
		}

		if (cardType.getType() > ddz.Enums.PaixingType.DOUBLE_CARD) {
			//队友出的是大于对子的牌型，不跟
			return false;
		}

		//跟进单牌的小牌点(<A)
		if (cardType.getType() == ddz.Enums.PaixingType.SINGLE_CARD) {
			//跟进小于A的牌
			if (cardType.getPoint() < 11) {
				return true;
			}
			return false;
		}

		//跟进小于K的对子
		if (cardType.getPoint() < 10) {
			return true;
		}
		return false;
	},

	//过滤跟队友的牌
	_filterFollowCards: function(srcCards) {
		//TODO
		//如果跟的是对2、单王、小王的就不跟了
		//防止用对2、大、小王压死队友
		if (srcCards.length <= 0) {
			return srcCards;
		}

		var types = ddz.RobotGlobal.judgeType(srcCards[0], false);
		if (types.length < 0) {
			return srcCards;
		}
		if (types[0].getPoint() >= 12) {
			return [];
		}
		return srcCards;
	},

	//获取玩家的手牌数量
	_getCardsCnt: function(playerPos) {
		return this.playerCards[playerPos - 1].length;
	},

	//是否是地主
	_isDizhu: function(pos) {
		return this.dizhuPos == pos;
	},

	checkGameOver: function() {
		for (var i = 0; i < 3; i++) {
			if (this.playerCards[i].length == 0) {
				return {
					"dizhuwin": i + 1 == this.dizhuPos
				};
			}
		}
		return null;
	},

	startGame: function() { //不要将底牌加入手牌，因为在playController里面, seatInfo.cards与这里的player[]是一个对象，两个地方都插入的话会重复
		ddz.LOGD(null, "start game, set current playpos " + this.dizhuPos);
		this.currentPlayPos = this.dizhuPos;
	},

	_dumpResultArr: function(strDescribe, arr) {

	},

	//从选中的牌中挑选出最长的牌
	_findLongestFromSelectedCards: function(arr) {
		//选中牌的长度
		return this._longestType.getOneLongestCardType(arr);
	},
	// 主动出牌judge
	playActively: function(seatIndex) {
		if (seatIndex == 1) { //玩家不应该主动出牌
			ddz.LOGD(null, "error!!! seatindex == 1 in playActively");
			return [];
		}
		var cards = this.playerCards[seatIndex - 1];

		//判断当前手牌是不是一个牌型
		var types = ddz.RobotGlobal.judgeType(cards, false);
		if (types.length > 0) { //是一副手牌
			return cards.slice(0);
		}
		if (this._rocketWin(cards)) { //双王致胜
			return [52, 53];
		}

		var pc = this._getPCArrayByPoint(cards);
		pc.sort(this._sortByPoint);

		// 填补成连续的数组
		var newarr = [];
		for (index = 0; index < 15; index++) {
			var aObj = {
				'point': index,
				'count': 0,
				'cards': []
			};

			for (var oldIndex = 0; oldIndex < pc.length; oldIndex++) {
				var oldObj = pc[oldIndex];

				if (oldObj.point == aObj.point) {
					aObj = oldObj;
					break;
				}
			}

			// 深拷贝
			var cardsInfo = [];
			for (var cardsInfoIndex = 0; cardsInfoIndex < aObj.cards.length; cardsInfoIndex++) {
				cardsInfo.push(aObj['cards'][cardsInfoIndex])
			}
			newarr.push({
				'point': aObj.point,
				'count': aObj.count,
				'cards': cardsInfo
			})
		}

		var i = 0, tmp, str;
		ddz.LOGD(null, "dump _fillDicarr in play actively..........");
		for (i = 0; i < newarr.length; i++) {
			tmp = newarr[i];
			ddz.LOGD(null, "point : " + tmp.point + " count: " + tmp.count);

			str = '';
			// ddz.LOGD(null, "point : " + tmp.point + " count: " + tmp.count);
			for (var j = 0; j < tmp.count; j++) {
				var point = ddz.GlobalFuncs.numberToPoint(tmp.cards[j]);
				str = str + '[' + point + ']';
			}

			ddz.LOGD(null, str);
		}
		ddz.LOGD(null, "dump _fillDicarr in play actively.......... end");

		//[20140521][jinrifeng] 使用接口
		var lz_obj = this._getLaiziObject(newarr);

		ddz.LOGD(null, 'laizi count ' + lz_obj.count + '; laizi are ');

		for (i = 0; i < lz_obj.cards.length; i++) {
			ddz.LOGD(null, lz_obj.cards[i]);
		}

		var reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		//找飞机
		var return_arr = this._findAvailableAircraft(newarr, lz_obj);
		if (return_arr.length > 0) {
			this._dumpResultArr('found aircraft', return_arr);

			return return_arr;
		}

		// 找带癞子拼成的
		lz_obj.count = reportLaiziCount;

		return_arr = this._findAvailableAircraft(newarr, lz_obj); //找飞机
		if (return_arr.length > 0) {
			this._dumpResultArr('found aircraft', return_arr);

			return return_arr;
		}

		reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		return_arr = this._findAvailableContinous(newarr, 2, lz_obj).cards; //找最小连对
		if (return_arr.length > 0) {
			this._dumpResultArr('found liandui', return_arr);

			return return_arr;
		}

		// 找带癞子拼成的
		lz_obj.count = reportLaiziCount;

		return_arr = this._findAvailableContinous(newarr, 2, lz_obj).cards; //找最小连对
		if (return_arr.length > 0) {
			this._dumpResultArr('found liandui', return_arr);

			return return_arr;
		}

		reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		return_arr = this._findAvailableContinous(newarr, 1, lz_obj).cards; //找最小顺子
		if (return_arr.length > 0) {
			this._dumpResultArr('found shunzi', return_arr);

			return return_arr;
		}

		// 找带癞子拼成的
		lz_obj.count = reportLaiziCount;

		return_arr = this._findAvailableContinous(newarr, 1, lz_obj).cards; //找最小顺子
		if (return_arr.length > 0) {
			this._dumpResultArr('found shunzi', return_arr);

			return return_arr;
		}

		return_arr = this._findAvailableThree(newarr, lz_obj); //找第一个出现的3个, 内部考虑了先找不带癞子的
		if (return_arr.length > 0) {
			this._dumpResultArr('found three', return_arr);

			return return_arr;
		}

		// 机器人主动出对和主动出单的策略
		// 敌人定义:如果下家是同盟,则敌人是上家,否则敌人是下家。
		// 1.敌人手牌>4张 : 正常出牌策略
		// 2.敌人手牌<=4张: 敌人剩单数张优先出对子,剩双数张优先出单,同时:
		//  2.1 下家和自己是同盟 : 从小往大出
		//  2.2 下家和自己是敌人 :
		//      2.2.1 自己手牌有和下家手牌奇偶不同的牌,如下家剩1张(奇),自己有对子(偶) : 从小往大出对子
		//      2.2.2 自己手牌没有和下家手牌奇偶不同的牌,如下家剩1张(奇),自己没有对子 : 从大往小出单
		var enemyIndex;
		var preIndex = ddz.GlobalFuncs.getPreIndex(this.currentPlayPos);
		if (this.dizhuPos == preIndex) { //只有地主是我上家，则敌人是上家，否则敌人都是下家
			enemyIndex = preIndex;
		} else {
			enemyIndex = ddz.GlobalFuncs.GetNextIndex(this.currentPlayPos);
		}
		var enemyCardsLen = this.playerCards[enemyIndex - 1].length;
		var pairs, singles;
		if (enemyCardsLen > 4) { //敌人手牌多余4张，正常出牌，挑最小对出，没有则挑最小单出
			pairs = this._findMinDouble(lz_obj, pc, 1, [], false); //[[1, 2], [3, 4]]...
			if (pairs.length > 0) {
				ddz.LOGD(null, "find min double in find available aircraft....");
				this._dumpResultArr('found min double', pairs[0]);
				return pairs[0];
			}
			singles = this._findMinSingle(lz_obj, pc, 1, [], false); //[1,2,3,4]...
			if (singles.length == 0) {
				ddz.LOGD(null, "assert!!!! error in play actively!!"); //没有对子又没有单，应该报错
			}
			this._dumpResultArr('found min single', singles);
			return singles;
		} else {
			if (this.dizhuPos != preIndex) { //下家是同盟，从小往大出，否则从大往下出
				pc.reverse();
			}
			if (enemyCardsLen % 2 == 1) { //敌人手牌单数，优先出对子
				pairs = this._findMinDouble(lz_obj, pc, 1, [], false); //[[1, 2], [3, 4]]...
				if (pairs.length > 0) {
					ddz.LOGD(null, "find min double in find available aircraft....");
					this._dumpResultArr('found min double', pairs[0]);
					return pairs[0];
				}
				singles = this._findMinSingle(lz_obj, pc, 1, [], false); //[1,2,3,4]...
				this._dumpResultArr('found min single', singles);
				return singles;
			} else { //敌人手牌双数，优先出单牌
				singles = this._findMinSingle(lz_obj, pc, 1, [], false); //[1,2,3,4]...
				if (singles.length > 0) {
					ddz.LOGD(null, "find min double in find available aircraft....");
					this._dumpResultArr('found min single', singles);
					return singles;
				}
				pairs = this._findMinDouble(lz_obj, pc, 1, [], false);
				if (pairs.length == 0) {
					ddz.LOGD(null, "assert!!!! error in play actively!!"); //没有对子又没有单，应该报错
				}
				this._dumpResultArr('found min double', pairs[0]);
				return pairs[0];
			}
		}
	},

	// 对出的牌排序(花色 按照黑桃红心梅花方块)
	sordPlayCards:function(cardNums) {
		var cards = cardNums;
				var rtnCards = [];
				var tmpCardNums = [];
				var tmpPoint = -1;
				var sortFunc = function(a, b) {
					if (a > 53 || b > 53) {
						return a - b;
					} else {
						return b - a;
					}
		};
		for (var i = 0; i < cards.length; i++) {
			var num = cards[i];
			var point = ddz.GlobalFuncs.numberToPoint(num);
			if (point != tmpPoint) {
				if (tmpCardNums.length > 0) {
					tmpCardNums.sort(sortFunc);
					rtnCards = rtnCards.concat(tmpCardNums);
				}
				tmpCardNums = [num];
				tmpPoint = point;
			} else {
				tmpCardNums.push(num);
			}
		}
		if (tmpCardNums.length > 0) {
			tmpCardNums.sort(sortFunc);
			rtnCards = rtnCards.concat(tmpCardNums);
		}
		return rtnCards;
	},
});