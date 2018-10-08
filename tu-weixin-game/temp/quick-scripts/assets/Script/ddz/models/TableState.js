(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/models/TableState.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ce6bc576LlDAKgtLD7aBCu3', 'TableState', __filename);
// Script/ddz/models/TableState.js

"use strict";

// Create by Zhanghaibin
// 桌子状态
ddz._TableState = cc.Class({

    ctor: function ctor() {
        // 普通信息
        this.normalInfo = {
            m_state: ddz.Enums.TableState.TABLEDSTAT_IDLE, //桌子当前状态
            m_matchpcnt: 0, //已进行的局数，只用于比赛场。
            m_nowop: 0, //当前操作玩家
            m_banker: 0, //当前庄家
            m_ccrc: 0, //出牌序列校验
            m_dizhu: 0, //地主的座位号
            m_topseat: 0, // 上次出牌的ID
            m_call: -1, //叫的倍数
            m_bomb: 0, //炸弹次数，用于算分加倍
            m_chuntian: 0, //春天
            m_show: 1, //明牌倍数
            m_super: 1, //超级加倍
            m_bcmulti: 1, //底牌加倍
            m_cardLaizi: -1, // 癞子的点数， 对应card_info里面的point - 1
            m_grabCard: -1, //二斗明牌id
            m_rangpaiMulti: -1, //二斗让牌加倍方式（1为加1，2为乘2）
            m_rangpai: 0, //二斗让牌个数
            m_kickoutCard: []
        };
        // 对象信息
        this.objectInfo = {
            m_baseCard: [], //三张底牌，长度为3
            m_topCard: [] //最后出的牌，用于校验，长度为20
        };
        this.m_laiziNumber = -1;
        this.m_bUpdatebcMulti = false;
        hall.LOGD(null, "ctor in new ddz._TableState");
    },

    setLaizi: function setLaizi(lz_point) {
        hall.LOGD(null, "in table state, set lz value " + lz_point);
        this.normalInfo.m_cardLaizi = lz_point;
        this.m_laiziNumber = ddz.GlobalFuncs.getLaiziNumByPoint(lz_point);
    },

    destroy: function destroy() {
        this.normalInfo = null;
        this.objectInfo = null;
        hall.LOGD(null, "destroy in ddz._TableState");
    },

    parseTableState: function parseTableState(result) {
        if (!result) {
            return;
        }
        var tmp = this.normalInfo;
        // 先存储一下之前的状态
        //叫的倍数
        var oldCall = tmp.m_call;
        //炸弹倍数
        var oldBomb = tmp.m_bomb;
        //明牌倍数
        var oldShow = tmp.m_show;
        //超级加倍
        var oldSuper = tmp.m_super;
        //底牌加倍
        var oldbcmulti = tmp.m_bcmulti;

        //更新其他信息
        tmp.m_state = result["state"];
        tmp.m_nowop = result["nowop"];
        tmp.m_ccrc = result["ccrc"];
        tmp.m_dizhu = result["dizhu"];
        tmp.m_topseat = result["topseat"];
        tmp.m_call = result["call"];
        tmp.m_bomb = result["bomb"];
        tmp.m_show = result["show"];
        tmp.m_super = result["super"];
        tmp.m_bcmulti = result["bcmulti"];
        tmp.m_chuntian = result["chuntian"];
        tmp.m_grabCard = result["grabCard"];
        tmp.m_rangpaiMulti = result["rangpaiMulti"];
        tmp.m_rangpai = result["rangpai"];
        if (tmp.m_bcmulti != oldbcmulti) {
            this.m_bUpdatebcMulti = true;
        }
        tmp.m_kickoutCard = result["kickoutCard"] || [];
        ////////////////////////////////////////////////////////////////////更新倍数
        //叫地主和抢地主倍数

        var anim, updateMulti, params;
        if (tmp.m_call != oldCall && tmp.m_call >= 1) {
            anim = true;
            updateMulti = true;
            params = [anim, updateMulti];
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MULTI, params);
        }
        if (tmp.m_bomb != oldBomb) {
            hall.LOGD(null, "倍数改变 炸弹");
            anim = true;
            updateMulti = true;
            params = [anim, updateMulti];
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MULTI, params);
        }
        if (tmp.m_show != oldShow) {
            hall.LOGD(null, "倍数改变 明牌");
            anim = true;
            updateMulti = true;
            params = [anim, updateMulti];
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MULTI, params);
        }
        if (tmp.m_super != oldSuper) {
            hall.LOGD(null, "倍数改变 超级加倍");
            anim = true;
            updateMulti = true;
            params = [anim, updateMulti];
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MULTI, params);
        }
        if (this.m_bUpdatebcMulti == true && tmp.m_state == ddz.Enums.TableState.TABLEDSTAT_PLAYING) {
            hall.LOGD(null, "倍数改变 底牌加倍");
            anim = true;
            updateMulti = true;
            params = [anim, updateMulti];
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MULTI, params);
        }

        // 设置癞子牌点数
        if (result.hasOwnProperty("wildcard")) {
            this.setLaizi(result["wildcard"]);
        }
        //三张底牌，长度为3     //用不上，暂时不管
        if (result.hasOwnProperty("basecard")) {
            this.objectInfo.m_baseCard = result["basecard"];
        }
        //上把所出的牌
        if (result.hasOwnProperty("topcard")) {
            this.objectInfo.m_topCard = result["topcard"];
        }
        hall.LOGD(null, "parseTableState in ddz._TableState");
    },

    Reset: function Reset() {
        var tmp = this.normalInfo;
        tmp.m_state = ddz.Enums.TableState.TABLEDSTAT_IDLE;
        tmp.m_matchpcnt = 0;
        tmp.m_nowop = 0;
        tmp.m_banker = 0;
        tmp.m_ccrc = 0;
        tmp.m_dizhu = -1;
        tmp.m_topseat = 0;
        tmp.m_call = -1;
        tmp.m_bomb = 0;
        tmp.m_chuntian = 1;
        tmp.m_show = 1;
        tmp.m_super = 1;
        tmp.m_bcmulti = 1;
        tmp.m_grabCard = -1;
        tmp.m_rangpaiMulti = -1;
        tmp.m_rangpai = 0;

        tmp.m_cardLaizi = -1;
        this.objectInfo.m_baseCard = [];
        this.objectInfo.m_topCard = [];
        this.m_laiziNumber = -1;
        hall.LOGD(null, "Reset in ddz._TableState");
    },

    calcMulti: function calcMulti() {
        var multi = 1;
        var info = this.normalInfo;
        //叫分
        multi *= info.m_call;

        //底牌
        var dipai = info.m_bcmulti;
        if (dipai > 1) {
            multi *= dipai;
        }

        //明牌
        var mingpai = info.m_show;
        if (mingpai > 1) {
            multi *= 2;
        }

        //炸弹
        var zhadan = info.m_bomb;
        var b;
        if (zhadan >= 1) {
            b = Math.pow(2, zhadan);
            multi *= b;
        }

        //春天
        var chuntian = info.m_chuntian;
        if (chuntian > 1) {
            multi *= chuntian;
        }

        return multi;
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
        //# sourceMappingURL=TableState.js.map
        