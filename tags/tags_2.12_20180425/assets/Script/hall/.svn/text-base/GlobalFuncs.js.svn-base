//
//  ddz_global.js
//  ddz
//
//  Created by weitongming on 14-03-05.
//  放置项目中需要用到的全局变量或配置信息

hall.GlobalFuncs = {};

// hall.GlobalFuncs.gotoddz = function(roomid, type){
// 	 if (h5.playScene) {
// 	 	return;
// 	 }
// 	var params = {
//             "resources": [{
//                 "resources": h5.Resources.ddz_image,
//                 "text": "正在加载图片...",
//                 "type": "image"
//             }],
//             "preload": true,
//             "callback": function() {
//             	ddz.init();
//                 var scene = ddz.PlayScene.createScene(roomid, type);	//暂时设为2人斗地主
//                 cc.director.runScene(scene);
//             }
//         };
//         var scene = h5.LoadingScene.createScene(params);
//         cc.director.runScene(scene);
// }

hall.GlobalFuncs.SliceStringToLength = function(str, length) { //先算出整个字符串的长度，并获得第length - 2个字符串的位置，给".."留2个位置
	if(!str) {
		return str;
	}
	var len = 0;
	var tmp = 0;
	var s;
	for (var i = 0; i < str.length; i++) {
		var charCode = str.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) {
			tmp += 1;
		} else { // 如果是中文则长度加2
			tmp += 2;
		}
		if (tmp <= length - 2) {
			len++;
		}
	}
	if (tmp <= length) {
		s = str.slice(0);
	} else {
		s = str.slice(0, len);
		s += "..";
	}
	return s;
};

hall.GlobalFuncs.PrintArray = function(arr) {
	var s = "";
	for (var index = 0; index < arr.length; index++) {
		s += arr[index];
		s += " ";
	}
	hall.LOGD(null, 'global', s);
};

hall.GlobalFuncs.FindInArray = function(arr, obj) {
	var len = arr.length;
	for (var index = 0; index < len; index++) {
		if (arr[index] === obj) {
			return index;
		}
	}
	return -1;
};

hall.GlobalFuncs.FindInArrayBuFun = function(array, func) { //array.find是ECMA2015才提供，可能在一些设备上不支持
    for (var i = 0, len = array.length; i < len; i++) {
        var element = array[i];
        if (func(element)) {
            return element;
        }
    }
    return null;
};

hall.GlobalFuncs.GetSubArrayExceptIndex = function(arr, indexs) {
	var newarr = arr.slice(0);
	indexs.sort(hall.GlobalFuncs.SortNumberFunc);
	for (var i = indexs.length - 1; i >= 0; i--) {
		newarr.splice(indexs[i], 1);
	}
	return newarr;
};

hall.GlobalFuncs.SortNumberFunc = function(c1, c2) { //数字数组， 从小到大排列的排序函数
	return c1 - c2;
};

//根据经验判断当前处于多少级
hall.GlobalFuncs.GetLevelByExp = function(exp) {
	var level = 0;
	while (exp > 0) {
		exp -= parseInt(5 * Math.pow(level, 3.5) + 3 * Math.pow(level, 1.5) + 50);
		level++;
	}
	return level - 1;
};

//是指升到level级时候的总经验, level必须大于0
hall.GlobalFuncs.GetExpByLevel = function(level) {
	var exp = 0;
	for (var i = 0; i < level; i++) {
		exp += parseInt(5 * Math.pow(i - 1, 3.5) + 3 * Math.pow(i - 1, 1.5) + 50);
	}
	return exp;
};

hall.GlobalFuncs.ChangeSpriteTexure = function(sprite, texureName) { //用setSpriteFrame一定会自动适应大小，如果需要强制不改变大小，需要设置scale，这会导致变形，所以去掉bAdjustSize参数
	var frme = cc.spriteFrameCache.getSpriteFrame(texureName);
    if(frme)
        sprite.setSpriteFrame(frme);
};

hall.GlobalFuncs.ChangeSpriteTexureWithSize = function(sprite, texureName, size) { //强制拉伸缩放frame自动适应大小，可能会导致扭曲，为了尽量少改动代码，不在上面方法增加参数，而是新建一个方法
	var frme = cc.spriteFrameCache.getSpriteFrame(texureName);
	var f_size = frme.getOriginalSize();
	sprite.setScaleX(size.width / f_size.width);
	sprite.setScaleY(size.height / f_size.height);
	sprite.setSpriteFrame(frme);
};

hall.GlobalFuncs.ReadBoolFromLocalStorage = function(key, def_value) {
	if(!cc.sys.localStorage.getItem) {
		return def_value;
	}
	var tmp = cc.sys.localStorage.getItem(key);
	if (!tmp) {
		return def_value;
	}
	var bv = tmp === "true" ? true : false;
	return bv;
};

hall.GlobalFuncs.ReadNumFromLocalStorage = function(key, def_value) {
	if(!cc.sys.localStorage.getItem) {
		return def_value;
	}
	var tmp = cc.sys.localStorage.getItem(key);
	if (!tmp) {
		return def_value;
	}
	return Number(tmp);
};

hall.GlobalFuncs.ReadStringFromLocalStorage = function(key, def_value) {
	if(!cc.sys.localStorage.getItem) {
		return def_value;
	}
	var tmp = cc.sys.localStorage.getItem(key);
	if (!tmp) {
		return def_value;
	}
	return String(tmp);
};
hall.GlobalFuncs.ReadValueFromLocalStorage = function(key, def_value) {
	if(!cc.sys.localStorage.getItem) {
		return def_value;
	}
	var tmp = cc.sys.localStorage.getItem(key);
	if (!tmp) {
		return def_value;
	}
	return Array(tmp);
};


hall.GlobalFuncs.setInLocalStorage = function(key, value){
	try{
		cc.sys.localStorage.setItem(key, value+"");
	}catch(e){}
};

hall.GlobalFuncs.DownloadImg = function(url, filePath, cobj, callback, params) {
	if (url.indexOf('http') < 0) {
		hall.LOGE('global', 'Invalid url to download, return!!!!!!');
		return;
	}
	var configObj = {
		'imageUrl': url
	};
	ty.Http.httpGet("proxyImage", configObj, function(retObj) {
		var result = JSON.parse(retObj);
		if (result["statusCode"] == "200" && result["openErr"] != 1 && result["writeErr"] != 1) {
			callback.call(cobj,result["path"], params);
		}
	}, "");
};

//格式化秒 00:00:00 value ---秒
hall.GlobalFuncs.formatSeconds = function(value) {
	var theTime = parseInt(value); // 秒
	var theTime1 = 0; // 分
	var theTime2 = 0; // 小时
	if (theTime > 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		if (theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
		}
	}
	var result = "";
	if (theTime > 9)
		result = "" + parseInt(theTime);
	else
		result = "0" + parseInt(theTime);
	if (theTime1 >= 0) {
		if (theTime1 > 9)
			result = "" + parseInt(theTime1) + ":" + result;
		else
			result = "0" + parseInt(theTime1) + ":" + result;
	}
	if (theTime2 >= 0) {
		if (theTime2 > 9)
			result = "" + parseInt(theTime2) + ":" + result;
		else
			result = "0" + parseInt(theTime2) + ":" + result;
	}
	return result;
};

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

hall.GlobalFuncs.base64encode = function(input) {
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;

	input = hall.GlobalFuncs._utf8_encode(input);
	var len = input.length;
	while (i < len) {

		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);

	}

	return output;
};

hall.GlobalFuncs.base64decode = function(input) {
    var output = hall.GlobalFuncs.base64decodeRaw(input);
    return hall.GlobalFuncs._utf8_decode(output);
};

// public method for decoding
hall.GlobalFuncs.base64decodeRaw = function(input) {
	
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	var len = input.length;
	var output = [];
	while (i < len) {

		enc1 = _keyStr.indexOf(input.charAt(i++));
		enc2 = _keyStr.indexOf(input.charAt(i++));
		enc3 = _keyStr.indexOf(input.charAt(i++));
		enc4 = _keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output.push(chr1);

		if (enc3 != 64) {
			output.push(chr2);
		}
		if (enc4 != 64) {
			output.push(chr3);
		}
	}
	return output;
};

// private method for UTF-8 encoding
hall.GlobalFuncs._utf8_encode = function(string) {
	string = string.replace(/\r\n/g, "\n");
	var utftext = "";
	for (var n = 0, len = string.length; n < len; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}

	}

	return utftext;
};

// private method for UTF-8 decoding
hall.GlobalFuncs._utf8_decode = function(array) {
	var string = "";
	var i = 0, c1, c2;
	var c = c1 = c2 = 0;
	var len = array.length;
	while (i < len) {
		c = array[i];
		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		} else if ((c > 191) && (c < 224)) {
			c2 = array[i + 1];
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = array[i + 1];
			c3 = array[i + 2];
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return string;
};

/**
 * 校验消息是否是当前游戏的
 * param - json对象
 * gameId - 待比较的游戏gameId
 */
hall.GlobalFuncs.checkMsgWithGameId = function(param, gameId) {
	var pgameId = param['result']['gameId'];
	if (pgameId == gameId) {
		hall.LOGE('global', 'EQUAL!!!!!!');
		return true;
	}
	return false;
};


/**
 * 进入斗地主牌桌
 */
hall.GlobalFuncs.gotoDdzTable = function(){

	var toSceneName = "TableScene";
    if (hall.GlobalFuncs.isInAtScene(toSceneName)){
        return;
    }

	ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);

	//这里要重写
	cc.director.loadScene(toSceneName);
};

hall.GlobalFuncs.isInAtScene = function (toSceneName) {
	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG, "curScene : " + curScene.name);
	return curScene.name == toSceneName;
};

hall.GlobalFuncs.gotoDdz = function(){

	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG, "curScene : " + curScene.name);

	var toSceneName = "Ddz";
	// if (curScene.name == toSceneName || curScene.name == "ddz_rank" || curScene.name == "ddz_reward"|| curScene.name == "ddz_diamond"){
	// 	return;
	// }
	if (curScene.name !=  "TableScene"){
		return;
	}
	cc.director.loadScene(toSceneName);
};

hall.GlobalFuncs.gotoRank = function(shareTicketS){

	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG, "curScene : " + curScene.name);

	var toSceneName = "ddz_rank";

	var shareTicket = shareTicketS;
	var onLaunched = function () {
		var logicScene = cc.director.getScene();
		var no = logicScene.children[0];
		var window = no.getComponent("ddz_rank");
		window.changeButtonToRank(shareTicket);
	};
	if (curScene.name == toSceneName){
		onLaunched();
		return;
	}
	cc.director.loadScene(toSceneName,onLaunched);
};

// 对局详情
hall.GlobalFuncs.onShowDetail = function () {

	hall.LOGE('',"加载 对局流水prefab");
	var curScene = cc.director.getScene();
	// 防止重复叠加
	var _layer = curScene.getChildByTag(100050);
	if (_layer) {
		// _layer.removeFromParent();
		var com = _layer.getComponent('ddz_window_gameDetail');
		com.setParentScene(curScene.children[0].getComponent('DdzTableScene'));
		com.createDetail();
		return
	}
	cc.loader.loadRes('prefabs/ddz_window_gameDetail', function (err, prefab) {
		var _gameDetail = cc.instantiate(prefab);
		// cc.director.getScene().addChild(preFabNode);

		curScene.addChild(_gameDetail);
		_gameDetail.setTag(100050);
		ddz.GlobalFuncs.setToCenter(_gameDetail);

		var com = _gameDetail.getComponent('ddz_window_gameDetail');
		com.setParentScene(curScene.children[0].getComponent('DdzTableScene'));
		var ani = _gameDetail.getComponent(cc.Animation);
		var clipName = ani.getClips()[0].name;
		var anim = ani.getAnimationState(clipName);
		anim.once("finished", function () {
			com.createDetail();
		});
		anim.play();

	});
};

// 历史战绩
hall.GlobalFuncs.onHistory = function () {
	hall.LOGE('',"加载 历史战绩prefab");
	cc.loader.loadRes('prefabs/ddz_window_history', function (err, prefab) {
		var _gameHistory = cc.instantiate(prefab);
		// cc.director.getScene().addChild(preFabNode);
		cc.director.getScene().addChild(_gameHistory);
		ddz.GlobalFuncs.setToCenter(_gameHistory);
		var ani = _gameHistory.getComponent(cc.Animation);
		var clipName = ani.getClips()[0].name;
		var anim = ani.getAnimationState(clipName);
		anim.once("finished", function () {
		});
		anim.play();
	});
};

hall.GlobalFuncs.getSpDataPath = function (isDiZhu, isMale) {
	var spDataPath;
	if (isDiZhu){
		if (isMale){
			spDataPath = "spine/ddz_newoneself_dizhu";
		}else{
			spDataPath = "spine/ddz_newoneself_dizhupo";
		}
	}
	else{
		if (isMale){
			spDataPath = "spine/ddz_newoneself_nongmin";
		}else{
			spDataPath = "spine/ddz_newoneself_nvwa";
		}
	}
	return spDataPath;
};

/**
 * 生成32位的UUID
 * @returns {string}
 * @constructor
 */
hall.GlobalFuncs.CreateUuid = function () {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "";

	var uuid = s.join("");
	return uuid;
};

hall.GlobalFuncs.getLocalUuid = function () {

	var local_uuid = hall.GlobalFuncs.ReadStringFromLocalStorage(hall.LOCAL_UUID_KEY, "");
	if (!local_uuid){
		local_uuid = hall.GlobalFuncs.CreateUuid();
		hall.GlobalFuncs.setInLocalStorage(hall.LOCAL_UUID_KEY, local_uuid)
	}
	return local_uuid;
};

//返回一个100以内小于number的数
hall.GlobalFuncs.getRandomNumberBefore = function(number) {
	return (Math.floor(Math.random()*100))%number;
};
//用关键字替换文本
hall.GlobalFuncs.replaceKeyWordInString = function(string) {
	var repString = "".concat(string);
	var replaceMap = ddz.Share.shareKeywordReplace;
	for (var key in replaceMap){
		var reg = new RegExp(key,"g");
		repString = repString.replace(reg,replaceMap[key]);
	}
	return repString;
};
//字典转换成字符串(打点)
hall.GlobalFuncs.replaceToStringWithDic = function(dic) {
	return  "query:" + JSON.stringify(dic);
};
//返回一个保留2位小数的数字字符串
hall.GlobalFuncs.getMoneyStringWithCoupons = function(couponCount) {
	var money = (couponCount/100).toFixed(2) +"";
	return money;
};

hall.GlobalFuncs.isEmptyObject = function (obj) {
	for (var name in obj) {
		return false;
	}
	return true;
};

hall.GlobalFuncs._TAG = "hall.GlobalFuncs";