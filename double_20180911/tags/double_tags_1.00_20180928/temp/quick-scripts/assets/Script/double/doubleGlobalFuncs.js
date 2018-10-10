(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/double/doubleGlobalFuncs.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '423dcQUPz9PVL48xJxlq+qX', 'doubleGlobalFuncs', __filename);
// Script/double/doubleGlobalFuncs.js

"use strict";

//
// highladder
//
// Created by guangy on 2016-03-08
// 

double.GlobalFuncs = {};

/**
 * 秒转换为时间
 * @param value 秒
 */
double.GlobalFuncs.formatTime = function (value) {
	var h = Math.floor(value / 3600);
	var m = Math.floor(value % 3600 / 60);
	var s = parseInt(value % 60);

	var mh = h < 10 ? "0" + h : "" + h;
	var ms = m < 10 ? "0" + m : "" + m;
	var ss = s < 10 ? "0" + s : "" + s;

	return mh + ":" + ms + ":" + ss;
};

double.GlobalFuncs.drawGameCanvas = function () {
	var webC = cc._renderContext;
	// webC.enable(webC.SCISSOR_TEST);
	webC.clearColor(183 / 255, 220 / 255, 181 / 255, 1); //底部颜色
	webC.clear(webC.COLOR_BUFFER_BIT | webC.DEPTH_BUFFER_BIT);
};

double.GlobalFuncs.getBackButtonPositionY = function () {
	var systemTy = ty.UserInfo.systemType;
	var sceneSize = cc.director.getWinSize();
	var reultHeight = 0;
	if (systemTy == ty.UserInfo.SYSTEMTYPE.iphoneOtherType) {
		//其他iPhone
		reultHeight = sceneSize.height / 2 - 49;
	} else if (systemTy == ty.UserInfo.SYSTEMTYPE.iPhoneXType) {
		//iPhoneX
		reultHeight = sceneSize.height / 2 - 102;
	} else if (systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDOther) {
		//cc.sys.OS_ANDROID
		reultHeight = sceneSize.height / 2 - 54;
	} else if (systemTy == ty.UserInfo.SYSTEMTYPE.iPhone7P8PType) {
		//8p
		reultHeight = sceneSize.height / 2 - 46;
	} else if (systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85) {
		//vivo Y85A
		reultHeight = sceneSize.height / 2 - 104;
	}
	return reultHeight;
};

double.GlobalFuncs.showAdBtnWithTag = function (tag, growth) {
	var curScene = cc.director.getScene();
	if (curScene.name != 'double_main') {
		return;
	}

	if (hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.OPEN_ADBTN_STATE_TODAY, 0) >= 3) {
		double.GlobalFuncs.hideAdBtnWithTag(tag, true);
		return;
	}
	if (hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.OPEN_ADBTN_COUNT_TODAY, 0) < double.GameWorld.growthConfig.showDelayed) {
		double.GlobalFuncs.hideAdBtnWithTag(tag, true);
		return;
	}

	if (!double.gameModel.getAllCheckConfig()) {
		var tempY = 280;
		if (ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType) {
			tempY = 350;
		}
		if (double.GameWorld.growthConfig[growth].indexOf('CO') > -1) {
			if (hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.OPEN_ADBTN_STATE_TODAY, 0) != 1) {
				if (hall.adManager.getAdNodeByTag(tag)) {
					hall.adManager.getAdNodeByTag(tag).showAdNode();
				} else {
					hall.adManager.showAd({ x: 52, y: tempY }, tag);
				}
			}
		} else if (double.GameWorld.growthConfig[growth].indexOf('STU') > -1) {
			if (hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.OPEN_ADBTN_STATE_TODAY, 0) != 2) {
				double.sxAdmanager.show(65, tempY, 0.6);
			}
		}
	}
};

double.GlobalFuncs.hideAdBtnWithTag = function (tag, hideSx) {
	if (hall.adManager.getAdNodeByTag(tag)) {
		hall.adManager.getAdNodeByTag(tag).hideAdNode();
	}
	if (hideSx) {
		double.sxAdmanager.hide();
	}
};

double.GlobalFuncs.getOpenData = function (withOutMsg) {
	if (!wx.hasOwnProperty('getOpenDataContext')) {
		if (!withOutMsg) {
			hall.MsgBoxManager.showToast({ title: '您当前版本,不支持排行榜,请升级微信!' });
		}
		return null;
	}
	var openDataContext = wx.getOpenDataContext();
	if (openDataContext) {
		return openDataContext;
	}
	return null;
};

/**
 * 更新自己的排行榜数据
 * @param val
 */
double.GlobalFuncs.upDateRankData = function (val) {
	if (!ty.UserInfo.userId) {
		return;
	}
	// double.gameModel.saveHigherScore(double.GameWorld.totalScore);
	var openDataContext = double.GlobalFuncs.getOpenData(true);
	if (!openDataContext) {
		return;
	}
	openDataContext.postMessage({
		method: 'updateRank',
		sumScore: val,
		userId: ty.UserInfo.userId
	});
};

/**
 * 更新自己的排行榜星期数据
 * @param val
 */
double.GlobalFuncs.upDateRankDataWeek = function (val) {
	var openDataContext = double.GlobalFuncs.getOpenData(true);
	if (!openDataContext) {
		return;
	}
	openDataContext.postMessage({
		method: 'updateRankWeek',
		week: val
	});
};

double.GlobalFuncs.getUserInfo = function () {
	var openDataContext = double.GlobalFuncs.getOpenData(true);
	if (!openDataContext) {
		return;
	}
	openDataContext.postMessage({
		method: 'getUserInfo'
	});
};

double.GlobalFuncs.getFriendInfo = function () {
	var openDataContext = double.GlobalFuncs.getOpenData(true);
	if (!openDataContext) {
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method: 'getFriendInfo',
		week: week,
		userId: ty.UserInfo.userId,
		sumScore: double.GameWorld.totalScore
	});
};

double.GlobalFuncs.getThirdRankInfo = function () {
	var openDataContext = double.GlobalFuncs.getOpenData(true);
	if (!openDataContext) {
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method: 'getResultRank',
		week: week,
		userId: ty.UserInfo.userId,
		sumScore: double.GameWorld.totalScore
	});
};

/**
 * 获取群排行榜数据
 * @param val 群shareTicket
 */
double.GlobalFuncs.showGroupRank = function (val) {
	var openDataContext = double.GlobalFuncs.getOpenData();
	if (!openDataContext) {
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method: 'showGroupRank',
		shareTicket: val,
		userId: ty.UserInfo.userId,
		rankType: "sumScore",
		week: week
	});
};

/**
 * 展示自己的好友排行榜数
 */
double.GlobalFuncs.showFriendRank = function () {
	var openDataContext = double.GlobalFuncs.getOpenData();
	if (!openDataContext) {
		return;
	}
	var week = hall.GlobalTimer.getCurWeek();
	openDataContext.postMessage({
		method: 'showFriendRank',
		userId: ty.UserInfo.userId,
		rankType: "sumScore",
		week: week
	});
};
/**
 * 初始化
 */
double.GlobalFuncs.showOrigin = function () {
	var openDataContext = double.GlobalFuncs.getOpenData();
	if (!openDataContext) {
		return;
	}
	openDataContext.postMessage({
		method: 'showOrigin'
	});
};

//设置子弹类型
double.GlobalFuncs.setDoubleGunType = function (weaponType, type) {
	double.GameWorld.weaponType = weaponType;
	double.GameWorld.gunType = type;
	// "damageBonus":0.9, //伤害力(对目标物血量的影响)
	// "impactForce": 100, //冲击力(对目标物速度的影响)
	// "arrowInitializedSpeed":1000
	double.GameWorld.gunDamageBonus = double.GameWorld.gunConfig[type].damageBonus;
	double.GameWorld.impactForce = double.GameWorld.gunConfig[type].impactForce;
	double.GameWorld.arrowSpeed = double.GameWorld.gunConfig[type].arrowInitializedSpeed;

	var index;
	if (weaponType == 0) {
		//枪
		index = double.GameWorld.doubleGunNameList.indexOf(type);
		double.GameWorld.arrowType = "";
		double.EffectPath_mp3.gunHits = double.EffectPath_mp3["gunHits" + index];
	} else {
		//弓箭
		index = double.GameWorld.doubleBowNameList.indexOf(type);
		double.GameWorld.arrowType = double.GameWorld.doubleArrowTypeList[index];
		// double.EffectPath_mp3.gunHits = double.EffectPath_mp3["gunHits"+index];
	}
	ty.NotificationCenter.trigger(double.EventType.CHANGE_GUN_TYPE, index);
};

double.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93), cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
};

double.GlobalFuncs.setToCenter = function (node) {
	var winSize = cc.director.getWinSize();
	node.x = winSize.width / 2;
	node.y = winSize.height / 2;
};

//展示结算界面
double.GlobalFuncs.showGameOverResult = function () {
	cc.loader.loadRes('double_prefabs/double_result', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		double.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('double_result');
		com.updateResultInfo();
	}.bind(this));
};

//展示复活面板
double.GlobalFuncs.showResurgence = function () {
	cc.loader.loadRes('double_prefabs/double_resurgence', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		double.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};

//展示暂停面板
double.GlobalFuncs.showGamePause = function () {
	cc.loader.loadRes('double_prefabs/double_pause', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		double.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};

//闯关成功面板(老虎机)
double.GlobalFuncs.showNewResult = function () {
	if (double.gameModel.newResult) {
		cc.director.getScene().addChild(double.gameModel.newResult);
		var com = double.gameModel.newResult.getComponent('double_newResult');
		com.updateNewResultInfo();
	} else {
		cc.loader.loadRes('double_prefabs/double_newResult', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			double.gameModel.newResult = preFabNode;
			cc.director.getScene().addChild(preFabNode);
			double.GlobalFuncs.setToCenter(preFabNode);
			var com = preFabNode.getComponent('double_newResult');
			com.updateNewResultInfo();
		}.bind(this));
	}
};
//展示奖励武器面板
double.GlobalFuncs.showRewardWeapon = function () {
	cc.loader.loadRes('double_prefabs/double_rewardWeapon', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		double.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};

//展示首页面板
double.GlobalFuncs.showTitlePage = function () {
	if (double.gameModel.titlePage) {
		cc.director.getScene().addChild(double.gameModel.titlePage);
		var com = double.gameModel.titlePage.getComponent('double_titlePage');
		com.updateTitlePage();
	} else {
		cc.loader.loadRes('double_prefabs/double_titlePage', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			double.gameModel.titlePage = preFabNode;
			cc.director.getScene().addChild(preFabNode);
			double.GlobalFuncs.setToCenter(preFabNode);
			var com = preFabNode.getComponent('double_titlePage');
			com.updateTitlePage();
		}.bind(this));
	}
};
//展示武器库
double.GlobalFuncs.showWeaponsDepot = function () {
	if (double.gameModel.weaponsDepot) {
		cc.director.getScene().addChild(double.gameModel.weaponsDepot);
		var com = double.gameModel.weaponsDepot.getComponent('double_weaponsDepot');
		com.updateWeaponsDepotInfo();
	} else {
		cc.loader.loadRes('double_prefabs/double_weaponsDepot', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			double.gameModel.weaponsDepot = preFabNode;
			cc.director.getScene().addChild(preFabNode);
			double.GlobalFuncs.setToCenter(preFabNode);
			var com = preFabNode.getComponent('double_weaponsDepot');
			com.updateWeaponsDepotInfo();
		}.bind(this));
	}
};
//展示获得新武器面板
double.GlobalFuncs.showWindowNewWeapon = function (type, objectTypeIndex) {
	if (double.gameModel.newWeapon) {
		cc.director.getScene().addChild(double.gameModel.newWeapon);
		var com = double.gameModel.newWeapon.getComponent('double_window_newWeapon');
		com.updateWeaponInfo(type, objectTypeIndex);
	} else {
		cc.loader.loadRes('double_prefabs/double_window_newWeapon', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			double.gameModel.newWeapon = preFabNode;
			cc.director.getScene().addChild(preFabNode);
			double.GlobalFuncs.setToCenter(preFabNode);
			var com = preFabNode.getComponent('double_window_newWeapon');
			com.updateWeaponInfo(type, objectTypeIndex);
		}.bind(this));
	}
};

//展示排行榜界面double.gameModel.rankWindow
double.GlobalFuncs.showRankList = function (shareTicket) {
	if (double.gameModel.rankWindow) {
		double.gameModel.rankWindow.changeButtonToRank(shareTicket);
	} else {
		cc.loader.loadRes('double_prefabs/double_rank', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			var curScene = cc.director.getScene();
			if (curScene) {
				curScene.addChild(preFabNode);
				double.GlobalFuncs.setToCenter(preFabNode);
				var com = preFabNode.getComponent('double_rank');
				double.gameModel.rankWindow = com;
				com.changeButtonToRank(shareTicket);
			}
		}.bind(this));
	}
};

//展示debug面板
double.GlobalFuncs.showDebugPanel = function () {
	cc.loader.loadRes('double_prefabs/debugNode', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		double.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
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
        //# sourceMappingURL=doubleGlobalFuncs.js.map
        