//
// highladder
//
// Created by guangy on 2016-03-08
// 

snipe.GlobalFuncs = {};

/**
 * 秒转换为时间
 * @param value 秒
 */
snipe.GlobalFuncs.formatTime = function (value) {
	var h = Math.floor(value / 3600);
	var m = Math.floor((value % 3600)/60);
	var s = parseInt(value % 60);

	var mh = h < 10 ? "0" + h : "" + h;
	var ms = m < 10 ? "0" + m : "" + m;
	var ss = s < 10 ? "0" + s : "" + s;

	return mh +  ":" + ms + ":" + ss;
};

snipe.GlobalFuncs.drawGameCanvas = function () {
	var webC = cc._renderContext;
	// webC.enable(webC.SCISSOR_TEST);
	webC.clearColor(183/255, 220/255,181/255, 1);//底部颜色
	webC.clear(webC.COLOR_BUFFER_BIT | webC.DEPTH_BUFFER_BIT);
};

snipe.GlobalFuncs.getBackButtonPositionY = function () {
	var systemTy = ty.UserInfo.systemType;
	var sceneSize = cc.director.getWinSize();
	var reultHeight = 0;
	if (systemTy == ty.UserInfo.SYSTEMTYPE.iphoneOtherType){//其他iPhone
		reultHeight = sceneSize.height/2-49;
	}else if(systemTy == ty.UserInfo.SYSTEMTYPE.iPhoneXType){ //iPhoneX
		reultHeight = sceneSize.height/2-102;
	}else if(systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDOther){ //cc.sys.OS_ANDROID
		reultHeight = sceneSize.height/2-54;
	}else if(systemTy == ty.UserInfo.SYSTEMTYPE.iPhone7P8PType){ //8p
		reultHeight = sceneSize.height/2-46;
	} else if(systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85){ //vivo Y85A
		reultHeight = sceneSize.height/2-104;
	}
	return reultHeight;
};

snipe.GlobalFuncs.showAdBtnWithTag  = function (tag,growth) {
	// hall.LOGE("showAdBtnWithTag","=====1===="+tag+"======"+growth);
	var curScene = cc.director.getScene();
	if (curScene.name != 'snipe_main'){
		return;
	}
	if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0) >= 3){
		snipe.GlobalFuncs.hideAdBtnWithTag(tag,true);
		return;
	}
	if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_COUNT_TODAY,0) < snipe.GameWorld.growthConfig.showDelayed){
		snipe.GlobalFuncs.hideAdBtnWithTag(tag,true);
		return;
	}
	if (snipe.gameModel.getAllCheckConfig()){
		snipe.GlobalFuncs.hideAdBtnWithTag(tag,true);
		return;
	}

	var tempY = 280-60;
	if(!snipe.GameWorld.gunnerShareSchemeConfig || snipe.GameWorld.gunnerShareSchemeConfig.showBanner){
		tempY += 60;
	}
	if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType){
		tempY += 70;
	}
	if (snipe.GameWorld.growthConfig[growth].indexOf('CO') > -1) {
		if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0) != 1){
			if (hall.adManager.getAdNodeByTag(tag)) {
				hall.adManager.getAdNodeByTag(tag).showAdNode();
			} else {
				hall.adManager.showAd({x: 52, y: tempY}, tag);
			}
		}
	} else if (snipe.GameWorld.growthConfig[growth].indexOf('STU') > -1) {
		if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0) != 2){
			var tempX = 65;
			var sceneSize = cc.director.getWinSize();
			if(tag == 5004){
				tempX = sceneSize.width - 80;
				tempY = sceneSize.height - 150;
			}
			snipe.sxAdmanager.show(tempX, tempY, snipe.GameWorld.growthConfig.STUScale);
		}
	}
};

snipe.GlobalFuncs.hideAdBtnWithTag  = function (tag,hideSx) {
	if(hall.adManager.getAdNodeByTag(tag)){
		hall.adManager.getAdNodeByTag(tag).hideAdNode();
	}
	if(hideSx){
		snipe.sxAdmanager.hide();
	}
};

snipe.GlobalFuncs.setDayOriginGameData = function () {
	var toDay = hall.GlobalTimer.getCurDay();
	var hour = hall.GlobalTimer.getCurHours();
	if(toDay != hall.GlobalFuncs.ReadStringFromLocalStorage(snipe.gameModel.LAST_VIDEO_DAY,"")){
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.LAST_VIDEO_DAY,toDay);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.DAY_VIDEO_TIME,0);
	}
	if(toDay != hall.GlobalFuncs.ReadStringFromLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_DAY,"")){
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_DAY,toDay);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME,0);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_STATE,0);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME_CHECK,0);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_STATE_CHECK,0);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_HOUR,hour);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0);
		hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_COUNT_TODAY,0);
		// hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_HIDE_TYPE_TODAY,0);
	}else {
		if(snipe.GameWorld.growthConfig.showRefresh){
			if(hour != hall.GlobalFuncs.ReadStringFromLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_HOUR,"")){
				hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_HOUR,hour);
				hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_STATE_TODAY,0);
				// hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_HIDE_TYPE_TODAY,0);
			}
		}
	}
};

snipe.GlobalFuncs.getOpenData = function (withOutMsg) {
	if (!wx.hasOwnProperty('getOpenDataContext')){
		if (!withOutMsg){
			hall.MsgBoxManager.showToast({title:'您当前版本,不支持排行榜,请升级微信!'});
		}
		return null;
	}
	var openDataContext = wx.getOpenDataContext();
	if (openDataContext){
		return openDataContext
	}
	return null;
};

/**
 * 更新自己的排行榜数据
 * @param val
 */
snipe.GlobalFuncs.upDateRankData = function (val) {
	if(!ty.UserInfo.userId){
		return;
	}
	// snipe.gameModel.saveHigherScore(snipe.GameWorld.totalScore);
	var openDataContext = snipe.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'updateRank',
		sumScore: val,
		userId:ty.UserInfo.userId
	})
};

/**
 * 更新自己的排行榜星期数据
 * @param val
 */
snipe.GlobalFuncs.upDateRankDataWeek = function (val) {
	// if(!snipe.GameWorld.game_friendData){
	// 	return;
	// }
	// var userDataList = JSON.parse(snipe.GameWorld.game_friendData);
	// var haveSelf = false;
	// if(userDataList && userDataList.length){
	// 	for (var i = userDataList.length-1 ; i >= 0 ; i --){
	// 		var user = userDataList[i];
	// 		if(user.userId == ty.UserInfo.userId){
	// 			haveSelf = true;
	// 			if(user.week != val){
	// 				snipe.GlobalFuncs.upDateRankData("0");
	// 			}
	// 			break;
	// 		}
	// 	}
	// }
	// if(!haveSelf){
	// 	snipe.GlobalFuncs.upDateRankData("0");
	// }

	var openDataContext = snipe.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'updateRankWeek',
		week: val
	})
};

snipe.GlobalFuncs.getUserInfo = function () {
	var openDataContext = snipe.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'getUserInfo'
	})
};

snipe.GlobalFuncs.getFriendInfo = function () {
	var openDataContext = snipe.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method:'getFriendInfo',
		week : week,
		userId : ty.UserInfo.userId,
		sumScore : snipe.GameWorld.totalScore
	})
};

snipe.GlobalFuncs.getThirdRankInfo = function () {
	var openDataContext = snipe.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method:'getResultRank',
		week : week,
		userId : ty.UserInfo.userId,
		sumScore : snipe.GameWorld.totalScore
	})
};

/**
 * 获取群排行榜数据
 * @param val 群shareTicket
 */
snipe.GlobalFuncs.showGroupRank = function (val) {
	var openDataContext = snipe.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method:'showGroupRank',
		shareTicket: val,
		userId:ty.UserInfo.userId,
		rankType : "sumScore",
		week : week
	})
};

/**
 * 展示自己的好友排行榜数
 */
snipe.GlobalFuncs.showFriendRank = function () {
	var openDataContext = snipe.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method:'showFriendRank',
		userId:ty.UserInfo.userId,
		rankType : "sumScore",
		week : week
	})
};
/**
 * 初始化
 */
snipe.GlobalFuncs.showOrigin = function () {
	var openDataContext = snipe.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showOrigin'
	})
};

snipe.GlobalFuncs.setCrazyProperty = function (type) {
	var bulletType;
	if(type != "handGun"){
		bulletType = snipe.GameWorld.propertyConfig[type].bulletType;
	}else {
		bulletType = "bulletType0";
	}
	snipe.GameWorld.bulletBlood = snipe.GameWorld.bulletConfig[bulletType].blood;
	snipe.GameWorld.bulletPenetrate = snipe.GameWorld.bulletConfig[bulletType].penetrate;
	if(bulletType == "bulletType2"){
		snipe.GameWorld.bulletRange = snipe.GameWorld.bulletConfig[bulletType].range;
	}else {
		snipe.GameWorld.bulletRange = 0;
	}
	snipe.GlobalFuncs.changeBulletSoundAndSprite(bulletType);
};
snipe.GlobalFuncs.restoreFromCrazyMoment = function () {
	snipe.GameWorld.bulletBlood = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].blood;
	snipe.GameWorld.bulletPenetrate = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].penetrate;
	if(snipe.GameWorld.bulletType == "bulletType2"){
		snipe.GameWorld.bulletRange = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].range;
	}else {
		snipe.GameWorld.bulletRange = 0;
	}
	if(snipe.GameWorld.bulletType != "bulletType0"){
		snipe.GameWorld.doubleGunUseTime -= 1;
	}
	snipe.GlobalFuncs.changeBulletSoundAndSprite(snipe.GameWorld.bulletType);
};

//设置子弹类型
snipe.GlobalFuncs.setBulletType = function (type) {
	snipe.GameWorld.bulletType = type;
	snipe.GameWorld.bulletBlood = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].blood;
	snipe.GameWorld.bulletPenetrate = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].penetrate;
	snipe.GameWorld.bulletRange = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].range;//霰弹枪非零
	snipe.GameWorld.doubleGunUseTime = 1;//带功能的枪当前使用的次数
	// snipe.GameWorld.bulletPenetrateBucket = false;
	var index = snipe.GameWorld.bulletTypeList.indexOf(type);
	var gunType = snipe.GameWorld.treasureBoxTypeList[index+2];
	snipe.GameWorld.doubleGunUseTimeCan = snipe.GameWorld.propertyConfig[gunType].time;

	snipe.GameWorld.bulletRunningTimeCan = 0;
	snipe.GameWorld.bulletRunningInterval = 0;
	snipe.GameWorld.gunFireInterval = 0;
	if(type == "bulletType0"){
		snipe.GameWorld.doubleGunUseTime = -1;
		snipe.GameWorld.doubleGunUseTimeCan = 0;
	}else if(type == "bulletType5"){//三连发
		snipe.GameWorld.bulletRunningTimeCan = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].runningFireTime;
		snipe.GameWorld.bulletRunningInterval = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].runningInterval;
	}else if(type == "bulletType6" || type == "bulletType7"){//按住连发
		snipe.GameWorld.gunFireInterval = snipe.GameWorld.bulletConfig[snipe.GameWorld.bulletType].gunFireInterval;
	}
	snipe.GlobalFuncs.changeBulletSoundAndSprite(type);
};


snipe.GlobalFuncs.changeBulletSoundAndSprite = function (type) {
	var index = snipe.GameWorld.bulletTypeList.indexOf(type);
	snipe.EffectPath_mp3.gunHits = snipe.EffectPath_mp3["gunHits"+index];
	ty.NotificationCenter.trigger(snipe.EventType.REPLACE_GUN,index);
};

snipe.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93),cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
};

snipe.GlobalFuncs.setToCenter = function (node) {
	var winSize = cc.director.getWinSize();
	node.x = winSize.width/2;
	node.y = winSize.height/2;
};


//展示互助礼界面
snipe.GlobalFuncs.showDiamondGift = function (state,result) {
	cc.loader.loadRes('snipe_prefabs/shot_diamond', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('shot_diamond');
		com.changeStateWithInfo(state,result);
	}.bind(this));
};
//展示排行榜界面
snipe.GlobalFuncs.showRankList = function (shareTicket) {
	if(snipe.gameModel.rankWindow){
		snipe.gameModel.rankWindow.changeButtonToRank(shareTicket);
	}else {
		cc.loader.loadRes('snipe_prefabs/shot_rank', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			var curScene = cc.director.getScene();
			if(curScene){
				curScene.addChild(preFabNode);
				snipe.GlobalFuncs.setToCenter(preFabNode);
				var com = preFabNode.getComponent('shot_rank');
				snipe.gameModel.rankWindow = com;
				com.changeButtonToRank(shareTicket);
			}
		}.bind(this));
	}
};
//展示新手引导面板
snipe.GlobalFuncs.showNewTipsPanel = function () {
	cc.loader.loadRes('snipe_prefabs/newerNode', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示免费道具面板
snipe.GlobalFuncs.showFreeTool = function () {
	cc.loader.loadRes('snipe_prefabs/shot_freeTool', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示复活面板
snipe.GlobalFuncs.showResurgence = function () {
	cc.loader.loadRes('snipe_prefabs/shot_resurgence', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示游戏结束我的成绩界面
snipe.GlobalFuncs.showGameOverWithMyScore = function () {
	var count = hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_ADBTN_COUNT_TODAY,0);
	count ++;
	hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_ADBTN_COUNT_TODAY,count);
	cc.loader.loadRes('snipe_prefabs/shot_result', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示分享选择界面
snipe.GlobalFuncs.showShareResult  = function () {
	cc.loader.loadRes('snipe_prefabs/shot_shareResult', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示神秘礼包
snipe.GlobalFuncs.showMysteryGifgBag = function (result) {
	cc.loader.loadRes('snipe_prefabs/shot_mystery_giftBag', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
		// var com = preFabNode.getComponent('shot_mystery_gifgBag');
		// com.updateInfo(result);
	}.bind(this));
};
//展示道具宝箱界面
snipe.GlobalFuncs.showPropBox = function (result,doubleHit) {
	cc.loader.loadRes('snipe_prefabs/shot_prop', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('shot_prop');
		if(doubleHit){
			com.updateToDoubleHitContinue();
		}else {
			com.updateInfo(result);
		}
	}.bind(this));
};
//展示宝箱瓶界面
snipe.GlobalFuncs.showSecretBox = function (boxType,delegate) {
	ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,["secretBox"]);
	cc.loader.loadRes('snipe_prefabs/shot_secret_box', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('shot_secret_box');
		com.setBoxTypeWithType(boxType,delegate);
	}.bind(this));
};
//获得道具动画
snipe.GlobalFuncs.playGetPropBoxAni = function (state,count) {
	cc.loader.loadRes('snipe_prefabs/shot_getProp', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('zidandaoju');
		com.updateProp(state,count);
	}.bind(this));
};

//展示debug面板
snipe.GlobalFuncs.showDebugPanel = function () {
	cc.loader.loadRes('snipe_prefabs/debugNode', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		snipe.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};