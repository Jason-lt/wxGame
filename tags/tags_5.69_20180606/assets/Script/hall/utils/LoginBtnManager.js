/**
 * Created by xujing on 2018/5/30.
 * 登录按钮管理类
 */
hall.loginBtnManager = {
    // showLoginBtn:function () {
    //
    //     var btnWidth = 390;
    //     var btnHeight = 119;
    //     var btnToBottom = 110;
    //
    //     if (wx.hasOwnProperty('createUserInfoButton')){
    //
    //         var sysInfo = wx.getSystemInfoSync();
    //         var screenWidth = sysInfo.screenWidth;
    //         var screenHeight = sysInfo.screenHeight;
    //
    //         var bi = screenWidth/640;
    //
    //         btnWidth = 390 * bi;
    //         btnHeight = 119 * bi;
    //
    //         var button = wx.createUserInfoButton({
    //             type: 'image',
    //             // text: '进入游戏',
    //             image : ty.SystemInfo.cdnPath + 'res/raw-assets/resources/main/loginBtn.png',
    //             style: {
    //                 left: (screenWidth - btnWidth)/2,
    //                 top: screenHeight - btnHeight/2 - btnToBottom,
    //                 width: btnWidth,
    //                 height: btnHeight
    //             }
    //         });
    //
    //         button.show();
    //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!']);
    //         button.onTap(function (res) {
    //             ddz.LOGD('UserInfoButton onTap ',JSON.stringify(res));
    //             // ty.TuyooSDK.login();
    //             //{"errMsg":"getUserInfo:fail auth deny"} 拒绝
    //             //{"errMsg":"getUserInfo:ok  接受
    //
    //             if (res.errMsg == 'getUserInfo:ok'){
    //                 //接受
    //                 button.hide();
    //                 ty.wxUserInfo = true;
    //                 ty.NotificationCenter.trigger(ddz.EventType.GET_USER_INFO, res);
    //                 ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!']);
    //             }
    //             else{
    //                 ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败']);
    //             }
    //         });
    //     }
    //     else{
    //         var btnLogin = new cc.Node('Sprite');
    //         var sp = btnLogin.addComponent(cc.Sprite);
    //
    //         var containerRect = cc.rect(0, 0, btnWidth, btnHeight);
    //
    //         cc.eventManager.addListener({
    //             event: cc.EventListener.TOUCH_ONE_BY_ONE,
    //             swallowTouches: true,
    //             onTouchBegan: function(touch, event) {
    //                 var pos = btnLogin.convertToNodeSpace(touch.getLocation());
    //                 return cc.rectContainsPoint(containerRect, pos);
    //             },
    //             onTouchEnded: function(touch, event) {
    //                 ddz.LOGD('hall.loginBtnManager ','进入游戏按钮点击');
    //                 ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!']);
    //                 wx.getUserInfo({
    //                     withCredentials:true,
    //                     success: function(res) {
    //                         ddz.LOGD('wx.getUserInfo ','授权成功!');
    //                         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!']);
    //                         // ty.TuyooSDK.loginTuyooWithCode(code, res.userInfo, res.iv, res.encryptedData);
    //                         ty.wxUserInfo = true;
    //                         ty.NotificationCenter.trigger(ddz.EventType.GET_USER_INFO, res);
    //                         btnLogin.destroy();
    //                     },
    //                     fail:function (res) {
    //                         ddz.LOGD('wx.getUserInfo ','授权失败!');
    //                         ty.NotificationCenter.trigger(ddz.EventType.START_AUTHORIZATION_FAILED);
    //                         ddz.needReLogin = true;
    //                         hall.MsgBoxManager.showToast({title : "授权失败,请手动进行授权!"});
    //                         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败']);
    //                     }
    //                 });
    //
    //             },
    //             onTouchMoved: function(touch, event) {
    //
    //             }
    //         }, btnLogin);
    //
    //         cc.loader.load({url: ty.SystemInfo.cdnPath + 'res/raw-assets/resources/main/loginBtn.png', type: 'png'}, function (err, texture) {
    //             if (!err) {
    //                 sp.spriteFrame =  new cc.SpriteFrame(texture);
    //                 btnLogin.x = 320;
    //                 btnLogin.y = btnHeight/2 + btnToBottom;
    //                 btnLogin.parent = cc.director.getScene();
    //             }
    //             else {
    //                 //加载失败
    //             }
    //         });
    //
    //         this.btnLogin = btnLogin;
    //     }
    // },
    showLoginBtn:function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!']);
        wx.authorize({
            scope : "scope.userInfo",
            success : function () {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!']);
                ty.wxUserInfo = true;
                ty.NotificationCenter.trigger(ddz.EventType.GET_USER_INFO, true);
            },
            fail:function () {
                ty.NotificationCenter.trigger(ddz.EventType.START_AUTHORIZATION_FAILED);
                ddz.needReLogin = true;
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败']);
            },
            complete:function () {
            }
        });
    }
};