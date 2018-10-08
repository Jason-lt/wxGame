/**
 * 大厅消息中心
 */
hall.hallNetWorkCenter = {
    _TAG : 'hall.hallNetWorkCenter',
    boot : function (){
        hall.LOGD(this._TAG, "boot!");

        this.cmdMap = {};
        //注册消息监听

        this.cmdMap[ddz.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[ddz.EventType.MSG_BAG_INFO] = this.onReceiveBagInfo;
        this.cmdMap[ddz.EventType.MSG_GAME_DATA] = this.onReceiveGameData;
        this.cmdMap[ddz.EventType.MSG_TODO_TASKS] = this.onTodoTask;
        this.cmdMap[ddz.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;
        this.cmdMap[ddz.EventType.MSG_USER] = this.onUserName;

        this.cmdMap[ddz.EventType.MSG_PROD_DELIVERY] = this.onProdDelivery;

        this.cmdMap[ddz.EventType.MSG_LOGIN_REWARD] = this.onLoginReward;


        this.cmdMap[ddz.EventType.MSG_LED] = this.onLed;
        this.cmdMap[ddz.EventType.MSG_TODO_QUICK_START] = this._onTodoQuickStart;
        this.cmdMap[ty.EventType.UPDATE_UER_INFO] = this.onUPDATE_UER_INFO;
        this.cmdMap[ty.EventType.MSG_LOG_OUT] = this.onLogout;

        this.cmdMap[ddz.EventType.MSG_ROOM] = this.onRoomAction;
        this.cmdMap[ddz.EventType.MSG_MODULE_TIP] = this.onModuleTip;
        this.cmdMap[ddz.EventType.MSG_MESSAGE] = this.onMessage;
        this.cmdMap[ddz.EventType.MSG_CUSTOM_RANK] = this.onRankList;
        this.cmdMap[ddz.EventType.MSG_COMPLAIN] = this.onComplain;
        this.cmdMap[ddz.EventType.MSG_STORE_INFO] = this.onStoreInfo;

        this.cmdMap[ddz.EventType.MSG_TABLE_POPWND] = this.onClassicPopwnd;
        this.cmdMap[ddz.EventType.MSG_STORE] = this.onStore;
        this.cmdMap[ddz.EventType.MSG_CUSTOMTABLE] = this.onCustomTable;

        this.cmdMap[ddz.EventType.MSG_ROOM_ONLINE_INFO] = this.onRoomOnlineInfo;

        this.cmdMap[ddz.EventType.MSG_CASH] = this.onCash;

        // 商城购买;
        this.cmdMap[ddz.EventType.MSG_CHARGE_NOTIFY] = this.onChargeNotify;
        
        //注册监听
        ty.NotificationCenter.listen(ty.EventType.TCP_OPENED, this.onTCP_Open, this);
        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);
        ty.NotificationCenter.listen(ddz.EventType.MSG_ON_LOC, this._onLocInfo, this);

        ty.NotificationCenter.listen(ty.EventType.GET_USER_FEATURE_SUCCESS, this._userFeature, this);
    },
    
    shut : function(){
        this.cmdMap = {};
        ty.NotificationCenter.ignoreScope(this);
    },

    //
    onTCP_Open : function(){
        //发送BindUser
        hall.MsgFactory.bindUser();
    },
    /**
     * 收到TCP消息
     */
    onReceiveTCP_Msg : function(value){
        var msgCmd = value.cmd;
        var result = value.result;
        if (result){
            var gameId = result.gameId;
            if (gameId === ty.SystemInfo.hallId){
                //大厅消息在这里处理，其它游戏，在自己的插件里监听消息，并用gameId进行过滤
                var func = this.cmdMap[msgCmd];
                if (func){
                    // func(value);
                    func.call(this, value);
                }
                else{
                    // ty.NotificationCenter.trigger(msgCmd, value);
                    hall.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
                }
            }else if (value.cmd == ddz.EventType.CMD_STORE_INFO) {  // store_config 特殊处理下,大厅共用,此消息没有传gameId
                var func = this.cmdMap[msgCmd];
                if (func){
                    func.call(this, value);
                }
                else{
                    hall.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
                }
            }else if (value.cmd == ddz.EventType.MSG_LED){      // 'led' 消息,
                var func = this.cmdMap[msgCmd];
                if (func){
                    func.call(this, value);
                }
                else{
                    hall.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
                }
            }
        }

        else{
            if (msgCmd == ty.EventType.MSG_LOG_OUT){
                var errMsg = value.error ? value.error.info : null;
                if (errMsg){
                    hall.MsgBoxManager.showToast({title : errMsg});
                }
            }
        }
    },

    _onLocInfo: function (larr) {
        // hall.MsgBoxManager.showToast({title:'' + larr.toString()});
        ddz.LOGD("","file = [HallNetWorkCenter] fun =[_onLocInfo] ");
        ddz.matchModel.cleanWaitInfo();

        var gameid = parseInt(larr[0]);
        var roomid = parseInt(larr[1]);
        var tableid = parseInt(larr[2]);
        var seatId = parseInt(larr[3]);

        // var sceneInfo = wx.getLaunchOptionsSync();
        var sceneInfo = ty.UserInfo.onShowParam || wx.getLaunchOptionsSync();
        // hall.LOGW(null, "+++++++++sceneInfo++++++++"+JSON.stringify(sceneInfo));
        // var scene = sceneInfo.scene;
        // var query = sceneInfo.query;

        // var shareTicket;
        var scene = ty.UserInfo.scene_id || sceneInfo.scene;
        var query = sceneInfo.query;
        // shareTicket = sceneInfo.shareTicket;
        var queryS = hall.GlobalFuncs.replaceToStringWithDic(query);

        if (ddz.qrCodeOption.withQrCode(scene)){
            //是否为从小程序码进入
            var par = "";
            if (query.hasOwnProperty('scene')){
                //个人小程序码
                par = query.scene;
            }
            else if (sceneInfo.hasOwnProperty('path')){
                par = sceneInfo.path;
            }
            ddz.qrCodeOption.runOption(par, scene);
        }

        if (scene == 1074 && query && query.from == "fuhao_guanfang") { // 公众号会话下发的小程序消息卡片
            ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.gongZhongHaoCard);
        }else if(scene == 1035 && query && query.from == "fuhao_guanfang") { // 公众号自定义菜单
            ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.gongZhongHaoMenu);
        }

        if(query && query.sourceCode){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.inviteCode,ddz.Share.clickStatShareType[query.sourceCode],
                query.imageType,"GameStart",queryS]);
            //邀请得钻石
            if (query.inviteCode) {
                ddz.gameModel.bindInviteCode(parseInt(query.inviteCode));
                ddz.gameModel.bindNewInviteCode(parseInt(query.inviteCode));
            }

            //好友房打点
            if(query.sourceCode == ddz.Share.onShareType.clickStatShareTypeInviteFriend){
                var ftID = query.ftID ? query.ftID : "0000";
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeInviteFriendCardSuccess,
                    [ftID,query.inviteCode]);
            }

            //第一次登录展示帮助某某获得一颗钻石
            var curDay = hall.GlobalTimer.getCurDay();
            var lastDay=hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_LOGIN_TIME,"");
            if (curDay != lastDay && query.inviteName
                && query.sourceCode != ddz.Share.onShareType.clickStatShareTypeInviteFriend
                && query.inviteCode != ty.UserInfo.userId) {
                hall.GlobalFuncs.setInLocalStorage(ddz.Share.LAST_LOGIN_TIME,curDay);
                var string =
                    "<color=#1A6951>成功帮助 "+query.inviteName+
                    " 获得</color><img src='dda_button_diamond_black' height=34 width=42/><color=#1A6951> +1<c/><br/><color=#1A6951>每期仅能帮助一位好友哦</c>";
                ddz.GlobalFuncs.showTipsWindowWithString(string,"确定");
            }
        }else {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.from,query.appid,
                "GameStart",queryS]);
        }

        hall.GlobalFuncs.setInLocalStorage(ddz.Share.LAST_LOGIN_TIME,hall.GlobalTimer.getCurDay());

        //存储本次登录时间最为最后登录时间
        if(ddz.Share.isOnShare){
            ddz.Share.playAnimationAfterShareWithType();
        }
        ddz.MsgFactory.getMatchRecords();
        ddz.Share.isOnShare = false;

        if (ty.SystemInfo.ftID != "") {
            ddz.friendModel.enterFriendTable(ty.SystemInfo.ftID);
            ty.SystemInfo.shareTicket = "";
        }

        // if (ddz.waitGetRevial && ddz.waitGetRevial.type == 'showWindow'){
        //     //分享到了好友,再次拉起面板,让玩家分享到群
        //     ddz.LOGD("ddz.waitGetRevial.type", "分享到了个人!" + ddz.waitGetRevial.type);
        //     ddz.GlobalFuncs.showRevialWindow(true,1);
        //     ddz.waitGetRevial = null;
        // }

        if (ddz.waitGetRevial && ddz.waitGetRevial.type == 'send'){
            var needCount = ddz.waitGetRevial.needCount;
            if(ddz.waitGetRevial.matchType == 'arena') {
                ddz.waitGetRevial.type = 'waitRecive';
                ddz.waitGetRevial.curCount = 0;
            } else {
                ddz.waitGetRevial = {
                    type : 'waitRecive',
                    curCount : 0,
                    needCount : needCount
                };
            }
            //发送得钻石的消息
            for (var i = 0; i < needCount; i++){
                ddz.gameModel.shareToGetreward(ddz.waitGetRevial.sharePoint || ddz.Share.SharePointType.firstFail);
            }
        }

        // }
        hall.LOGW(null, "+++++++++shareTicket++++++++"+ty.SystemInfo.shareTicket);
        var shareTicket;
        if (roomid != 0 && tableid != 0) {
            hall.MsgFactory.getQuickStart(ty.UserInfo.userId, gameid, roomid, hall.staticSystemInfo.version, null, null, null, tableid);
            if(seatId > 5){
                if(ty.SystemInfo.shareTicket != "" ){
                    shareTicket = ty.SystemInfo.shareTicket;
                    if (hall.GlobalFuncs.isInAtScene("TableScene")){
                        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
                    }
                    hall.GlobalFuncs.gotoRank(shareTicket);
                }
            }
        }
        else{
            ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
            if(ty.SystemInfo.shareTicket != "" ){
                shareTicket = ty.SystemInfo.shareTicket;
                hall.GlobalFuncs.gotoRank(shareTicket);
            }
            else {
                if (!ddz.matchResultPanel && !ddz.matchRevivalPanel && !ddz.arenaResultPanel 
                    && !ddz.gameResultPanel && !ddz.hongBaoPanel){
                    hall.GlobalFuncs.gotoDdz();
                }
            }
        }
        ty.SystemInfo.shareTicket = "";
    },

    //==================消息回调方法开始=========================

    onReceiveUserInfo : function(value){
        //发送bindGame信息
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Success, [JSON.stringify(value)]);
        this.onUserInfo(value);
        hall.MsgFactory.bindGame(ty.SystemInfo.gameId);
        ddz.matchModel.matchUpdate();
        ddz.matchModel.getMatchDes();
        ddz.gameModel.getArenaMatchConfig();
        ddz.gameModel.getAlmsConfig();
        ddz.gameModel.queryInviteConfig();
        ddz.gameModel.getCommonConfig();
        ddz.gameModel.getShareCommonConfig();
        ddz.gameModel.getMatchingMassageConfig();
        ddz.gameModel.getResurgenceConfigConfig();
        ddz.gameModel.getOldUserChipReward();
        ddz.gameModel.getTempData();
        hall.MsgFactory.getBagInfo();
        hall.MsgFactory.getTimeStamp();
        hall.MsgFactory.getStoreInfo("update");

        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.gongZhongHaoCard);
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.gongZhongHaoMenu);
        // hall.MsgFactory.getNewUserReward();
    },

    _userFeature:function (val) {
        // var ={
        //     "_id":"1490806",
        //         "bind_wx":"wx:om67ov41A6awFwQ0rQB0RtWFA8NA",
        //         "last_login_time":"2018-05-25 16:44:22",
        //         "last_login_ip":"183.212.187.255",
        //         "last_login_province":"江苏",
        //         "last_login_city":"南京",
        //         "last_login_clientid":"H5_5.1_weixin.weixin.0-hall6.weixin.rich",
        //         "login_counts": {
        //             "2018-05-25":1
        //         },
        //     "create_platform_id":"3",
        //         "create_clientid":"H5_5.1_weixin.weixin.0-hall6.weixin.rich",
        //         "create_subplatform_id":"5",
        //         "create_city":"南京",
        //         "create_channel_id":"104",
        //         "create_ip":"183.212.187.255",
        //         "create_time":"2018-05-25 16:44:22",
        //         "create_province":"江苏",
        //         "create_product_id":"6",
        //         "login_detail": {
        //         "2018-05-25": [
        //             "16:44:22"
        //         ]
        //     }
        // };
        if (!val.retmsg) {
            return
        }
        ty.UserInfo.featureInfo = val.retmsg;
        ty.UserInfo.isInBSGS = hall.GlobalFuncs.checkBSGS(ty.UserInfo.featureInfo.last_login_city); //是否在北上广深
    },

    onReceiveBagInfo : function (value) {
        if (typeof(value) == 'undefined') {
            return;
        }
        hall.ME.parseBagInfo(value);
    },

    onReceiveGameData : function(value){
        hall.LOGW(null, "file = [HallNetWorkCenter] fun = [onReceiveGameData] ");
        this.onGameData(value);
        hall.MsgFactory.getHallInfo(ty.SystemInfo.gameId);
    },

    onTodoTask: function(value) {
        if (value && value["result"]) {
            hall.gameWorld.model.m_todoTask.parseTodoTask(value["result"]);
        }
    },

    onUpdateChangedData: function(argument) {
        hall.LOGD(this._TAG, "onUpdateGold -------------------------");
        //解析数据
        if (typeof(argument) != 'undefined') {
            //hall.ME.parseUserInfo(argument[0]);
            var result = argument["result"];
            if (typeof(result) != 'undefined' && typeof(result['changes']) != 'undefined') {
                var gameId = result.gameId;
                hall.LOGD(this._TAG, 'gameid = ' + gameId);
                for (var i = 0; i < result['changes'].length; i++) {
                    var curValue = result["changes"][i];
                    if (typeof(curValue) == 'undefined') {
                        continue;
                    }

                    if (curValue == 'gdata') {
                        hall.LOGD(this._TAG, "update_notify,更新gdata");
                        hall.MsgFactory.getGameData(gameId);
                    } else if (curValue == 'item') {
                        hall.LOGD(this._TAG, "update_notify,更新道具");
                        hall.MsgFactory.getBagInfo();
                    }
                    //金币，钻石
                    else if (curValue == "udata") {
                        hall.LOGD(this._TAG, "update_notify,更新钻石金币");
                        hall.MsgFactory.getUserInfo(gameId);
                    }
                }
            }
        }
    },
    onUserName: function(argument) {
        var data = argument["result"];
        if (typeof(data) != 'undefined') {
            var action = data["action"];
            if (action == "get_name") {
                var code = data["code"];
                if (code == 0 || !code) {
                    ty.NotificationCenter.trigger(ddz.EventType.MSG_NAME_BACK, data);
                } else {
                    hall.MsgBoxManager.showToast({title : "你输入的ID不正确，请输入有效ID."});
                }
            }else if (action == ddz.EventType.ACTION_SYNC_TIMESTAMP) {
                //获取当前时间戳
                ty.NotificationCenter.trigger(ddz.EventType.GET_TIMESTAMP, data);
            }
        }
    },
    onProdDelivery: function(params) {
        hall.LOGW("","file = [HallNetWorkCenter] fun = [onProdDelivery] params = " + JSON.stringify(params));
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_PAY_SUCCESS, params);
    },


    onLoginReward: function(argument) {
        var result = argument[0]["result"];
        if (typeof(result) != 'undefined') {
            var success = result["success"];
            if (success) {
                hall.ME.loginRewardinfo.parse(result);
                ty.NotificationCenter.trigger(ddz.EventType.MSG_REWARD_SUCCESS);
            }
        }
    },

    // 获取登录信息,登录成功，会返回五个比赛场里面第一个界面的信息，比如进入经典场，的第一个界面
    onUserInfo: function(argument) {
        if (typeof(argument) == 'undefined') {
            return;
        }
        if (this._bBindGame) {
            // 获取大厅的game_data
            // hall.MsgFactory.getGameData(ty.SystemInfo.hallId);
            // hall.MsgFactory.bindGame(ddz.GameId);
        }
        ty.UserInfo.userId = argument["result"]["userId"];
        ddz.LOGD(null, "onUserInfo argument = " + JSON.stringify(argument));
        hall.ME.parseUserInfo(argument);

        // 更新UserInfo
        ty.NotificationCenter.trigger(ty.EventType.UPDATE_UER_INFO, hall.ME);

        // 刷新金币
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COIN_NUMBER);

        // 刷新剩余奖金
        ty.NotificationCenter.trigger(ddz.EventType.SET_LOSS_MONEY_NUMBER);
    },

    // 返回gameData
    onGameData: function(argument) {
        hall.LOGD(this._TAG, 'onGameData');
        if (typeof(argument) != "undefined") {
            hall.ME.parseGameData(argument);

            if (hall.ME.hallGData.m_winchipstats && hall.ME.hallGData.m_winchipstats.length > 0) {
                ty.NotificationCenter.trigger(ddz.EventType.MSG_GDATA_BACK);
            }

            if (!hall.GlobalFuncs.checkMsgWithGameId(argument, ddz.GameId)) {
                // 大厅的game_data，返回，暂时没内容
                return;
            }

            // 更新GameData，暂时跟更新UserInfo一起用
            // ty.NotificationCenter.trigger(hall.EventType.UPDATE_UER_INFO, hall.ME);
            if (this._bBindGame) {
                this._bBindGame = false;
                if (hall.ME.gdataInfo.m_loginsum == 1) {
                    // 新手获取新手奖励，新手奖励实在bind_game之后在地主的游戏服发放的
                    hall.MsgFactory.getUserInfo(ddz.GameId);
                }

                // 获取任务
                hall.MsgFactory.getEveryTaskInfo(ddz.GameId, 'update');
                //获取个人消息和系统消息
                hall.MsgFactory.getPersonalMsg();
                hall.MsgFactory.getGlobalMsg();
            }
        }
    },

    onLed: function(params) {
        // hall.LOGD(null, params);
        var result = params['result'];
        if (result && result.scope == "hall6") {
            hall.gameWorld.parseLed(result.text);
            var model = hall.gameWorld.model;
            //若是之前消息已经播放完
            if (!model.m_ledBeWork) {
                ty.NotificationCenter.trigger(ddz.EventType.CMD_LED_RECEIVE, result);
            }
        }else if (result && result.scope == "6") {
            hall.gameWorld.parseGameLed(result.text);
            var model = hall.gameWorld.model;
            //若是之前消息已经播放完
            if (!model.m_ledBeWork) {
                ty.NotificationCenter.trigger(ddz.EventType.CMD_LED_RECEIVE, result);
            }
        }
    },

    _onTodoQuickStart: function(param) {
        hall.MsgFactory.getQuickStart(ty.UserInfo.userId, param["gameid"], param["roomid"], hall.staticSystemInfo.version, null, null, null);
    },

    // 用户数据加载完之后，开始启动心跳
    onUPDATE_UER_INFO: function(userInfo) {
        var interval = userInfo.objectInfo.m_heart.heartbeat;
        // 开始心跳逻辑
        // ty.HeartBeat.startHeartBeat(interval, 10);
    },

    onLogout: function(argument) {
        hall.ME.isOtherLogin = true;
        var err = argument["error"];
        if (err) {
            hall.MsgBoxManager.showToast({title : err["info"]});

            // h5.CommonWindow.createSimple(err["info"], function() {
            //     var scene = h5.EntranceLayer.createScene();
            //     cc.director.runScene(scene);
            // });
        }
    },
    // 组局 /////////////
    onRoomAction: function(params) {
        hall.LOGD(null, this._TAG, "onRoomAction -------------------- ");
    },
    onCash : function (argument) {
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_CASH_RESULT,argument);
    },

    onChargeNotify:function(params) {

    },

    onModuleTip: function(argument) {
        var data = argument["result"];
        if (typeof(data) != 'undefined') {
            var action = data["action"];
            if (action == "update") {
                hall.ME.msgInfo.praseModultTip(data["modules"]);
            }
        }
    },

    onRankList : function (argument) {
        ty.NotificationCenter.trigger(ddz.EventType.MSG_CUSTOM_RANK,argument);
    },

    onMessage: function(argument) {
        var data = argument["result"];
        if (typeof(data) != 'undefined') {
            var action = data["action"];
            var list = data["list"];
            if (action == "sys_msg_list") {
                hall.ME.msgInfo.parseSysInfo(list);
                ty.NotificationCenter.trigger(ddz.EventType.MSG_SYS_MESSAGE_BACK);
            } else if (action == "msg_receive_list") {
                hall.ME.msgInfo.parseReceiveInfo(list);
                ty.NotificationCenter.trigger(ddz.EventType.MSG_REC_MESSAGE_BACK);
            } else if (action == "msg_send_list") {
                hall.ME.msgInfo.parseSendInfo(list);
                ty.NotificationCenter.trigger(ddz.EventType.MSG_SEND_MESSAGE_BACK);
            } else if (action == "msg_send") {

                var code = data["code"];
                var msgTitle = code == 0 ? "发送成功" : "发送失败";
                hall.MsgBoxManager.showToast({title : msgTitle});

            } else if (action == "unread_count") {
                var unReadCount = data["chat_unread"];
                var sysUnread = data["sys_unread"];
                if (unReadCount /*+ sysUnread*/) {
                    hall.GlobalFuncs.setInLocalStorage(hall.HAS_MAIL_KEY, true);
                } else {
                    hall.GlobalFuncs.setInLocalStorage(hall.HAS_MAIL_KEY, false);
                }
            } else if (action == "list") {
                ty.NotificationCenter.trigger(ddz.EventType.RECIVE_MESSAGE_LIST,data);
            }
        }
    },

    onComplain: function(argument) {
        var result = argument;
        var error = result["error"];
        var str;
        if (error) {
            str = error["info"];
        } else {
            var data = result["result"]["success"];
            str = data["info"];
        }
        hall.MsgBoxManager.showToast({title : str});
    },


    //返回商店信息
    onStoreInfo: function(argument) {
        if (typeof(argument) != 'undefined' && typeof(argument["result"]) != 'undefined') {
            hall.gameWorld.parseMatchStore(argument["result"]);
            ty.NotificationCenter.trigger(ddz.EventType.STORE_INFO_UPDATE);
        }
    },


    //发送quickstart成功后，返回的信息
    onClassicPopwnd: function(argument) {
        hall.LOGD(this._TAG, "onClassicPopwnd receivemsg-------------------------");
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_POP_WINDOW, argument);
    },

    onStore: function(argument) {
        var data = argument[0]["result"];
        if (typeof(data) != 'undefined') {
            var action = data["action"];
            var code = data["code"];
            if (action == "jewel_give") {
                if (code == 0) {
                    // h5.ToastLayer.create("已发出赠送请求");
                } else {
                    var info = data["info"];
                    // h5.CommonWindow.createSimple(info);
                }
            }
        }
    },

    onCustomTable: function(params) {
        var data = params['result'];
        if (data) {
            var action = data["action"];
            if (action == "game_data") {
                // hall.CustomRoomManager.parsePersonalData(data);
                ty.NotificationCenter.trigger(ddz.EventType.MSG_CUSTOMTABLE_GAMEDATA, data);
            } else if (action == "fight_data") {
                // hall.CustomRoomManager.parseFightData(data);
                ty.NotificationCenter.trigger(ddz.EventType.MSG_CUSTOMTABLE_FIGHTDATA, data);
            }
        }
    },

    onRoomOnlineInfo : function (value) {
        //这里没有应用
    }

};

//模块启动
hall.hallNetWorkCenter.boot();