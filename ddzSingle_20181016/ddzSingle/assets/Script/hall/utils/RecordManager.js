/**
 * 录音管理器
 * Created by xujing on 2018/4/26.
 */
hall.AudioRecordManager = cc.Class({
    ctor:function () {
        this._recorder = null;
        this._defaultTime = 15;
        this._cancel = false;
    },

    initManager:function () {
        if (wx.hasOwnProperty('getRecorderManager')){
            this._recorder = wx.getRecorderManager();
            this._recorder.onStart(function () {
                ty.NotificationCenter.trigger(ddz.EventType.START_RECORD);
            });

            var that = this;
            this._recorder.onStop(function (res) {
                hall.LOGD(null, "record file : " + res.tempFilePath);

                // var fs = wx.getFileSystemManager();
                // var fileStr = fs.readFileSync(res.tempFilePath, 'base64');
                // hall.LOGD(null, "fs:" + fileStr);
                //
                //
                // var filePath = wx.env.USER_DATA_PATH + '/au.aac';
                // fs.writeFileSync(filePath ,fileStr , 'base64');
                //
                // var musicPlayManager = wx.createInnerAudioContext();
                // musicPlayManager.autoplay = true;
                // musicPlayManager.loop = false;
                // musicPlayManager.volume = 1;
                // musicPlayManager.src = filePath;

                if (!that._cancel){
                    ty.NotificationCenter.trigger(ddz.EventType.STOP_RECORD, res.tempFilePath);
                }
                else{
                    var fs = wx.getFileSystemManager();
                    fs.unlinkSync(res.tempFilePath);
                }
            });

            this._recorder.onError(function (res) {
                //
                ty.NotificationCenter.trigger(ddz.EventType.ERROR_RECORD);
                hall.LOGE(null, res.errMsg);
            });
        }
        else{
            hall.LOGE(null, "version is too old to suport record! please update your wechat!");
        }
    },

    startRecord:function (time) {

        time = time || this._defaultTime;

        if (!this._recorder){
            return;
        }
        hall.LOGD(null, "startRecord:" + time);
        this._cancel = false;
        this._recorder.start({
            duration : time * 1000,
            sampleRate : 48000,
            numberOfChannels : 2,
            encodeBitRate : 64000,
            format : ddz.recordFileType,
        });
    },

    pauseRecord : function () {
        this._recorder.pause();
    },
    resumeRecord : function () {
        this._recorder.resume();
    },

    stop:function (cancel) {
        this._cancel = cancel;
        this._recorder.stop();
    }
});