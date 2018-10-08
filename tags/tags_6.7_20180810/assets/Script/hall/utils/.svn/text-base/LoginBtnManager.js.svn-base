/**
 * Created by xujing on 2018/5/30.
 * 登录按钮管理类
 */
hall.loginBtnManager = {

    showLoginBtn:function () {

        var btnWidth = 390;
        var btnHeight = 119;
        var btnToBottom = 140;

        if (this.canShowUserInfoBtn()){

            var sysInfo = wx.getSystemInfoSync();
            var screenWidth = sysInfo.screenWidth;
            var screenHeight = sysInfo.screenHeight;

            var bi = screenWidth/640;

            btnWidth = 390 * bi;
            btnHeight = 119 * bi;

            var button = wx.createUserInfoButton({
                type: 'image',
                // text: '进入游戏',
                image : ty.SystemInfo.cdnPath + 'res/raw-assets/resources/main/loginBtn.png',
                style: {
                    left: (screenWidth - btnWidth)/2,
                    top: screenHeight - btnHeight/2 - btnToBottom,
                    width: btnWidth,
                    height: btnHeight
                }
            });

            button.show();

            button.onTap(function (res) {
                ddz.LOGD('UserInfoButton onTap ',JSON.stringify(res));
                // ty.TuyooSDK.login();
                //{"errMsg":"getUserInfo:fail auth deny"} 拒绝
                //{"errMsg":"getUserInfo:ok  接受
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!']);
                if (res.errMsg == 'getUserInfo:ok'){
                    //接受
                    button.hide();
                    hall.loginBtnManager.destroyHideBtn();
                    hall.loginBtnManager.destroyTableBtn();
                    ty.wxUserInfo = true;
                    ty.NotificationCenter.trigger(ddz.EventType.GET_USER_INFO, true);
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!']);
                }
                else{
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败']);
                }
            });
        }
        else{
            // var btnLogin = new cc.Node('Sprite');
            // var sp = btnLogin.addComponent(cc.Sprite);
            //
            // var containerRect = cc.rect(0, 0, btnWidth, btnHeight);
            //
            // cc.eventManager.addListener({
            //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     swallowTouches: true,
            //     onTouchBegan: function(touch, event) {
            //         var pos = btnLogin.convertToNodeSpace(touch.getLocation());
            //         return cc.rectContainsPoint(containerRect, pos);
            //     },
            //     onTouchEnded: function(touch, event) {
            //         ddz.LOGD('hall.loginBtnManager ','进入游戏按钮点击');
            //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!']);
            //         wx.getUserInfo({
            //             withCredentials:true,
            //             success: function(res) {
            //                 ddz.LOGD('wx.getUserInfo ','授权成功!');
            //                 ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!']);
            //                 // ty.TuyooSDK.loginTuyooWithCode(code, res.userInfo, res.iv, res.encryptedData);
            //                 ty.wxUserInfo = true;
            //                 ty.NotificationCenter.trigger(ddz.EventType.GET_USER_INFO, res);
            //                 btnLogin.destroy();
            //             },
            //             fail:function (res) {
            //                 ddz.LOGD('wx.getUserInfo ','授权失败!');
            //                 ty.NotificationCenter.trigger(ddz.EventType.START_AUTHORIZATION_FAILED);
            //                 ddz.needReLogin = true;
            //                 hall.MsgBoxManager.showToast({title : "授权失败,请手动进行授权!"});
            //                 ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败']);
            //             }
            //         });
            //
            //     },
            //     onTouchMoved: function(touch, event) {
            //
            //     }
            // }, btnLogin);
            //
            // cc.loader.load({url: ty.SystemInfo.cdnPath + 'res/raw-assets/resources/main/loginBtn.png', type: 'png'}, function (err, texture) {
            //     if (!err) {
            //         sp.spriteFrame =  new cc.SpriteFrame(texture);
            //         btnLogin.x = 320;
            //         btnLogin.y = btnHeight/2 + btnToBottom;
            //         btnLogin.parent = cc.director.getScene();
            //     }
            //     else {
            //         //加载失败
            //     }
            // });
            //
            // this.btnLogin = btnLogin;
            this.oldAuhor();
        }
    },

    /**
     * 是否可以显示授权按钮
     * @returns {boolean}
     */
    canShowUserInfoBtn:function () {
        return wx.hasOwnProperty('createUserInfoButton');
    },

    /**
     * 显示隐藏的授权按钮
     */
    showHideAuthorizeBtn:function (callFun) {

        var btnWidth = 160;
        var btnHeight = 113;
        var btnToBottom = 250;

        if (this.canShowUserInfoBtn()){

            var sysInfo = wx.getSystemInfoSync();
            var screenWidth = sysInfo.screenWidth;
            var screenHeight = sysInfo.screenHeight;

            var bi = screenWidth/640;

            btnWidth = btnWidth * bi;
            btnHeight = btnHeight * bi;

            hall.loginBtnManager.hideButton = wx.createUserInfoButton({
                type: 'image',
                image : ty.SystemInfo.cdnPath + 'res/raw-assets/resources/main/hidebtn.png?3',
                style: {
                    left: 0,
                    top: screenHeight - btnHeight - btnToBottom * bi,
                    width: btnWidth,
                    height: btnHeight
                }
            });

            hall.loginBtnManager.hideButton.show();

            hall.loginBtnManager.hideButton.onTap(function (res) {
                ddz.LOGD('UserInfoButton onTap ',JSON.stringify(res));
                // ty.TuyooSDK.login();
                //{"errMsg":"getUserInfo:fail auth deny"} 拒绝
                //{"errMsg":"getUserInfo:ok  接受
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!']);
                if (res.errMsg == 'getUserInfo:ok'){
                    //接受
                    if (callFun){
                        callFun();
                    }
                    hall.loginBtnManager.destroyHideBtn();
                    ty.wxUserInfo = true;
                    // ty.NotificationCenter.trigger(ddz.EventType.GET_USER_INFO, false);
                    ty.TuyooSDK.wechatLogin();
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!']);
                }
                else{
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败']);
                }
            });
        }
    },

    destroyHideBtn:function () {
        if (hall.loginBtnManager.hideButton){
            hall.loginBtnManager.hideButton.hide();
            hall.loginBtnManager.hideButton = null;
        }
    },

    /**
     * 显示隐藏的授权按钮
     */
    showTableAuthorizeBtn:function (callFun) {

        var btnWidth = 150;
        var btnHeight = 120;
        var btnToBottom = 120;

        if (this.canShowUserInfoBtn()){

            var sysInfo = wx.getSystemInfoSync();
            var screenWidth = sysInfo.screenWidth;
            var screenHeight = sysInfo.screenHeight;

            var bi = screenWidth/640;

            btnWidth = btnWidth * bi;
            btnHeight = btnHeight * bi;

            hall.loginBtnManager.TableButton = wx.createUserInfoButton({
                type: 'image',
                image : ty.SystemInfo.cdnPath + 'res/raw-assets/resources/main/hidebtn.png?3',
                style: {
                    left: 0,
                    top: screenHeight - btnHeight - btnToBottom * bi,
                    width: btnWidth,
                    height: btnHeight
                }
            });

            hall.loginBtnManager.TableButton.show();

            hall.loginBtnManager.TableButton.onTap(function (res) {
                ddz.LOGD('UserInfoButton onTap ',JSON.stringify(res));
                // ty.TuyooSDK.login();
                //{"errMsg":"getUserInfo:fail auth deny"} 拒绝
                //{"errMsg":"getUserInfo:ok  接受
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!','table']);
                if (res.errMsg == 'getUserInfo:ok'){
                    //接受
                    if (callFun){
                        callFun(ddz.LOCATION_SIGN.SELF);
                    }
                    hall.loginBtnManager.destroyTableBtn();
                    ty.wxUserInfo = true;
                    ty.tableAuthor = true;
                    // ty.NotificationCenter.trigger(ddz.EventType.GET_USER_INFO, false);
                    ty.TuyooSDK.wechatLogin();
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!','table']);
                }
                else{
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败','table']);
                }
            });
        }
    },

    destroyTableBtn:function () {
        if (hall.loginBtnManager.TableButton){
            hall.loginBtnManager.TableButton.hide();
            hall.loginBtnManager.TableButton = null;
        }
    },



    onlyAuthorizeAndLogin:function (callFun) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, ['授权开始!']);
        wx.authorize({
            scope : "scope.userInfo",
            success : function () {
                if (callFun){
                    callFun();
                }
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationSuccess, ['授权成功!']);
                ty.wxUserInfo = true;
                ty.TuyooSDK.wechatLogin();
            },
            fail:function () {
                ty.NotificationCenter.trigger(ddz.EventType.START_AUTHORIZATION_FAILED);
                ddz.needReLogin = true;
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationFailed, ['授权失败']);
            },
            complete:function () {
            }
        });
    },

    oldAuhor:function () {
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
    },
    // showLoginBtn:function () {
    //     this.oldAuhor();
    // }
};