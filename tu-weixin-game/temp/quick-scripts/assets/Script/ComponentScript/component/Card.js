(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/Card.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '43603eR6gRGr7+6D/f4B/jM', 'Card', __filename);
// Script/ComponentScript/component/Card.js

"use strict";

/**
 * 扑克牌，手牌
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._info = new ddz.CardInfo();
        //红色数字的牌类型
        this._redNumTypes = [ddz.Enums.CardColor.CARD_COLOR_HONGTAO, ddz.Enums.CardColor.CARD_COLOR_FANGPIAN];
        this._oldP = null;
        this._moveTime = 0.05;
    },

    properties: {

        tagSprites: [cc.SpriteFrame],

        numBlackSprites: [cc.SpriteFrame],

        numRedSprites: [cc.SpriteFrame],

        numGoldenSprites: [//癞子牌的数字
        cc.SpriteFrame],

        numJokSprites: [cc.SpriteFrame],

        laiziSmallTag: cc.SpriteFrame, //癞子牌的小花

        foreBack: {
            default: null,
            type: cc.Sprite
        },
        cardNum: {
            default: null,
            type: cc.Sprite
        },
        cardNumJok: {
            default: null,
            type: cc.Sprite
        },
        tagSmall: {
            default: null,
            type: cc.Sprite
        },
        tagBig: {
            default: null,
            type: cc.Sprite
        },
        dizhuTag: {
            default: null,
            type: cc.Sprite
        },
        cardMask: {
            default: null,
            type: cc.Sprite
        },
        cardType: 1
    },

    /**
     * 设置地主角标
     * @param value true or false
     */
    setDiZhuTag: function setDiZhuTag(value) {
        if (this.cardType == ddz.Enums.CardSize.CARD_SIZE_BIG) {
            this.dizhuTag.setVisible(value);
        }
    },

    resetWithNum: function resetWithNum(num) {
        this._info.refreshInfoFromNum(num);
        //设置点数
        var numArr = this._redNumTypes.indexOf(this._info._color) > -1 ? this.numRedSprites : this.numBlackSprites;
        if (this._info._type == ddz.Enums.CardType.CARD_TYPE_NORMAL) {
            //非王牌
            this.cardNum.setVisible(true);
            this.tagSmall.setVisible(true);
            this.cardNumJok.setVisible(false);
            this.cardNum.spriteFrame = numArr[this._info._point];
        } else if (this._info._type == ddz.Enums.CardType.CARD_TYPE_KING) {
            this.cardNum.setVisible(false);
            this.tagSmall.setVisible(false);
            this.cardNumJok.setVisible(true);
            this.cardNumJok.spriteFrame = this._info._point == 13 ? this.numJokSprites[1] : this.numJokSprites[0];
        } else if (this._info._type == ddz.Enums.CardType.CARD_TYPE_LAIZI) {
            this.cardNum.setVisible(true);
            this.tagSmall.setVisible(true);
            this.cardNumJok.setVisible(false);
            this.cardNum.spriteFrame = this.numGoldenSprites[this._info._point];
        }

        //设置花
        var tagSpriteFrame, smallSpriteFrame;
        if (this._info._type == ddz.Enums.CardType.CARD_TYPE_NORMAL) {
            //正常牌
            tagSpriteFrame = this.tagSprites[this._info._color - 1];
            smallSpriteFrame = tagSpriteFrame;
        } else if (this._info._type == ddz.Enums.CardType.CARD_TYPE_KING) {
            //王牌
            tagSpriteFrame = this._info._point == 13 ? this.tagSprites[5] : this.tagSprites[4];
            smallSpriteFrame = tagSpriteFrame;
        } else if (this._info._type == ddz.Enums.CardType.CARD_TYPE_LAIZI) {
            //癞子
            tagSpriteFrame = this.tagSprites[6];
            smallSpriteFrame = this.laiziSmallTag;
        }

        this.tagSmall.spriteFrame = smallSpriteFrame;
        if (this.cardType == ddz.Enums.CardSize.CARD_SIZE_BIG && this.tagBig) {
            this.tagBig.spriteFrame = tagSpriteFrame;
        }
    },

    up: function up() {
        //有问题:this._oldP不存在
        if (!this._oldP) return;
        var toY = this._oldP.y + this.node.height * 0.1;
        var toX = this.node.x;
        // this.node.y = this._oldP.y + this.node.height * 0.1;
        var acMove = cc.moveTo(this._moveTime, cc.p(toX, toY));
        this.node.stopAllActions();
        this.node.runAction(acMove);
    },

    down: function down(withOutAni) {
        if (arguments.length == 0) {
            withOutAni = false;
        }
        // this.node.y = this._oldP.y;
        this.node.stopAllActions();
        if (!this._oldP) return;
        if (withOutAni) {
            this.node.y = this._oldP.y;
        } else {
            var acMove = cc.moveTo(this._moveTime, cc.p(this.node.x, this._oldP.y));
            this.node.runAction(acMove);
        }
    },

    setPosition: function setPosition(value) {
        this.setOldPosition(value);
        this.node.setPosition(value);
    },

    setOldPosition: function setOldPosition(value) {
        this._oldP = value;
    },

    setZIndex: function setZIndex(value) {
        this.node.zIndex = value;
    },

    /**
     * 是否是王
     * @param num
     * @returns {boolean}
     * @private
     */
    _isking: function _isking(num) {
        return num == 52 || num == 53;
    },

    /**
     * 是否是癞子点
     * @param num
     * @returns {boolean}
     * @private
     */
    _isLaizi: function _isLaizi(num) {
        return num > 53;
    },

    /**
     * 显示半透明遮罩
     * @param bVisible
     */
    showMask: function showMask(bVisible) {
        if (this.cardType == ddz.Enums.CardSize.CARD_SIZE_BIG) {
            this.cardMask.setVisible(bVisible);
        }
    },

    showTag: function showTag(value) {
        this.tagBig.setVisible(value);
    },

    dump: function dump() {
        this._info.dump();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},

    start: function start() {},
    onDestroy: function onDestroy() {}

    // update (dt) {},
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
        //# sourceMappingURL=Card.js.map
        