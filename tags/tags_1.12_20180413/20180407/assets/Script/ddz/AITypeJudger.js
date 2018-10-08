var _is1 = function(dicarr, lz_obj, types) { //单牌
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.SINGLE_CARD) >= 0) {
		return;
	}
	var pos = dicarr[0].point;
	var cards = dicarr[0].cards;
	if (dicarr[0].count < 1) {
		cards = cards.concat(lz_obj.cards);
	}
	types.push(new ddz.CardType(ddz.Enums.PaixingType.SINGLE_CARD, pos, 1, cards));
};

var _is2 = function(dicarr, lz_obj, types) { //对子
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.DOUBLE_CARD) >= 0) {
		return;
	}
	for (var i = 0; i < dicarr.length; i++) {
		var tmp = dicarr[i];
		if (tmp.point > 12) {
			continue;
		}
		var need = 2 - tmp.count;
		if (need <= lz_obj.count) {
			var cards = tmp.cards.slice(0);
			for (var i = 0; i < need; i++) {
				cards.push(ddz.GlobalFuncs.getLaiziNumByValue(tmp.point));
			}
			types.push(new ddz.CardType(ddz.Enums.PaixingType.DOUBLE_CARD, tmp.point, 2, cards));
		}
	}
};

var _isRocket = function(arr, types) { //火箭
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.ROCKET) >= 0) {
		return;
	}
	if ((arr[0] == 52 && arr[1] == 53) || (arr[0] == 53 && arr[1] == 52)) {
		types.push(new ddz.CardType(ddz.Enums.PaixingType.ROCKET, 13, 2, [52, 53]));
	}
};

var _is3 = function(dicarr, lz_obj, types) {
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.THREE_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < dicarr.length; index++) {
		var tmp = dicarr[index];
		if (tmp.point > 12) {
			continue;
		}
		var need = 3 - tmp.count;
		if (need == lz_obj.count) {
			var cards = tmp.cards.slice(0);
			if (need > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
				for (var i = 0; i < need; i++) {
					cards.push(n);
				}
			}
			types.push(new ddz.CardType(ddz.Enums.PaixingType.THREE_CARD, tmp.point, 3, cards));
			break;
		}
	}
};

// 3带1
var _is31 = function(dicarr, lz_obj, types) { //3334(0癞子) 33L4(1癞子，如果333L则是炸弹), 3LL4(2癞子，L代表较大的4), 3癞子的话会是炸弹, 所以带癞子的话，一定有3种value
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.THREE_ONE_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < dicarr.length; index++) {
		var tmp = dicarr[index];
		var tmpPoint = tmp.point;
		if (tmpPoint > 12) {
			continue;
		}
		var need = 3 - tmp.count;
		if (need < 0) {
			need = 0;
		}
		if (need <= lz_obj.count) {
			var cards = tmp.cards.slice(0);
			if (need > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmpPoint);
				for (var i = 0; i < need; i++) {
					cards.push(n);
				}
			}
			//如果有剩下癞子牌，直接按原值推进
			var left = lz_obj.count - need;
			if (left > 0) {
				var lz_card = lz_obj.cards[0];
				for (var j = 0; j < left; j++) {
					cards.push(lz_card);
				}
			}
			//剩下的牌直接推进去
			for (var j = 0; j < dicarr.length; j++) {
				if (j != index) {
					cards = cards.concat(dicarr[j].cards);
				}
			}
			types.push(new ddz.CardType(ddz.Enums.PaixingType.THREE_ONE_CARD, tmpPoint, 4, cards));
			break;
		}
	}
};

var _checkDoubles = function(dicarr, count, lz_obj) { //验证在dicarr中是否正好凑count个对子，有lz_count个癞子。
	var c = 0; //总共对子数
	var lz_need = 0; //总共需要的癞子数
	var cards = [];
	for (var index = 0; index < dicarr.length; index++) {
		var tmp = dicarr[index];
		if (tmp.count == 0 || tmp.point > 12) { //癞子不进行计算
			continue;
		}
		var need = 2 - tmp.count;
		if (need < 0) {
			c += 2;
			need = need == -2 ? 0 : 1; //need = -2，则lz_need不增加，need = -1，则lz_need++
		} else {
			c += 1;
		}
		lz_need += need;
		if (lz_need <= lz_obj.count) {
			cards = cards.concat(tmp.cards);
			if (need > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
				for (var j = 0; j < need; j++) {
					cards.push(n);
				}
			}
		} else {
			return null;
		}
	}
	var num = lz_obj.count - lz_need;
	if (c * 2 + num == count * 2) { //剩余的没拿去凑数的癞子，按原值存储.这里是判断剩下的癞子数是偶数，可以拿来凑对子，（总牌数有限制保证，不需要判断）
		var n = lz_obj.cards[0];
		for (var j = 0; j < num; j++) {
			cards.push(n);
		}
		return cards;
	}
	return null;
};

// 3带1对
var _is32 = function(dicarr, lz_obj, types) {
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.THREE_TWO_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < dicarr.length; index++) {
		var tmp = dicarr[index];
		if (tmp.point > 12) {
			continue;
		}
		var need = 3 - tmp.count;
		if (need < 0) { //4444L，不能拼成3带2，否则变成5个4
			continue;
		}
		if (need <= lz_obj.count) { //癞子够拼
			var cards = tmp.cards.slice(0);
			if (need > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
				for (var i = 0; i < need; i++) {
					cards.push(n);
				}
			}
			//要求剩下的可以拼成一对， 因为总数是5张，拼成了3张，剩下的只要找到一对就行
			var newarr = hall.GlobalFuncs.GetSubArrayExceptIndex(dicarr, [index]);
			var result = _checkDoubles(newarr, 1, {
				point: lz_obj.point,
				count: lz_obj.count - need,
				cards: lz_obj.cards
			});
			if (result) { // 剩下的正好是一对
				cards = cards.concat(result);
				types.push(new ddz.CardType(ddz.Enums.PaixingType.THREE_TWO_CARD, tmp.point, 5, cards));
				break;
			}
		}
	}
};

//炸弹
var _isBomb = function(dicarr, lz_obj, types, laiZiCnt) {
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.BOMB_CARD) >= 0) {
		return;
	}
	for (var i = 0; i < dicarr.length; i++) {
		var tmp = dicarr[i];
		if (tmp.point > 12) {
			continue;
		}
		var need = 4 - tmp.count;
		if (need == lz_obj.count) {
			var cards = [].concat(tmp.cards);
			//用到的癞子牌
			if (need > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
				for (var j = 0; j < need; j++) {
					cards.push(n);
				}
			}
			types.push(new ddz.CardType(ddz.Enums.PaixingType.BOMB_CARD, tmp.point, 4, cards, laiZiCnt));
		}
	}
};

// 4带2单
var _is411 = function(dicarr, lz_obj, types) { //跟31几乎完全一样
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.BOMB_TWO_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < dicarr.length; index++) {
		var tmp = dicarr[index];
		if (tmp.point > 12) {
			continue;
		}
		var need = 4 - tmp.count; //need不可能小于0
		if (need <= lz_obj.count) {
			var cards = [].concat(tmp.cards);
			if (need > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
				for (var i = 0; i < need; i++) {
					cards.push(n);
				}
			}
			//如果有剩下癞子牌，直接按原值推进
			var left = lz_obj.count - need;
			if (left > 0) {
				var lz_card = lz_obj.cards[0];
				for (var j = 0; j < left; j++) {
					cards.push(lz_card);
				}
			}
			//剩下的牌直接推进去
			for (var j = dicarr.length-1; j >= 0; j--) {
				if (j != index) {
					cards = cards.concat(dicarr[j].cards);
				}
			}
			types.push(new ddz.CardType(ddz.Enums.PaixingType.BOMB_TWO_CARD, tmp.point, 6, cards));
			break;
		}
	}
};

// 4带2对
var _is422 = function(dicarr, lz_obj, types) { //目前444455LL会被处理成5555带2对4，也就是炸弹在需要的时候会被拆成2个对
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < dicarr.length; index++) {
		var tmp = dicarr[index];
		if (tmp.point > 12) {
			continue;
		}
		var need = 4 - tmp.count;
		if (need <= lz_obj.count) { //癞子够拼
			var cards = tmp.cards.slice(0);
			if (need > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp.point);
				for (var i = 0; i < need; i++) {
					cards.push(n);
				}
			}
			//要求剩下的可以拼成2对
			var newarr = hall.GlobalFuncs.GetSubArrayExceptIndex(dicarr, [index]);
			var result = _checkDoubles(newarr, 2, {
				point: lz_obj.point,
				count: lz_obj.count - need,
				cards: lz_obj.cards
			});
			if (result) { // 剩下的正好是一对
				// cards = cards.concat(result);
				for (var i = result.length-1; i >= 0; i --){
					if(i%2 == 0 && i < result.length-1){
						cards.push(result[i+1]);
					}else if(i%2 == 1 && i > 0){
						cards.push(result[i-1]);
					}else {
						cards.push(result[i]);
					}
				}
				types.push(new ddz.CardType(ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD, tmp.point, 8, cards));
				break;
			}
		}
	}
};

// 3顺带2单
var _is3311 = function(newarr, lz_obj, types) { //总共8个牌，只要找出2个3顺，剩余2牌一定符合规则
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD) >= 0) {
		return;
	}
	ddz.LOGD(null, "[_is3311][in]");
	for (var index = 0; index < newarr.length - 4; index++) { //不包含2，从A开始找,出去大王，小王，2
		var tmp1 = newarr[index];
		var tmp2 = newarr[index + 1];
		var need1 = 3 - tmp1.count; //4444555L，应该判断成3个4，3个5，带2单
		var need2 = 3 - tmp2.count;
		if (need1 < 0) {
			need1 = 0;
		}
		if (need2 < 0) {
			need2 = 0;
		}
		var left = lz_obj.count - need1 - need2;
		if (left >= 0) { //只要癞子够凑成33就行，剩下的2个牌
			//var cards = tmp1.cards.concat(tmp2.cards);
			var cards1 = tmp1.cards.slice(0);
			var cards2 = tmp2.cards.slice(0);
			if (need1 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp1.point);
				for (var i = 0; i < need1; i++) {
					cards1.push(n); //[20140526][jinrifeng] 修改带有癞子的飞机带2个时，显示顺序错误问题
					//tmp1.cards.push(n);
				}
			}
			if (need2 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp2.point);
				for (var i = 0; i < need2; i++) {
					cards2.push(n); //[20140526][jinrifeng] 修改带有癞子的飞机带2个时，显示顺序错误问题
				}
			}
			//var cards = tmp1.cards.concat(tmp2.cards);
			// var cards = cards1.concat(cards2); //[20140526][jinrifeng] 修改带有癞子的飞机带2个时，显示顺序错误问题
			var cards = cards2.concat(cards1);
			//把剩下的癞子牌按原值推进去
			if (left > 0) {
				var lz_card = lz_obj.cards[0];
				for (var i = 0; i < left; i++) {
					cards.push(lz_card);
				}
			}
			//剩余的牌推进去
			// for (var i = 0; i < newarr.length; i++) {
			// 	if (i != index && i != index + 1) {
			// 		cards = cards.concat(newarr[i].cards);
			// 	}
			// }
			for (var i = newarr.length-1; i >= 0; i--) {
				if (i != index && i != index + 1) {
					cards = cards.concat(newarr[i].cards);
				}
			}
			types.push(new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD, tmp1.point, 8, cards));
			break;
		}
	}
};

// 3顺带2对
var _is3322 = function(newarr, lz_obj, types) {
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < newarr.length - 4; index++) { //不包含2，从A开始找
		var tmp1 = newarr[index];
		var tmp2 = newarr[index + 1];
		var need1 = 3 - tmp1.count; //4444555L，应该判断成3个4，3个5，带2单
		var need2 = 3 - tmp2.count;
		if (need1 < 0) {
			need1 = 0;
		}
		if (need2 < 0) {
			need2 = 0;
		}
		var left = lz_obj.count - need1 - need2;
		if (left >= 0) { //可以拼成2个三顺，要求剩下的牌可以拼成2个对子
			//要求剩下的可以拼成2对
			var subarr = hall.GlobalFuncs.GetSubArrayExceptIndex(newarr, [index, index + 1]);
			var result = _checkDoubles(subarr, 2, {
				point: lz_obj.point,
				count: left,
				cards: lz_obj.cards
			});
			if (result) { // 剩下的正好是2对
				//开始把牌放入cards
				//var cards = tmp1.cards.concat(tmp2.cards);
				var cards1 = tmp1.cards.slice(0);
				var cards2 = tmp2.cards.slice(0);
				if (need1 > 0) {
					var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp1.point);
					for (var i = 0; i < need1; i++) {
						cards1.push(n); //[20140526][jinrifeng] 修改带有癞子的飞机带2个时，显示顺序错误问题
					}
				}
				if (need2 > 0) {
					var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp2.point);
					for (var i = 0; i < need2; i++) {
						cards2.push(n); //[20140526][jinrifeng] 修改带有癞子的飞机带2个时，显示顺序错误问题
					}
				}
				// var cards = cards1.concat(cards2); //[20140526][jinrifeng] 修改带有癞子的飞机带2个时，显示顺序错误问题
				var cards = cards2.concat(cards1);
				// cards = cards.concat(result);
				for (var i = result.length-1; i >= 0; i --){
					if(i%2 == 0 && i < result.length-1){
						cards.push(result[i+1]);
					}else if(i%2 == 1 && i > 0){
						cards.push(result[i-1]);
					}else {
						cards.push(result[i]);
					}
				}
				types.push(new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD, tmp1.point, 10, cards));
				break;
			}
		}
	}
};

// 3顺带3单
var _is333111 = function(newarr, lz_obj, types) {
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < newarr.length - 5; index++) { //不包含2，从A开始找
		var tmp1 = newarr[index];
		var tmp2 = newarr[index + 1];
		var tmp3 = newarr[index + 2];
		var need1 = 3 - tmp1.count; //4444555L，应该判断成3个4，3个5，带2单
		var need2 = 3 - tmp2.count;
		var need3 = 3 - tmp3.count;
		if (need1 < 0) {
			need1 = 0;
		}
		if (need2 < 0) {
			need2 = 0;
		}
		if (need3 < 0) {
			need3 = 0;
		}
		var left = lz_obj.count - need1 - need2 - need3;
		if (left >= 0) { //只要癞子够凑成33就行，剩下的2个牌
			// var cards = tmp1.cards.concat(tmp2.cards);
			// cards = cards.concat(tmp3.cards);
			// if (need1 > 0) {
			// 	var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp1.point);
			// 	for (var i = 0; i < need1; i++) {
			// 		cards.push(n);
			// 	}
			// }
			// if (need2 > 0) {
			// 	var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp2.point);
			// 	for (var i = 0; i < need2; i++) {
			// 		cards.push(n);
			// 	}
			// }
			// if (need3 > 0) {
			// 	var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp3.point);
			// 	for (var i = 0; i < need3; i++) {
			// 		cards.push(n);
			// 	}
			// }
			var cards = tmp3.cards.concat(tmp2.cards);
			cards = cards.concat(tmp1.cards);
			if (need3 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp3.point);
				for (var i = 0; i < need3; i++) {
					cards.push(n);
				}
			}
			if (need2 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp2.point);
				for (var i = 0; i < need2; i++) {
					cards.push(n);
				}
			}
			if (need1 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp1.point);
				for (var i = 0; i < need1; i++) {
					cards.push(n);
				}
			}
			//把剩下的癞子牌按原值推进去
			if (left > 0) {
				var lz_card = lz_obj.cards[0];
				for (var i = 0; i < left; i++) {
					cards.push(lz_card);
				}
			}
			//剩余的牌推进去
			for (var i = newarr.length-1 ; i >= 0; i--) {
				if (i != index && i != index + 1 && i != index + 2) {
					cards = cards.concat(newarr[i].cards);
				}
			}
			hall.GlobalFuncs.PrintArray(cards);
			types.push(new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD, tmp3.point, 12, cards));
			break;
		}
	}
};

// 3顺带3对
var _is333222 = function(newarr, lz_obj, types) {
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < newarr.length - 5; index++) { //不包含2，从A开始找
		var tmp1 = newarr[index];
		var tmp2 = newarr[index + 1];
		var tmp3 = newarr[index + 2];
		var need1 = 3 - tmp1.count; //4444555L，应该判断成3个4，3个5，带2单
		var need2 = 3 - tmp2.count;
		var need3 = 3 - tmp3.count;
		if (need1 < 0) {
			need1 = 0;
		}
		if (need2 < 0) {
			need2 = 0;
		}
		if (need3 < 0) {
			need3 = 0;
		}
		var left = lz_obj.count - need1 - need2 - need3;
		if (left >= 0) { //可以拼成2个三顺，要求剩下的牌可以拼成2个对子
			//要求剩下的可以拼成2对
			var subarr = hall.GlobalFuncs.GetSubArrayExceptIndex(newarr, [index, index + 1, index + 2]);
			var result = _checkDoubles(subarr, 3, {
				point: lz_obj.point,
				count: left,
				cards: lz_obj.cards
			});
			if (result) { // 剩下的正好是3对
				//开始把牌放入cards
				// var cards = tmp1.cards.concat(tmp2.cards);
				// cards = cards.concat(tmp3.cards);
				var cards = tmp3.cards.concat(tmp2.cards);
				cards = cards.concat(tmp1.cards);
				if (need1 > 0) {
					var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp1.point);
					for (var i = 0; i < need1; i++) {
						cards.push(n);
					}
				}
				if (need2 > 0) {
					var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp2.point);
					for (var i = 0; i < need2; i++) {
						cards.push(n);
					}
				}
				if (need3 > 0) {
					var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp3.point);
					for (var i = 0; i < need3; i++) {
						cards.push(n);
					}
				}
				// cards = cards.concat(result);
				for (var i = result.length-1; i >= 0; i --){
					if(i%2 == 0 && i < result.length-1){
						cards.push(result[i+1]);
					}else if(i%2 == 1 && i > 0){
						cards.push(result[i-1]);
					}else {
						cards.push(result[i]);
					}
				}
				types.push(new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD, tmp1.point, 15, cards));
				break;
			}
		}
	}
};

// 3顺带4单
var _is33331111 = function(newarr, lz_obj, types) {
	if (ddz.FORBIDDEN_TYPES && hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD) >= 0) {
		return;
	}
	for (var index = 0; index < newarr.length - 6; index++) { //不包含2，从A开始找
		var tmp1 = newarr[index];
		var tmp2 = newarr[index + 1];
		var tmp3 = newarr[index + 2];
		var tmp4 = newarr[index + 3];
		var need1 = 3 - tmp1.count; //4444555L，应该判断成3个4，3个5，带2单
		var need2 = 3 - tmp2.count;
		var need3 = 3 - tmp3.count;
		var need4 = 3 - tmp4.count;
		if (need1 < 0) {
			need1 = 0;
		}
		if (need2 < 0) {
			need2 = 0;
		}
		if (need3 < 0) {
			need3 = 0;
		}
		if (need4 < 0) {
			need4 = 0;
		}
		var left = lz_obj.count - need1 - need2 - need3 - need4;
		if (left >= 0) { //只要癞子够凑成33就行，剩下的2个牌
			// var cards = tmp1.cards.concat(tmp2.cards);
			// cards = cards.concat(tmp3.cards);
			// cards = cards.concat(tmp4.cards);
			var cards = tmp4.cards.concat(tmp3.cards);
			cards = cards.concat(tmp2.cards);
			cards = cards.concat(tmp1.cards);
			if (need1 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp1.point);
				for (var i = 0; i < need1; i++) {
					cards.push(n);
				}
			}
			if (need2 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp2.point);
				for (var i = 0; i < need2; i++) {
					cards.push(n);
				}
			}
			if (need3 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp3.point);
				for (var i = 0; i < need3; i++) {
					cards.push(n);
				}
			}
			if (need4 > 0) {
				var n = ddz.GlobalFuncs.getLaiziNumByValue(tmp4.point);
				for (var i = 0; i < need4; i++) {
					cards.push(n);
				}
			}
			//把剩下的癞子牌按原值推进去
			if (left > 0) {
				var lz_card = lz_obj.cards[0];
				for (var i = 0; i < left; i++) {
					cards.push(lz_card);
				}
			}
			//剩余的牌推进去
			for (var i = newarr.length-1 ; i >= 0; i--) {
				if (i != index && i != index + 1 && i != index + 2 && i != index + 3) {
					cards = cards.concat(newarr[i].cards);
				}
			}
			types.push(new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD, tmp1.point, 12, cards));
			break;
		}
	}
};

var _isContinuous = function(newarr, lz_obj, total_count, types, cell_count) { //newarr为345-k的数组， cell_count为每个单元的数量（顺子1连对2飞机3）
	var len = newarr.length;
	if (newarr[len - 1].count > 0 || newarr[len - 2].count > 0 || newarr[len - 3].count > 0) { //大小王，2不能出现在顺连对飞机中，如果有2，一定不符合。如果2为癞子牌，不当本身值使用，所以下面循环index从1开始
		// ddz.LOGD(null, "2 should not in continuous, return");
		return;
	}

	for (var index = newarr.length - 4; index >= 0; index --) { //从A到3
		var lz_use = 0;
		var i = 0;
		var cards = [];
		var point = -1;
		var card_use = 0;
		while (i <= index) {
			var sub_index = index - i;
			var tmp = newarr[sub_index];
			var need = cell_count - tmp.count;
			if (need < 0) {
				cards = []; //牌型不符合规则的时候
				// ddz.LOGD(null, "cards more than need ..... break");
				break;
			}
			if (lz_use > lz_obj.count - need) { //如果需要的癞子数超过了，则break出去，检查之后是否还有剩余牌，则会导致剩余牌，不符合规则，所以清空cards
				// ddz.LOGD(null, "lz not enough, break");
				break;
			}
			lz_use += need;
			point = tmp.point;
			// ddz.LOGD(null, cell_count+"===================================="+tmp.point);
			if (need > 0) { //需要用癞子补，则把癞子转换成相应的值
				var n = ddz.GlobalFuncs.getLaiziNumByValue(point);
				for (var j = 0; j < need; j++) {
					cards.push(n);
				}
			}
			cards = cards.concat(tmp.cards);
			card_use += tmp.count;
			i++;
		}
		var clen = cards.length;
		if (clen >= 5 && lz_obj.count == lz_use && card_use + lz_use == total_count) { // 不能有癞子牌剩余，也不能有手牌剩余，3个条件都满足才行
				switch (cell_count) {
				case 1:
					if (!ddz.FORBIDDEN_TYPES || hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.SHUNZI_CARD) < 0) {
						types.push(new ddz.CardType(ddz.Enums.PaixingType.SHUNZI_CARD, point, clen, cards));
					}
					break;
				case 2:
					if (!ddz.FORBIDDEN_TYPES || hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.LIANDUI_CARD) < 0) {
						types.push(new ddz.CardType(ddz.Enums.PaixingType.LIANDUI_CARD, point, clen, cards));
					}
					break;
				case 3:
					if (!ddz.FORBIDDEN_TYPES || hall.GlobalFuncs.FindInArray(ddz.FORBIDDEN_TYPES, ddz.Enums.PaixingType.AIRCRAFT_CARD) < 0) {
						ddz.LOGD(null, cell_count+"===AIRCRAFT_CARD================================="+point);
						types.push(new ddz.CardType(ddz.Enums.PaixingType.AIRCRAFT_CARD, point, clen, cards));
					}
					break;
				default:
					ddz.LOGD(null, "error, should not enter this scope");
					break;
			}
			break;
		}
	}
};

//  AI牌型判断的功能，抽象出来以减少ddz_robot.js的代码量
ddz.AITypeJudger = function(arr, dicarr, newarr, lz_obj, laiZiCnt) { //如果有癞子牌，传进来就是>53，转换成value就是15
	ddz.LOGD(null, "in judge type in robot ai....");
	ddz.LOGD(null, 'laiZiCnt=' + laiZiCnt);

	var types = [];
	var len = arr.length;
	ddz.LOGD(null, "[judgeType] len = " + len);

	switch (len) {
		case 1:
			_is1(dicarr, lz_obj, types);
			break;
		case 2:
			_isRocket(arr, types);
			_is2(dicarr, lz_obj, types);
			break;
		case 3:
			_is3(dicarr, lz_obj, types);
			break;
		case 4: //4444会两种都判定符合，可以设定为只要判定是炸弹就返回，不再判定31
			_isBomb(dicarr, lz_obj, types, laiZiCnt);
			_is31(dicarr, lz_obj, types);
			break;
		case 5:
			_is32(dicarr, lz_obj, types);
			break;
		case 6:
			_is411(dicarr, lz_obj, types);
			break;
		case 8:
			_is422(dicarr, lz_obj, types);
			_is3311(newarr, lz_obj, types);
			break;
		case 10:
			_is3322(newarr, lz_obj, types);
			break;
		case 12:
			_is333111(newarr, lz_obj, types);
			break;
		case 15:
			_is333222(newarr, lz_obj, types);
			break;
		case 16:
			_is33331111(newarr, lz_obj, types);
			break;
		default:
			break;
	}

	if (len > 4) {
		_isContinuous(newarr, lz_obj, len, types, 1); //顺子
		_isContinuous(newarr, lz_obj, len, types, 2); //连对
		_isContinuous(newarr, lz_obj, len, types, 3); //飞机
	}
	return types;
};