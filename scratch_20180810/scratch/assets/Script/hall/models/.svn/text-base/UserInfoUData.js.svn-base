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

        this.m_chip = 0; // 金币
        this.m_coupon = 0; // 奖券（人民币*100）
        this.m_exchangedCoupon = 0; // 已兑换奖券
        this.m_newUserCardId = 0; // 新用户卡牌，有了显示在第一位置
        this.m_nsLoginDays = 0; // 连续登录天数
        this.m_todayInvite = 0; // 今日邀请人数，用于卡片解锁

        this.m_rewardLifeCards = []; // 已奖励过的一生一次的卡牌
        this.m_rewardDailyCards = []; // 已奖励过的每日卡牌

        this.m_shareCount = 0;

        hall.LOGD(this._TAG, "in ctor");
    },

    parseForScratch : function (userInfo) {
        this.m_chip = userInfo.chip;
        this.m_coupon = userInfo.coupon; // 奖券（人民币*100）
        this.m_exchangedCoupon = userInfo.exchangedCoupon; // 已兑换奖券
        this.m_newUserCardId = userInfo.newUserCardId; // 新用户卡牌，有了显示在第一位置
        this.m_nsLoginDays = userInfo.nsLoginDays; // 连续登录天数
        this.m_todayInvite = userInfo.todayInvite; // 今日邀请人数，用于卡片解锁
        scratch.GameWorld.todayInvite = this.m_todayInvite;
        scratch.GameWorld.newUserCardId = userInfo.newUserCardId;
        this.m_rewardLifeCards = userInfo.rewardLifeCards; // 已奖励过的一生一次的卡牌
        this.m_rewardDailyCards = userInfo.rewardDailyCards; // 已奖励过的每日卡牌

        ty.NotificationCenter.trigger(scratch.EventType.UPDATE_USER_INFO);

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