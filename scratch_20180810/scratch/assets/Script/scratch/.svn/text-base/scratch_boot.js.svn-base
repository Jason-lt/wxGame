
require('QrOption');
// 斗地主的日志全局函数
hall.LOGD = function(tag, msg){
	if (!debugMode){
		return;
	}
	var logStr = 'scratch_: ' + msg;
	if (tag){
		logStr = tag + 'scratch_: ' + msg;
	}
	console.log(logStr);
};

hall.LOGW = function (tag, msg) {
	if (!debugMode){
		return;
	}
	var logStr = 'scratch_: ' + msg;
	if (tag){
		logStr = tag + 'scratch_: ' + msg;
	}
	console.warn(logStr);
};


scratch.qrCodeOption = new scratch.QrOption();

ty.TuyooSDK.getSystemType();

// 游戏ID
scratch.GameId = 6;

scratch.recordFileType = 'mp3';

scratch.SETTING_MUTE_KEY = "setting_mute";
scratch.SETTING_MUSIC_KEY = "setting_music";
scratch.SETTING_EFFECT_KEY = "setting_effect";

scratch.LOCAL_VERSION_KEY = "LOCAL_VERSION_KEY"; // 本地版本号,升级后会更新
