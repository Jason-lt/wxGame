"use strict";
cc._RF.push(module, 'c8576zW74FEQYMI55Cjf/3x', 'RobotGlobal');
// Script/ddz/RobotGlobal.js

"use strict";

//
// ddz_robot_global.js
// 
//
// Created by guangy on 2015-07-06
// 
//ai相关的一些全局通用函数

ddz.RobotGlobal = ddz.RobotGlobal || {};

ddz.RobotGlobal.rocketWin = function (cards) {
	cards.sort(function (c1, c2) {
		return c1 - c2;
	}); //先从小到大排列
	var len = cards.length;
	if (cards[len - 1] == 53 && cards[len - 2] == 52) {
		if (cards.length == 2) {
			return true; // 只有两张牌了，大小王，必然是双王致胜
		}

		var left = cards.slice(0, len - 2);
		var types = ddz.RobotGlobal.judgeType(left, true);
		if (types.length > 0) {
			return true;
		}
	}
	return false;
};

/**
 * @param cards_arr 带判断的牌数组
 * @param bLzChangable 表示癞子牌是否需要转化。判断topcard的时候，癞子牌已经是其实际值，
 * 不需要转化。主动出牌选牌时，癞子可以转换成任意牌
 * @returns {Array}
 */
ddz.RobotGlobal.judgeType = function (cards_arr, bLzChangable) {
	//
	if (cards_arr.length == 0) {
		return [];
	}

	var cards = cards_arr.slice(0); //避免修改原数组
	var len = cards.length;

	var laiziCnt = 0;
	if (!bLzChangable) {
		//癞子不可以转化，则把癞子牌转成其实际代表的牌
		for (var i = 0; i < len; i++) {
			if (cards[i] > 53) {
				cards[i] -= 54;
				++laiziCnt;
			}
		}
	}

	var dicarr = this._getPointCountDicArray(cards);
	var lz_obj = this.getLaiziObject(dicarr);
	var newarr = this._fillDicarr(dicarr);

	// return ddz.AITypeJudger(cards, dicarr, newarr, lz_obj, laiziCnt);
	return ddz.AIRobots._typeJudger.judgeType(cards, dicarr, newarr, lz_obj, laiziCnt);
};

ddz.RobotGlobal._fillDicarr = function (dicarr) {
	//检测连续的时候，因为癞子可以用来填充连续，所以检测连续的数组必须把没有的点数用数量0填充
	//才能每个点数都检测到（虽然飞机的时候，因为癞子数只有4，不可能连续填充2个，但为了统一，还是全部填充）
	dicarr.sort(ddz.GlobalFuncs._sortByPoint);
	dicarr.reverse(); //按点数从大到小排列
	var newarr = [];
	var start = 14;
	for (var index = 0; index < dicarr.length; index++) {
		//dicarr是从大到小
		var point = dicarr[index].point;
		if (point > 14) {
			//dicarr不能出现癞子牌（point = 15）
			break;
		}
		var i = 0;
		for (i = start; i > point; i--) {
			newarr.push({
				"point": i,
				"count": 0,
				"cards": []
			});
		}
		newarr.push(dicarr[index]);
		start = point - 1;
		if (index == dicarr.length - 1 && start >= 0) {
			//到最小点数时，填充到3
			for (i = start; i >= 0; i--) {
				newarr.push({
					"point": i,
					"count": 0,
					"cards": []
				});
			}
		}
	}
	return newarr;
};

/**
 * //把数组number，转换成点数：牌数的数组	点数3 = 0最小，大王 = 14最大
 * @param arr
 * @private
 */
ddz.RobotGlobal._getPointCountDicArray = function (arr) {
	var cdic = {};
	var key;
	for (var i = 0; i < arr.length; i++) {
		var num = arr[i];
		var pos = ddz.GlobalFuncs.numberToValue(num);
		if (num > 53) {
			pos = 15;
		}
		key = "" + pos;
		var value = cdic[key];
		if (value) {
			value.count++;
			value.cards.push(num);
		} else {
			value = {
				"count": 1,
				"cards": [num]
			};
			cdic[key] = value;
		}
	}
	// cc.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@1', JSON.stringify(cdic));

	for (key in cdic) {
		//把牌排序，避免选2，3张相同点数的时候选上位置上不相连的
		var cards = cdic[key].cards;
		if (cards.length > 1) {
			cards.sort(function (c1, c2) {
				return c1 - c2;
			});
			cards.reverse();
		}
	}
	// cc.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@2', JSON.stringify(cdic));

	// 组装需要返回的数组
	var return_arr = [];
	for (key in cdic) {
		return_arr.push({
			"point": parseInt(key),
			"count": cdic[key].count,
			"cards": cdic[key].cards
		});
	}
	// cc.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@3', JSON.stringify(return_arr));
	return return_arr;
};

ddz.RobotGlobal.getLaiziObject = function (dicarr) {
	dicarr.sort(ddz.GlobalFuncs._sortByPoint);

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
		tmp.point = ddz.GlobalFuncs.pointToValue(lz_obj.cards[0] - 54);
		tmp.cards = [];
	} else {
		lz_obj = {
			count: 0,
			point: -1,
			cards: []
		};
	}
	return lz_obj;
};

ddz.RobotGlobal.getSubPCArray = function (pcarray) {
	return pcarray.filter(function (item) {
		return item.count > 0;
	});
};

ddz.RobotGlobal.getPCArrayByPoint = function (cards) {
	var arr = ddz.RobotGlobal._getPointCountDicArray(cards);
	return ddz.RobotGlobal.getSubPCArray(arr);
};

ddz.RobotGlobal.sortByPoint = function (o1, o2) {
	return o1.point - o2.point;
};
ddz.RobotGlobal.sortByCount = function (o1, o2) {
	return o2.count - o1.count;
};

ddz.RobotGlobal.sortByLength = function (o1, o2) {
	return o2.len - o1.len;
};

//找最大连对cell_count = 2, 顺子cell_count = 1， 不包括2和双王, 
ddz.RobotGlobal.findAvailableContinousDevide = function (newarr, cell_count, lz_obj) {
	// 默认是升序排列newarr，如果要找最大的可以倒序
	var return_arr = [];
	//index为起始搜索位置
	//curIndex是张数
	for (var index = 0; index < 11; index++) {
		// 连子的最小是点数3，最大是A
		var lz_use = 0;
		var curIndex = 0;
		var cards = [];
		var point = -1;

		while (curIndex <= 11 - index) {
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
				if (remainLzCnt < need) {
					break;
				}
				//癞子足够，用癞子补
				else {
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
			else {
					for (var i = 0; i < cell_count; i++) {
						cards.push(tmp.cards[i]);
					}
				}
			curIndex++;
		}

		var clen = cards.length;
		if (clen >= 5) {
			// 更新癞子的数量
			lz_obj.count -= lz_use;

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
	if (return_arr.length <= 0) {
		return {
			'index': -1,
			'len': 0,
			'cards': []
		};
	}
	//按照长度从大到小进行排序
	else {
			return_arr.sort(this._sortByLength);
		}

	// 返回
	return return_arr[0];
};

/* 
 * 被动出牌：从牌堆中找出可以赢过的牌数组
 * array是指的0-53的值，当然，癞子>53
 * type - 牌型
 * array - 手牌
 */
ddz.RobotGlobal.findWinCardsFromArray = function (type, array) {
	//从array中找到所有可以赢过type的手牌组成数组传回
	ddz.LOGD(null, "in find win cards from arrary");
	if (!type) {
		return [];
	}
	var len = array.length;
	var tmpArr = this._getPointCountDicArray(array);
	tmpArr.sort(ddz.GlobalFuncs._sortByPoint);
	//[20140521][jinrifeng] 癞子处理 使用接口
	var lz_obj = this.getLaiziObject(tmpArr);
	// 单独处理火箭和火箭致胜的情况
	if (type.getType() == ddz.Enums.PaixingType.ROCKET) {
		return []; // 火箭最大，管不上
	}

	// 火箭致胜：火箭+一手牌，先出火箭
	var return_arr = [];
	if (this.rocketWin(array, true)) {
		return_arr.push([52, 53]);
		var leftCards = array.slice(0, len - 2);
		tmpArr = this._getPointCountDicArray(leftCards);
		tmpArr.sort(ddz.GlobalFuncs._sortByPoint);
	}

	switch (type.getType()) {
		//单牌
		case ddz.Enums.PaixingType.SINGLE_CARD:
			return return_arr.concat(this.findWinSingle(type, tmpArr, lz_obj));

		//对牌
		case ddz.Enums.PaixingType.DOUBLE_CARD:
			return return_arr.concat(this.findWinDouble(type, tmpArr, lz_obj));

		//三张，三带一，三带二
		case ddz.Enums.PaixingType.THREE_CARD:
		case ddz.Enums.PaixingType.THREE_ONE_CARD:
		case ddz.Enums.PaixingType.THREE_TWO_CARD:
			return return_arr.concat(this.findWinThree(type, tmpArr, lz_obj));

		//4张，4带2单， 4带2对
		case ddz.Enums.PaixingType.BOMB_CARD:
			return return_arr.concat(this.findWinBomb(type, tmpArr, lz_obj));
		case ddz.Enums.PaixingType.BOMB_TWO_CARD:
		case ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD:
			var bombexts = this.findWinBomb(type, tmpArr, lz_obj);
			return_arr = return_arr.concat(bombexts);
			var bombs = this.findBomb(tmpArr, lz_obj);
			return_arr = return_arr.concat(bombs);
			return return_arr;

		//顺子，连对，飞机毛都不带，飞机带2单，飞机带2对
		case ddz.Enums.PaixingType.SHUNZI_CARD:
		case ddz.Enums.PaixingType.LIANDUI_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD:
			return return_arr.concat(this.findWinContinous(type, tmpArr, lz_obj));

		default:
			return return_arr;
	}
};

//被动出牌：单牌
//从array中找到管type的手牌集合，策略是先找大于的单牌，其次再拆散其他牌型
ddz.RobotGlobal.findWinSingle = function (type, pc, lz_obj) {
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
		var realPoint = ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]);
		if (realPoint > type.getPoint()) {
			return_arr.push([lz_obj.cards[0]]);
		}
	}

	//最后是炸弹
	//不找火箭，因为有大小王则在前面选单会选择
	var bombs = this.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);

	//找火箭
	if (this.findRocket(pc)) {
		return_arr.push([52, 53]);
	}

	//查找完毕，返回结果
	return return_arr;
};
//被动出牌：对子
ddz.RobotGlobal.findWinDouble = function (type, pc, lz_obj) {
	ddz.LOGD(null, "find win double......in robots");

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
		//(1)当癞子牌当做癞子使用时,凑对子

		for (var nIndex = 0; nIndex < pc.length; nIndex++) {
			var t = pc[nIndex];

			if (t.point > type.getPoint() && t.count == 1) {
				//不能和大小王凑对子
				if (t.point == 13 || t.point == 14) {
					continue;
				}
				//和其他牌凑对子
				//癞子凑对后的count值
				var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);
				return_arr.push([t.cards[0], newCount]);
			}
		}

		//（2）当癞子牌不当癞子用时,当lz_obj.count==4时在炸弹中处理
		if (lz_obj.count == 2 || lz_obj.count == 3) {

			var realPoint = ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]);

			if (realPoint > type.getPoint()) {
				return_arr.push([lz_obj.cards[0], lz_obj.cards[1]]);
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
	var bombs = this.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);
	if (this.findRocket(pc)) {
		return_arr.push([52, 53]);
	}

	return return_arr;
};

//拷贝一个p-c-c对象
ddz.RobotGlobal.copyOnePCObj = function (dest, src) {
	dest.count = src.count;
	dest.point = src.point;
	dest.cards = [];
	if (src.count <= 0) {
		// 复制失败
		return;
	}
	for (var i = 0; i < src.count; i++) {
		dest.cards.push(src.cards[i]);
	}
};

//拷贝由（point - count - cards ）对象组成的数组
ddz.RobotGlobal.copyPCArr = function (dest, src) {
	ddz.LOGD(null, "复制pcArr");
	for (var nIndex = 0; nIndex < src.length; nIndex++) {
		var pcObj = {};
		ddz.RobotGlobal.copyOnePCObj(pcObj, src[nIndex]);
		dest.push(pcObj);
	}
};

//被动出牌：三带
ddz.RobotGlobal.findWinThree = function (type, pc, lz_obj) {
	//找到能管住type的所有三不带, 三带一， 三带二
	ddz.LOGD(null, "find win three......in robots");
	var return_arr = [];
	//类型
	var t_type = type.getType();

	/////////////////////////////////////////////////////////////////不使用癞子
	for (var i = 0; i < pc.length; i++) {
		var t = pc[i];
		//找三张
		if (t.point > type.getPoint() && t.count == 3) {
			//一个可能的解
			var tmp = [t.cards[0], t.cards[1], t.cards[2]];

			//////////////////////////找带的牌
			//三带一，找一个单牌
			if (t_type == ddz.Enums.PaixingType.THREE_ONE_CARD) {
				var extra = this.findMinSingle(lz_obj, pc, 1, [t.point], true);
				//找到了可以带的牌，则当前可能解添加进可带的牌
				if (extra.length > 0) {
					tmp.push(extra[0]);
				} else {
					tmp = [];
				}
			}
			//三带二
			else if (t_type == ddz.Enums.PaixingType.THREE_TWO_CARD) {
					var extra = this.findMinDouble(lz_obj, pc, 1, [t.point], true);
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
	this.copyOnePCObj(lz_objTmp, lz_obj);

	//（1）癞子牌当做癞子使用，凑三张

	//（1.1）先凑2原牌+1癞子

	for (var nIndex = 0; nIndex < pc.length; nIndex++) {
		var t = pc[nIndex];

		//先凑三张，再找带的牌

		if (t.point > type.getPoint() && t.count == 2 && (lz_obj.count == 1 || lz_obj.count == 2 || lz_obj.count == 3)) {

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
				var extra = this.findMinSingle(lz_obj, pc, 1, [t.point], true);
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
					var extra = this.findMinDouble(lz_obj, pc, 1, [t.point], true);
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
			this.copyOnePCObj(lz_obj, lz_objTmp);
		}
	}

	//（1.2）再凑1原牌+2癞子
	this.copyOnePCObj(lz_obj, lz_objTmp);

	for (var nIndex = 0; nIndex < pc.length; nIndex++) {
		var t = pc[nIndex];
		//////////////////////////////先凑三张，再找带的牌

		if (t.point > type.getPoint() && t.count == 1 && (lz_obj.count == 2 || lz_obj.count == 3)) {

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
				var extra = this.findMinSingle(lz_obj, pc, 1, [t.point], true);
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
					var extra = this.findMinDouble(lz_obj, pc, 1, [t.point], true);
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
			this.copyOnePCObj(lz_obj, lz_objTmp);
		}
	}

	//（2）假如癞子牌不当做癞子使用，当lz_obj.count==4时在炸弹中处理
	this.copyOnePCObj(lz_obj, lz_objTmp);
	if (lz_obj.count == 3) {
		var realPoint = ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]);

		if (realPoint > type.getPoint()) {
			//初始化三张牌
			var tmp = [lz_obj.cards[0], lz_obj.cards[1], lz_obj.cards[2]];
			lz_obj.count -= 3;
			lz_obj.cards.pop();
			lz_obj.cards.pop();
			lz_obj.cards.pop();

			//再找带的牌
			//三带一，找一个单牌
			if (t_type == ddz.Enums.PaixingType.THREE_ONE_CARD) {
				var extra = this.findMinSingle(lz_obj, pc, 1, [], true);
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
					var extra = this.findMinDouble(lz_obj, pc, 1, [], true);
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
	this.copyOnePCObj(lz_obj, lz_objTmp);
	//////////////////////////////////////////////////////////////////////////////找炸弹及火箭

	var bombs = this.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);
	if (this.findRocket(pc)) {
		return_arr.push([52, 53]);
	}
	return return_arr;
};

// 获取炸弹类型
// 'pureLzBomb',	//纯癞子炸弹，大于普通炸弹小于王炸
// 'normalBomb',	//普通炸弹，大于癞子炸弹
// 'softBomb',		//软炸弹，小于普通炸弹，大于其他牌
// 'notBomb'		//不是炸弹
ddz.RobotGlobal.getBombType = function (type) {
	// 不是4张，不可能是炸弹
	if (type.getCount() != 4) {
		return 'notBomb';
	};

	// 牌型
	var t_type = type.getType();
	var lzcnt = type.getLaiziCnt();
	// 是炸弹
	if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
		if (typeof lzcnt == "undefined" || lzcnt <= 0) {
			return 'normalBomb';
		} else if (lzcnt == 4) {
			return 'pureLzBomb';
		}
		return 'softBomb';
	}
	//不是炸弹
	else {
			return 'notBomb';
		}
};

/***
 * 被动出牌
 * 找到能管住type的所有炸弹, 4带2， 4带2对
 */
ddz.RobotGlobal.findWinBomb = function (type, pc, lz_obj) {
	var return_arr = [];

	//四带类型
	var t_type = type.getType();
	//炸弹类型，在这里获知炸弹类型，纯癞子炸弹 > 普通炸弹 > 癞子炸弹
	var bombType = this.getBombType(type);

	///////////////////////////////////////////////////////////////////////////不考虑癞子
	//先找到四张，再找带的牌
	for (var i = 0; i < pc.length; i++) {
		var t = pc[i];

		//找到四张
		if (t.count == 4) {
			//常规四张
			var tmp = [t.cards[0], t.cards[1], t.cards[2], t.cards[3]];

			//////////////////////////找带的牌
			//4带2，找2个单牌
			if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = this.findMinSingle(lz_obj, pc, 2, [t.point], true);
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
						var extra = this.findMinDouble(lz_obj, pc, 2, [t.point], true);
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
						if (bombType == 'pureLzBomb') {
							//如果不使用癞子，那么除了火箭永远都干不过纯癞子炸弹
							tmp = [];
						}
						// 软炸弹
						else if (bombType == 'softBomb') {}
							//所有常规炸弹(不考虑点数)和部分软炸弹（当前不考虑）

							//常规炸弹
							else if (bombType == 'normalBomb') {
									if (t.point <= type.getPoint()) {
										tmp = [];
									}
								}
								//不是炸弹啊
								else {
										tmp = [];
									}
					}
					//根本不是四带啊
					else {
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
	this.copyOnePCObj(lz_objTmp, lz_obj);

	//（1）癞子牌当癞子使用
	//(1.1)三张原牌+1癞子
	for (var i = 0; i < pc.length; i++) {
		var t = pc[i];
		//四张纯癞子不应该拆
		if (t.count == 3 && lz_obj.count >= 1 && lz_obj.count < 4) {
			var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);

			var tmp = [t.cards[0], t.cards[1], t.cards[2], newCount];

			//癞子使用更新
			lz_obj.count -= 1;
			lz_obj.cards.pop();

			//找带的牌
			//4带2，找2个单牌
			if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = this.findMinSingle(lz_obj, pc, 2, [t.point], true);
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
						var extra = this.findMinDouble(lz_obj, pc, 2, [t.point], true);
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
						if (bombType == 'pureLzBomb') {
							//软炸弹干不过
							tmp = [];
						}
						// 软炸弹
						else if (bombType == 'softBomb') {
								//只有点数大得软炸弹才能干的过
								if (t.point <= type.getPoint()) {
									tmp = [];
								}
							}
							//常规炸弹
							else if (bombType == 'normalBomb') {
									//软炸弹干不过常规炸弹
									tmp = [];
								}
								//不是炸弹啊
								else {
										tmp = [];
									}
					}
					//根本不是四带
					else {
							tmp = [];
						}
			if (tmp.length > 0) {
				return_arr.push(tmp);
			}
			//恢复癞子
			this.copyOnePCObj(lz_obj, lz_objTmp);
		}
	}

	//(1.2)2张原牌+2癞子
	for (var i = 0; i < pc.length; i++) {
		var t = pc[i];
		if (t.count == 2 && lz_obj.count >= 2 && lz_obj.count <= 3) {
			var newCount = ddz.GlobalFuncs.getLaiziNumByValue(t.point);

			var tmp = [t.cards[0], t.cards[1], newCount, newCount];

			//癞子使用更新
			lz_obj.count -= 2;
			lz_obj.cards.pop();
			lz_obj.cards.pop();

			//找带的牌
			//4带2，找2个单牌
			if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = this.findMinSingle(lz_obj, pc, 2, [t.point], true);
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
						var extra = this.findMinDouble(lz_obj, pc, 2, [t.point], true);
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
						if (bombType == 'pureLzBomb') {
							//软炸弹干不过
							tmp = [];
						}
						// 软炸弹
						else if (bombType == 'softBomb') {
								//只有点数大得软炸弹才能干的过
								if (t.point <= type.getPoint()) {
									tmp = [];
								}
							}
							//常规炸弹
							else if (bombType == 'normalBomb') {
									//软炸弹干不过常规炸弹
									tmp = [];
								}
								//不是炸弹啊
								else {
										tmp = [];
									}
					} else {
						tmp = [];
					}
			if (tmp.length > 0) {
				return_arr.push(tmp);
			}

			//恢复癞子
			this.copyOnePCObj(lz_obj, lz_objTmp);
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
					var extra = this.findMinSingle(lz_obj, pc, 2, [t.point], true);
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
						var extra = this.findMinDouble(lz_obj, pc, 2, [t.point], true);
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
						if (bombType == 'pureLzBomb') {
							//软炸弹干不过
							tmp = [];
						}
						// 软炸弹
						else if (bombType == 'softBomb') {
								//只有点数大得软炸弹才能干的过
								if (t.point <= type.getPoint()) {
									tmp = [];
								}
							}
							//常规炸弹
							else if (bombType == 'normalBomb') {
									//软炸弹干不过常规炸弹
									tmp = [];
								}
								//不是炸弹啊
								else {
										tmp = [];
									}
					} else {
						tmp = [];
					}
			if (tmp.length > 0) {
				return_arr.push(tmp);
			}
			//恢复癞子
			this.copyOnePCObj(lz_obj, lz_objTmp);
		}
	}

	//（2）癞子不癞
	if (lz_obj.count == 4) {
		var realPoint = ddz.GlobalFuncs.numberToValue(lz_obj.cards[0]);
		if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
			return_arr.push([lz_obj.cards[0], lz_obj.cards[1], lz_obj.cards[2], lz_obj.cards[3]]);
		} else if (realPoint > type.getPoint()) {
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
				var extra = this.findMinSingle(lz_obj, pc, 2, [], true);
				if (extra.length > 0) {
					tmp = tmp.concat(extra);
				} else {
					tmp = [];
				}
			}
			//4带2对
			else if (t_type == ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
					var extra = this.findMinDouble(lz_obj, pc, 2, [], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
						tmp = tmp.concat(extra[1]);
					} else {
						tmp = [];
					}
				}

			if (tmp.length > 0) {
				return_arr.push(tmp);
			}
			//恢复癞子
			this.copyOnePCObj(lz_obj, lz_objTmp);
		}
	}

	//找火箭
	if (this.findRocket(pc)) {
		return_arr.push([52, 53]);
	}
	return return_arr;
};

//被动出牌
////找到能管住type的顺子, 连对， 飞机
ddz.RobotGlobal.findWinContinous = function (type, pc, lz_obj) {
	ddz.LOGD(null, "find win continious, type :" + type.getType() + " point " + type.getPoint() + " count " + type.getCount());
	//顺子为array长度，连对为array长度/2， 飞机为array长度/4
	var continue_count;

	//顺子为1， 连对为2， 飞机为3
	var cell_count;
	var t_type = type.getType();
	switch (t_type) {
		//顺子
		case ddz.Enums.PaixingType.SHUNZI_CARD:
			continue_count = type.getCount();
			cell_count = 1;
			break;

		//连对
		case ddz.Enums.PaixingType.LIANDUI_CARD:
			continue_count = type.getCount() / 2;
			cell_count = 2;
			break;

		//飞机
		case ddz.Enums.PaixingType.AIRCRAFT_CARD:
			continue_count = type.getCount() / 3;
			cell_count = 3;
			break;

		//飞机带点东西
		case ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD:
			continue_count = Math.floor(type.getCount() / 4);
			cell_count = 3;
			break;
	}
	var return_arr = [];
	var newarr = this._fillDicarr(pc);
	newarr.reverse(); //因为从小到大找起，所以要reverse
	for (var index = 0; index + continue_count <= newarr.length - 3; index++) {
		// 2不能在顺子连对飞机中
		var point = newarr[index].point;
		if (point <= type.getPoint()) {
			continue;
		}

		// 按照使用的癞子数从少到多寻找解
		for (var laiziMax = 0; laiziMax <= lz_obj.count; laiziMax++) {
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
					if (need == laiziMax && lz_obj.count - lz_used >= need) {
						//癞子足够的话
						cards = cards.concat(tmp.cards);
						var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
						for (var i = 0; i < need; i++) {
							cards.push(n);
						}
						lz_used += need;
					} else {
						//癞子不够用， break
						cards = [];
						break;
					}
				}
				exc.push(tmp.point);
				sub_index++;
			} //while

			if (cards.length > 0) {
				if (t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD || t_type == ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD) {
					//找翅膀
					//不能把飞机找齐了，再去找翅膀，因为翅膀可能会拆掉3个生成
					var newlz = { "point": lz_obj.point, "count": lz_obj.count - lz_used, "cards": lz_obj.cards };
					var extra = t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD ? this.findMinSingle(newlz, pc, continue_count, exc, true) : this.findMinDouble(newlz, pc, continue_count, exc, true);
					if (extra.length > 0) {
						if (t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD) {
							//飞机带单牌可以直接这么拼
							cards = cards.concat(extra);
						} else {
							//飞机带俩／仨对，需要单独拼接
							for (var i = 0; i < continue_count && extra[i]; i++) {
								// 此时返回的是元素是数组的数组[[13,26],[30,43]]
								cards = cards.concat(extra[i]);
							}
						}
					} else {
						//找不够翅膀，清空cards
						cards = [];
					}
				}

				if (cards.length > 0) {
					return_arr.push(cards);
				}
			}
		}
	}

	// 找炸弹解
	var bombs = this.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);

	// 找火箭解
	if (this.findRocket(pc)) {
		return_arr.push([52, 53]);
	}
	return return_arr;
};

ddz.RobotGlobal.findBomb = function (pcArray, lz_obj) {
	var return_arr = [];

	for (var laiziMax = 0; laiziMax <= lz_obj.count; laiziMax++) {
		var newarr = this._fillDicarr(pcArray);
		for (var i = newarr.length - 1; i >= 2; i--) {
			//最后找炸弹
			var t = newarr[i];
			var need = 4 - t.count;
			if (need == laiziMax && need < 4 && need <= lz_obj.count) {
				var cards = t.cards.slice(0);
				var n = ddz.GlobalFuncs.getLaiziNumByValue(t.point);
				for (var j = 0; j < need; j++) {
					cards.push(n);
				}
				return_arr.push(cards);
			}
		}
	}

	// 癞子炸弹
	if (lz_obj.count == 4) {
		var c = lz_obj.cards[0];
		return_arr.push([c, c, c, c]);
	}
	return return_arr;
};

ddz.RobotGlobal.findRocket = function (pcArray) {
	var bking = false;
	var rking = false;
	for (var i = pcArray.length - 1; i >= 0; i--) {
		//最后找火箭
		var t = pcArray[i];
		//有问题,容错
		if (t && t.point == 14) {
			rking = true;
		} else if (t && t.point == 13) {
			bking = true;
		}
		if (rking && bking) {
			//一旦找到就break出去
			break;
		}
	}
	var ret = bking && rking;
	return ret;
};

//[20140521][jinrifeng]添加癞子参数(pLaizi)和处理
//找最小的单牌，用来给三带一， 四带二，飞机带等等, bDivide表示是否拆分，如果不拆分，则不需要ex参数
//pcArray为已经转换好的point-count数组，按point排好序。count为数量， ex为需要排除的点数， 策略是从小到大找单牌，然后再拆牌
//包含癞子的情况，如果是主动出牌，先寻找单牌，如果没有
ddz.RobotGlobal.findMinSingle = function (pLaizi, pcArray, count, ex, bDivide) {
	//如果pcArray是从小到大排列，则是从最小取。 如果是从大到小排列，则是从最大取
	var newarr = pcArray.slice(0);
	// 把newarr按照生序排列
	newarr.sort(this._sortByPoint);
	var returnArr = [];
	for (var i = 0; i < newarr.length; i++) {
		var t = newarr[i];
		if (t.count != 1 || bDivide && ex.indexOf(t.point) >= 0 //只有需要拆分的时候，才需要去判断ex
		|| t.point == 15) {
			//在找单牌时，先排除癞子。
			continue;
		}
		returnArr.push(t.cards[0]);
		if (returnArr.length >= count) {
			return returnArr;
		}
	}

	if (bDivide) {
		//单牌不够的时候，拆分对子或者多牌来凑数
		for (var i = 0; i < newarr.length; i++) {
			var t = newarr[i];
			if (t.count > 1 && ex.indexOf(t.point) < 0) {
				var cards = t.cards;
				for (var j = 0; j < cards.length; j++) {
					returnArr.push(cards[j]);
					if (returnArr.length >= count) {
						return returnArr;
					}
				}
			}
		}
	}
	return []; //找不到需要的数量，直接返回空数组
};

//[20140521][jinrifeng]添加癞子参数(pLaizi)和处理
//找最小的对子牌，用来给三带2， 四带二，飞机带等等， bDivide表示是否拆分3牌，如果不拆分，则不需要ex参数
//pcArray为已经转换好的point-count数组，按point排好序。count为数量， ex为需要排除的点数， 策略是从小到大找单牌，然后再拆牌
ddz.RobotGlobal.findMinDouble = function (pLaizi, pcArray, count, ex, bDivide) {
	//如果pcArray是从小到大排列，则是从最小取。 如果是从大到小排列，则是从最大取
	var newarr = pcArray.slice(0);
	var returnArr = [];
	var laizi_use = 0;
	for (var i = 0; i < newarr.length; i++) {
		var t = newarr[i];
		if (t.count != 2 || bDivide && ex.indexOf(t.point) >= 0 || t.point == 15) {
			//只有需要拆分的时候，才需要去判断ex
			continue;
		}
		returnArr.push([t.cards[0], t.cards[1]]);
		if (returnArr.length >= count) {
			return returnArr;
		}
	}

	//如果有癞子，寻找单牌后拼接成双牌。
	if (pLaizi != null && pLaizi.count > 0) {
		for (var i = 0; i < newarr.length; i++) {
			var t = newarr[i];
			if (t.point != 15 && t.count == 1 && (ex.indexOf(t.point) < 0 || !bDivide)) {
				//寻找单牌
				returnArr.push([t.cards[0], ddz.GlobalFuncs.getLaiziNumByValue(t.point)]);
				laizi_use++;
				if (returnArr.length >= count) {
					pLaizi.count -= laizi_use; //更新癞子数目
					return returnArr;
				}
				if (laizi_use >= pLaizi.count) break;
			}
		}
	}

	if (bDivide) {
		//拆分3牌，不拆分炸弹
		for (var i = 0; i < newarr.length; i++) {
			//单牌不够的时候，拆分3张来凑数, 不拆分炸弹
			var t = newarr[i];
			if (t.count == 3 && ex.indexOf(t.point) < 0) {
				var cards = t.cards;
				returnArr.push([cards[0], cards[1]]);
				if (returnArr.length >= count) {
					pLaizi.count -= laizi_use; //更新癞子数目
					return returnArr;
				}
			}
		}
	}

	//需要两个癞子变成对的情况
	if (pLaizi != null && pLaizi.count - laizi_use > 1) {
		returnArr.push([pLaizi.cards[0], pLaizi.cards[1]]);
		laizi_use += 2;
		if (returnArr.length >= count) {
			pLaizi.count -= laizi_use; //更新癞子数目
			return returnArr;
		}
	}

	return []; //找不到需要的数量，直接返回null
};

ddz.RobotGlobal.findAvailableAircraft = function (newarrpara, lz_obj) {
	var newarr = [];
	this.copyPCArr(newarr, newarrpara);

	var resultObj = this.findAvailableContinous(newarr, 3, lz_obj);
	var return_arr = resultObj.cards;

	for (var i = 0; i < return_arr.length; i++) {

		var num = return_arr[i];
		var point = ddz.GlobalFuncs.numberToValue(num);

		newarr[point].count = 0; // 将数量置为0
		newarr[point].cards = [];
	}

	//寻找翅膀,先找对子，再找单数
	var len = return_arr.length;

	if (len > 0) {
		var pairs = this.findMinDouble(lz_obj, newarr, len / 3, [], false); // 找带的对子
		var p_length = pairs.length;
		if (p_length > 0) {
			for (var k = 0; k < p_length; k++) {
				return_arr = return_arr.concat(pairs[k]);
			}
			return return_arr;
		}
		var singles = this.findMinSingle(lz_obj, newarr, len / 3, [], false); //[1,2,3,4]...
		if (singles.length > 0) {
			return_arr = return_arr.concat(singles);
			return return_arr;
		}
	}
	return return_arr;
};

//找最大连对cell_count = 2, 顺子cell_count = 1， 不包括2和双王, 
ddz.RobotGlobal.findAvailableContinous = function (newarr, cell_count, lz_obj) {
	var index_report = -1;
	// 默认是升序排列newarr，如果要找最大的可以倒序
	for (var index = 0; index < 11; index++) {
		// 连子的最小是点数3，最大是A
		var lz_use = 0;
		var i = 0;
		var cards = [];
		var point = -1;

		while (i <= 11 - index) {
			var sub_index = index + i;
			var tmp = newarr[sub_index];

			var need = cell_count - tmp.count;
			if (need < 0) {
				// 不要拆更多张数的主牌型，比如找飞机时不要拆炸弹，找连对时，不要拆3张
				break;
			}
			lz_use += need;
			if (lz_use > lz_obj.count) {
				//  不够时要还原回去
				lz_use -= need;
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
			cards = cards.concat(tmp.cards);
			i++;
		}

		var clen = cards.length;
		if (clen >= 5) {
			// 更新癞子的数量
			lz_obj.count -= lz_use;
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
};

// 在此之前是检查连对、飞机、顺子等牌型
ddz.RobotGlobal.findAvailableThree = function (newarrpara, lz_obj) {
	var newarr = [];
	this.copyPCArr(newarr, newarrpara);
	var return_arr = [];
	var index;
	var tmp;
	var cards = [];
	var leftArr;

	// 先找本身就是3个的，之后再用癞子拼, 找到小王就可以了
	for (index = 0; index < 13; index++) {
		tmp = newarr[index];
		if (tmp.count == 3) break;
	}

	if (index < 13) {
		var midResult = newarr[index];

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
	var pairs = this.findMinDouble(lz_obj, newarr, 1, [], false); //[[1, 2], [3, 4]]...
	if (pairs.length > 0) {
		return_arr = return_arr.concat(pairs[0]);
	} else {
		var singles = this.findMinSingle(lz_obj, newarr, 1, [], false); //[1,2,3,4]...
		if (singles.length > 0) {
			return_arr = return_arr.concat(singles[0]);
		}
	}
	return return_arr;
};

cc._RF.pop();