(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/MsgInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '59fb8QnyzVA2ZD1LTwYfPpm', 'MsgInfo', __filename);
// Script/hall/models/MsgInfo.js

"use strict";

/**
 * Created by wangjunpeng on 16/1/20.
 */

hall.MsgInfo = cc.Class({
	ctor: function ctor() {
		this.m_sysInfo = [];
		this.m_receiveInfo = [];
		this.m_sendInfo = [];
		this.m_jewelData = null;
		this.m_msgTipData = [];
		this.m_coinListData = null;
	},
	parseSysInfo: function parseSysInfo(data) {
		if (data) {
			this.m_sysInfo = data;
		}
	},
	parseReceiveInfo: function parseReceiveInfo(data) {
		if (data) {
			this.m_receiveInfo = data;
		}
	},
	parseSendInfo: function parseSendInfo(data) {
		if (data) {
			this.m_sendInfo = data;
		}
	},
	parseJewelData: function parseJewelData(data) {
		if (data) {
			this.m_jewelData = data;
		}
	},
	parseCoinData: function parseCoinData(data) {
		if (data) {
			this.m_coinListData = data;
		}
	},
	praseModultTip: function praseModultTip(data) {
		return;
		if (data) {
			this.m_msgTipData = data[0];
			var msg = data[0]["needReport"];
			// if (msg) {
			// 	hall.GlobalFuncs.setInLocalStorage(h5.HAS_MAIL_KEY, true);
			// } else {
			// 	hall.GlobalFuncs.setInLocalStorage(h5.HAS_MAIL_KEY, false);
			// }
		}
	}

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=MsgInfo.js.map
        