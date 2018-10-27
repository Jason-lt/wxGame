(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/DdzAudioHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ff287WLAstI+rrFGSkmCwqV', 'DdzAudioHelper', __filename);
// Script/ddz/DdzAudioHelper.js

"use strict";

/**
 * 声音播放工具
 */
ddz.AudioHelper = {

	getMusicPlayManager: function getMusicPlayManager() {

		this.stopMusic();

		this.musicPlayManager = wx.createInnerAudioContext();
		this.musicPlayManager.obeyMuteSwitch = true;
		return this.musicPlayManager;
	},

	/**
  * 播放音乐 (音效只可以播放一个,如果再调用此方法,之前的音乐会被停止)
  * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
  * @param isloop 是否循环
  * @param volume 可选参数,音量
     */
	playMusic: function playMusic(file, isloop, volume) {

		if (this._curMusicFile && this._curMusicFile == file) {} else {
			this._curMusicFile = file;
		}

		// if (arguments.length == 3){
		// 	this.setMusicVolume(volume);
		// }
		// cc.audioEngine.playMusic(cc.url.raw(file), isloop);
		var playManager = this.getMusicPlayManager();

		if (arguments.length == 3) {
			playManager.volume = volume;
		}

		playManager.autoplay = true;
		playManager.loop = isloop;
		playManager.src = ty.SystemInfo.cdnPath + cc.url.raw(file);
	},

	rePlayMusic: function rePlayMusic() {
		if (this.musicPlayManager && this.musicPlayManager.loop) {
			this.musicPlayManager.play();
		}
	},

	stopMusic: function stopMusic() {
		if (this.musicPlayManager) {
			this.musicPlayManager.stop();
			this.musicPlayManager.destroy();
			this.musicPlayManager = null;
		}
	},

	/**
  * 播放音效 (音效可以同时播放多个)
  * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
  * @param isloop 是否循环
  * @param volume 可选参数,音量
  */
	playEffect: function playEffect(file, isloop, volume) {
		if (arguments.length == 3) {
			this.setEffectsVolume(volume);
		}
		cc.audioEngine.playEffect(ty.SystemInfo.cdnPath + cc.url.raw(file), isloop);
	},

	/**
  * 停止音效
  * @param effectId
     */
	stopEffect: function stopEffect(effectId) {
		if (effectId < 0) {
			return;
		}
		cc.audioEngine.stopEffect(effectId);
	},

	/**
  * 停止所有音效
     */
	stopAllEffects: function stopAllEffects() {
		cc.audioEngine.stopAllEffects();
	},

	/**
  * 卸载所有文件
     */
	unloadAll: function unloadAll() {
		cc.audioEngine.uncacheAll();
	},

	/**
  * 更改音效音量
  * @param val 音量
     */
	setEffectsVolume: function setEffectsVolume(val) {
		hall.GlobalFuncs.setInLocalStorage(ddz.SETTING_EFFECT_KEY, val);
		cc.audioEngine.setEffectsVolume(val);
	},

	/**
  * 更改音乐音量
  * @param val 音量
  */
	setMusicVolume: function setMusicVolume(val) {
		hall.GlobalFuncs.setInLocalStorage(ddz.SETTING_MUSIC_KEY, val);
		cc.audioEngine.setMusicVolume(val);
	},

	/**
  * 获取音乐音量
     */
	getMusicVolume: function getMusicVolume() {
		return hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.SETTING_MUSIC_KEY, cc.audioEngine.getMusicVolume());
	},

	/**
  * 获取音效音量
     */
	getEffectsVolume: function getEffectsVolume() {
		return hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.SETTING_EFFECT_KEY, cc.audioEngine.getEffectsVolume());
	}

};

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
        //# sourceMappingURL=DdzAudioHelper.js.map
        