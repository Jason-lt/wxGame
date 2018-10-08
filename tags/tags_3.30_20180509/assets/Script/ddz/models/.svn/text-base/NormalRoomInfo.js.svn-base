//公开场房间
ddz.NormalRoomInfo = cc.Class({
	ctor: function() {
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

	parserInfo: function(info) {
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
		if (info["userCount"]){
			this.userCount = info["userCount"];
		}
	},

	parseShowInfo: function(showInfo) {
		this.gameDes = showInfo['gameDes'];
		this.showName = showInfo['name'];
	}

});