(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/jipaiqi.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4d206H895FF4ZHRQ/uZjvqQ', 'jipaiqi', __filename);
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
        this.jipaiqi_num.string = hall.ME.udataInfo.jiPaiQiCount;
    },

    updateGetReward: function updateGetReward() {
        this.jipaiqi_num.string = hall.ME.udataInfo.jiPaiQiCount;
    },

    onOpenJipaiQi: function onOpenJipaiQi(data) {
        var cardNote = data.myCardNote;
        if (cardNote.length && cardNote.length > 0) {
            for (var i = 0; i < cardNote.length; i++) {
                this['poker_num_' + (i + 1)].string = cardNote[i];
            }
        } else {
            this.onCloseJipaiQi();
            return;
        }

        this.jipaiqi_num.string = data.num;

        if (!this.bg.active) {
            this.bg.active = true;
            this.xiaopai.active = true;
            var ani = this.node.getComponent(cc.Animation);
            var anim = ani.getAnimationState('jipaiqi');
            anim.once("finished", function () {});
            anim.play();
            if (hall.sxAdManager) {
                hall.sxAdManager.hide();
            }
        }

        hall.adManager.canShowTableBanner = false;
        hall.adManager.canShowTableTopBanner = false;
        // hall.adManager.destroyBannerAd();
        hall.adManager.destroyWidthBannerAd();
    },

    onCloseJipaiQi: function onCloseJipaiQi() {
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('shouhui');
        var that = this;
        anim.once("finished", function () {
            that.bg.active = false;
            that.xiaopai.active = false;
            ty.NotificationCenter.trigger(ddz.EventType.OPEN_DIVERSION);
        });
        anim.play();
    },

    updateCardNote: function updateCardNote(data) {
        if (data.length && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (this['poker_num_' + (i + 1)]) {
                    this['poker_num_' + (i + 1)].string = data[i];
                }
            }
        }
    },

    onClickButton: function onClickButton() {
        ddz.isClickJiPaiQi = true;
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["jipaiqi", "click"]);
        if (ddz.gameModel.firstUseJiPaiQiPoint > 0) {
            // 首次得记牌器
            ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstUseJiPaiQi);
        } else {
            ty.NotificationCenter.trigger(ddz.EventType.USE_NEW_CARD_NOTE);
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
        