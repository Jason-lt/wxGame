
hall.UserHeartBeat = cc.Class({

	ctor:function(){
		this._TAG = "hall.UserHeartBeat";
		this.heartbeat = 6;
		hall.LOGD(this._TAG, "in ctor");
	},

	destroy:function(){
		if(this.heartbeat != 0){
			this.stopTimeCount();
		}
		hall.LOGD(this._TAG, "in destroy");
	},

	Update:function(time){
		if(time != 0 && time != this.heartbeat){
			if(this.heartbeat != 0){
				this.stopTimeCount();
			}
			this.heartbeat = time;
			this.startTimeCount();
		}
		hall.LOGD(this._TAG, "in Update");
	},

	startTimeCount:function(){
		hall.LOGD(this._TAG, "in startTimeCount");
	},

	stopTimeCount:function(){
		hall.LOGD(this._TAG, "in stopTimeCount");
	},

	HeartBeat:function(dt){
		hall.LOGD(this._TAG, "in HeartBeat");
	}
});