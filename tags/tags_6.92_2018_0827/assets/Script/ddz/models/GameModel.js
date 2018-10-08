// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

ddz.gameModel = {
    LAST_GETDAYREWARD_TIME :"LAST_GETDAYREWARD_TIME",
    ONSHOW_PARAMS : "ONSHOW_PARAMS",
    DEBUG_MODE : "DEBUG_MODE",
    ORIGINCARDS : "DORIGINCARDS",
    SHARE_MOMENTS_NUMBER : "SHARE_MOMENTS_NUMBER",
    CONTINUOUSLOGIN : "CONTINUOUSLOGIN",
    YESTERDAYSHARE : "YESTERDAYSHARE",
    ONCEPLAYGAME : "ONCEPLAYGAME",

    normalWindow : null,

    _matchRecords : null,

    isNewUser : true,
    isLimit : false,

    shareConfig : null,
    matchingMassage : null,
    resurgenceConfig : null,
    rewardAnduchangConfig : null,
    shareMoments : null,
    notifyInfo:{},
    inviteConfig : [],

    inviteShowList : [],
    inviteNewShowList : [],
    allCount : 0,
    massageCount : 0,
    watchVideoCount : 0,
    dayLoginCount : 0,
    gongZhonghaoCardPoint:0,    // 
    gongZhonghaoMenuPoint:0,
    firstWithDrawPoint:0,
    firstUseJiPaiQiPoint:0,
    isLoadTableScene : false,
    throughCount : -1,
    isAcceptGameWin : false,

    isBringVersion : false,
    
    messageRewardTitle:"",

    notifyMailMessage:[],
    /**
     * 获取比赛列表
     */
    getMatchList:function () {
        // var pars = {
        //     "cmd": "game",
        //     "params": {
        //         "action": "async_upgrade_hero_match",
        //         "gameId": 6
        //     }
        // };

        // hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 获取新人限时礼包奖励
     */
    getNewGiftReward:function (inviteeId,giftId) {
        if(!inviteeId){
            return;
        }
        inviteeId = parseInt(inviteeId);
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_new_gift_reward",
                "gameId": 6,//9999
                "giftUserId": inviteeId,
                "giftId": giftId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    sendVersion: function() {
        var params = {
            'cmd': "game",
            'params' : {
                'action':'version_update',
                "gameId": 6,
                'version':ty.SystemInfo.version
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 领取推荐奖励
     */
    getInviteReward:function (inviteeId) {
        if(!inviteeId){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_invite_reward",
                "gameId": 6,//9999
                "inviteeId": inviteeId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 
     */
    getInviteRewardDay:function (inviteeId) {
        if(!inviteeId){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_day_invite_reward",
                "gameId": 6,//9999
                "inviteeId": inviteeId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 每日邀请福利
     */
    getDayInviteReward:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_day_invite_info",
                "gameId": 6,//9999
                "userId": ty.UserInfo.userId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 领取推荐新人奖励
     */
    getNewInviteReward:function (inviteeId) {
        if(!inviteeId){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_new_invite_reward",
                "gameId": 6,//9999
                "rewardState": inviteeId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 领取每日登录奖励
     */
    getWatchVideoReward:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_watch_video_reward",
                "gameId": 6 //9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    shareToCheckReward: function(sharePoint) {
        var pars = {
            "cmd": ddz.EventType.HALL_SHARE2,
            "params": {
                "action": "check_reward",
                "gameId": ddz.GameId,//9999
                // "pointId": 67890000
                "pointId": sharePoint || 67890000
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 分享得钻石
     * @param sharePoint 分享点
     */
    shareToGetreward:function (sharePoint) {
        if(!sharePoint || sharePoint == 0){
            return;
        }
        if(ddz.gameModel.isBringVersion){
            return;
        }
        var pars = {
            "cmd": ddz.EventType.HALL_SHARE2,
            "params": {
                "action": ddz.EventType.GET_REWARD,
                "gameId": ddz.GameId,//9999
                // "pointId": 67890000
                "pointId": sharePoint || 67890000
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 收藏桌面icon是否
     * @param sharePoint 分享点  
     */
    getShoreCut:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": ddz.EventType.ACTION_SHORT_CUT,
                "gameId": ddz.GameId,//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 检查分享点是否有
     * @param sharePoint 分享点
     */
    checkShareReward:function (sharePoint) {
        var pars = {
            "cmd": ddz.EventType.HALL_SHARE2,
            "params": {
                "action": ddz.EventType.CHECK_REWARD,
                "gameId": ddz.GameId,
                // "pointId": 67890000
                "pointId": sharePoint || 67890000
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 提现
     */
    getCashReward:function (cash) {
        if (cash < 0) return;
        var pars = {
            "cmd": ddz.EventType.CMD_CASH,
            "params": {
                "action": "get_cash",
                "gameId": 9999,//9999
                "value": cash,
                "wxappId":ty.SystemInfo.wxAppId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 红包券兑换金币
     */
    getCashCoin:function (cash) {
        if (cash < 0) return;
        var pars = {
            "cmd": ddz.EventType.CMD_CASH,
            "params": {
                "action": "exchange_chip",
                "gameId": 9999,//9999
                "value": cash,
                "wxappId":ty.SystemInfo.wxAppId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 每日邀请奖励绑定邀请人
     */
    bindInviteCode_ID:function (inviterId) {
        if(!parseInt(inviterId)){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "bind_day_invite_Id",
                "gameId": 6,//9999
                "inviterId": inviterId
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 绑定新人邀请人
     */
    bindNewInviteCode:function (inviteCode) {
        if(!parseInt(inviteCode)){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "bind_new_invite_code",
                "gameId": 6,//9999
                "inviteCode": inviteCode
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 查询邀请奖励
     */
    queryInviteInfo:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_invite_info",
                "gameId": 6//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 查询邀请新人奖励
     */
    queryNewInviteInfo:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_new_invite_info",
                "gameId": 6//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 查询邀请奖励配置
     */
    queryInviteConfig:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_invite_config",
                "gameId": 6//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 查询观看广告福利
     */
    queryWatchVideoReward:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_watch_video_status",
                "gameId": 6//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 获取宝箱奖励
     */
    getBoxReward:function (boxUserId,boxId,groupId) {
        if (!boxUserId || boxUserId == ""){
            return
        }
        if (boxUserId == ty.UserInfo.userId){
            boxId = "self" + boxId
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_box_reward",
                "gameId": 6,
                "boxUserId": boxUserId,
                "boxId": boxId,
            }
        };

        if (groupId) {
            pars.params.groupId = groupId;
        }

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 获取通关失败时,看广告的次数配置
     */
    setPersonInfo: function(micro_signal,isVisible,signature,constellation,province,district) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'set_user_info',
                'gameId' : ty.SystemInfo.gameId,
                "userInfo":{
                    "micro_signal":micro_signal,
                    "isVisible":isVisible,
                    "signature":signature,
                    "constellation":constellation,
                    "province":province,
                    "district":district,
                    "sex":hall.ME.udataInfo.m_sex
                }
            }
        };

        hall.MsgFactory._sendCmd(params);
    },

    //互助宝箱,将分享点奖励存入宝箱
    saveRewardToBox:function(pointId){
        if (!pointId) {
            return
        }
        if(ddz.gameModel.isBringVersion){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "save_reward_to_box",
                "gameId": 6,
                "pointId": pointId,
            }
        };
        hall.LOGW("","file = [GameModel] fun = [saveRewardToBox] pars = " + JSON.stringify(pars));
        hall.MsgFactory._sendCmd(pars);
    },

    //互助宝箱,打开宝箱奖励
    getOpenBox:function(){
        var pars = {
            "cmd": "game",
            "params": {
                "action": "open_reward_in_box",
                "gameId": 6,
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    //互助宝箱,获取宝箱奖励
    getHelpBoxReward:function(boxUserId){
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_reward_in_box",
                "gameId": 6,
                "boxUserId": boxUserId,
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    //获取公告信息UPDATE_COMMON_CONFIG
    getCommonConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'notifys'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    // //获取分享配置信息
    // getShareCommonConfig: function() {
    //     var params = {
    //         'cmd': 'game',
    //         'params': {
    //             'action' : 'common_config',
    //             'gameId' : ty.SystemInfo.gameId,
    //             'configKey' : 'shareConfig'
    //         }
    //     };
    //     hall.MsgFactory._sendCmd(params);
    // },

    /**
     * 获取通关失败时,看广告的次数配置
     */
    getFightMatchAdConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'fightMatchAdConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },



    /**
     * 取当前关卡失败后,要看广告次数
     * @param guan 当前关卡
     * @param tg 通关次数
     * @param failCont 当前关卡失败次数
     * @param isNewUser 是否为新用户
     */
    getFightMatchAdConfigJson:function (guan, tg, failCont, isNewUser) {

        if (!this.fightMatchAdConfig) {
            return 1
        }

        var checkHitKey = function (keyStr, inValue) {
            var kv, hitValue;
            if (keyStr.indexOf(',') > -1){
                kv = keyStr.split(',');
                hitValue = inValue >= parseInt(kv[0]) && inValue <= parseInt(kv[1]);
            }
            else{
                kv = parseInt(keyStr);
                hitValue = inValue == kv;
            }
            return hitValue;
        };

        var keys;

        var cfg = isNewUser ? this.fightMatchAdConfig['newUser'] : this.fightMatchAdConfig['oldUser'];

        for (var key in cfg){
            keys = key.split('_');
            if (checkHitKey(keys[0], guan) && checkHitKey(keys[1], tg) && checkHitKey(keys[2], failCont)){
                return cfg[key][0];
            }
        }

        return 1;
    },

    //获取Arena复活配置信息
    getArenaMatchConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'arenaMatchConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 救济金配置
     */
    getAlmsConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'alms'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 服务器配置
     */
    getServerConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'serverConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 提审版本
     */
    getBringConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'bringConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 牌桌Banner广告配置
     */
    getTableBannerConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'tableBannerConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 牌桌上部Banner广告配置
     */
    getTableTopBannerConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'tableTopBannerConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 金币场Banner广告配置
     */
    getGoldTableBannerConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'goldTableBannerConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 金币场Banner广告配置
     */
    getMatchTableBannerConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'matchTableBannerConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 房间列表banner广告配置
     */
    getRoomListBannerConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'roomListBannerConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     *banner复活配置
     */
    getBannerResurgenceConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'bannerResurgenceConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 跳关配置
     */
    getSkipCustomConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'skipCustomsConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 获得奖励方式看视频,分享
     */
    getRewardMethod: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'congratulationGetReward'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 宝箱分享回来tips
     */
    getBoxShareSuccessTips: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'boxShareSuccessTips'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取匹配界面Tips配置信息
    getMatchingMassageConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'matchingMassage'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取复活条件配置信息
    getResurgenceConfigConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'resurgenceConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取金币场结算奖励 / 补偿 配置信息
    getRewardAnbuchangConfigConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'rewardAnduchangConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取通关领红包配置(isType  ads:看广告  share:分享)
    getcongratulationGetRedPacketConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'congratulationGetRedPacket'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取分享朋友圈配置信息
    getShareMomentsConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'shareMoments'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取结算界面输赢分享奖励赔偿
    getWinLoseShareReward:function(isWin) {
        var params = {
            "cmd":ddz.EventType.CMD_DIZHU,
            "params":{
                "gameId": 6,
                "action": "winLoseShareReward",
                "winOrLose": isWin
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    // 拉取老用户能否获取奖励  / 用户是否点击过收藏桌面icon
    getOldUserChipReward:function() {

        requestAnimationFrame(function () {
            var sceneInfo = ty.UserInfo.onShowParam || wx.getLaunchOptionsSync();
            var loginType = 0;
            if (sceneInfo.scene == 1089){
                loginType = 0;
            }
            else if (sceneInfo.scene == 1035){
                loginType = 1;
            }
            else if (sceneInfo.scene == 1074){
                loginType = 2;
            }
            else{
                loginType = 3;
            }

            var params = {
                "cmd":ddz.EventType.CMD_DIZHU,
                "params":{
                    "gameId": ty.SystemInfo.gameId,
                    "action": "get_old_user_chip_reward",
                    "loginType" : loginType
                }
            };
            hall.MsgFactory._sendCmd(params);
        });
    },

    /**
     * 设置通关次数
     * @param tgCount 通关次数
     */
    setTongGuanCount:function(tgCount) {
        var sec = hall.GlobalTimer.getCurLastSecond();
        var params = {
            "cmd":'game',
            "params":{
                "gameId": ty.SystemInfo.gameId,
                "action": "set_temp_data",
                "lifeTime": sec,
                "dataKey": "resurgence",
                "data"  : {"tgCount":tgCount}
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    // 设置闯关赛失败临时数据
    setTempDataWithMatchFailTime:function(failCount) {
        var sec = hall.GlobalTimer.getCurLastSecond();
        var params = {
            "cmd":'game',
            "params":{
                "gameId": ty.SystemInfo.gameId,
                "action": "set_temp_data",
                "lifeTime": sec,
                "dataKey": "resurgence",
                "data"  : {"match":failCount}
            }
        };
        hall.MsgFactory._sendCmd(params);
    },
    // 设置Arena失败临时数据
    setTempDataWithArenaFailTime:function(failCount) {
        var sec = hall.GlobalTimer.getCurLastSecond();
        var params = {
            "cmd":'game',
            "params":{
                "gameId": ty.SystemInfo.gameId,
                "action": "set_temp_data",
                "lifeTime": sec,
                "dataKey": "resurgence",
                "data"  : {"arena":failCount}
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    // 获取失败临时数据
    getTempData:function() {
        var params = {
            "cmd":'game',
            "params":{
                "gameId": ty.SystemInfo.gameId,
                "action": "get_temp_data",
                "dataKey":"resurgence"
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    parseGame:function (value) {
        hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action){
            case ddz.EventType.ACTION_RECORDS : {
                // this.parseMatchList(value.result);
                this.parseMatchRecord(value.result);
                break;
            }
            case "query_invite_info" : {
                this.updateRewardMassage(value);
                break;
            }
            case "query_new_invite_info" : {
                this.updateNewRewardMassage(value);
                hall.GlobalFuncs.onShareReward_NewFriend(value.result);
                break;
            }
            case "get_invite_reward" : {
                break;
            }
            case "get_new_invite_reward" : {
                if (value.result.count) {
                    ddz.GlobalFuncs.playShareZuanShi(value.result.count);
                }
                break;
            }
            case "query_invite_config" : {
                this.parseQueryInviteConfig(value.result);
                break;
            }
            case "common_config" : {
                this.parseCommonConfig(value.result);
                break;
            }
            case "async_common_arena_match": {
                var matches = value.result["matches"] || [];
                hall.ME.matchInfo.parseMatchListInfo(matches);
                ty.NotificationCenter.trigger(ddz.EventType.ASYNC_COMMON_ARENA_MATCH);
                break;
            }
            case "shortcut": {
                if (value.result.sucess == 1) {  // 1 成功, 2 失败
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_GUIDE_ICON_STATE, false);
                }
                break;
            }
            case "get_temp_data" : {
                this.parseFailTempData(value.result);
                // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_FAIL_TEMP_DATA, value.result);
                break;
            }
            case "query_watch_video_status" : {
                this.parseWatchVideoStatus(value.result);
                break;
            }
            case "get_watch_video_reward" : {
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_VIDEO_REWARD,value.result);
                break;
            }
            case "get_box_reward" : {
                hall.LOGW("","file = [GameModel] fun = [parseGame] value.result = " + JSON.stringify(value.result));
                if (value.result.rewardMsg) {
                    var _rewardMsg = value.result.rewardMsg;
                    if(_rewardMsg.indexOf("钻石") > 0){
                        var _index = _rewardMsg.indexOf("钻石") + 2;
                        var _num = Number(_rewardMsg.substring(_index));
                        if (_num > 0) {
                            ddz.GlobalFuncs.playZuanShi(false,this,_num,false);
                        }else {
                            hall.MsgBoxManager.showToast({title:_rewardMsg});
                        }
                    }else if (_rewardMsg.indexOf("金币") > 0){
                        var _index = _rewardMsg.indexOf("金币") + 2;
                        var _num = Number(_rewardMsg.substring(_index));
                        if (_num > 0) {
                            ddz.GlobalFuncs.playZuanShi(false,this,_num,true);
                        }else {
                            hall.MsgBoxManager.showToast({title:_rewardMsg});
                        }
                    }else if (_rewardMsg.indexOf("红包券") > 0){
                        var _index = _rewardMsg.indexOf("红包券") + 3;
                        var _num = parseInt(_rewardMsg.substring(_index)) / 100;
                        if (_num > 0) {
                            ddz.GlobalFuncs.playZuanShi(false,this,_num,true,true);
                        }else {
                            hall.MsgBoxManager.showToast({title:_rewardMsg});
                        }

                    }else if (_rewardMsg.indexOf("记牌器") > 0){
                        hall.LOGW("","file = [GameModel] fun = [parseGame] 记牌器 ");
                        var _index = _rewardMsg.indexOf("记牌器") + 3;
                        var _num = Number(_rewardMsg.substring(_index));
                        if (_num > 0) {
                            ddz.GlobalFuncs.playZuanShi(false,this,_num,true,false,true);
                        }else {
                            hall.MsgBoxManager.showToast({title:_rewardMsg});
                        }
                    }else{
                        hall.MsgBoxManager.showToast({title:_rewardMsg});
                    }
                }
                break;
            }
            case "query_day_invite_info" : {
                // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_VIDEO_REWARD,value.result);
                if (ddz.isClickShareReward) {
                    ddz.isClickShareReward = false;
                    hall.GlobalFuncs.onShareDiamondReward(value.result);
                }else {
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT,value.result);
                }
                break;
            }
            case "get_day_invite_reward" : {
                if (value.result.count) {
                    ddz.GlobalFuncs.playShareZuanShi(value.result.count);
                    if (ddz.ddz_dayWelfare) {
                        ddz.ddz_dayWelfare.updateShareInfo(value.result);
                    }
                }
                break;
            }
            case "save_reward_to_box" : {   //保存到宝箱
                hall.LOGW("","file = [GameModel] fun = [parseGame] value.result = "  + JSON.stringify(value.result));
                if (value.result.rewards) {
                    var isType = "";
                    var _count = 0;
                    if (value.result.rewards['item:1311']) {
                        isType = 'item:1311';
                        _count = value.result.rewards['item:1311'];
                    }else if (value.result.rewards['user:chip']) {
                        isType = 'user:chip';
                        _count = value.result.rewards['user:chip'];
                    }

                    if (_count > 0) {
                        ddz.GlobalFuncs.playZuanShiBox(_count,isType);
                    }

                    ddz.gameModel.checkShareReward(ddz.Share.SharePointType.shareFriend);
                }
                break;
            }
            case "open_reward_in_box" : {   //打开互助宝箱
                if (ddz.isClickOpenBox) {
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeOpenHelpBox, ["openBox"]);
                    hall.GlobalFuncs.onFriendHelpBox(value.result);
                    ddz.isClickOpenBox = false;
                }else {
                    ty.NotificationCenter.trigger(ddz.EventType.IS_HAVE_REWARD, value.result);
                }
                break;
            }
            case "new_gift_reward_tips" : {   //通知新人有人点了他的卡片
                if(value.result && value.result.mail){
                    var mail = value.result.mail;
                    // var tips = hall.GlobalFuncs.replaceKeyWordInString(mail);
                    hall.MsgBoxManager.showToast({title : mail});
                }
                break;
            }
            case "get_new_gift_reward" : {   //获取新人限时礼包奖励
                //TODO:获取新人限时礼包
                break;
            }
            case "set_user_info" : {   //保存个人信息
                if(value.result && value.result.success == 1){
                    hall.MsgBoxManager.showToast({title : '保存成功!'});
                    hall.gameWorld.parsePersonInfo(value.result);
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_CELA_MENU_INFO);
                }
                break;
            }
        }
    },
    parseWatchVideoStatus : function (result) {
        if(result.status == 1){
            this.watchVideoCount = 1;
        }else {
            this.watchVideoCount = 0;
        }
        // this.allCount = this.massageCount + this.dayLoginCount + this.watchVideoCount;
        // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT);
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_WATCH_VIDEO_STATUS, result);
    },
    parseFailTempData : function (result) {
        var curDate = hall.GlobalTimer.getCurDay();
        hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_FAIL_DATE, curDate);
        var matchCount;
        var arenaCount;
        var firstWithDraw;
        var countDic = {};
        if(result.data){
            matchCount = result.data.match || 0;
            arenaCount = result.data.arena || 0;
            firstWithDraw = result.data.first_withdraw || false;
            countDic = {"match":matchCount,"arena":arenaCount,"firstWithDraw":firstWithDraw};
            ty.UserInfo.tgCount = result.data.tgCount || 0; //读取当天通关次数
            ty.UserInfo.lastUpdateTgDate = hall.GlobalTimer.getCurDay();
            ty.UserInfo.matchFailCount = result.data.match || 0; //闯关失败次数
            ty.UserInfo.arenaFailCount = result.data.arena || 0; //arena失败次数
        }
        ddz.LOGD("","file = [GameModel] fun = [parseFailTempData] countDic = " + JSON.stringify(countDic));
        hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.FAIL_NUMBER_LIST, JSON.stringify(countDic));
    },
    parseMatchRecord:function (result) {
        // var result = {
        //     "cmd":"game",
        //     "result":{
        //         "action":"async_upgrade_hero_match",
        //         "gameId":6,
        //         "userId":10014,
        //         "clientId":"H5_5.1_weixin.weixin.0-hall6.weixin.rich",
        //         "matches":[
        //             {
        //                 "roomId":6789,
        //                 "playMode":"123",
        //                 "name":"百万英雄闯关赛",
        //                 "type":"async_upgrade_hero_match",
        //                 "records":[
        //                     {
        //                         "stageIndex":2,
        //                         "state":2,
        //                         "gameFlow":null,
        //                         "enterTime":1523788615,
        //                         "isSave":true,
        //                         "roomId":67891000
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // };

        this._matchRecords = null;
        if (result.matches && result.matches.length > 0){
            var records = result.matches[0].records;
            if (records && records.length > 0){
                this._matchRecords = records;
            }
        }

        hall.LOGW("==","==========ddz.friendModel.isEnterTable========="+ddz.friendModel.isEnterTable+"==="+ty.UserInfo.loc);
        if(ddz.friendModel.isEnterTable){
            if(this._matchRecords){
                ddz.MsgFactory.resumeMatch();
            }else{
                if(ty.UserInfo.loc == '0.0.0.0'){
                    ddz.friendModel.enterFTTable(ddz.Share.shareKeywordReplace.inviteFriendID);
                }else {

                }
            }
        }
        var _stageIndex = 0;
        if (this._matchRecords && this._matchRecords[0].stageIndex){
            _stageIndex = this._matchRecords[0].stageIndex;
        }
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_MATCH_RECORD,_stageIndex);
    },
    updateRewardMassage : function (result) {
        var resultMap;
        if(result){
            resultMap = result.result;
        }
        var showList = [];
        var giveCount = 0;
        var allCount = 0;
        var inviteeList = resultMap.inviteeList;
        if(!inviteeList){
            inviteeList = [];
        }
        var mixGiveCount = ddz.gameModel.inviteConfig.length;
        var nowCount = resultMap.inviteeList.length > mixGiveCount ? mixGiveCount : resultMap.inviteeList.length;
        for (var i = 0 ; i < 10 ; i ++){
            giveCount = parseInt(ddz.gameModel.inviteConfig[i]);
            if(i < inviteeList.length){
                inviteeList[i].bindRewardCount = giveCount;
                if(inviteeList[i].rewardState == 1){
                    allCount += giveCount;
                }
                inviteeList[i].count = i +1;
                inviteeList[i].nowCount = nowCount > i +1 ? i+1 : nowCount;
                showList.push(inviteeList[i]);
            }else {
                showList.push({pic:"",rewardState:0,count:i + 1,userId:0,name:"玩家",nowCount:nowCount,bindRewardCount:giveCount});
            }
        }
        var loginCount = ddz.GlobalFuncs.setDayLoginRewardCount();
        loginCount = loginCount > 0 ? loginCount : 0;
        this.massageCount = allCount;
        this.dayLoginCount = loginCount;
        this.allCount = this.massageCount + this.dayLoginCount;
        this.inviteShowList = showList;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_MASSAGE);
        // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT);
    },
    updateNewRewardMassage : function (result) {
        var resultMap;
        if(result){
            resultMap = result.result;
        }
        var rewardState = resultMap.rewardState;
        if(!rewardState){
            rewardState = [];
        }
        var rewardsByIndex = resultMap.rewardConfig;
        var showList = [];
        if(!rewardsByIndex){
            rewardsByIndex = [];
        }
        for (var i = 0 ; i < rewardsByIndex.length ; i ++){
            var reward = {};
            reward.bindRewardCount = rewardsByIndex[i].count;
            reward.inviteedCode = rewardsByIndex[i].getCode;
            reward.count = rewardsByIndex[i].inviteNum;
            reward.nowCount = reward.count > resultMap.totalNum ? resultMap.totalNum : reward.count;
            if(!rewardsByIndex[i] || !rewardsByIndex[i].getCode || !rewardState[rewardsByIndex[i].getCode]){
                reward.rewardState = 0;//0:不可领取,1:可领取,2:已领取
            }else {
                reward.rewardState = rewardState[rewardsByIndex[i].getCode];
            }
            showList.push(reward);
        }
        this.inviteNewShowList = showList;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_NEW_REWARD_MASSAGE);
    },
    parseQueryInviteConfig : function (value) {
        ddz.gameModel.queryInviteInfo();
        this.inviteConfig = [1,1,1,1,1,2,2,2,2,2];
        if(value && value.rewards && value.rewards.rewardsByIndex){
            this.inviteConfig = value.rewards.rewardsByIndex;
        }
        hall.LOGD(this._TAG, "parseQueryInviteConfig-------------------------"+ JSON.stringify(this.inviteConfig));
    },

    // 解析透传参数数据
    parseCommonConfig:function (value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.configKey){
            case "notifys" : {
                this.saveNotifysConfig(value);
                // this.notifyInfo = value;
                // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,value);
                break;
            }
            // case "shareConfig" : {
            //     this.saveShareConfig(value.config);
            //     // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,value);
            //     break;
            // }
            case "matchingMassage" : {
                this.saveMatchingMassageConfig(value.config);
                // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,value);
                break;
            }
            case "arenaMatchConfig": {
                this.saveArenaMatchConfigJson(value.config);
                break;
            }
            case "resurgenceConfig": {
                this.saveResurgenceConfigConfigJson(value.config);
                break;
            }
            case "rewardAnduchangConfig": {
                this.saveRewardAnduchangConfigJson(value.config);
                break;
            }
            case "shareMoments": {
                this.saveShareMomentsConfigJson(value.config);
                break;
            }
            case "alms": {
                this.saveAlmsConfigJson(value.config);
                break;
            }
            case "serverConfig": {
                this.saveServerConfigJson(value.config);
                break;
            }
            case "bringConfig": {
                this.saveBringConfigJson(value.config);
                break;
            }
            case "tableBannerConfig": {
                this.saveTableBannerConfigJson(value.config);
                break;
            }
            case "tableTopBannerConfig": {
                this.saveTableTopBannerConfigJson(value.config);
                break;
            }
            case "matchTableBannerConfig": {
                this.saveMatchTableBannerConfigJson(value.config);
                break;
            }
            case "roomListBannerConfig": {
                this.saveRoomListBannerConfigJson(value.config);
                break;
            }
            case "bannerResurgenceConfig": {
                this.saveBannerResurgenceConfigJson(value.config);
                break;
            }
            case "goldTableBannerConfig": {
                this.saveGoldTableBannerConfigJson(value.config);
                break;
            }
            case "boxShareSuccessTips": {
                this.saveBoxShareSuccessTipsJson(value.config);
                break;
            }
            case "skipCustomsConfig": {
                this.saveSkipCustomsConfigJson(value.config);
                break;
            }
            case "congratulationGetReward": {
                this.saveCongratulationGetRewardJson(value.config);
                break;
            }
            case "fightMatchAdConfig": {
                this.saveFightMatchAdConfigJson(value.config);
                break;
            }
            case "congratulationGetRedPacket": {
                this.saveCongratulationGetRedPacketJson(value.config);
                break;
            }
        }
    },

    saveNotifysConfig : function (resultValue) {
        this.notifyInfo = resultValue.config;
        var notifyList = this.notifyInfo.info;
        var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
        var indexList = JSON.parse(indexStr);
        if (indexList.length > 60){
            indexList.splice(0,indexList.length - 30);
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
        }
        var unReadCount = 0;
        var autoShowCount = 0;
        var autoShowList = [];

        for (var i = 0; i < notifyList.length; i++){
            var notify = notifyList[i];
            if (indexList.indexOf(notify.index) == -1) {
                notify.readed = 0;
                unReadCount ++;
                if(notify.autoShow){
                    autoShowCount ++;
                    autoShowList.push(notify.index);
                }
            }else {
                notify.readed = 1;
            }
        }

        this.notifyInfo.unReadCount = unReadCount;
        this.notifyInfo.autoShowCount = autoShowCount;
        this.notifyInfo.autoShowList = autoShowList;
        this.notifyInfo.getInfo = 1;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG);
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_GIFTBAG_COUNT);

        hall.LOGW("====gameModel====","======================="+JSON.stringify(this.notifyInfo));

        // this.notifyInfo = resultValue;
        // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,resultValue);

    },
    // saveShareConfig : function (value) {
    //     if (hall.GlobalFuncs.isEmptyObject(value)){
    //         return;
    //     }
    //     this.shareConfig = value;
    // },

    saveShareConfigFromHttp : function (value) {

        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }

        //要进行处理,因为少了分享点和群验证标识
        var shareExt = value['shareExt'];
        delete value['shareExt'];

        var shareCfg, extCfg;
        for (var shareKey in value){
            shareCfg = value[shareKey];
            extCfg = shareExt[shareKey];
            if (extCfg){
                for (var subKey in extCfg){
                    shareCfg[subKey] = extCfg[subKey]; //把扩展属性,添加到主配置上
                }
            }
        }

        this.shareConfig = value;
    },

    saveMatchingMassageConfig : function (value) {
        if(!value || !value.length || value.length < 1){
            return;
        }
        this.matchingMassage = value;
    },
    saveShareMomentsConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.shareMoments = value;
    },
    getShareConfig :function() {
        return this.shareConfig;
    },

    saveArenaMatchConfigJson : function(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.arenaMatchConfig = value;
    },
    saveResurgenceConfigConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.resurgenceConfig = value;
    },

    saveRewardAnduchangConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.rewardAnduchangConfig = value;
    },

    saveCongratulationGetRedPacketJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.congratulationGetRedPacketConfig = value;
    },

    saveAlmsConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.almsConfig = value;
    },
    saveServerConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.serverConfig = value;
    },
    saveBringConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.saveBringConfig = value;
        if (ty.SystemInfo.version == value.version){
            ty.UserInfo.isInBSGS = true;
            ddz.gameModel.isBringVersion = true;
        }else {
            ddz.gameModel.isBringVersion = false;
        }
    },
    saveTableBannerConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.tableBannerConfig = value;
    },
    saveTableTopBannerConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.tableTopBannerConfig = value;
    },
    saveMatchTableBannerConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.matchTableBannerConfig = value;
    },
    saveRoomListBannerConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.roomListBannerConfig = value;
    },
    saveBannerResurgenceConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.bannerResurgenceConfig = value;
    },
    saveGoldTableBannerConfigJson : function (value) {
    if (hall.GlobalFuncs.isEmptyObject(value)){
        return;
    }
    this.goldTableBannerConfig = value;
},
    saveBoxShareSuccessTipsJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.boxShareSuccessTips = value;
    },
    saveSkipCustomsConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.skipCustomsConfig = value;
    },
    saveCongratulationGetRewardJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.congratulationGetReward = value;
    },


    saveFightMatchAdConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }

        /*
        当前关_通关次数_失败次数
        * {
         "2,3_1,10_1,5" :[2]
         }
         * */

        this.fightMatchAdConfig = value;
    },

    getServerConfigJson : function() {
        return this.serverConfig;
    },
    getBringConfigJson : function() {
        return this.saveBringConfig;
    },

    getTableBannerConfigJson : function() {
        return this.tableBannerConfig;
    },
    getTableTopBannerConfigJson : function() {
        return this.tableTopBannerConfig;
    },

    getGoldTableBannerConfigJson : function() {
        return this.goldTableBannerConfig;
    },

    getMatchTableBannerConfigJson : function() {
        return this.matchTableBannerConfig;
    },

    getRoomListBannerConfigJson : function() {
        return this.roomListBannerConfig;
    },
    getBannerResurgenceConfigJson : function() {
        return this.bannerResurgenceConfig;
    },

    getBoxShareSuccessTipsJson : function() {
        return this.boxShareSuccessTips;
    },
    getSkipCustomsConfigJson : function() {
        return this.skipCustomsConfig;
    },
    getCongratulationGetRewardJson : function() {
        return this.congratulationGetReward;
    },
    
    getAlmsConfigJson : function() {
        return this.almsConfig;
    },

    getArenaMatchConfigJson : function() {
        return this.arenaMatchConfig;
    },

    parseWinLoseShareReward : function (result) {
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_WINLOSESHAREREWARD,result);
    },

    getCurMatchRecords:function () {
        return this._matchRecords;
    }
};