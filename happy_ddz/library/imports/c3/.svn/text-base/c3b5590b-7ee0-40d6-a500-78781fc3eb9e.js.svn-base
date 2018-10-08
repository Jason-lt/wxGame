"use strict";
cc._RF.push(module, 'c3b55kLfuBA1qUAeHgfw+ue', 'boot');
// Script/hall/boot.js

'use strict';

var BuyCenter = require('BuyCenter');
var ToDoTasks = require('ToDoTasks');
var HallGameWorld = require('HallGameWorld');
var UserInfo = require('HallUserInfo');
// require('BiLog');
// require('EventType');
// require('UserInfo');
require('DdzAudioHelper');
require('GlobalTimer');
require('RecordManager');
hall.ME = new UserInfo();
hall.gameWorld = new HallGameWorld();

// 系统信息，获取一次即可
hall.staticSystemInfo = {
    version: 1
};

hall.ToDoTask = new ToDoTasks();
hall.BuyCenter = new BuyCenter();
hall.GlobalTimer.boot();

//初始化录音管理器
hall.recorder = new hall.AudioRecordManager();
hall.recorder.initManager();

//如果文件里存了音量信息，则进行设置
var mute = hall.GlobalFuncs.ReadBoolFromLocalStorage(ddz.SETTING_MUTE_KEY, false);
if (mute) {
    ddz.AudioHelper.setMusicVolume(0);
    ddz.AudioHelper.setEffectsVolume(0);
} else {
    var music_vol = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.SETTING_MUSIC_KEY, 0.5); //如果没有存储，初始默认值0.5
    ddz.AudioHelper.setMusicVolume(music_vol);
    var effect_vol = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.SETTING_EFFECT_KEY, 1); //如果没有存储，初始默认值1
    ddz.AudioHelper.setEffectsVolume(effect_vol);
}

//组局的房间id固定为6201
hall.CUSTOM_ROOMID = 6201;
hall.HAS_MAIL_KEY = "has_mail";

hall.LOCAL_UUID_KEY = "LOCAL_UUID_KEY";
hall.LAST_GET_REWARD_DAY = "LAST_GET_REWARD_DAY";

ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginStart, []);
wx.login({
    success: function success(params) {
        hall.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
        if (params.code) {
            ty.wxLoginCode = params.code;
            ty.NotificationCenter.trigger(ty.EventType.WX_LOGIN_SUCCESS);
        }
    },
    fail: function fail(params) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
        hall.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
    },
    complete: function complete(params) {}
});

cc._RF.pop();