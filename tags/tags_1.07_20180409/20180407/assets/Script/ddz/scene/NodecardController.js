/**
 * Created by liangmaoshi on 16/4/21.
 */

ddz.NodecardController = cc.Class({
	extends: cc.Sprite,
    ctor:function(){
		var playController = arguments[0];
    	this._playController = playController;
    	this._labels=[];
    	this._back = null;
    	this.canVisible = true;
		ddz.LOGD(null, "记牌器构造函数。。。。。");

        this.init();
        this.refresh();
    },

    init:function(){
    	var winsize = cc.winSize; //
        var h = winsize.height ;
        var w = winsize.width ;
        this.JIPAIQI_SHOW_POS = cc.p(w * 0.5, h * 0.15);
        if(this._super()){

            var back= this._back = new cc.Sprite("#game_jipaiqi.png");
            back.setPosition(this.JIPAIQI_SHOW_POS);
            var labels= this._labels;
            var posy = h * 0.03;
            var originx =w * 0.11 ;
            var deltax= w * 0.06;
            for(var i=0; i < 15; i++) {
                
                var label = labels[i]= new cc.LabelTTF("","Aril",20);
                label.setPosition(originx + i * deltax, posy);
                back.addChild(label);
            }
            this.addChild(back);

            return true;
        }

        return false;
    },
   
    //
    setVisible:function(bVisible){
    	this._back.setVisible(bVisible);
    	this.canVisible = bVisible;
    },

    //切换记牌器的可见性
    switchVisible:function(){
    	this.setVisible(!this.canVisible);
    },


    _setLabel:function(index, num) {
    	this._labels[index].setString(num);
    },

    refresh:function(){
    	if (this._playController._status == ddz.Enums.PlayStatus.PLAY_STATUS_PREPARE) {
    		return;
    	}
    	//开始刷数据
    	var nums = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    	if (this._playController.isErdou()) {
    		var top_cards = this._playController._topSeatinfo.model.m_card;
    		for (var i = 0; i < top_cards.length; i++) {
    			var p = ddz.GlobalFuncs.GetCardPointByNum(top_cards[i]) - 1;
    			if (nums[p]) {
    				nums[p] += 1;
    			}else {
    				nums[p] = 1;
    			}
    		}
    		var kickOut_cards = this._playController._tableState.normalInfo.m_kickoutCard;
    		for (var i = 0; i < kickOut_cards.length; i++) {
    			var p = ddz.GlobalFuncs.GetCardPointByNum(kickOut_cards[i]) -1;
    			if (nums[p]) {
    				nums[p] += 1;
    			}else{
    				nums[p] = 1;
    			}
    		}
    	}else{
    		var left_cards = this._playController._leftSeatinfo.model.m_card;
    		for (var i = 0; i < left_cards.length; i++) {
    			var p = ddz.GlobalFuncs.GetCardPointByNum(left_cards[i]) - 1;
    			if (nums[p]) {
    				nums[p] += 1;
    			}else{
    				nums[p] = 1;
    			}
    		}

            var right_cards = this._playController._rightSeatinfo.model.m_card;
            for (var i = 0; i < right_cards.length; i++) {
                var p = ddz.GlobalFuncs.GetCardPointByNum(right_cards[i]) - 1;
                if (nums[p]) {
                    nums[p] += 1;
                } else {
                    nums[p] = 1;
                }
            }

    	}
    	if (this._playController._status != ddz.Enums.PlayStatus.PLAY_STATUS_PLAYING) { //底牌还没加入玩家手牌的时候，需要算上。进入playing状态后，底牌已经加入玩家手牌，不需要计算
			// var extra = this._playController._extraCards;
			var extra = this._playController._extraCards.getExtraCards();
			for (var i = 0; i < extra.length; i++) {
				var p = extra[i]._info._point - 1;
				if (nums[p]) {
					nums[p] += 1;
				} else {
					nums[p] = 1;
				}
			}
		}
		
		// 开始刷界面	
		this._setLabel(0, nums[14]);
		this._setLabel(1, nums[13]);
		this._setLabel(2, nums[1]);
		this._setLabel(3, nums[0]);
		for (var i = 4; i < 15; i++) { //i=14, nums[2] //i = 4, num[12]
			this._setLabel(i, nums[16 - i]);
		}
    }

});





