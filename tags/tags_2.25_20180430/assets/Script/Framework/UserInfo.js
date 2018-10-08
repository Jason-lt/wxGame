/**
 * @author zhaoliang
 * @date 1.28
 * 
 * 全局对象
 * 个人信息
 */
console.log("UserInfo loaded");
ty.UserInfo = {
    userId: 0,
    userName: 'TuWechatGame',
    userPic: '',
    authorCode : '',
    systemType : 0, //1:苹果非iPhone X  2:iPhone X 3、安卓
    wechatType : "6.6.1",//微信版本号
    model : "未知设备",
    system : "iOS 10.0.1",
    loc : '',
    wxgame_session_key : "",

    clickStatEventType :{
        clickStatEventTypeUserFrom : 99990001,//用户来源

        clickStatEventTypeWxLoginStart : 67890005,//微信登录开始
        clickStatEventTypeWxLoginSuccess : 67890006,//微信登录成功
        clickStatEventTypeWxLoginFailed : 678900007,//微信登录失败

        clickStatEventTypeAuthorizationStart : 67890008,//授权开始
        clickStatEventTypeAuthorizationSuccess : 67890009,//授权成功
        clickStatEventTypeAuthorizationFailed : 67890010,//授权失败

        clickStatEventTypeLoginSDKStart : 67890011,//登录SDK开始
        clickStatEventTypeLoginSDKSuccess : 67890012,//登录SDK成功
        clickStatEventTypeLoginSDKFailed : 67890013,//登录SDK时失败

        clickStatEventTypeTCP_Start : 67890014,//TCP连接开始
        clickStatEventTypeTCP_Success : 67890015,//TCP连接成功
        clickStatEventTypeTCP_Failed : 67890016,//TCP连接失败

        clickStatEventTypeFriendCombatClick : 67890017,//主界面好友约战按钮点击
        clickStatEventTypeFriendRoomCreateClick : 67890018,//创建房间按钮点击
        clickStatEventTypeFriendRoomDissolveClick : 67890019,//解散按钮点击次数
        clickStatEventTypeFriendRoomDuiju : 67890020,//对局详情按钮点击

        clickStatEventTypeInviteFriendClick : 67890021,//邀请好友按钮点击
        clickStatEventTypeInviteFriendSuccess : 67890022,//邀请好友分享成功
        clickStatEventTypeInviteFriendCardClick : 67890023,//邀请卡片按钮点击
        clickStatEventTypeInviteFriendCardSuccess : 67890024,//邀请卡片激活

        clickStatEventTypeStartFriendGame : 67890025,//好友桌开场时参数
        clickStatEventTypeEndFriendGame : 67890026,//好友桌结束时参数

        clickStatEventTypeStartFriendFail : 67890027,//进入好友桌牌桌错误
        clickStatEventTypeStartFriendTime : 67890028//创建房间成功
    }
};
