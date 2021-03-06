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
    scene_id : "",
    scene_param : "",
    invite_id : 0,

    SYSTEMTYPE : {
        iphoneOtherType : 1,
        iPhoneXType : 2,
        ANDROIDOther : 3,
        iPhone7P8PType : 4,
        ANDROIDVIVO85 : 5
    },

    clickStatEventType :{
        clickStatEventTypeUserFrom : 99990001,//用户来源
        clickStatEventTypeShareAction : 99990002,//分享日志

        clickStatEventTypeShowWindow : 67890031,//弹出窗口
        clickStatEventTypeButtonClick : 67890032,//按钮点击

        clickStatEventTypeWxLoginStart : 10001,//微信登录开始
        clickStatEventTypeWxLoginSuccess : 10002,//微信登录成功
        clickStatEventTypeWxLoginFailed : 10003,//微信登录失败

        clickStatEventTypeAuthorizationStart : 10004,//授权开始
        clickStatEventTypeAuthorizationSuccess : 10005,//授权成功
        clickStatEventTypeAuthorizationFailed : 10006,//授权失败

        clickStatEventTypeLoginSDKStart : 10007,//登录SDK开始
        clickStatEventTypeLoginSDKSuccess : 10008,//登录SDK成功
        clickStatEventTypeLoginSDKFailed : 10009,//登录SDK时失败

        clickStatEventTypeTCP_Start : 10010,//TCP连接开始
        clickStatEventTypeTCP_Success : 10011,//TCP连接成功
        clickStatEventTypeTCP_Failed : 10012,//TCP连接失败

        // clickStatEventTypeFriendCombatClick : 67890017,//主界面好友约战按钮点击
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
