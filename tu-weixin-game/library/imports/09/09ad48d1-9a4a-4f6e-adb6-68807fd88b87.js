"use strict";
cc._RF.push(module, '09ad4jRmkpPbq22aIB/2IuH', 'TableInfoModel');
// Script/ddz/models/TableInfoModel.js

"use strict";

/**
 * Created by tuyoo on 2018/2/4.
 */
ddz.tableInfoModel = {
    cache: null,
    parse: function parse(value) {
        this.cache = value.result;
        ddz.matchModel.isGameFlow = false;
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_TABLE_INFO, value.result);
    },
    clean: function clean() {
        this.cache = null;
    }
};

cc._RF.pop();