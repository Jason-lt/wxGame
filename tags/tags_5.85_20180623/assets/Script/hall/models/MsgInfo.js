/**
 * Created by wangjunpeng on 16/1/20.
 */


hall.MsgInfo = cc.Class({
	ctor: function() {
		this.m_sysInfo = [];
		this.m_receiveInfo = [];
		this.m_sendInfo = [];
		this.m_jewelData = null;
		this.m_msgTipData = [];
		this.m_coinListData = null;
	},
	parseSysInfo: function(data) {
		if (data) {
			this.m_sysInfo = data;
		}
	},
	parseReceiveInfo: function(data) {
		if (data) {
			this.m_receiveInfo = data;
		}
	},
	parseSendInfo: function(data) {
		if (data) {
			this.m_sendInfo = data;
		}
	},
	parseJewelData: function(data) {
		if (data) {
			this.m_jewelData = data;
		}
	},
	parseCoinData: function(data) {
		if (data) {
			this.m_coinListData = data;
		}
	},
	praseModultTip: function(data) {
        return;
		if (data) {
			this.m_msgTipData = data[0];
			var msg = data[0]["needReport"];
			if (msg) {
				hall.GlobalFuncs.setInLocalStorage(h5.HAS_MAIL_KEY, true);
			} else {
				hall.GlobalFuncs.setInLocalStorage(h5.HAS_MAIL_KEY, false);
			}
		}
	}

});