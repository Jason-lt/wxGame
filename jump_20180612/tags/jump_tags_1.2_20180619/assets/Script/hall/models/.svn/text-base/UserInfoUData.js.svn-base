//  Create by Eava.wu
//  玩家信息
hall.UserInfoUData = cc.Class({

    ctor: function() {

        this._TAG = "hall.UserInfoUData";
        this.m_name = ""; // 昵称
        this.m_vip = 0; // vip(等级)0-5，0为非vip.
        this.m_sex = 0; // 性别 male=0,female=1
        this.m_state = 0;
        this.m_purl = ""; // 头像链接(服务器定义为途游账号的头像url，所以客户端暂不用)
        this.m_isBeauty = false;
        this.m_chip = 0; // 统一后的金币
        hall.LOGD(this._TAG, "in ctor");
    },

    parse: function(json) {
        hall.LOGD(this._TAG, '=======udata begin========' + JSON.stringify(json));

        this.m_name = json['name'];
        this.m_vip = json['vip'];
        this.m_sex = json['sex'];
        this.m_state = json['state'];

        this.m_purl = json['purl'];
        this.m_isBeauty = json['isBeauty'];
        if (this.m_purl == "") {
            this.m_purl = "http://ddz.image.tuyoo.com/avatar/head_360_08.png";
        }
        hall.LOGD(this._TAG, 'UDATA purl is ' + this.m_purl);
        this.m_chip = json['chip']; // 合并后的金币
    }
});