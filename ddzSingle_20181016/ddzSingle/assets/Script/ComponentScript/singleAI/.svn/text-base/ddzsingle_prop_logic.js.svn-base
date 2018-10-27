// 
// File : offline_prop_logic.js
// 
// Function : 单机道具的使用逻辑
// 
// Author : WangHp
// 
// Date : 2015/2/27
// 

ddz.offLinePropLogic = function() {
	var tag = 'ddz.offlinePropLogic';
	var playContent = null;
	var isDoubleGain = false;
	var isAvoidLose = false;
	var fromLeftCard = null; // 从上家换来的牌对象
	var toLeftCard = null; // 换给上家的牌
	var exchangeGetCardSprite = null; // 换牌得来的精灵
	var exchangeGetId = null;

	var obj = {};
	
	// 使用双倍卡
	var useDoubleGain = function() {
		isDoubleGain = true;
		playContent._bottomController['icon_double'].setVisible(true);
		return true;
	};

	// 使用保护卡
	var useAvoidLose = function() {
		isAvoidLose = true;
		playContent._bottomController['icon_protect'].setVisible(true);
		return true;
	};

	// 检测选中的牌
	//监测选中的牌数
	var checkPropWorkOnCard = function() {
		if(playContent._selectedCards.length == 1) {
			return true;
		}

		var str = ddz.STRING.DDZ_OFFLINE_PROP_LOGIC_STRING_1000;
		if (playContent._selectedCards.length > 1) {
			str = ddz.STRING.DDZ_OFFLINE_PROP_LOGIC_STRING_1001;
		}
		//弹提示信息
		ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
		            text:str,
		            duration:1
		});

		return false;
	};

	// 使用弃牌卡
	var useDicardCard = function() {
		if (!checkPropWorkOnCard()) {
			return false;
		}

		var cards = [];
		for (var i = 0; i < playContent._selectedCards.length; i++) {
			cards.push(playContent._selectedCards[i]._info._number);
		}

		//弃牌使用出牌的逻辑
		playContent._mySeatinfo.playCards(cards);
		playContent._removeSelectedCards();
		playContent._refreshCardsLayer();
		playContent.refreshNoteCardWhenUseProp();
		
		return true;
	};

	// 使用重发卡
	var useRedealCard = function() {
		//重发卡
		playContent._initCardsInSingle();
		playContent._refreshCardsLayer();

		if (playContent._isDizhu(playContent._mySeatIndex)){
			playContent._insertExtraCards();
		}
		
		// 癞子场       
		if (playContent.isType(ddz.Enums.PlayType.PLAY_TYPE_LAIZI)) {
			playContent._resetPlayerCardsWithLaizi();
			playContent._rankCardsWithLaizi(); // 手牌中有癞子牌时从新对手牌进行排序
			playContent._refreshCardsLayer();
		}


		return true;
	};

	var findCard = function(id) {
		//寻找换来的牌
		for (var i=0; i<playContent._cards.length; i++) {
			if(playContent._cards[i]._info._number != id){
				continue;
			}
			return playContent._cards[i];
		}

		return null;
	};

	var findCardSprite = function(id) {
		//寻找换来的牌
		for (var i=0; i<playContent._cards.length; i++) {
			if(playContent._cards[i]._info._number != id){
				continue;
			}
			return playContent._cards[i].getSprite();
		}

		return null;
	};

	var useChangeCard = function() {
		if (!checkPropWorkOnCard()) {
			return false;
		}

		var srcIdx = playContent._selectedCards[0]._info._number;
		var initCardPos = findCardSprite(srcIdx).getPosition();

		exchangeGetId = ddz.AIRobots.exchangeCard(srcIdx);
		// 设置牌的信息
		playContent._setSingleCardsInfo();
		playContent._refreshCardsLayer();

		exchangeGetCardSprite = null;
		//寻找换来的牌
		exchangeGetCardSprite = findCardSprite(exchangeGetId);
		exchangeGetCardSprite.setVisible(false);

		var dstPos = playContent['cards_cover_layer'].convertToWorldSpace(exchangeGetCardSprite.getPosition());

		// 从头像左侧过来的牌
		fromLeftCard = new ddz.Card(ddz.Enums.CardSize.CARD_SIZE_MIDDLE);
		fromLeftCard.resetWithNum(exchangeGetId);
		var fromSprite = fromLeftCard.getSprite();
		fromSprite.setPosition(playContent._leftPlayerController.getHeadPosOnScr());
		playContent.view.ccbRootNode.addChild(fromSprite);

		// 直线运动、放大
		var moveAction = cc.Spawn.create(cc.MoveTo.create(1, dstPos), cc.ScaleTo.create(0.9, 1.5));
		var call = cc.CallFunc.create(obj.reachPlayerHand, obj);
		fromSprite.runAction(cc.Sequence.create(moveAction, call));

		// 从玩家处到左面玩家的牌
		toLeftCard = new ddz.Card(ddz.Enums.CardSize.CARD_SIZE_BIG);
		toLeftCard.resetWithNum(srcIdx);
		var toLeftSprite = toLeftCard.getSprite();
		toLeftSprite.setPosition(playContent['cards_cover_layer'].convertToWorldSpace(initCardPos));
		playContent.view.ccbRootNode.addChild(toLeftSprite);

		// 直线运动 缩小运动
		var moveAction2 = cc.Spawn.create(cc.MoveTo.create(1, playContent._leftPlayerController.getHeadPosOnScr()), cc.ScaleTo.create(0.9, 0.5));
		var call2 = cc.CallFunc.create(obj.reachLeftPlayerHand, obj);
		toLeftSprite.runAction(cc.Sequence.create(moveAction2, call2));

		// 不能操作手牌
		playContent._isUserInteractive = false;

		return true;
	};

	obj.reachPlayerHand = function() {
		var fromSprite = fromLeftCard.getSprite();
		fromSprite.setVisible(false);
		fromSprite.removeFromParent();
		fromLeftCard.destroy();
		fromLeftCard = null;
		exchangeGetCardSprite.setVisible(true);
		exchangeGetCardSprite = null;
	};

	obj.reachLeftPlayerHand = function() {
		var toLeftSprite = toLeftCard.getSprite();
		toLeftSprite.setVisible(false);
		toLeftSprite.removeFromParent();
		toLeftCard.destroy();
		toLeftCard = null;
		playContent._isUserInteractive = true;
		playContent.refreshNoteCardWhenUseProp();

		if (exchangeGetId != null) {
			var exchangeCard = findCard(exchangeGetId);
			playContent.setExchangeCardSelected(exchangeCard);
			exchangeGetId = null;
		}
	},

	obj.init = function(gameContent) {
		playContent = gameContent;
		// 监听事件
		ty.NotificationCenter.listen(ddz.SingleEventType.SINGLE_EVT_APPLY_FOR_USING_PROP, obj.onApplyForUsingProp, obj);
	};

	obj.clear = function() {
		// 取消监听相关事件
		ty.NotificationCenter.ignore(ddz.SingleEventType.SINGLE_EVT_APPLY_FOR_USING_PROP, obj.onApplyForUsingProp, obj);
		playContent = null;
	};

	obj.reset = function() {
		isDoubleGain = false;
		isAvoidLose = false;

		playContent._bottomController['icon_double'].setVisible(false);
		playContent._bottomController['icon_protect'].setVisible(false);
	};

	obj.isDoubleGain = function() {
		return isDoubleGain;
	};

	obj.isAvoidLose = function() {
		return isAvoidLose;
	};

	obj.onApplyForUsingProp = function(propId) {

		ddz.LOGD(tag, 'ddz_robot.js onApplyForUsingProp 000000000000000000000000');

		var useSucess = false;
		var reportEvt = '';
		switch(propId){
			case ddz.singlePropButton.btnTags.EXCHANGE_CARD:
				//换牌卡
				useSucess = useChangeCard();
				reportEvt = ddz.countEvent.ddz_PROP_USE_CHANGE_CARD;
				break;

			case ddz.singlePropButton.btnTags.REDEAL_CARD:
				//重发卡
				useSucess = useRedealCard();
				reportEvt = ddz.countEvent.ddz_PROP_USE_REDEAL_CARD;
				break;

			case ddz.singlePropButton.btnTags.DISCARD_CARD:
				//弃牌卡
				useSucess = useDicardCard();
				reportEvt = ddz.countEvent.ddz_PROP_USE_DISCARD_CARD;
				break;

			case ddz.singlePropButton.btnTags.DOUBLE_CARD:
				//双倍卡
				useSucess = useDoubleGain();
				reportEvt = ddz.countEvent.ddz_PROP_USE_DOUBLE_CARD;
				break;

			case ddz.singlePropButton.btnTags.PROTOTECT_CARD:
				//保护卡
				useSucess = useAvoidLose();
				reportEvt = ddz.countEvent.ddz_PROP_USE_PROTECT_CARD;
				break;

			default:
				ddz.LOGD(tag, "Error : get an bad prop id, please check it !" );
				break;
		}

		if (!useSucess) {
			//使用不成功
			ddz.LOGD(tag, "Use local prop failed, please check it !");
			return;
		}
		// 上报
		ddz.reportHelper.report(reportEvt);
		
		//减少使用的道具数量，进行更信通知更新道具数量
		ty.NotificationCenter.trigger(ddz.SingleEventType.SINGLE_EVT_PROP_USED, propId);
	};

	return obj;
};
