

cc.Class({

	//本阻塞功能是临时的,尽可能不要用,以后需要重构!!!
	ctor: function() {
		this._TAG = 'hall.ToDoTasks';
		hall.LOGD(this._TAG, " in ctor");

		this._taskStatk = null; //任务队列
		this._currentTask = null; //当前正在执行的task,如弹窗
		this.actionMap = {};
		this._taskStatk = [];
		this.actionMap['bind_snsid_360'] = this.runOldUserBindSns; //用户绑定账号
		this.actionMap['nslogin_reward'] = this.runEverydayLogin; // 弹出每日登陆窗体
		this.actionMap['flip_card'] = this.runFlipCardTask; //接受翻牌数据
		this.actionMap['pop_active_wnd'] = this.runPopActivityWnd; //弹出活动窗体
		this.actionMap['pop_lottery_wnd'] = this.runPopLotteryWnd; //弹出抽奖窗体
		this.actionMap['pop_pay_order'] = this.runPopPayOrder; //发出购买请求
		this.actionMap['rep_sence_activity'] = this.runReplaceSceneToActivity; //将场景切换到活动页面
		this.actionMap['set_exit_wnd'] = this.runSetExitWndInf; //设置退出提示窗体内容
		this.actionMap['pop_info_wnd'] = this.runPopInforWnd; //弹出提示框
		this.actionMap['pop_tip'] = this.runPopTips; //弹出tips提示
		this.actionMap['quick_start'] = this.runQuickStart; //执行qucik start目前仅仅普通房间里会监听该消息
		this.actionMap['pop_order_info'] = this.runPopBuy; //金币不足，弹出购买请求
		this.actionMap['bind_phone'] = this.runPopBindPhone; //弹出绑定提示
		this.actionMap['quick_start_tip'] = this.runQuickStartTip; //快速开始提示
		this.actionMap['issue_start_chip'] = this.runIssueStartChip; //启动资金提示
		this.actionMap['pop_member_try'] = this.runPopVipExperienceWnd; //弹出会员体验
		this.actionMap['pop_order'] = this.runSimplePopOrder; //
		this.actionMap['pop_first_recharge'] = this._runPopFirstCharge; //
		this.actionMap['pop_subscribe_wnd'] = this.runGotoAttention; //提示关注
		this.actionMap['login_wx_subscribe'] = this.showerweima; //提示关注
		this.actionMap['show_rewards'] = this.tipsForShowReward; //收到每日登录赠送钻石消息
	},

	// 默认的析构函数
	destroy: function() {},

	//本阻塞功能是临时的,尽可能不要用,以后需要重构!!!
	runTasks: function() {
		if (!this._currentTask) {
			this._taskStatk = hall.gameWorld.model.m_todoTask.taskVec;
			this.runNextTask();
		}
	},

	//从堆栈弹出一个任务,并执行
	//用于收到task数组保存到堆栈后执行第一个,或执完任一task后执行
	runNextTask: function() {
		if (this._currentTask) {
			this._currentTask = null;
		}
		if (this._taskStatk.length == 0) {
			return;
		}
		var nextTask = this._taskStatk.shift();
		this._currentTask = nextTask;
		this.runOneTask(nextTask);
	},

	//单个task的实际执行单元
	runOneTask: function(oneTask) {
		hall.LOGD(this._TAG, "runOneTask");
		if (null != oneTask && typeof(oneTask) != 'undefined' && typeof(oneTask['action']) != 'undefined' && typeof(oneTask['params']) != 'undefined') {
			hall.LOGD(this._TAG, " run runOneTask-------------------------action:" + oneTask['action'] + "===="+typeof(this.actionMap[oneTask['action']]));

			if (typeof(this.actionMap[oneTask['action']]) != 'undefined') {
				//以下这样写得目的是保持this为当前context否者this失效
				this.curActinFun = this.actionMap[oneTask['action']];
				this.curActinFun(oneTask['params']);
				this.curActinFun = null;
			} else {
				hall.LOGD(this._TAG, "This action is undefined! action:" + oneTask['action']);
				hall.ToDoTask.runNextTask();
			}
		} else {
			hall.LOGD(this._TAG, "This action is undefined or cmd is error!");
			hall.ToDoTask.runNextTask();
		}
	},

	runPopVipExperienceWnd: function() {
		// var scene = h5.EntranceLayer.createScene();
		// cc.director.runScene(scene);
		hall.ToDoTask.runNextTask();
	},

	runEverydayLogin: function(params) {
		var subclick = params["sub_action_click"];
		if(subclick && subclick["action"] == "pop_first_recharge") {	//首冲礼包的todotask可能包含在这里传过来，也可能独立传过来，这里处理被包含传过来的特殊情况。//TODO:对todotask的处理需要优化。。。
			var task = new hall._TodoTask();
            task.parseTask(subclick);
            hall.gameWorld.model.m_todoTask.taskVec.push(task);
		}
		var data = params['rewardstate'];
		if (data instanceof Array) {
			hall.ME.loginInfo.parse(params);
			ty.NotificationCenter.trigger(hall.EventType.UPDATE_EVERYDAYLOGIN);
			return;
		}
		hall.ToDoTask.runNextTask();
	},

	runFlipCardTask: function(params) {
		//执行翻牌活动
		hall.LOGD(this._TAG, " run runFlipCardTask-----------------------");
		// if (typeof(params['nlogin']) != 'undefined')
		// 	ddz.ME.loginInfo.m_nlogin = params['nlogin'];
		// if (typeof(params['remfliptimes']) != 'undefined')
		// 	ddz.ME.loginInfo.m_remfliptimes = params['remfliptimes'];
		// if (typeof(params['rewards']) != 'undefined')
		// 	ddz.ME.loginInfo.m_rewards = params['rewards'];
		// if (typeof(params['paddings']) != 'undefined')
		// 	ddz.ME.loginInfo.m_paddings = params['paddings'];


	},

	runQuickStartTip: function(params) {
		hall.LOGD(this._TAG, " run runQuickStartTip-----------------------");
		// hall.ME.setChip(params.totalchip);
		hall.ToDoTask.runNextTask();
	},

	runIssueStartChip: function(params) {
		if (hall.fuckstart) {
			return;
		}
		hall.fuckstart = true;

		//暂时没有启动资金的需求
		//params["startchip"]
		// var layer = new h5.NewPlayerRewardLayer(function() {
			hall.ToDoTask.runNextTask();
		// });
		// cc.director.getRunningScene().addChild(layer);
	},

	runPopActivityWnd: function(params) {
		hall.LOGD(this._TAG, " run runPopActivityWnd-----------------------");
		hall.ToDoTask.runNextTask();
	},

	runPopLotteryWnd: function(params) {
		hall.LOGD(this._TAG, " run runPopLotteryWnd-----------------------");
	},

	runPopPayOrder: function(result) {
		// var par = {
		// 		"id":"TY9999C0006007",
		// 		"name":"200000",
		// 		"price":"200",
		// 		"desc":"获得200000金币",
		// 		"type":1,
		// 		"addchip":200000,
		// 		"buy_type":"exchange",
		// 		"picurl":"http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t50k_2.png",
		// 		"tip":"200000金币",
		// };

		if (result['buy_type'] == "exchange"){
			// hall.MsgFactory.conversionCoin(result.id);
		}

	},

	runOldUserBindSns: function(params) {
		hall.LOGD(this._TAG, " run runReplaceSceneToActivity-----------------------");
		ty.NotificationCenter.trigger(ddz.EventType.UPDATE_BIND_USER_SNS, params);
	},

	runReplaceSceneToActivity: function(params) {
		hall.LOGD(this._TAG, " run runReplaceSceneToActivity-----------------------");
		hall.ToDoTask.runNextTask();
	},

	runSetExitWndInf: function(params) {
	},

	runPopInforWnd: function(params) {
		hall.LOGD("","file = [ToDoTasks] fun = [runPopInforWnd] params = " + JSON.stringify(params));
		this._currentTask = null;
		var desc = params["des"];
		var sub = params["sub_action"];
		var arr = [];
		if (desc) {
			arr = desc.split("-");
			if (arr[0] == "fuhaoBuyFailed") {
				ty.NotificationCenter.trigger(ddz.EventType.DIAMOND_INSUFFICIENT);
				ddz.GlobalFuncs.showDiamondInsufficient(arr[1]);
				return
			}
		}
		var testArray = [{title :"确定"}];
		var that = this;
		if (sub){
			var subaction = sub["action"];
			if (subaction == "quick_start"){	// 报名
				this.onClickRightButton = function(){
					ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
						["gotoRecommendRoom",sub["params"].roomName]);
					hall.MsgFactory.getQuickStartParams(sub["params"]);
				};
				this.onClickLeftButton = function(){
					var curScene = cc.director.getScene();
					if (curScene.name ==  "TableScene") {
						var tableScene = curScene.children[0].getComponent('DdzTableScene');
						var tableinfo = tableScene.tableInfo();
						var _mixID = tableinfo.mixId;
						ddz.MsgFactory.getRoomLeave(tableinfo.roomId(), tableinfo.tableId(), tableScene._mySeatIndex, _mixID);
					}
				};
				var str = "确定";
				if(sub["params"].roomName && sub["params"].roomName != "") {
					str = "去" + sub["params"].roomName;
					ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,
						["recommendRoom",sub["params"].roomName]);
				}
				testArray = [
					{title :"取消"}, {title :str}
				];
			}
		}
		var preFabPath = "prefabs/ddz_window_tips";
		var  comName = "ddz_tipsWindow";
		hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
			var window = preFabNode.getComponent(comName);
			window.parentScene = that;
			var tips = desc;
			window.setTitleContentAndButtons("提示",tips, testArray);
		});

	},

	runPopTips:function(params){
		this._currentTask = null;
		if (params && params.text && params.text != ""){
			hall.MsgBoxManager.showToast({title:params.text});
		}

	},

	runQuickStart: function(params) {
		hall.LOGD(this._TAG, "run runQuickStart-----------------------");
		var roomid = params["roomid"];
		hall.GlobalFuncs.gotoDdzTable();

		// 通知结算界面隐藏自己
		ty.NotificationCenter.trigger(hall.EventType.MSG_TODO_QUICK_START, params);
		hall.ToDoTask.runNextTask();
	},

	runPopBindPhone: function(params) {
		hall.LOGD(this._TAG, "run runPopBindPhone-----------------------");
	},

	runPopBuy: function(params) {
		
		this._currentTask = null;
		// var desc = params["desc"];
		var sub = params["sub_action"];
		if (sub) {
			var that = this;
			var subaction = sub["action"];
			if (subaction == "pop_pay_order") { //如果是充值
				this.onClickRightButton = function(){
					hall.MsgFactory.conversionCoin(sub["params"].id);
					ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
						["roomListGoldExchange",sub["params"].tip]);
				};

				var _callFunc = function(){
					var curScene = cc.director.getScene();
					if (curScene.name ==  "TableScene") {
						var tableScene = curScene.children[0].getComponent('DdzTableScene');
						var tableinfo = tableScene.tableInfo();
						var _mixID = tableinfo.mixId;
						ddz.MsgFactory.getRoomLeave(tableinfo.roomId(), tableinfo.tableId(), tableScene._mySeatIndex, _mixID);
					}
				};

				this.onClickLeftButton = function(){
					_callFunc();
				};
				this.tipsOnClose = function(){
					_callFunc();
				};
				var preFabPath = "prefabs/ddz_window_tips";
				var comName = "ddz_tipsWindow";
				hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
					var window = preFabNode.getComponent(comName);
					window.parentScene = that;
					// var tips = "你的金币不足进入房间,请充值后再尝试,谢谢!";
					var _tip = sub["params"].tip;
					var tips = "<color=#1A6951>兑换</c><img src='ddz_coin_green' height=40 width=40/><color=#1A6951> " + _tip + "</c>";
					var _titile = sub["params"].price + "兑换";
					var testArray = [
						{title :"取消"}, {title :_titile,left :"dda_button_diamond"}
					];
					window.setTitleContentAndButtons("金币不足",tips, testArray);
					ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,
						["roomListDiamondInsufficient",sub["params"].tip]);
				});
			}
		}

		hall.ToDoTask.runNextTask();
	},

	runGotoAttention: function(params) {
		hall.LOGD(this._TAG, "run runGotoAttention----------------------- params = " + JSON.stringify(params));
		var desc = params["desc"] || params["des"];
		var tip = params["tip"];
		var layer = new h5.GotoAttentionLayer(desc, tip);
		var curScene = cc.director.getRunningScene();
	    curScene.addChild(layer, 99);
		hall.ToDoTask.runNextTask();
	},
	runSimplePopOrder: function(params) {
		this._currentTask = null;
		var desc = params["desc"];
		var sub = params["sub_action"];
		if (sub) {
			var that = this;
			var subaction = sub["action"];
			if (subaction == "pop_pay_order") { //如果是充值
				this.onClickRightButton = function(){
					hall.MsgFactory.conversionCoin(sub["params"].id);
					ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
						["roomListGoldExchange",sub["params"].tip]);
				};
				var _callFunc = function(){
					var curScene = cc.director.getScene();
					if (curScene.name ==  "TableScene") {
						var tableScene = curScene.children[0].getComponent('DdzTableScene');
						var tableinfo = tableScene.tableInfo();
						var _mixID = tableinfo.mixId;
						ddz.MsgFactory.getRoomLeave(tableinfo.roomId(), tableinfo.tableId(), tableScene._mySeatIndex, _mixID);
					}
				};

				this.onClickLeftButton = function(){
					_callFunc();
				};
				this.tipsOnClose = function(){
					_callFunc();
				};
				var preFabPath = "prefabs/ddz_window_tips";
				var comName = "ddz_tipsWindow";
				hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
					var window = preFabNode.getComponent(comName);
					window.parentScene = that;
					// var tips = "你的金币不足进入房间,请充值后再尝试,谢谢!";
					var _tip = sub["params"].tip;
					var tips = "<color=#1A6951>兑换</c><img src='ddz_coin_green' height=40 width=40/><color=#1A6951> " + _tip + "</c>";
					var _titile = sub["params"].price + "兑换";
					var testArray = [
						{title :"取消"}, {title :_titile,left :"dda_button_diamond"}
					];
					window.setTitleContentAndButtons("金币不足",tips, testArray);
					ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,
						["roomListDiamondInsufficient",sub["params"].tip]);
				});
			}
		} else {
			ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,
				["roomListDiamondInsufficient"]);

			var preFabPath = "prefabs/ddz_window_tips";
			var  comName = "ddz_tipsWindow";
			hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
				var window = preFabNode.getComponent(comName);
				window.parentScene = that;
				var tips = "你的金币不足进入房间,请充值后再尝试,谢谢!";
				var testArray = [
					{title :"取消"}, {title :"确定"}
				];
				window.setTitleContentAndButtons("金币不足",tips, testArray);
			});
		}
	},

	_runPopFirstCharge:function(params) {	//暂时拿来做快速购买商品数据
		var sub = params["sub_action"];
		var action = null;
		while(sub) {
			if(sub["action"] == "pop_pay_order") {
				break;
			}
			var params = sub["params"];
			sub = params ? params["sub_action"] : null;
		}
		if(sub) {
			hall.gameWorld.firstChargeItem = sub["params"];
			// h5.globalFunc.popupChargeLayer();
		}
		hall.ToDoTask.runNextTask();
		/*
				"sub_action": {
							"action": "pop_pay_order",
							"params": {
								"name": "6.6\u4e07\u91d1\u5e01",
								"price": "6",
								"tip": "6.6\u4e07\u91d1\u5e01",
								"buy_type": "direct",
								"addchip": 66000,
								"picurl": "http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t50k.png",
								"price_diamond": "60",
								"type": 1,
								"id": "TY9999D0006001",
								"desc": "1\u5143=11000\u91d1\u5e01"
							}
						}
		*/
	},

	showerweima: function () {
		document.getElementById("coverContainer").style.display = "block";
		hall.ToDoTask.runNextTask();
	},
	tipsForShowReward : function (params) {
		hall.LOGD(this._TAG, "run tipsForShowReward----------------------- params = " + JSON.stringify(params));
		// {
		// 	"action":"show_rewards",
		// 	"params":{
		// 	"rewards":[
		// 		{
		// 			"itemId":"item:1311",
		// 			"count":1,
		// 			"pic":"http://ddz.dl.tuyoo.com/cdn37/hall/item/imgs/item_1311.png",
		// 			"name":"\u94bb\u77f3"
		// 		}
		// 	]
		// }
		//TODO:每日登录的奖励推送
		// var rewardList = params.rewards;
		// if(rewardList && rewardList.length > 0){
		// 	var tips =   hall.GlobalFuncs.ReadValueFromLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD, []);
		// 	var countS = rewardList[0].count +"";
		// 	tips.push(countS);
		// 	hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD,tips);
		// }
	},

	onClickLeftButton:function(){

	},

	onClickCenterButton:function(){

	},

});