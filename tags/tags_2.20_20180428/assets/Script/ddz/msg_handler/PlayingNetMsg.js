/*
Function :
	封装客户端解析网络信息相关的东西
	这么封装好吗？
	优点：1，网络消息相关的处理都放到这个文件中，后续在查找，修改时会缩小范围；
	          2，对于不同的玩法需要处理的消息可以进行差异化处理；
	缺点：此部分还需要和界面频繁交互，刷新界面的展示效果，通过user()获取使用者（playController），从而
	          使得这个类、playcontroller和其他类形成了一个网状结构，比较复杂。
	          如果把这个类中需要做的和界面相关的事情都在playController中封装一个接口，将网状结构降为星状结构显得
	          太过繁琐；

	1，onTableInfo中的消息
	2，onTableSit消息
*/
ddz.PlayingNetMsg = cc.Class({

	ctor: function() {
		this._TAG = 'ddz.PlayingNetMsg';
		this._playController = arguments[0];
		this._setListenMsg();
	},

	destroy: function() {
		this._ignoreMsg();
	},

	_setListenMsg: function() {
		//快速开始
		ty.NotificationCenter.listen(ddz.EventType.RECIVE_QUICK_START, this.onQuickStart, this);
		//牌桌信息
		ty.NotificationCenter.listen(ddz.EventType.RECIVE_TABLE_INFO, this.onTableInfo, this);
		// 倍数更新
		ty.NotificationCenter.listen(ddz.EventType.UPDATE_MULTI, this.onUpdateMulti, this);
		//整个打牌流程，包括准备，叫地主，出牌，胜利等等...，根据action区分
		ty.NotificationCenter.listen(ddz.EventType.MSG_TABLE_CALL, this._onTableCall, this); //网络消息
		// 监听todo quickstart
		ty.NotificationCenter.listen(ddz.EventType.MSG_TODO_QUICK_START, this.onTodoTaskQuickStart, this); //网络消息

		ty.NotificationCenter.listen(ddz.EventType.ACTION_DUIJU_LIUSHUI, this.onHistory, this);
	},

	_ignoreMsg: function() {
		ty.NotificationCenter.ignoreScope(this);
	},

	//使用方
	user: function() {
		return this._playController;
	},

	// 在ToDotask的界面里点击快速开始了，隐藏结算页面
	onTodoTaskQuickStart: function(params) {
		if (this.user()._resultController) {
			this.user()._resultController._destroy();
			this.user()._reset();
		}
	},

	onHistory: function () {
		hall.GlobalFuncs.onHistory();
	},

	//判断actiton的类型
	_isAction: function(actionSrc, dst) {
		return actionSrc == dst;
	},

	onTableInfo: function(argument) {
		// ddz.NetWorkCenter.haveTableInfo = false;
		// if(hall.onHide){
		// 	hall.onHide = false;
		// 	var date = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.ONHIDE_DATE);
		// 	var date2 = new Date().getTime();
		// 	var timeGap = date2-date;
		// 	if(timeGap < 60000){
		// 		ty.NotificationCenter.trigger(ddz.EventType.CHANGE_TO_SHOW_FROM_HODE,timeGap);
		// 	}
		// 	ddz.AudioHelper.rePlayMusic();
		// 	return;
		// }
		hall.LOGE('',"========onTableInfo=========state==="+"==="+argument.stat.state);
		//虽然进的单机场，但是仍有可能收到消息（断线重连的），所以单机模式下屏蔽掉
		//todo : 在下一步的重构时，可以在生成playController时不生成此类的对象即可
		var playscene = this.user();
		
		//存储
		// ddz.Replayer.record(argument);

		var info = argument;
		var tableinfo = playscene.tableInfo();
		var oldScenType = playscene.tableInfo().getSceneType();
		tableinfo.parseTableInfo(info);

		//比赛场与好友房切换处理
		if (oldScenType == ddz.Enums.SceneType.MATCH && info['ftInfo']){
			//此时是从比赛场进好友桌
			playscene.toFriend();
		}

		if (playscene.tableInfo().getSceneType() == ddz.Enums.SceneType.FRIEND) {
			playscene.changeBg(1);
			playscene._reset();
		}

		if (info["playMode"] == "wild") { //根据返回的tableInfo刷新type...因为游戏尚未开始，影响到的只是标题栏，只需要刷新标题栏即可
			playscene.setType(ddz.Enums.PlayType.PLAY_TYPE_LAIZI);
		} else if (info["playMode"] == "normal") {
			if (info["config"]["grab"] == 0) {
				playscene.setType(ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN);
			} else {
				playscene.setType(ddz.Enums.PlayType.PLAY_TYPE_HUANLE);
			}
		}

		if (info.hasOwnProperty("stat")) {
			playscene.updateTableState(info);
		}

		ddz.LOGD(this._TAG, "in _onTableInfo");
		playscene._refreshMultipleLabel(false, true);
		playscene._setCardsTipVisible(false);

		//parse seat info
		var key = "seat" + playscene._mySeatIndex;
		playscene.parseMySeatInfo(info[key]);

		//解析对家的信息
		this._parsePartnerInfo(info);

		var state = playscene._tableState.normalInfo.m_state;

		// if (playscene.tableInfo().ftInfo && playscene.tableInfo().ftInfo.allComplete){
		// 	//如果存在好友场信息,并且已经全部打完了,就要弹出对局面板
		// 	hall.GlobalFuncs.onShowDetail();
		// }

		if (playscene._friendPanel) {
			if(playscene.tableInfo().disbind){
				playscene._friendPanel.refreshDisbindState(playscene.tableInfo().disbind);
			}else {
				playscene._friendPanel.deleteDisbindState();
			}
			playscene._friendPanel.refresh();
			playscene._friendPanel.setBtnInviteState(!Boolean(playscene._leftSeatinfo.hasData && playscene._rightSeatinfo.hasData));
		}

		if (state == ddz.Enums.TableState.TABLEDSTAT_IDLE) {
			if (!playscene.isMode(ddz.Enums.PlayMode.PLAY_MODE_REPLAY)) {

				if (playscene.tableInfo().getSceneType() != ddz.Enums.SceneType.FRIEND){
					//给服务器发ready消息
					//比赛场和金币场要自动发送ready,好友场需要手动发送
					ddz.MsgFactory.getReady(playscene.tableInfo().roomId(), playscene.tableInfo().tableId(), playscene._mySeatIndex);
				}
			}
			else{
				playscene.changeBg(1);
			}

			//如果都坐滿了,就删除匹配面板
			if (playscene.tableInfo().getSceneType() == ddz.Enums.SceneType.MATCH && playscene._leftSeatinfo.hasData && playscene._rightSeatinfo.hasData){
				ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
				playscene.showStage(ddz.matchModel.getStageIndex());
			}
		}
		else {
			if (playscene.tableInfo().getSceneType() == ddz.Enums.SceneType.MATCH) {
				ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
				playscene.changeBg(ddz.matchModel.getStageIndex());
			}

			//当前为断线重连，需要做以下事情：  每次托管或者网络卡都可能会收到
			ddz.LOGD(this._TAG, "is reconnect.......");
			playscene._isOnReady = true;
			if (state == ddz.Enums.TableState.TABLEDSTAT_PLAYING) { //已经开始游戏
				playscene.changePlayerAvatar(); //变身
				playscene._startPlay();
			} else if (state == ddz.Enums.TableState.TABLEDSTAT_CALLING) { //正在叫地主
				playscene._startJiaodz();
			}

			var nowop = playscene._tableState.normalInfo.m_nowop;
			//轮到我操作
			var isMyTurn = nowop == playscene._mySeatIndex;
			var leftTime = playscene._tableInfo.config.m_optime - playscene._tableInfo.config.m_passtime;
			if (playscene.tableInfo().getSceneType() == ddz.Enums.SceneType.FRIEND){
				leftTime = ddz.FriendOpTimeOut;
			}

			if (isMyTurn) {

				if (state == ddz.Enums.TableState.TABLEDSTAT_PLAYING) { //显示出牌界面
					playscene._operateController.showPlay(playscene._resetTopCardType());
				} else if (state == ddz.Enums.TableState.TABLEDSTAT_CALLING) { //显示叫地主界面
					playscene.updateJiaodzFromTableInfo();
				}
				playscene._operateController.setClockVisible(true, leftTime);

			} else {
				playscene._operateController.hideAll(); //清空操作栏

				var con = nowop == ddz.GlobalFuncs.GetNextIndex(playscene._mySeatIndex) ?
					playscene._rightPlayerController :
					playscene._leftPlayerController;

				con.setClockVisible(true, leftTime);
			}

			playscene.showTopCards();

			playscene._initMyCards(); //创建card
			playscene._resetExtraCards(); //刷新底牌
			if (state == ddz.Enums.TableState.TABLEDSTAT_PLAYING) {
				//已开始游戏
				playscene._flipExtraCards(false, true); //显示底牌
			}
			
			playscene._refreshCardsLayer(); //把牌放入界面
			playscene._resetTopCardType(!isMyTurn); //重置需要管的手牌

			//看是否托管
			if (playscene._mySeatinfo.model.m_robot == 1) {
				ddz.LOGD(this._TAG, '托管状态 _tableInfo');
				playscene.setIsInTrust(true);
			}

			playscene.hideStage();
		}

		ddz.msgCache.dump();
	},

	_parsePartnerInfo: function(info) {
		var playscene = this.user();

		//信息一定带有seat1, seat2, seat3字段，如果已有玩家，则更新信息
		var rkey = "seat" + ddz.GlobalFuncs.GetNextIndex(playscene._mySeatIndex);
        var seatInfo = info[rkey];
		if (info.hasOwnProperty(rkey)) {
			ddz.LOGD(this._TAG, 'parse right user info in tableInfo');
			var ruid = seatInfo["uid"];
			if (ruid != 0) { //如果uid不为0，则表明有玩家
				playscene._rightSeatinfo.parseSeatInfo(seatInfo);
				playscene._rightPlayerController.refreshWithUserInfo();
                if (playscene._rightSeatinfo.model.m_state == ddz.Enums.SeatState.SEATDZSTAT_READY){
                    playscene._rightPlayerController.setPrepareVisible(true);
                }
			}
			else{
				playscene._rightPlayerController.reset(true);
			}
		}

		var lkey = "seat" + ddz.GlobalFuncs.getPreIndex(playscene._mySeatIndex);
        seatInfo = null;
		if (info.hasOwnProperty(lkey)) {
            seatInfo = info[lkey];
			ddz.LOGD(this._TAG, 'parse left user info in tableInfo');
			var luid = seatInfo["uid"];
			if (luid != 0) {
				playscene._leftSeatinfo.parseSeatInfo(seatInfo);
				playscene._leftPlayerController.refreshWithUserInfo();
                if (playscene._leftSeatinfo.model.m_state == ddz.Enums.SeatState.SEATDZSTAT_READY){
                    playscene._leftPlayerController.setPrepareVisible(true);
                }
			}
			else{
				playscene._leftPlayerController.reset(true);
			}
		}

		if (playscene._friendPanel){
			playscene._friendPanel.setBtnInviteState(!Boolean(playscene._leftSeatinfo.hasData && playscene._rightSeatinfo.hasData));
		}
	},

	onQuickStart: function(argument) {

		var result = argument;
		this.user()._roomId = result["roomId"]; //有可能没有传roomId进来，在此处需要更新
		var seatId = result["seatId"];
		ddz.LOGD(this._TAG, "on quick start in play controller...seatId = " + seatId);
		if (null != seatId && typeof(seatId) != 'undefined' && seatId != 0) {
			this.user()._mySeatIndex = seatId;
			ddz.tableChatModel.mySeatId = seatId;
		} else {
			ddz.LOGD(this._TAG, 'SEATID in msg quickstart ERROR - ' + seatId);
		}
	},

	onUpdateMulti: function(params) {
		ddz.LOGD(this._TAG, "更新倍数");
		this.user()._refreshMultipleLabel(params[0], params[1]);
	},

	_onTableCall: function(argument) {
		var playscene = this.user();
		if (playscene.isMode(ddz.Enums.PlayMode.PLAY_MODE_SINGLE)) {
			return;
		}
		if(playscene.tableInfo().tableId() == 0) {	//从进入牌桌前发quick_start改成进入牌桌后才发,则必须保证处理tablecall必须在已经收到了tableinfo之后
			return;
		}

		// ddz.LOGD(null, "on table call in play controller: " + JSON.stringify(argument));
		if (playscene.isStatus(ddz.Enums.PlayStatus.PLAY_STATUS_GAMEOVER)) {
			return;
		}
		//{"cmd":"table_call","error":{"info":"该房间不支持互动表情","code":1}}
		var check = argument;
		if (typeof(check['error']) != 'undefined') {
			var errorMsg = check['error']['info'];
			if (typeof(errorMsg) == 'undefined') {
				return;
			}
			ddz.LOGD(this._TAG, "error msg is = " + errorMsg);

			hall.MsgBoxManager.showToast({title : errorMsg});
			return;
		}
		if(playscene.isReplay() == false){
			// ddz.Replayer.record(argument);	
		}

		var result = argument["result"];
		var action = result["action"];

		ddz.LOGD(null, "on table call in play controller: " + JSON.stringify(argument));

		if (result.hasOwnProperty("stat")) {
			playscene.updateTableState(result);
		}

		if (this._isAction(action, "ready")) {
			//（1）当某玩家准备后，服务器广播该玩家的 准备 消息。所有玩家收到此消息后，在牌桌上更新准备玩家的状态
			playscene.onActionReady(result["seatId"]);
		} else if (this._isAction(action, "game_ready")) {
			//（2）玩家都准备后，服务器广播 游戏已准备好 的消息。
			//玩家解析服务器返回的所有玩家的牌。非自己的牌，目前只用作计数表现吧
			//解析底牌
			playscene.onActionGameReady(result);
		} else if (this._isAction(action, "next")) {
			//（3）轮到谁叫地主
			//（6）轮到谁出牌
			playscene.onActionNext(result);
		} else if (this._isAction(action, "smilies")) {
			//游戏互动表情
			playscene.onActionChat(result);
		} else if (this._isAction(action, "call")) {
			//（4）谁叫了几分，广播给所有玩家
			playscene.onActionCall(result);
		} else if (this._isAction(action, "game_start")) {
			//（5）叫完地主后，游戏开始 ，服务器返回开宝箱相关信息
			//然后处理next协议（6），告诉轮到谁出牌
			playscene.onActionGameStart(result);
		} else if (this._isAction(action, "card")) {
			//(7)解析刚才是谁打了什么牌，以便在牌桌上显示
			playscene.onActionCard(result);
		} else if (this._isAction(action, "rb")) {
			//somebody被托管
			playscene.onActionRb(result);
			ddz.LOGD(null, this._TAG, "action == rb");
		} else if (this._isAction(action, "game_win")) {
			//游戏结束
			ddz.LOGD(this._TAG, "action == game_win");
			playscene.onActionGameWin(result);
		} else if (this._isAction(action, "wild_card")) {
			//解析癞子牌
			ddz.LOGD(this._TAG, "action == wild_card");
			playscene.onActionWildCard(result);
		}
		else if (this._isAction(action, "ft_req_disbind")) {
			ddz.LOGD(this._TAG, "action == ft_req_disbind"+ JSON.stringify(result));
			ty.NotificationCenter.trigger(ddz.EventType.ACTION_FT_REQ_DISBIND,result);
		}
		else if (this._isAction(action, "ft_req_disbind_answer")) {
			ddz.LOGD(this._TAG, "action == ft_req_disbind_answer"+ JSON.stringify(result));
			ty.NotificationCenter.trigger(ddz.EventType.ACTION_FT_REQ_DISBIND_ANSWER,result);
		}
		else if (this._isAction(action, "ft_req_disbind_result")) {
			ddz.LOGD(this._TAG, "action == ft_req_disbind_result"+ JSON.stringify(result));
			ty.NotificationCenter.trigger(ddz.EventType.ACTION_FT_REQ_DISBIND_RESULT,result);
		}
		else if (this._isAction(action, "ft_disbind")) {
			//解析癞子牌
			ddz.LOGD(this._TAG, "action == ft_disbind"+ JSON.stringify(result));
			ty.NotificationCenter.trigger(ddz.EventType.ACTION_FT_DISBIND,result);
		}
	}
});