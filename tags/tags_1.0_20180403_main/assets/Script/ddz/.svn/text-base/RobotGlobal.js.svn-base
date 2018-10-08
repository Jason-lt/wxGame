//
// ddz_robot_global.js
// 
//
// Created by guangy on 2015-07-06
// 
//ai相关的一些全局通用函数

ddz.RobotGlobal = ddz.RobotGlobal || {};

ddz.RobotGlobal.rocketWin = function(cards) {
	cards.sort(hall.GlobalFuncs.SortNumberFunc); //先从小到大排列
	var len = cards.length;
	if (cards[len - 1] == 53 && cards[len - 2] == 52) {
		if (len == 2) {
			return true; // 只有两张牌了，大小王，必然是双王致胜
		}

		var left = cards.slice(0, len - 2);
		var types = ddz.RobotGlobal.judgeType(left, false);
		if (types.length > 0) {
			return true;
		}
	}
	return false;
};

/*********
 * arr - 带判断的牌数组
 * bLzChangable - 是否转化为癞子牌
 *	true - 可以转化
 * 	false - 不可以转化
 */
ddz.RobotGlobal.judgeType = function(cards) { // bLzChangable 表示癞子牌是否需要转化。判断topcard的时候，癞子牌已经是其实际值，不需要转化。主动出牌选牌时，癞子可以转换成任意牌
	if(cards.length == 0) {
		return [];
	}
	var laiziCnt = 0;
	var allarr = ddz.RobotGlobal.getAllPCArray(cards);
	var subarr = ddz.RobotGlobal.getSubPCArray(allarr);
	var lz_obj = ddz.RobotGlobal.getLaiziObject(subarr);
	return ddz.AITypeJudger(cards, subarr, allarr, lz_obj, laiziCnt);
};

ddz.RobotGlobal.getLaiziObject = function(dicarr) {
	//找出癞子数目
	var lz_obj = null;
	var tmp = dicarr[dicarr.length - 1]; //从小到大排列，所以最后一个是value最大
	if (tmp && tmp.point == 15) {
		lz_obj = {
			count: tmp.count,
			point: tmp.point,
			cards: tmp.cards.slice(0)
		};
		// tmp.count = 0; //癞子牌留个占位，因为癞子牌可以当做自己用，例如LLL55544,L为6则为66655544，L为3则为55544433
		// tmp.point = ddz.GlobalFuncs.GetCardValueByPoint(lz_obj.cards[0] - 53);
		// tmp.cards = [];
	} else {
		lz_obj = {
			count: 0,
			point: -1,
			cards: []
		};
		ddz.LOGD(null, '没有找到癞子!');
		ddz.LOGD(null, '没有找到癞子!');
	}

	return lz_obj;
};

ddz.RobotGlobal.getAllPCArray = function(cards) {
	var arr = [];
	for (var i = 0; i <= 14; i++) { //暂时不考虑癞子
		arr[i] = {
			point: i,
			count: 0,
			cards: []
		};
	}
	for (var i = 0, len = cards.length; i < len; i++) {
		var num = cards[i];
		var point = ddz.GlobalFuncs.getCardValueByNum(num);
		var tmp = arr[point];
		tmp.count += 1;
		tmp.cards.push(num);
	}
	arr.forEach(function(item, index, array) {
		var cards = item.cards;
		if (cards.length > 0) {
			cards.sort(hall.GlobalFuncs.SortNumberFunc);
		}
	});
	return arr;
};

ddz.RobotGlobal.getSubPCArray = function(pcarray) {
	return pcarray.filter(function(item) {
		return item.count > 0;
	});
};

ddz.RobotGlobal.getPCArrayByPoint = function(cards) {
	var arr = ddz.RobotGlobal.getAllPCArray(cards);
	return ddz.RobotGlobal.getSubPCArray(arr);
};

ddz.RobotGlobal.sortByPoint = function(o1, o2) {
	return o1.point - o2.point;
};
ddz.RobotGlobal.sortByCount = function(o1, o2) {
	return o2.count - o1.count;
};

ddz.RobotGlobal.sortByLength = function(o1, o2) {
	return o2.len - o1.len;
};

//找最大连对cell_count = 2, 顺子cell_count = 1， 不包括2和双王, 
ddz.RobotGlobal.findAvailableContinousDevide = function(newarr, cell_count, lz_obj) {
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
		while (curIndex <= (11 - index)) {
			var sub_index = index + curIndex;
			var tmp = newarr[sub_index];
			point = tmp.point;
			var need = cell_count - tmp.count;

			//需要用癞子补，则把癞子转换成相应的值
			if (need > 0) {
				//剩余癞子数
				var remainLzCnt = lz_obj.count - lz_use;
				//如果癞子不够或者没有癞子
				if (remainLzCnt < need) {
					if (lz_obj.count <= 0) {
						index = sub_index;
					}
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
				cards = cards.concat(tmp.cards.slice(0, cell_count));
			}
			curIndex++;
		}

		var clen = cards.length;
		if (clen >= 5) {
			// 更新癞子的数量
			lz_obj.count -= lz_use;
			console.log('laizi count == ' + lz_obj.count);

			var oneResult = {
				index: index - 1,
				len: curIndex,
				cards: cards
			};
			return_arr.push(oneResult);
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////查找完毕
	//没有找到结果
	if (return_arr.length <= 0) {
		return {
			index: -1,
			len: 0,
			cards: []
		};;
	}
	//按照长度从大到小进行排序
	else {
		return_arr.sort(ddz.RobotGlobal.sortByLength);
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
ddz.RobotGlobal.findWinCardsFromArray = function(type, array) { //从array中找到所有可以赢过type的手牌组成数组传回
	ddz.LOGD(null, "in find win cards from arrary");
	var len = array.length;
	var allpc = ddz.RobotGlobal.getAllPCArray(array);
	var tmpArr = ddz.RobotGlobal.getSubPCArray(allpc);

	//[20140521][jinrifeng] 癞子处理 使用接口
	var lz_obj = ddz.RobotGlobal.getLaiziObject(tmpArr);

	// 单独处理火箭和火箭致胜的情况
	if (type.getType() == ddz.Enums.PaixingType.ROCKET) {
		return []; // 火箭最大，管不上
	}

	// 火箭致胜：火箭+一手牌，先出火箭
	var return_arr = [];
	if (ddz.RobotGlobal.rocketWin(array)) {
		return_arr.push([52, 53]);
		var leftCards = array.slice(0, len - 2);
		if(leftCards.length<1){
			return return_arr;
		}
		allpc = ddz.RobotGlobal.getAllPCArray(leftCards);
		tmpArr = ddz.RobotGlobal.getSubPCArray(allpc);
	}
	switch (type.getType()) {
		//单牌
		case ddz.Enums.PaixingType.SINGLE_CARD:
			return return_arr.concat(ddz.RobotGlobal.findWinSingle(type, tmpArr, lz_obj));

			//对牌
		case ddz.Enums.PaixingType.DOUBLE_CARD:
			return return_arr.concat(ddz.RobotGlobal.findWinDouble(type, tmpArr, lz_obj));

			//三张，三带一，三带二
		case ddz.Enums.PaixingType.THREE_CARD:
		case ddz.Enums.PaixingType.THREE_ONE_CARD:
		case ddz.Enums.PaixingType.THREE_TWO_CARD:
			ddz.LOGD(null, "测试三带类型" + type.getType());
			return return_arr.concat(ddz.RobotGlobal.findWinThree(type, tmpArr, lz_obj));

			//4张，4带2单， 4带2对
		case ddz.Enums.PaixingType.BOMB_CARD:
			return return_arr.concat(ddz.RobotGlobal.findWinBomb(type, tmpArr, lz_obj));
		case ddz.Enums.PaixingType.BOMB_TWO_CARD:
		case ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD:
			var bombexts =ddz.RobotGlobal.findWinBomb(type, tmpArr, lz_obj);
			return_arr = return_arr.concat(bombexts);
			var bombs = ddz.RobotGlobal.findBomb(pc, lz_obj);
			return_arr = return_arr.concat(bombs);
			return return_arr;

			//顺子，连对，飞机毛都不带，飞机带2单，飞机带2对
		case ddz.Enums.PaixingType.SHUNZI_CARD:
		case ddz.Enums.PaixingType.LIANDUI_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD:
			return return_arr.concat(ddz.RobotGlobal.findWinContinous(type, allpc, tmpArr, lz_obj));

		default:
			ddz.LOGD(null, "error card_type in findWinCardsFromArray!!!");
			return return_arr;
	}
};

//被动出牌：单牌
//从array中找到管type的手牌集合，策略是先找大于的单牌，其次再拆散其他牌型
ddz.RobotGlobal.findWinSingle = function(type, pc, lz_obj) {
	//返回结果，把每一种能管得住type得牌放入其中
	var return_arr = [];

	//优先把单数的牌都push进去
	var typePos = type.getPoint();
	for (var len = pc.length, i = 0; i < len; i++) {
		var t = pc[i];
		if (t.point > typePos) {
			if (t.count == 1) {
				return_arr.push([t.cards[0]]);
			}
		} 
	}

	//其次拆散非单牌
	for (var len = pc.length, i = 0; i < len; i++) {
		var t = pc[i];
		if (t.point > typePos) {
			if (t.count == 2 || t.count == 3) {
				return_arr.push([t.cards[0]]);
			}
		} 
	}

	///////////////////////////////////////////////////////////////考虑癞子
	//分为两种情况
	if (lz_obj.count >= 1) {
		//癞子牌不用作癞子，用作它本来的值
		//癞子的实际pos值
		var realPoint = ddz.GlobalFuncs.GetCardValueByPoint(ddz.GlobalFuncs.GetCardPointByNum(lz_obj.cards[0]));
		if (realPoint > typePos) {
			return_arr.push([lz_obj.cards[0]]);
		}
	}

	//最后是炸弹
	//不找火箭，因为有大小王则在前面选单会选择
	ddz.LOGD(null, "found bomb in find win single");
	var bombs = ddz.RobotGlobal.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);

	//找火箭
	if (ddz.RobotGlobal.findRocket(pc)) {
		return_arr.push([52, 53]);
	}

	//查找完毕，返回结果
	return return_arr;
};
//被动出牌：对子
ddz.RobotGlobal.findWinDouble = function(type, pc, lz_obj) {
	ddz.LOGD(null, "find win double......in robots");

	var return_arr = [];

	////////////////////////////////////////////////////////////////////简单搜索
	//优先把对子的牌都push进去
	var typePos = type.getPoint();
	for (var len = pc.length, i = 0; i < len; i++) {
		var t = pc[i];
		if (t.point > typePos) {
			if (t.count == 2) {
				return_arr.push(t.cards.slice(0));
			}
		} 
	}

	if (lz_obj.count >= 1) {

		ddz.LOGD(this._TAG, "使用癞子 in _findWinDouble");
		//(1)当癞子牌当做癞子使用时,凑对子

		for(var nIndex = 0; nIndex < pc.length; nIndex++){
			var t = pc[nIndex];

			if (t.point > type.getPoint() && t.count == 1) {
				//不能和大小王凑对子
				if (t.point == 13 || t.point == 14) {
					continue;
				}
				ddz.LOGD(this._TAG, "凑对子 in _findWinDouble");
				//和其他牌凑对子
				//癞子凑对后的count值
				var newCount = hall.GlobalFuncs.getLaiziNumByValue(t.point);
				return_arr.push([t.cards[0], newCount]);
			}
		}

		//（2）当癞子牌不当癞子用时,当lz_obj.count==4时在炸弹中处理
		if (lz_obj.count == 2 || lz_obj.count == 3) {
			var realPoint = hall.GlobalFuncs.GetCardValueByPoint(hall.GlobalFuncs.GetCardPointByNum(lz_obj.cards[0]));

			ddz.LOGD(this._TAG, "_in findWinDouble 癞子不癞，realpoint = "+realPoint);
			if (realPoint > type.getPoint()) {
				ddz.LOGD(this._TAG, "_in findWinDouble 癞子不癞,成功");
				return_arr.push([lz_obj.cards[0],lz_obj.cards[1]]);
			}
		}
	}


	//其次拆散3张
	for (var len = pc.length, i = 0; i < len; i++) {
		var t = pc[i];
		if (t.point > typePos) {
			if (t.count == 3) {
				return_arr.push(t.cards.slice(0, 2));
			}
		} 
	}

	////////////////////////////////////////////////////////////////////找炸弹及火箭
	var bombs = ddz.RobotGlobal.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);
	if (ddz.RobotGlobal.findRocket(pc)) {
		return_arr.push([52, 53]);
	}

	return return_arr;
};

//拷贝一个p-c-c对象
ddz.RobotGlobal.copyOnePCObj = function(dest, src) {
	ddz.LOGD(null, "复制一个pc格式的对象");
	dest.count = src.count;
	dest.point = src.point;
	dest.cards = src.cards.slice(0);
};

//拷贝由（point - count - cards ）对象组成的数组
ddz.RobotGlobal.copyPCArr = function(dest, src) {
	ddz.LOGD(null, "复制pcArr");
	for (var nIndex = 0; nIndex < src.length; nIndex++) {
		var pcObj = {};
		ddz.RobotGlobal.copyOnePCObj(pcObj, src[nIndex]);
		dest.push(pcObj);
	}
};

//被动出牌：三带
ddz.RobotGlobal.findWinThree = function(type, pc, lz_obj) { //找到能管住type的所有三不带, 三带一， 三带二
	ddz.LOGD(null, "find win three......in robots");
	var return_arr = [];
	//类型
	var t_type = type.getType();
	var typePoint = type.getPoint();
	/////////////////////////////////////////////////////////////////不使用癞子
	for (var len = pc.length, i = 0; i < len; i++) {
		var t = pc[i];
		//找三张
		if (t.point > typePoint && t.count == 3) {
				var tmp = t.cards.slice(0);
				//////////////////////////找带的牌
				//三带一，找一个单牌
				if (t_type == ddz.Enums.PaixingType.THREE_ONE_CARD) {
					var extra = ddz.RobotGlobal.findMinSingle(lz_obj, pc, 1, [t.point], true);
					//找到了可以带的牌，则当前可能解添加进可带的牌
					if (extra.length > 0) {
						tmp.push(extra[0]);
					} else {
						tmp = [];
						break;
					}
				}
				//三带二 
				else if (t_type == ddz.Enums.PaixingType.THREE_TWO_CARD) {
					var extra = ddz.RobotGlobal.findMinDouble(lz_obj, pc, 1, [t.point], true);
					//找到可带的对子，则添加进当前可能解
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
					}
					//找不到可带的对子，则当前解作废
					else {
						tmp = [];
						break;
					}
				}

				if (tmp.length > 0) {
					return_arr.push(tmp);
				}
		} 
	}

	///////////////////////////////////////////////////////////////使用癞子
	//临时保存一下癞子
	if(lz_obj.count >0) {
		var lz_objTmp = {};
		ddz.RobotGlobal.copyOnePCObj(lz_objTmp, lz_obj);

		//（1）癞子牌当做癞子使用，凑三张

		//（1.1）先凑2原牌+1癞子

		for (var nIndex = 0; nIndex < pc.length; nIndex++) {
			var t = pc[nIndex];

			//先凑三张，再找带的牌

			if (t.point > type.getPoint() && t.count == 2 && (lz_obj.count == 1 || lz_obj.count == 2 || lz_obj.count == 3)) {

				//////////////////////////////(step1)凑三张
				//癞子凑数后的count值
				var newCount = hall.GlobalFuncs.getLaiziNumByValue(t.point);
				var tmp = [t.cards[0], t.cards[1], newCount];
				//去掉癞子数
				lz_obj.count--;
				lz_obj.cards.pop();

				/////////////////////////////(step2)找带的牌
				//三带一，找一个单牌
				if (t_type == hall.Enums.PaixingType.THREE_ONE_CARD) {
					var extra =  ddz.RobotGlobal.findMinSingle(lz_obj, pc, 1, [t.point], true);
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
				else if (t_type == hall.Enums.PaixingType.THREE_TWO_CARD) {
					var extra =  ddz.RobotGlobal.findMinDouble(lz_obj, pc, 1, [t.point], true);
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
				ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
			}
		}

		//（1.2）再凑1原牌+2癞子
		ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);

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
				var newCount = hall.GlobalFuncs.getLaiziNumByValue(t.point);
				var tmp = [t.cards[0], newCount, newCount];
				//去掉癞子数
				lz_obj.count -= 2;
				lz_obj.cards.pop();
				lz_obj.cards.pop();
				/////////////////////////////(step2)找带的牌
				//三带一，找一个单牌
				if (t_type == hall.Enums.PaixingType.THREE_ONE_CARD) {
					var extra =  ddz.RobotGlobal.findMinSingle(lz_obj, pc, 1, [t.point], true);
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
				else if (t_type == hall.Enums.PaixingType.THREE_TWO_CARD) {
					var extra =  ddz.RobotGlobal.findMinDouble(lz_obj, pc, 1, [t.point], true);
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
				ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
			}
		}

		//（2）假如癞子牌不当做癞子使用，当lz_obj.count==4时在炸弹中处理
		ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
		cc.dump(lz_obj.cards);
		if (lz_obj.count == 3) {
			var realPoint = hall.GlobalFuncs.GetCardValueByPoint(hall.GlobalFuncs.GetCardPointByNum(lz_obj.cards[0]));

			if (realPoint > type.getPoint()) {
				//初始化三张牌
				var tmp = [lz_obj.cards[0], lz_obj.cards[1], lz_obj.cards[2]]
				lz_obj.count -= 3;
				lz_obj.cards.pop();
				lz_obj.cards.pop();
				lz_obj.cards.pop();

				//再找带的牌
				//三带一，找一个单牌
				if (t_type == hall.Enums.PaixingType.THREE_ONE_CARD) {
					var extra =  ddz.RobotGlobal.findMinSingle(lz_obj, pc, 1, [], true);
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
				else if (t_type == hall.Enums.PaixingType.THREE_TWO_CARD) {
					var extra =  ddz.RobotGlobal.findMinDouble(lz_obj, pc, 1, [], true);
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
		ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
	}
	//////////////////////////////////////////////////////////////////////////////找炸弹及火箭

	var bombs = ddz.RobotGlobal.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);
	if (ddz.RobotGlobal.findRocket(pc)) {
		return_arr.push([52, 53]);
	}
	return return_arr;
};

// 获取炸弹类型
// 'pureLzBomb',	//纯癞子炸弹，大于普通炸弹小于王炸
// 'normalBomb',	//普通炸弹，大于癞子炸弹
// 'softBomb',		//软炸弹，小于普通炸弹，大于其他牌
// 'notBomb'		//不是炸弹
ddz.RobotGlobal.getBombType = function(type) {
	// 不是4张，不可能是炸弹
	if (type.getCount() != 4) {
		return 'notBomb';
	};

	// 牌型
	var t_type = type.getType();
	var lzcnt = type.getLaiziCnt();
	// 是炸弹
	if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
		if (typeof(lzcnt) == "undefined" || lzcnt <= 0) {
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
ddz.RobotGlobal.findWinBomb = function(type, pc, lz_obj) {
	var return_arr = [];
	//四带类型
	var t_type = type.getType();
	var typePoint = type.getPoint();
	//炸弹类型，在这里获知炸弹类型，纯癞子炸弹 > 普通炸弹 > 癞子炸弹
	var bombType = ddz.RobotGlobal.getBombType(type);

	///////////////////////////////////////////////////////////////////////////不考虑癞子
	//先找到四张，再找带的牌
	for (var len = pc.length, i = 0; i < len; i++) {
		var t = pc[i];
		if (t.count == 4) {
			var tmp = t.cards.slice(0);
			if (t_type == ddz.Enums.PaixingType.BOMB_TWO_CARD) {
				if (t.point > typePoint) {
					var extra = ddz.RobotGlobal.findMinSingle(lz_obj, pc, 2, [t.point], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra);
					} else {
						tmp = [];
						break;
					}
				}
			}
			else if (t_type == ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
				if (t.point > typePoint) {
					var extra = ddz.RobotGlobal.findMinDouble(lz_obj, pc, 2, [t.point], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
						tmp = tmp.concat(extra[1]);
					} else {
						tmp = [];
						break;
					}
				}
			}
			else if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
				if (bombType == 'pureLzBomb') {
					//如果不使用癞子，那么除了火箭永远都干不过纯癞子炸弹
					tmp = [];
				}
				// 软炸弹
				else if (bombType == 'softBomb') {
					//所有常规炸弹(不考虑点数)和部分软炸弹（当前不考虑）
					ddz.LOGD(this._TAG, "find win bomb......in robots softBomb:" + JSON.stringify(tmp));
				}
				//常规炸弹
				else if (bombType == 'normalBomb') {
					if (t.point <= typePoint) {
						tmp = [];
					}
				}
			}
			else {
				tmp = [];
			}
			if (tmp.length > 0) {
				return_arr.push(tmp);
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////考虑癞子

	if(lz_obj.count>0){
	//临时保存一下癞子
	var lz_objTmp = {};
		ddz.RobotGlobal.copyOnePCObj(lz_objTmp, lz_obj);

	//（1）癞子牌当癞子使用
	//(1.1)三张原牌+1癞子
	for (var i = 0; i < pc.length; i++) {
		var t = pc[i];
		//四张纯癞子不应该拆
		if (t.count == 3 && (lz_obj.count >= 1 && lz_obj.count < 4)) {
			var newCount = hall.GlobalFuncs.getLaiziNumByValue(t.point);

			var tmp = [t.cards[0], t.cards[1], t.cards[2], newCount];

			//癞子使用更新
			lz_obj.count -= 1;
			lz_obj.cards.pop();

			//找带的牌
			//4带2，找2个单牌
			if (t_type == hall.Enums.PaixingType.BOMB_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = ddz.RobotGlobal.findMinSingle(lz_obj, pc, 2, [t.point], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra);
					}
					else {
						tmp = [];
					}
				}

			}
			//4带2对
			else if (t_type == hall.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = ddz.RobotGlobal.findMinDouble(lz_obj, pc, 2, [t.point], true);
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
			else if (t_type == hall.Enums.PaixingType.BOMB_CARD) {
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
			ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
		}

	}

	//(1.2)2张原牌+2癞子
	for (var i = 0; i < pc.length; i++) {
		var t = pc[i];
		if (t.count == 2 && (lz_obj.count >= 2 && lz_obj.count <= 3)) {
			var newCount = hall.GlobalFuncs.getLaiziNumByValue(t.point);

			var tmp = [t.cards[0], t.cards[1], newCount, newCount];

			//癞子使用更新
			lz_obj.count -= 2;
			lz_obj.cards.pop();
			lz_obj.cards.pop();

			//找带的牌
			//4带2，找2个单牌
			if (t_type == hall.Enums.PaixingType.BOMB_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = ddz.RobotGlobal.findMinSingle(lz_obj, pc, 2, [t.point], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra);
					} else {
						tmp = [];
					}
				}
			}
			//4带2对
			else if (t_type == hall.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = ddz.RobotGlobal.findMinDouble(lz_obj, pc, 2, [t.point], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
						tmp = tmp.concat(extra[1]);
					} else {
						tmp = [];
					}
				}
			}
			//4毛带不带
			else if (t_type == hall.Enums.PaixingType.BOMB_CARD) {
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
			else {
				tmp = [];
			}
			if (tmp.length > 0) {
				return_arr.push(tmp);
			}

			//恢复癞子
			ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
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

			var newCount = hall.GlobalFuncs.getLaiziNumByValue(t.point);
			//初始化四张牌
			var tmp = [t.cards[0], newCount, newCount, newCount];

			//癞子使用更新
			lz_obj.count -= 3;
			lz_obj.cards.pop();
			lz_obj.cards.pop();
			lz_obj.cards.pop();

			//找带的牌
			//4带2，找2个单牌
			if (t_type == hall.Enums.PaixingType.BOMB_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = ddz.RobotGlobal.findMinSingle(lz_obj, pc, 2, [t.point], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra);
					} else {
						tmp = [];
					}
				}
			}
			//4带2对
			else if (t_type == hall.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
				if (t.point > type.getPoint()) {
					var extra = ddz.RobotGlobal.findMinDouble(lz_obj, pc, 2, [t.point], true);
					if (extra.length > 0) {
						tmp = tmp.concat(extra[0]);
						tmp = tmp.concat(extra[1]);
					} else {
						tmp = [];
					}
				}
			}
			//4毛带不带
			else if (t_type == hall.Enums.PaixingType.BOMB_CARD) {
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
			else {
				tmp = [];
			}
			if (tmp.length > 0) {
				return_arr.push(tmp);
			}
			//恢复癞子
			ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
		}

	}


	//（2）癞子不癞
	if (lz_obj.count == 4) {
		var realPoint = hall.GlobalFuncs.GetCardValueByPoint(hall.GlobalFuncs.GetCardPointByNum(lz_obj.cards[0]));
		if (t_type == hall.Enums.PaixingType.BOMB_CARD) {
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
			if (t_type == hall.Enums.PaixingType.BOMB_TWO_CARD) {
				var extra = ddz.RobotGlobal.findMinSingle(lz_obj, pc, 2, [], true);
				if (extra.length > 0) {
					tmp = tmp.concat(extra);
				} else {
					tmp = [];
				}
			}
			//4带2对
			else if (t_type == hall.Enums.PaixingType.BOMB_TWO_TWO_CARD) {
				var extra = ddz.RobotGlobal.findMinDouble(lz_obj, pc, 2, [], true);
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
			ddz.RobotGlobal.copyOnePCObj(lz_obj, lz_objTmp);
		}
	}
}
	/////////////////////////////////////////////////考虑癞子牌////////////////////////////////

	//找火箭
	if (ddz.RobotGlobal.findRocket(pc)) {
		return_arr.push([52, 53]);
	}
	return return_arr;
};

//被动出牌
////找到能管住type的顺子, 连对， 飞机
ddz.RobotGlobal.findWinContinous = function(type, newarr, pc, lz_obj) {
	ddz.LOGD(null, "find win continious, type :" + type.getType() + " point " + type.getPoint() + " count " + type.getCount());
	//顺子为array长度，连对为array长度/2， 飞机为array长度/4
	var continue_count;

	//顺子为1， 连对为2， 飞机为3
	var cell_count;
	var t_type = type.getType();
	var typeCount = type.getCount();
	switch (t_type) {
		//顺子
		case ddz.Enums.PaixingType.SHUNZI_CARD:
			continue_count = typeCount;
			cell_count = 1;
			break;

			//连对
		case ddz.Enums.PaixingType.LIANDUI_CARD:
			continue_count = typeCount / 2;
			cell_count = 2;
			break;

			//飞机	
		case ddz.Enums.PaixingType.AIRCRAFT_CARD:
			continue_count = typeCount / 3;
			cell_count = 3;
			break;

			//飞机带点东西	
		case ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD:
		case ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD:
			continue_count = Math.floor(typeCount / 4);
			cell_count = 3;
			break;
		default:
			ddz.LOGD(null, "error in find win continous!!! illegal type");
	}
	var return_arr = [];
	for (var index = 0; index + continue_count <= newarr.length - 3; index++) { // 2不能在顺子连对飞机中
		var point = newarr[index].point;
		// ddz.LOGD(null, '查找顺子飞机连队最小值' + type.getPoint() + "当前值"+ point+"连续数"+ continue_count+ "新数组"+ JSON.stringify(newarr));
		if (point <= type.getPoint()) {
			continue;
		}

		// 按照使用的癞子数从少到多寻找解
		for (var laiziMax = 0; laiziMax <= lz_obj.count; laiziMax++) {
			ddz.LOGD(null, '查找需要' + laiziMax + "个癞子的解"+ JSON.stringify(newarr));
			var cards = [];
			var exc = [];
			var lz_used = 0;
			var sub_index = 0;

			while (sub_index < continue_count) {
				var tmp = newarr[index + sub_index];
				var tmp_cards = tmp.cards;
				if (tmp.count >= cell_count) {
					cards = cards.concat(tmp_cards.slice(0, cell_count));
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
						ddz.LOGD(null, "break ,laizi not enough");
						break;
					}
				}
				exc.push(tmp.point);
				sub_index++;
			} //while

			if (cards.length > 0) {
				if (t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD || t_type == ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD) { //找翅膀
					var newlz = {
						"point": lz_obj.point,
						"count": lz_obj.count - lz_used,
						"cards": lz_obj.cards
					};
					var extra = t_type == ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD ? ddz.RobotGlobal.findMinSingle(newlz, pc, continue_count, exc, true) : ddz.RobotGlobal.findMinDouble(newlz, pc, continue_count, exc, true);
					if (extra.length > 0) {
						for (var i = 0; i < extra.length; i++) {
							cards = cards.concat(extra[i]);
						}
					} else { //找不够翅膀，清空cards
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
	var bombs = ddz.RobotGlobal.findBomb(pc, lz_obj);
	return_arr = return_arr.concat(bombs);

	// 找火箭解
	if (ddz.RobotGlobal.findRocket(pc)) {
		return_arr.push([52, 53]);
	}
	return return_arr;
};

ddz.RobotGlobal.findBomb = function(pcArray, lz_obj) {
	var return_arr = [];
	pcArray.forEach(function(item) {
		if (item.count == 4) {
			return_arr.push(item.cards.slice(0));
		}
	});
	return return_arr;
};

ddz.RobotGlobal.findRocket = function(pcArray) {
	var len = pcArray.length;
	return pcArray[len - 1].point == 14 && pcArray[len - 2].point == 13;
};

//[20140521][jinrifeng]添加癞子参数(pLaizi)和处理
//找最小的单牌，用来给三带一， 四带二，飞机带等等, bDivide表示是否拆分，如果不拆分，则不需要ex参数
//pcArray为已经转换好的point-count数组，按point排好序。count为数量， ex为需要排除的点数， 策略是从小到大找单牌，然后再拆牌
//包含癞子的情况，如果是主动出牌，先寻找单牌，如果没有
ddz.RobotGlobal.findMinSingle = function(pLaizi, pcArray, count, ex, bDivide) { //如果pcArray是从小到大排列，则是从最小取。 如果是从大到小排列，则是从最大取
	var returnArr = [];
	var i,t;
	for (i = 0; i < pcArray.length; i++) {
		t = pcArray[i];
		if (t.count != 1 || (bDivide && hall.GlobalFuncs.FindInArray(ex, t.point) >= 0) //只有需要拆分的时候，才需要去判断ex
			|| t.point == 15) { //在找单牌时，先排除癞子。
			continue;
		}
		returnArr.push(t.cards[0]);
		if (returnArr.length >= count) {
			return returnArr;
		}
	}

	if (pLaizi != null && pLaizi.count > 0) {
		//取两张单牌时，只给一个癞子。
		returnArr.push(pLaizi.cards[0]);
		if (returnArr.length >= count) {
			ddz.LOGD(null, "[_findMinSingle][renturn][无单牌，找到癞子返回]");
			return returnArr;
		}
	}

	if (bDivide) { //单牌不够的时候，拆分对子或者多牌来凑数
		for (i = 0; i < pcArray.length; i++) {
			t = pcArray[i];
			if (t.count > 1 && hall.GlobalFuncs.FindInArray(ex, t.point) < 0) {
				var cards = t.cards;
				for (var j = 0; j < cards.length; j++) {
					returnArr.push(cards[j]);
					if (returnArr.length >= count) {
						ddz.LOGD(null, "[_findMinSingle][renturn][拆分对子和多牌后返回]");
						return returnArr;
					}
				}
			}
		}
	}

	ddz.LOGD(null, "[_findMinSingle][out][返回空]");
	return []; //找不到需要的数量，直接返回空数组
};

//[20140521][jinrifeng]添加癞子参数(pLaizi)和处理
//找最小的对子牌，用来给三带2， 四带二，飞机带等等， bDivide表示是否拆分3牌，如果不拆分，则不需要ex参数
//pcArray为已经转换好的point-count数组，按point排好序。count为数量， ex为需要排除的点数， 策略是从小到大找单牌，然后再拆牌
ddz.RobotGlobal.findMinDouble = function(pLaizi, pcArray, count, ex, bDivide) { //如果pcArray是从小到大排列，则是从最小取。 如果是从大到小排列，则是从最大取
	var returnArr = [];
	for (var i = 0; i < pcArray.length; i++) {
		var t = pcArray[i];
		if (t.count != 2 || (bDivide && hall.GlobalFuncs.FindInArray(ex, t.point) >= 0) || t.point == 15) { //只有需要拆分的时候，才需要去判断ex
			continue;
		}
		returnArr.push(t.cards.slice(0));
		if (returnArr.length >= count) {
			return returnArr;
		}
	}

	if (bDivide) { //拆分3牌，不拆分炸弹
		for (var i = 0; i < pcArray.length; i++) { //单牌不够的时候，拆分3张来凑数, 不拆分炸弹
			var t = pcArray[i];
			if (t.count == 3 && hall.GlobalFuncs.FindInArray(ex, t.point) < 0) {
				var cards = t.cards;
				returnArr.push([cards[0], cards[1]]);
				if (returnArr.length >= count) {
					return returnArr;
				}
			}
		}
	}

	return []; //找不到需要的数量，直接返回null
};

ddz.RobotGlobal.findAvailableAircraft = function(newarr, lz_obj) {
	var resultObj = ddz.RobotGlobal.findAvailableContinous(newarr, 3, lz_obj);
	var return_arr = resultObj.cards;

	//寻找翅膀,先找对子，再找单数
	var len = return_arr.length;
	if (len > 0) {

		var ex = [];
		var tmp = return_arr.index;
		for (var i = 0, len = return_arr.len; i < len; i++) {
			ex.push(tmp + i);
		}

		var pairs = ddz.RobotGlobal.findMinDouble(lz_obj, newarr, len / 3, ex, false); // 找带的对子
		var p_length = pairs.length;
		if (p_length > 0) {
			ddz.LOGD(null, "find min double in find available aircraft....");

			for (var k = 0; k < p_length; k++) {
				return_arr = return_arr.concat(pairs[k]);
			}
			return return_arr;
		}
		var singles = ddz.RobotGlobal.findMinSingle(lz_obj, newarr, len / 3, ex, false); //[1,2,3,4]...
		if (singles.length > 0) {
			ddz.LOGD(null, "find min single in find available aircraft....");
			return_arr = return_arr.concat(singles);
			return return_arr;
		}
	}
	return return_arr;
};

//找最大连对cell_count = 2, 顺子cell_count = 1， 不包括2和双王, 
ddz.RobotGlobal.findAvailableContinous = function(newarr, cell_count, lz_obj) {
	// 默认是升序排列newarr，如果要找最大的可以倒序
	for (var index = 0; index < 11; index++) {
		// 连子的最小是点数3，最大是A
		var lz_use = 0;
		var i = 0;
		var cards = [];
		var point = -1;
		// ddz.LOGD(null, "now start index : " + index);

		while (i <= (11 - index)) {
			var sub_index = index + i;
			var tmp = newarr[sub_index];

			// ddz.LOGD(null, "sub index " + sub_index + " point == " + tmp.point);
			var need = cell_count - tmp.count;
			if (need < 0) {
				// 不要拆更多张数的主牌型，比如找飞机时不要拆炸弹，找连对时，不要拆3张
				ddz.LOGD(null, 'not divide' + 'index == ' + index);
				break;
			}
			lz_use += need;
			// ddz.LOGD(null, 'lz_use == ' + lz_use + 'laizi count == ' + lz_obj.count);
			if (lz_use > lz_obj.count) {
				//  不够时要还原回去
				lz_use -= need;

				// ddz.LOGD(null, 'laizi not enough!' + 'index ==' +index);
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
			// ddz.LOGD(null, 'push cards at index :' + sub_index);
			cards = cards.concat(tmp.cards);
			i++;
			// ddz.LOGD(null, "i " + i + " array index " + index);
		}

		var clen = cards.length;
		if (clen >= 5) {
			// 找到1个就可以了
			ddz.LOGD(null, 'find Available Continous------------ index == ' + index);

			// 更新癞子的数量
			lz_obj.count -= lz_use;
			ddz.LOGD(null, 'laizi count == ' + lz_obj.count);
			return {
				index: index,
				len: i,
				cards: cards
			};
		}
	}

	// 找不到时返回空数组
	return {
		index: -1,
		len: 0,
		cards: []
	};
};


// 在此之前是检查连对、飞机、顺子等牌型
ddz.RobotGlobal.findAvailableThree = function(newarr, lz_obj) {
	var return_arr = [];
	var index;
	var tmp;
	var cards = [];
	var leftArr;

	// 先找本身就是3个的，之后再用癞子拼, 找到小王就可以了
	for (index = 0; index < 13; index++) {
		tmp = newarr[index];
		if (tmp.count == 3) {
			return_arr = return_arr.concat(tmp.cards);
			break;
		}
	}
	if (index == 13) {
		// 无法构成3张
		return [];
	}

	//找带的对，没有的话找带的单
	var pairs = ddz.RobotGlobal.findMinDouble(lz_obj, newarr, 1, [tmp.point], false); //[[1, 2], [3, 4]]...
	if (pairs.length > 0) {
		return_arr = return_arr.concat(pairs[0]);
	} else {
		var singles = ddz.RobotGlobal.findMinSingle(lz_obj, newarr, 1, [tmp.point], false); //[1,2,3,4]...
		if (singles.length > 0) {
			return_arr = return_arr.concat(singles[0]);
		}
	}
	return return_arr;
};