/**
 * Created by tuyoo on 2018/2/4.
 */
ddz.quickStartModel = {
    cache : null,
    parse : function (value) {
        this.cache = value.result;
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_QUICK_START, value.result);
    },
    clean : function () {
        this.cache = null;
    }
};