//
//  ddz_robot_longgest.js
//  ddz
//
//  Created by Jiguan on 14-06-03.
//  AI找最长牌型的功能，抽象出来以减少ddz_robot.js的代码量

ddz.AILongestType = cc.Class({

	// 判断牌型，传入牌的数组,返回可能的牌型或不合法等状态
	getOneLongestCardType: function() { //如果有癞子牌，传进来就是>53，转换成位置value就是15
		ddz.LOGD(null, "getLongestType");
		var cards = arguments[0];
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
		var newarr = ddz.RobotGlobal.getAllPCArray(cards);
		var pc = ddz.RobotGlobal.getSubPCArray(newarr);
		var lz_obj = ddz.RobotGlobal.getLaiziObject(pc);

		var reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		/////////////////////////////////////////////////////////////////////////////////找顺子
		//找最大顺子
		var oneobj;
		var return_arr = ddz.RobotGlobal.findAvailableContinousDevide(newarr, 1, lz_obj).cards;
		if (return_arr.length > 0) {
			oneobj = {
				count: return_arr.length,
				cards: return_arr
			};
			availableCards.push(oneobj);
		}

		///////////////////////////////////////////////////////////////////////////////////////找连对
		return_arr = ddz.RobotGlobal.findAvailableContinousDevide(newarr, 2, lz_obj).cards;
		if (return_arr.length > 0) {
			oneobj = {
				count: return_arr.length,
				cards: return_arr
			};
			availableCards.push(oneobj);
		}

		//排序
		if (availableCards.length > 0) {
			availableCards.sort(this._sortByCount);
			return availableCards[0].cards;
		} else {
			return cards;
		}
	},
	_sortByCount: function(o1, o2) {
		return o2.count - o1.count;
	}
});