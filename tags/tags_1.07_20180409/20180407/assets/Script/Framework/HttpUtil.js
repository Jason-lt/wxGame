/**
 * Created by xujing on 2018/4/8.
 */
ty.HttpUtil = {
    httpPost:function (cfgObj) {
        wx.request({
            url : cfgObj.url,
            data : cfgObj.postData,
            header : cfgObj.header,
            method : 'POST',
            dataType : 'json',
            success : function (res) {
                if (res.statusCode == 200){
                    //正常连接{"/api/bilog5/clientlog": "ok"}
                    if (res.data && res.data.hasOwnProperty('/api/bilog5/clientlog') && res.data['/api/bilog5/clientlog'] == "ok"){
                        hall.LOGD('ty.HttpUtil.httpPost', 'post success! ');
                    }
                }
                else{
                    hall.LOGD('ty.HttpUtil.httpPost', 'statusCode:' + res.statusCode);
                }
            },
            fail : function (res) {
                hall.LOGD('ty.HttpUtil.httpPost', 'post error! ' + cfgObj.url);
            },
            complete : function (res) {
                
            }
        })
    }
};