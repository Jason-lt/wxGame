/**
 * Created by Eava.wu on 14-4-16.
 * TODO:用户连续登录天数，领取奖励的Model
 */
hall.LoginInfo = cc.Class({
    ctor: function () {
        this.m_rewardstate = []; //  ["CHIP",300,2]   2 代表已经领取状态 1 即将领取
        this.m_vipReward = null; //
        
    },
    parse: function (params) {
        if (params) {
           this.m_rewardstate = params["rewardstate"];
           this.m_vipReward = params["vip_reward"];
        }
    }
});