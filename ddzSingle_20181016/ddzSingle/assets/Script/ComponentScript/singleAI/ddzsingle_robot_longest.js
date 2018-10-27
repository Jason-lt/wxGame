//
//  ddz_robot_longgest.js
//  ddz
//
//  Created by Jiguan on 14-06-03.
//  AI找最长牌型的功能，抽象出来以减少ddz_robot.js的代码量

ddz.AILongestType = cc.Class({
	ctor: function(ai) {
		this.AI = ai;
	},

	// 判断牌型，传入牌的数组,返回可能的牌型或不合法等状态
	getOneLongestCardType: function(cards) { //如果有癞子牌，传进来就是>53，转换成位置value就是15
		//可用牌型
		//每一个元素是一个对象obj，obj{总张数count，牌的count值cards}
		var availableCards = [];

		/*判断当前手牌是不是一个牌型
		 *如果是，当前手牌便是最长的
		 */
		var types = this.AI.judgeType(cards, false);
		if (types.length > 0) {
			return cards.slice(0);
		}

		// 当前手牌不是一手牌，从中找顺子或者顺对
		var pc = this.AI._getPCArrayByPoint(cards);
		pc.sort(this.AI._sortByPoint);

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
		
		///////////////////////////////////////////////////处理癞子

		var lz_obj = this.AI._getLaiziObject(pc);


		///////////////////////////////////////////////////处理癞子OVER


		var reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		/////////////////////////////////////////////////////////////////////////////////找顺子
		//找最小顺子
		var return_arr = this.AI._findAvailableContinousDevide(newarr, 1, lz_obj).cards;
		if (return_arr.length > 0) {
			// ddz.CardTable.print(return_arr);

			var oneobj = {
				'count':return_arr.length,
				'cards':return_arr
			}
			availableCards.push(oneobj);
		}

		// 找带癞子拼成的
		//lz_obj.count = reportLaiziCount;

		// var return_arr = this.AI._findAvailableContinousDevide(newarr, 1, lz_obj).cards;
		// if (return_arr.length > 0) {
		// 	this.AI._dumpResultArr('found shunzi', return_arr);

		// 	var oneobj = {
		// 		'count':return_arr.length,
		// 		'cards':return_arr
		// 	}
		// 	availableCards.push(oneobj);
		// }
		//////////////////////////////////////////////////////////////////////////////////////找顺子over

		reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		///////////////////////////////////////////////////////////////////////////////////////找连对
		return_arr = this.AI._findAvailableContinousDevide(newarr, 2, lz_obj).cards;
		// ddz.CardTable.print(return_arr);
		if (return_arr.length > 0) {
			this.AI._dumpResultArr('found liandui', return_arr);

			var oneobj = {
				'count':return_arr.length,
				'cards':return_arr
			}
			availableCards.push(oneobj);
		}

		// 找带癞子拼成的
		// lz_obj.count = reportLaiziCount;

		// var return_arr = this.AI._findAvailableContinous(newarr, 2, lz_obj).cards;
		// if (return_arr.length > 0) {
		// 	this.AI._dumpResultArr('found liandui', return_arr);

		// 	var oneobj = {
		// 		'count':return_arr.length,
		// 		'cards':return_arr
		// 	}
		// 	availableCards.push(oneobj);
		// }
		///////////////////////////////////////////////////////////////////////////////////////找连对over

		reportLaiziCount = lz_obj.count;
		// 先考虑本身就能够构成这种牌型的牌
		lz_obj.count = 0;

		///////////////////////////////////////////////////////////////////////////////////////找飞机
		// var return_arr = this.AI._findAvailableAircraft(newarr, lz_obj);
		// if (return_arr.length > 0) {
		// 	this.AI._dumpResultArr('found aircraft', return_arr);
		// 	var oneobj = {
		// 		'count':return_arr.length,
		// 		'cards':return_arr
		// 	}
		// 	availableCards.push(oneobj);
		// }

		// 找带癞子拼成的飞机
		// lz_obj.count = reportLaiziCount;
		// var return_arr = this.AI._findAvailableAircraft(newarr, lz_obj);
		// if (return_arr.length > 0) {
		// 	this.AI._dumpResultArr('found aircraft', return_arr);

		// 	var oneobj = {
		// 		'count':return_arr.length,
		// 		'cards':return_arr
		// 	}
		// 	availableCards.push(oneobj);
		// }
		///////////////////////////////////////////////////////////////////////////////////////找飞机over

		
		///////////////////////////////////////////////////////////////////////////////////////找三带
		// var return_arr = this.AI._findAvailableThree(newarr, lz_obj); //找第一个出现的3个, 内部考虑了先找不带癞子的
		// if (return_arr.length > 0) {
		// 	this.AI._dumpResultArr('found three', return_arr);

		// 	var oneobj = {
		// 		'count':return_arr.length,
		// 		'cards':return_arr
		// 	}
		// 	availableCards.push(oneobj);
		// }
		///////////////////////////////////////////////////////////////////////////////////////找三带over


		// /////////////////////////////////////////////////////////////////////////////////////////找对子
		// if (availableCards.length == 0) {
		// 	var pairs = this.AI._findMinDouble(lz_obj, pc, 1, [], false);
		// 	ddz.CardTable.print(pairs);
		// 	if (pairs.length > 0) {
		// 		var oneobj = {
		// 			'count':2,
		// 			'cards':pairs[0]
		// 		}
		// 		availableCards.push(oneobj);
		// 	}
		// }
		// /////////////////////////////////////////////////////////////////////////////////////////找对子OVER

		// /////////////////////////////////////////////////////////////////////////////////////////找单牌
		// if (availableCards.length == 0) {
		// 	var single = this.AI._findMinSingle(lz_obj, pc, 1, [], false);
		// 	if (single.length > 0) {
		// 		var oneobj = {
		// 			'count':1,
		// 			'cards':single
		// 		}
		// 		availableCards.push(oneobj);
		// 	}
		// };
		/////////////////////////////////////////////////////////////////////////////////////////找单牌over

		//排序
		if(availableCards.length>0){
			availableCards.sort(this._sortByCount);
			if (availableCards[0]['cards'].length>0) {
				return availableCards[0]['cards'];
			}
		}
		else
		{
			return cards;
		}
		

	},
	_sortByCount: function(o1, o2) {
		return o1['count'] < o2['count'];
	},
});

