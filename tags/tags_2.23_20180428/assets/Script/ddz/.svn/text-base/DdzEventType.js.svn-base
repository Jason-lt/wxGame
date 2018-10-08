//从hall.eventType拷贝而来
// todo:拆分hall和ddz

ddz.EventType = {
    // ----------- 网络消息相关的事件 -----------
    // 网络消息，客户端发给server的叫 CMD_XXX, server 发给客户端的叫 MSG_XXX
    // 把所有的消息名字写到这里，防止写到各个文件内时，引起的混乱

    //==================用户信息相关================================
    CMD_BIND_USER: 'bind_user', //返回user_info
    CMD_SET_USEREINFO: 'set_user', //返回user_info
    CMD_USER_INFO: 'user_info', // 获取user_info
    MSG_USER_INFO: 'user_info', // 返回userInfo
    CMD_BIND_GAME: 'bind_game', // 游戏逻辑登录，大厅版本独用
    CMD_GAME_DATA: 'game_data', // 获取gameData
    MSG_GAME_DATA: 'game_data', // 返回gameData

    MSG_GDATA_BACK:'msg_gdata_back',

    MSG_LOG_OUT: 'logout',

    CMD_CUSTOMTABLE: 'custom_table', //组局玩法新增协议cmd
    MSG_CUSTOMTABLE: 'custom_table',

    MSG_ROOM_ONLINE_INFO: 'room_online_info',



    // CMD_SET_HEADPHOTO: 'set_game_user_head',//设置用户头像
    // MSG_SET_HEADPHOTO: 'set_game_user_head',
    CMD_EVERYTASK: 'every_task',
    MSG_EVERYTASK: 'every_task',

    //======================大厅相关===========================
    CMD_HALL_INFO: 'hall_info',
    MSG_HALL_INFO: 'hall_info',

    // h5 mainScene  先放到这里

    MSG_UPDATE_ROUND_LIST: 'msg_upate_round_list',
    MSG_UPDATE_NOTIFY: 'noitify',
    

    //组局相关
    MSG_ROOM_MYROOMS: 'msg_room_myrooms',
    MSG_ROOM_NEWROOM: 'msg_room_newroom',
    MSG_ROOM_JOINROOM: 'msg_room_joinroom',
    MSG_ROOM_QUITROOM: 'msg_room_quitroom',
    MSG_ROOM_INFO: 'msg_room_info',
    MSG_ROOM_CHAT: 'msg_room_chat',
    MSG_ROOM_RESULT: 'msg_room_result',
    MSG_ROOM_QUICKSTART: 'msg_room_quickstart',
    MSG_ROOM_RESULTLIST: 'msg_room_resultList',
    MSG_ROOM_STANDUP: "msg_room_standup",
    MSG_ROOM_SITDOWN: "msg_room_sitdown",
    MSG_ROOM_JOINHISTORY: "msg_room_joinHistory",

    //custom table
    MSG_CUSTOMTABLE_GAMEDATA: 'msg_ct_gamedata',
    MSG_CUSTOMTABLE_FIGHTDATA: 'msg_ct_fightdata',

    //====================牌桌相关==================================
    CMD_TABLE_QUICKSTART: 'quick_start', //发送quickstart,返回table_info    table_enter   sit   quick_start
    MSG_TABLE_QUICKSTART: 'quick_start', //收到quick start
    MSG_TABLE_TABLEINFO: 'table_info',
    MSG_TABLE_POPWND: 'popwnd', //quickstart成功后，返回的消息
    CMD_TABLE_CALL: 'table_call', //table准备好
    CMD_STAND_UP: 'standup', //从牌桌上站起

    MSG_TABLE_CALL: 'table_call',

    CMD_ROOM_LEAVE: 'room_leave', //发离开桌面的消息,c++那边，暂没做处理

    MSG_TABLE_LEAVE: 'table_leave', //接离开桌面的响应
    MSG_TABLE_SIT: 'sit', //quick_start之后会返回
    MSG_TABLE_ENTER: 'table_enter', //quick_start之后返回

    CMD_CANCEL_DEPOSITE: "robot", //取消托管
    CMD_TABLE_CHAT: "table_chat", //聊天

    //=======================水果大亨模块=========================================
    CMD_FRUIT_QUICKSTART: 'quick_start',

    CMD_NEW_VIP : 'newvip',
    MSG_NEW_VIP : 'newvip',
    MSG_NEW_VIP_RECEIVE : 'newvipreceive',

    //=======================商城相关=====================================
    CMD_STORE_INFO: 'store_config',
    MSG_STORE_INFO: 'store_config',
    STORE_INFO_UPDATE: 'store_info_update',

    CMD_STORE: 'store',
    MSG_STORE: 'store',

    //===========================背包相关=================================
    CMD_BAG_INFO: 'bag',
    MSG_BAG_INFO: 'bag',
    // CMD_PACK_INFO : 'item',
    //==============================消息相关====================================
    CMD_MESSAGE: 'message',
    MSG_MESSAGE: 'message',
    CMD_CUSTOM_RANK : 'custom_rank',
    MSG_CUSTOM_RANK : 'custom_rank',
    RECIVE_MESSAGE_LIST: 'recive_message_list',

    MSG_JEWEL_RANK_BACK: 'message_jewel_back',
    MSG_SYS_MESSAGE_BACK: 'message_sys_back',
    MSG_REC_MESSAGE_BACK: 'message_rec_back',
    MSG_SEND_MESSAGE_BACK: 'message_send_back',
    CMD_HEART_BEAT: 'heart_beat',

    MSG_PROD_DELIVERY: 'prod_delivery', // 购买成功回调
    BUY_MSG_BACK: 'buy_msg_back', //购买的消息返回

    MSG_MODULE_TIP: 'module_tip',
    MSG_MODULE_TIP_BACK: 'module_tip_back',

    // /////////////////////////////////////////////// 组局

    CMD_USER: 'user',
    MSG_USER: 'user',

    MSG_NAME_BACK: 'msg_name_back',

    CMD_ROOM: 'room', // 获取组局
    MSG_ROOM: 'room',


    // 宝石排行榜
    CMD_RANK: 'rank',
    MSG_RANK: 'rank',

    MSG_RANK_BACK: 'msg_rank_back',

    CMD_COMPLAIN: 'complain',
    MSG_COMPLAIN: 'complain',

    CMD_NEW_USER_REWARD: 'new_user_reward', // 领取每日登陆奖励的奖励
    CMD_GET_NSLOGIN_REWARD:'gain_nslogin_reward',
    MSG_LOGIN_REWARD:'gain_nslogin_reward',
    MSG_LED:'led',
    MSG_REWARD_SUCCESS:'gain_reward_success',
    ////////////////////////////////////////////////////

    //===========================好友桌相关============================
    CMD_DIZHU: 'dizhu',
    ACTION_READY: 'ready',                                     // cmd : table_call  好友桌用到
    ACTION_FT_CREATE: 'ft_create',                             // 创建好友桌 cmd : dizhu
    ACTION_FT_ENTER_TABLE : "ft_enter",                        // 进入好友桌 cmd : dizhu
    ACTION_FT_GET_CONF: 'ft_get_conf',                         // 好友桌界面配置 cmd : dizhu
    ACTION_GET_FT_TABLE_RECORD: 'get_ft_table_record',         // 好友桌历史战绩 cmd : dizhu
    ACTION_FT_CHANGE_ROUND_SELECT : 'ACTION_FT_GET_CONF',
    ACTION_GET_MATCH_RULES:'get_match_rules',                  // 游戏规则 cmd : dizhu
    ACTION_FRIEND_RANK_LIST:'friend_rank_list',                 // 好友排行 cmd : dizhu

    ACTION_FT_REQ_DISBIND: 'ft_req_disbind',                    // 请求+回应解散牌桌 cmd : table_call 服务器会广播所有玩家
    ACTION_FT_REQ_DISBIND_ANSWER: 'ft_req_disbind_answer',      // 请求+回应解散牌桌 cmd : table_call  （我请求的）
    ACTION_FT_REQ_DISBIND_RESULT: 'ft_req_disbind_result',      // 回应解散牌桌 cmd : table_call  （后端主动发的解散牌桌结果）

    //解散牌桌状态存储
    ACTION_CAN_ROOM_LEAVE: 'action_can_room_leave', //可以解散牌桌
    ACTION_END_RESULT_SHOW : 'ACTION_END_RESULT_SHOW',

    ACTION_FT_DISBIND: 'ft_disbind',                            // 解散牌桌(最终) cmd : table_call（后端主动发的）
    ACTION_FT_CONTINUE: 'ft_continue',                          // 继续牌桌 cmd : table_call

    ACTION_DUIJU_LIUSHUI:"msg_duiju_liushui",                   // 对局流水

    //==============================任务相关==========================
    //服务器主动要求客户端执行的任务
    MSG_TODO_TASKS: 'todo_tasks',
    //具体任务相关事件

    UPDATE_EVERYDAYLOGIN:'update_everydaylogin',

    MSG_TODO_QUICK_START: 'todo_quick_start',

    // 网页相关

    MSG_ON_LOC: "msg_on_loc",


    // 从网络获取头像图片列表
    CMD_GET_HEAD_PICS: "get_head_pics",
    MSG_GET_HEAD_PICS: "get_head_pics",


    //gdata item,udata变化时，服务器发送的消息
    CMD_DATA_CHANGED: 'update_notify', //[20140514][jinrifeng] 用于接收金币数据更新的消息
    MSG_DATA_CHANGED: 'update_notify',

    //item(道具)变化时，服务器发送的消息

    CMD_ITEM_UPDATE: 'item_list', //[20140514][jinrifeng]用于更新道具数据消息
    MSG_ITEM_UPDATE: 'item_list',


    // ----------- 界面更新的事件-----------
    UPDATE_LOGIN_REWARD_FLIPCARD: 'update_login_reward',


    UPDATE_TABLE_INFO: 'update_table_info',
    UPDATE_POP_WINDOW: 'update_pop_window',

    UPDATE_TABLE_CALL: 'update_table_call',


    UPDATE_TABLE_LEAVE: 'update_table_leave',


    UPDATE_MATCH_STORE: 'update_match_store',

    UPDATE_BAG_INFO: 'update_bag_info',
    UPDATE_BAG_INFO_SUCCESS: 'update_bag_info_success',

    UPDATE_QUICK_START: 'update_quick_start',
    UPDATE_SIT_INFO: 'update_sit_info',

    UPDATE_EVERY_TASK: 'update_every_task',
    UPDATE_MESSAGE_PRIVATE: 'update_message_private',
    UPDATE_MESSAGE_GLOBAL: 'update_message_global',

    UPDATE_REWARD_COUNT:"update_reward_count",

    //支付相关消息
    UPDATE_PAY_FAIL: 'update_pay_fail',
    UPDATE_PAY_SUCCESS: 'update_pay_success',
    UPDATE_PAY_CANCEL: 'update_pay_cancel',

    //[20140514][jinrifeng]用于更新道具数据消息
    UPDATE_ITEM_INFO: "update_item_info", //item(道具)更新消息，需要更新道具数据的界面需要注册此消息
    UPDATE_GDATA_INFO: "update_gdata_info", //gdata更新相关消息，需要更新金币等数据的界面需要注册此消息
    UPDATE_HEAD_PICS: "update_head_pics", // 头像更新成功


    UPDATE_HALL_INFO: "hall_info_data", // msg_factory得到大厅数据后，通知大田过
    UPDATE_BIND_USER_SNS: "bind_old_user_sns", // 老用户绑定账号

    //用于更新倍数
    UPDATE_MULTI: "update_multi",
    ACTION_SYNC_TIMESTAMP: "sync_timestamp", //时间戳

    /*==============================比赛相关===================================*/
    MSG_GAME:'game',
    CMD_CASH:'cash',
    MSG_CASH:'cash',
    ACTION_SAVE:'save',
    ACTION_RESUME:'resume',
    ACTION_RECORDS:'async_upgrade_hero_match',
    ACTION_ENTER_TABLE:'ACTION_ENTER_TABLE',

    /*==============================分享得钻石相关===================================*/

    GET_REWARD : 'get_reward',
    CHECK_REWARD : 'check_reward',
    HALL_SHARE2 : 'hall_share2',
    DAY_LOGIN_REWARD : "day_login_reward",

    /*==============================业务消息===================================*/

    RECIVE_HALL_INFO : "RECIVE_HALL_INFO", //收到hall_info
    RECIVE_MATCH_LIST_INFO : "RECIVE_MATCH_LIST_INFO", //收到比赛列表
    RECIVE_TABLE_INFO : "RECIVE_TABLE_INFO", //收到table_info
    RECIVE_QUICK_START : "RECIVE_QUICK_START", //quick_start
    SHOW_GAME_WIN_ANI : "SHOW_GAME_WIN_ANI",
    UPDATE_MATCH_INFO : "UPDATE_MATCH_INFO",
    UPDATE_WAIT_INFO : "UPDATE_WAIT_INFO",
    UPDATE_MATCH_DES : "UPDATE_MATCH_DES",
    UPDATE_REWARD_MASSAGE : "UPDATE_REWARD_MASSAGE",//分享得钻石收到租还是
    UPDATE_COMMON_CONFIG : "UPDATE_COMMON_CONFIG",    // 透传参数配置
    UPDATE_NOTIFY_COUNT : "UPDATE_NOTIFY_COUNT",    // 通告个数
    UPDATE_CASH_RESULT : "UPDATE_CASH_RESULT",//提现结果通知
    RESET_TABLE : "RESET_TABLE",

    SCROLLTOBOTTOM : "SCROLL_TOBOTTOM",
    REMOVE_MATCHING : "REMOVE_MATCHING",
    REMOVE_TABLE_ANI : "REMOVE_TABLE_ANI",  //删除牌桌的动画,在从牌桌场景切换到其它场景时,如果牌桌上在动画正在播放,就会报错,要先移除
    CHANGE_TO_SHOW_FROM_HODE : "CHANGE_TO_SHOW_FROM_HODE",//从后台切入前台,切距离上一次切入后台的时间小于一分钟
    GAME_HIDE : "GAME_HIDE",//切入后台
    GET_TIMESTAMP : "GET_TIMESTAMP",//获取当前时间戳
    CHANE_COUNT_LABEL:'CHANE_COUNT_LABEL',
    CLICK_HEAD_BTN:'CLICK_HEAD_BTN',    // 互动表情面板中,点击头像按钮

    UPDATE_REMOVE_CHAT:'UPDATE_REMOVE_CHAT',
    SAVE_MATCH_SUCCESS:'SAVE_MATCH_SUCCESS',
    RESUME_MATCH:'RESUME_MATCH',
    RECIVE_MATCH_RECORD : 'RECIVE_MATCH_RECORD',
    FTINFO_CHANGE : 'FTINFO_CHANGE',

    UPDATE_SHARE_STATE : 'UPDATE_SHARE_STATE',
    UPDATE_DIAMOND_COUNT : 'UPDATE_DIAMOND_COUNT',
    START_AUTHORIZATION_FAILED: 'START_AUTHORIZATION_FAILED',
    
    UPDATE_RANK_LIST: 'UPDATE_RANK_LIST',

    CHANGE_DEBUG_MODE :'CHANGE_DEBUG_MODE',
    START_RECORD :'START_RECORD',
    STOP_RECORD :'STOP_RECORD',
    ERROR_RECORD:'ERROR_RECORD',
    START_PLAY_TABLE_CHAT: 'START_PLAY_TABLE_CHAT',
    END_PLAY_TABLE_CHAT : 'END_PLAY_TABLE_CHAT'
};