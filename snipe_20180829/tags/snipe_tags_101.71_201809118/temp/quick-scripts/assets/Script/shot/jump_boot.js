(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/shot/jump_boot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8db15UjX0tJCpg4uzGmlEqz', 'jump_boot', __filename);
// Script/shot/jump_boot.js

'use strict';

require('QrOption');
// 斗地主的日志全局函数
shot.LOGD = function (tag, msg) {
	if (!debugMode) {
		return;
	}
	var logStr = 'shot_: ' + msg;
	if (tag) {
		logStr = tag + 'shot_: ' + msg;
	}
	console.log(logStr);
};

shot.LOGW = function (tag, msg) {
	if (!debugMode) {
		return;
	}
	var logStr = 'shot_: ' + msg;
	if (tag) {
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
        //# sourceMappingURL=jump_boot.js.map
        