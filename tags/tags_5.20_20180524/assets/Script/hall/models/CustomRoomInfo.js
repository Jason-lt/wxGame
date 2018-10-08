// hall.CustomRoomInfo
// Created by wangjunpeng 10.22 2015


cc.Class({
	ctor: function() {
		this._TAG = "hall.CustomRoomInfo";
		this.tableName = "我的牌局"; // 房间的名字
		this.customTableId = 0; //组局id
		this.customMulti = 0; //自定义底分
		this.inviteCode = ""; //邀请码
		this.customBuyinChip = 0; // 自定义带入金币
		this.tableId = 0; //游戏桌的Id
		this.players = []; //在这个房间里面都有谁加入了  {"uid": 10552, "name": "财神来了", "avatar": "http://ddz.image.tuyoo.com/avatar/head_lotus.png", "join_time": 1446104357, "status":0} 
		this.status = 0; //组局的状态  0 等待 1 等待游戏开始 2游戏中 3组局已结算 4组局被解散
		this.roomOwner = 0; // 房间的拥有者，有权限解散
		this.limitTime = 0; //有效期
		this.leftTime = 0; //组局剩余时间
		this.result = null;
		this.ownerName = "";
		this.maxMulti = 0;
		this.sitdownPlayer = [];
		var param = arguments[0];
		if (param) {
			this.parseRoomInfo(param);
		}
		hall.LOGD(this._TAG, "ctor");
	},

	_getOwnerName: function() {
		var uid = this.roomOwner;
		var player = h5.globalFunc.findInArray(this.players, function(element) {
			return element["uid"] == uid;
		});
		return player ? player["name"] : "玩家" + uid;
	},

	parseRoomInfo: function(data) {
		hall.LOGD(this._TAG, "parseRoomInfo");
		this.customTableId = data["customTableId"];
		this.tableName = data["name"];
		this.inviteCode = data["inviteCode"];
		this.customMulti = data["customMulti"];
		this.customBuyinChip = data["customBuyinChip"];
		this.tableId = data["tableId"];
		this.players = data["players"];
		this.status = data["status"];
		this.maxMulti = data["maxMulti"];
		this.roomOwner = data["owner"];
		this.limitTime = data["time"];
		this.leftTime = data["left_time"];
		this.ownerName = this._getOwnerName();
		this.sitdownPlayer = this.players.filter(function(item) { //筛选出status为1，即坐下的player
			return item["status"] != 0;
		});
	},

	parseAsResult: function(data) {
		this.customTableId = data["customTableId"];
		var baseInfo = data["base_info"];
		this.tableName = baseInfo["name"];
		this.roomOwner = baseInfo["owner"];
		this.limitTime = baseInfo["time"];
		this.customMulti = baseInfo["customMulti"];
		this.customBuyinChip = baseInfo["customBuyinChip"];
		this.result = data["datas"];
	}
		/*
	{
    "round": 1,
    "singleMax": 8000,
    "players": [
        {
            "uid": 10594,
            "name": "地狱之火",
            "avatar": "http://ddz.image.tuyoo.com/avatar/head_lotus.png",
            "join_time": 1446779040,
            "win_chips": 8000,
            "lose_chips": 0,
            "winchip": 8000,
            "mvp": 1
        },
        {
            "uid": 10593,
            "name": "草原之狼",
            "avatar": "http://ddz.image.tuyoo.com/avatar/head_piano.png",
            "join_time": 1446779031,
            "win_chips": 0,
            "lose_chips": -4000,
            "winchip": -4000,
            "fish": 1
        },
        {
            "uid": 10259,
            "name": "博大精深",
            "avatar": "http://ddz.image.tuyoo.com/avatar/head_horse.png",
            "join_time": 1446779036,
            "win_chips": 0,
            "lose_chips": -4000,
            "winchip": -4000
        }
    ]
}
*/
});