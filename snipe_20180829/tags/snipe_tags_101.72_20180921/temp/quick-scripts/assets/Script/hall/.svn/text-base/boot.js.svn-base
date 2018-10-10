(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/boot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ad1445t4nhM67aUyFLNGpQs', 'boot', __filename);
// Script/hall/boot.js

'use strict';

var ToDoTasks = require('ToDoTasks');
var HallGameWorld = require('HallGameWorld');
var UserInfo = require('HallUserInfo');
require('shotAudioHelper');
require('GlobalTimer');
require('JumpEventType');
hall.ME = new UserInfo();
hall.gameWorld = new HallGameWorld();

// 系统信息，获取一次即可
hall.staticSystemInfo = {
    version: 1
};

hall.ToDoTask = new ToDoTasks();
hall.GlobalTimer.boot();

//
// //如果文件里存了音量信息，则进行设置
// var mute = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.SETTING_MUTE_KEY, false);
// if (mute) {
//     shot.AudioHelper.setMusicVolume(0);
//     shot.AudioHelper.setEffectsVolume(0);
// } else {
//     var music_vol = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.SETTING_MUSIC_KEY, 0.5); //如果没有存储，初始默认值0.5
//     shot.AudioHelper.setMusicVolume(music_vol);
//     var effect_vol = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.SETTING_EFFECT_KEY, 1); //如果没有存储，初始默认值1
//     shot.AudioHelper.setEffectsVolume(effect_vol);
// }


hall.LOCAL_UUID_KEY = "LOCAL_UUID_KEY";

hall.LoginToyoo = function () {
    if (wx.hasOwnProperty("getUpdateManager")) {
        var updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            shot.LOGD(null, res.hasUpdate);
        });

        updateManager.onUpdateReady(function () {

            updateManager.applyUpdate();

            // wx.showModal({
            //     title: '更新提示',
            //     content: '新版本已经准备好，是否重启应用？',
            //     success: function (res) {
            //         if (res.confirm) {
            //             // fs.unlinkSync(filePath); //删除本地资源文件
            //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            //             updateManager.applyUpdate();
            //         }
            //     }
            // })
        });

        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
        });
    }
    //
    try {
        wx.login({
            success: function success(params) {
                hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
                if (params.code) {
                    ty.wxLoginCode = params.code;

                    wx.getSetting({
                        success: function success(res) {
                            if (!res.authSetting['scope.userInfo']) {
                                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, [params.code]);
                                //未授权,检查版本,如果支持开放数据域,从开放数据域获取玩家信息,进行登录,如果不支持开放数据域,弹出授权窗口
                                var openData = shot.GlobalFuncs.getOpenData();
                                if (openData) {
                                    ty.TuyooSDK.wechatLoginDirect(params.code);
                                    hall.LOGD(null, 'wechatLoginDirect' + JSON.stringify(params));
                                } else {
                                    //弹窗,请求授权
                                    ty.TuyooSDK.wechatLoginNormal(params.code, true);
                                    hall.LOGD(null, '弹窗,请求授权' + JSON.stringify(params));
                                }
                            } else {
                                //已授权,正常登录
                                ty.TuyooSDK.wechatLoginNormal(params.code);
                                hall.LOGD(null, '已授权,正常登录' + JSON.stringify(params));
                            }
                        }
                    });
                }
            },
            fail: function fail(params) {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
                hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
            },
            complete: function complete(params) {}
        });
    } catch (err) {
        hall.LOGE("error:", "wx.login——" + JSON.stringify(err));
    }
};

hall.LoginToyoo();
// hall.adManager.requestADInfo();

wx.showShareMenu({
    withShareTicket: true
});

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
        //# sourceMappingURL=boot.js.map
        