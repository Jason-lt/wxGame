/**
 * Created by tuyoo on 2018/2/4.
 */
ddz.quickStartModel = {
    cache : null,
    _mixId: null,
    _roomId:null,
    parse : function (value) {
        this.cache = value.result;
        if (this.cache.hasOwnProperty('mixId')){
            this._mixId = this.cache['mixId'];
        }
        if (this.cache.hasOwnProperty('roomId')){
            this._roomId = this.cache['roomId'];
        }
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_QUICK_START, value.result);
    },

    getMixId:function () {
        return this._mixId;
    },
    getRoomId:function () {
        return this._roomId;
    },
    clean : function () {
        this.cache = null;
    }
};