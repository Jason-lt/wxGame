

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

	runPopPayOrder: function(params) {
		var desc = params["desc"];
		var cbbuy = function() {
			hall.BuyCenter.runPayOrder(params['id'], params['name'], 1, params['price_diamond'], params['buy_type']);
		};
		h5.CommonWindow.createSimple2(desc, null, cbbuy);
		//转购买模块处理
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
		hall.LOGD(this._TAG, "run runPopInforWnd-----------------------");

		var desc = params["des"];
		var sub = params["sub_action"];
		if (sub) {
			var that = this;
			var subaction = sub["action"];
			if (subaction == "pop_pay_order") { //如果是充值
				h5.CommonWindow.createChargeTip(desc, function() { //点确定退出组局
					if (h5.playScene) {
						h5.playScene.handlePopPayOrder();
					}
				}, function() { //点充值则继续弹出充值弹窗
					h5.globalFunc.popupChargeLayer();
				});
				hall.ToDoTask.runNextTask();
				return;
			} else if (subaction == "go_wx_subscribe") {
				this.runGotoAttention(params);
				return;
			}
		}
		if (params["style"] == "reward") {
			var layer = new h5.RewardTipLayer2(desc);
			var scene = cc.director.getRunningScene();
			scene.addChild(layer, 99);
		} else {
			h5.CommonWindow.createSimple(desc, function() {
				if(sub) {
					var task = new hall._TodoTask(sub);
					hall.ToDoTask.runOneTask(task);
				}else {
					hall.ToDoTask.runNextTask();
				}
			});
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
		h5.CommonWindow.createSimple("please bind phone!");
	},

	runPopBuy: function(params) {
		hall.LOGD(this._TAG, "run runPopBuy----------------------- params = " + JSON.stringify(params));
		h5.CommonWindow.createChargeTip(params["des"], null, function() {
			h5.globalFunc.popupChargeLayer();
		});
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
		var desc = params["desc"];
		var sub = params["sub_action"];
		if (sub) {
			var that = this;
			var subaction = sub["action"];
			if (subaction == "pop_pay_order") { //如果是充值
				var desc = JSON.parse(desc);
				var text = desc[0][0]["text"] + desc[0][1]["text"];
				h5.CommonWindow.createChargeTip(text, function() { //点确定退出组局
					if (h5.playScene) {
						h5.playScene.leaveTable();
					}
				}, function() { //点充值则继续弹出充值弹窗
					h5.globalFunc.popupChargeLayer();
				});
				hall.ToDoTask.runNextTask();
			}
		} else {
			h5.CommonWindow.createSimple("你的金币不足进入房间,请充值后再尝试,谢谢!", function() {
				hall.ToDoTask.runNextTask();
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
		var rewardList = params.rewards;
		if(rewardList && rewardList.length > 0){
			var tips =   hall.GlobalFuncs.ReadValueFromLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD, []);
			var countS = rewardList[0].count +"";
			tips.push(countS);
			hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD,tips);
		}
	}
});