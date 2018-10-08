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
	 * 离开某个牌桌
	 * @param roomId 房间号
	 * @param tableId 桌号
	 * @param seatId 坐位号
     * @param mixId 混房号
     */
	getTableLeave: function(roomId,tableId,seatId,mixId) {
		var params = {
			'cmd': ddz.EventType.MSG_TABLE_LEAVE,
			'params': {
				'gameId' : ty.SystemInfo.gameId,
				'roomId': roomId,
				"seatId": seatId,
				"tableId": tableId
			}
		};

		if (mixId){
			params.params['mixId'] = mixId;
		}

		hall.MsgFactory._sendCmd(params);
	},

	/**
	 * 离开某个房间
	 * @param roomId 房间号
	 * @param tableId 桌号
	 * @param seatId 坐位号
	 * @param mixId 混房号
	 */
	getRoomLeave: function(roomId,tableId,seatId,mixId,_mixedRoomId) {
		var params = {
			'cmd': ddz.EventType.CMD_ROOM_LEAVE,
			'params': {
				'gameId' : ty.SystemInfo.gameId,
				'roomId': roomId
			}
		};

		if (tableId) {
			params.params['tableId'] = tableId;
		}

		if (seatId) {
			params.params['seatId'] = seatId;
		}

		if (mixId){
			params.params['mixId'] = mixId;
		}

		if (_mixedRoomId){
			params.params['mixedRoomId'] = _mixedRoomId;
		}
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

	getReady: function (roomId, tableId, seatId) {
		var params = {
			'cmd': ddz.EventType.CMD_TABLE_CALL,
			'params': {
				'action': ddz.EventType.ACTION_READY,
				'gameId': ddz.GameId,
				'roomId' : roomId,
				'tableId': tableId,
				'seatId' : seatId
			}
		};
		hall.MsgFactory._sendCmd(params);
	},

	// 获取记牌器
	getCradNote: function (roomId, tableId, seatId) {
		var params = {
			'cmd': ddz.EventType.CMD_TABLE_CALL,
			'params': {
				'action': "newCardNote",
				'gameId': ddz.GameId,
				'roomId' : roomId,
				'tableId': tableId,
				'seatId' : seatId
			}
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
				'number': send10 ? 1 : 1
			}
		};

		ddz.LOGD(null, "sendTableChat params = " + JSON.stringify(params));
		hall.MsgFactory._sendCmd(params);
	},
	/**
	 * 完成玩几局任务请求获取奖励
	 */
	getTboxReward: function(roomId) {
		var params = {
			'cmd': ddz.EventType.CMD_DIZHU,
			'params': {
				'action': "tbox_getReward",
				'gameId': ty.SystemInfo.gameId,
				'roomId': roomId,
			}
		};
		hall.MsgFactory._sendCmd(params);
	},

	/**
	 * 保存比赛进程
     */
	saveMatch:function () {
		var waitInfo = ddz.matchModel.getCurWaitInfo();
		if (!waitInfo){
			if(ddz.friendModel.isEnterTable){
				ddz.friendModel.enterFTTable(ddz.Share.shareKeywordReplace.inviteFriendID);
			}
			hall.LOGW(null, "当前没有wait信息,无需保存!");
			return;
		}
		if(waitInfo.state != 2 && waitInfo.state != 4){
			ddz.friendModel.isEnterTable = false;
			hall.MsgBoxManager.showToast({title:"当前在比赛中,不可进入好友桌"});
			// hall.LOGW(null, "当前在比赛中,不可进入好友桌");
			return;
		}
		var roomId = waitInfo.roomId;
		var params = {
			"cmd":ddz.EventType.CMD_ROOM,
			"params":{
				"action": ddz.EventType.ACTION_SAVE,
				"gameId": ty.SystemInfo.gameId,
				"roomId" : roomId
			}
		};
		hall.MsgFactory._sendCmd(params);
	},

	/**
	 * 恢复比赛
     */
	resumeMatch:function () {
		var roomId;
		var records = ddz.gameModel.getCurMatchRecords();
		if (records && records.length > 0){
			roomId = records[0].roomId;
		}
		var params = {
			"cmd":ddz.EventType.CMD_ROOM,
			"params":{
				"action": ddz.EventType.ACTION_RESUME,
				"gameId": ty.SystemInfo.gameId,
				"roomId": roomId
			}
		};
		hall.MsgFactory._sendCmd(params);
	},

	/**
	 * 请求被保存的比赛记录
	 */
	getMatchRecords:function () {
		var params = {
			"cmd":ddz.EventType.MSG_GAME,
			"params":{
				"action": ddz.EventType.ACTION_RECORDS,
				"gameId": ty.SystemInfo.gameId
			}
		};
		hall.MsgFactory._sendCmd(params);
	},

	/**
	 * 获奖后通知通过公众号通知好友
	 * @param friendIds 好友的UID
	 * @param moneyVal 得了多少钱
	 * @param msgType 消息类型， hero 代表闯关成功消息， arena 代表比赛第一消息
     */
	sendRewardMsgToFriends:function (friendIds, moneyVal, msgType) {
		var params = {
			"cmd":ddz.EventType.CMD_DIZHU,
			"params":{
				"action": 'wx_public_msg',
				"gameId": ty.SystemInfo.gameId,
				"friendIds" : friendIds,
				// "friendIds" : [382886,15389],
				"msgType" : msgType,
				"data": {'money' : moneyVal, 'name': ty.UserInfo.userName}     // 额外参数，字典类型 {'money':1.45}
			}
		};
		hall.MsgFactory._sendCmd(params);
	}
};