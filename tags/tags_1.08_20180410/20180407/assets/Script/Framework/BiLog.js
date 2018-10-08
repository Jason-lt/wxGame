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
            ty.HttpUtil.httpPost(configObj);
        }
    }
};