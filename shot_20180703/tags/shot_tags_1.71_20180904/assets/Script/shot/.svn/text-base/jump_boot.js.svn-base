
require('QrOption');
// 斗地主的日志全局函数
shot.LOGD = function(tag, msg){
	if (!debugMode){
		return;
	}
	var logStr = 'shot_: ' + msg;
	if (tag){
		logStr = tag + 'shot_: ' + msg;
	}
	console.log(logStr);
};

shot.LOGW = function (tag, msg) {
	if (!debugMode){
		return;
	}
	var logStr = 'shot_: ' + msg;
	if (tag){
		logStr = tag + 'shot_: ' + msg;
	}
	console.warn(logStr);
};


shot.qrCodeOption = new shot.QrOption();

ty.TuyooSDK.getSystemType();

// 游戏ID
shot.GameId = 6;

shot.recordFileType = 'mp3';

shot.SETTING_MUTE_KEY = "setting_mute";
shot.SETTING_MUSIC_KEY = "setting_music";
shot.SETTING_EFFECT_KEY = "setting_effect";

shot.LOCAL_VERSION_KEY = "LOCAL_VERSION_KEY"; // 本地版本号,升级后会更新
