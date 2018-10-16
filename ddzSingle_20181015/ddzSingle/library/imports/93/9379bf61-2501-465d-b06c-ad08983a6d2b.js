"use strict";
cc._RF.push(module, '9379b9hJQFGXbBsrQiYOm0r', 'UserHeartBeat');
// Script/hall/models/UserHeartBeat.js

"use strict";

hall.UserHeartBeat = cc.Class({

	ctor: function ctor() {
		this._TAG = "hall.UserHeartBeat";
		this.heartbeat = 6;
		hall.LOGD(this._TAG, "in ctor");
	},

	destroy: function destroy() {
		if (this.heartbeat != 0) {
			this.stopTimeCount();
		}
		hall.LOGD(this._TAG, "in destroy");
	},

	Update: function Update(time) {
		if (time != 0 && time != this.heartbeat) {
			if (this.heartbeat != 0) {
				this.stopTimeCount();
			}
			this.heartbeat = time;
			this.startTimeCount();
		}
		hall.LOGD(this._TAG, "in Update");
	},

	startTimeCount: function startTimeCount() {
		hall.LOGD(this._TAG, "in startTimeCount");
	},

	stopTimeCount: function stopTimeCount() {
		hall.LOGD(this._TAG, "in stopTimeCount");
	},

	HeartBeat: function HeartBeat(dt) {
		hall.LOGD(this._TAG, "in HeartBeat");
	}
});

cc._RF.pop();