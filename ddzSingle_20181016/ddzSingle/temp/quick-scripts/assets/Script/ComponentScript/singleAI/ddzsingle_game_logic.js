(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/singleAI/ddzsingle_game_logic.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8bf6fCQAo9KW4KALBEI/K8X', 'ddzsingle_game_logic', __filename);
// Script/ComponentScript/singleAI/ddzsingle_game_logic.js

'use strict';

//
//File : offline_game_play.js
//
//Function : 单机游戏逻辑
// 
// Author : WangHp
// 
// Date : 2015/2/11
// 

ddz.offLineGameLogic = function () {

	var meWin = false; //我是不是赢了
	var dzWin = false; //地主是不是赢了
	var bIamDizhu = false; //我是不是地主
	var dzIndex = 0; //地主的位置
	var mySeatId = 1; //单机下我的座位号为1
	var chuntianNum = 1; //春天倍数，1时不是春天；2时是春天
	// 单机玩家结算银币
	var coinNumArray = [];
	var currentSilverCoinNum = 0; //当前玩家银币数
	var multiNum = 0;
	var winStreak = ddz.GlobalFuncs.getWinStreak();
	var petSkillAddSliverCnt = 0;

	// 游戏结束后更新tableState
	var updateTableState = function updateTableState(tableState) {
		tableState.normalInfo.m_bomb = ddz.AIRobots.bombCount;
		tableState.normalInfo.m_chuntian = ddz.AIRobots.chuntian;
		tableState.normalInfo.m_bcmulti = ddz.AIRobots.bcmulti;
		tableState.normalInfo.m_show = ddz.AIRobots.showmulti;
	};

	// 判断游戏结果
	var judgeEnding = function judgeEnding(result) {
		dzWin = result['dizhuwin'];
		dzIndex = ddz.AIRobots.dizhuPos;
		if (dzIndex === mySeatId) {
			bIamDizhu = true;
		}
		meWin = bIamDizhu && dzWin || !bIamDizhu && !dzWin;
		if (meWin) {
			winStreak++;
		} else {
			winStreak = 0;
		}
		// 判断是否是春天状态
		judgeChunTian();

		// result['greatMasterInfo'] = assembleGreatMasterInfo(meWin);
	};

	// 拼装大师分信息
	var assembleGreatMasterInfo = function assembleGreatMasterInfo(isWin) {
		// old_maxscore: _greatMasterInfo["premaxscore"] || 0, // 之前的大师段位总分
		// level: _greatMasterInfo["level"] || 0, // 大师段位
		// score: _greatMasterInfo["score"] || 0, // 当前大师分
		// maxscore: _greatMasterInfo["curmaxscore"] || 0,// 当前段位大师总分
		// addScore: _greatMasterInfo['addScore'] || 0, // 赢得的大师分
		var info = {};
		var addScore = 0;
		if (isWin) {
			addScore = 1;
		}
		// 当前大师分
		var curGreatMasterScore = ddz.databaseDriver.getMasterScore();
		var lv = ddz.greatMasterHelper.calLvByScore(curGreatMasterScore);
		info['oldGreatMasterLevel'] = lv;

		// 前一级大师分段位
		var preMaxScore = ddz.greatMasterHelper.lvTotalScore(lv);
		info['premaxscore'] = preMaxScore;

		var curScore = curGreatMasterScore + addScore;
		info['level'] = ddz.greatMasterHelper.calLvByScore(curScore);
		info['newGreatMasterLevel'] = info['level'];
		info['score'] = curScore;
		info['curmaxscore'] = ddz.greatMasterHelper.lvTotalScore(info['level'] + 1);
		info['addScore'] = addScore;

		// 增加大师分
		if (addScore != 0) {
			ddz.databaseDriver.addMasterScore(addScore);
			var curGreatMasterScore2 = ddz.databaseDriver.getMasterScore();
			cc.log('test 111112 curGreatMasterScore2 = ' + curGreatMasterScore2);
		}
		return info;
	};

	// 判断春天状态
	var judgeChunTian = function judgeChunTian() {
		if (dzWin) {
			var farmerPlayCardCnt = 0;
			for (var i = 0; i < 3; i++) {
				if (i + 1 === dzIndex) {
					continue;
				}
				farmerPlayCardCnt += ddz.AIRobots.seatPlayCardCount[i];
			}
			if (farmerPlayCardCnt > 0) {
				return;
			}
			chuntianNum = 2;
			multiNum *= 2;
			return;
		}
		// 农民胜利了
		if (ddz.AIRobots.seatPlayCardCount[dzIndex - 1] > 1) {
			return;
		}
		multiNum *= 2;
		chuntianNum = 2;
	};

	// 统计计算各个玩家的银币结算数目
	var statisticsCoins = function statisticsCoins(isSingleBreak, doubleGain, avoidLose) {
		var silverCoinNum = ddz.SINGLE_SCORE_BASE * multiNum;
		if (isSingleBreak) {
			var breakBase = parseInt(ddz.GameWorld.singleBreakWorld["curLevelBase"]);
			silverCoinNum = breakBase * multiNum;
		}

		cc.log('test over 001 dzWin = ' + dzWin);
		for (var i = 1; i < 4; i++) {
			if (dzWin) {
				setCoinNumWhenDzWin(i, silverCoinNum);
				continue;
			}
			setCoinNumWheFramerWin(i, silverCoinNum);
		}

		propEffectOnStatistics(doubleGain, avoidLose);
		petSkillGain();
	};
	// 地主胜利时设置银币结算量
	var setCoinNumWhenDzWin = function setCoinNumWhenDzWin(index, silverCoinNum) {
		if (index === dzIndex) {
			coinNumArray[index] = 2 * silverCoinNum;
			return;
		}
		coinNumArray[index] = -silverCoinNum;
	};
	// 农民胜利时设置银币结算量
	var setCoinNumWheFramerWin = function setCoinNumWheFramerWin(index, silverCoinNum) {
		if (index === dzIndex) {
			coinNumArray[index] = -(2 * silverCoinNum);
			return;
		}
		coinNumArray[index] = silverCoinNum;
	};

	// 道具结算相关逻辑
	var propEffectOnStatistics = function propEffectOnStatistics(doubleGain, avoidLose) {
		if (doubleGain) {
			doubleGainStatistics();
		}
		if (avoidLose) {
			avoidLoseStatistics();
		}
	};

	// 宠物技能的作用
	var petSkillGain = function petSkillGain() {
		if (!meWin) {
			return;
		}
		petSkillAddSliverCnt = 0;

		var petId = ddz.GlobalFuncs.getMeselfShowPetId();
		var res = ddz.petSkillMgr.winningStreakAddition(petId, winStreak);
		if (!res || typeof res == 'undefined' || res < 0) {
			return;
		}
		coinNumArray[1] += res;
		petSkillAddSliverCnt = res;
	};

	// 使用双倍卡后的统计结算
	var doubleGainStatistics = function doubleGainStatistics() {
		if (!meWin) {
			return;
		}
		if (bIamDizhu) {
			// 我是地主，所有的结算都翻倍
			coinNumArray[1] *= 2;
			coinNumArray[2] *= 2;
			coinNumArray[3] *= 2;
			return;
		}
		// 我是农民，地主再赔我
		coinNumArray[dzIndex] -= coinNumArray[1];
		coinNumArray[1] *= 2;
	};
	// 保护卡的统计结算
	var avoidLoseStatistics = function avoidLoseStatistics() {
		if (meWin) {
			return;
		}
		if (bIamDizhu) {
			// 谁也得不到啊～～～～	
			coinNumArray[1] = 0;
			coinNumArray[2] = 0;
			coinNumArray[3] = 0;
			return;
		}
		// 地主的收获减少
		coinNumArray[dzIndex] -= coinNumArray[1];
		coinNumArray[1] = 0;
	};

	//闯关数据更新
	var updateBreakThroughData = function updateBreakThroughData() {
		// 干掉boss所用的回合数增1
		ddz.AIRobots.killBossRoundNum += 1;
		// 增加游戏次数
		var runningChapter = ddz.GameWorld.singleBreakWorld['bigGameId'] + 1;
		var runningLevel = ddz.GameWorld.singleBreakWorld['smallGameId'] + 1;
		var count = ddz.databaseDriver.addGameCount(runningChapter, runningLevel);
		ddz.AIRobots.killBossRoundNumBack = count;
		ddz.AIRobots.isPassCurStage = false;

		cc.log('obj.offlineGameEndProcess', runningChapter, runningLevel, count);

		var singleWorld = ddz.GameWorld.singleBreakWorld;
		// 更新自己的银币数
		ddz.breakthroughDataMgr.setMyCoin(currentSilverCoinNum, true);

		// 更新当前boss的银币数
		singleWorld["curBossCoin"] = parseInt(singleWorld["curBossCoin"]) + coinNumArray[2];
		if (singleWorld["curBossCoin"] < 0) {
			singleWorld["curBossCoin"] = 0;
		};
		cc.log('boss coin singleWorld["curBossCoin"] = ' + singleWorld["curBossCoin"]);

		ddz.AIRobots.runningBigStageId = singleWorld["bigGameId"];
		ddz.AIRobots.runningSmallStageId = singleWorld["smallGameId"];

		// singleWorld["curBossCoin"] = 0; // @TEST for test
		// ddz.AIRobots.killBossRoundNum = 20;

		if (singleWorld["curBossCoin"] > 0) {
			updateWhenNotPass(singleWorld);
			return;
		}
		var starNumbers = getMaxStar(singleWorld);

		// 过关事件
		cc.log('ddz.SingleEvent.PlayerTableLevelPassEvent', runningChapter, runningLevel, starNumbers);
		var event = new ddz.SingleEvent.PlayerTableLevelPassEvent(runningChapter, runningLevel, starNumbers);
		ty.NotificationCenter.trigger(ddz.SingleEvent.PlayerTableLevelPassEvent.eventName, event);

		updateWhenPass(singleWorld);
	};

	// 过关时的更新
	var updateWhenPass = function updateWhenPass(singleWorld) {
		cc.log('updateWhenPass', singleWorld['bigGameId'], singleWorld['smallGameId']);
		var chapter = singleWorld['bigGameId'] + 1;
		var level = singleWorld['smallGameId'] + 1;

		singleWorld["isEnterNextBoss"] = true;
		updateMaxStar(singleWorld);

		// 已过关
		ddz.AIRobots.isPassCurStage = true;

		// 标识本关通关
		singleWorld["curBossState"] = 2;

		// 是否已经领取过道具，若已经领取则不再次领取
		if (!ddz.databaseDriver.isGameRewardGot(chapter, level)) {
			// 获取关卡奖励道具
			var propInfo = getRewardProp(singleWorld);
			// 更新道具信息
			var params = [{ 'propId': propInfo['propId'], 'cnt': propInfo['cnt'] }];
			ty.NotificationCenter.trigger(ddz.SingleEventType.SINGLE_EVT_UPDATE_LOCAL_PROP_CNT, params);
			// 记录领取奖励
			ddz.databaseDriver.setGameRewardmGot(chapter, level);

			// 通知用户获取了哪些道具及哪关解锁了
			// hintUserPassInfo(propInfo['propId'], propInfo['cnt'], singleWorld);
		}

		// // 开启新关卡
		// openNewLevel(singleWorld);

		// // 进入下一关卡的处理
		// toNextLevel(singleWorld);
		// // 更新下一关boss数据
		// updateBossData(singleWorld);
	};

	// 更新下一关boss数据
	var updateBossData = function updateBossData(singleWorld) {
		var nextBossData = ddz.GameWorld.offlineData.levels[singleWorld["bigGameId"]].games[singleWorld["smallGameId"]];
		// 刷新boss的生命值为下一关卡的boss生命
		singleWorld["curBossLife"] = nextBossData.life;
		// 刷新boss的coin值为下一关的boss值
		singleWorld["curBossCoin"] = nextBossData.coin;
		// 刷新下一关卡的星级
		singleWorld["curStarRangeNum1"] = nextBossData.star[0];
		singleWorld["curStarRangeNum2"] = nextBossData.star[1];
		singleWorld["curMaxStar"] = nextBossData.maxStar;
		// 重置下一关的底倍数
		singleWorld["curLevelBase"] = nextBossData.base;
		// 重置下一关的boss的名字
		singleWorld["curBossName"] = nextBossData.name;
		// 重置下一关的玩法
		singleWorld["curPlayType"] = nextBossData.type;
		// 重置战胜boss所用的局数
		ddz.AIRobots.killBossRoundNum = 0;
	};

	// 跳转关卡处理
	var toNextLevel = function toNextLevel(singleWorld) {
		if (singleWorld["smallGameId"] == 5) {
			if (singleWorld["bigGameId"] == 5) {
				//弹提示信息
				ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
					text: ddz.STRING.DDZ_OFFLINE_GAME_LOGIC_STRING_1000,
					duration: 1
				});
			} else {
				singleWorld["bigGameId"] += 1;
				singleWorld["smallGameId"] = 0;
			}
		} else {
			singleWorld["smallGameId"] += 1;
		}
	};

	// 获取关卡奖励道具
	var getRewardProp = function getRewardProp(singleWorld) {
		// 更新道具信息
		var prizeInfo = ddz.GameWorld.offlineData.levels[singleWorld["bigGameId"]].games[singleWorld["smallGameId"]].prize;
		var itemInfoArray = prizeInfo[0];
		var itemId = itemInfoArray[1];
		var itemCount = itemInfoArray[2];
		return { 'propId': itemId, 'cnt': itemCount };
	};

	// 提示用户
	var hintUserPassInfo = function hintUserPassInfo(itemId, itemCount, singleWorld) {
		cc.log('hintUserPassInfo', itemId, itemCount);
		// 给予道具获取的提示
		var itemsArray = ddz.GameWorld.offlineData.config.items;
		var itemName = "";
		for (var i = 0; i < itemsArray.length; i++) {
			if (itemsArray[i].id == itemId) {
				itemName = itemsArray[i].name;
				break;
			}
		}
		if (itemName.length <= 1) {
			return;
		}

		var str = ddz.STRING.DDZ_OFFLINE_GAME_LOGIC_STRING_1001 + itemName + "x" + itemCount + "," + singleWorld["curBossName"] + ddz.STRING.DDZ_OFFLINE_GAME_LOGIC_STRING_1002;
		//弹提示信息
		ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, { text: str, duration: 3 });
	};

	// 开启新关卡
	var openNewLevel = function openNewLevel(singleWorld) {
		// 还原local.json中该关卡的银币值
		singleWorld["curBossCoin"] = singleWorld["curBossLife"];

		// 更新local.json中bigGameId、smallGameId对应的关卡的coin、state、next、maxStar值及自己的银币值
		var writeWordArray = ["bigGameId", "smallGameId", "curBossCoin", "curBossState", "curMaxStar"];
		var curObj = {};
		for (var i = 0; i < writeWordArray.length; i++) {
			curObj[writeWordArray[i]] = singleWorld[writeWordArray[i]];
		}

		// 更新BOSS血量
		var bigGameId = singleWorld['bigGameId'];
		var smallGameId = singleWorld['smallGameId'];
		ddz.breakthroughDataMgr.setBossCurLife(bigGameId, smallGameId, singleWorld['curBossCoin']);
		// 更新关卡状态
		ddz.breakthroughDataMgr.setStageState(bigGameId, smallGameId, singleWorld['curBossState']);
		// 更新星级
		ddz.breakthroughDataMgr.setStageStarCnt(bigGameId, smallGameId, singleWorld['curMaxStar']);

		// 标识本关通过后有哪些关卡就可以玩了
		var prizeInfo = ddz.GameWorld.offlineData.levels[singleWorld["bigGameId"]].games[singleWorld["smallGameId"]].prize;
		var prizeArray = prizeInfo[1];
		if (prizeArray[0] == 1) {
			// 不处理为2的
			if (prizeArray[1]) {
				var nextBigGameId1 = parseInt(prizeArray[1] / 10) - 1;
				var nextSmallGameId1 = parseInt(prizeArray[1] % 10) - 1;
				cc.log('nextBigGameId1 = ' + nextBigGameId1 + ' nextSmallGameId1 = ' + nextSmallGameId1);
				// 设置下一关状态为1
				ddz.breakthroughDataMgr.setStageStateOpen(nextBigGameId1, nextSmallGameId1);
			}
		}
	};

	// 获取过关后的星级
	var getMaxStar = function getMaxStar(singleWorld) {
		var starRangeNum1 = singleWorld["curStarRangeNum1"];
		var starRangeNum2 = singleWorld["curStarRangeNum2"];
		var gamecount = ddz.databaseDriver.getGameCount(singleWorld['bigGameId'] + 1, singleWorld['smallGameId'] + 1);
		cc.log('getMaxStar:', 'chapter=', singleWorld['bigGameId'] + 1, 'level=', singleWorld['smallGameId'] + 1, 'starRangeNum1=', starRangeNum1, 'starRangeNum2=', starRangeNum2, 'gamecount=', gamecount, 'ddz.AIRobots.killBossRoundNum=', ddz.AIRobots.killBossRoundNum);
		if (gamecount < starRangeNum1) {
			return 3;
		}
		if (gamecount >= starRangeNum1 && gamecount <= starRangeNum2) {
			return 2;
		}
		return 1;
	};
	// 更新星级
	var updateMaxStar = function updateMaxStar(singleWorld) {
		var star = getMaxStar(singleWorld);
		cc.log('updateMaxStar:', 'chapter=', singleWorld['bigGameId'] + 1, 'level=', singleWorld['smallGameId'] + 1, 'star=', star, 'curMaxStar=', singleWorld['curMaxStar']);
		if (star > singleWorld['curMaxStar']) {
			singleWorld['curMaxStar'] = star;
		}
	};

	// 没过关时的更新
	var updateWhenNotPass = function updateWhenNotPass(singleWorld) {
		singleWorld["isEnterNextBoss"] = false;
		// 更新local.json中bigGameId、smallGameId对应的关卡的coin值及自己的银币值
		var writeWordArray = ["bigGameId", "smallGameId", "curBossCoin"];

		// 更新数据
		var bigGameId = singleWorld['bigGameId'];
		var smallGameId = singleWorld['smallGameId'];
		ddz.breakthroughDataMgr.setCurBigGame(bigGameId);
		ddz.breakthroughDataMgr.setCurSmallGame(smallGameId);
		ddz.breakthroughDataMgr.setBossCurLife(bigGameId, smallGameId, singleWorld['curBossCoin']);
	};

	var obj = {};

	obj.PetSkillAddSliverCnt = function () {
		return petSkillAddSliverCnt;
	};

	// 游戏结束后的处理
	obj.offlineGameEndProcess = function (tableState, result, isSingleBreak, doubleGain, avoidLose) {
		// cc.log('obj.offlineGameEndProcess', tableState, result, isSingleBreak, doubleGain, avoidLose);
		// //上报单机游戏结束日志
		// ddz.reportHelper.reportGameData(ddz.reportKind.REPORT_GAME_END, isSingleBreak);

		//以下函数调用顺序不能变
		// 单机游戏结算逻辑
		updateTableState(tableState);
		// 判断游戏结果
		judgeEnding(result);
		// 统计结算银币
		// statisticsCoins(isSingleBreak, doubleGain, avoidLose);
	};

	obj.getWinstreak = function () {
		return winStreak;
	};

	// 模仿网络场构造result
	obj.remouldResult = function (result, slamNum, winStreakNum, windoublesNum, base, dizhuPos, greatMasterScoreNum, tableState) {
		cc.log('obj.remouldResult', result, slamNum, winStreakNum, windoublesNum, greatMasterScoreNum, tableState);
		// 单机场春天结算需要满足的条件chuntian字段的值大于1
		result["stat"] = {};
		// 单机场大满贯胜利结算需要满足的条件:0不是1是
		result["stat"]["slam"] = slamNum;
		result["stat"]["chuntian"] = chuntianNum;
		// 底牌
		result["stat"]["bcmulti"] = 1;
		// 叫分
		result["stat"]["call"] = tableState.normalInfo.m_call;

		// 明牌
		result["stat"]["show"] = 1;

		// 底注
		result["stat"]["base"] = base;
		// 地主座位号
		result["stat"]["dizhu"] = dizhuPos;
		// 炸弹
		result["stat"]["bomb"] = tableState.normalInfo.m_bomb;

		chuntianNum = 1; //重置
		// 单机场连胜结算需要满足的条件，连胜数大于等于3
		result["winStreak"] = [];
		result["winStreak"][0] = winStreak; // 连胜的数量
		// 单机场大满贯、春天、连胜都需要的数据:金币变化数
		for (var i = 1; i < 4; i++) {
			result["seat" + i] = [];
			result["seat" + i][0] = coinNumArray[i];
		}
		result["windoubles"] = windoublesNum; // 倍数

		result["skillScoreInfos"] = [];
		result["skillScoreInfos"][0] = {};
		result["skillScoreInfos"][0]["score"] = greatMasterScoreNum; // 大师分数
	};

	// 更新游戏数据
	obj.updateGameData = function (coinNode, isSingleBreak) {
		currentSilverCoinNum = parseInt(coinNode.getString()) + coinNumArray[1];
		if (currentSilverCoinNum <= 0) {
			// 如果银币输到0
			if (isSingleBreak) {
				// 如果是单机闯关，则此处暂设为0，然后在银币label执行完放大缩小动画后利用timer调用addSilverNum方法每隔一定时间为用户增加一定数量银币
				currentSilverCoinNum = 0;
			} else {
				// 如果是普通的单机场，则直接给10000，然后提示用户
				currentSilverCoinNum = 10000;
				var str = ddz.STRING.DDZ_OFFLINE_GAME_LOGIC_STRING_1003 + currentSilverCoinNum + ddz.STRING.DDZ_OFFLINE_GAME_LOGIC_STRING_1004;
				ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, { text: str, duration: 2 });
			}
		}
		coinNode.setString('' + currentSilverCoinNum);
		if (isSingleBreak) {
			updateBreakThroughData();
			return;
		}

		ddz.breakthroughDataMgr.setMyCoin(currentSilverCoinNum);
	};

	// 结算后更新关卡数据
	obj.updateBreakThroughDataWhenStaticOver = function () {
		var singleWorld = ddz.GameWorld.singleBreakWorld;
		cc.log('updateBreakThroughDataWhenStaticOver come in 000');
		// 开启新关卡
		openNewLevel(singleWorld);

		// 进入下一关卡的处理
		toNextLevel(singleWorld);
		// 更新下一关boss数据
		updateBossData(singleWorld);
		cc.log('updateBreakThroughDataWhenStaticOver come in 000');
	};

	// 游戏进行中的逻辑： 这段代码直接拷贝的ddz_play_controller.js中的_PlayInSingle相应逻辑，将this.修改为gameObj.
	obj.offlingGameMarch = function (gameObj, dizhuPos) {
		var currentIndex = ddz.AIRobots.currentPlayPos;
		if (currentIndex == gameObj._mySeatIndex) {
			gameObj._resetTopCardType();
			gameObj._clearPlayedCards();
			ddz.LOGD('test opr', 'showPlay come in 0000');
			gameObj._operateController.showPlay();
			gameObj._isUserInteractive = true;
			if (gameObj._isInTrust) {
				// 托管，替玩家出一手牌
				// gameObj.playCanrdsInTrust();
			}
			return;
		}
		var cards = ddz.AIRobots.genOneStep();
		if (cards.length > 0) {
			gameObj._tableState.normalInfo.m_topseat = currentIndex;
			gameObj._tableState.objectInfo.m_topCard = cards;
		}

		if (currentIndex == ddz.GlobalFuncs.GetNextIndex(gameObj._mySeatIndex)) {
			gameObj._leftPlayerController.clearCards(); //因为联网模式下，是闹钟显示的时候清除掉原手牌，而单机模式下没有闹钟，所以在此显示清除
			gameObj._rightSeatinfo.playCards(cards);
			gameObj._rightPlayerController.playCards(cards, dizhuPos == currentIndex);
			gameObj.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(gameObj._PlayInSingle, gameObj)));
		} else {
			gameObj._leftSeatinfo.playCards(cards);
			gameObj._leftPlayerController.playCards(cards, dizhuPos == currentIndex);
			gameObj._PlayInSingle();
		}
	};

	obj.setMultiNum = function (num) {
		multiNum = num;
	};
	obj.getMultiNum = function () {
		return multiNum;
	};

	obj.refreshWhenPassGate = function (gameObj) {
		var singleWorld = ddz.GameWorld.singleBreakWorld;
		if (!singleWorld["isEnterNextBoss"]) {
			return;
		}

		// // 如果过关了
		//    	var bigGameId = singleWorld["bigGameId"];
		//    	var smallGameId = singleWorld["smallGameId"];
		//    	gameObj.singleBreakController.refreshUI(bigGameId,smallGameId);
		//    	gameObj.singleBreakController.runPopWindowAction();
		// 如果跳了一个大关卡，会有玩法的变化
		if (gameObj._type == singleWorld.getPlayTypeOfEnums(singleWorld["curPlayType"])) {
			// do nothing
		} else {
			gameObj._type = singleWorld.getPlayTypeOfEnums(singleWorld["curPlayType"]);
			// 单机模式中没有二斗
			var container = gameObj["extra_card"];
			gameObj._extraCard.reAddIntoNode(container, gameObj._type);
		}
	};

	return obj;
};

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
        //# sourceMappingURL=ddzsingle_game_logic.js.map
        