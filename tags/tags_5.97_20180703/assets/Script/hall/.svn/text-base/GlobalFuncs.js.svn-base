//
//  ddz_global.js
//  ddz
//
//  Created by weitongming on 14-03-05.
//  放置项目中需要用到的全局变量或配置信息

hall.GlobalFuncs = {};
hall.SceneGather = [];  // scene jihe
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

// 规划金币
hall.GlobalFuncs.formatGold = function(score){
	if(!score){
		return "0";
	}
	var tar = "";
	if (score < 0){
		tar = "-";
		score = -score;
	}
	var scoreText = "";
	var arr;
	var endStr;
	var sp;
	var isInteger = false;
	if (score < 10000){
		scoreText = score + "";
	}else if (score >= 10000 && score < 100000000) {
		scoreText = (score / 10000) + "";
		if (scoreText.indexOf(".") == -1){
			isInteger = true;
			scoreText += ".000";
		}else {
			isInteger = false;
			scoreText += "000";
		}
		arr = scoreText.split(".");
		var wanStr = arr[0];
		sp = 1;
		if (wanStr.length == 1){
			sp = 2;
		}
		else if (wanStr.length == 2){
			sp = 1;
		}
		else if (wanStr.length == 3){
			sp = 0;
		}
		else if (wanStr.length == 4){
			sp = 0;
		}
		endStr = arr[1].substr(0,sp);
		scoreText = wanStr + "." + endStr + "万";
		if (sp == 0 || isInteger) {
			scoreText = wanStr + "万";
		}

	}else {
		scoreText = (score / 100000000) + "";

		if (scoreText.indexOf(".") == -1){
			isInteger = true;
			scoreText += ".000";
		}
		else{
			isInteger = false;
			scoreText += "000";
		}

		arr =  scoreText.split(".");

		var yiStr = arr[0];
		sp = 1;
		if (yiStr.length == 1){
			sp = 2;
		}
		else if (yiStr.length == 2){
			sp = 1;
		}
		else if (yiStr.length == 3){
			sp = 0;
		}
		else{
			sp = 0;
		}

		endStr = arr[1].substr(0,sp);

		scoreText = yiStr + "." + endStr + "亿";
		if (sp == 0 || isInteger) {
			scoreText = yiStr + "亿";
		}
	}
	return tar + scoreText;
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
//格式化秒 00:00:00 value ---毫秒
hall.GlobalFuncs.formatMinSeconds = function(value) {
	var theTime = parseInt(value); // 秒*10
	var theTime1 = 0; // 秒
	var theTime2 = 0; // 分
	if (theTime > 10) {
		theTime1 = parseInt(theTime / 10);
		theTime = parseInt(theTime % 10);
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
 * 进入斗地主牌桌u
 */
hall.GlobalFuncs.gotoDdzTable = function(){
	var noDelete = false;
	var curScene = cc.director.getScene();
	if (curScene.name != "TableScene") {
		noDelete = true;
		ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING,noDelete);
	}

	var toSceneName = "TableScene";
    if (hall.GlobalFuncs.isInAtScene(toSceneName)){
		ddz.gameModel.isLoadTableScene = false;
        return;
    }
	ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
	ty.NotificationCenter.trigger(ddz.EventType.REMOVE_DDZ_MAIN_ANI);
	// requestAnimationFrame(function(){
	// 	hall.LOGW('global', '下一帧执行 跳转TableScene');
	// 	cc.director.loadScene(toSceneName);
	// });
	//这里要重写
	// cc.director.loadScene(toSceneName);
	hall.GlobalFuncs.pushScene(toSceneName);
};

hall.GlobalFuncs.isInAtScene = function (toSceneName) {
	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG, "file = [GlobalFuncs] fun = [isInAtScene] curScene : " + curScene.name);
	return curScene.name == toSceneName;
};

hall.GlobalFuncs.pushScene = function(sceneName,onLaunched){
	// hall.SceneGather = [];
	if (sceneName == "TableScene" || sceneName == "Ddz") {
		hall.SceneGather = [];
		cc.director.loadScene(sceneName,onLaunched);
		return;
	}

	var index = -1;

	for (var i = 0; i < hall.SceneGather.length; i++){
		if (hall.SceneGather[i].name == sceneName){
			index = i;
			break;
		}
	}

	if (index == -1) {

	}else {
		hall.SceneGather.splice(index,1);
	}
	var data = {};
	data.name = sceneName;
	data.onLaunched = onLaunched;
	hall.SceneGather.push(data);

	// hall.LOGW("","file = [GlobalFuncs] fun = [pushScene] hall.SceneGather = " + JSON.stringify(hall.SceneGather));
	cc.director.loadScene(sceneName,onLaunched);
};

hall.GlobalFuncs.popScene = function(){
	// hall.SceneGather = [];
	var curScene = cc.director.getScene();
	if (hall.SceneGather.length > 0) {
		var data = hall.SceneGather.pop();
		var sceneName = data.name;
		var onLaunched = data.onLaunched;
		if (curScene.name == sceneName) {
			data = hall.SceneGather.pop();
			if (!data) {
				sceneName = "Ddz";
				onLaunched = null;
			}else {
				sceneName = data.name;
				onLaunched = data.onLaunched;
			}
		}
		if (sceneName == "TableScene") {
			sceneName = "Ddz";
		}
		// hall.LOGW("","file = [GlobalFunc] fun = [popScene] hall.SceneGather = " + JSON.stringify(hall.SceneGather));
		// cc.director.loadScene(sceneName,onLaunched);
		hall.GlobalFuncs.pushScene(sceneName,onLaunched);
	}else {
		var toSceneName = "Ddz";
		hall.GlobalFuncs.pushScene(toSceneName);
	}
};

hall.GlobalFuncs.gotoDdz = function(){

	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG, " file = [GlobalFuncs] fun = [gotoDdz] curScene : " + curScene.name);

	var toSceneName = "Ddz";
	// if (curScene.name == toSceneName || curScene.name == "ddz_rank" || curScene.name == "ddz_reward"|| curScene.name == "ddz_diamond"){
	// 	return;
	// }
	if (curScene.name !=  "TableScene"){
		return;
	}
	// cc.director.loadScene(toSceneName);
	hall.GlobalFuncs.pushScene(toSceneName);
};

hall.GlobalFuncs.gotoMallScene = function(){
	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG,"file = [GlobalFuncs] fun = [gotoMallScene] curScene : " + curScene.name);

	var toSceneName = "MallScene";
	// 商场,及钻石 scene 点击不处理
	if (curScene.name == toSceneName) {
		return
	}
	// cc.director.loadScene(toSceneName);
	hall.GlobalFuncs.pushScene(toSceneName);
};

hall.GlobalFuncs.gotoRechargeScene = function(){
	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG,"file = [GlobalFuncs] fun = [gotoRechargeScene] curScene : " + curScene.name);

	var toSceneName = "rechargeScene";
	// var toSceneName = "MallScene";
	// 商场,及钻石 scene 点击不处理
	if (curScene.name == toSceneName) {
		return
	}
	// cc.director.loadScene(toSceneName);
	hall.GlobalFuncs.pushScene(toSceneName);
};

hall.GlobalFuncs.gotoRoomListScene = function(_playMode){
	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG,"file = [GlobalFuncs] fun = [gotoRoomListScene] curScene : " + curScene.name);

	var toSceneName = "RoomListScene";
	//
	var onLaunched = function () {
		var logicScene = cc.director.getScene();
		var no = logicScene.children[0];
		var window = no.getComponent("RoomListScene");
		window.setPlayMode(_playMode);
	};
	if (curScene.name == toSceneName) {
		onLaunched();
		return
	}
	// cc.director.loadScene(toSceneName,onLaunched);
	hall.GlobalFuncs.pushScene(toSceneName,onLaunched);
};

hall.GlobalFuncs.gotoRank = function(shareTicketS){

	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG, "file = [GlobalFuncs] fun = [gotoRank] curScene : " + curScene.name);

	var toSceneName = "ddz_rank";

	var onLaunched = function () {
		var logicScene = cc.director.getScene();
		var no = logicScene.children[0];
		var window = no.getComponent("ddz_rank");
		window.changeButtonToRank(shareTicketS);
	};
	if (curScene.name == toSceneName){
		onLaunched();
		return;
	}
	// cc.director.loadScene(toSceneName,onLaunched);
	hall.GlobalFuncs.pushScene(toSceneName,onLaunched);
};

hall.GlobalFuncs.showDiamondWindowWithType = function (type) {
	var sceneName = 'ddz_diamond_friend';
	
	var curScene = cc.director.getScene();
	if(curScene.name == sceneName){
		return;
	}
	var onLaunched = function () {
	};

	hall.GlobalFuncs.pushScene(sceneName,onLaunched);
};
// 对局详情
hall.GlobalFuncs.onShowDetail = function () {
	hall.LOGW('',"加载 对局流水prefab");
	var curScene = cc.director.getScene();
	// 防止重复叠加
	var _layer = curScene.getChildByTag(100050);
	if (_layer) {
		var com = _layer.getComponent('ddz_window_gameDetail');
		if (curScene.name ==  "TableScene"){
			com.setParentScene(curScene.children[0].getComponent('DdzTableScene'));
		}
		com.createDetail();
		return
	}
	cc.loader.loadRes('prefabs/ddz_window_gameDetail', function (err, prefab) {
		var _gameDetail = cc.instantiate(prefab);
		curScene.addChild(_gameDetail);
		_gameDetail.setTag(100050);
		ddz.GlobalFuncs.setToCenter(_gameDetail);

		var com = _gameDetail.getComponent('ddz_window_gameDetail');
		if (curScene.name ==  "TableScene"){
			com.setParentScene(curScene.children[0].getComponent('DdzTableScene'));
		}
		// com.createDetail();
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
	hall.LOGW('',"加载 历史战绩prefab");
	cc.loader.loadRes('prefabs/ddz_window_history', function (err, prefab) {
		var _gameHistory = cc.instantiate(prefab);
		// cc.director.getScene().addChild(preFabNode);
		cc.director.getScene().addChild(_gameHistory);
		ddz.GlobalFuncs.setToCenter(_gameHistory);
		var ani = _gameHistory.getComponent(cc.Animation);
		var clipName = ani.getClips()[0].name;
		var anim = ani.getAnimationState(clipName);
		var com = _gameHistory.getComponent('ddz_window_history');
		anim.once("finished", function () {
			com.createHistory();
		});
		anim.play();
	});
};

// 个人信息
hall.GlobalFuncs.onPersonalInfo = function () {
	cc.loader.loadRes('prefabs/personalInfo', function (err, prefab) {
		var _info = cc.instantiate(prefab);
		// cc.director.getScene().addChild(preFabNode);
		cc.director.getScene().addChild(_info);
		ddz.GlobalFuncs.setToCenter(_info);
		var info = _info.getComponent("personalInfo");
		info.updateInfo();
	});
};

// 金币场玩法选择
hall.GlobalFuncs.onGoldChoosePlayMode = function () {
	cc.loader.loadRes('prefabs/choosePlayMode', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent("choosePlayMode");
	});
},

// Android 收藏桌面引导
hall.GlobalFuncs.onCollectDeskTop = function () {
	cc.loader.loadRes('prefabs/collectDeskTop', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent("collectDeskTop");
	});
},

// 关注公众号引导
hall.GlobalFuncs.onOfficialAccountGuide = function () {
	cc.loader.loadRes('prefabs/officialAccountGuide', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent("officialAccountGuide");
	});
},
// 关注公众号气泡提示
hall.GlobalFuncs.onBubbleTips = function (node,tips) {
	cc.loader.loadRes('prefabs/ddz_bubble_tips', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		preFabNode.x = 140;
		preFabNode.y = 60;
		node.addChild(preFabNode);
		var com = preFabNode.getComponent("ddz_bubble_tips");
		com.setTips(tips);
	});
},

// 免费宝箱
hall.GlobalFuncs.onTreasureBox = function () {
	cc.loader.loadRes('prefabs/treasure_box', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
	});
},

// 好友互助宝箱
hall.GlobalFuncs.onFriendHelpBox = function (data) {
	if (ddz.ddz_helpBox) {
		ddz.ddz_helpBox.updateRewardInfo(data);
		return;
	}
	cc.loader.loadRes('prefabs/ddz_helpBox', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		ddz.ddz_helpBox = preFabNode.getComponent('ddz_helpBox');
		ddz.ddz_helpBox.updateRewardInfo(data);
	});
},

// 新人限时礼包
hall.GlobalFuncs.onNewUserGifts = function (data) {
	if (ddz.ddz_newUserBox) {
		ddz.ddz_newUserBox.setCountDownWithNumber(data);
		return;
	}
	cc.loader.loadRes('prefabs/treasure_box_newer', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		ddz.ddz_newUserBox = preFabNode.getComponent('treasure_box_newer');
		ddz.ddz_newUserBox.setCountDownWithNumber(data);
	});
},

// 每日邀请福利
hall.GlobalFuncs.onShareDiamondReward = function (data) {
	if (ddz.ddz_dayWelfare) {
		ddz.ddz_dayWelfare.updateShareInfo(data);
		return;
	}
	cc.loader.loadRes('prefabs/ddz_diamond', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		ddz.ddz_dayWelfare = preFabNode.getComponent('ddz_diamond_windows');
		ddz.ddz_dayWelfare.updateShareInfo(data);
	});
},

// 邀请奖励
hall.GlobalFuncs.onShareReward_NewFriend = function () {
	if (ddz.ddz_shareReward) {
		ddz.ddz_shareReward.updateNewRewardMassage();
		return;
	}
	cc.loader.loadRes('prefabs/ddz_shareReward', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		ddz.ddz_shareReward = preFabNode.getComponent('ddz_shareReward_windows');
		ddz.ddz_shareReward.updateNewRewardMassage();
	});
},

// // 停服提示
// hall.GlobalFuncs.onWithdrawalMaintain = function (timerStr) {
// 	var curScene = cc.director.getScene();
// 	var preFabNode = curScene.getChildByTag(100051);
// 	if (!timerStr) {
// 		if (preFabNode) {
// 			preFabNode.removeFromParent();
// 		}
// 		return
// 	}
//
// 	cc.loader.loadRes('prefabs/withdrawalMaintain', function (err, prefab) {
// 		preFabNode = cc.instantiate(prefab);
// 		preFabNode.setTag(100051);
// 		curScene.addChild(preFabNode);
// 		ddz.GlobalFuncs.setToCenter(preFabNode);
// 		var com = preFabNode.getComponent("withdrawalMaintain");
// 		com.setTips(timerStr);
// 	});
// },
//
hall.GlobalFuncs.onEnterQueue = function(){
	var preFabPath = 'prefabs/enter_queue';
	var comName = "enter_queue";
	ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var com = preFabNode.getComponent(comName);
		com.enterQueue();
		com.playAni(true);
		ty.NotificationCenter.trigger(ddz.EventType.SHOW_MATCHING);
	});
};
	
hall.GlobalFuncs.getSpDataPath = function (isDiZhu, isMale) {
	// var spDataPath;
	// if (isDiZhu){
	// 	if (isMale){
	// 		spDataPath = "spine/ddz_newoneself_dizhu";
	// 	}else{
	// 		spDataPath = "spine/ddz_newoneself_dizhupo";
	// 	}
	// }
	// else{
	// 	if (isMale){
	// 		spDataPath = "spine/ddz_newoneself_nongmin";
	// 	}else{
	// 		spDataPath = "spine/ddz_newoneself_nvwa";
	// 	}
	// }
	// return spDataPath;
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
//返回一个100以内小于number的数
hall.GlobalFuncs.getShareRandomNumberWithShareList = function(shareList) {
	var returnRandom = hall.GlobalFuncs.getRandomNumberBefore(100) ;
	var nowIndex = 0;
	if(shareList && shareList.length && shareList.length > 0){
		while (returnRandom > shareList[nowIndex].weight){
			returnRandom -= shareList[nowIndex].weight;
			nowIndex ++ ;
			if(nowIndex >= shareList.length){
				nowIndex = 0;
			}
		}
	}
	return nowIndex;
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

//获取按钮分享文本
hall.GlobalFuncs.getButtonTitle = function(_shareType) {
	var richText = "分享";
	if (_shareType && ddz.gameModel.shareConfig) {
		if (ddz.gameModel.shareConfig[_shareType]) {
			var _buttonTitle = ddz.gameModel.shareConfig[_shareType].buttonTitle;
			if (_buttonTitle) {
				var _string = hall.GlobalFuncs.replaceKeyWordInString(_buttonTitle);
				richText = _string;
			}
		}
	}
	return richText;
};

hall.GlobalFuncs.isEmptyObject = function (obj) {
	for (var name in obj) {
		return false;
	}
	return true;
};

hall.GlobalFuncs.sliceStringToLength  = function (str, length) {
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

// 按钮特效 scale 缩放大小
hall.GlobalFuncs.btnEffect = function (node,scale,self){
	node.on(cc.Node.EventType.TOUCH_START, function(){
		node.setScale(scale);
	}, self, true);
	// node.on(cc.Node.EventType.TOUCH_MOVE, function(){
    //
	// }, self, true);
	node.on(cc.Node.EventType.TOUCH_END, function(){
		node.setScale(1);
	}, self, true);
	node.on(cc.Node.EventType.TOUCH_CANCEL, function(){
		node.setScale(1);
	}, self, true);
};

// 按钮缩放,放大特效
// 按钮特效 scale 缩放大小
hall.GlobalFuncs.btnScaleEffect = function (node,scale){
	node.stopAllActions();
	var scale_1 = cc.scaleTo(0.2, scale, scale);
	var scale_2 = cc.scaleTo(0.2, 1, 1);
	var delay = cc.delayTime(1.3);
	var seq1 = cc.sequence(scale_1, scale_2,scale_1, scale_2,delay);
	node.runAction(seq1.repeatForever());
};

hall.GlobalFuncs.checkNeedLoadRemoteRes = function () {
	var localVersion = hall.GlobalFuncs.ReadNumFromLocalStorage(ddz.LOCAL_VERSION_KEY, 0);
	if (localVersion != ty.SystemInfo.version){
		hall.GlobalFuncs.setInLocalStorage(ddz.LOCAL_VERSION_KEY, ty.SystemInfo.version);
		return true;
	}
	return false;
};

/**
 * 从预制件加载弹窗
 * @param preFabPath 预制件路径
 * @param func 回调
 */
hall.GlobalFuncs.showPopWinByPreFab = function (preFabPath, func) {
	cc.loader.loadRes(preFabPath, function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		// if (preFabPath == "ani/ddz_matching/Matching"){
		//     preFabNode.y += 160;
		// }
		func(preFabNode);
	});
};

/**
 * 检查城市名是否为北上广深
 * @param cityName 城市名
 * @returns {boolean}
 */
hall.GlobalFuncs.checkBSGS = function (cityName) {
	if (!cityName) {
		return true
	}
	var keyWord;
	for (var key in ty.SystemInfo.bsgsCitys){
		keyWord = ty.SystemInfo.bsgsCitys[key];
		if (cityName.indexOf(keyWord) > -1){
			return true;
		}
	}
	return false;
};

hall.GlobalFuncs._TAG = "hall.GlobalFuncs";