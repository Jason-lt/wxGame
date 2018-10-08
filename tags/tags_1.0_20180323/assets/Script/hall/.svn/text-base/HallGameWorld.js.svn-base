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
            m_ledLast: 0,  // 新到消息的放置位置
            m_ledCapacity: 20,  //消息最大总量
            m_ledBeWork: false,  //消息是否正在播放
            m_storeConfig: [],
            m_todoTask: new TodoTaskVec(),
            m_normalRooms: []
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
        var sessions = result["sessions"];
        for (var i = 0, len = sessions.length; i < len; i++) {
            rooms.push(new ddz.ConfigRoomSession(sessions[i]));
        }
        this.model.m_normalRooms = rooms;
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

    parseLed: function(result) {
        var newMessage = [];
        for (var i = 0; i < result.length; i++) {
            newMessage.push({
                "text": result[i].text,
                "color": cc.color(result[i].color),
                "size": 22
            });
        }
        var model = this.model;
        model.m_ledList[model.m_ledLast] = newMessage;
        model.m_ledLast = (model.m_ledLast + 1) % model.m_ledCapacity;
    }
});