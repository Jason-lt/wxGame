

cc.Class({
    extends: cc.Component,
    ctor : function () {
        this.cellPool = null;
    },

    properties: {

        cellComponent : " ",
        contentWidth:600,
        contentHeight : 800,
        cellHeight : 105,

        startIndex : 0,
        allLong : 0,
        scrollOffSet : 0,

        scrollView : {
            default : null,
            type : cc.ScrollView
        },

        cell : {
            default : null,
            type : cc.Prefab
        },
        dataArray : [],

        windowWidth : 0

    },

    onLoad : function() {
        this.cellPool = new cc.NodePool();

        this.scrollView.content.width = this.contentWidth;
        this.scrollView.content.height = this.contentHeight;
        this.scrollView.node.on("scrolling",this.scrollViewisScrolling,this);
        this.scrollView.node.on("scroll-to-bottom",this.scrollViewisScrollToBottom,this);

        this.windowWidth = cc.director.getWinSize().width;
    },

    addDataArray : function (dataArray) {
        this.dataArray = this.dataArray.concat(dataArray);
        this.contentHeight = this.dataArray.length * this.cellHeight;
        this.scrollView.content.height = this.contentHeight;
    },
    setDataArray: function (dataArray) {
        if (!dataArray || dataArray.length < 1){
            return;
        }
        this.dataArray = dataArray;
        this.contentHeight = (((this.dataArray.length-1)/2 >> 0)+1) * this.cellHeight;
        this.scrollView.content.height = this.contentHeight;

        this.startIndex = 0;
        this.allLong = parseInt(this.scrollView.node.height/this.cellHeight*2 + 2);

        if (!this.cellPool){
            this.cellPool = new cc.NodePool();
        }
        for (var i = 0; i <=  this.allLong; i++) {
            this.cellPool.put(cc.instantiate(this.cell)); // 通过 putInPool 接口放入对象池
        }
        for (var  i = this.startIndex;i <= this.allLong; i ++){
            this.makeCellWithIndex(i);
        }
        this.scrollView.scrollToOffset(0,0);
        // ddz.LOGD(null, "------this.scrollView.scrollToOffset-------"+this.scrollView.getScrollOffset().y);
        // this.scrollView.node.on("scrolling",this.scrollViewisScrolling,this);
    },

    makeCellWithIndex : function (index) {
        if(index > this.dataArray.length-1){
            hall.LOGD(null, "没有这个cell了");
            return;
        }
        var cell = this.scrollView.content.getChildByName(index+500);
        this.deleteCellWithCell(cell);
        var obj = this.dataArray[index];
        var ddz_cell;
        if (this.cellPool.size() > 0) {
            ddz_cell = this.cellPool.get();
        } else {
            ddz_cell = cc.instantiate(this.cell);
        }
        ddz_cell.y = - ((index/2 >> 0)+0.5) * this.cellHeight;
        ddz_cell.x = index%2 == 0 ? -this.windowWidth/4 : this.windowWidth/4;
        this.scrollView.content.addChild(ddz_cell,1,index+500);
        var ddz_rewardCellS = ddz_cell.getComponent(this.cellComponent);
        if (obj) {
            ddz_rewardCellS.index = index;
            ddz_rewardCellS.addDataWithObject(obj);
        }
    },

    deleteCellWithCell : function (cell) {
        if(cell){
            this.cellPool.put(cell);
            cell.removeFromParent();
        }
    },
    scrollViewisScrolling : function (scrolView) {
        var nowY = this.scrollView.getScrollOffset().y;
        // if (nowY+1000 > this.contentHeight){
        //     // ddz.LOGD(null, "============================================="+nowY);
        //     ty.NotificationCenter.trigger(ddz.EventType.SCROLLTOBOTTOM);
        // }
        var starIn = parseInt(nowY/this.cellHeight  -1)/2 >> 0;

        if (starIn <0){
            return;
        }
        //上滑
        var i;
        var j;
        var cell;
        if (starIn < this.startIndex){
            if (starIn < this.startIndex - this.allLong ){
                for (i = this.startIndex ;i <= this.startIndex + this.allLong ;i ++){
                    cell = this.scrollView.content.getChildByTag(i+500);
                    this.deleteCellWithCell(cell);
                }
                for (j =starIn ;j <= starIn + this.allLong;j ++){
                    this.makeCellWithIndex(j);
                }
                this.startIndex = starIn;
                return;
            }
            for (i = starIn + this.allLong + 1 ;i <= this.startIndex + this.allLong ;i ++){
                cell = this.scrollView.content.getChildByTag(i+500);
                this.deleteCellWithCell(cell);
            }
            for (j =starIn ;j < this.startIndex;j ++){
                this.makeCellWithIndex(j);
            }
            this.startIndex = starIn;
            return;
        }
        //下滑
        if (starIn > this.startIndex){
            if (starIn > this.startIndex + this.allLong){
                for (i = this.startIndex ;i <= this.startIndex + this.allLong ;i ++){
                    cell = this.scrollView.content.getChildByTag(i+500);
                    this.deleteCellWithCell(cell);
                }
                for (j =starIn ;j <= starIn + this.allLong;j ++){
                    this.makeCellWithIndex(j);
                }
                this.startIndex = starIn;
                return;
            }
            for (i = this.startIndex ;i < starIn ;i ++){
                cell = this.scrollView.content.getChildByTag(i+500);
                this.deleteCellWithCell(cell);
            }
            for (var end = parseInt(this.startIndex + this.allLong+1) ; end <= parseInt(starIn + this.allLong) ; end ++){
                this.makeCellWithIndex(end);
            }
            this.startIndex = starIn;
        }
    },
    scrollViewisScrollToBottom : function () {
        hall.LOGD(null, "------scrollViewisScrollToBottom-------");
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
});
