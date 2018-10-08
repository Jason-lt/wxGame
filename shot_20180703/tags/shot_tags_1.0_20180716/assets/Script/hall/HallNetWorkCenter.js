/**
 * 大厅消息中心
 */
require('JumpEventType');
hall.hallNetWorkCenter = {
    _TAG : 'hall.hallNetWorkCenter',
    boot : function (){
        hall.LOGD(this._TAG, "boot!");

        this.cmdMap = {};
        //注册消息监听
        ty.NotificationCenter.listen(ty.EventType.TCP_OPENED, this.onTCP_Open, this);
        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);
        this.cmdMap[shot.EventType.MSG_GAME_DATA] = this.onReceiveGameData;
        this.cmdMap[shot.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[shot.EventType.MSG_BAG_INFO] = this.onReceiveBagInfo;
        this.cmdMap[shot.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;
        ty.NotificationCenter.listen(shot.EventType.GET_USER_FEATURE_SUCCESS, this._userFeature, this);
    },
    onReceiveGameData : function(value){
        hall.LOGW(null, "file = [HallNetWorkCenter] fun = [onReceiveGameData] ");
        this.onGameData(value);
        // hall.MsgFactory.getHallInfo(ty.SystemInfo.gameId);
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
        // shot.LOGD(this._TAG, "onReceiveTCP_Msg --ty" + JSON.stringify(value));
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
            }
        }else{
            if (msgCmd == ty.EventType.MSG_LOG_OUT){
                var errMsg = value.error ? value.error.info : null;
                if (errMsg){
                    hall.MsgBoxManager.showToast({title : errMsg});
                }
            }
        }
    },
    // 返回gameData
    onGameData: function(argument) {
        hall.LOGD(this._TAG, 'onGameData');
        if (typeof(argument) != "undefined") {
            if (!hall.GlobalFuncs.checkMsgWithGameId(argument, shot.GameId)) {
                // 大厅的game_data，返回，暂时没内容
                return;
            }
            hall.MsgFactory.getUserInfo(shot.GameId);
        }
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
        ty.UserInfo.isInBSGS = true;
        if(debugMode){
            ty.UserInfo.isInBSGS = !debugMode;
        }
        if (!val.retmsg) {
            return
        }
        ty.UserInfo.featureInfo = val.retmsg;
        ty.UserInfo.isInBSGS = hall.GlobalFuncs.checkBSGS(ty.UserInfo.featureInfo.last_login_city); //是否在北上广深
        // ty.UserInfo.isInBSGS = false;
        ty.UserInfo.ip = ty.UserInfo.featureInfo.last_login_ip; //上一次登录的IP
    },
    onReceiveUserInfo : function(value){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Success, [JSON.stringify(value)]);
        shot.gameModel.getNormalConfig();
        shot.gameModel.getUserInfoForShot();
        shot.gameModel.getShareConfig();
        shot.gameModel.getGunnerShareSchemeConfig();
        hall.MsgFactory.getBagInfo();
        var sceneInfo = ty.UserInfo.onShowParam || wx.getLaunchOptionsSync();
        var scene = ty.UserInfo.scene_id || sceneInfo.scene;
        var query = sceneInfo.query;
        var shareTicket = sceneInfo.shareTicket;
        if (shot.qrCodeOption.withQrCode(scene)){
            //是否为从小程序码进入
            var par = "";
            if (query.hasOwnProperty('scene')){
                //个人小程序码
                par = query.scene;
            }
            else if (sceneInfo.hasOwnProperty('path')){
                par = sceneInfo.path;
            }
            shot.qrCodeOption.runOption(par, scene);
        }
        if(query && query.sourceCode){//从小程序消息卡片中点入
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.inviteCode,shot.Share.clickStatShareType[query.sourceCode],
                query.imageType,"GameStart",JSON.stringify(sceneInfo)]);
            if (query.inviteCode) {
                shot.gameModel.bindMutualInviterId(parseInt(query.inviteCode));
            }

            if (query.inviteCode && shareTicket) {
                var _boxUserId = query.inviteCode;
                hall.LOGW("","file = [HallNetWrokCenter] fun = [onReceiveUserInfo] ty.SystemInfo.boxId = "+JSON.stringify(ty.SystemInfo.boxId));
                shot.Share.getOpenGid(shareTicket,_boxUserId);
            }
        }else {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.from,query.appid,
                "GameStart",JSON.stringify(sceneInfo)]);
        }
        
        if(shot.Share.isOnShare){
            shot.Share.playAnimationAfterShareWithType();
        }
        shot.Share.isOnShare = false;
        //
        // if (ty.SystemInfo.shareTicket &&  ty.SystemInfo.shareTicket != ""){
        //     var shareTicket = ty.SystemInfo.shareTicket;
        //     shot.GlobalFuncs.showRankList(shareTicket);
        // }
        // ty.SystemInfo.shareTicket = "";
    },

    onReceiveBagInfo:function(value){
        if (typeof(value) == 'undefined') {
            return;
        }
        hall.ME.parseBagInfo(value);
    },

    onUpdateChangedData:function(argument){
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
    }
};

//模块启动
hall.hallNetWorkCenter.boot();