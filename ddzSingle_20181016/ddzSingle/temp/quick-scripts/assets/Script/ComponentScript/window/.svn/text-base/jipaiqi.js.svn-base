(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/jipaiqi.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd2781+4FuRPUaKGfRHZttnh', 'jipaiqi', __filename);
// Script/ComponentScript/window/jipaiqi.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        poker_num_1: cc.Label,
        poker_num_2: cc.Label,
        poker_num_3: cc.Label,
        poker_num_4: cc.Label,
        poker_num_5: cc.Label,
        poker_num_6: cc.Label,
        poker_num_7: cc.Label,
        poker_num_8: cc.Label,
        poker_num_9: cc.Label,
        poker_num_10: cc.Label,
        poker_num_11: cc.Label,
        poker_num_12: cc.Label,
        poker_num_13: cc.Label,
        poker_num_14: cc.Label,
        poker_num_15: cc.Label,

        jipaiqi_num: cc.Label,
        bg: cc.Node,
        xiaopai: cc.Node
    },

    onLoad: function onLoad() {
        this.bg.active = false;
        this.xiaopai.active = false;

        ty.NotificationCenter.listen(ddz.EventType.OPEN_JIPAIJI, this.onOpenJipaiQi, this);
        ty.NotificationCenter.listen(ddz.EventType.CLOSE_JIPAIJI, this.onCloseJipaiQi, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.onRemoveAni, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_CARD_NOTE, this.updateCardNote, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_JIPAIQI, this.updateGetReward, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.updateShareState, this);
        this.jipaiqi_num.string = hall.ME.udataInfo.jiPaiQiCount;
    },

    updateShareState: function updateShareState(shareType) {
        if (shareType == ddz.Share.onShareType.clickStatShareTypeShareJiPaiQi) {
            this.onOpenJipaiQi();
        }
    },

    setPlayController: function setPlayController(val) {
        this._playController = val;
    },

    updateGetReward: function updateGetReward() {
        this.jipaiqi_num.string = hall.ME.udataInfo.jiPaiQiCount;
    },

    onOpenJipaiQi: function onOpenJipaiQi() {
        var nums = this.refresh();
        var cardNote = nums;
        if (cardNote.length && cardNote.length > 0) {
            // for (var i = 0; i < cardNote.length; i++){
            //     this['poker_num_' + (i+1)].string = cardNote[i] || 0;
            // }
            for (var i = 0; i < 15; i++) {
                this['poker_num_' + (i + 1)].string = cardNote[i] || 0;
            }
        } else {
            this.onCloseJipaiQi();
            return;
        }

        if (!this.bg.active) {
            this.bg.active = true;
            this.xiaopai.active = true;
            var ani = this.node.getComponent(cc.Animation);
            var anim = ani.getAnimationState('jipaiqi');
            anim.once("finished", function () {});
            anim.play();
            // if (hall.sxAdManager) {
            //     hall.sxAdManager.hide();
            // }
        }

        // hall.adManager.canShowTableBanner = false;
        // hall.adManager.canShowTableTopBanner = false;
        // // hall.adManager.destroyBannerAd();
        // hall.adManager.destroyWidthBannerAd();
    },

    onCloseJipaiQi: function onCloseJipaiQi() {
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('shouhui');
        var that = this;
        if (that.bg.active) {
            anim.once("finished", function () {
                that.bg.active = false;
                that.xiaopai.active = false;
                // ty.NotificationCenter.trigger(ddz.EventType.OPEN_DIVERSION);
            });
            anim.play();
        }
    },

    updateCardNote: function updateCardNote() {
        var data = this.refresh();
        if (data.length && data.length > 0) {
            // for (var i = 0; i < data.length; i++){
            //     if (this['poker_num_' + (i+1)]) {
            //         this['poker_num_' + (i+1)].string = data[i] || 0;
            //     }
            // }
            for (var i = 0; i < 15; i++) {
                if (this['poker_num_' + (i + 1)]) {
                    this['poker_num_' + (i + 1)].string = data[i] || 0;
                }
            }
        } else {
            this.onCloseJipaiQi();
        }
    },

    refresh: function refresh(ignoreDipai) {
        if (this._playController.isStatus(ddz.Enums.PlayStatus.PLAY_STATUS_PREPARE)) {
            return;
        }

        // 开始刷数据
        var nums = [];
        if (this._playController.isErdou()) {
            // 二斗也显示记牌器
            var top_cards = this._playController._topSeatinfo.model.m_card;
            for (var i = 0; i < top_cards.length; i++) {
                var p = ddz.GlobalFuncs.numberToPoint(top_cards[i]);
                if (nums[p]) {
                    nums[p] += 1;
                } else {
                    nums[p] = 1;
                }
            }

            // var kickOut_cards = this._playController._erDouCardInfo.getKickOutCard();
            // for(var i = 0;i < kickOut_cards.length;i++){
            //     var p = ddz.GlobalFuncs.numberToValue(kickOut_cards[i]) - 1;
            //     if (nums[p]) {
            //         nums[p] += 1;
            //     } else {
            //         nums[p] = 1;
            //     }
            // }
        } else {
            var left_cards = this._playController._leftSeatinfo.model.m_card;
            for (var i = 0; i < left_cards.length; i++) {
                var p = ddz.GlobalFuncs.numberToPoint(left_cards[i]);
                if (nums[p]) {
                    nums[p] += 1;
                } else {
                    nums[p] = 1;
                }
            }

            var right_cards = this._playController._rightSeatinfo.model.m_card;

            for (var i = 0; i < right_cards.length; i++) {
                var p = ddz.GlobalFuncs.numberToPoint(right_cards[i]);
                if (nums[p]) {
                    nums[p] += 1;
                } else {
                    nums[p] = 1;
                }
            }
        }
        if (this._playController._status != ddz.Enums.PlayStatus.PLAY_STATUS_PLAYING && !ignoreDipai) {
            //底牌还没加入玩家手牌的时候，需要算上。进入playing状态后，底牌已经加入玩家手牌，不需要计算
            var extra = this._playController._extraCards;
            for (var i = 0; i < extra.length; i++) {
                var p = extra[i]._info._point;
                if (nums[p]) {
                    nums[p] += 1;
                } else {
                    nums[p] = 1;
                }
            }
        }
        ddz.LOGD("", "file = [jipaiqi] fun = [refresh] nums = " + JSON.stringify(nums));
        return nums;
        // 开始刷界面
        // this._setLabel("label0", nums[14]);
        // this._setLabel("label1", nums[13]);
        // this._setLabel("label2", nums[1]);
        // this._setLabel("label3", nums[0]);
        // for (var i = 4; i < 15; i++) { //i=14, nums[2] //i = 4, num[12]
        // 	this._setLabel("label" + i, nums[16 - i]);
        // }
    },

    onClickButton: function onClickButton() {
        ddz.isClickJiPaiQi = true;
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["jipaiqi", "click"]);

        if (this.bg.active) {
            hall.MsgBoxManager.showToast({ "title": "当前已使用~" });
        } else {
            var _config = ddz.gameConfig.getShareVideoConfigToCity();
            if (_config && _config["jiPaiQi"].type == "share") {
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeShareJiPaiQi);
            }
        }
        // ty.NotificationCenter.trigger(ddz.EventType.USE_NEW_CARD_NOTE);
    },

    onRemoveAni: function onRemoveAni() {
        var ani = this.node.getComponent(cc.Animation);
        ani.stop();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
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
        //# sourceMappingURL=jipaiqi.js.map
        