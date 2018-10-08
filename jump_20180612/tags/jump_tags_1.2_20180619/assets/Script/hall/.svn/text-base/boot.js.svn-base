
var ToDoTasks = require('ToDoTasks');
var HallGameWorld = require('HallGameWorld');
var UserInfo = require('HallUserInfo');
require('JumpAudioHelper');
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
// var mute = hall.GlobalFuncs.ReadBoolFromLocalStorage(jump.SETTING_MUTE_KEY, false);
// if (mute) {
//     jump.AudioHelper.setMusicVolume(0);
//     jump.AudioHelper.setEffectsVolume(0);
// } else {
//     var music_vol = hall.GlobalFuncs.ReadNumFromLocalStorage(jump.SETTING_MUSIC_KEY, 0.5); //如果没有存储，初始默认值0.5
//     jump.AudioHelper.setMusicVolume(music_vol);
//     var effect_vol = hall.GlobalFuncs.ReadNumFromLocalStorage(jump.SETTING_EFFECT_KEY, 1); //如果没有存储，初始默认值1
//     jump.AudioHelper.setEffectsVolume(effect_vol);
// }


hall.LOCAL_UUID_KEY = "LOCAL_UUID_KEY";

hall.LoginToyoo = function () {
    //
    wx.login({
        success: function(params) {
            hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
            if (params.code) {
                ty.wxLoginCode = params.code;

                wx.getSetting({
                    success:function(res) {
                        if (!res.authSetting['scope.userInfo']) {
                            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, [params.code]);
                            //未授权,检查版本,如果支持开放数据域,从开放数据域获取玩家信息,进行登录,如果不支持开放数据域,弹出授权窗口
                            var openData = jump.GlobalFuncs.getOpenData();
                            if (openData){
                                ty.TuyooSDK.wechatLoginDirect(params.code);
                            }
                            else{
                                //弹窗,请求授权
                                ty.TuyooSDK.wechatLoginNormal(params.code, true);
                            }
                        }
                        else{
                            //已授权,正常登录
                            ty.TuyooSDK.wechatLoginNormal(params.code);
                        }
                    }
                })
            }
        },
        fail: function(params) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
            hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
        },
        complete: function(params) {
        }
    });
};

hall.LoginToyoo();
wx.showShareMenu({
    withShareTicket: true
});