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
        this.cmdMap[jump.EventType.MSG_GAME_DATA] = this.onReceiveGameData;
        this.cmdMap[jump.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
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
        // jump.LOGD(this._TAG, "onReceiveTCP_Msg --ty" + JSON.stringify(value));
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
            if (!hall.GlobalFuncs.checkMsgWithGameId(argument, jump.GameId)) {
                // 大厅的game_data，返回，暂时没内容
                return;
            }
            hall.MsgFactory.getUserInfo(jump.GameId);
        }
    },
    onReceiveUserInfo : function(value){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Success, [JSON.stringify(value)]);
        jump.gameModel.getShareCommonConfig();
        jump.gameModel.getShareMomentsConfig();
        jump.gameModel.getGameLayoutConfig();
        jump.gameModel.queryMutualInviteAssets();

        var sceneInfo = ty.UserInfo.onShowParam || wx.getLaunchOptionsSync();
        var scene = ty.UserInfo.scene_id || sceneInfo.scene;
        var query = sceneInfo.query;
        if (jump.qrCodeOption.withQrCode(scene)){
            //是否为从小程序码进入
            var par = "";
            if (query.hasOwnProperty('scene')){
                //个人小程序码
                par = query.scene;
            }
            else if (sceneInfo.hasOwnProperty('path')){
                par = sceneInfo.path;
            }
            jump.qrCodeOption.runOption(par, scene);
        }
        if(query && query.sourceCode){//从小程序消息卡片中点入
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.inviteCode,jump.Share.clickStatShareType[query.sourceCode],
                query.imageType,"GameStart",JSON.stringify(sceneInfo)]);
            if (query.inviteCode) {
                jump.gameModel.bindMutualInviterId(parseInt(query.inviteCode));
            }
        }else {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom,[scene,query.from,query.appid,
                "GameStart",JSON.stringify(sceneInfo)]);
        }

        // if(jump.Share.isOnShare){
        //     jump.Share.playAnimationAfterShareWithType();
        // }
        // jump.Share.isOnShare = false;
        //
        // if (ty.SystemInfo.shareTicket &&  ty.SystemInfo.shareTicket != ""){
        //     var shareTicket = ty.SystemInfo.shareTicket;
        //     jump.GlobalFuncs.showRankList(shareTicket);
        // }
        // ty.SystemInfo.shareTicket = "";
    }
};

//模块启动
hall.hallNetWorkCenter.boot();