(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/singleAI/ddzsingle_string_resource.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5b5feqxivZBurSKF1ae8iQK', 'ddzsingle_string_resource', __filename);
// Script/ComponentScript/singleAI/ddzsingle_string_resource.js

'use strict';

/**
 * Created by tuyoo on 2018/10/15.
 */

ddz.stringMode = {
    DDZ_BUY_DANJI_PRODUCT_SUCCESS: '购买成功',
    DDZ_BUY_DANJI_PRODUCT_FAILED: '购买失败，请重试',
    DDZ_BUY_DANJI_PRODUCT_CANCEL: '取消购买',

    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1002: '2分',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1003: '3分',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1000: '不叫',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1001: '1分',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1006: '抢地主',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1007: '不抢',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1005: '叫地主',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1013: '准备',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1008: '不出',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1009: '重选',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1011: '出牌',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1012: '明牌',
    DDZ_PLAY_OPERATE_CONTROLLER_STRING_1010: '提示',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1011: '继续',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1010: '离开',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1002: '防作弊场禁止查看个人信息',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1003: '投诉将收取',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1001: '倍',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1006: '网络中断，检查一下再试试吧',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1007: '魅力',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1004: '金币押金。异常出牌会退还押金并补偿，正常出牌则押金不退还，请理智投诉。',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1005: '托管太频繁了呦！',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1008: '系统已为您分配随机昵称',
    DDZ_DDZ_PLAY_CONTROLLER_STRING_1009: '网络中断，努力重连中…',

    DDZ_DDZ_TABLE_SINGLE_PROP_MANAGER_STRING_1000: '点击道具可以使用，点击取消开始游戏',
    DDZ_DDZ_TABLE_SINGLE_PROP_MANAGER_STRING_1001: '点击道具可以购买，点击取消开始游戏',
    DDZ_DDZ_TABLE_SINGLE_PROP_MANAGER_STRING_1002: '获取道具信息出错，请排查！',
    DDZ_DDZ_TABLE_SINGLE_PROP_MANAGER_STRING_1003: '道具数量不足，请进行购买！',
    DDZ_DDZ_TABLE_SINGLE_PROP_MANAGER_STRING_1004: '请选择道具！',
    DDZ_DDZ_TABLE_SINGLE_PROP_MANAGER_STRING_1005: '银币不足，留在桌面将自动恢复至',

    DDZ_DDZ_SINGLE_CLEARANCE_STRING_1001: '您已通过此关，继续获取更好的成绩吧！',

    DDZ_DDZ_SINGLE_BREAK_INTRODUCE_STRING_1004: '局以下3星 ',
    DDZ_DDZ_SINGLE_BREAK_INTRODUCE_STRING_1005: '局2星',
    DDZ_DDZ_SINGLE_BREAK_INTRODUCE_STRING_1000: '银币为0',
    DDZ_DDZ_SINGLE_BREAK_INTRODUCE_STRING_1001: '叫三分玩法',
    DDZ_DDZ_SINGLE_BREAK_INTRODUCE_STRING_1002: '抢地主玩法',
    DDZ_DDZ_SINGLE_BREAK_INTRODUCE_STRING_1003: '癞子玩法',

    DDZ_DDZ_MATCH_SIGNUP_LIST_CONTROLLER_STRING_1000: '名',

    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1014: '参赛券',
    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1012: '金币',
    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1010: '请在比赛开始前回到报名等待界面，否则将视为淘汰！',
    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1009: '系统错误！',
    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1008: '您未能及时参赛，请重新报名！',
    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1007: '系统资源不足，比赛未能开始!',
    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1006: '参赛人数不足，比赛未能开始，请重新报名！',
    DDZ_DDZ_MATCH_FULL_SIGNUP_CONTROLLER_STRING_1005: '比赛即将开始，请勿离开...',

    DDZ_PLAY_MATCH_TEXT_ANIMATION_CONTROLLER_STRING_1001: '强赛开始',
    DDZ_PLAY_MATCH_TEXT_ANIMATION_CONTROLLER_STRING_1000: '海选赛开始',
    DDZ_PLAY_MATCH_TEXT_ANIMATION_CONTROLLER_STRING_1002: '决赛开始',
    DDZ_PLAY_GREAT_MASTER_CONTROLLER_STRING_1001: '段',
    DDZ_PLAY_GREAT_MASTER_CONTROLLER_STRING_1000: '斗地主',
    DDZ_PLAY_CHAT_STRING_1001: '真怕猪一样的队友！',
    DDZ_PLAY_CHAT_STRING_1000: '我等的假花儿都谢了!',
    DDZ_PLAY_CHAT_STRING_1003: '我炸你个桃花朵朵开! ',
    DDZ_PLAY_CHAT_STRING_1002: '一走一停真有型,一秒一卡好潇洒。',
    DDZ_PLAY_CHAT_STRING_1005: '风吹鸡蛋壳,牌去人安乐。',
    DDZ_PLAY_CHAT_STRING_1004: '姑娘,你真是条汉子。',
    DDZ_PLAY_CHAT_STRING_1007: '炸得好!',
    DDZ_PLAY_CHAT_STRING_1006: '搏一搏,单车变摩托。',
    DDZ_PLAY_CHAT_STRING_1008: '请输入要发送的信息',

    DDZ_OFFLINE_PROP_LOGIC_STRING_1001: '只能选择一张牌',
    DDZ_OFFLINE_PROP_LOGIC_STRING_1000: '请选择一张牌',
    DDZ_OFFLINE_GAME_LOGIC_STRING_1002: '关卡已解锁',
    DDZ_OFFLINE_GAME_LOGIC_STRING_1003: '您输光了，赠送给您',
    DDZ_OFFLINE_GAME_LOGIC_STRING_1000: '您已通过所有关卡!',
    DDZ_OFFLINE_GAME_LOGIC_STRING_1001: '恭喜您通关，获得',
    DDZ_OFFLINE_GAME_LOGIC_STRING_1004: '银币！',
    DDZ_ASSIST_ELEMENT_STRING_1001: '倍',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1012: '比赛场',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1014: '二人斗地主',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1019: '金币',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1015: '二人斗地主，来单挑哈~',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1013: '斗地主还有比赛啊，有点儿意思！',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1018: '倍，小意思~',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1010: '打出',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1009: '癞子场',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1016: '经典场',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1004: '连胜',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1005: '还不够，继续~',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1006: '欢乐场',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1000: '大满贯',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1001: '哈哈哈，哈哈哈哈~',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1002: '春天',
    DDZ_PLAY_POP_WIN_CONTROLLER_STRING_1003: '赢了个春天，人品爆棚有木有~！',

    DDZ_SHARE_TABLE_ANYTIME: '斗地主牌桌随时炫耀',
    DDZ_SINGLE_PROP_CANNOT_USE_AGAIN: '此道具只能使用一次',

    DDZ_PLAYER_REPORT_ILLEGALITY_SEND_SUCCESS: '举报消息已送达,我们将尽快处理举报内容',
    DDZ_PLAYER_REPORT_ILLEGALITY_SEND_FAILUER: '很抱歉，举报消息发送失败，请稍候重试，谢谢您的支持',

    DDZ_QUIT_MATCH: '现在离开会放弃当前比赛，您确定吗？',

    DDZ_LOGIN_FAILED: '登陆失败了，检查下网络再试试吧',
    DDZ_WILL_GOTO_LOGIN: '需要登录，现在要登录吗？'
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ddzsingle_string_resource.js.map
        