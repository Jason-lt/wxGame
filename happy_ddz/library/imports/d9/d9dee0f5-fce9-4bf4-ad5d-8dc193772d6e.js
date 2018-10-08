"use strict";
cc._RF.push(module, 'd9deeD1/OlL9K1djcGTdy1u', 'AILongestType');
// Script/ddz/AILongestType.js

'use strict';

//
//  ddz_robot_longgest.js
//  ddz
//
//  Created by Jiguan on 14-06-03.
//  AI找最长牌型的功能，抽象出来以减少ddz_robot.js的代码量

ddz.AILongestType = cc.Class({

	// 判断牌型，传入牌的数组,返回可能的牌型或不合法等状态
	getOneLongestCardType: function getOneLongestCardType(cards) {
		//如果有癞子牌，传进来就是>53，转换成位置value就是15
		ddz.LOGD(null, "getLongestType");
		//可用牌型
		//每一个元素是一个对象obj，obj{总张数count，牌的count值cards}
		var availableCards = [];

		/*判断当前手牌是不是一个牌型
   *如果是，当前手牌便是最长的
   */
		var types = ddz.RobotGlobal.judgeType(cards, false);
		if (types.length > 0) {
			return cards.slice(0);
		}

		// 当前手牌不是一手牌，从中找顺子或者顺对
		var pc = ddz.RobotGlobal.getPCArrayByPoint(cards);
		pc.sort(ddz.GlobalFuncs._sortByPoint);

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
				cardsInfo.push(aObj['cards'][cardsInfoIndex]);
			}
			newarr.push({
				'point': aObj.point,
				'count': aObj.count,
				'cards': cardsInfo
			});
		}

		///////////////////////////////////////////////////处理癞子

		var lz_obj = ddz.RobotGlobal.getLaiziObject(pc);

		///////////////////////////////////////////////////处理癞子OVER

		var reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		/////////////////////////////////////////////////////////////////////////////////找顺子
		//找最长顺子
		var return_arr = ddz.RobotGlobal.findAvailableContinousDevide(newarr, 1, lz_obj).cards;
		if (return_arr.length > 0) {
			availableCards.push({
				'count': return_arr.length,
				'cards': return_arr
			});
		}

		reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		///////////////////////////////////////////////////////////////////////////////////////找连对
		return_arr = ddz.RobotGlobal.findAvailableContinousDevide(newarr, 2, lz_obj).cards;
		if (return_arr.length > 0) {
			availableCards.push({
				'count': return_arr.length,
				'cards': return_arr
			});
		}

		reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		// 在顺子和连对都有的情况，如果连对牌的张数必须大于顺子牌的两倍
		if (availableCards.length == 2) {
			if (availableCards[0].count * 2 <= availableCards[1].count) {
				return availableCards[1]['cards'];
			} else {
				return availableCards[0]['cards'];
			}
		}

		//排序
		if (availableCards.length > 0) {
			availableCards.sort(this._sortByCount);
			if (availableCards[0]['cards'].length > 0) {
				return availableCards[0]['cards'];
			}
		} else {
			return cards;
		}
	},
	_sortByCount: function _sortByCount(o1, o2) {
		return o2.count - o1.count;
	}
});

cc._RF.pop();