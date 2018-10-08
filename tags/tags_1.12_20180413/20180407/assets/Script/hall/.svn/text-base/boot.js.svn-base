var BuyCenter = require('BuyCenter');
var ToDoTasks = require('ToDoTasks');
var HallGameWorld = require('HallGameWorld');
var UserInfo = require('HallUserInfo');
require('DdzAudioHelper');

hall.ME = new UserInfo();
hall.gameWorld = new HallGameWorld();

// 系统信息，获取一次即可
hall.staticSystemInfo = {
    version: 1
};

hall.ToDoTask = new ToDoTasks();
hall.BuyCenter = new BuyCenter();

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