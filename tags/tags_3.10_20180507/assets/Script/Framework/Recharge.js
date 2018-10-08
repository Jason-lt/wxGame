/**
 * Created by tuyoo on 2018/5/7.
 */

ty.Recharge = {
    createOrder:function(id,prodPrice,name){
        /*
         params prodId:商品ID, prodName:商品名称, prodCount:购买数量
         prodPrice:价格  单位元,
         chargeType:支付方式 wxapp.iap,
         gameId:子游戏id,
         appInfo:透传参数,
         mustcharge:是否支付 默认填 1
         */
        var data = {};
        data.prodId = id;
        data.prodPrice = prodPrice;
        data.chargeType = "wxapp.iap";
        data.gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;
        data.prodName = name;
        // data.gameId = ty.SystemInfo.hallId;
        data.appInfo = {};
        ty.TuyooSDK.rechargeOrder(data);
    },
    orderCallFunc:function(url,platformOrderId){
        var local_uuid = hall.GlobalFuncs.getLocalUuid();
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId:ty.UserInfo.userId,
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                imei: 'null',
                uuid : local_uuid,
                platformOrderId: platformOrderId,
            },

            method:'POST',

            success: function(results) {
                hall.LOGE(null, 'file = [Recharge] fun = [OrderCallFun] 充值成功');
                
            },
            fail: function(params) {
                
            },
            complete: function(params) {

            }
        });
    },
};