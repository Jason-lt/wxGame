
cc.Class({

    ctor: function() {
        this.gameId = 0;
        this.userId = 0;
        //0~1 0是弹出提醒明天上线领取金币窗体 1是弹出新人奖励窗体，该版本只有这两种类型，如果新版本增加类型，旧版不识别，默认为类型0
        this.exitPopWndType = 0;
        this.taskVec = []; //当前正在处理的任务
    },

    destroy: function() {},

    parseTodoTask: function(result) {
        if (typeof(result) != 'undefined') {
            this.gameId = result["gameId"];
            this.userId = result["userId"];
            var vec = this.taskVec;
            var tasks = result["tasks"];
            for (var i = 0, len = tasks.length; i < len; i++) {
                var task = new hall.TodoTask();
                task.parseTask(tasks[i]);
                vec.push(task);
            }
            hall.ToDoTask.runTasks();
        }
    }
});