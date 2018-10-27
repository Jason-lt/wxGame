(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/CustomRoomResult.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2da70srUddK15Q4JKdthWp0', 'CustomRoomResult', __filename);
// Script/hall/models/CustomRoomResult.js

"use strict";

//
// CustomRoomResult.js
// highladder
//
// Created by guangy on 2015-11-25
// 
//已结算的组局信息

cc.Class({
	ctor: function ctor() {
		var param = arguments[0];
		this.name = "我的牌局"; // 房间的名字
		this.customTableId = 0; //组局id
		this.customMulti = 0; //自定义底分
		this.customBuyinChip = 0; // 自定义带入金币
		this.limitTime = 0; //有效期
		this.endTime = 0; //组局结束时间
		this.startTime = 0; //组局创建时间
		this.winchip = 0; //玩家输赢金币
		this.avatar = ""; //房主头像
		if (param) {
			this.parseRoomInfo(param);
		}
	},

	parseRoomInfo: function parseRoomInfo(data) {
		this.customTableId = data["customTableId"];
		this.name = data["name"];
		this.customMulti = data["customMulti"];
		this.customBuyinChip = data["customBuyinChip"];
		this.limitTime = data["time"];
		this.startTime = data["createTime"];
		this.endTime = data["endTime"];
		this.winchip = data["winchip"];
		this.avatar = data["owner_avatar"];
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
        //# sourceMappingURL=CustomRoomResult.js.map
        