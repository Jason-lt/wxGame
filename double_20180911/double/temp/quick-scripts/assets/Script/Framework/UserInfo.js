(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Framework/UserInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '16498+sVNJJ+IO2eyCAX+f7', 'UserInfo', __filename);
// Script/Framework/UserInfo.js

'use strict';

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
    authorCode: '',
    systemType: 0, //1:苹果非iPhone X  2:iPhone X 3、安卓
    wechatType: "6.6.1", //微信版本号
    model: "未知设备",
    system: "iOS 10.0.1",
    loc: '',
    scene_id: 0,
    scene_param: "",
    invite_id: 0,
    onShowParam: null,

    featureInfo: null,
    isInBSGS: true, //是否在北上广深
    ip: '',

    SYSTEMTYPE: {
        iphoneOtherType: 1,
        iPhoneXType: 2,
        ANDROIDOther: 3,
        iPhone7P8PType: 4,
        ANDROIDVIVO85: 5
    },

    clickStatEventType: {
        clickStatEventTypeUserFrom: 99990001, //用户来源
        clickStatEventTypeShareAction: 99990002, //分享日志

        clickStatEventTypeShowAdBtn: 99990003, //分流icon显示
        clickStatEventTypeClickShowQRCode: 99990004, //展示分流倒量的二维码

        clickStatEventTypeClickAdBtn: 99990007, //点击分流icon

        clickStatEventTypeClickDirectToMiniGameSuccess: 99990005, //点击icon,直接拉进小游戏成功（点击确认）
        clickStatEventTypeClickDirectToMiniGameFail: 99990006, //点击icon,直接拉进小游戏失败（点击取消）

        clickStatEventTypeShowWindow: 67890031, //弹出窗口
        clickStatEventTypeButtonClick: 67890032, //按钮点击

        clickStatEventTypeWxLoginStart: 10001, //微信登录开始
        clickStatEventTypeWxLoginSuccess: 10002, //微信登录成功
        clickStatEventTypeWxLoginFailed: 10003, //微信登录失败

        clickStatEventTypeAuthorizationStart: 10004, //授权开始
        clickStatEventTypeAuthorizationSuccess: 10005, //授权成功
        clickStatEventTypeAuthorizationFailed: 10006, //授权失败

        clickStatEventTypeLoginSDKStart: 10007, //登录SDK开始
        clickStatEventTypeLoginSDKSuccess: 10008, //登录SDK成功
        clickStatEventTypeLoginSDKFailed: 10009, //登录SDK时失败

        clickStatEventTypeTCP_Start: 10010, //TCP连接开始
        clickStatEventTypeTCP_Success: 10011, //TCP连接成功
        clickStatEventTypeTCP_Failed: 10012, //TCP连接失败

        clickStatEventTypeWatchVideo: 67890036 //观看广告
    }
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
        //# sourceMappingURL=UserInfo.js.map
        