//
// highladder
//
// Created by guangy on 2016-03-08
// 

shot.GlobalFuncs = {};

/**
 * 秒转换为时间
 * @param value 秒
 */
shot.GlobalFuncs.formatTime = function (value) {
	var h = Math.floor(value / 3600);
	var m = Math.floor((value % 3600)/60);
	var s = parseInt(value % 60);

	var mh = h < 10 ? "0" + h : "" + h;
	var ms = m < 10 ? "0" + m : "" + m;
	var ss = s < 10 ? "0" + s : "" + s;

	return mh +  ":" + ms + ":" + ss;
};

shot.GlobalFuncs.drawGameCanvas = function () {
	var webC = cc._renderContext;
	// webC.enable(webC.SCISSOR_TEST);
	webC.clearColor(183/255, 220/255,181/255, 1);//底部颜色
	webC.clear(webC.COLOR_BUFFER_BIT | webC.DEPTH_BUFFER_BIT);
};

shot.GlobalFuncs.getBackButtonPositionY = function () {
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

shot.GlobalFuncs.getOpenData = function (withOutMsg) {
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
shot.GlobalFuncs.upDateRankData = function (val) {
	if(!ty.UserInfo.userId){
		return;
	}
	// shot.gameModel.saveHigherScore(shot.GameWorld.totalScore);
	var openDataContext = shot.GlobalFuncs.getOpenData(true);
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
shot.GlobalFuncs.upDateRankDataWeek = function (val) {
	if(!shot.GameWorld.game_friendData){
		return;
	}
	var userDataList = JSON.parse(shot.GameWorld.game_friendData);
	var haveSelf = false;
	if(userDataList && userDataList.length){
		for (var i = userDataList.length-1 ; i >= 0 ; i --){
			var user = userDataList[i];
			if(user.userId == ty.UserInfo.userId){
				haveSelf = true;
				if(user.week != val){
					shot.GlobalFuncs.upDateRankData("0");
				}
				break;
			}
		}
	}
	if(!haveSelf){
		shot.GlobalFuncs.upDateRankData("0");
	}

	var openDataContext = shot.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'updateRankWeek',
		week: val
	})
};

shot.GlobalFuncs.getUserInfo = function () {
	var openDataContext = shot.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'getUserInfo'
	})
};

shot.GlobalFuncs.getFriendInfo = function () {
	var openDataContext = shot.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method:'getFriendInfo',
		week : week,
		userId : ty.UserInfo.userId,
		sumScore : shot.GameWorld.totalScore
	})
};

shot.GlobalFuncs.getThirdRankInfo = function () {
	var openDataContext = shot.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method:'getResultRank',
		week : week,
		userId : ty.UserInfo.userId,
		sumScore : shot.GameWorld.totalScore
	})
};

/**
 * 获取群排行榜数据
 * @param val 群shareTicket
 */
shot.GlobalFuncs.showGroupRank = function (val) {
	var openDataContext = shot.GlobalFuncs.getOpenData();
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
shot.GlobalFuncs.showFriendRank = function () {
	var openDataContext = shot.GlobalFuncs.getOpenData();
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
shot.GlobalFuncs.showOrigin = function () {
	var openDataContext = shot.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showOrigin'
	})
};

shot.GlobalFuncs.setCrazyProperty = function (type) {
	var bulletType;
	if(type != "handGun"){
		bulletType = shot.GameWorld.propertyConfig[type].bulletType;
	}else {
		bulletType = "bulletType0";
	}
	shot.GameWorld.bulletBlood = shot.GameWorld.bulletConfig[bulletType].blood;
	shot.GameWorld.bulletPenetrate = shot.GameWorld.bulletConfig[bulletType].penetrate;
	if(bulletType == "bulletType2"){
		shot.GameWorld.bulletRange = shot.GameWorld.bulletConfig[bulletType].range;
	}else {
		shot.GameWorld.bulletRange = 0;
	}
	shot.GlobalFuncs.changeBulletSoundAndSprite(bulletType);
};
shot.GlobalFuncs.restoreFromCrazyMoment = function () {
	shot.GameWorld.bulletBlood = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].blood;
	shot.GameWorld.bulletPenetrate = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].penetrate;
	if(shot.GameWorld.bulletType == "bulletType2"){
		shot.GameWorld.bulletRange = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].range;
	}else {
		shot.GameWorld.bulletRange = 0;
	}
	if(shot.GameWorld.bulletType != "bulletType0"){
		shot.GameWorld.doubleGunUseTime -= 1;
	}
	shot.GlobalFuncs.changeBulletSoundAndSprite(shot.GameWorld.bulletType);
};

//设置子弹类型
shot.GlobalFuncs.setBulletType = function (type) {
	shot.GameWorld.bulletType = type;
	shot.GameWorld.bulletBlood = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].blood;
	shot.GameWorld.bulletPenetrate = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].penetrate;
	shot.GameWorld.bulletRange = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].range;//霰弹枪非零
	shot.GameWorld.doubleGunUseTime = 1;//带功能的枪当前使用的次数
	// shot.GameWorld.bulletPenetrateBucket = false;
	var index = shot.GameWorld.bulletTypeList.indexOf(type);
	var gunType = shot.GameWorld.treasureBoxTypeList[index+1];
	shot.GameWorld.doubleGunUseTimeCan = shot.GameWorld.propertyConfig[gunType].time;

	shot.GameWorld.bulletRunningTimeCan = 0;
	shot.GameWorld.bulletRunningInterval = 0;
	shot.GameWorld.gunFireInterval = 0;
	if(type == "bulletType0"){
		shot.GameWorld.doubleGunUseTime = -1;
		shot.GameWorld.doubleGunUseTimeCan = 0;
	}else if(type == "bulletType5"){//三连发
		shot.GameWorld.bulletRunningTimeCan = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].runningFireTime;
		shot.GameWorld.bulletRunningInterval = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].runningInterval;
	}else if(type == "bulletType6"){//按住连发
		shot.GameWorld.gunFireInterval = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].gunFireInterval;
	}
	shot.GlobalFuncs.changeBulletSoundAndSprite(type);
};


shot.GlobalFuncs.changeBulletSoundAndSprite = function (type) {
	var index = shot.GameWorld.bulletTypeList.indexOf(type);
	shot.EffectPath_mp3.gunHits = shot.EffectPath_mp3["gunHits"+index];
	ty.NotificationCenter.trigger(shot.EventType.REPLACE_GUN,index);
};

shot.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93),cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
};

shot.GlobalFuncs.setToCenter = function (node) {
	var winSize = cc.director.getWinSize();
	node.x = winSize.width/2;
	node.y = winSize.height/2;
};


//展示互助礼界面
shot.GlobalFuncs.showDiamondGift = function (state,result) {
	cc.loader.loadRes('shot_prefabs/shot_diamond', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('shot_diamond');
		com.changeStateWithInfo(state,result);
	}.bind(this));
};
//展示排行榜界面
shot.GlobalFuncs.showRankList = function (shareTicket) {
	if(shot.gameModel.rankWindow){
		shot.gameModel.rankWindow.changeButtonToRank(shareTicket);
	}else {
		cc.loader.loadRes('shot_prefabs/shot_rank', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			var curScene = cc.director.getScene();
			if(curScene){
				curScene.addChild(preFabNode);
				shot.GlobalFuncs.setToCenter(preFabNode);
				var com = preFabNode.getComponent('shot_rank');
				shot.gameModel.rankWindow = com;
				com.changeButtonToRank(shareTicket);
			}
		}.bind(this));
	}
};
//展示新手引导面板
shot.GlobalFuncs.showNewTipsPanel = function () {
	cc.loader.loadRes('shot_prefabs/newerNode', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};

//展示复活面板
shot.GlobalFuncs.showResurgence = function () {
	cc.loader.loadRes('shot_prefabs/shot_resurgence', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示游戏结束我的成绩界面
shot.GlobalFuncs.showGameOverWithMyScore = function () {
	cc.loader.loadRes('shot_prefabs/shot_result', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示神秘礼包
shot.GlobalFuncs.showMysteryGifgBag = function (result) {
	cc.loader.loadRes('shot_prefabs/shot_mystery_giftBag', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
		// var com = preFabNode.getComponent('shot_mystery_gifgBag');
		// com.updateInfo(result);
	}.bind(this));
};
//展示道具宝箱界面
shot.GlobalFuncs.showPropBox = function (result) {
	cc.loader.loadRes('shot_prefabs/shot_prop', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('shot_prop');
		com.updateInfo(result);
	}.bind(this));
};
//展示宝箱瓶界面
shot.GlobalFuncs.showSecretBox = function (boxType,delegate) {
	ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,["secretBox"]);
	cc.loader.loadRes('shot_prefabs/shot_secret_box', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('shot_secret_box');
		com.setBoxTypeWithType(boxType,delegate);
	}.bind(this));
};
//获得道具动画
shot.GlobalFuncs.playGetPropBoxAni = function (state,bulletType) {
	cc.loader.loadRes('shot_prefabs/shot_getProp', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('zidandaoju');
		com.updateProp(state,bulletType);
	}.bind(this));
};

//展示debug面板
shot.GlobalFuncs.showDebugPanel = function () {
	cc.loader.loadRes('shot_prefabs/debugNode', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		shot.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};

// //展示游戏结束是否复活界面
// shot.GlobalFuncs.showGameResultResurgence = function () {
// 	cc.loader.loadRes('prefabs/shot_window_result', function (err, prefab) {
// 		var preFabNode = cc.instantiate(prefab);
// 		cc.director.getScene().addChild(preFabNode);
// 		shot.GlobalFuncs.setToCenter(preFabNode);
// 	}.bind(this));
// };
// //展示提示
// shot.GlobalFuncs.showNoDiamondToastTip = function (titleString) {
// 	cc.loader.loadRes('prefabs/shot_noDiamond_toastTip', function (err, prefab) {
// 		var preFabNode = cc.instantiate(prefab);
// 		cc.director.getScene().addChild(preFabNode);
// 		shot.GlobalFuncs.setToCenter(preFabNode);
// 		if(titleString){
// 			var com = preFabNode.getComponent('shot_noDiamond_toastTip');
// 			com.changeTitle(titleString);
// 		}
// 	}.bind(this));
// };
// //展示好友帮助获得钻石提示
// shot.GlobalFuncs.showMainToastWithName = function (name,count,picUrl) {
// 	var curScene = cc.director.getScene();
// 	hall.LOGD(this._TAG, "curScene : " + curScene.name);
// 	if (curScene.name == 'shot_main'){
// 		return;
// 	}
// 	cc.loader.loadRes('prefabs/main_toast', function (err, prefab) {
// 		var preFabNode = cc.instantiate(prefab);
// 		cc.director.getScene().addChild(preFabNode);
// 		shot.GlobalFuncs.setToCenter(preFabNode);
// 		var com = preFabNode.getComponent('main_toast');
// 		com.changeName(name,count,picUrl);
// 	}.bind(this));
// };
//
// //展示暂停面板
// shot.GlobalFuncs.showPausePanel = function () {
// 	cc.loader.loadRes('prefabs/shot_pause', function (err, prefab) {
// 		var preFabNode = cc.instantiate(prefab);
// 		cc.director.getScene().addChild(preFabNode);
// 		shot.GlobalFuncs.setToCenter(preFabNode);
// 	}.bind(this));
// };
