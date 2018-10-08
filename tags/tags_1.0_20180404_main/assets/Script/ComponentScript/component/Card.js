/**
 * 扑克牌，手牌
 */
cc.Class({
    extends: cc.Component,
    ctor:function () {
        this._info = new ddz.CardInfo();
        //红色数字的牌类型
        this._redNumTypes = [ddz.Enums.CardColor.CARD_COLOR_HONGTAO, ddz.Enums.CardColor.CARD_COLOR_FANGPIAN];
        this._oldP = null;
        this._moveTime = 0.05;
    },

    properties: {

        tagSprites : [
            cc.SpriteFrame
        ],

        numBlackSprites : [
            cc.SpriteFrame
        ],

        numRedSprites : [
            cc.SpriteFrame
        ],

        numJokSprites : [
            cc.SpriteFrame
        ],

        foreBack : {
            default : null,
            type : cc.Sprite
        },
        cardNum : {
            default : null,
            type : cc.Sprite
        },
        cardNumJok : {
            default : null,
            type : cc.Sprite
        },
        tagSmall : {
            default : null,
            type : cc.Sprite
        },
        tagBig : {
            default : null,
            type : cc.Sprite
        },
        dizhuTag : {
            default : null,
            type : cc.Sprite
        },
        cardMask : {
            default : null,
            type : cc.Sprite
        },
        cardType : 1
    },

    /**
     * 设置地主角标
     * @param value true or false
     */
    setDiZhuTag : function(value) {
        if (this.cardType == ddz.Enums.CardSize.CARD_SIZE_BIG) {
            this.dizhuTag.setVisible(value);
        }
    },

    resetWithNum: function(num) {
        this._info.refreshInfoFromNum(num);
        //设置点数
        var numArr = this._redNumTypes.indexOf(this._info._color) > -1 ? this.numRedSprites : this.numBlackSprites;
        if (this._info._point < 14){
            //非王牌
            this.cardNum.setVisible(true);
            this.tagSmall.setVisible(true);
            this.cardNumJok.setVisible(false);
            this.cardNum.spriteFrame = numArr[this._info._point-1];
        }
        else{
            this.cardNum.setVisible(false);
            this.tagSmall.setVisible(false);
            this.cardNumJok.setVisible(true);
            this.cardNumJok.spriteFrame = this._info._point == 14 ? this.numJokSprites[1] : this.numJokSprites[0];
        }

        //设置花
        var tagSpriteFrame;
        if (this._info._point < 14){
            //正常牌
            tagSpriteFrame = this.tagSprites[this._info._color - 1];
        }
        else if (this._info._point >= 14 && this._info._point <= 15){
            //王牌
            tagSpriteFrame = this._info._point == 14 ? this.tagSprites[5] : this.tagSprites[4];
        }
        else{
            //癞子暂时不作
        }

        this.tagSmall.spriteFrame = tagSpriteFrame;
        if (this.cardType == ddz.Enums.CardSize.CARD_SIZE_BIG){
            this.tagBig.spriteFrame = tagSpriteFrame;
        }

    },

    up:function () {
        var toY = this._oldP.y + this.node.height * 0.1;
        var toX = this.node.x;
        // this.node.y = this._oldP.y + this.node.height * 0.1;
        var acMove = cc.moveTo(this._moveTime, cc.p(toX, toY));
        this.node.stopAllActions();
        this.node.runAction(acMove);
    },

    down:function (withOutAni) {
        // this.node.y = this._oldP.y;
        var acMove = cc.moveTo(this._moveTime, cc.p(this.node.x, this._oldP.y));
        this.node.stopAllActions();
        if (withOutAni){
            this.node.y = this._oldP.y;
        }
        else{
            this.node.runAction(acMove);
        }
    },

    setPosition:function (value) {
        this.setOldPosition(value);
        this.node.setPosition(value);
    },

    setOldPosition:function (value) {
        this._oldP = value;
    },

    setZIndex:function (value) {
        this.node.zIndex = value;
    },

    /**
     * 是否是王
     * @param num
     * @returns {boolean}
     * @private
     */
    _isking: function(num) {
        return num == 52 || num == 53;
    },

    /**
     * 是否是癞子点
     * @param num
     * @returns {boolean}
     * @private
     */
    _isLaizi: function(num) {
        return num > 53;
    },

    /**
     * 显示半透明遮罩
     * @param bVisible
     */
    showMask: function(bVisible) {
        if (this.cardType == ddz.Enums.CardSize.CARD_SIZE_BIG) {
            this.cardMask.setVisible(bVisible);
        }
    },

    showTag:function (value) {
        this.tagBig.setVisible(value);
    },

    dump : function() {
        this._info.dump();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {},

    start : function () {
    },
    onDestroy : function () {

    }

    // update (dt) {},
});
