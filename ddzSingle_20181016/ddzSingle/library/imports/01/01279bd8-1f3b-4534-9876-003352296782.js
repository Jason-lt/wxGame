"use strict";
cc._RF.push(module, '01279vYHztFNJh2ADNSKWeC', 'NormalInfo');
// Script/hall/models/NormalInfo.js

"use strict";

/**
 * Created by Eava.wu on 14-4-16.
 *
 */
hall.NormalInfo = cc.Class({
    ctor: function ctor() {
        this.m_isNewUser = false; //是不是新用户
        this.m_type = ""; // 用户类型:360/QQ/游客等
        this.m_snsToken = ""; // SNS账户token
        this.m_snsExpires = 0; // SNS账户token过期时间
        this.m_snsTradeNo = ""; // SNS账户订单号
        this.userId = 0; // 用户ID,游戏中用到，由服务器提供
        this.m_authCode = ""; // AuthCode
        this.m_authInfo = ""; // AuthInfo
        this.m_passWord = ""; // 密码
        this.m_levelTitle = ""; // 等级称号
        this.m_fangyan = 0; // 方言 1＝四川 2＝普通 3＝东北
        this.m_localCoin = 0; // 单机银币数量
        this.m_gold = 0; // 金花
        this.m_chip = 0; // 筹码(更正:单品游戏金币.by FK)
        this.m_diamondCount = []; // 四个钻石的个数。
        this.m_state = 0; // 用户状态 online=0 offline=1
        this.m_location = []; // 用户位置:location[3]是座位位置，1-6，与服务器保持一致。
        this.m_reward = [];
        this.m_dayinfo = [[], [], []]; //  每日登录的VIP,比赛等配置信息
        this.m_strCity = ""; //  陌陌版本记录用户地址位置信息
        this.gameId = 0; //  游戏id
        this.dayfirst = 0; // 是否今日首次登陆
        this.htmlRaffle = "";
        this.code = 0; // 错误码，0 无错误；其它错误码
        this.needreg = 0;
        this.uInfo = "";
        this.m_eType = -1; //  玩家的种类，m_eType的取值是ddz.Enums.UserType中的值
        this.clientid = "";
    }
});

cc._RF.pop();