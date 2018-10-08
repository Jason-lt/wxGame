require('HallUserInfo');

// 一个座位的数据结构
ddz.SeatInfo = cc.Class({

    ctor: function() {
        this.model = {
            // 普通变量
            m_state: ddz.Enums.SeatState.SEATDZSTAT_WAIT, // 座位状态
            m_bIsTuoguan: 0, // 服务器托管,0为no,1为yes
            m_call: -1, // 叫的分数。-1还没叫，0不叫。1-3表示分数
            m_show: 0, // 是否显示明牌,0为no,大于0为yes
            m_tbc: 0, // 宝箱总局数
            m_tbt: 0, // 宝箱已玩局数
            m_mscore: 0, // 比赛积分
            m_mrank: 0, // 比赛排名
            m_robot: 0,
            // 对象或存放对象的数组
            m_card: [], // 存放本座位的手牌
            user_info: new hall.HallUserInfo(), // 存放本座位的用户信息
            m_ownroom_data :{"plays":0,"wins":0,"bombs":0,"lords":0},    //初始值
            m_cardNote : 0
        };
        this.hasData = false;
        ddz.LOGD(null, "ctor in new ddz.SeatInfo");
    },

    //判断是否某个userid
    isUserId: function(userId){
        return this.model.user_info.normalInfo.userId == userId;
    },

    sex: function() {
        return this.model.user_info.udataInfo.m_sex;
    },

    _dumpCards: function() {
        var s = "";
        var cards = this.model.m_card;
        for (var i = 0; i < cards.length; i++) {
            s += cards[i];
            s += " ";
        }
        ddz.LOGD(null, s);
    },

    resetCardsWithLaizi: function(lz_point, lz_number) {
        var cards = this.model.m_card;
        for (var i = 0; i < cards.length; i++) {
            var point = ddz.GlobalFuncs.GetCardPointByNum(cards[i]);
            if (point - 1 == lz_point) {
                cards[i] = lz_number;
            }
        }
    },

    //如果出的牌不在手牌里，也不会崩溃或者报错，只是不进行删除，实际中应该不允许出现打出不存在的手牌
    playCards: function(cards) {
        // ddz.LOGD(null, "before play cards....");
        // this._dumpCards();
        // ddz.LOGD(null, "play cards....");
        // hall.GlobalFuncs.PrintArray(cards);
        var my_cards = this.model.m_card;
        for (var i = 0; i < cards.length; i++) {
            var c1 = cards[i];
            var index = -1;
            for (var j = 0; j < my_cards.length; j++) {
                var c2 = my_cards[j];
                if (c1 == c2 || (c1 > 53 && c2 > 53)) { //cards里面会是癞子实际值，my_cards里面会是癞子原本值，但都是>53，所以只要都是癞子就符合
                    index = j;
                    break;
                }
            }
            if (index >= 0) {
                my_cards.splice(index, 1);
            }
        }
        // ddz.LOGD(null, "after play cards.....");
        // this._dumpCards();
    },

    /**
     * 其它两家,在好友场里出牌,好友场里,其它家手牌全部为-1,无法判断,直接减就行。
     * @param cards
     */
    playCardsInFriend:function (cards) {
        this.model.m_card.length -= cards.length;
    },

    // 默认的析构函数
    destroy: function() {
        this.model = null;
        ddz.LOGD(null, "destroy in ddz.SeatInfo");
    },

    // 
    parseSeatInfo: function(seat) {
        if(!seat) {
            return;
        }
        if (seat['uid'] == 0){
            //玩家离开,后端发给前端的uid是0,清空数据
            this.clean();
            this.hasData = false;
            return;
        }
        var model = this.model;
        model.user_info.parseAsPlayer(seat);
        if (typeof(seat["state"]) != 'undefined') {
            model.m_state = seat["state"];
        }
        if (typeof(seat["seatState"]) != 'undefined') {
            model.m_state = seat["seatState"];
        }
        if (typeof(seat["robot"]) != 'undefined') {
            model.m_bIsTuoguan = seat["robot"];
        }

        
        model.m_call = seat["call"];
        model.m_show = seat["show"];
        model.m_tbc = seat["tbc"];
        model.m_tbt = seat["tbt"];
        model.m_mscore = seat["mscore"];
        model.m_mrank = seat["mrank"];
        model.m_robot = seat["robot"];

        if (typeof(seat["card"]) != 'undefined') {
            model.m_card = seat["card"];
        }
        var roomdata = seat["ownroom_data"];
        if(roomdata) {
            model.m_ownroom_data = roomdata;
        }
        model.m_cardNote = seat["cardNote"];
        this.hasData = true;
    },

    //设置变量为初始状态
    clean: function() {
        var model = this.model;
        model.m_state = ddz.Enums.SeatState.SEATDZSTAT_WAIT;
        model.m_bIsTuoguan = 0;
        model.m_call = -1;
        model.m_show = 0;
        model.m_tbtotal = 0;
        model.m_tbplayed = 0;
        model.m_iMatchScore = 0;
        model.m_iMatchRank = 0;
        model.m_robot = 0;
        model.m_card = [];
        model.user_info = new hall.HallUserInfo();
        this.hasData = false;
        ddz.LOGD(null, "clean in ddz.SeatInfo");
    },

    //设置为明牌
    setShowCards: function() {
        //这是在地主发出明牌信息后，收到服务器的回应后，由客户端手动设置为显示明牌，show的值设置为2
        this.model["m_show"] = 2;
    },

    //设置为非明牌，在一局游戏结束后进行
    setNotShowCards: function() {
        this.model["m_show"] = 0;
    },
    
    //当前座位是否显示为明牌
    isShowCard: function() {
        return this.model["m_show"] > 0;
    },

    // 获取明星头像ID
    starHeadId:function(){
        return this.model.user_info.gdataInfo.starHeadId();
    }
});
