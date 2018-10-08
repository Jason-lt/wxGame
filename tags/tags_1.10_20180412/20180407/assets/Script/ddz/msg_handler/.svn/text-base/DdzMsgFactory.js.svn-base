//斗地主专用消息发送

ddz.MsgFactory = {

	//进入经典场，某个房间，返回的是table_info...有3种情况，带roomid（选定房间进入）, 带sessionIndex（快速进入）, 都不带（断线重练）
	getQuickStart: function(roomId, apiver, sessionIndex) {
		var params = {
			'cmd': ddz.EventType.CMD_TABLE_QUICKSTART,
			'params': {
				'apiver': apiver,
				'gameId' : ty.SystemInfo.gameId
			}
		};
		if (typeof(sessionIndex) != 'undefined' && sessionIndex != null) { //如果没有sessionIndex这个参数，则传roomId， 否则传sessionIndex
			params["params"]["sessionIndex"] = sessionIndex;
		}
		if (typeof(roomId) != 'undefined' && roomId != null) {
			params["params"]["roomId"] = roomId;
		}
		hall.MsgFactory._sendCmd(params);
	},

	/**
	 * 离开某个房间
	 * @param roomId
     */
	getRoomLeave: function(roomId) {
		var params = {
			'cmd': ddz.EventType.CMD_ROOM_LEAVE,
			'params': {
				'gameId' : ty.SystemInfo.gameId,
				'roomId': roomId
			}
		};
		hall.MsgFactory._sendCmd(params);
	},

	//param是一个map数组
	//所有的cmd都是table_call，不懂如何传参，详情请看unitTest.js的testOnClassicTableReady函数
	getTableCall: function(action, param) {
		var subparams = {
			'action': action,
			'gameId' : ty.SystemInfo.gameId
		};

		for (var key in param) {
			subparams[key] = param[key];
		}
		
		var params = {
			'cmd': ddz.EventType.CMD_TABLE_CALL,
			'params': subparams
		};

		hall.MsgFactory._sendCmd(params);
	},

	toComplain: function(roomId, tableId, otherPlayerId1, otherPlayerId2, gameNum) {
		var cmd = {
			'cmd': ddz.EventType.CMD_COMPLAIN,
			params: {
				'action': "complain",
				'roomId': roomId,
				'tableId': tableId,
				'otherPlayerId1': otherPlayerId1,
				'otherPlayerId2': otherPlayerId2,
				'gameNum': gameNum
			}
		};
		hall.MsgFactory._sendCmd(cmd);
	},

	//发送互动表情
	sendTableChat: function(roomId, tableId, from, to, emoTag, send10) {
		// if (isFace) {
		// 	//兼容老版本
		// 	msg = "expression" + msg + ".png";
		// 	hall.LOGD(this._TAG, "chat msg is = " + msg);
		// }
		// ['bomb', "diamond", "egg", "flower", "brick"]
		var params = {
			'cmd': "table",
			'params': {
				'action': "smilies",
				'roomId': roomId,
				'tableId': tableId,
				'seatId': from,
				"smilies":emoTag,
				'toseat': to,
				'gameId' : ty.SystemInfo.gameId,
				'number': send10 ? 1 : 1,
			}
		};

		ddz.LOGD(null, "sendTableChat params = " + JSON.stringify(params));
		hall.MsgFactory._sendCmd(params);
	}

};