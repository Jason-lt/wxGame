(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/StoreItemInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '82589EgrxZLhrN6FK4UGGeM', 'StoreItemInfo', __filename);
// Script/hall/models/StoreItemInfo.js

"use strict";

// modifyed by qizhibin
// 商店列表项数据结构（购买金币，购买道具，快速购买）
hall.StoreItemInfo = cc.Class({
    //name,price,pic,discount,tag,nameurl,id,priceurl,desc
    //name,price,pic,discount,tag,nameurl,id,priceurl,desc,price_diamond,buy_type
    ctor: function ctor() {

        this._TAG = "hall.StoreItemInfo";
        this.m_name = ""; // 商品名称（"20000金币"）
        this.m_price = ""; // 价格（"钻100"）
        this.m_pic = ""; // 图片路径
        this.m_discount = []; // 快速开始的描述
        this.m_tag = ""; // 如果不是空字符串，则显示中间的5折图标
        this.m_nameurl = ""; // 商品名称图片 - add
        this.m_id = ""; // 商品的id（如"T20K"）
        this.m_priceurl = ""; // 价格的图片（如果有，则不显示价格文字）
        this.m_desc = ""; // 商品描述（"送1天记牌器"）

        //<added by qi in version3.3>
        this.m_buy_type = ""; //消费类型（"direct"||"charge"||"consume"）

        //下面两项可能有，也可能没有，根据协议传回来的字段判定
        this.m_price_diamond = ""; //价格（"元100"）
        this.m_exchange_rate = -1; //钻石兑换金币的比例
        this.m_tags = { "sale": 0, "discount": 0, "hot": 0 };
        hall.LOGD(this._TAG, "ctor");
    },

    destroy: function destroy() {
        hall.LOGD(this._TAG, "destroy");
    },

    parseStoreItemInfo: function parseStoreItemInfo(json) {
        this.m_name = json["name"];
        this.m_price = json["price"];
        this.m_pic = json["pic"];
        this.m_discount = json["discount"];
        this.m_tag = json["tag"];
        this.m_nameurl = json["nameurl"];
        this.m_id = json["id"];
        this.m_priceurl = json["priceurl"];
        this.m_desc = json["desc"];
        this.m_buy_type = json["buy_type"];
        this.m_price_diamond = json["price_diamond"];
        this.m_exchange_rate = json["exchange_rate"];
        var tags = json["tags"];
        if (tags) {
            this.m_tags = tags;
        }
        var cost = json["cost"];
        if (cost) {
            this.m_cost = cost;
        }
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
        //# sourceMappingURL=StoreItemInfo.js.map
        