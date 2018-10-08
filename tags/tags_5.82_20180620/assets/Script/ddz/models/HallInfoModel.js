/**
 * Created by xujing on 2018/1/31.
 */
ddz.HallInfoModel = {
    _TAG : 'ddz.HallInfoModel',
    cache : {},
    matchs : {},
    rooms : {},
    sessions : {},
    parseHallInfo : function (value) {
        ddz.LOGD(this._TAG, "parseHallInfo");
        this.sessions = value.sessions;
        // ty.NotificationCenter.trigger(ddz.EventType.RECIVE_HALL_INFO);
    },

    /**
     * 获取斗地主的玩法
     * @param type  ddz.Enums.PlayType
     * @returns {*}
     */
    getSessionByType : function (type) {

        // {
        //     "new":0,
        //     "session":"经典场",
        //     "description":Array[2],
        //     "match":0,
        //     "rooms":[
        //         {
        //             "showInfo":{
        //                 "gameDes":"连胜送话费 (赢牌送金币)",
        //                 "playerCntKind":"playerCnt",
        //                 "name":"新手训练场(10底)",
        //                 "extendInfo":""
        //             },
        //             "name":"经典场",
        //             "minQuickStartChip":0,
        //             "least":10,
        //             "tbbox":{
        //                 "rewards":Array[1],
        //                 "pt":8
        //             },
        //             "entry":"底注10金币",
        //             "nameurl":"http://ddz.dl.tuyoo.com/cdn37/dizhu/room/imgs/room_name_jdxsc.png",
        //             "config":0,
        //             "id":6011,
        //             "condition":"0金币准入"
        //         }
        //     ]
        // }

        return this.sessions[type - 1];
    }
};