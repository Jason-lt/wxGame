//  Create by zhanghaibin
//  玩家信息
require('LoginRewardInfo');
require('UserInfoUData');
require('UserInfoGdata');
require('RebateRankInfo');
require('LoginInfo');
require('NormalInfo');
require('MsgInfo');
require('RebateRankInfo');
require('UserHeartBeat');

hall.HallUserInfo = cc.Class({
    ctor: function() {
        this._TAG = "hall.HallUserInfo";
        this.loc = null;            // 标识当前是否在牌桌
        this.udataInfo = new hall.UserInfoUData();
        this.gdataInfo = new hall.UserInfoGdata();
        // 大厅的gameData，包含各游戏的大师分
        this.hallGData = new hall.UserInfoGdata();

        this.loginInfo = new hall.LoginInfo();
        this.loginRewardinfo = new hall.LoginRewardInfo();
        this.normalInfo = new hall.NormalInfo();
        this.msgInfo = new hall.MsgInfo();
        this.mrebateRank = new hall.RebateRankInfo();


        //［20140624］［亓］拥有的medal信息，在牌桌中tableinfo协议里返回
        

        //[20140514][jinrifeng] 道具类

        //[20140529][jinrifeng]排行榜相关类
        // this.rankList = new ddz.CityList();

        /***
         * 0 - 非新手引导阶段
         * 1 - 新手引导之登录奖励
         * 2 - 新手引导之启动资金
         * 3 - 新手引导之快速开始
         */
        this.newTeachState = 0;

        //标记是否在异地登陆
        this.isOtherLogin = false;

        //对象或存储对象的数组
        this.objectInfo = {
            //            benefits: new ddz.UserBenefits(), //  福利
            //            notify: new ddz.UserNotify(),
            // coupon: new ddz.UserCoupon(),
            //            config: new ddz.UserConfig(),
            //            m_matchList: [], // 集合,用于存放ddz.UserMatch类对象
            m_heart: new hall.UserHeartBeat(),
            // mapCHtmls: {}, //  用于存放ddz.Html对象
            //            htmlRoomList: new ddz.UserHtmlRoomLists(), //  2.3之前用的
            //            _matchRoom: new ddz.ConfigRoom(), //  保存用户当前的比赛房间信息，ddz.ConfigRoom对象
            m_pMedalInfos: [] //  用于存放勋章信息，存放hall.MEdalInfo对象
        };

        hall.LOGD(this._TAG, "in ctor");
    },

    getName:function(){
        var name = this.udataInfo.m_name;
        if(name.length == 0) {
            name = "游客"+this.normalInfo.userId;
        }
        return name;
    },

    // 获取金币
    getChip: function(){
        // 大厅版本之后取udata的chip
        return this.udataInfo.m_chip ? this.udataInfo.m_chip : 0;
    },

    // 明星头像ID
    starHeadId:function(){
        return this.gdataInfo.starHeadId();
    },

    // 改变金币
    changeChip: function(param){
        this.udataInfo.m_chip += param;
    },

    // 设置金币
    setChip: function(param){
        this.udataInfo.m_chip = param;
    },

    setAsRandom: function() {
        this.udataInfo.m_sex = parseInt(Math.random());
        this.gdataInfo.m_winrate["pt"] = 534 + parseInt(Math.random() * 100);
        this.gdataInfo.m_winrate["wt"] = 254 + parseInt(Math.random() * 200);

        var len = ddz.ROBOT_NAMES.length;
        this.udataInfo.m_name = ddz.ROBOT_NAMES[parseInt(Math.random() * len)];
        this.udataInfo.m_purl = "http://ddz.image.tuyoo.com/avatar/head_360_08.png";
        this.udataInfo.m_isBeauty = false;
        this.normalInfo.m_localCoin = 429 + parseInt(Math.random() * 382);
        this.normalInfo.m_chip = 899 + parseInt(Math.random() * 729);
        this.normalInfo.userId = 300 + parseInt(Math.random() * 1000);

        var exp = 839 + parseInt(Math.random() * 539);
        this.gdataInfo.m_experience[0] = exp;
        this.gdataInfo.m_level = hall.GlobalFuncs.GetLevelByExp(exp);
        this.gdataInfo.m_experience[1] = hall.GlobalFuncs.GetExpByLevel(this.gdataInfo.m_level - 1);
        this.gdataInfo.m_experience[2] = hall.GlobalFuncs.GetExpByLevel(this.gdataInfo.m_level);
    },

    // 解析UserInfo
    parseUserInfo: function(json) {
        if (json) {
            var result = json['result'];
            this.udataInfo.parse(result['udata']);
            this.gdataInfo.parseGdata(result['gdata']);
            this.normalInfo.userId = result["userId"]; //temp..如果userInfo传回的normal_info里面带了user_id，则从里面解析  //guangy

            if (result["loc"] != "undefined") { //gameid, roomid, tableid, seatId
                this.loc = result["loc"];
                this.handleLoc();
            } else {
                // loc处理完，置空，需测试地主的短线重连
                this.loc = null;
            }
        }
    },
    // 解析BagInfo背包信息
    //     {
    //         "count":"1876张",
    //         "canUse":false,
    //         "gameId":9999,
    //         "name":"参赛券",
    //         "pic":"http://ddz.dl.tuyoo.com/cdn37/hall/item/imgs/item_1007_39.png",
    //         "num":1876,
    //         "id":1007,
    //         "desc":"报名比赛专用，每日登录赠送"
    //     }
    parseBagInfo: function(json) {
        if (json) {
            var result = json['result'];
            var bagList = result["normal_list"];
            if (!bagList || typeof(bagList) == "undefined" || bagList.length < 1){
                return;
            }
            var getNum = false;
            for (var  i = 0 ; i < bagList.length ; i ++){
                var bagInfo = bagList[i];
                var bagID = bagInfo["id"];
                if (bagID == 1311){
                    this.udataInfo.diamondInfo = bagInfo;
                    this.udataInfo.diamondCount = bagInfo["num"];
                    getNum = true;
                    // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_BAG_INFO);
                }
            }
            if (!getNum){
                this.udataInfo.diamondCount = 0;
            }
            // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_BAG_INFO);
        }
    },


    // 解析GameData
    parseGameData: function( json ){
        if (json) {
            var result = json['result'];
            var gameId = result["gameId"];
            hall.LOGD(null, 'gameId = ' + gameId);

            if( gameId == ddz.GameId ){
                // 解析斗地主的gData
                this.gdataInfo.parseGdata(result['gdata']);
            } else if( gameId == ty.SystemInfo.hallId ){
                // 解析大厅的gData
                this.hallGData.parseGdata(result['gdata']);
            } 
        }
    },

    /* loc 0.0.0.0
     * gameId - roomId - tableId - seatId
     */
    handleLoc: function() {
        if (this.loc) {
            var larr = this.loc.split(".");
            hall.LOGD(this._TAG, "send loc event ");
            ty.NotificationCenter.trigger(ddz.EventType.MSG_ON_LOC, larr);
        }
    },

    parseLoginRewardFlipCard: function(json) {
        if (json) {
            this.loginInfo.parse(json);
        }

    },

    parseHallInfo: function(json) {
        
    },
    
    parseAsPlayer: function(seat) {
        hall.LOGD(this._TAG, "ddz.UserInfo parseAsPlayer begin");
        if (typeof(seat["uid"]) != 'undefined') {
            this.normalInfo.userId = seat.uid;
        }
        if (typeof(seat["userId"]) != 'undefined') {
            this.normalInfo.userId = seat["userId"];
        }
        if (this.normalInfo.userId == 0) {
            this.clean();
            return;
        }
        if (typeof(seat["name"]) != 'undefined') {
            this.udataInfo.m_name = seat["name"];
        }
        if (typeof(seat["userName"]) != 'undefined') {
            this.udataInfo.m_name = seat["userName"];
        }
        if (typeof(seat["chip"]) != 'undefined') {
            this.udataInfo.m_chip = seat["chip"];
            hall.LOGD(this._TAG, 'parseAsPlayer chip = ' + this.gdataInfo.m_chip);
        }
        if (typeof(seat["gold"]) != 'undefined') {
            this.normalInfo.m_gold = seat["gold"];
        }
        if (typeof(seat["sex"]) != 'undefined') {
            this.udataInfo.m_sex = seat["sex"];
        }
        if (typeof(seat["fangyan"]) != 'undefined') {
            this.normalInfo.m_fangyan = seat["fangyan"];
        }

        // userinfo和tableInfo用的是purl，sit用的picurl
        if (typeof(seat["picurl"]) != 'undefined') {
            this.udataInfo.purl = seat["picurl"];
        }
        if (typeof(seat["purl"]) != 'undefined') {
            this.udataInfo.m_purl = seat["purl"];
        }
        if( this.udataInfo.m_purl == "" ){
            this.udataInfo.m_purl = "http://ddz.image.tuyoo.com/avatar/head_360_08.png";
        }
        hall.LOGD(null, 'User Pic is : ' + this.udataInfo.m_purl);

        if(typeof(seat["isBeauty"]) != 'undefined'){
            this.udataInfo.m_isBeauty = seat["isBeauty"];
        }

        if (typeof(seat["exp"]) != 'undefined') {
            var exp = seat["exp"];
            this.gdataInfo.m_experience[0] = exp;
            this.gdataInfo.m_level = hall.GlobalFuncs.GetLevelByExp(exp);
            this.gdataInfo.m_experience[1] = hall.GlobalFuncs.GetExpByLevel(this.gdataInfo.m_level - 1);
            this.gdataInfo.m_experience[2] = hall.GlobalFuncs.GetExpByLevel(this.gdataInfo.m_level);
        }
        if (typeof(seat["plays"]) != 'undefined') {
            this.gdataInfo.m_winrate["pt"] = seat["plays"];
        }
        if (typeof(seat['charm']) != 'undefined') {
            this.gdataInfo.m_charm = seat["charm"];
        }

        // 解析明星头像ID
        if( typeof(seat['starid']) != 'undefined'){
            this.gdataInfo.m_starHeadId = seat['starid'];
        } else {
            // 随机明星头像
            this.gdataInfo.randomSetStarHeadId(this.udataInfo.m_sex);
        }

        if (typeof(seat["wins"]) != 'undefined') {
            this.gdataInfo.m_winrate["wt"] = seat["wins"];
        }
        if (typeof(seat["vipzuan"]) != 'undefined') {
            this.udataInfo.m_vip = 0;
            this.normalInfo.m_diamondCount = [];
            for (var t = 0; t < seat["vipzuan"].length; t++) {
                if (typeof(seat["vipzuan"][t]) != 'undefined') {
                    var v = seat["vipzuan"][t];
                    if (v >= 5 && v <= 8) {
                        this.udataInfo.m_vip = v - 4;
                    } else if (v >= 11 && v <= 14) {
                        this.normalInfo.m_diamondCount[v - 11] = 1;
                    }
                }
            }
        }
        if (typeof(seat["level"]) != 'undefined') {
            this.gdataInfo.m_level = seat["level"];
        }
        if (typeof(seat["title"]) != 'undefined') {
            this.normalInfo.m_levelTitle = seat["title"];
        }
 
       
        // 解析大师分的消息
        if(typeof(seat["skillScoreInfo"]) != "undefined"){
            this.gdataInfo.m_skillScoreInfo = null;
            this.gdataInfo.m_skillScoreInfo = seat["skillScoreInfo"];
        }else{
            this.gdataInfo.m_skillScoreInfo = null;
            hall.LOGD(this._TAG, "牌桌里，服务器返回的大师分信息为空");
        }
        hall.LOGD(this._TAG, "ddz.UserInfo parseAsPlayer successed");
    },
    //按照时间从最近的到最晚的排序
    _sortByTime: function(o1, o2) {
        return o2['medal_getmedaltime'] - o1['medal_getmedaltime'];
    },


    clean: function() {
        this.gdataInfo.m_winrate = [];
        this.udataInfo.m_vip = 0;
        this.udataInfo.m_sex = 0;
        this.udataInfo.m_name = "";
        this.udataInfo.m_purl = "";
        this.udataInfo.m_isBeauty = false;
        this.objectInfo.m_pMedalInfos = [];
    }
});
