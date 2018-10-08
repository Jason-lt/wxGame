(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/models/CardType.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'eb06eHmaKZBRJrnaXuNRYda', 'CardType', __filename);
// Script/ddz/models/CardType.js

"use strict";

/**
 * 牌型
 */
ddz.CardType = cc.Class({

	/**
  * 因为Creator 不允许在构造里写参数,所有这里保留了参数说明,在创建对像的时候还是按这个顺序传参
  * @param type 牌型
  * @param point 主牌型的点数
  * @param count 牌的数目
  * @param cards 手牌
     * @param laiZiCnt 癞子牌的个数
     */
	ctor: function ctor() {

		this._type = arguments[0];
		this._point = arguments[1];
		this._count = arguments[2];
		this._cards = arguments[3];
		this._laiZiCnt = arguments[4];
	},

	setType: function setType(type) {
		this._type = type;
	},

	setPoint: function setPoint(point) {
		this._point = point;
	},

	setCount: function setCount(count) {
		this._count = count;
	},

	getType: function getType() {
		return this._type;
	},

	getPoint: function getPoint() {
		return this._point;
	},

	getCount: function getCount() {
		return this._count;
	},

	getCards: function getCards() {
		return this._cards;
	},

	setLaiziCnt: function setLaiziCnt(cnt) {
		this._laiZiCnt = cnt;
	},

	getLaiziCnt: function getLaiziCnt() {
		return this._laiZiCnt;
	},

	dump: function dump() {
		ddz.LOGD(null, "card type " + this._type + " point : " + this._point + " count : " + this._count);
		for (var i = 0; i < this._cards.length; i++) {
			ddz.LOGD(null, this._cards[i]);
		}
	},

	// 获取炸弹类型
	// 'pureLzBomb',	//纯癞子炸弹，大于普通炸弹小于王炸
	// 'normalBomb',	//普通炸弹，大于癞子炸弹
	// 'softBomb',		//软炸弹，小于普通炸弹，大于其他牌
	// 'notBomb'		//不是炸弹
	_getBombType: function _getBombType() {
		// 不是4张，不可能是炸弹
		if (this._cards.length != 4) {
			return 'notBomb';
		}

		// 牌型
		var t_type = this.getType();
		// 是炸弹
		if (t_type == ddz.Enums.PaixingType.BOMB_CARD) {
			/************
    * 统计炸弹中的癞子牌数量
    * 这里的逻辑很骚
    * 对topCard，构造对象前，癞子牌已经转化为实际牌大小
    * 对自己选中的牌，构造对象前，癞子牌的point还是癞子值
    */
			var lzCnt = 0;
			for (var nIndex = 0; nIndex < 4; nIndex++) {
				//如果有任何一张是癞子牌凑的
				if (this._cards[nIndex] > 53) {
					lzCnt++;
				}
			}
			if (lzCnt < this._laiZiCnt) {
				lzCnt = this._laiZiCnt;
			}
			//根据癞子牌数量判断炸弹类型

			//常规炸弹
			if (lzCnt == 0) {
				return 'normalBomb';
			}
			// 纯癞子炸弹
			if (lzCnt == 4) {
				return 'pureLzBomb';
			}
			//软蛋
			if (lzCnt > 0 && lzCnt < 4) {
				return 'softBomb';
			}
		}
		//不是炸弹
		else {
				return 'notBomb';
			}
	},

	/**
  * this._type - 当前手牌
  * ct，待比较的牌
  */
	isLargerThan: function isLargerThan(ct) {
		var type1 = ct.getType();
		if (this._type == ddz.Enums.PaixingType.ERROR_CARD || type1 == ddz.Enums.PaixingType.ERROR_CARD) {
			//其实不是很有必要，如果牌型错误，其他地方也没办法正常运行而报错
			ddz.LOGD(null, "error!!!!!!!! error card type in isLargerThan in cardtype.js");
		}

		// 先判断火箭
		if (this._type == ddz.Enums.PaixingType.ROCKET) {
			return true;
		}

		if (type1 == ddz.Enums.PaixingType.ROCKET) {
			return false;
		}

		// 相同牌型
		if (this._type == type1) {
			/**
    * 炸弹牌型单独比较
    * 纯癞子炸弹 > 普通炸弹 > 癞子炸弹
    */
			if (type1 == ddz.Enums.PaixingType.BOMB_CARD) {
				// 纯癞子炸弹最大
				var bombType = this._getBombType();
				ddz.LOGD(null, 'this._type bombType=' + bombType);
				if (bombType == 'pureLzBomb') {
					return true;
				}

				var ctBombType = ct._getBombType();
				ddz.LOGD(null, 'compareType bombType=' + ctBombType);
				if (ctBombType == 'pureLzBomb') {
					return false;
				}

				// 普通炸弹大于癞子炸弹
				if (bombType == 'normalBomb' && ctBombType == 'softBomb') {
					return true;
				}

				if (bombType == 'softBomb' && ctBombType == 'normalBomb') {
					return false;
				}
			}

			return this._count == ct.getCount() && this._point > ct.getPoint();
		}

		// 炸弹管其他所有，如果都是炸弹，会在上面return
		if (this._type == ddz.Enums.PaixingType.BOMB_CARD) {
			return true;
		}

		return false;
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
        //# sourceMappingURL=CardType.js.map
        