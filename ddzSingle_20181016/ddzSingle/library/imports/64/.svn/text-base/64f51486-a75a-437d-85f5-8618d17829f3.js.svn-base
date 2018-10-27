"use strict";
cc._RF.push(module, '64f51SGp1pDfYX1hhjReCnz', 'CardInfo');
// Script/ddz/models/CardInfo.js

"use strict";

/**
 * 牌的信息
 */
ddz.CardInfo = cc.Class({
	ctor: function ctor() {
		this._TAG = "ddz.CardInfo";
		this._color = ddz.Enums.CardColor.CARD_COLOR_HONGTAO;
		this._type = ddz.Enums.CardType.CARD_TYPE_NORMAL;
		this._point = 0; //A=0...J=10,Q=11,K=12, 小王13，大王14
		this._value = -1; //权重，从3到K依次为0-10，A=11，2=12，王为13，14，癞子15
		this._number = -1; // 0 - 51, 52小王， 53大王 54-66癞子A ， 2， 3 - K
		this._tag = ddz.CardInfoTag;
		ddz.CardInfoTag++;
	},
	//根据传进来的num，计算这张牌的，花色，点数,大小
	refreshInfoFromNum: function refreshInfoFromNum(num) {
		this._number = num;
		this._color = Math.floor(num / 13) + 1;
		this._point = ddz.GlobalFuncs.numberToPoint(num);
		this._value = ddz.GlobalFuncs.numberToValue(num);

		//确定type
		this._type = ddz.Enums.CardType.CARD_TYPE_NORMAL;

		if (num == 52 || num == 53) {
			this._type = ddz.Enums.CardType.CARD_TYPE_KING;
		}
		if (num > 53) {
			// 癞子牌
			this._type = ddz.Enums.CardType.CARD_TYPE_LAIZI;
		}
	},

	dump: function dump() {
		ddz.LOGD(this._TAG, "color : " + this._color);
		ddz.LOGD(this._TAG, "type : " + this._type);
		ddz.LOGD(this._TAG, "point: " + this._point);
		ddz.LOGD(this._TAG, "value : " + this._value);
		ddz.LOGD(this._TAG, "number : " + this._number);
	}
});

cc._RF.pop();