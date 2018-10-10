"use strict";
cc._RF.push(module, '9e3fdg+9zVHRIjhgziJEcZz', 'double_boot');
// Script/double/double_boot.js

'use strict';

require('QrOption');
// 斗地主的日志全局函数
double.LOGD = function (tag, msg) {
	if (!debugMode) {
		return;
	}
	var logStr = 'double_: ' + msg;
	if (tag) {
		logStr = tag + 'double_: ' + msg;
	}
	console.log(logStr);
};

double.LOGW = function (tag, msg) {
	if (!debugMode) {
		return;
	}
	var logStr = 'double_: ' + msg;
	if (tag) {
		logStr = tag + 'double_: ' + msg;
	}
	console.warn(logStr);
};

double.qrCodeOption = new double.QrOption();

ty.TuyooSDK.getSystemType();

// 游戏ID
double.GameId = 6;

double.recordFileType = 'mp3';

double.SETTING_MUTE_KEY = "setting_mute";
double.SETTING_MUSIC_KEY = "setting_music";
double.SETTING_EFFECT_KEY = "setting_effect";

double.LOCAL_VERSION_KEY = "LOCAL_VERSION_KEY"; // 本地版本号,升级后会更新

cc._RF.pop();