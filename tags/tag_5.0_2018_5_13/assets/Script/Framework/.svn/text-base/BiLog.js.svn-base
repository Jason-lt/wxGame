/**
 * Created by xujing on 2018/4/8.
 */
ty.BiLog = {
    /**
     * 上传实时log
     * @param logtxt:log内容
     */
    uploadLogTimely:function (logtxt) {
        if(!hall.netIsConnected){//断网了,不能上传
            hall.LOGD('ty.BiLog', 'net error!');
            return;
        }
        if(logtxt) {
            var header = ['Content-Type:text/plain'];
            var configObj = {
                'url': 'https://clienterr.touch4.me/api/bilog5/clientlog?cloudname=' + ty.SystemInfo.cloudid + '.' + ty.SystemInfo.clientIdInt,
                'header': header,
                'postData': logtxt,
                'callback': null
            };
            // 测试post
            ty.HttpUtil.httpPost(configObj,'POST');
        }
    },

    getSystemInfo : function(){
        this.cloud_id =ty.SystemInfo.cloudid;//this.getValue(json.cloud_id);   //独立服务id
        this.rec_type = '1';   //日志类型
        this.rec_id     = '0'; //日志记录id
        this.receive_time  ='0'; // 日志接收时间  输出日志时统一填0，BI服务会在接收时添加
        this.user_id = ty.UserInfo.userId;      //用户id
        this.game_id = ty.SystemInfo.gameId;      //游戏id
        this.client_id = ty.SystemInfo.clientId;
        this.device_id = hall.GlobalFuncs.getLocalUuid();	//device id
        this.ip_addr='#IP';// ip地址	占位--服务器处理
        this.nettype= "0"; //网络状况
        this.phone_maker= "0"; //手机制造商
        this.phone_model= ty.UserInfo.model; //手机型号
        this.phone_carrier= "0";//手机运营商
        this.reserved ='0';
    },
    /*BI组打点
     参数1是事件id，参数2是[],内含扩展参数
     60001事件id
     在查询工具，cloud id+game id+事件id即可找到,GDSS有前端日志查询工具
     ty.BiLog.clickStat(ddz.StatEventInfo.DdzButtonClickInPlugin,
     [ddz.PluginHall.Model.statInfoType[scope.index],ddz.GameId]);

     // ty.BiLog.clickStat(hall5.BILogEvents.BILOG_EVENT_PLUGIN_UPDATE_SUCCESS,[hall5.BilogStatEvent.Plugin_Update_Success,gameid]);
     */

    uploadClickStatLogTimely:function (logtxt) {
        // hall.LOGE("","============clickStat===================="+logtxt);
        var callbackObj = this;
        if(logtxt!=undefined && logtxt!='') {
            var header = ['Content-Type:text/plain'];
            var configObj = {
                'url': ty.SystemInfo.m_server_ip,
                'headers': header,
                'postData': logtxt,
                'obj': callbackObj,
                'tag': null,
                'callback': null
            };
        }
        ty.HttpUtil.httpPost(configObj,'POST');
    },

    clickStat: function (eventId, ParamsList) {
        if(debugMode){
            return;
        }
        // hall.LOGE("","============clickStat===================="+eventId+"===="+ParamsList[0]);
        if(ParamsList ==null) {ParamsList =[];}
        var dyeparams = [];
        if (ParamsList.length < 10) {
            for (var i = 0; i < 9; i++) {
                if (i < ParamsList.length) {
                    dyeparams.push(ParamsList[i]);}
                else {
                    dyeparams.push(0);}}
        }
        else {dyeparams = ParamsList;}
        hall.LOGD('实时日志', "eventid= " + eventId + " 描述 = " + JSON.stringify(dyeparams));
        var bilog = this.assemblelog(eventId, dyeparams);
        this.uploadClickStatLogTimely(bilog+ '\n');
    },
    assemblelog:function (eventid, paramsarr) {
        //获得1970到现在的秒数
        var time = new Date().getTime();
        //隔一分钟取网络状况
        if(time-this._timetag>60000)
        {
            this._timetag = time;
            this.nettype=0;
        }
        var paramstr = paramsarr.join('\t');

        this.getSystemInfo();
        var logStr =this.cloud_id+'\t'+this.rec_type+'\t'+time+'\t'+this.rec_id+'\t'+this.receive_time+
            '\t'+eventid+'\t'+this.user_id+'\t'+this.game_id+'\t'+this.client_id+'\t'+this.device_id+'\t'+
            this.ip_addr +'\t'+this.nettype+'\t'+this.phone_maker +'\t'+this.phone_model +'\t'+this.phone_carrier+'\t'+paramstr+'\t'+ this.reserved ;

        var str = this.trimTab0(logStr);
        return str;
    },
    trimTab0:function (str) {
        if(str==null || str==undefined)
            return '';
        var txt = str.replace(/(\t0)*$/,'');
        return txt;
    },
};