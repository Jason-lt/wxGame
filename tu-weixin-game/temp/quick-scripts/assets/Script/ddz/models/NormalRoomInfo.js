(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/models/NormalRoomInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '95748Jrlp9Np66ByrVLAqaS', 'NormalRoomInfo', __filename);
// Script/ddz/models/NormalRoomInfo.js

"use strict";

//公开场房间
ddz.NormalRoomInfo = cc.Class({
	ctor: function ctor() {
		var info = arguments[0];
		this.least = 0;
		this.minQuickStartChip = 0;
		this.config = 0;
		this.id = 0;
		this.condition = "";
		this.subdesc = "";
		this.name = "";
		this.nameurl = ""; // 房间名称的图片，如果没有则为空。
		this.entry = "";
		this.give_total = 0; // 打满多少局送东西
		this.give_coupon = 0; // 打满局数送几张券
		if (info) {
			this.parserInfo(info);
		}
	},

	parserInfo: function parserInfo(info) {
		this.least = info["least"];
		this.minQuickStartChip = info["minQuickStartChip"];
		this.config = info["config"];
		this.id = info["id"];
		this.condition = info["condition"];
		this.subdesc = info["subdesc"];
		this.name = info["name"];
		this.nameurl = info["nameurl"];
		this.entry = info["entry"];
		this.count = info["least"];
		var tbbox = info["tbbox"];
		if (tbbox) {
			this.give_total = tbbox["pt"];
		}
		if (info["showInfo"]) {
			this.parseShowInfo(info["showInfo"]);
		}
		if (info["mixId"]) {
			this.mixId = info["mixId"];
		}
		this.play_mode = info["play_mode"];
		if (info["userCount"]) {
			this.userCount = info["userCount"];
		}
	},

	parseShowInfo: function parseShowInfo(showInfo) {
		this.gameDes = showInfo['gameDes'];
		this.showName = showInfo['name'];
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
        //# sourceMappingURL=NormalRoomInfo.js.map
        