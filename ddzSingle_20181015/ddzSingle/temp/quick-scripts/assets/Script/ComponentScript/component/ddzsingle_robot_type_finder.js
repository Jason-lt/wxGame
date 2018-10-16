(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddzsingle_robot_type_finder.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b14b2x38sZKRL8oGTw2B0Z5', 'ddzsingle_robot_type_finder', __filename);
// Script/ComponentScript/component/ddzsingle_robot_type_finder.js

'use strict';

/*
	File : 牌型查找器，从一组手牌中查找出所有的牌型
	
	单张、对子、三张、炸弹都是判断同一个点数的牌的张数，这个可以抽象，这类的判断不加癞子牌
*/

ddz.typeByNum = cc.Class({

	_TAG: 'ddz.typeByNum',

	ctor: function ctor(num) {
		this._num = num;
	},

	/* 
 	function : 查找数量为_num的手牌
 	cardsPoint : 手牌的权重数组
 */
	find: function find(cardsPoint) {
		var result = [];
		if (this._num <= 0) {
			ddz.LOGD(this._TAG, 'You have not set _num vale');
			return result;
		}

		if (!cardsPoint) {
			return result;
		}

		for (var i = 0; i < cardsPoint.length; i++) {
			if (cardsPoint[i].count == this._num) {
				if (!this._filter(cardsPoint, i)) {
					result.push(cardsPoint[i].cards);
				}
			}
		}

		ddz.LOGD('typeByNum', ' result = ' + JSON.stringify(result));
		return result;
	},

	//过滤
	_filter: function _filter(cardsPoint, index) {
		return false;
	}
});

ddz.singleFinder = cc.Class({

	ctor: function ctor() {
		this._super(1);
	},

	_filter: function _filter(cardsPoint, index) {
		if (cardsPoint[index].point == 13) {
			if (index + 1 < cardsPoint.length) {
				if (cardsPoint[index + 1].point == 14) {
					return true;
				}
			}
		}
		if (cardsPoint[index].point == 14) {
			if (cardsPoint[index - 1].point == 13) {
				return true;
			}
		}
		return false;
	}
});

//去重：三带一在有大于癞子牌时会有相同的结果项，三带二在有1张癞子、两个不同的对组合成的结果集中有重复的
ddz.existTester = cc.Class({
	_exist: {},

	reset: function reset() {
		this._exist = {};
	},

	// 动态参数，传入num数组
	isExist: function isExist() {
		var total = 0;
		for (var i = 0; i < arguments.length; i++) {
			for (var j = 0; j < arguments[i].length; j++) {
				total += arguments[i][j];
			}
		}
		var key = '' + total;
		if (this._exist[key]) {
			return true;
		}
		this._exist[key] = 1;
		return false;
	}
});

ddz.typeFinder = cc.Class({

	ctor: function ctor() {
		this._cardsByPoint = null; //手牌的权重数组

		//癞子数据样式
		//{"count":2,"point":15,"cards":[65,65]}
		//{"count":0,"point":-1,"cards":[]}
		this._lzCardsPoint = null; //癞子手牌信息

		this._singleFinder = new ddz.singleFinder();
		this._doubleFinder = new ddz.typeByNum(2);
		this._threeFinder = new ddz.typeByNum(3);
		this._bombFinder = new ddz.typeByNum(4);

		this._existTester = new ddz.existTester();
	},

	init: function init(cardsByPoint, lzCardsPoint) {
		this._cardsByPoint = cardsByPoint;
		this._lzCardsPoint = lzCardsPoint;
		cc.log('this._lzCardsPoint = ' + JSON.stringify(this._lzCardsPoint));
	},

	destroy: function destroy() {
		this._cardsByPoint = null;
		this._lzCardsPoint = null;
		this._existTester = null;
	},

	// 查找所有的牌型组合
	find: function find() {
		var result = [];
		if (!this._canWork()) {
			return result;
		}

		// 找单牌
		var singleRes = this._findSingle();
		result = result.concat(singleRes);
		if (result.length > 0) {
			return result;
		}

		//找对子
		var doubleCards = this._findDouble();
		var doubleCardsWithLz = this._findResByInitWithLz(2, singleRes);
		result = result.concat(doubleCards, doubleCardsWithLz);
		if (result.length > 0) {
			return result;
		}

		//找三张
		var threeCards = this._findThreeCards();
		var thrreCardsWithLz = this._findResByInitWithLz(3, singleRes, doubleCards);
		// result = result.concat(thrreCardsWithLz);
		// if (result.length > 0) {
		// 	return result;
		// }

		// 找三带一
		var threeWithOne = this._findThreeWithOne(singleRes, threeCards.concat(thrreCardsWithLz));
		result = result.concat(threeWithOne);
		if (result.length > 0) {
			return result;
		}

		// 找三带一对
		var threeWithDouble = this._findThreeWithDouble(doubleCards, threeCards.concat(thrreCardsWithLz));
		result = result.concat(threeWithDouble);
		if (result.length > 0) {
			return result;
		}

		//找飞机
		var plane = this._findPlane();
		// result = result.concat(plane);

		// 飞机带单张翅膀
		var planeWithSingle = this._findPlaneWithSingle(plane, singleRes);
		if (planeWithSingle.length > 1) {
			result = result.concat(planeWithSingle);
			return result;
		}

		//飞机带对子
		var planeWithDouble = this._findPlaneWithDouble(plane, doubleCards);
		result = result.concat(planeWithDouble);
		if (planeWithDouble.length > 0) {
			result = result.concat(planeWithDouble);
			return result;
		}

		if (plane.length > 0) {
			result = result.concat(plane);
			return result;
		}

		//找顺子
		var shunzi = this._findShunZi();
		result = result.concat(shunzi);
		if (result.length > 0) {
			return result;
		}

		// 找连对
		var continueDouble = this._findContinueDouble();
		result = result.concat(continueDouble);
		if (result.length > 0) {
			return result;
		}

		//找炸弹
		var bomb = this._findBomb();
		var bombWithLz = this._findResByInitWithLz(4, singleRes, doubleCards, threeCards);
		result = result.concat(bomb, bombWithLz);
		if (result.length > 0) {
			return result;
		}

		//找火箭
		var rocket = this._findRocket();
		result = result.concat(rocket);
		if (result.length > 0) {
			return result;
		}

		return result;
	},

	// 找单牌
	_findSingle: function _findSingle() {
		// var result = [];
		// var single = this._singleFinder.find(this._cardsByPoint);
		// var singleLz = this._singleFinder.find([this._lzCardsPoint]);
		// result = result.concat(single, singleLz);
		// return single;
		return this._singleFinder.find(this._cardsByPoint);
	},

	//找对子：从原始牌型中查找、从癞子中找、从单牌和癞子中的结合找
	_findDouble: function _findDouble() {
		var result = [];
		var doubleCards = this._doubleFinder.find(this._cardsByPoint);
		var doubleLzCards = this._doubleFinder.find([this._lzCardsPoint]);
		result = result.concat(doubleCards, doubleLzCards);
		return result;
	},

	/*
 	用于单牌和癞子凑对子、单牌和对子凑三张 ...
 	根据原始结果拼凑结果数据，使用的是动态参数
 	第一个参数是期望的牌的长度，第二、三个参数是初始结果集
 	弟一个参数是整数、弟二、三...是数组
 */
	_findResByInitWithLz: function _findResByInitWithLz() {
		var result = [];

		if (this._lzCardsPoint.count <= 0) {
			return result;
		}
		if (arguments.length < 2) {
			return result;
		}

		var dstCnt = arguments[0];
		var i = 0;

		// 拼接初始结果数据
		for (i = 1; i < arguments.length; i++) {
			var tmp = [];
			for (var j = 0; j < arguments[i].length; j++) {
				tmp.push(arguments[i][j].slice(0));
			}
			result = result.concat(tmp);
		}

		for (i = 0; i < result.length; i++) {

			var t = result[i];
			if (this._isOutOfAK(t)) {
				// 不去拼接包涵癞子、大小王的数
				result.splice(i, 1);

				i -= 1;
				continue;
			}

			var needLzCnt = dstCnt - result[i].length;
			if (needLzCnt > this._lzCardsPoint.count) {
				//癞子不够
				result.splice(i, 1);

				i -= 1;
				continue;
			}

			for (var j = 0; j < needLzCnt; j++) {
				result[i].push(this._lzCardsPoint.cards[j]);
			}
		}

		return result;
	},

	//找三张
	_findThreeCards: function _findThreeCards() {
		var result = [];
		var threeCards = this._threeFinder.find(this._cardsByPoint);
		var threeLzCards = this._threeFinder.find([this._lzCardsPoint]);
		result = result.concat(threeCards, threeLzCards);
		return result;
	},

	//找炸弹
	_findBomb: function _findBomb() {
		var result = [];
		var bomb = this._bombFinder.find(this._cardsByPoint);
		var bombLzCards = this._bombFinder.find([this._lzCardsPoint]);
		result = result.concat(bomb, bombLzCards);
		return result;
	},

	//找火箭
	_findRocket: function _findRocket() {
		var result = [];
		if (this._cardsByPoint.length < 2) {
			return result;
		}

		for (var i = 0; i < this._cardsByPoint.length; i++) {
			if (this._cardsByPoint[i].point == 13 || this._cardsByPoint[i].point == 14) {
				result.push(this._cardsByPoint[i].cards[0]);
			}
		}

		if (result.length < 2) {
			result = [];
		}

		return [result];
	},

	//找连队
	_findContinueDouble: function _findContinueDouble() {
		// 找连对
		var continueDouble = [];
		var tmpResult = [];
		var tmpArr = this._cardsByPoint;

		for (var i = 0; i < tmpArr.length; i++) {
			var t = tmpArr[i];
			if (t.point >= 12) {
				//2、小王、大王
				break;
			}
			if (t.count < 2) {
				if (tmpResult.length >= 6) {
					continueDouble.push(tmpResult);
				}
				tmpResult = [];
				continue;
			}
			if (tmpResult.length == 0) {
				tmpResult.push(t.cards[0]);
				tmpResult.push(t.cards[1]);
				continue;
			}

			// 比i-1组的point大于1，才可添加到数组中
			var prevCard = tmpArr[i - 1];
			if (t.point - prevCard.point != 1) {
				// 断了
				if (tmpResult.length >= 6) {
					continueDouble.push(tmpResult);
				}
				tmpResult = [];
				continue;
			}

			tmpResult.push(t.cards[0]);
			tmpResult.push(t.cards[1]);

			// if (tmpResult.length >= 6) {
			// 	var oneResult = tmpResult.slice(0);
			// 	continueDouble.push(oneResult);
			// }
		}

		if (tmpResult.length >= 6) {
			continueDouble.push(tmpResult);
		}
		return continueDouble;
	},

	//找仨带一个:从已有的单牌和三张结果中拼凑，单张中除去癞子牌，除去已包涵在三张中的
	_findThreeWithOne: function _findThreeWithOne(singleRes, threeRes) {
		var result = [];
		this._existTester.reset();
		for (var i = 0; i < threeRes.length; i++) {
			for (var j = 0; j < singleRes.length; j++) {
				if (this._isLz(singleRes[j][0]) || this._isHave(threeRes[i], singleRes[j][0])) {
					// 排除单张癞子
					continue;
				}
				if (this._existTester.isExist(threeRes[i], singleRes[j])) {
					continue;
				}

				var res = [];
				res.push(threeRes[i][0]);
				res.push(threeRes[i][1]);
				res.push(threeRes[i][2]);
				res.push(singleRes[j][0]);
				result.push(res);
			}
		}

		cc.log('threeWithOne result = ' + JSON.stringify(result));
		return result;
	},

	//找仨带一个对子，排除对子中包换癞子的牌，和三个中包涵对子牌的对子
	_findThreeWithDouble: function _findThreeWithDouble(doubleRes, threeRes) {
		var result = [];
		this._existTester.reset();
		for (var i = 0; i < threeRes.length; i++) {
			for (var j = 0; j < doubleRes.length; j++) {
				if (this._isLz(doubleRes[j][0]) || this._isLz(doubleRes[j][1])) {
					continue;
				}
				if (this._isHave(threeRes[i], doubleRes[j][0]) || this._isHave(threeRes[i], doubleRes[j][1])) {
					continue;
				}

				if (this._existTester.isExist(threeRes[i], doubleRes[j])) {
					continue;
				}

				var res = [];
				for (var k = 0; k < 3; k++) {
					res.push(threeRes[i][k]);
				}
				for (var l = 0; l < 2; l++) {
					res.push(doubleRes[j][l]);
				}
				result.push(res);
			}
		}

		cc.log('threeWithDouble result = ' + JSON.stringify(result));
		return result;
	},

	//找飞机：遍历数组point<12，且两个连续位置的牌数大于等于3
	_findPlane: function _findPlane() {
		var result = [];

		for (var i = 0; i < this._cardsByPoint.length - 1; i++) {
			var t = this._cardsByPoint[i];
			if (t.point >= 11) {
				continue;
			}
			var next = this._cardsByPoint[i + 1];
			if (next.point - t.point != 1) {
				continue;
			}
			if (t.count >= 3 && next.count >= 3) {
				var tmp = [];
				for (var j = 0; j < 3; j++) {
					tmp.push(t.cards[j]);
					tmp.push(next.cards[j]);
				}
				result.push(tmp);
				continue;
			}
			//加癞子的解
			var needLzCnt = 6 - ((t.count > 3 ? 3 : t.count) + (next.count > 3 ? 3 : next.count));
			if (needLzCnt > this._lzCardsPoint.count) {
				continue;
			}
			var tmp2 = [];
			for (var k = 0; k < (t.count > 3 ? 3 : t.count); k++) {
				tmp2.push(t.cards[k]);
			}
			for (var l = 0; l < (next.count > 3 ? 3 : next.count); l++) {
				tmp2.push(next.cards[l]);
			}
			for (var m = 0; m < needLzCnt; m++) {
				tmp2.push(this._lzCardsPoint.cards[m]);
			}
			result.push(tmp2);
		}

		ddz.LOGD(this._TAG, 'plane result = ' + JSON.stringify(result));
		return result;
	},

	// 查找飞机带翅膀：飞机中含有癞子牌，需要排除包含在飞机中的单牌
	_findPlaneWithSingle: function _findPlaneWithSingle(planeRes, singleRes) {
		var result = [];
		for (var i = 0; i < planeRes.length; i++) {
			var temp = planeRes[i].slice(0);
			for (var j = 0; j < singleRes.length - 1; j++) {
				if (this._isHave(planeRes[i], singleRes[j][0])) {
					continue;
				}
				temp.push(singleRes[j][0]);
				for (var k = j + 1; k < singleRes.length; k++) {
					if (this._isHave(planeRes[i], singleRes[k][0])) {
						continue;
					}
					temp.push(singleRes[k][0]);
					result.push(temp.slice(0));
					// 将单牌扔出去
					temp.pop();
				}
				// 将单牌扔出去
				temp.pop();
			}
		}

		ddz.LOGD(this._TAG, 'plane with single = ' + JSON.stringify(result));
		return result;
	},

	// 查找飞机带俩对
	_findPlaneWithDouble: function _findPlaneWithDouble(planeRes, doubleRes) {
		var result = [];
		for (var i = 0; i < planeRes.length; i++) {
			var temp = planeRes[i].slice(0);
			for (var j = 0; j < doubleRes.length - 1; j++) {
				if (this._isHave(planeRes[i], doubleRes[j][0]), this._isHave(planeRes[i], doubleRes[j][1])) {
					continue;
				}
				temp.push(doubleRes[j][0]);
				temp.push(doubleRes[j][1]);

				for (var k = j + 1; k < doubleRes.length; k++) {
					if (this._isHave(planeRes[i], doubleRes[k][0]) || this._isHave(planeRes[i], doubleRes[k][1])) {
						continue;
					}
					temp.push(doubleRes[k][0]);
					temp.push(doubleRes[k][1]);
					result.push(temp.slice(0));
					// 将对子扔出去
					temp.pop();
					temp.pop();
				}
				// 将对子扔出去
				temp.pop();
				temp.pop();
			}
		}
		ddz.LOGD(this._TAG, 'plane with double = ' + JSON.stringify(result));
		return result;
	},

	//查找顺子
	_findShunZi: function _findShunZi() {
		var result = [];
		var lzUsedYet = 0;
		if (this._cardsByPoint.length < 5) {
			return result;
		}
		var tmp = [];
		var curPutPoint = -2;
		for (var i = 0; i < this._cardsByPoint.length; i++) {
			var t = this._cardsByPoint[i];
			if (t.point >= 12) {
				if (tmp.length >= 5) {
					result.push(tmp.slice(0));
				}
				tmp = [];
				continue;
			}

			if (tmp.length <= 0) {
				//放入一个数
				lzUsedYet = 0;
				tmp.push(t.cards[0]);
				curPutPoint = t.point;
				continue;
			}

			//判读当前的value是否和tmp中的最后一个数的value是否是连续的
			if (t.point - curPutPoint == 1) {
				tmp.push(t.cards[0]);
				curPutPoint = t.point;
				continue;
			}

			//放癞子牌
			if (this._lzCardsPoint.count - lzUsedYet <= 0) {
				if (tmp.length >= 5) {
					result.push(tmp.slice(0));
				}
				tmp = [];
				i--;
				continue;
			}

			lzUsedYet += 1;
			curPutPoint += 1;
			tmp.push(this._lzCardsPoint.cards[0]);
			//放入癞子后重新检测
			i--;
		}

		if (tmp.length > 5) {
			result.push(tmp.slice(0));
		}

		ddz.LOGD(this._TAG, 'shunzi result = ' + JSON.stringify(result));

		return result;
	},

	// 一个数组中是否有癞子、王
	_isOutOfAK: function _isOutOfAK(src) {
		for (var i = 0; i < src.length; i++) {
			if (this._isLz(src[i]) || this._isKing(src[i])) {
				return true;
			}
		}

		return false;
	},

	//找对子和癞子凑三张
	_isLz: function _isLz(num) {
		return num > 53;
	},

	_isKing: function _isKing(num) {
		return num == 52 || num == 53;
	},

	_isHave: function _isHave(src, num) {
		for (var i = 0; i < src.length; i++) {
			if (src[i] == num) {
				return true;
			}
		}

		return false;
	},

	_canWork: function _canWork() {
		if (!this._cardsByPoint || !this._lzCardsPoint) {
			return false;
		}
		return true;
	}

});

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
        //# sourceMappingURL=ddzsingle_robot_type_finder.js.map
        