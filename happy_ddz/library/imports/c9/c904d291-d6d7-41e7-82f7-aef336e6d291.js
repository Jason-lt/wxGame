"use strict";
cc._RF.push(module, 'c904dKR1tdB54L3rvM25tKR', 'ConfigRoomSession');
// Script/ddz/models/ConfigRoomSession.js

"use strict";

/**
 * Created by xujing on 2018/2/1.
 */

ddz.ConfigRoomSession = cc.Class({

    ctor: function ctor() {
        var info = arguments[0];
        this.session = "";
        this.description = "";
        this.match = 0;
        this.fruit = 0;
        this.m_rooms = []; //用于存放ddz.ConfigRoom类对象
        this.m_type = ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN; //根据session来设定type，用于通过roomid判断是什么场
        this.m_existNewMatch = 0; //判断是否有新增比赛
        if (info) {
            this.parse(info);
        }
    },
    parse: function parse(json) {
        this.session = json["session"];
        this.match = json["match"];
        this.fruit = json["fruit"];

        var myrooms = [];
        var rooms = json["rooms"];
        for (var i = 0, len = rooms.length; i < len; i++) {
            myrooms.push(new ddz.NormalRoomInfo(rooms[i]));
        }
        this.m_rooms = myrooms;

        switch (this.session) {
            case "经典场":
                this.m_type = ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN;
                break;
            case "欢乐场":
                this.m_type = ddz.Enums.PlayType.PLAY_TYPE_HUANLE;
                break;
            case "比赛场":
                this.m_type = ddz.Enums.PlayType.PLAY_TYPE_MATCH;
                this.m_existNewMatch = json["new"];
                break;
            case "癞子场":
                this.m_type = ddz.Enums.PlayType.PLAY_TYPE_LAIZI;
                break;
            case "二斗场":
                this.m_type = ddz.Enums.PlayType.PLAY_TYPE_ERREN;
                break;
            case "水果大亨":
                break;
            default:
                break;
        }
    }
});

cc._RF.pop();