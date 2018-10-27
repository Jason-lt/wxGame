"use strict";
cc._RF.push(module, 'f84b12eAGtJB6qFeM9nyZLU', 'game_world');
// Script/ddz/game_world.js

"use strict";

// 整个游戏的数据，集中存放
ddz.GameWorld = {
    chatData: [], // 聊天数据缓存
    matchingMassage: ["闯关失败不要怕，钻石可以复活噢", "邀请新玩家，你和ta都可以得到钻石哟", "每天可以多次闯关，获得多次奖励", "关注【富豪斗地主】公众号每天都能领钻石", "闯七关瓜分百万红包，奖金实时到账"],

    weChatVersionTips: "你当前的微信版本不支持此功能,请升级至6.6.2以上",

    openDataContextNullTips: "页面离家出走啦~",

    getRedPacketTips: "奖励将在24小时内到账,请在微信钱包查收"
};

cc._RF.pop();