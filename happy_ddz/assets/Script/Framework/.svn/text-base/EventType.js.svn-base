//
//  event_type.js
//  framework
//
//  Created by zhaoliang on 13-12-11.
console.log("EventType loaded");
var msgId = 0;
ty.EventType = {
    // 网络消息，客户端发给server的叫 CMD_XXX, server 发给客户端的叫 MSG_XXX
    // 把所有的消息名字写到这里，防止写到各个文件内时，引起的混乱

    CMD_USER_INFO: 'user_info',
    MSG_LOG_OUT: 'logout',

    CMD_BIND_USER : 'bind_user', // 返回user_info
    CMD_BIND_GAME: 'bind_game', // 游戏逻辑登录，大厅版本独用

    //服务器推送消息事件
    MSG_REMOTE_NOTIFICATION: 'receive_remote_notefication',

    //SDK相关回调消息,大多消息都有分成功、失败、取消操作。多数情况下BACK取消操作消息可以忽略
    MSG_LOGIN_SUCCESS: 'login_success_ret', // 登录成功
    MSG_LOGIN_FAILED: 'login_failed_ret', // 登录失败
   
    MSG_SET_PLATFORM_USER_INF_SUCCESS: 'set_user_info_success_ret', //设置平台用户信息成功
    MSG_SET_PLATFORM_USER_INF_FAILED: 'set_user_info_failed_ret', //设置平台用户信息失败
    MSG_GET_PLATFORM_USER_INF_SUCCESS: 'get_platform_user_success_ret', //获取平台用户信息成功
    MSG_GET_PLATFORM_USER_INF_FAILED: 'get_platform_user_failed_ret', //获取平台用户信息失败
   
    MSG_GET_FRIEND_LIST_SUCCESS: 'get_friend_list_success_ret', //获取好友列表成功
    MSG_GET_FRIEND_LIST_FAILED: 'get_friend_list_failed_ret', //获取好友列表失败
    MSG_GET_REQ_FRIEND_LIST_SUCCESS: 'get_friend_req_list_success_ret', //获取好友请求成功
    MSG_GET_REQ_FRIEND_LIST_FAILED: 'get_friend_req_list_failed_ret', //获取好友请求失败
    MSG_GET_NEARBY_PLAYER_SUCCESS: 'get_nearby_player_success_ret', //获取附近得玩家成功
    MSG_GET_NEARBY_PLAYER_FAILED: 'get_nearby_player_failed_ret', //获取附近得玩家失败
    MSG_GET_CONTACT_LIST_SUCCESS: 'get_contact_list_success_ret', //上报通讯录成功
    MSG_GET_CONTACT_LIST_FAILED: 'get_contact_list_failed_ret', //上报通讯录失败
    MSG_INVITE_CONTACT_LIST_SUCCESS: 'invite_contact_friend_success_ret', //邀请好友成功
    MSG_INVITE_CONTACT_LIST_FAILED: 'invite_contact_friend_fail_ret', //邀请好友失败
    MSG_GET_RANK_LIST_SUCCESS: 'get_rank_list_success_ret', //获取排名成功
    MSG_GET_RANK_LIST_FAILED: 'get_rank_list_failed_ret', //获取排名失败
    MSG_REPORT_LBS_SUCCESS: 'report_lbs_success_ret', //上报LBS成功
    MSG_REPORT_LBS_FAILED: 'report_lbs_failed_ret', //上报LBS失败
   
    MSG_PAY_TIMEOUT: 'pay_process_timeout', // 购买开始
    MSG_PAY_PROCESSING: 'pay_processing_ret', //购买进行中

    MSG_BUY_SUCCESS: 'buy_success_ret', //购买道具成功
    MSG_BUY_FAILED: 'buy_failed_ret', //购买道具失败
    MSG_BUY_BACK: 'buy_back_ret', //取消购买，或从购买界面返回



    GET_ADMANAGER_ICON_INFO_SUCCESS: 'GET_ADMANAGER_ICON_INFO_SUCCESS', //
    GET_ADMANAGER_BANNER_INFO_SUCCESS: 'GET_ADMANAGER_BANNER_INFO_SUCCESS', //

    MSG_CONSUME_DIAMOND_SUCCESS: 'consume_diamond_success_ret', //消费钻石成功
    MSG_CONSUME_DIAMOND_FAILED: 'consume_diamond_failed_ret', //消费钻石失败
    MSG_BUY_COIN_DIRECT_SUCCESS: 'buy_coin_direct_success_ret', // 钻石直冲金币成功
    MSG_BUY_COIN_DIRECT_FAILED: 'buy_coin_direct_failed_ret', // 钻石直冲金币失败
    MSG_GET_DIAMOND_LIST_SUCCESS: 'request_diamond_list_success_ret', //请求钻石产品列表成功
    MSG_GET_DIAMOND_LIST_FAILED: 'request_diamond_list_failed_ret', //请求钻石列表失败
    MSG_PAY_DIAMOND_SUCCESS: 'pay_diamond_success_ret', //购买钻石成功
    MSG_PAY_DIAMOND_FAILED: 'pay_diamond_failed_ret', //购买钻石失败
    MSG_PAY_DIAMOND_BACK: 'pay_diamond_back_ret', //取消购买钻石，或从购买钻石界面返回

    MSG_WEIXIN_SHARE_SUCCESS: "weixin_share_success_ret", // 微信分享成功
    MSG_WEIXIN_SHARE_FAIL: "weixin_share_failed_ret", // 微信分享失败

    MSG_BIND_PHONE_SUCCESS: "bind_mobile_success", //手机绑定成功

    // tcp状态的事件
    TCP_ERROR: 'tcp_error',
    TCP_CLOSE: 'tcp_close',
    TCP_OPENED: 'tcp_opened', // 连接建立好之后的回调
    TCP_RECONNECT: 'tcp_reconnect',
    TCP_RECEIVE: 'tcp_receive',//长连接接收任何消息的事件

    // update 的几个状态事件
    UPDATE_OK: 'update_ok',
    UPDATE_ERR: 'update_error',
    UPDATE_PROGRESS: 'update_progress',
    HEART_BEAT_LOGIC: 'heart_beat_logic', //  心跳逻辑
    HEART_BEAT: 'heart_beat', //  心跳
    NETWORK_STATE_CHANGE: "network_state_change", //网络连接状态发生变化时触发
    VIEW_MODE_CHANGED: "view_mode_changed", //强制切换横竖屏后回调触发
    FINISH_OPEN_CAMERA: "finish_open_camera",
    FINISH_PICKSAVE: "finish_picksave",

    GET_DIAMOND: "get_diamond",     // 领取钻石
    // GET_DIAMOND_ANI_FINISH : "GET_DIAMOND_ANI_FINISH",
    UPDATE_BUTTON_TEXT: "UPDATE_BUTTON_TEXT",     // 刷新topButton富文本

    UPDATE_UER_INFO: 'update_user_info',
    // 大厅资源加载完毕
    HALL_IMAGE_LOADED_FINISHED: 'HALL_IMAGE_LOADED_FINISHED',

    GET_USER_FEATURE_SUCCESS : 'GET_USER_FEATURE_SUCCESS',
    GET_USER_FEATURE_FAIL : 'GET_USER_FEATURE_FAIL',
    GET_SHARE_CONFIG_SUCCESS : 'GET_SHARE_CONFIG_SUCCESS',
    GET_SHARE_SINGLE_CONFIG_SUCCESS : 'GET_SHARE_SINGLE_CONFIG_SUCCESS',
    GET_SHARE_CONFIG_FAIL : 'GET_SHARE_CONFIG_FAIL',
    GET_SHARE_SINGLE_CONFIG_FAIL : 'GET_SHARE_SINGLE_CONFIG_FAIL',
    WX_LOGIN_SUCCESS:'WX_LOGIN_SUCCESS',

    GET_AD_MSG_SUCCESS : "GET_AD_MSG_SUCCESS", //获取交叉导流信息
    CREATE_TABLE_AD : "CREATE_TABLE_AD", //牌做场景中添加交叉导流
    UPDATE_SXADICON_POS: "UPDATE_SXADICON_POS", //刷新自己的交叉导流位置

};
