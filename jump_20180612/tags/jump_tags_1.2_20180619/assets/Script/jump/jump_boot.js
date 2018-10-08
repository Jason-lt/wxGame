
require('QrOption');
// 斗地主的日志全局函数
jump.LOGD = function(tag, msg){
	if (!debugMode){
		return;
	}
	var logStr = 'jump : ' + msg;
	if (tag){
		logStr = tag + 'jump : ' + msg;
	}
	console.log(logStr);
};

jump.LOGW = function (tag, msg) {
	if (!debugMode){
		return;
	}
	var logStr = 'jump : ' + msg;
	if (tag){
		logStr = tag + 'jump : ' + msg;
	}
	console.warn(logStr);
};


jump.qrCodeOption = new jump.QrOption();

ty.TuyooSDK.getSystemType();

// 游戏ID
jump.GameId = 6;

jump.recordFileType = 'mp3';

jump.SETTING_MUTE_KEY = "setting_mute";
jump.SETTING_MUSIC_KEY = "setting_music";
jump.SETTING_EFFECT_KEY = "setting_effect";

jump.LOCAL_VERSION_KEY = "LOCAL_VERSION_KEY"; // 本地版本号,升级后会更新
