/**
 * Created by tuyoo on 2018/2/4.
 */
ddz.tableInfoModel = {
    cache : null,
    parse : function (value) {
        this.cache = value.result;
        ddz.matchModel.isGameFlow = false;
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_TABLE_INFO, value.result);
    },
    clean : function () {
        this.cache = null;
    }
};