
console.log("jump EventType loaded");

jump.EventType = {
    // ----------- 网络消息相关的事件 -----------
    // 网络消息，客户端发给server的叫 CMD_XXX, server 发给客户端的叫 MSG_XXX
    // 把所有的消息名字写到这里，防止写到各个文件内时，引起的混乱

    //==================用户信息相关================================
    CMD_BIND_USER: 'bind_user', //返回user_info
    CMD_USER : 'user',
    UPDATE_SHARE_STATE : "UPDATE_SHARE_STATE",
    CMD_USER_INFO: 'user_info', // 获取user_info
    MSG_USER_INFO: 'user_info', // 返回userInfo
    CMD_GAME_DATA: 'game_data', // 获取gameData
    MSG_GAME_DATA: 'game_data', // 返回gameData
    MSG_GAME : "game",

    START_AUTHORIZATION_FAILED : "START_AUTHORIZATION_FAILED",

    //监听
    REWARD_VIDEO_COMPLETE : "REWARD_VIDEO_COMPLETE",
    REWARD_VIDEO_COMPLETE_ERROR : "REWARD_VIDEO_COMPLETE_ERROR",

    CHANGE_ROLE_SPEED : "CHANGE_ROLE_SPEED",
    CHANGE_ROLE_HORIZONTAL_SPEED : "CHANGE_ROLE_HORIZONTAL_SPEED",
    CHANGE_PEDAL_SPEED : "CHANGE_PEDAL_SPEED",
    REMOVE_PEDAL : "REMOVE_PEDAL",
    TOOL_EFFECT_ROLE : "TOOL_EFFECT_ROLE",
    GAME_OVER : "GAME_OVER",
    GAME_RESTART : "GAME_RESTART",
    CHANGE_TOTAL_SCORE : "CHANGE_TOTAL_SCORE",
    SURPASS_OTHERS : "SURPASS_OTHERS",
    UPDATE_ASSETS_COUNT : "UPDATE_ASSETS_COUNT",

    SHOW_CAOPING_AFTER_GAMEOVER : "SHOW_CAOPING_AFTER_GAMEOVER",
    SHOW_MYSCORE_AFTER_GAMEOVER : "SHOW_MYSCORE_AFTER_GAMEOVER",

    RESURGENCE_RESULT : "RESURGENCE_RESULT",
    GET_INVITE_USER_INFO : "GET_INVITE_USER_INFO",

    TOTAL_SCORE : "TOTAL_SCORE"
};