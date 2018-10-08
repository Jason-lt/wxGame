require('AIRobot');

// 斗地主的日志全局函数
ddz.LOGD = function(tag, msg){
	// var logStr = 'ddz : ' + msg;
	// if (tag){
	// 	logStr = tag + 'ddz : ' + msg;
	// }
	// console.log(logStr);
};

ddz.AI = new ddz.AIRobot();


// DDZ的游戏ID
ddz.GameId = 6;
ddz.CardInfoTag = 0;

ddz.SETTING_MUTE_KEY = "setting_mute";
ddz.SETTING_MUSIC_KEY = "setting_music";
ddz.SETTING_EFFECT_KEY = "setting_effect";


ddz.Enums = ddz.Enums || {};
// 游戏主状态

ddz.Enums.GameStatus = {
	GAME_STATUS_UNKNOWN: -1,
	GAME_STATUS_LOADING: 0, // 加载中
	GAME_STATUS_IN_HALL: 1, // 在大厅中
	GAME_STATUS_CHOOSE_ROOM: 2, // 选择房间
	GAME_STATUS_BEGIN: 3, // 游戏刚刚开始
	GAME_STATUS_READY: 4, // 已经准备
	GAME_STATUS_JIAODIZHU: 5, // 叫地主阶段
	GAME_STATUS_PLAYING: 6, // 游戏中
	GAME_STATUS_END: 7 // 结束
};

ddz.Enums.CardSize = {
	CARD_SIZE_BIG: 1,
	CARD_SIZE_MIDDLE: 2,
	CARD_SIZE_SMALL: 3
};

//牌的花色
ddz.Enums.CardColor = {
	CARD_COLOR_HEITAO: 4, //黑桃
	CARD_COLOR_HONGTAO: 3, //红桃
	CARD_COLOR_CAOHUA: 2, //草花
	CARD_COLOR_FANGPIAN: 1 //方片
};

ddz.Enums.CardType = {
	CARD_TYPE_NORMAL: 1, //普通
	CARD_TYPE_KING: 2, //王
	CARD_TYPE_LAIZI: 3 //癞子
};

ddz.Enums.PlayMode = {
	PLAY_MODE_NET: 1, //联网游戏
	PLAY_MODE_SINGLE: 2, //单机游戏
	PLAY_MODE_MATCH: 3, //联网比赛
	PLAY_MODE_REPLAY: 4 //重播
};

ddz.Enums.PlayType = {
	//除了欢乐玩法，其他其实都是在经典玩法基础之上的
	PLAY_TYPE_JINGDIAN: 1, //经典玩法
	PLAY_TYPE_HUANLE: 2, //欢乐斗地主
	PLAY_TYPE_MATCH: 3, //比赛场
	PLAY_TYPE_LAIZI: 4, //癞子玩法
	PLAY_TYPE_ERREN: 5 //二人斗地主
};

ddz.Enums.PlayStatus = {
	PLAY_STATUS_PREPARE: 1, //初始
	PLAY_STATUS_JIAODZ: 2, //叫地主
	PLAY_STATUS_PLAYING: 3,
	PLAY_STATUS_GAMEOVER: 5
};

//座位状态
ddz.Enums.SeatState = {
	SEATDZSTAT_WAIT: 10,
	SEATDZSTAT_READY: 20,
	SEATDZSTAT_PLAYING: 30
};

// 桌子状态
ddz.Enums.TableState = {
	TABLEDSTAT_IDLE: 10,
	TABLEDSTAT_CALLING: 15,
	TABLEDSTAT_ITEM: 17,
	TABLEDSTAT_PLAYING: 20
};

//用户的种类
ddz.Enums.UserType = {
	GUEST_USER: 0, // 	游客账户
	EMAIL_USER: 1, // 	途游账户 (邮箱注册)
	THIRD_USER: 2, // 	第三方账户
	PHONE_USER: 3, // 	途游账户 (手机号码注册)
	ERROR_USER: 4, // 	错误
	LOCAL_USER: 5, // 	未能成功登录，单机用户
	GUEST_USER_OLD: 6, // 	游客
	TUYOO_USER: 7 // 	途游用户
};

//出牌提示： 出牌不符合规则，没有大过上家的牌, 请出牌
ddz.Enums.PlayCardsTip = {
	PLAYCARDSTIP_ILLEGAL: 0,
	PLAYCARDSTIP_NOCARD: 1,
	PLAYCARDSTIP_PLAY: 2
};

ddz.Enums.PlayerSexEnum = {
	SEX_MALE: 0,
	SEX_FEMALE: 1
};

// 牌型
ddz.Enums.PaixingType = {
	SINGLE_CARD: 1, // 单牌
	DOUBLE_CARD: 2, // 对子
	THREE_CARD: 3, // 3不带
	BOMB_CARD: 4, // 炸弹
	THREE_ONE_CARD: 5, // 3带1
	THREE_TWO_CARD: 6, // 3带2
	BOMB_TWO_CARD: 7, // 四个带2张单牌
	BOMB_TWO_TWO_CARD: 8, // 四个带2对
	SHUNZI_CARD: 9, // 顺子
	LIANDUI_CARD: 10, // 连队
	AIRCRAFT_CARD: 11, // 飞机不带
	AIRCRAFT_SINGLE_CARD: 12, // 飞机带单牌
	AIRCRAFT_DOUBLE_CARD: 13, // 飞机带对子
	ROCKET: 14, // 火箭
	ERROR_CARD: 15 // 错误的牌型
};


/********************/

ddz.SESSIONINDEX_JINGDIAN = 0;
ddz.SESSIONINDEX_HUANLE = 1;
ddz.SESSIONINDEX_MATCH = 2;
ddz.SESSIONINDEX_LAIZI = 3;
ddz.SESSIONINDEX_ERREN = 4;

ddz.CARD_BIG_SIZE = cc.size(142, 204);

ddz.CARD_MIDDLE_SIZE = cc.size(86, 106);
ddz.CARD_SMALL_SIZE = cc.size(44, 61);
ddz.PLAYED_CARDS_MAXINLINE = 6;


ddz.CARD_MAX_INTERVAL = 0.5;
ddz.CARD_MIN_INTERVAL = 0.387;
ddz.CARD_MIDDLE_INTERVAL = 0.45;

//单机比赛的基础分固定为100
ddz.SINGLE_SCORE_BASE = 100;

// 每桌最大的座位数
ddz.MAX_SEAT_COUNT = 3;

//开始播放闹钟动画时间
ddz.CLOCK_ANIMATION_SECOND = 5;

ddz.BUCHU_BUTTON_KEY = "buchu";
ddz.RECHOOSE_BUTTON_KEY = "rechoose";
ddz.TISHI_BUTTON_KEY = "tishi";
ddz.PLAY_BUTTON_KEY = "play";

ddz.MSG_TEXT_BUCHU = "不出";

ddz.ROLE_ACTION = {
	CHANGTAI:'changtai',
	SHENGLI:'shengli',
	SHIBAI:'shibai',
	SIKAO:'sikao',
};

ddz.MATCH_REASON = {
	WIN:1,
	FAIL:0
};