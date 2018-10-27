(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_tableView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '711d7gjKaFL/7TRr10IWw/+', 'ddz_tableView', __filename);
// Script/ComponentScript/component/ddz_tableView.js

"use strict";

cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this.cellPool = null;
    },

    properties: {

        cellComponent: "ddz_rewardCell",
        contentWidth: 600,
        contentHeight: 800,
        cellHeight: 105,

        startIndex: 0,
        allLong: 0,
        scrollOffSet: 0,

        scrollView: {
            default: null,
            type: cc.ScrollView
        },

        cell: {
            default: null,
            type: cc.Prefab
        },
        dataArray: []

    },

    onLoad: function onLoad() {
        this.cellPool = new cc.NodePool();

        this.scrollView.content.width = this.contentWidth;
        this.scrollView.content.height = this.contentHeight;
        this.scrollView.node.on("scrolling", this.scrollViewisScrolling, this);
        this.scrollView.node.on("scroll-to-bottom", this.scrollViewisScrollToBottom, this);
        // var testA = [];
        // for (var  i = 0;i < 5 ; i ++){
        //     var obj = {"data" :["---","----","---",i+""]};
        //     testA.push(obj);
        // }
        // this.setDataArray(testA);
        // this.addDataArray([]);
    },

    addDataArray: function addDataArray(dataArray) {

        this.dataArray = this.dataArray.concat(dataArray);
        // this.scrollOffSet = this.scrollView.getScrollOffset();
        this.contentHeight = this.dataArray.length * this.cellHeight;
        this.scrollView.content.height = this.contentHeight;
        // this.scrollView.content.y = this.contentHeight/2;
        // this.scrollViewisScrolling();
        // this.scrollView.scrollToOffset(this.scrollOffSet,0);
        // this.scrollViewisScrolling();
    },
    setDataArray: function setDataArray(dataArray) {
        // ddz.LOGD(null, "file = [ddz_tableView] fun = [setDataArray] dataArray = "+JSON.stringify(dataArray));
        if (!dataArray || dataArray.length < 1) {
            return;
        }
        this.dataArray = dataArray;
        this.contentHeight = this.dataArray.length * this.cellHeight;
        this.scrollView.content.height = this.contentHeight;

        this.startIndex = 0;
        this.allLong = parseInt(this.scrollView.node.height / this.cellHeight + 2);

        if (!this.cellPool) {
            this.cellPool = new cc.NodePool();
        }
        for (var i = 0; i <= this.allLong; i++) {
            this.cellPool.put(cc.instantiate(this.cell)); // 通过 putInPool 接口放入对象池
        }
        for (var i = this.startIndex; i <= this.allLong; i++) {
            this.makeCellWithIndex(i);
        }
        this.scrollView.scrollToOffset(0, 0);
        // ddz.LOGD(null, "------this.scrollView.scrollToOffset-------"+this.scrollView.getScrollOffset().y);
        // this.scrollView.node.on("scrolling",this.scrollViewisScrolling,this);
    },

    makeCellWithIndex: function makeCellWithIndex(index) {
        if (index > this.dataArray.length - 1) {
            ddz.LOGD(null, "没有这个cell了");
            return;
        }
        var obj = this.dataArray[index];
        // ddz.LOGD(null, "==========++++======="+JSON.stringify(obj));
        var ddz_cell;
        if (this.cellPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            ddz_cell = this.cellPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            ddz_cell = cc.instantiate(this.cell);
            // this.cellPool.put(ddz_cell);
        }
        // ddz_cell.y = this.contentHeight/2 - (index+0.5) * this.cellHeight;
        ddz_cell.y = -(index + 0.5) * this.cellHeight;
        this.scrollView.content.addChild(ddz_cell, 1, index + 500);
        var ddz_rewardCellS = ddz_cell.getComponent(this.cellComponent);
        if (obj) {
            ddz_rewardCellS.index = index;
            ddz_rewardCellS.addDataWithObject(obj);
        }
    },

    deleteCellWithCell: function deleteCellWithCell(cell) {
        if (cell) {
            this.cellPool.put(cell);
            cell.removeFromParent();
        }
    },
    scrollViewisScrolling: function scrollViewisScrolling(scrolView) {
        var nowY = this.scrollView.getScrollOffset().y;
        if (nowY + 1000 > this.contentHeight) {
            // ddz.LOGD(null, "============================================="+nowY);
            ty.NotificationCenter.trigger(ddz.EventType.SCROLLTOBOTTOM);
        }
        var starIn = parseInt(nowY / this.cellHeight - 1);

        if (starIn < 0) {
            return;
        }
        //上滑
        if (starIn < this.startIndex) {
            if (starIn < this.startIndex - this.allLong) {
                for (var i = this.startIndex; i <= this.startIndex + this.allLong; i++) {
                    var cell = this.scrollView.content.getChildByTag(i + 500);
                    this.deleteCellWithCell(cell);
                }
                for (var j = starIn; j <= starIn + this.allLong; j++) {
                    this.makeCellWithIndex(j);
                }
                this.startIndex = starIn;
                return;
            }
            for (var i = starIn + this.allLong + 1; i <= this.startIndex + this.allLong; i++) {
                var cell = this.scrollView.content.getChildByTag(i + 500);
                this.deleteCellWithCell(cell);
            }
            for (var j = starIn; j < this.startIndex; j++) {
                this.makeCellWithIndex(j);
            }
            this.startIndex = starIn;
            return;
        }
        //下滑
        if (starIn > this.startIndex) {
            if (starIn > this.startIndex + this.allLong) {
                for (var i = this.startIndex; i <= this.startIndex + this.allLong; i++) {
                    var cell = this.scrollView.content.getChildByTag(i + 500);
                    this.deleteCellWithCell(cell);
                }
                for (var j = starIn; j <= starIn + this.allLong; j++) {
                    this.makeCellWithIndex(j);
                }
                this.startIndex = starIn;
                return;
            }
            for (var i = this.startIndex; i < starIn; i++) {
                var cell = this.scrollView.content.getChildByTag(i + 500);
                this.deleteCellWithCell(cell);
            }
            for (var end = parseInt(this.startIndex + this.allLong + 1); end <= parseInt(starIn + this.allLong); end++) {
                this.makeCellWithIndex(end);
            }
            this.startIndex = starIn;
        }
    },
    scrollViewisScrollToBottom: function scrollViewisScrollToBottom() {
        ddz.LOGD(null, "------scrollViewisScrollToBottom-------");
        // this.scrollOffSet = this.scrollView.getScrollOffset().y;
        // ty.NotificationCenter.trigger(ddz.EventType.SCROLLTOBOTTOM);
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
        //# sourceMappingURL=ddz_tableView.js.map
        