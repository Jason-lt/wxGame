
cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Button,
        btnCancel:cc.Button,
        btnOk:cc.Button,
        txtTitle:cc.Label,
        txtDesc:cc.RichText
    },

    initWithPar:function (par) {
        // var par = {
        // 	"allow_close":true,
        // 	"des":"您的费用不足，本比赛报名费需1钻石",
        // 	"note":"",
        // 	"price":"1",
        // 	"detail":"获得10钻石",
        // 	"count":0,
        // 	"itemId":"",
        // 	"sub_action":{
        // 		"action":"pop_pay_order",
        // 		"params":{
        // 			"id":"TY9999D0001010",
        // 			"name":"10个钻石",
        // 			"price":"1",
        // 			"desc":"获得10钻石",
        // 			"type":1,
        // 			"addchip":0,
        // 			"buy_type":"direct",
        // 			"picurl":"http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_diamond_thousand.png",
        // 			"tip":"获得10钻石",
        // 			"price_diamond":"10"
        // 		}
        // 	}
        // };

        this._par = par;

        this.txtDesc.string = par.des;
    },

    onLoad:function () {

    },
    
    onClose:function () {
        this.node.destroy();
    },
    
    onOk:function () {
        this.node.destroy();
        hall.ToDoTask.runOneTask(this._par.sub_action);
    },
    
    onCancel:function () {
        this.node.destroy();
    }

    // start () {
    //
    // },

    // update (dt) {},
});
