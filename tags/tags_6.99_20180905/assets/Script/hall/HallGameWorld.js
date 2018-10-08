var TodoTaskVec = require('TodoTaskVec');

cc.Class({

    ctor: function() {
        this._TAG = 'hall.GameWorld';
        this.model = {

            m_coinList: [], // 金币商品列表,存放StoreItemInfo类对象
            m_itemList: [], // 道具商品列表,存放StoreItemInfo类对象
            m_diamondList: [], // 钻石商城列表
            m_jewelList: [], // 宝石列表
            m_msgPrivateVec: null, // 消息集合
            m_msgGlobalVec: null, // 消息集合
            m_ledList: [], // ledInfo信息列表
            m_ledIndex: -1, // 当前播放的led消息
            m_ledTableList: [], // 牌桌内ledInfo信息列表
            m_ledLast: 0,  // 新到消息的放置位置
            m_ledTableLast: 0,  // 新到消息的放置位置
            m_ledCapacity: 20,  //消息最大总量
            m_ledBeWork: false,  //消息是否正在播放
            m_storeConfig: [],
            m_todoTask: new TodoTaskVec(),
            m_normalRooms: [],
            m_onlineInfos: [],
            personInfo:null,
        };

        this.normal = {
            isSelectedPic: false, //个人中心是否选择头像了
            avatarPicIndex: 0, //用户选择的图片的索引
            m_matchWait: null // 比赛暂存信息，赋值在大厅页，在牌桌内使用过后置空，用于比赛的断线重连
        };

        this.firstChargeItem = null;

        hall.LOGD(this._TAG, "ctor in hall._GameWorld");
    },

    // 默认的析构函数
    destroy: function() {
        this.model = null;
        this.normal = null;
        hall.LOGD(this._TAG, "destroy in hall._GameWorld");
    },

    //处理个人信息
    parsePersonInfo:function(result){
        hall.LOGW("","file = [HallGameWorld] fun = [parsePersonInfo] userInfo = " + JSON.stringify(result.userInfo));
        if (!this.model.personInfo) {
            this.model.personInfo = new hall.PersonInfo();
        }
        if (result.userInfo) {
            this.model.personInfo.parseUserInfo(result.userInfo);
        }
    },

    // 处理商品信息
    parseMatchStore: function(result) {
        // 金币商品信息
        var items;
        var tabs = result["tabs"];
        var coinItems;
        var diamondItems;
        var jewelItems;
        if (result["conf"]) {
            this.model.m_storeConfig = result["conf"];
        }
        var i, list, item;
        for (i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var sub = tab["subStore"];
            if (sub == "coin") {
                coinItems = tab["items"];
            } else if (sub == "diamond") {
                diamondItems = tab["items"];
            } else if (sub == "jewel") {
                jewelItems = tab["items"];
            }
        }
        if (coinItems) {
            list = [];
            for (i = 0; i < coinItems.length; i++) {
                item = new hall.StoreItemInfo();
                item.parseStoreItemInfo(coinItems[i]);
                list.push(item);
            }
            this.model.m_coinList = list;


        }
        if (diamondItems) {
            list = [];
            for (i = 0; i < diamondItems.length; i++) {
                item = new hall.StoreItemInfo();
                item.parseStoreItemInfo(diamondItems[i]);
                list.push(item);
            }
            this.model.m_diamondList = list;
        }

        if (jewelItems) {
            list = [];
            for (i = 0; i < jewelItems.length; i++) {
                item = new hall.StoreItemInfo();
                item.parseStoreItemInfo(jewelItems[i]);
                list.push(item);
            }
            this.model.m_jewelList = list;
        }
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MATCH_STORE);
    },

    parseNormalRooms: function(result) {
        var rooms = [];
        var sessions = result["sessions"] || [];
        for (var i = 0, len = sessions.length; i < len; i++) {
            rooms.push(new ddz.ConfigRoomSession(sessions[i]));
        }
        this.model.m_normalRooms = rooms;
        this.model.m_onlineInfos = result['onlineInfos'];
    },

    getRoomsByType: function(type) {
        var room = hall.GlobalFuncs.FindInArrayBuFun(this.model.m_normalRooms, function(element) {
            return element.m_type == type;
        });
        if (room) {
            return room.m_rooms;
        }
        return [];
    },

    getRoomOnlineInfo:function(id) {
        var online = this.model.m_onlineInfos[1];
        if (typeof(online) != 'undefined') {
            if (online[id + ""] != null) {
                var onlineNum = online[id];
                return onlineNum;
            }
        }
        return -1;
    },

    parseLed: function(result) {
        var newMessage = [];
        for (var i = 0; i < result.length; i++) {
            if (result[i].text.indexOf("通关奖励") > 0) {
                var _text = result[i].text;
                var startIndex = _text.indexOf('[')+1;
                var endIndex = _text.indexOf(']');
                var str = _text.substring(startIndex,endIndex);
                var _string = _text.replace(str, hall.GlobalFuncs.SliceStringToLength(str, 8));
                newMessage.push({
                    "text": _string,
                    "color": result[i].color,
                    "size": 28
                });
            }
        }
        var model = this.model;
        model.m_ledList[model.m_ledLast] = newMessage;
        model.m_ledLast = (model.m_ledLast + 1) % model.m_ledCapacity;
    },

    parseGameLed: function(result){
        var newMessage = [];
        for (var i = 0; i < result.length; i++) {
            if(result[i].text.indexOf("||") > 0){
                var _text = result[i].text;
                var _arr = _text.split("||");
                var grade = _arr[0];
                var tips =  _arr[1];
                var startIndex = tips.indexOf('[')+1;
                var endIndex = tips.indexOf(']');
                var str = tips.substring(startIndex,endIndex);
                var _string = tips.replace(str, hall.GlobalFuncs.SliceStringToLength(str, 10));
                newMessage.push({
                    "text": _string,
                    "color": result[i].color,
                    "size": 28,
                    "grade": grade
                });
            }
        }
        var model = this.model;
        model.m_ledTableList.push(newMessage);
    }

});