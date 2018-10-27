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

ddz.AIRobotClasss = cc.Class({
	_TAG : 'ddz.AIRobot',

	// --------- 公共部分
	ctor: function() {
		ddz.LOGD(this._TAG, " in ctor new ddz.AIRobotClasss");
		this._isGrab = false;//是不是抢地主模式
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

		// 3个玩家的手牌，单机模式下我的seatIndex = 1, 然后是右边玩家seatIndex =2, 左边seatIndex = 3。 出牌叫地主按从玩家起逆时针顺序
		this.mySeatIndex = 1;
		this.rightSeatIndex = 2;
		this.leftSeatIndex = 3;

		this.intervalTime = 2;	//机器人考虑时间

		//数据统计	
		this.callMulti = 1; //	叫分倍数,最高叫几分为几
		this.bombCount = 0; //统计一局中炸弹数量, 有几次炸弹为几
		this.chuntian = 1; //	如果有打出春天，则为2
		this.bcmulti = 1; //底牌, 备用
		this.showmulti = 1; //明牌, 备用
		this.seatPlayCardCount = [0,0,0];// 玩家出牌的次数,index:0为自己，1为右上角玩家，2为左上角玩家
		this.winStreakNum = 0;// 记录我连胜的次数
		this.killBossRoundNum = 0;// 闯关斗地主中记录我干掉当前boss所用的回合数
		this.killBossRoundNumBack = 0;

		this.isPassCurStage = false;
		this.runningBigStageId = -1;
		this.runningSmallStageId = -1;

		//类型判断
		this._typeJudger = new ddz.AITypeJudger();

		//拖动出牌，选出最长牌
		this._longestType = new ddz.AILongestType(this);

		this._typeFinder = new ddz.typeFinder();
	},

	addBombCount: function() {
		this.bombCount++;
	},

	setIsGrab: function(bIsGrab) {
		this._isGrab = bIsGrab;
		hall.LOGD(this._TAG, 'setIsGrab = ' + this._isGrab);
	},

	reset: function() {
		ddz.LOGD(this._TAG, "reset in AI.................");
		this.playerCards = [];
		this.called = [];
		this.cards = [];
		this.dizhuPos = 0;
		this._isGrab = false;
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
		for (var i = 0; i < this.cardNum; i++) {
			deck[i] = i;
		}
		for (var i = this.cardNum - 1; i > 0; i--) {
			var r = Math.floor(Math.random() * (i + 1));
			var tmp;
			tmp = deck[i];
			deck[i] = deck[r];
			deck[r] = tmp;
			// ddz.LOGD(i + '------->' + r);
		}
	},

	// 发牌，在shuffle之后
	fapai: function(argument) {
		for (var i = 0; i < this.playerNum; i++) {
			var cards = this.cards.slice(17 * i, 17 * (i + 1));
			this.playerCards[i] = cards;
		};
		this.dipai = this.cards.slice(51, 54); // 最后3张是底牌

		cc.log('test 0000 this.playerCards[0] = ' + JSON.stringify(this.playerCards[0]));
		cc.log('test 0001 this.playerCards[1] = ' + JSON.stringify(this.playerCards[1]));
		cc.log('test 0002 this.playerCards[2] = ' + JSON.stringify(this.playerCards[2]));
		cc.log('test 0003 this.dipai = ' + JSON.stringify(this.dipai));
	},

	getPlayerCards:function(index){
		if (this.playerCards[index-1]){
			return this.playerCards[index-1];
		}
		return [];
	},

	getDiPaiCard:function(){
		return this.dipai;
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
			var point = ddz.GlobalFuncs.numberToValue(num);
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

	setCall: function(call, seatIndex) { //设定seatIndex位置叫的分数，目前只用于设定玩家叫分
		if (seatIndex < 1 || seatIndex > 3) {
			ddz.LOGD(this._TAG, "error seat index in set call!!! return");
			return;
		}
		this.called[seatIndex - 1] = call;
		if (!this._isGrab && call == 3) {
			this.callMulti = 3;
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
		hall.LOGD(this._TAG, 'getCall seatIndex=' + seatIndex + ' and grab type = ' + this._isGrab);
		if (seatIndex < 1 || seatIndex > 3) {
			hall.LOGD(this._TAG, "error seat index in set call!!! return");
			return;
		}
		if (this.called.length >= seatIndex) { //因为是命令叫分，所以不考虑重复让某玩家叫分的情况（已经叫过的话，get直接取值返回），一局游戏中此方法对一个seatIndex只会调用一次
			hall.LOGD(this._TAG, "this seatindex called, error ,return");
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
				}
				else if (this.called[0]==1 && this.called[1]==0) {
					// 单机欢乐场简单处理，下家不抢，上家一定要抢
					call = 1;
				}
				else {
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
		this._super();
		this._typeFinder.destroy();
		// todo：释放图片资源什么的
		ddz.LOGD(this._TAG, " onDestroy ---->ddz.AIRobotClasss");

	},

	playAGame: function() {
		this.initGame();
	},

	// 初始化，参数依次是
	initGame: function() {
		ddz.LOGD(this._TAG, "init game in AI");
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
		this.seatPlayCardCount[seatIndex - 1] +=1;
		this.lastPlayPos = seatIndex;
		this.topCards = cards;
		ddz.LOGD(this._TAG, "this.topCards = " + this.topCards);
	},

	// 让AI打一手牌,返回打的牌（num的数组）,主动出牌不传topcards参数，即为undefined
	genOneStep: function(isInTrust) {
		var cards;
		if (this.lastPlayPos == 0 || this.lastPlayPos == this.currentPlayPos)
		{
			//主动出牌
			ddz.LOGD(this._TAG, "play cards actively......");
			cards = this.playActively(this.currentPlayPos);
		} 
		else
		{
			//被动出牌
			cards = this._passivityCards();
		}
		if (!isInTrust) {
			this.playCards(this.currentPlayPos, cards);
		}

		return cards;
	},

	// 换牌
	exchangeCard: function(cardId) {
		// 根据传入的cardId和上家的牌playerCards[2]进行随即替换
		var srcIdx = this._findId(cardId, this.playerCards[0]);
		if (srcIdx < 0) {
			ddz.LOGD('exchangeCard find srcIdx is error !!!');
			return -1;
		}

		// 随机更换牌的位置
		var randomIndex =  parseInt(Math.random() * this.playerCards[2].length);

		ddz.LOGD('exchangeCard srcval = ' + this.playerCards[0][srcIdx]);
		ddz.LOGD('randomIndex = ' + randomIndex + ' dstCard dstval = ' + this.playerCards[2][randomIndex]);

		// 交换两个数的位置
		var dst = this.playerCards[2][randomIndex];
		this.playerCards[2][randomIndex] = this.playerCards[0][srcIdx];
		this.playerCards[0][srcIdx] = dst;

		return dst;
	},

	_findId: function(cardId, array) {
		// 寻找牌的在数组中的下标
		for (var i = 0; i < array.length; i++) {
			if(array[i] == cardId) {
				return i;
			}
		}

		return -1;
	},

	_passivityCards: function() {
		//被动出牌，管topcard
		var types = this.judgeType(this.topCards, false);
		if(types.length== 0)
		{
			ddz.LOGD(this._TAG, "error!!! top cards illegal...");
			hall.GlobalFuncs.PrintArray(this.topCards);
		}
		if (!this._isIntervene(types[0])) {
			ddz.LOGD(this._TAG, "not isIntervene, this.currentPlayPos = " + this.currentPlayPos);
			return [];
		}

		var win_cards = this.findWinCardsFromArray(types[0], this.playerCards[this.currentPlayPos - 1]); //[[2,3], [4, 5]]...所有能赢的数组，挑第一个传出去即可

		//过滤跟牌，当前出牌的为非地主且上次出牌的也不是地主
		if (!this._isDizhu(this.currentPlayPos) && !this._isDizhu(this.lastPlayPos) && win_cards.length>0) {
			win_cards = this._filterFollowCards(win_cards);
		}
		if (!types || types.length== 0){
			return [];
		}
		if(types[0].getType() == ddz.Enums.PaixingType.SHUNZI_CARD){// V3.705产品要求其他两个玩家出顺子时的顺序为从左到右从大到小排列
			return win_cards.length > 0 ? win_cards[0].reverse() : [];
		}else{
			return win_cards.length > 0 ? win_cards[0] : [];
		}
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
		if (!cardType) {
			return false;
		}
		//进入到此函数中时，上次出牌的一定是队友
		if (this.dizhuPos == this.lastPlayPos) {
			ddz.LOGD(this._TAG, "Error，not my partner !!!!");
			return true;
		}

		//1，只有一张牌时干预队友
		if(this._getCardsCnt(this.currentPlayPos) == 1) {
			return true;
		}

		//2，队友只有一张牌了，不干预
		if (this._getCardsCnt(this.lastPlayPos) <= 1) {
			return false;
		}

		//策划需求：当手牌≤2张时，按现有AI出牌方式出牌
		if(this._getCardsCnt(this.currentPlayPos) <= 2) {
			return true;
		}

		//根据牌型判断是否跟进队友的牌
		return this._isFollowUpPartner(cardType);
	},

	//是否跟进队友的牌
	_isFollowUpPartner :function(cardType) {
		if (this._isDizhu(this.lastPlayPos)) {
			return true;
		}

		if(this._isDizhu(ddz.GlobalFuncs.getPreIndex(this.currentPlayPos))) {
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
			if (cardType.getPoint()<11) {
				return true;
			}
			return false;
		}

		//跟进小于K的对子
		if (cardType.getPoint()<10) {
			return true;
		}
		return false;
	},

	//过滤跟队友的牌
	_filterFollowCards:function(srcCards) {
		//TODO
		//如果跟的是对2、单王、小王的就不跟了
		//防止用对2、大、小王压死队友
		if (srcCards.length <= 0) {
			return srcCards;
		}
		for(var i=0; i<srcCards.length; ++i) {
			ddz.LOGD(this._TAG, "srcCard["+i+"] = " + srcCards[i]);
		}
		var types = this.judgeType(srcCards[0], false);
		ddz.LOGD(this._TAG, "types = " + types);
		if (types.length < 0) {
			return srcCards;
		}
		if (types[0].getPoint() >= 12) {
			//
			ddz.LOGD(this._TAG, "I can not follow : = " + types[0].getPoint());
			return [];
		}
		return srcCards;
	},

	//获取玩家的手牌数量
	_getCardsCnt: function(playerPos) {
		var len = 0;
		if (this.playerCards[playerPos - 1] && this.playerCards[playerPos - 1].length) {
			len = this.playerCards[playerPos - 1].length
		}
		return len;
	},

	//是否是地主
	_isDizhu: function(pos) {
		return this.dizhuPos == pos;
	},

	/*********
	 * arr - 带判断的牌数组
	 * bLzChangable - 是否转化为癞子牌
	 *	true - 可以转化
	 * 	false - 不可以转化
	 */
	judgeType: function(arr, bLzChangable) {	// bLzChangable 表示癞子牌是否需要转化。判断topcard的时候，癞子牌已经是其实际值，不需要转化。主动出牌选牌时，癞子可以转换成任意牌
		var cards = arr.slice(0);	//避免修改原数组
		var len = cards.length;
		var laiziCnt = 0;
		if(!bLzChangable) {		//癞子不可以转化，则把癞子牌转成其实际代表的牌
			for(var i = 0; i < len; i++) {
				if(cards[i] > 53) {
					cards[i] -= 54;	
					++laiziCnt;
				}
			}
		}
		ddz.LOGD(this._TAG, "dump cards arr....");
		// cc.dump(arr);
		
		hall.GlobalFuncs.PrintArray(cards);
		var dicarr = this._getPointCountDicArray(cards);
		var lz_obj = this._getLaiziObject(dicarr);
		var newarr = this._fillDicarr(dicarr);
		ddz.LOGD(this._TAG, "dump new arr......");
		for (var index = 0; index < newarr.length; index++) {
			var tmp = newarr[index];
			ddz.LOGD(this._TAG, "point " + tmp.point + " count " + tmp.count + " cards " + tmp.cards.length);
		}
		return this._typeJudger.judgeType(cards, dicarr, newarr, lz_obj, laiziCnt);
	},

	checkGameOver: function() {
		for (var i = 0; i < 3; i++) {
			if (this.playerCards[i].length == 0) {
				var dizhuwin = (i + 1 == this.dizhuPos);
				var data = {};
				data.dizhuwin = dizhuwin;
				data.winPlayer = i+1;
				return data;
				// return {
				// 	"dizhuwin": dizhuwin
				// };
			}
		}
		// //for test
		// return {
		// 			"dizhuwin": true
		// 		}
		return null;
	},

	startGame: function() { //不要将底牌加入手牌，因为在playController里面, seatInfo.cards与这里的player[]是一个对象，两个地方都插入的话会重复
		ddz.LOGD(this._TAG, "start game, set current playpos " + this.dizhuPos);
		this.currentPlayPos = this.dizhuPos;
	},

	//----------------------------------------------- 判断牌型相关

	_sortByCount: function(o1, o2) {
		return o1.count < o2.count;
	},

	_sortByPoint: function(o1, o2) {
		return o1.point > o2.point;
	},

	_getLaiziObject: function(dicarr) {
		ddz.LOGD('dic arr size is ' + dicarr.length);
		dicarr.sort(this._sortByPoint);

		//找出癞子数目
		var lz_obj = null;
		var tmp = dicarr[dicarr.length - 1]; //从小到大排列，所以最后一个是value最大
		if (null != tmp && tmp.point == 15) {
			lz_obj = {
				count: tmp.count,
				point: tmp.point,
				cards: tmp.cards
			};
			tmp.count = 0; //癞子牌留个占位，因为癞子牌可以当做自己用，例如LLL55544,L为6则为66655544，L为3则为55544433
			tmp.point = ddz.GlobalFuncs.numberToValue(lz_obj.cards[0] - 53);
			tmp.cards = [];
		} else {
			lz_obj = {
				count: 0,
				point: -1,
				cards: []
			};
		}
		return lz_obj;
	},

	_getPointCountDicArray: function(arr) { //把数组number，转换成点数：牌数的数组	点数3 = 0最小，大王 = 14最大
		var cdic = {};
		for (var i = 0; i < arr.length; i++) {
			var num = arr[i];
			var pos = ddz.GlobalFuncs.numberToValue(num);
			var key = "" + pos;
			var value = cdic[key];
			if (value) {
				value.count++;
				value.cards.push(num);
			} else {
				value = {
					"count": 1,
					"cards": [num],
				};
				cdic[key] = value;
			}
		}
		for (var key in cdic) { //把牌排序，避免选2，3张相同点数的时候选上位置上不相连的
			var cards = cdic[key].cards;
			if (cards.length > 1) {
				cards.sort(hall.GlobalFuncs.SortNumberFunc);
			}
		}
		// ddz.LOGD(this._TAG, "dump cdic in get point dic array..........");
		// for (var key in cdic) {
		// 	ddz.LOGD(this._TAG, "point : " + key + " count " + cdic[key].count);
		// 	var nums = cdic[key].cards;
		// 	for (var i = 0; i < nums.length; i++) {
		// 		ddz.LOGD(nums[i] + "\t");
		// 	}
		// }
		// ddz.LOGD(this._TAG, "dump cdic in get point dic array end..........");
		var return_arr = [];
		for (var key in cdic) {
			return_arr.push({
				"point": parseInt(key),
				"count": cdic[key].count,
				"cards": cdic[key].cards
			});
		}
		return return_arr;
	},

	_getPCArrayByCount: function(arr) { //把数组number，转换成点数：牌数数组， 并将此数组按count从大到小排序
		var return_arr = this._getPointCountDicArray(arr);
		return_arr.sort(this._sortByCount);
		return return_arr;
	},

	_getPCArrayByPoint: function(arr) { //把数组number，转换成点数：牌数数组， 并将此数组按point从小到大排序
		var return_arr = this._getPointCountDicArray(arr);
		return_arr.sort(this._sortByPoint);
		return return_arr;
	},

	_fillDicarr: function(dicarr) { //检测连续的时候，因为癞子可以用来填充连续，所以检测连续的数组必须把没有的点数用数量0填充
		//才能每个点数都检测到（虽然飞机的时候，因为癞子数只有4，不可能连续填充2个，但为了统一，还是全部填充）
		dicarr.sort(this._sortByPoint);
		dicarr.reverse(); //按点数从大到小排列
		var newarr = [];
		var start = 14;
		for (var index = 0; index < dicarr.length; index++) { //dicarr是从大到小
			var point = dicarr[index].point;
			if (point > 14) { //dicarr不能出现癞子牌（point = 15）
				ddz.LOGD(this._TAG, "error! should not contain laizi in dicarr");
				break;
			} 
			for (var i = start; i > point; i--) {
				newarr.push({
					"point": i,
					"count": 0,
					"cards": []
				});
			}
			newarr.push(dicarr[index]);
			start = point - 1;
			if (index == dicarr.length - 1 && start >= 0) { //到最小点数时，填充到3
				for (var i = 0; i <= start; i++) {
					newarr.push({
						"point": i,
						"count": 0,
						"cards": []
					});
				}
			}
		}
		return newarr;
	},

	//[20140521][jinrifeng]添加癞子参数(pLaizi)和处理
	//找最小的单牌，用来给三带一， 四带二，飞机带等等, bDivide表示是否拆分，如果不拆分，则不需要ex参数
	//pcArray为已经转换好的point-count数组，按point排好序。count为数量， ex为需要排除的点数， 策略是从小到大找单牌，然后再拆牌
	//包含癞子的情况，如果是主动出牌，先寻找单牌，如果没有
	_findMinSingle: function(pLaizi, pcArray, count, ex, bDivide) {		//如果pcArray是从小到大排列，则是从最小取。 如果是从大到小排列，则是从最大取
        var newarr = pcArray.slice(0);
		ddz.LOGD(this._TAG, "[_findMinSingle][in] newarr.length = " + newarr.length);
		// 把newarr按照生序排列
		newarr.sort(this._sortByPoint);
		var returnArr = [];
		for (var i = 0; i < newarr.length; i++) {
			var t = newarr[i];
			ddz.LOGD(this._TAG, "_findMinSingle t.point = " + t.point);
			if (t.count != 1 || (bDivide && hall.GlobalFuncs.FindInArray(ex, t.point) >= 0) //只有需要拆分的时候，才需要去判断ex
				|| t.point == 15) { //在找单牌时，先排除癞子。
				continue;
			}
			returnArr.push(t.cards[0]);
			ddz.LOGD(this._TAG, "t.cards[0] = " + t.cards[0]);
			if (returnArr.length >= count) {
				ddz.LOGD(this._TAG, "[_findMinSingle][renturn][找到单牌返回]");
				return returnArr;
			}
		}


   //暂时注释掉，不考虑癞子
   //     if (pLaizi != null && pLaizi.count > 0) {
   //     		//取两张单牌时，只给一个癞子。
   //     		returnArr.push(pLaizi.cards[0]);
   //         	if (returnArr.length >= count) {
   //         		ddz.LOGD(this._TAG, "[_findMinSingle][renturn][无单牌，找到癞子返回]");
			// 	return returnArr;
			// }
   //     	}

		if (bDivide) { //单牌不够的时候，拆分对子或者多牌来凑数
			for (var i = 0; i < newarr.length; i++) {
				var t = newarr[i];
				if (t.count > 1 && hall.GlobalFuncs.FindInArray(ex, t.point) < 0) {
					var cards = t.cards;
					for (var j = 0; j < cards.length; j++) {
						returnArr.push(cards[j]);
						if (returnArr.length >= count) {
							ddz.LOGD(this._TAG, "[_findMinSingle][renturn][拆分对子和多牌后返回]");
							return returnArr;
						}
					}
				}
			}
		}

		ddz.LOGD(this._TAG, "[_findMinSingle][out][返回空]");
		return []; //找不到需要的数量，直接返回空数组
	},

	//[20140521][jinrifeng]添加癞子参数(pLaizi)和处理
	//找最小的对子牌，用来给三带2， 四带二，飞机带等等， bDivide表示是否拆分3牌，如果不拆分，则不需要ex参数
	//pcArray为已经转换好的point-count数组，按point排好序。count为数量， ex为需要排除的点数， 策略是从小到大找单牌，然后再拆牌
	_findMinDouble: function(pLaizi, pcArray, count, ex, bDivide) {			//如果pcArray是从小到大排列，则是从最小取。 如果是从大到小排列，则是从最大取
		ddz.LOGD(this._TAG, "[_findMinDouble][in]");
		//pcArray.sort(this._sortByPoint);	//确保是按点数从小到大排序
		for(var i = 0; i < pcArray.length; i++){
			var ele = pcArray[i];
			ddz.LOGD(this._TAG, "长度："+ele.count);
			// ddz.CardTable.print(ele.cards);
		}
        var newarr = pcArray.slice(0);
        var returnArr = [];
		var laizi_use = 0;
		for (var i = 0; i < newarr.length; i++) {
			var t = newarr[i];
			if (t.count != 2 || (bDivide && hall.GlobalFuncs.FindInArray(ex, t.point) >= 0) || t.point == 15) { //只有需要拆分的时候，才需要去判断ex
				continue;
			}
			returnArr.push([t.cards[0], t.cards[1]]);
			if (returnArr.length >= count) {
				ddz.LOGD(this._TAG, "[_findMinDouble][renturn][找到对返回]");
				return returnArr;
			}
		}


        //如果有癞子，寻找单牌后拼接成双牌。
       if (pLaizi != null && pLaizi.count > 0) {
           for (var i = 0; i < newarr.length; i++) {
               var t = newarr[i];
               if (t.point != 15 && t.count ==1 && (hall.GlobalFuncs.FindInArray(ex, t.point) < 0 || !bDivide)) { //寻找单牌
                   returnArr.push([t.cards[0],ddz.GlobalFuncs.getLaiziNumByValue(t.point)]);
                   laizi_use++;
                   if (returnArr.length >= count){
                   	   pLaizi.count -= laizi_use;  //更新癞子数目
                       ddz.LOGD(this._TAG, "[_findMinDouble][renturn][返回单牌带癞子]");
                       return returnArr;
                   }
                   if (laizi_use >= pLaizi.count) 
                   		break;
                }
            }
        }

		if (bDivide) { //拆分3牌，不拆分炸弹
			for (var i = 0; i < newarr.length; i++) { //单牌不够的时候，拆分3张来凑数, 不拆分炸弹
				var t = newarr[i];
				if (t.count == 3 && hall.GlobalFuncs.FindInArray(ex, t.point) < 0) {
					ddz.LOGD(this._TAG, "split 3 cards in find min double");
					var cards = t.cards;
					returnArr.push([cards[0], cards[1]]);
					if (returnArr.length >= count) {
						pLaizi.count -= laizi_use;  //更新癞子数目
						ddz.LOGD(this._TAG, "[_findMinDouble][renturn][拆分3牌]");
						return returnArr;
					}
				}
			}
		}

                                   
        //需要两个癞子变成对的情况
        if (pLaizi != null && pLaizi.count - laizi_use > 1) {
           returnArr.push([pLaizi.cards[0],pLaizi.cards[1]]);
           laizi_use += 2;
           if (returnArr.length >= count) {
           		pLaizi.count -= laizi_use;  //更新癞子数目
           	 	ddz.LOGD(this._TAG, "[_findMinDouble][renturn][返回2个癞子]");
           		return returnArr;
		    }
        }
                                   
		ddz.LOGD(this._TAG, "[_findMinDouble][out][返回空]");
		return []; //找不到需要的数量，直接返回null
	},

	_findBomb: function(pcArray, lz_obj) {
		ddz.LOGD(this._TAG, "start find bomb ....");
		var return_arr = [];
		
		for(var laiziMax = 0; laiziMax <= lz_obj.count; laiziMax++){
			ddz.LOGD('查找需要' + laiziMax + '个癞子的炸弹');
			var newarr = this._fillDicarr(pcArray);
			for (var i = newarr.length - 1; i >= 2; i--) { //最后找炸弹
				var t = newarr[i];
				var need = 4 - t.count;
				if ((need == laiziMax) && (need < 4) && (need <= lz_obj.count)) {	
					var cards = t.cards.slice(0);
					var n = ddz.GlobalFuncs.getLaiziNumByValue(t.point);
					for(var j = 0; j < need; j++) {
						cards.push(n);
					}
					return_arr.push(cards);
				}
			}
		}
		
		// 癞子炸弹
		if(lz_obj.count == 4) {
			var c = lz_obj.cards[0];
			return_arr.push([c, c, c, c]);
		}
		ddz.LOGD(this._TAG, "find bomb length " + return_arr.length);
		return return_arr;
	},

	_findRocket: function(pcArray) {
		ddz.LOGD(this._TAG, "start find rocket ....");
		var bking = false;
		var rking = false;
		for (var i = pcArray.length - 1; i >= 0; i--) { //最后找火箭
			var t = pcArray[i];
			if (t.point == 14) {
				rking = true;
			} 
			else if (t.point == 13) {
				bking = true;
			}
			if (rking && bking) { //一旦找到就break出去
				break;
			}

		}
		var ret = bking&&rking;
		if (ret) {
			ddz.LOGD(this._TAG, "找到了火箭");
		}
		else{
			ddz.LOGD(this._TAG, "没找到火箭");
		}
		return ret;
	},

	// 查找主动出牌的提示
	findActivePlayCards: function(array) {
		// 判断当前的手牌能否组合成一个有效牌型
		var types = this.judgeType(array, true);
		if (types.length > 0) {
			return [array];
		}

		var result = [];
		var tmpArr = this._getPCArrayByPoint(array);
		var lz_obj = this._getLaiziObject(tmpArr);

		this._typeFinder.init(tmpArr, lz_obj);

		return this._typeFinder.find();
	},

	// 查找手牌中的炸弹个数
	findBombResult: function(card) {
		// _findBomb
		var result = [];
		var tmpArr = this._getPCArrayByPoint(array);
		var lz_obj = this._getLaiziObject(tmpArr);

		this._typeFinder.init(tmpArr, lz_obj);

		var bomb = this._typeFinder._findBomb();	
		var rocket = this._typeFinder._findRocket();

		return bomb.length + rocket.length;
	},

	/* 
	 * 被动出牌：从牌堆中找出可以赢过的牌数组
	 * array是指的0-53的值，当然，癞子>53
	 * type - 牌型
	 * array - 手牌
	 */
	findWinCardsFromArray: function(type, array) { //从array中找到所有可以赢过type的手牌组成数组传回
		ddz.LOGD(this._TAG, "in find win cards from arrary");
		var len = array.length;
		var tmpArr = this._getPCArrayByPoint(array);

		//[20140521][jinrifeng] 癞子处理 使用接口
		var lz_obj = this._getLaiziObject(tmpArr);
		ddz.LOGD(this._TAG, "癞子张数in findWinCardsFromArray"+lz_obj.count);
		ddz.LOGD(this._TAG, "dump tmparr in find wincards");
		for(var index = 0; index < tmpArr.length; index++) {
			var f = tmpArr[index];
			ddz.LOGD(this._TAG, " point " + f.point + "count " + f.count );
		}

		if (!type){
			return
		}

		// 单独处理火箭和火箭致胜的情况
		if( type.getType() == ddz.Enums.PaixingType.ROCKET ){
			return []; 	// 火箭最大，管不上
		}

		// 火箭致胜：火箭+一手牌，先出火箭
		if(this._rocketWin(array, true)){
			var return_arr = [];
			return_arr.push([52, 53]);	
			return return_arr;
		}

		switch (type.getType()) {
				//单牌
			case ddz.Enums.PaixingType.SINGLE_CARD:
				return this._findWinSingle(type, tmpArr, lz_obj);

				//对牌
			case ddz.Enums.PaixingType.DOUBLE_CARD:
				return this._findWinDouble(type, tmpArr, lz_obj);

				//三张，三带一，三带二
			case ddz.Enums.PaixingType.THREE_CARD:
			case ddz.Enums.PaixingType.THREE_ONE_CARD:
			case ddz.Enums.PaixingType.THREE_TWO_CARD:
				ddz.LOGD(this._TAG, "测试三带类型"+type.getType());
				return this._findWinThree(type, tmpArr, lz_obj);

				//4张，4带2单， 4带2对
			case ddz.Enums.PaixingType.BOMB_CARD:
			case ddz.Enums.PaixingType.BOMB_TWO_CARD:
			case ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD:
				return this._findWinBomb(type, tmpArr, lz_obj);

				//顺子，连对，飞机毛都不带，飞机带2单，飞机带2对
			case ddz.Enums.PaixingType.SHUNZI_CARD:
			case ddz.Enums.PaixingType.LIANDUI_CARD:
			case ddz.Enums.PaixingType.AIRCRAFT_CARD:
			case ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD:
			case ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD:
				return this._findWinContinous(type, tmpArr, lz_obj);

			default:
				ddz.LOGD(this._TAG, "error card_type in findWinCardsFromArray!!!");
				return [];
		}
	},

	//被动出牌：单牌
	//从array中找到管type的手牌集合，策略是先找大于的单牌，其次再拆散其他牌型
	_findWinSingle: function(type, pc, lz_obj) {
		ddz.LOGD(this._TAG, "find win single......in robots");
		//返回结果，把每一种能管得住type得牌放入其中
		var return_arr = [];
		var needSingleJoker = true;
		
		//优先把单数的牌都push进去
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			if (t.point > type.getPoint() && t.count == 1) {
				return_arr.push([t.cards[0]]);
			}
		}

		//其次拆散非单牌
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			if (t.point > type.getPoint() && (t.count == 2 || t.count == 3)) {
				return_arr.push([t.cards[0]]);
			}
		}

		///////////////////////////////////////////////////////////////考虑癞子
		//分为两种情况
		if (lz_obj.count >= 1) {
			//癞子牌不用作癞子，用作它本来的值
			//癞子的实际pos值
			var realPoint = ddz.GlobalFuncs.numberToValue(ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]));
			if (realPoint > type.getPoint()) {
				return_arr.push([lz_obj.cards[0]]);
			}

			//癞子牌用作癞子
			//哎呦我操，对于单牌来说，癞子没法癞
		}

		//最后是炸弹
		//不找火箭，因为有大小王则在前面选单会选择
		ddz.LOGD(this._TAG, "found bomb in find win single");
		var bombs = this._findBomb(pc, lz_obj);
		return_arr = return_arr.concat(bombs);

		//找火箭
		if(this._findRocket(pc)){
			return_arr.push([52, 53]);
		}

		//查找完毕，返回结果
		return return_arr;
	},

	//被动出牌：对子
	_findWinDouble: function(type, pc, lz_obj) {
		ddz.LOGD(this._TAG, "find win double......in robots");

		var return_arr = [];

		////////////////////////////////////////////////////////////////////简单搜索
		//优先把对子的牌都push进去
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			if (t.point > type.getPoint() && t.count == 2) {
				return_arr.push([t.cards[0], t.cards[1]]);
			}
		}

		//////////////////////////////////////////////////////////////////////考虑癞子
		if (lz_obj.count >= 1) {

			ddz.LOGD(this._TAG, "使用癞子 in _findWinDouble");
			//(1)当癞子牌当做癞子使用时,凑对子

			for(var nIndex = 0; nIndex < pc.length; nIndex++){
				var t = pc[nIndex];

				if (t.point > type.getPoint()&&t.count == 1) {
					//不能和大小王凑对子
					if (t.point == 13 || t.point == 14) {
						continue;
					}
					ddz.LOGD(this._TAG, "凑对子 in _findWinDouble");
					//和其他牌凑对子
					//癞子凑对后的count值
					var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);
					return_arr.push([t.cards[0], newCount]);
				}
			}

			//（2）当癞子牌不当癞子用时,当lz_obj.count==4时在炸弹中处理
			if (lz_obj.count == 2 || lz_obj.count == 3) {
				var realPoint = ddz.GlobalFuncs.numberToValue(ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]));

				ddz.LOGD(this._TAG, "_in findWinDouble 癞子不癞，realpoint = "+realPoint);
				if (realPoint>type.getPoint()) {
					ddz.LOGD(this._TAG, "_in findWinDouble 癞子不癞,成功");
					return_arr.push([lz_obj.cards[0],lz_obj.cards[1]]);
				}
			}
		}


		//其次拆散3张
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			if (t.point > type.getPoint() && t.count == 3) {
				return_arr.push([t.cards[0], t.cards[1]]);
			}
		}


		////////////////////////////////////////////////////////////////////找炸弹及火箭
		var bombs = this._findBomb(pc, lz_obj);
		return_arr = return_arr.concat(bombs);
		if (this._findRocket(pc)) {
			return_arr.push([52, 53]);
		}

		return return_arr;
	},

	//拷贝一个p-c-c对象
	_copyOnePCObj:function(dest,src){
		ddz.LOGD(this._TAG, "复制一个pc格式的对象");
		dest.count = src.count;
		dest.point = src.point;
		dest.cards = [];
		if (src.count<=0) {
			//ddz.LOGD(this._TAG, "复制失败");
			return;
		}
		for (var i = 0;i<src.count; i++) {
			dest.cards.push(src.cards[i]);
		}
	},

	//拷贝由（point - count - cards ）对象组成的数组
	_copyPCArr:function(dest,src){
		ddz.LOGD(this._TAG, "复制pcArr");
		for(var nIndex = 0;nIndex < src.length;nIndex++){
			var pcObj = {};
			this._copyOnePCObj(pcObj,src[nIndex]);
			dest.push(pcObj);
		}
		
	},
	//被动出牌：三带
	_findWinThree: function(type, pc, lz_obj) { //找到能管住type的所有三不带, 三带一， 三带二
		ddz.LOGD(this._TAG, "find win three......in robots");
		var return_arr = [];		
		//类型
		var t_type = type.getType();

		/////////////////////////////////////////////////////////////////不使用癞子
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			//找三张
			if (t.point > type.getPoint() && t.count == 3) {
				// cc.dump(t.cards);
				//一个可能的解
				var tmp = [t.cards[0], t.cards[1], t.cards[2]];

				//////////////////////////找带的牌
				//三带一，找一个单牌
				if (t_type == ddz.Enums.PaixingType.THREE_ONE_CARD) {
					var extra = this._findMinSingle(lz_obj,pc, 1, [t.point], true);
					//找到了可以带的牌，则当前可能解添加进可带的牌
					if(extra.length > 0){
						tmp.push(extra[0]);
					}
					else{
						tmp = [];
					}
				}
				//三带二 
				else if (t_type == ddz.Enums.PaixingType.THREE_TWO_CARD) {
					var extra = this._findMinDouble(lz_obj,pc, 1, [t.point], true);
					//找到可带的对子，则添加进当前可能解
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
					}
					//找不到可带的对子，则当前解作废
					else {
						tmp = [];
					}
				}

				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
			}
		}

		///////////////////////////////////////////////////////////////使用癞子
		//临时保存一下癞子
		var lz_objTmp = {};
		this._copyOnePCObj(lz_objTmp,lz_obj);

		//（1）癞子牌当做癞子使用，凑三张

		//（1.1）先凑2原牌+1癞子

		for(var nIndex = 0; nIndex < pc.length; nIndex++){
			var t = pc[nIndex];

			//先凑三张，再找带的牌

			if(t.point>type.getPoint()&&t.count == 2&&(lz_obj.count==1||lz_obj.count==2||lz_obj.count == 3)){
				
				//////////////////////////////(step1)凑三张
				//癞子凑数后的count值
				var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);
				var tmp = [t.cards[0], t.cards[1], newCount];
				//去掉癞子数
				lz_obj.count--;
				lz_obj.cards.pop();

				/////////////////////////////(step2)找带的牌
				//三带一，找一个单牌
				if (t_type == ddz.Enums.PaixingType.THREE_ONE_CARD) {
					var extra = this._findMinSingle(lz_obj,pc, 1, [t.point], true);
					//找到了可以带的牌，则当前可能解添加进可带的牌
					if (extra.length > 0) {
						tmp.push(extra[0]);
					}
					//没有可带的牌，则当前可能解作废 
					else {
						tmp = [];
					}
				}
				//三带二 
				else if (t_type == ddz.Enums.PaixingType.THREE_TWO_CARD) {
					var extra = this._findMinDouble(lz_obj,pc, 1, [t.point], true);
					//找到可带的对子，则添加进当前可能解
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
					}
					//找不到可带的对子，则当前解作废
					else {
						tmp = [];
					}
				}
				if (tmp.length > 0) {
					return_arr.push(tmp);
				}

				//恢复原癞子信息
				this._copyOnePCObj(lz_obj,lz_objTmp);
			}
		}

		//（1.2）再凑1原牌+2癞子 
		this._copyOnePCObj(lz_obj,lz_objTmp);

		for(var nIndex = 0; nIndex < pc.length; nIndex++){
			var t = pc[nIndex];
			//////////////////////////////先凑三张，再找带的牌

			if(t.point>type.getPoint()&&t.count == 1&&(lz_obj.count == 2||lz_obj.count == 3)){
				
				//不能和大小王拼三张
				if (t.point == 13 || t.point == 14) {
					continue;
				}

				/////////////////////////////（step1）凑三张
				//癞子凑数后的count值
				var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);
				var tmp = [t.cards[0], newCount, newCount];
				//去掉癞子数
				lz_obj.count -= 2;
				lz_obj.cards.pop();
				lz_obj.cards.pop();
				/////////////////////////////(step2)找带的牌
				//三带一，找一个单牌
				if (t_type == ddz.Enums.PaixingType.THREE_ONE_CARD) {
					var extra = this._findMinSingle(lz_obj,pc, 1, [t.point], true);
					//找到了可以带的牌，则当前可能解添加进可带的牌
					if (extra.length > 0) {
						tmp.push(extra[0]);
					}
					//没有可带的牌，则当前可能解作废 
					else {
						tmp = [];
					}
				}
				//三带二 
				else if (t_type == ddz.Enums.PaixingType.THREE_TWO_CARD) {
					var extra = this._findMinDouble(lz_obj,pc, 1, [t.point], true);
					//找到可带的对子，则添加进当前可能解
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
					}
					//找不到可带的对子，则当前解作废
					else {
						tmp = [];
					}
				}
				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
				//恢复原癞子信息
				this._copyOnePCObj(lz_obj,lz_objTmp);
			}
		}

		//（2）假如癞子牌不当做癞子使用，当lz_obj.count==4时在炸弹中处理
		this._copyOnePCObj(lz_obj,lz_objTmp);
		// cc.dump(lz_obj.cards);
		if (lz_obj.count == 3) {
			var realPoint = ddz.GlobalFuncs.numberToValue(ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]));

			if (realPoint>type.getPoint()) {
				//初始化三张牌
				var tmp = [lz_obj.cards[0],lz_obj.cards[1],lz_obj.cards[2]]
				lz_obj.count -= 3;
				lz_obj.cards.pop();
				lz_obj.cards.pop();
				lz_obj.cards.pop();

				//再找带的牌
				//三带一，找一个单牌
				if (t_type == ddz.Enums.PaixingType.THREE_ONE_CARD) {
					var extra = this._findMinSingle(lz_obj,pc, 1, [], true);
					//找到了可以带的牌，则当前可能解添加进可带的牌
					if (extra.length > 0) {
						tmp.push(extra[0]);
					}
					//没有可带的牌，则当前可能解作废 
					else {
						tmp = [];
					}
				}
				//三带二 
				else if (t_type == ddz.Enums.PaixingType.THREE_TWO_CARD) {
					var extra = this._findMinDouble(lz_obj,pc, 1, [], true);
					//找到可带的对子，则添加进当前可能解
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
					}
					//找不到可带的对子，则当前解作废
					else {
						tmp = [];
					}
				}			
				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
			}
		}
		//恢复癞子
		this._copyOnePCObj(lz_obj,lz_objTmp);
		//////////////////////////////////////////////////////////////////////////////找炸弹及火箭
		
		var bombs = this._findBomb(pc, lz_obj);
		return_arr = return_arr.concat(bombs);
		if (this._findRocket(pc)){
			return_arr.push([52, 53]);
		}
		return return_arr;
	},

	// 获取炸弹类型
	// 'pureLzBomb',	//纯癞子炸弹，大于普通炸弹小于王炸
	// 'normalBomb',	//普通炸弹，大于癞子炸弹
	// 'softBomb',		//软炸弹，小于普通炸弹，大于其他牌
	// 'notBomb'		//不是炸弹
	_getBombType:function(type){
		// 不是4张，不可能是炸弹
		if (type._cards.length != 4) {
			return 'notBomb';
		};

		// cc.dump(type);

		// 牌型
		var t_type = type.getType();
		// 是炸弹
		if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
			ddz.LOGD('LaiziCount = ' + type._laiZiCnt);
			if( typeof(type._laiZiCnt) == "undefined" || type._laiZiCnt <= 0) {
				return 'normalBomb';
			}
			else if (type._laiZiCnt == 4) {
				return 'pureLzBomb';
			}
			return 'softBomb';
		}
		//不是炸弹
		else{
			return 'notBomb';
		}
	},

	/***
	 * 被动出牌
	 * 找到能管住type的所有炸弹, 4带2， 4带2对
	 */
	_findWinBomb: function(type, pc, lz_obj) {
		ddz.LOGD(this._TAG, "find win bomb......in robots");
		var return_arr = [];

		//四带类型
		var t_type = type.getType();
		//炸弹类型，在这里获知炸弹类型，纯癞子炸弹 > 普通炸弹 > 癞子炸弹
		var bombType = this._getBombType(type);
		ddz.LOGD(this._TAG, "bombType = " + bombType);

		///////////////////////////////////////////////////////////////////////////不考虑癞子
		//先找到四张，再找带的牌
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];

			//找到四张
			if(t.count == 4){
				//常规四张
				var tmp = [t.cards[0], t.cards[1], t.cards[2], t.cards[3]];

				//////////////////////////找带的牌
				//4带2，找2个单牌
				if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
					if(t.point > type.getPoint()){
						var extra = this._findMinSingle(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
						tmp = tmp.concat(extra);
						} 
						else {
							tmp = [];
						}
					}
					
				}
				//4带2对
				else if (t_type == ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
					if(t.point > type.getPoint()){
						var extra = this._findMinDouble(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
							tmp = tmp.concat(extra[0]);
							tmp = tmp.concat(extra[1]);
						} else {
							tmp = [];
						}
					}
					
				}
				//4毛带不带
				else if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
					//上家牌是纯癞子炸弹
					if(bombType == 'pureLzBomb'){
						//如果不使用癞子，那么除了火箭永远都干不过纯癞子炸弹
						tmp = [];
					}
					// 软炸弹
					else if(bombType == 'softBomb'){
						//所有常规炸弹(不考虑点数)和部分软炸弹（当前不考虑）
						;
					}
					//常规炸弹
					else if (bombType == 'normalBomb') {
						if(t.point <= type.getPoint()){
							tmp = [];
						}
					}
					//不是炸弹啊
					else
					{
						tmp = [];
					}
				}
				//根本不是四带啊
				else{
					tmp = [];
				}

				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
			}
			
		}

		//////////////////////////////////////////////////////////////////////////考虑癞子

		//临时保存一下癞子
		var lz_objTmp = {};
		this._copyOnePCObj(lz_objTmp,lz_obj);
		
		//（1）癞子牌当癞子使用
		//(1.1)三张原牌+1癞子
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			//四张纯癞子不应该拆
			if (t.count == 3 && (lz_obj.count >= 1&&lz_obj.count<4)) {
				var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);

				var tmp = [t.cards[0], t.cards[1], t.cards[2], newCount];

				//癞子使用更新
				lz_obj.count -= 1;
				lz_obj.cards.pop();

				//找带的牌
				//4带2，找2个单牌
				if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
					if(t.point > type.getPoint()){
						var extra = this._findMinSingle(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
							tmp = tmp.concat(extra);
						} 
						else {
							tmp = [];
						}
					}
					
				}
				//4带2对
				else if (t_type == ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
					if(t.point > type.getPoint()){
						var extra = this._findMinDouble(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
							tmp = tmp.concat(extra[0]);
							tmp = tmp.concat(extra[1]);
						} 
						else {
							tmp = [];
						}
					}
					
				}
				//4毛带不带
				else if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
					//上家牌是纯癞子炸弹
					if(bombType == 'pureLzBomb'){
						//软炸弹干不过
						tmp = [];
					}
					// 软炸弹
					else if(bombType == 'softBomb'){
						//只有点数大得软炸弹才能干的过
						if (t.point<=type.getPoint()) {
							tmp = [];
						}
					}
					//常规炸弹
					else if (bombType == 'normalBomb') {
						//软炸弹干不过常规炸弹
						tmp = [];
					}
					//不是炸弹啊
					else
					{
						tmp = [];
					}
				}
				//根本不是四带
				else
				{
					tmp = [];
				}
				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
				//恢复癞子
				this._copyOnePCObj(lz_obj,lz_objTmp);
			}

		}

		//(1.2)2张原牌+2癞子
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			if (t.count == 2 && (lz_obj.count >= 2 && lz_obj.count <= 3)) {
				var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);

				var tmp = [t.cards[0], t.cards[1], newCount, newCount];

				//癞子使用更新
				lz_obj.count -= 2;
				lz_obj.cards.pop();
				lz_obj.cards.pop();

				//找带的牌
				//4带2，找2个单牌
				if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
					if(t.point > type.getPoint()){
						var extra = this._findMinSingle(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
							tmp = tmp.concat(extra);
						} else {
							tmp = [];
						}
					}
				}
				//4带2对
				else if (t_type == ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
					if(t.point > type.getPoint()){
						var extra = this._findMinDouble(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
							tmp = tmp.concat(extra[0]);
							tmp = tmp.concat(extra[1]);
						} else {
							tmp = [];
						}
					}
				}
				//4毛带不带
				else if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
					//上家牌是纯癞子炸弹
					if(bombType == 'pureLzBomb'){
						//软炸弹干不过
						tmp = [];
					}
					// 软炸弹
					else if(bombType == 'softBomb'){
						//只有点数大得软炸弹才能干的过
						if (t.point<=type.getPoint()) {
							tmp = [];
						}
					}
					//常规炸弹
					else if (bombType == 'normalBomb') {
						//软炸弹干不过常规炸弹
						tmp = [];
					}
					//不是炸弹啊
					else
					{
						tmp = [];
					}
				}
				else{
					tmp = [];
				}
				if (tmp.length > 0) {
					return_arr.push(tmp);
				}

				//恢复癞子
				this._copyOnePCObj(lz_obj,lz_objTmp);
			}

		}

		//(1.3)1张原牌+3癞子
		for (var i = 0; i < pc.length; i++) {
			var t = pc[i];
			if (t.count == 1 && lz_obj.count == 3) {
				
				//不能和大小王拼四张
				if (t.point == 13 || t.point == 14) {
					continue;
				}

				var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);
				//初始化四张牌
				var tmp = [t.cards[0], newCount, newCount, newCount];

				//癞子使用更新
				lz_obj.count -= 3;
				lz_obj.cards.pop();
				lz_obj.cards.pop();
				lz_obj.cards.pop();

				//找带的牌
				//4带2，找2个单牌
				if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
					if (t.point > type.getPoint()) {
						var extra = this._findMinSingle(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
							tmp = tmp.concat(extra);
						} else {
							tmp = [];
						}
					}
				}
				//4带2对
				else if (t_type == ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
					if (t.point > type.getPoint()) {
						var extra = this._findMinDouble(lz_obj,pc, 2, [t.point], true);
						if (extra.length > 0) {
							tmp = tmp.concat(extra[0]);
							tmp = tmp.concat(extra[1]);
						} else {
							tmp = [];
						}
					}
				}
				//4毛带不带
				else if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
					//上家牌是纯癞子炸弹
					if(bombType == 'pureLzBomb'){
						//软炸弹干不过
						tmp = [];
					}
					// 软炸弹
					else if(bombType == 'softBomb'){
						//只有点数大得软炸弹才能干的过
						if (t.point<=type.getPoint()) {
							tmp = [];
						}
					}
					//常规炸弹
					else if (bombType == 'normalBomb') {
						//软炸弹干不过常规炸弹
						tmp = [];
					}
					//不是炸弹啊
					else
					{
						tmp = [];
					}
				}
				else{
					tmp = [];
				}
				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
				//恢复癞子
				this._copyOnePCObj(lz_obj,lz_objTmp);
			}

		}


		//（2）癞子不癞
		if (lz_obj.count == 4) {
			var realPoint = ddz.GlobalFuncs.numberToValue(ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]));

			if (realPoint>type.getPoint()) {
				//先初始化四张牌
				var tmp = [lz_obj.cards[0], lz_obj.cards[1], lz_obj.cards[2], lz_obj.cards[3]];

				//癞子使用更新
				lz_obj.count -= 4;
				lz_obj.cards.pop();
				lz_obj.cards.pop();
				lz_obj.cards.pop();
				lz_obj.cards.pop();

				//再找带的牌
				//4带2，找2个单牌
				if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
					var extra = this._findMinSingle(lz_obj,pc, 2, [], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra);
					} else {
						tmp = [];
					}
				}
				//4带2对
				else if (t_type == ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
					var extra = this._findMinDouble(lz_obj,pc, 2, [], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
						tmp = tmp.concat(extra[1]);
					} else {
						tmp = [];
					}
				}
				//4毛带不带
				//else if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
			//		;
			//	}
				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
				//恢复癞子
				this._copyOnePCObj(lz_obj,lz_objTmp);
			}
		};



		//找火箭
		if (this._findRocket(pc)) {
			return_arr.push([52, 53]);
		}
		return return_arr;
	},

	//被动出牌
	////找到能管住type的顺子, 连对， 飞机
	_findWinContinous: function(type, pc, lz_obj) {
		ddz.LOGD(this._TAG, "find win continious, type :" + type.getType() + " point " + type.getPoint() + " count " + type.getCount()); 
		//顺子为array长度，连对为array长度/2， 飞机为array长度/4
		var continue_count;

		//顺子为1， 连对为2， 飞机为3
		var cell_count;
		var t_type = type.getType();
		switch (t_type) {
			//顺子
			case ddz.Enums.PaixingType.SHUNZI_CARD:
				ddz.LOGD(this._TAG, 'test find wincard 00000');
				continue_count = type.getCount();
				cell_count = 1;
				break;

				//连对
			case ddz.Enums.PaixingType.LIANDUI_CARD:
				ddz.LOGD(this._TAG, 'test find wincard 00001');
				continue_count = type.getCount() / 2;
				cell_count = 2;
				break;

				//飞机	
			case ddz.Enums.PaixingType.AIRCRAFT_CARD:
				ddz.LOGD(this._TAG, 'test find wincard 00002');
				continue_count = type.getCount() / 3;
				cell_count = 3;
				break;

				//飞机带点东西	
			case ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD:
			case ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD:
				ddz.LOGD(this._TAG, 'test find wincard 00003');
				continue_count = Math.floor(type.getCount() / 4);
				cell_count = 3;
				break;
			default:
				ddz.LOGD(this._TAG, "error in find win continous!!! illegal type");
		}
		var return_arr = [];
		var newarr = this._fillDicarr(pc);
		newarr.reverse(); //因为从小到大找起，所以要reverse
		// ddz.LOGD(this._TAG, "dump new arr in find win continuous......");
		// for (var index = 0; index < newarr.length; index++) {
		// 	var tmp = newarr[index];
		// 	ddz.LOGD(this._TAG, " point: " + tmp.point + " count " + tmp.count + " cards " + tmp.cards.length);
		// }
		for (var index = 0; index + continue_count <= newarr.length  - 3; index++) {	// 2不能在顺子连对飞机中
			var point = newarr[index].point;
			if (point <= type.getPoint()) { 
				continue;
			}

			// 按照使用的癞子数从少到多寻找解
			for (var laiziMax = 0; laiziMax <= lz_obj.count; laiziMax++) {
				ddz.LOGD('查找需要' + laiziMax + "个癞子的解");
				var cards = [];
				var exc = [];
				var lz_used = 0;
				var sub_index = 0;

				while (sub_index < continue_count) {
					var tmp = newarr[index + sub_index];
					var tmp_cards = tmp.cards;
					if (tmp.count >= cell_count) {
						for (var i = 0; i < cell_count; i++) {
							cards.push(tmp_cards[i]);
						}
					} else {
						var need = cell_count - tmp.count;
						if ((need == laiziMax) && (lz_obj.count - lz_used >= need)) { //癞子足够的话
							cards = cards.concat(tmp.cards);
							var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
							for (var i = 0; i < need; i++) {
								cards.push(n);
							}
							lz_used += need;
						} else { //癞子不够用， break
							cards = [];
							ddz.LOGD(this._TAG, "break ,laizi not enough");
							break;
						}
					}
					exc.push(tmp.point);
					sub_index++;
				} //while

				if (cards.length > 0) {
					if (t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD || t_type == ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD) { //找翅膀
						//不能把飞机找齐了，再去找翅膀，因为翅膀可能会拆掉3个生成
						// ddz.LOGD(this._TAG, "dump exc....");
						// for(var i = 0; i < exc.length; i++) {
						// 	ddz.LOGD(exc[i]);
						// }
						var newlz = {"point" : lz_obj.point, "count":lz_obj.count - lz_used, "cards":lz_obj.cards};
						var extra = t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD ? this._findMinSingle(newlz, pc, continue_count, exc, true) : this._findMinDouble(newlz, pc, continue_count, exc, true);
						if(extra.length > 0) {
							cc.log('test find wincard 00004 cards = ' + JSON.stringify(cards));
							if (t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD) {
								//飞机带单牌可以直接这么拼
								cards = cards.concat(extra);
							}else{
								//飞机带俩／仨对，需要单独拼接
								for (var i=0; i<continue_count&&extra[i]; i++) {
									// 此时返回的是元素是数组的数组[[13,26],[30,43]]
									cards = cards.concat(extra[i]);									
								}
							}
							cc.log('test find wincard 00005 extra = ' + JSON.stringify(extra));
							cc.log('test find wincard 00006 cards = ' + JSON.stringify(cards));
						} else {	//找不够翅膀，清空cards
							cards = [];
						}
					}

					if(cards.length > 0) {
						return_arr.push(cards);
					}
				}
			}
		}

		// 找炸弹解
		var bombs = this._findBomb(pc, lz_obj);
		return_arr = return_arr.concat(bombs);

		// 找火箭解
		if (this._findRocket(pc)){
			return_arr.push([52, 53]);
		}
		return return_arr;
	},

	_rocketWin: function(cards) {
		cards.sort(hall.GlobalFuncs.SortNumberFunc); //先从小到大排列
		var len = cards.length;
		if (cards[len - 1] == 53 && cards[len - 2] == 52) {
			if( cards.length == 2 ){
				return true;		// 只有两张牌了，大小王，必然是双王致胜
			}

			var left = cards.slice(0, len - 2);
			var types = this.judgeType(left, true);
			if (types.length > 0) {
				return true;
			}
		}
		return false;
	},

	_findAvailableAircraft: function(newarrpara, lz_obj) {

		// ddz.LOGD('laizi count '+ lz_obj.count + '; before find aircraft ! in _findAvailableAircraft');

		var newarr = [];
		this._copyPCArr(newarr,newarrpara);

		var resultObj = this._findAvailableContinous(newarr, 3, lz_obj);
		var return_arr = resultObj.cards;

		// ddz.LOGD('after find aircraft');
		// ddz.LOGD('return_arr len == ' + return_arr.length);

		for (var i = 0; i < return_arr.length; i++) {
			ddz.LOGD('times == ' + i);

			var num = return_arr[i];
			var point = ddz.GlobalFuncs.numberToValue(num);

			newarr[point].count = 0; // 将数量置为0
			newarr[point].cards = [];
		};


		//寻找翅膀,先找对子，再找单数
		var len = return_arr.length;

		if (len > 0) {
			ddz.LOGD('reshow the arr');
			for (var i = 0; i < newarr.length; i++) {
				var aObj = newarr[i];

				ddz.LOGD(this._TAG, "point : " + aObj.point + " count: " + aObj.count);

				var str = '';

				for (var j = 0; j < aObj.count; j++) {
					var point = ddz.GlobalFuncs.numberToValue(aObj.cards[j]);
					str = str + '[' + point + ']';
				};

				ddz.LOGD(str);
			};

			var pairs = this._findMinDouble(lz_obj, newarr, len / 3, [], false); // 找带的对子
			var p_length = pairs.length;
			if (p_length > 0) {
				ddz.LOGD(this._TAG, "find min double in find available aircraft....");

				for (var k = 0; k < p_length; k++) {
					return_arr = return_arr.concat(pairs[k]);
				}
				return return_arr;
			}
			var singles = this._findMinSingle(lz_obj, newarr, len / 3, [], false); //[1,2,3,4]...
			if (singles.length > 0) {
				ddz.LOGD(this._TAG, "find min single in find available aircraft....");
				return_arr = return_arr.concat(singles);
				return return_arr;
			}
		}
		// ddz.LOGD('reshow the arr ----end');
		// ddz.LOGD('laizi count == ' + lz_obj.count);
		return return_arr;
	},

	//找最大连对cell_count = 2, 顺子cell_count = 1， 不包括2和双王, 
	_findAvailableContinous: function(newarr, cell_count, lz_obj) {
		ddz.LOGD('laizi count '+ lz_obj.count + ';  _findAvailableContinous, cell_count == ' + cell_count);
		var index_report = -1;
		// 默认是升序排列newarr，如果要找最大的可以倒序
		for (var index = 0; index < 11; index++) {
			// 连子的最小是点数3，最大是A
			var lz_use = 0;
			var i = 0;
			var cards = [];
			var point = -1;
			// ddz.LOGD(this._TAG, "now start index : " + index);

			while (i <= (11 - index)) {
				var sub_index = index + i;
				var tmp = newarr[sub_index];

				// ddz.LOGD(this._TAG, "sub index " + sub_index + " point == " + tmp.point);
				var need = cell_count - tmp.count;
				if (need < 0) {
					// 不要拆更多张数的主牌型，比如找飞机时不要拆炸弹，找连对时，不要拆3张
					ddz.LOGD('not divide' + 'index == ' +index);
					break;
				}
				lz_use += need;
				// ddz.LOGD('lz_use == ' + lz_use + 'laizi count == ' + lz_obj.count);
				if (lz_use > lz_obj.count) {
					//  不够时要还原回去
					lz_use -= need;

					// ddz.LOGD('laizi not enough!' + 'index ==' +index);
					break;
				}
				point = tmp.point;

				if (need > 0) {
					//需要用癞子补，则把癞子转换成相应的值
					var n = ddz.GlobalFuncs.getLaiziNumByValue(point);
					for (var j = 0; j < need; j++) {
						cards.push(n);
					}
				}
				// ddz.LOGD('push cards at index :' + sub_index);
				cards = cards.concat(tmp.cards);
				i++;
				// ddz.LOGD(this._TAG, "i " + i + " array index " + index);
			}

			var clen = cards.length;
			if (clen >= 5) {
				// 找到1个就可以了
				ddz.LOGD('find Available Continous------------ index == ' + index);

				// 更新癞子的数量
				lz_obj.count -= lz_use;
				ddz.LOGD('laizi count == ' + lz_obj.count);
				// ddz.CardTable.print(cards);
				return {
					'index': index - 1,
					'len': i,
					'cards': cards
				};
			}
		}

		// 找不到时返回空数组
		return {
			'index': -1,
			'len': 0,
			'cards': []
		};
	},
	//找最大连对cell_count = 2, 顺子cell_count = 1， 不包括2和双王, 
	_findAvailableContinousDevide: function(newarr, cell_count, lz_obj) {
		ddz.LOGD('laizi count '+ lz_obj.count + ';  _findAvailableContinous, cell_count == ' + cell_count);
		// 默认是升序排列newarr，如果要找最大的可以倒序
		var return_arr = [];
		//index为起始搜索位置
		//curIndex是张数
		for (var index = 0; index < 11; index++){
			// 连子的最小是点数3，最大是A
			var lz_use = 0;
			var curIndex = 0;
			var cards = [];
			var point = -1;
			// ddz.LOGD(this._TAG, "now start index : " + index);

			while (curIndex <= (11 - index)) {
				var sub_index = index + curIndex;
				var tmp = newarr[sub_index];
				point = tmp.point;
				//还缺几张牌？
				//if need==0：正好
				//if need>0：缺need张
				//if need<0：多了（-need）张
				var need = cell_count - tmp.count;

				//需要用癞子补，则把癞子转换成相应的值
				if (need > 0) {
					//剩余癞子数
					var remainLzCnt = lz_obj.count - lz_use;

					//如果癞子不够或者没有癞子
					if(remainLzCnt < need){
						// index = sub_index + 1;
						// ddz.LOGD(this._TAG, "new index == "+index);
						break;
					}
					//癞子足够，用癞子补
					else{
						//增加使用计数
						lz_use += need;
						var n = ddz.GlobalFuncs.getLaiziNumByValue(point);
						for (var j = 0; j < need; j++) {
							cards.push(n);
						}
						cards = cards.concat(tmp.cards);
					}

					
				}
				//不需要用癞子补
				else
				{
					// ddz.CardTable.print(tmp.cards);
					for(var i = 0;i<cell_count;i++)
					{
						cards.push(tmp.cards[i]);
					}
				}
				curIndex++;
			}

			var clen = cards.length;
			if (clen >= 5) {
				// 
				ddz.LOGD('find Available Continous------------ curStart == ' + index);

				// 更新癞子的数量
				lz_obj.count -= lz_use;
				ddz.LOGD('laizi count == ' + lz_obj.count);
				// ddz.CardTable.print(cards);

				var oneResult = {
					'index': index - 1,
					'len': curIndex,
					'cards': cards
				}; 
				return_arr.push(oneResult);
			}
		}


		///////////////////////////////////////////////////////////////////////////////////////////////查找完毕
		//没有找到结果
		if (return_arr.length<=0) {
			return {
					'index': -1,
					'len': 0,
					'cards': []
				}; ;
		}
		//按照长度从大到小进行排序
		else {
			return_arr.sort(this._sortByLength);
		}
		
		// 返回
		return return_arr[0];
	},
	_sortByLength: function(o1, o2) {
		return o1['len'] < o2['len'];
	},
	// 在此之前是检查连对、飞机、顺子等牌型
	_findAvailableThree: function(newarrpara, lz_obj) {
		var newarr = [];
		this._copyPCArr(newarr,newarrpara);
		var return_arr = [];
		var index;
		var tmp;
		var cards = [];
		var leftArr;

		// 先找本身就是3个的，之后再用癞子拼, 找到小王就可以了
		for (index = 0; index < 13; index++) {
			tmp = newarr[index];
			if (tmp.count == 3)
				break;
		}

		if (index < 13) {
			var midResult = newarr[index];

			for (var i = 0; i < midResult.count; i++) {
				ddz.LOGD(midResult.cards[i]);
			}

			// 找到了
			return_arr = return_arr.concat(midResult.cards);

			// 清理数据
			newarr[index].cards = [];
			newarr[index].count = 0;
		} else {
			// 需要拼
			for (index = 0; index < 13; index++) {
				tmp = newarr[index];
				var need = 3 - tmp.count;

				if (need < 0) {
					// 不能拆炸弹
					continue;
				}

				if (need <= lz_obj.count) {
					//癞子够拼
					cards = tmp.cards.slice(0);
					if (need > 0) {
						var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
						for (var i = 0; i < need; i++) {
							cards.push(n);
						}
					}

					return_arr = return_arr.concat(cards);

					tmp.cards = [];
					tmp.count = 0;
					// 减少癞子的数量
					lz_obj.count -= need;
					break;
				}
			} // end of for

			if (index == 13) {
				// 无法构成3张
				return [];
			}
		}

		// 从剩下的牌里面找次牌型
		/////////////////////////////////////////  主牌型结束


		//找带的对，没有的话找带的单
		var pairs = this._findMinDouble(lz_obj, newarr, 1, [], false); //[[1, 2], [3, 4]]...
		if (pairs.length > 0) {
			ddz.LOGD(this._TAG, "find min double in find available _findAvailableThree....");
			return_arr = return_arr.concat(pairs[0]);
		} else {
			var singles = this._findMinSingle(lz_obj, newarr, 1, [], false); //[1,2,3,4]...
			if (singles.length > 0) {
				ddz.LOGD(this._TAG, "find min single in find available _findAvailableThree....");
				return_arr = return_arr.concat(singles[0]);
			}
		}
		return return_arr;
	},

	_dumpResultArr: function(strDescribe, arr) {
		// body...
		ddz.LOGD(strDescribe);

		var loginfo = '';
		for (var i = 0; i < arr.length; i++) {
			loginfo = loginfo + '[' + ddz.GlobalFuncs.numberToValue(arr[i]) + ']';
		};

		ddz.LOGD(loginfo);
		ddz.LOGD('////////////////////////////////////////////////////////////////');
	},

	//组合的种类数
	_getCombinatorialVariety: function(n,r){
		return 0;
	},
 	
	//从选中的牌中挑选出最长的牌
	_findLongestFromSelectedCards:function(arr){
		//选中牌的长度
		var selCards = this._longestType.getOneLongestCardType(arr);
		return selCards;
	},
	// 主动出牌judge
	playActively: function(seatIndex) {
		// if (seatIndex == 1) { //玩家不应该主动出牌
		// 	ddz.LOGD(this._TAG, "error!!! seatindex == 1 in playActively");
		// 	return [];
		// }
		var cards = this.playerCards[seatIndex - 1];

		//判断当前手牌是不是一个牌型
		var types = this.judgeType(cards, false);
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
		for (var index = 0; index < 15; index++) {
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
			};
			newarr.push({
				'point': aObj.point,
				'count': aObj.count,
				'cards': cardsInfo
			})
		}

		ddz.LOGD(this._TAG, "dump _fillDicarr in play actively..........");
		for (var i = 0; i < newarr.length; i++) {
			var tmp = newarr[i];
			ddz.LOGD(this._TAG, "point : " + tmp.point + " count: " + tmp.count);

			var str = '';
			// ddz.LOGD(this._TAG, "point : " + tmp.point + " count: " + tmp.count);
			for (var j = 0; j < tmp.count; j++) {
				var point = ddz.GlobalFuncs.numberToValue(tmp.cards[j]);
				str = str + '[' + point + ']';
			};

			ddz.LOGD(str);
		}
		ddz.LOGD(this._TAG, "dump _fillDicarr in play actively.......... end");

		//[20140521][jinrifeng] 使用接口
		var lz_obj = this._getLaiziObject(newarr);

		ddz.LOGD('laizi count ' + lz_obj.count + '; laizi are ');

		for (var i = 0; i < lz_obj.cards.length; i++) {
			ddz.LOGD(lz_obj.cards[i]);
		};

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

			return return_arr.reverse();// V3.705产品要求其他两个玩家出顺子时的顺序为从左到右从大到小排列
		}

		// 找带癞子拼成的
		lz_obj.count = reportLaiziCount;

		return_arr = this._findAvailableContinous(newarr, 1, lz_obj).cards; //找最小顺子
		if (return_arr.length > 0) {
			this._dumpResultArr('found shunzi', return_arr);

			return return_arr.reverse();// V3.705产品要求其他两个玩家出顺子时的顺序为从左到右从大到小排列
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
		if (enemyCardsLen > 4) { //敌人手牌多余4张，正常出牌，挑最小对出，没有则挑最小单出
			var pairs = this._findMinDouble(lz_obj, pc, 1, [], false); //[[1, 2], [3, 4]]...
			if (pairs.length > 0) {
				ddz.LOGD(this._TAG, "find min double in find available aircraft....");
				this._dumpResultArr('found min double', pairs[0]);
				return pairs[0];
			}
			var singles = this._findMinSingle(lz_obj, pc, 1, [], false); //[1,2,3,4]...
			if (singles.length == 0) {
				ddz.LOGD(this._TAG, "assert!!!! error in play actively!!"); //没有对子又没有单，应该报错
			}
			this._dumpResultArr('found min single', singles);
			return singles;
		} else {
			if (this.dizhuPos != preIndex) { //下家是同盟，从小往大出，否则从大往下出
				pc.reverse();
			}
			if (enemyCardsLen % 2 == 1) { //敌人手牌单数，优先出对子
				var pairs = this._findMinDouble(lz_obj, pc, 1, [], false); //[[1, 2], [3, 4]]...
				if (pairs.length > 0) {
					ddz.LOGD(this._TAG, "find min double in find available aircraft....");
					this._dumpResultArr('found min double', pairs[0]);
					return pairs[0];
				}
				var singles = this._findMinSingle(lz_obj, pc, 1, [], false); //[1,2,3,4]...
				this._dumpResultArr('found min single', singles);
				return singles;
			} else { //敌人手牌双数，优先出单牌
				var singles = this._findMinSingle(lz_obj, pc, 1, [], false); //[1,2,3,4]...
				if (singles.length > 0) {
					ddz.LOGD(this._TAG, "find min double in find available aircraft....");
					this._dumpResultArr('found min single', singles);
					return singles;
				}
				var pairs = this._findMinDouble(lz_obj, pc, 1, [], false);
				if (pairs.length == 0) {
					ddz.LOGD(this._TAG, "assert!!!! error in play actively!!"); //没有对子又没有单，应该报错
				}
				this._dumpResultArr('found min double', pairs[0]);
				return pairs[0];
			}
		}
	},

});

function testPlayActively() {
	var robot = new ddz.AIRobotClasss();
	// robot.players[1] = [0,1, 56, 56, 16, 29, 4,17,30, 5, 18, 31, 6,7,8,9,10]; //A2L L44555666   78910j   ---->55566678
	// robot.setLaiziPoint(3); // 3是癞子
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 16, 29, 4,17,30, 5, 18, 31, 6,7,20,8,9,10]; //A2L L44555666   78910j   ---->5556664488 
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 29, 	4,17,     5, 18, 31,     	6,7,8,9,10]; //A2L L4455666   78910j  ---->444555666789
	// robot.playActively(2); 

	// robot.players[1] = [0,1, 56, 56, 	16, 29, 	4,17,30,  5, 18,      	6,7,8,9,10]; //A2L L4455566   78910j  ------>444555666
	// robot.playActively(2); 

	// robot.players[1] = [0,1, 56, 56, 	16, 29, 	4,17,     5, 18, 			6,7,8,9,10]; //A2L L445566   78910j  ---->44455578
	// robot.playActively(2); 

	// robot.players[1] = [0,1, 56, 56, 	16, 29, 	4,17,     5, 18, 			6,7,20,8,9,10]; //A2L L445566   788910j  ---->4445556688
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 29, 	4,        5, 18, 			6,7,8,9,10];     //A2L L44566   78910j----->44556677
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 29, 	4,        5,  			6,7,8,9,10];     //A2L L4456   78910j----->445566
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 29, 	4,17,        5,  			6,7,8,9,10];     //A2L L44556   78910j----->44455567
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 	4,17,        5,  			6,19,7,8,9,10];     //A2L L4556   778910j----->44556677
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 	4,17,        5,18,  			6,19,7,8,9,10];     //A2L L45566   778910j----->55566648
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 	        5,18,  			6,8,9,10,11,12];     //A2L L466   7 910jqk----->   910jqkA
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	16, 	        5,18,  			6,8,9,10];     //A2L L466   7 910j----->   78910jq
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	 	        5,18,  			6,8,9,10];     //A2L L66   7 910j----->     78910jq
	// robot.playActively(2);

	// robot.players[1] = [0,1, 56, 56, 	3,  	     5, 18, 31,     	9]; //A2L L4666   10  ---->66644
	// robot.playActively(2); 

	// robot.players[1] = [0,1, 56, 56, 	3,  	     5, 18, 31,     	9, 22]; //A2L L4666   1010  ---->6661010
	// robot.playActively(2); 

	// robot.players[1] = [0,1, 56, 56, 	3,  	     5, 18,      	9,22]; //A2L L466   1010  ---->44466
	// robot.playActively(2); 

	// robot.players[1] = [0,1, 56, 56, 	3,  	     5, 18,      	9]; //A2L L466   10  ---->44466
	// robot.playActively(2); 

	// robot.players[0] = [0,1, 56, 56, 	3]; // 大于4张
	// robot.dizhuPos = 1;
	// robot.currentPlayPos = 2;
	// robot.players[2] = [0,1, 56, 56, 	3,  	     5, 18,      	9]; // 大于4张
	// robot.players[1] = [0,1, 56, ]; //A2L
	// robot.playActively(2);

	// robot.players[2] = [0,1, 56, 56, 	3,  	     5, 18,      	9]; // 大于4张
	// robot.players[1] = [0,1,]; //A2
	// robot.playActively(2);

	// robot.players[2] = [0,1, 56, ]; // 3张
	// robot.players[1] = [0,1,  	     5, 18]; //A266 -->66
	// robot.playActively(2);

	// robot.players[2] = [0,1,]; // 2张
	// robot.players[1] = [0,1,  	     5, 18, 9, 22]; //A266 1010-->66
	// robot.playActively(2);

	// robot.players[2] = [0,1, 56, ]; // 3张
	// robot.players[1] = [0,1, ]; //A266 -->A
	// robot.playActively(2);

	// robot.players[0] = [0,1, 56, 56, 	3, 4]; // 大于4张
	// robot.players[2] = [0,1,]; // 2张
	// robot.players[1] = [0,1,  	     5, 18, 9, 22]; //A266 1010-->66
	// robot.playActively(2);


	// robot.players[2] = [0,1, 56, ]; // 3张
	// robot.players[1] = [0,1, ]; //A266 -->A
	// robot.playActively(2);

	// robot.players[2] = [0,1,]; // 2张
	// robot.players[1] = [0,1,  	     5, 18, 9, 22]; //A266 1010-->66
	// robot.playActively(2);

	// robot.dizhuPos = 3;
	// robot.players[2] = [0,1, 56, ]; // 3张
	// robot.players[1] = [0,1,  	     5, 18]; //A266 -->66
	// robot.playActively(2);

	// robot.players[2] = [0,1,]; // 2张
	// robot.players[1] = [0,1,  	     5, 18, 9, 22]; //A266 1010-->66
	// robot.playActively(2);
}

var testTag = 'ddzAiTest';

var aitest = function(cards, bLzChangable) {
	ddz.LOGD(testTag, "judge ..........");
	for (var i = 0; i < cards.length; i++) {
		ddz.LOGD(cards[i]);
	}
	var types = ddz.testinjudger.judgeType(cards,bLzChangable);
	if (types.length == 0) {
		ddz.LOGD(testTag, "illegal types......");
		return;
	}
	for (var i = 0; i < types.length; i++) {
		ddz.LOGD(testTag, "type......" + i);
		types[i].dump();
	}

	return types[0];
};

var minGetTest = function(cards) {

	var pc = ddz.testinjudger._getPCArrayByPoint(cards);
	var	lz_obj = {count: 1,point:3,cards: [56]};


	//测试时，lz_obj,获取个数和［］需随意设置不同的值
	//var res = ddz.testinjudger._findMinSingle(lz_obj,pc, 1, [], true);
    var res = ddz.testinjudger._findMinDouble(lz_obj,pc, 2, [], true);
    for (var i = 0; i < res.length; i++) {
    	 ddz.LOGD(testTag, "res = " + res[i]);
    };
};

function passTest(type, array) {
	var ret = ddz.testPassive.findWinCardsFromArray(type, array);
	ddz.LOGD(testTag, "dump play passive result......");
	for(var index = 0; index < ret.length; index++) {
		ddz.LOGD(testTag, "result index......." + index);
		hall.GlobalFuncs.PrintArray(ret[index]);
	}
	return ret;
};
function passTestNew(type, array) {
	var ret = ddz.testPassive.findWinCardsFromArray(type, array);
	ddz.LOGD(testTag, "dump play passive result......");
	for(var index = 0; index < ret.length; index++) {
		ddz.LOGD(testTag, "result index......." + index);
		// ddz.CardTable.print(ret[index]);
	}
};
//被动出牌测试
var testPlayPassively = function(){
	// ddz.CardTable = new ddz._CardTable();
	ddz.testPassive = new ddz.AIRobotClasss();
	ddz.LOGD(testTag, "AI test by Jiguan");

	/////////////////////(一)测试单牌///////////////////////////////
	//(1) 无癞子纯单牌
	//（2）无癞子拆成单牌
	//（3）使用癞子管得住
	//（4）使用癞子管不住
	//（一.1）
	// var cards = [1, 14, 35, 55];//22210
	// var type = new ddz.CardType(ddz.Enums.PaixingType.THREE_ONE_CARD, 12, 4, cards);
	// var array = [52, 53, 3, 4, 5, 6, 7, 8, 65, 65];//红桃9，红桃J，红桃Q，黑桃Q，红桃K，红桃A,黑桃A，梅花A,癞子2
	// passTest(type, array);

	//(一.2)
	//测试大小王
	// var countTable = ddz.CardTable.count;
	// var cards = [countTable['CARD_H_Q']];//Q
	// var type = new ddz.CardType(ddz.Enums.PaixingType.SINGLE_CARD, ddz.CardTable.pos['CARD_Q'], 1, cards);
	// var array = [
	// 	countTable['CARD_JL'],
	// 	countTable['CARD_JB']
	// ];
	// ddz.LOGD(testTag, "测试手牌只剩大小王，管单牌的情况");
	// ddz.LOGD(array);
	// passTestNew(type, array);

	///////////////////（二）测试对牌///////////////////////////////
	//(1)无癞子纯对子
	//(2)使用癞子凑对子
	//(3)使用纯癞子
	//(4)拆三张
	// cards = [35,48];//红桃10,黑桃10
	// type = new ddz.CardType(ddz.Enums.PaixingType.DOUBLE_CARD, 7, 2, cards);
	// array = [34,47,36,37,50,26,39,13,66,66];//红桃9，黑桃9，红桃J，红桃Q，黑桃Q，红桃A,黑桃A，梅花A,癞子K,癞子K
	// //预期结果：[37,50],[36,64],[66,66]，[13,26]
	// passTest(type, array);


	//////////////////（三）测试三张///////////////////////////////
	//（1）纯三张
	//（2）2原牌+1癞子
	//（3）1原牌+2癞子
	//（4）纯癞子


	// //（三.1）纯三张
	// cards = [35,48,22];//红桃10,黑桃10，梅花10
	// type = new ddz.CardType(ddz.Enums.PaixingType.THREE_CARD, 7, 3, cards);
	// array = [34,47,21, 36,49,23, 37,50, 26, 66,66,66];//红桃9，黑桃9，梅花9，红桃J，黑桃J，梅花J，红桃Q，黑桃Q，红桃A,癞子K,癞子K，癞子K
	// //预期结果：[23,36,49],[37,50,65],[26,54,54],[66,66,66]
	// ddz.LOGD(testTag, "被动，测试纯三张");
	// passTest(type, array);
	// cards = [];
 	// type = {};
 	// array = [];

	//（三.1）纯三张
	// cards = [35,48,22];//红桃10,黑桃10，梅花10
	// type = new ddz.CardType(ddz.Enums.PaixingType.THREE_CARD, 7, 3, cards);
	// array = [34,47,21, 36,49,23, 37,50, 26, 66,66,66];//红桃9，黑桃9，梅花9，红桃J，黑桃J，梅花J，红桃Q，黑桃Q，红桃A,癞子K,癞子K，癞子K
	// //预期结果：[23,36,49],[37,50,65],[26,54,54],[66,66,66]
	// passTest(type, array);



    //（三.2）三带1
 	//cards = [10,36,49,18];//方片J，红桃J,黑桃J,梅花6
	// type = new ddz.CardType(ddz.Enums.PaixingType.THREE_ONE_CARD, 8, 4, cards);
	// array = [46,34,35,11,37,12,25,51,0,13,1,14,53,60,60,60];//
	// //预期结果：
	// passTest(type, array);



    //（三.3）三带2
    //带牌的策略是：纯对子，凑对子，拆三张，纯癞子
 	//cards = [35,48,22,28,41];//红桃10,黑桃10，梅花10，红桃3，黑桃3
	// type = new ddz.CardType(ddz.Enums.PaixingType.THREE_TWO_CARD, 7, 5, cards);
	// array = [34,47,21, 36,49,23, 37,50, 26, 66,66,66];//红桃9，黑桃9，梅花9，红桃J，黑桃J，梅花J，红桃Q，黑桃Q，红桃A,癞子K,癞子K，癞子K
	// //预期结果：JJJ-QQ[23,36,49,37,50],QQL-AL[37,50,65,26，54],ALL-QQ[26,54,54，37，50],KKK-QQ[66,66,66，37，50]
	// passTest(type, array);


	//////////////////（四）测试四张///////////////////////////////////
	//搜索顺序如下：
	//（1）纯四张
	//（2）3原牌+1癞子
	//（3）2原牌+2癞子
	//（4）1原牌+3癞子
	//（5）4纯癞子
	///////////////

	//（四.1）纯四张
	//(四.1.1)
	// cards = [35,48,22,9];//红桃10,黑桃10，梅花10，方片10
	// type = new ddz.CardType(ddz.Enums.PaixingType.BOMB_CARD, 7, 4, cards);
	// array = [47,34,21,8,  49,36,23,10, 50,37,24, 39,26,  40, 66,66,66,66];//《黑桃9，红桃9，梅花9，方片9》，《 黑桃J，红桃J，梅花J，方片J》，《黑桃Q，红桃Q，梅花Q》，《黑桃A，红桃A》,《黑桃2》《癞子K,癞子K，癞子K，癞子K》
	// //预期结果：JJJJ[49，36，23，10],QQQL[50，37，24，65],AALL[39，26，54，54],2LLL[40，55，55，55],KKKK[66,66,66，66]
	// passTest(type, array);

	//(四.1.2)
	// ddz.LOGD(testTag, "测试任意常规炸弹大于软炸弹");
	// var countTable = ddz.CardTable.count;
	// var cards = [countTable['CARD_D_Q'], countTable['CARD_C_Q'],countTable['CARD_H_Q'],countTable['CARD_L_Q']];//QQQL
	// var type = new ddz.CardType(ddz.Enums.PaixingType.BOMB_CARD, ddz.CardTable.pos['CARD_Q'], 4, cards);
	// var array = [
	// //四个3
	// countTable['CARD_D_3'],
	// countTable['CARD_C_3'],
	// countTable['CARD_H_3'],
	// countTable['CARD_S_3'],

	// //三个K
	// countTable['CARD_D_K'],
	// countTable['CARD_C_K'],
	// countTable['CARD_H_K'],

	// //两个A
	// countTable['CARD_D_A'],
	// countTable['CARD_C_A'],

	// //三个J
	// countTable['CARD_D_J'],	
	// countTable['CARD_D_J'],
	// countTable['CARD_D_J'],

	// //两个癞子4
	// countTable['CARD_L_4'],	
	// countTable['CARD_L_4']
	// ];
	// passTestNew(type, array);

	//(四.1.3)
	// ddz.LOGD(testTag, "测试任意常规炸弹和软炸弹都小于纯癞子炸弹");
	// var countTable = ddz.CardTable.count;
	// var cards = [countTable['CARD_L_Q'], countTable['CARD_L_Q'],countTable['CARD_L_Q'],countTable['CARD_L_Q']];//QQQL
	// var type = new ddz.CardType(ddz.Enums.PaixingType.BOMB_CARD, ddz.CardTable.pos['CARD_Q'], 4, cards);
	// var array = [
	// //四个3
	// countTable['CARD_D_3'],
	// countTable['CARD_C_3'],
	// countTable['CARD_H_3'],
	// countTable['CARD_S_3'],

	// //四个A
	// countTable['CARD_D_A'],
	// countTable['CARD_C_A'],
	// countTable['CARD_H_A'],
	// countTable['CARD_S_A'],

	// //三个J
	// countTable['CARD_D_J'],	
	// countTable['CARD_D_J'],
	// countTable['CARD_D_J'],

	// //四个癞子4
	// countTable['CARD_L_K'],	
	// countTable['CARD_L_K'],
	// countTable['CARD_L_K'],	
	// countTable['CARD_L_K']
	// ];
	// passTestNew(type, array);


	//(四.1.4)
	// ddz.LOGD(testTag, "测试炸弹BUG");
	// var countTable = ddz.CardTable.count;
	// var cards = [countTable['CARD_D_10'], countTable['CARD_C_10'],countTable['CARD_S_10'],countTable['CARD_L_10']];//10 10 10 L
	// var type = new ddz.CardType(ddz.Enums.PaixingType.BOMB_CARD, ddz.CardTable.pos['CARD_10'], 4, cards);
	// var array = [
	// //小王

	// //3个2
	// countTable['CARD_D_2'],
	// countTable['CARD_C_2'],
	// countTable['CARD_S_2'],

	// //1个A
	// countTable['CARD_S_A'],

	// //1个K
	// countTable['CARD_D_K'],	

	// //1个J
	// countTable['CARD_S_J'],	

	// //1个10
	// countTable['CARD_H_10'],

	// //2个3
	// countTable['CARD_C_3'],
	// countTable['CARD_S_3'],

	// //2个癞子Q
	// countTable['CARD_L_Q'],	
	// countTable['CARD_L_Q'],
	// ];
	// passTestNew(type, array);


    //（四.2）四带两张
 	//cards = [35,48,22,9,41,28];//红桃10,黑桃10，梅花10，方片10,黑桃3，红桃3
	// type = new ddz.CardType(ddz.Enums.PaixingType.BOMB_TWO_CARD, 7, 6, cards);
	// array = [42, 43, 47,34,21,8,  49,36,23,10, 50,37,24, 39,26,  40, 66,66,66,66];//《黑桃4》《黑桃5》《黑桃9，红桃9，梅花9，方片9》，《 黑桃J，红桃J，梅花J，方片J》，《黑桃Q，红桃Q，梅花Q》，《黑桃A，红桃A》,《黑桃2》《癞子K,癞子K，癞子K，癞子K》
	// //预期结果：JJJJ-34[49，36，23，10-42,43],QQQL-34[50，37，24，65-42,43],AALL-34[39，26，54，54-42,43],2LLL-34[40，55，55，55-42,43],KKKK-34[66,66,66，66-42,43]
	// passTest(type, array);

    //（四.3）四带1对
	///////////////////（五）测试顺子//////////////////////////////////
	// cards = [3, 4, 5, 6, 7];//45678
	// type = new ddz.CardType(ddz.Enums.PaixingType.SHUNZI_CARD, 1, 5, cards);
	// // array = [2, 3, 17, 18, 19, 21, 22, 23, 11, 12, 13, 14];// 34567 910JQKA2
	// // //预期输出 21, 22, 23, 11, 12/ 22, 23, 11, 12, 13  应该不能带2，
	// // passTest(type, array);

	// array = [4, 5, 6, 7, 65, 9];
	// //预期输出 4, 5, 6, 7, 62/ 5, 6, 7, 62, 9 
	// passTest(type, array);

	// cards = [3, 16, 4, 17, 5, 18];//445566
	// type = new ddz.CardType(ddz.Enums.PaixingType.LIANDUI_CARD, 1, 6, cards);
	// array = [3, 16, 4, 17, 5, 18, 6, 19, 7, 65, 8, 65];
	// array = [3, 16, 4, 17, 5, 18, 6, 19, 7, 20, 8, 21];
	// //预期输出 4, 17, 5, 18, 6, 19/ 5, 18, 6, 19, 7,  20/ 6, 19, 7, 61, 8, 21
	// passTest(type, array);

	// cards = [3, 16, 29, 4, 17, 30];//444555
	// type = new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_CARD, 1, 6, cards);
	// array = [3, 16, 4, 17, 30, 5, 18, 31, 6, 19, 32, 8, 21, 34, 9, 22, 35];
	//预期输出 4, 17, 30, 5, 18, 31/ 5, 18, 31, 6, 19,  32/ 8, 21, 34, 9, 22, 35
	// array = [3, 16, 4, 17, 65, 5, 18, 31, 6, 19, 32, 8, 65, 34, 9, 65, 65];
	//预期输出 4, 17, 58, 5, 18, 31/ 5, 18, 31, 6, 19, 32/ 6, 19, 32, 61, 61, 61/ 8, 34, 62, 9, 63, 63
	// passTest(type, array);

	// cards = [3, 16, 29, 4, 17, 30, 5, 6];//44455567
	// type = new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD, 1, 8, cards);
	// array = [3, 16, 4, 17, 30, 5, 18, 31, 6, 19, 32, 8, 21, 34, 9, 22, 35, 10];
	//预期输出: 4, 17, 30, 5, 18, 31, 3, 10/ 5, 18, 31, 6, 19, 32, 3, 10/ 8, 21, 34, 9, 22, 35, 3, 10
	// array = [3, 16, 4, 17, 65, 5, 18, 65, 6, 19, 65, 8, 21, 34, 9, 22, 35, 65];
	//预期输出 4, 17, 58, 5, 18, 59, 3, 16 / 5, 18, 59, 6, 19, 60, 3, 16/ 8, 21, 34, 9, 22, 35, 3, 16/ 6, 19, 60, 61, 61, 61, 3, 16/ 61, 61, 61, 8, 21, 34, 3, 16
	// passTest(type, array);

	// cards = [3, 16, 29, 4, 17, 30, 5, 18, 6, 19];//44455567
	// type = new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD, 1, 10, cards);
	// array = [3, 16, 4, 17, 30, 5, 18, 31, 6, 19,  8, 21, 34, 9, 22, 35, 10, 11, 24];
	//预期结果: 4, 17, 30, 5, 18, 31, 3, 16, 6, 19/ 8, 21, 34, 9, 22, 35, 3, 16, 6, 19
	// array = [3, 16, 29, 4, 17, 30, 5, 18, 31, 8, 21, 34, 9, 22, 35, 10, 11, 24];//需要拆分3个来凑对子
	//预期结果:  4, 17, 30, 5, 18, 31, 3, 16, 11, 24/ 8, 21, 34, 9, 22, 35, 3, 16, 11, 24
	// array = [3, 4, 17, 65, 5, 18, 65, 6, 65,  8, 21, 34, 9, 22, 65, 10, 11, 24];	//需要用癞子凑对子
	//预期结果: 4, 17, 58, 5, 18, 59, 9, 22, 11, 24/5 18 59 6 60 60 4,17 9,22 / 8, 21, 34, 9, 22, 63, 3, 57, 11, 24......结果太多了- -
	//passTest(type, array);



	////////////////////////////////////////////////测试组合
	var countTable = ddz.CardTable.count;
	var array = [
		//3,4,5,6,7,8,9,10
		countTable['CARD_D_8'],
		countTable['CARD_C_8'],

		countTable['CARD_D_9'],
		countTable['CARD_C_9'],
		countTable['CARD_S_9'],

		countTable['CARD_D_10'],
		countTable['CARD_C_10'],

		countTable['CARD_H_J'],
		countTable['CARD_S_J']
	];
	var selcards = ddz.testPassive._findLongestFromSelectedCards(array);
	ddz.LOGD(testTag, "测试组合哈哈哈");
	// ddz.CardTable.print(selcards);
};
// testPlayPassively();

function testJudge() {
	ddz.testinjudger = new ddz.AIRobotClasss();
	// aitest([52, 56, 56, 9], true); // 4
	// aitest([3]); // 4
	// aitest([56]); //L(3)
	// aitest([55]); //L(2)
	// aitest([3, 4]); // 4,5
	// aitest([3, 56]); //4L
	// aitest([56, 56]); //LL(3)
	// aitest([3, 4, 5]);	//456
	// aitest([3, 16, 5]);	//445
	// aitest([3, 16, 29]);	//444
	// aitest([3, 16, 62]);	//	44L
	// aitest([3, 4, 56]);	//45L
	// aitest([55, 55, 55]);	//LLL

	// aitest([3, 16, 29, 4]); //4445
	// aitest([3, 16, 4, 17]); //4455
	// aitest([3, 16, 4, 5]); //4456
	// aitest([3, 16, 59, 4]); //44L5(L = 6, value = 3)
	// aitest([3, 16, 29, 59]); //444L
	// aitest([3, 59, 4, 59]); //4LL5
	// aitest([3, 16, 59, 59]); //44LL     4446
	// aitest([3, 59, 59, 59]); //4LLL 	6664
	// aitest([3, 56, 56, 56]); //4LLL     4443
	// aitest([59, 59, 59, 59]); //LLLL
	// aitest([3, 16, 29, 42]); //4444

	// aitest([3, 16, 29, 4, 5]); //44456	
	// aitest([3, 16, 4, 5, 6]); //44567
	// aitest([3, 16, 4, 17, 5]); //44556
	// aitest([3, 16, 4, 5, 59]); //4456L
	// aitest([3, 16, 29, 4, 17]); //44455
	// aitest([3, 16, 29, 4, 59]); //4445L(6)
	// aitest([3, 16, 4, 17, 59]); //4455L
	// aitest([3, 16, 29, 59, 59]); //444LL
	// aitest([3, 16, 29, 42, 59]); //4444L
	// aitest([3, 16, 4, 59, 59]); //445LL
	// aitest([3, 16, 59, 59, 59]); //44LLL
	// aitest([3, 4, 59, 59, 59]); //45LLL


	// aitest([52, 53]);	//kk
	// aitest([2, 15, 28, 41, 3, 4]);	//333345
	// aitest([2, 15, 28, 41, 3, 59]);	//33334L
	// aitest([2, 15, 28, 59, 3, 4]);	//333L45
	// aitest([2, 15, 28, 41, 59, 59]);	//3333LL
	// aitest([2, 15, 28, 59, 3, 59]);		//333L4L
	// aitest([2, 15, 59, 59, 3, 16]);		//33LL44
	// aitest([2, 15, 59, 59, 3, 4]);		//33LL45
	// aitest([2, 59, 59, 59, 3, 4]);		//3LLL45
	// aitest([2, 59, 59, 59, 3, 16]); 		//3LLL44
	// aitest([59, 59, 59, 59, 2, 15]);		//LLLL33
	// aitest([59, 59, 59, 59, 2, 3]);		//LLLL34
	// aitest([59, 59, 59, 59, 8, 21]);		//LLL88(l=6, VALUE = 3)
	// aitest([59, 59, 59, 59, 8, 9]);		//LLLL89

	// aitest([3, 16, 29, 42, 4, 17, 5, 18]);	//44445566
	// aitest([3, 16, 29, 42, 4, 6, 5, 18]);	//44445667
	// aitest([3, 16, 29, 42, 7, 6, 5, 4]);	//44445678
	// aitest([3, 16, 29, 59, 4, 17, 5, 18]);	//444L5566
	// aitest([3, 16, 29, 42, 4, 17, 5, 59]);	//4444556L
	// aitest([3, 16, 29, 59, 4, 6, 5, 18]);	//444L5667
	// aitest([3, 16, 59, 59, 4, 17, 5, 18]);	//44LL5566
	// aitest([3, 16, 29, 42, 4, 17, 59, 59]);		//444455LL
	// aitest([3, 16, 29, 42, 4, 5, 59, 59]); //44445L6L...
	// aitest([3, 16, 29, 59, 4, 17, 5, 59]); //444L556L
	// aitest([3, 16, 29, 59, 4, 6, 5, 59]); //444L567L
	// aitest([3, 59, 59, 59, 4, 17, 5, 18]); //LLL45566....
	// aitest([3, 16, 59, 59, 4, 59, 5, 18]); //LLL44566...
	// aitest([3, 16, 29, 59, 59, 59, 5, 18]); //LLL44466...
	// aitest([3, 16, 29, 59, 59, 59, 5, 4]); //LLL44456
	// aitest([59, 59, 59, 5, 4, 6, 7, 3]); //LLL45678
	// aitest([59, 59, 59, 59, 4, 17, 6, 19]); //LLLL5577
	// aitest([59, 59, 59, 59, 2, 15, 3, 16]); //LLLL4433
	// aitest([59, 59, 59, 59, 4, 5, 6, 7]); //LLLL5678
	// aitest([59, 59, 59, 59, 4, 17, 5, 6]); //LLLL5567

	// aitest([3, 16, 29, 4, 17, 30, 5, 6]); //44455567
	// aitest([3, 16, 28, 4, 17, 30, 5, 6]); //44355567
	// aitest([3, 16, 29, 42, 4, 17, 30, 5]); //44445556
	// aitest([3, 16, 29, 42, 4, 5, 18, 6]); //44445667
	// aitest([3, 16, 29, 4, 17, 30, 5, 62]); //4445556L (L=9, V = 6)
	// aitest([3, 16, 62, 4, 17, 30, 5, 6]); //44L55567
	// aitest([3, 16, 29, 4, 17, 30, 62, 62]); //444555LL
	// aitest([3, 16, 29, 4, 62, 62, 5, 6]); //4445LL67
	// aitest([3, 16, 29, 4, 17, 62, 5, 62]); //44455L6L
	// aitest([3, 16, 29, 62, 62, 62, 5, 6]); //444LLL56
	// aitest([3, 16, 29, 4, 62, 62, 5, 62]); //4445LL6L
	// aitest([3, 16, 62, 4, 62, 62, 5, 6]); //44L5LL67
	// aitest([3, 16, 29, 4, 17, 62, 62, 62]); //44455LLL
	// aitest([3, 16, 29, 12, 25, 62, 62, 62]); //444KKLLL
	// aitest([62, 62, 62, 2, 3, 4, 5, 6]); //LLL34567
	// aitest([62, 62, 62, 2, 15, 4, 5, 6]); //LLL33456
	// aitest([62, 62, 62, 2, 15, 3, 16, 6]); //LLL33445


	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 6, 19]); //4445556677
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 6, 20]); //4445556678
	// aitest([3, 16, 29, 4, 17, 7, 5, 18, 6, 19]); //4445586678
	// aitest([3, 16, 29, 42, 4, 17, 30, 5, 18, 6]); //4444555667
	// aitest([3, 16, 29, 42, 4, 17, 30, 43, 5, 18]); //4444555566
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 6, 62]); //444555667L
	// aitest([3, 16, 29, 4, 17, 62, 5, 18, 6, 19]); //44455L6677
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 62, 62]); //44455566LL
	// aitest([3, 16, 29, 4, 17, 30, 5, 62, 6, 62]); //4445556L7L
	// aitest([3, 16, 29, 4, 62, 62, 5, 18, 6, 19]); //4445LL6677
	// aitest([3, 16, 29, 4, 62, 62, 7, 20, 10, 23]); //4445LL88JJ
	// aitest([3, 16, 29, 4, 62, 62, 5, 7, 6, 19]); //4445LL6778
	// aitest([3, 16, 4, 17, 62, 62, 10, 23, 11, 24]); //4455LLJJQQ
	// aitest([3, 16, 29, 4, 17, 30, 5, 62, 62, 62]); //4445556LLL
	// aitest([3, 16, 29, 4, 17, 62, 5, 18, 62, 62]); //44455L66LL
	// aitest([3, 16, 29, 4, 17, 62, 5, 62, 6, 62]); //44455L6L7L
	// aitest([3, 16, 29, 4, 62, 62, 5, 18, 6, 62]); //4445LL667L
	// aitest([3, 16, 62, 4, 17, 62, 5, 18, 6, 62]); //44L55L667L
	// aitest([3, 16, 62, 4, 17, 62, 8, 21, 11, 62]); //44L55L99JL
	// aitest([2, 15, 62, 4, 17, 62, 5, 18, 6, 62]); //33L55L667L
	// aitest([62, 62, 62, 62, 2, 3, 4, 5, 6, 7]); //LLLL345678
	// aitest([62, 62, 62, 62, 2, 15, 4, 5, 6, 7]); //LLLL335678
	// aitest([62, 62, 62, 62, 2, 15, 4, 5, 18, 7]); //LLLL335668
	// aitest([62, 62, 62, 62, 2, 15, 3, 16, 6, 7]); //LLLL334478
	// aitest([62, 62, 62, 62, 2, 15, 3, 16, 4, 17]); //LLLL334455
	// aitest([62, 62, 62, 62, 2, 15, 4, 17, 6, 19]); //LLLL335577
	// aitest([62, 62, 62, 62, 2, 15, 10, 23, 11, 24]); //LLLL33JJQQ
	// aitest([62, 62, 62, 62, 2, 15, 28, 5, 6, 7]); //LLLL333678
	// aitest([62, 62, 62, 62, 2, 15, 28, 5, 18, 7]); //LLLL333667
	// aitest([62, 62, 62, 62, 2, 15, 28, 42, 6, 7]); //LLLL333478		
	// aitest([62, 62, 62, 62, 2, 15, 28, 41, 6, 7]); //LLLL333378	

	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 7, 8]);	//444555666789
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 32]);	//444555666777
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 8]);	//444555666779
	// aitest([3, 16, 29, 4, 17, 32, 5, 18, 31, 6, 7, 8]);		//444557666789
	// aitest([2, 15, 28, 4, 17, 30, 5, 18, 31, 6, 7, 8]);		//333555666789
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 7, 62]); 	//44455566678L
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 62, 62]);	//4445556667LL
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 62, 62, 62]);  //444555666LLL (L=9)
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 60, 60, 60]);	//444555666LLL(L = 7)
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 62, 6, 7, 8]);		//44455566L789
	// aitest([3, 16, 29, 4, 17, 30, 5, 62, 62, 6, 7, 8]); 	//44455556LL789
	// aitest([3, 16, 29, 4, 17, 30, 62, 62, 62, 6, 7, 8]);	//444555LLL789
	// aitest([3, 16, 29, 4, 17, 62, 5, 18, 62, 6, 7, 8]);	//44455L66L789
	// aitest([3, 16, 62, 4, 17, 62, 5, 18, 62, 6, 7, 8]);	//44L55L66L789
	// aitest([3, 16, 29, 4, 17, 30, 62, 62, 62, 62, 7, 8]); 	//LLLL44455589
	// aitest([62, 62, 62, 62, 3, 16, 4, 17, 5, 18, 6, 19]);	//LLLL44556677
	// aitest([62, 62, 62, 62, 3, 16, 29, 42, 5, 18, 6, 19]);	//LLLL44446677
	// aitest([62, 62, 62, 62, 3, 16, 29, 42, 5, 7, 6, 19]);	//LLLL44446778   

	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 7, 20, 8, 21]);	//444555666778899
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 7, 20, 8, 10]);	//44455566677889J
	// aitest([3, 16, 29, 4, 17, 30, 10, 23, 36, 6, 19, 7, 20, 8, 21]);	//444555JJJ778899
	// aitest([3, 16, 29, 4, 17, 5, 18, 31, 6, 19, 7, 20, 8, 21, 10]);	//44455666778899J
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 7, 20, 8, 62]);		//44455566677889L
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 7, 20, 62, 62]);	//4445556667788LL
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 19, 7, 62, 8, 62]);		//444555666778L9L
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31, 6, 62, 7, 62, 8, 62]);		//4445556667L8L9L
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 62, 6, 19, 7, 20, 8, 21]);		//44455566L778899
	// aitest([3, 16, 29, 4, 17, 62, 5, 18, 31, 6, 19, 7, 20, 8, 21]);		//44455L666778899
	// aitest([3, 16, 29, 4, 62, 62, 5, 18, 31, 6, 19, 7, 20, 8, 21]);		//4445LL666778899
	// aitest([3, 16, 29, 62, 62, 62, 5, 18, 31, 6, 19, 7, 20, 8, 21]);	//444LLL666778899
	// aitest([62, 62, 62, 62, 4, 17, 5, 18, 6, 19, 7, 20, 8, 21, 10]);		//LLLL5566778899J
	// aitest([62, 62, 62, 62, 4, 17, 30, 5, 18, 6, 19, 7, 20, 8, 21]);	//LLLL55566778899
	// aitest([62, 62, 62, 62, 4, 17, 30, 43, 6, 19, 7, 20, 8, 21, 10]);	//LLLL5555778899J

	// aitest([3, 4, 5, 6]);	//4567
	// aitest([3, 4, 5, 6, 7]);	//45678
	// aitest([10, 11, 12, 0, 1]);	//JQKA2
	// aitest([9, 10, 11, 12, 0]); 	//10JQKA
	// aitest([3, 4,  6, 7, 8]);	//45789
	// aitest([3, 16, 4, 5, 6]);	//44567
	// aitest([3, 4, 5, 6, 62]);	//4567L （L= 9）
	// aitest([3, 4, 62, 6, 7]);	//45L78
	// aitest([3, 4, 62, 62, 6]);	//45LL7
	// aitest([3, 62, 62, 62, 5]);	//46LLL
	// aitest([3, 62, 62, 62, 12]);	//4LLLK
	// aitest([3, 62, 62, 62, 62]);	//4LLLL
	// aitest([0, 62, 62, 62, 62]);	//KLLLL

	// aitest([3, 16, 4, 17, 5, 18]);	//445566
	// aitest([3, 16, 4, 17, 5]);		//44556
	// aitest([3, 16, 6, 19, 5, 18]);	//446677
	// aitest([12, 25, 0, 13, 1, 14]);	//KKAA22

	// aitest([3, 16, 4, 17, 5, 62]);	//44556L
	// aitest([3, 16, 4, 62, 5, 18]);	//445L66
	// aitest([3, 16, 4, 62, 5, 62]);	//445L6L
	// aitest([3, 62, 4, 17, 5, 62]);	//3L445L
	// aitest([3, 16, 4, 17, 62, 62]);	//3344LL
	// aitest([7, 20, 62, 62, 9, 22]);	//88LL1010(需要癞子牌当原值使用)
	// aitest([9, 22, 10, 23, 62, 62]);	//1010JJLL(癞子不能当原值使用)
	// aitest([3, 62, 4, 62, 5, 62]);	//456LLL
	// aitest([62, 62, 62, 3, 16, 4]);	//LLL445
	// aitest([62, 62, 62, 3, 16, 29]);	//LLL444
	// aitest([62, 62, 62, 62, 3, 4]);		//LLLL45
	// aitest([62, 62, 62, 62, 3, 16]);	//LLLL44

	//aitest([3, 16, 29, 4, 17, 30]);		//444555
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 31]);	//444555666
	// aitest([0, 13, 26, 1, 14, 27]);		//AAA222
	// aitest([3, 16, 29, 4, 17, 31]);		//444556
	// aitest([3, 16, 29, 4, 17, 62]);		//44455L
	// aitest([3, 16, 29, 4, 62, 62]);		//4445LL
	// aitest([3, 16, 29, 62, 62, 62]);	//444LLL
	// aitest([3, 16, 62, 4, 17, 62]);		//44L55L
	// aitest([3, 16, 62, 4, 62, 62]);		//44L5LL
	// aitest([3, 16, 62, 62, 62, 62]);	//44LLLL
	// aitest([3, 4, 62, 62, 62, 62]);		//45LLLL
	// aitest([3, 16, 29, 4, 17, 30, 5, 18, 62]);	//44455566L
	// aitest([3, 16, 29, 4, 17, 62, 5, 18, 62]);	//44455L66L
	// aitest([3, 16, 62, 4, 17, 62, 5, 18, 62]);	//44L55L66L
	// aitest([3, 16, 29, 62, 62, 62, 5, 18, 31]);		//444LLL555
	// aitest([3, 16, 62, 62, 62, 62, 5, 18, 31]);		//44LLLL666		

	//aitest([3, 16, 29, 4, 62, 5]);		//44LLLL666	

   //[20140521][jinrifeng]添加test case
   //getMinSingle
   //minGetTest([1,3,4,8,12]); 					//(2459k)	  	找出最小的单牌，返回最小单牌
   //minGetTest([56,56,4,4,8,21]); 				//(LL5599)    	无单牌，拆分返回
   // minGetTest([22,48,4,4,8,21]); 			//(10105599)  	无单牌，无癞子,不拆分，返回空
   //minGetTest([22,48,9,4,17,30]); 			//(10 10 5699)	无单牌，无癞子,有拆分，拆分返回。
    
   //getMinDouble
   //minGetTest([1,14,3,17,4,8,12]); 			//(224559K)   			有双牌，找出最小的双牌，则返回最小双牌
   //minGetTest([56,5,4,6,8,21]); 				//(L65799)    			有双牌，有1个癞子，需要1对双牌，则返回一对双牌，
   //minGetTest([56,5,4,6,8,21]); 				//(L65799)      		有1个双牌，有1个癞子，需要2对双牌，则返回一对双牌+(癞子＋单牌)，
   //minGetTest([56,56,5,4,6,8,22]);  			//(LL6579 10)   		有单，无双，有2个癞子，遍布单牌后拼凑癞子，则返回癞子＋单牌
   //minGetTest([56,56,5,18,31,4,17,30,43]);    //(LL6665555)    		无单牌，无双牌，有拆分，有癞子，则返回拆分牌
   //minGetTest([9,22,35,4,17,30,8,21,34]); 	//(10 10 10 555999) 	无单,无双，有拆分，无癞子，需要1对双牌，则返回一个拆分牌
   //minGetTest([56,56,9,22,35,48,8,21,34]); 	//(LL999 10 10 10 10)	无单,无双，有拆分，有癞子,需要2对双牌，则返回癞子＋拆分
   //minGetTest([56,9,8,21,34]); 				//(L10 999)  	  		有单,无双，有拆分，有1个癞子,需要2对双牌，则返回癞子＋拆分
};

// testJudge();
// testPlayPassively();
//testPlayActively();

//飞机带俩对相关测试
var testPlanAndTwoDouble = function() {
	ddz.LOGD(testTag, 'testPlanAndTwoDouble come in ');
	ddz.testinjudger = new ddz.AIRobotClasss();
	ddz.testPassive = new ddz.AIRobotClasss();
	// ddz.CardTable = new ddz._CardTable();

	var type = aitest([7,20,33,6,19,32,43,3, 16, 30]); //777888
	// [{"point":1,"count":1,"cards":[3,16]}, 4
	// {"point":2,"count":1,"cards":[43,30]}, 5
	// {"point":4,"count":3,"cards":[6,19,32]}, 7
	// {"point":5,"count":3,"cards":[7,20,33]}] 8
	var cards = [7,20,33,8,21,34,43,3,16,30,13,26];
	var res = passTest(type, cards);
	// res = [[7,20,33,8,21,34,[13,26],[30,43]]] //飞机带对子返回的结果，错误：对子的格式不对;
	// 修改后的 [[7,20,33,8,21,34,13,26,30,43]]

	// [[13,26],[8,21]] 对子的返回结果[2,20]
	// [[7,20,33,8,21,34,3,16]] 飞机带俩单的返回结果
	ddz.LOGD(testTag, 'find res = ' + JSON.stringify(res));
	var resType = aitest(res);
};
// testPlanAndTwoDouble();
