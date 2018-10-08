//  Create by zhanghaibin
//  玩家信息

require('UserInfoUData');

hall.HallUserInfo = cc.Class({
    ctor: function() {
        this.udataInfo = new hall.UserInfoUData();
    },

    // 解析UserInfo
    parseUserInfo: function(json) {
        if (json) {
            var result = json['result'];
            this.udataInfo.parse(result['udata']);
        }
    },

    //按照时间从最近的到最晚的排序
    _sortByTime: function(o1, o2) {
        return o2['medal_getmedaltime'] - o1['medal_getmedaltime'];
    },


    clean: function() {
        this.udataInfo.m_vip = 0;
        this.udataInfo.m_sex = 0;
        this.udataInfo.m_name = "";
        this.udataInfo.m_purl = "";
        this.udataInfo.m_isBeauty = false;
    }
});
