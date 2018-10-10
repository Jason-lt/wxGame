
require('QrOption');
// 斗地主的日志全局函数
hall.LOGD = function(tag, msg){
	if (!debugMode){
		return;
	}
	var logStr = 'snipe_: ' + msg;
	if (tag){
		logStr = tag + 'snipe_: ' + msg;
	}
	console.log(logStr);
};

hall.LOGW = function (tag, msg) {
	if (!debugMode){
		return;
	}
	var logStr = 'snipe_: ' + msg;
	if (tag){
		logStr = tag + 'snipe_: ' + msg;
	}
	console.warn(logStr);
};


snipe.qrCodeOption = new snipe.QrOption();

ty.TuyooSDK.getSystemType();

// 游戏ID
snipe.GameId = 6;

snipe.recordFileType = 'mp3';

snipe.SETTING_MUTE_KEY = "setting_mute";
snipe.SETTING_MUSIC_KEY = "setting_music";
snipe.SETTING_EFFECT_KEY = "setting_effect";

snipe.LOCAL_VERSION_KEY = "LOCAL_VERSION_KEY"; // 本地版本号,升级后会更新
