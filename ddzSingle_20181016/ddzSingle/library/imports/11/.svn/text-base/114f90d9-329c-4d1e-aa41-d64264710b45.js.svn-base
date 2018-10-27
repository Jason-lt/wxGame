"use strict";
cc._RF.push(module, '114f9DZMpxNHqpB1kJkcQtF', 'UserInfoUData');
// Script/hall/models/UserInfoUData.js

"use strict";

//  Create by Eava.wu
//  玩家信息
hall.UserInfoUData = cc.Class({

    ctor: function ctor() {

        this._TAG = "hall.UserInfoUData";

        this.m_snsId = ""; // SNS账户的id
        this.m_name = ""; // 昵称
        this.m_idcardno = ""; // 身份证
        this.m_truename = ""; // 真实姓名
        this.m_snsinfo = "";
        this.m_payCount = 0;
        this.m_detect_phonenumber = "";
        this.m_vip = 0; // vip(等级)0-5，0为非vip.
        this.m_vipInfo = { "level": 0 };
        this.m_sex = 0; // 性别 male=0,female=1
        this.m_source = "";
        this.m_state = 0;
        this.m_isbind = 0;
        this.m_phonenumber = ""; // 电话号码
        this.m_purl = ""; // 头像链接(服务器定义为途游账号的头像url，所以客户端暂不用)
        this.m_isBeauty = false;
        this.m_address = ""; // 地址
        this.m_pdevid = {};
        this.m_chip = 0; // 统一后的金币
        this.m_coin = 0; // 用户金币数量(这里暂时没有用，用得时gdada里的m_chip)
        this.m_diamond = 0; //用户钻石数量
        this.m_jewel = 0; // 用户宝石
        this.m_couponCount = 0;
        this.m_exchangedCoupon = 0;
        this.diamondInfo = {};
        this.diamondCount = 0;
        this.jiPaiQiCount = 0;
        this.m_dayang = 0; // 大洋(add by zj)
        this.m_email = ""; // 邮箱
        this.m_mdevid = "";
        this.m_set_name_sum = -1; // 用户更改昵称的次数,没有更改过是0，大于0则说明更改过
        this.m_youkuvip = false;
        this.m_verified = false;
        this.m_bindMobil = "";
        this.m_wxSubscribe = 0; //-1或不存在 非微信登录 0 未关注 1 已关注 2 已关注并领取奖励

        hall.LOGD(this._TAG, "in ctor");
    },

    parse: function parse(json) {
        hall.LOGD(this._TAG, '=======udata begin========' + JSON.stringify(json));

        this.m_snsId = json['snsId'];
        this.m_name = json['name'];
        this.m_idcardno = json['idcardno'];
        this.m_truename = json['truename'];
        this.m_payCount = json['payCount'];
        this.m_detect_phonenumber = json['detect_phonenumber'];
        this.m_vip = json['vip'];
        this.m_sex = json['sex'];
        this.m_source = json['source'];
        this.m_state = json['state'];
        this.m_isbind = json['isbind'];
        this.m_jewel = json['jewel'];

        if (json['vipInfo']['level'] < 0) {
            json['vipInfo']['level'] = 0;
        }
        if (json['vipInfo']['level'] > 9) {
            json['vipInfo']['level'] = 9;
        }
        this.m_vipInfo = json['vipInfo'];

        var snsinfo = json['snsinfo'];
        this.m_snsinfo = snsinfo;
        if (snsinfo) {
            try {
                hall.LOGD("@@@@", snsinfo);
                var snsobj = JSON.parse(snsinfo);
                this.m_youkuvip = !!snsobj["vip"];
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "javaOnGotUserInfo", "(Ljava/lang/String;)V", snsinfo);
                }
            } catch (error) {
                cc.error(error);
            }
        }

        var bindMobile = json['bindMobile'];
        if (bindMobile != null && typeof bindMobile != 'undefined') {
            this.m_bindMobil = bindMobile;
        }

        var phonenumber = json['phonenumber'];
        if (phonenumber != null && typeof phonenumber != 'undefined') {
            this.m_phonenumber = phonenumber;
        }

        this.m_purl = json['purl'];
        this.m_isBeauty = json['isBeauty'];
        if (this.m_purl == "") {
            this.m_purl = "http://ddz.image.tuyoo.com/avatar/head_360_08.png";
        }
        hall.LOGD(this._TAG, 'UDATA purl is ' + this.m_purl);

        this.m_address = json['address'];
        this.m_pdevid = json['pdevid'];
        this.m_coin = json['coin'];
        // this.m_chip = json['chip']; // 合并后的金币
        this.m_diamond = json['diamond'];
        this.m_couponCount = json['coupon'];
        this.m_exchangedCoupon = json['exchangedCoupon'];
        this.m_dayang = json['dayang'];
        this.m_email = json['email'];
        this.m_mdevid = json['mdevid'];
        this.m_set_name_sum = json["set_name_sum"];
        this.m_wxSubscribe = json["wxSubscribe"];
        ty.NotificationCenter.trigger(ty.EventType.UPDATE_UER_INFO, hall.ME);
        hall.LOGD(this._TAG, '=======udata success========');
        //this.m_diamond = 1;
        ddz.GlobalFuncs.upDateRankDataChip(this.m_chip + "");
    }
});

cc._RF.pop();