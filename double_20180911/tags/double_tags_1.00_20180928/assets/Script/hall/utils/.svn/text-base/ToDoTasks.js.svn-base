

cc.Class({

	//本阻塞功能是临时的,尽可能不要用,以后需要重构!!!
	ctor: function() {
		this._TAG = 'hall.ToDoTasks';
		hall.LOGD(this._TAG, " in ctor");

		this._taskStatk = null; //任务队列
		this._currentTask = null; //当前正在执行的task,如弹窗
		this.actionMap = {};
		this._taskStatk = [];
		// this.actionMap['show_rewards'] = this.tipsForShowReward; //收到每日登录赠送钻石消息
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


	runReplaceSceneToActivity: function(params) {
		hall.LOGD(this._TAG, " run runReplaceSceneToActivity-----------------------");
		hall.ToDoTask.runNextTask();
	},

	runSetExitWndInf: function(params) {
	},

	showerweima: function () {
		// document.getElementById("coverContainer").style.display = "block";
		// hall.ToDoTask.runNextTask();
	}


});