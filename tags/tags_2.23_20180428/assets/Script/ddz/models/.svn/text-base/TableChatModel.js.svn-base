/**
 * Created by xujing on 2018/4/13.
 */

ddz.tableChatModel = {

    tableMsgMap:{
        1:[],
        2:[],
        3:[]
    },

    mySeatId:0,

    msgPlayers : {

    },

    parseTableChat:function (argument) {
        var seatId = parseInt(argument.result.seatId);
        if (seatId == this.mySeatId) {
            //自己的消息不处理
            return;
        }
        var msgs = this.tableMsgMap[seatId];
        var msg = argument.result.msg;
        msg = msg.replace(/\r|\n/g,'');
        // ddz.LOGD(null, "格式化后的b64:" + msg);
        msgs.push(msg); //把消息放入队列
        this.playMsg(seatId);
    },

    /**
     * 通过坐位ID,获取消息
     * @param seatId 坐位ID
     * @returns {*}
     */
    getMsgBySeatId:function (seatId) {
        var msgs = this.tableMsgMap[seatId];
        var msg = null;
        if (msgs.length > 0){
            msg = msgs.shift();
        }

        return msg;
    },

    getMsgCountBySeatId:function (seatId) {
        var msgs = this.tableMsgMap[seatId];
        return msgs.length;
    },

    getMsgPlayer:function (seatId) {
        var player = this.msgPlayers[seatId];
        if (!player){
            player = wx.createInnerAudioContext();
            player.autoplay = false;
            player.loop = false;
            player.volume = 1;

            this.msgPlayers[seatId] = player;

            var fs = wx.getFileSystemManager();
            player.onEnded(function (res) {
                ty.NotificationCenter.trigger(ddz.EventType.END_PLAY_TABLE_CHAT, seatId);
                fs.unlinkSync(player.src);
                if (ddz.tableChatModel.getMsgCountBySeatId(seatId) > 0){
                    ddz.tableChatModel.playMsg(seatId);
                }
            });
        }

        return player;
    },

    playMsg:function (seatId) {
        var msg = ddz.tableChatModel.getMsgBySeatId(seatId);
        if (msg){

            ty.NotificationCenter.trigger(ddz.EventType.START_PLAY_TABLE_CHAT, seatId);
            var player = ddz.tableChatModel.getMsgPlayer(seatId);


            var filePath = wx.env.USER_DATA_PATH + '/seat_' + seatId + '_msg.' + ddz.recordFileType;
            var fs = wx.getFileSystemManager();

            var revertFile = function () {
                //把字符串转为本地音频文件
                fs.writeFileSync(filePath ,msg , 'base64');

                ddz.LOGD(null, "本地音频文件:" + filePath);
                player.src = filePath;
                player.play();
            };

            fs.access({
                path : filePath,
                success :function () {
                    fs.unlinkSync(filePath);
                    revertFile();
                },
                fail:function () {
                    revertFile();
                }
            });
        }
    },

    clear:function () {
        var msgs;
        for (var i in this.tableMsgMap){
            msgs = this.tableMsgMap[i];
            msgs.length = 0;
        }
    }

};