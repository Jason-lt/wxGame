// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        titleLabel : {
            default : null,
            type : cc.Label
        },

        addNode : {
            default : null,
            type : cc.Node
        },
        addNumberLabel : {
            default : null,
            type : cc.Label
        },

        coinNumber : 0,
        coinLabel : {
            default : null,
            type : cc.Label
        },
        coinLayoutNode : {
            default : null,
            type : cc.Layout
        },

        bgSprite : {
            default : null,
            type : cc.Sprite
        },
        bgSpriteFrameList : [cc.SpriteFrame],

        rollNode1 : {
            default : null,
            type : cc.Node
        },
        rollNode2 : {
            default : null,
            type : cc.Node
        },
        rollNode3 : {
            default : null,
            type : cc.Node
        },

        topButton : {
            default : null,
            type : cc.Button
        },
        topBtnTitleLabel : {
            default : null,
            type : cc.Label
        },
        bottomButton : {
            default : null,
            type : cc.Button
        },
        bottomBtnTitle : {
            default : null,
            type : cc.Label
        },
        showBottomButtonCount : 0,

        chipAniPrefab : {
            default : null,
            type : cc.Prefab
        },
        chipAniNode : {
            default : null,
            type : cc.Node
        },
        coinAniToNode : {
            default : null,
            type : cc.Node
        },
        coinNumberLabel : {
            default : null,
            type : cc.Label
        },

        coinColorChangeNode1 : {
            default : null,
            type : cc.Node
        },
        coinColorChangeNode2 : {
            default : null,
            type : cc.Node
        },
        coinColorChangeNode3 : {
            default : null,
            type : cc.Node
        },

        isStartAni : false,
        isEndAni : false,

        resultIndex1 : 0,
        resultIndex2 : 0,
        resultIndex3 : 0,
        resultAdd : 0,
        resultNumber : 0,
        openType : "share",
        showAddNodeCountDown : 0,
        showTopBtnCountDown : 0
    },

    blackAction : function () {

    },
    backAction : function () {

    },
    onLoad : function() {
        ty.NotificationCenter.listen(double.EventType.GAME_ROLL_STOP,this.endRollAnimation,this);
        ty.NotificationCenter.listen(double.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },
    changeCheckState : function () {
        if(this.openType == "checkBox") {
            this.openType = "share";
        }
    },
    updateNewResultInfo : function () {
        this.coinAniToNode.active = false;
        this.openType = double.GlobalFuncs.getRewardOpenType("chipMachine");
        this.changeCheckState();
        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleNewResult,false);
        this.titleLabel.string = "第"+(double.GameWorld.totalLevel-1)+"关";
        this.bgSprite.spriteFrame = this.bgSpriteFrameList[0];
        this.coinNumber = 0;
        this.coinLabel.string = this.coinNumber;
        this.addNode.active = false;
        this.isStartAni = false;
        this.isEndAni = false;
        this.resultNumber = 0;
        this.resultAdd = 1;
        this.bottomButton.node.active = false;
        this.topBtnTitleLabel.string = "赚金币";
        hall.GlobalFuncs.btnScaleEffect(this.topButton.node,1.13);
        this.coinColorChangeNode1.color = double.weaponsPageCellColor.weaponBgWhite;
        this.coinColorChangeNode2.color = double.weaponsPageCellColor.weaponBgWhite;
        this.coinColorChangeNode3.color = double.weaponsPageCellColor.weaponBgWhite;

        var randomN = Math.random();
        if(randomN < double.GameWorld.generalConfig.machineChipDoubleThree){
            this.resultAdd = 3;
            this.resultIndex1 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            this.resultIndex2 = this.resultIndex1;
            this.resultIndex3 = this.resultIndex1;
        }else if(randomN < double.GameWorld.generalConfig.machineChipDoubleThree + double.GameWorld.generalConfig.machineChipDouble){
            this.resultAdd = 2;
            this.resultIndex1 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            this.resultIndex2 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            this.resultIndex3 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            while ((this.resultIndex1 == this.resultIndex2 && this.resultIndex2 == this.resultIndex3) ||
            (this.resultIndex1 != this.resultIndex2 && this.resultIndex2 != this.resultIndex3)){
                this.resultIndex1 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
                this.resultIndex2 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
                this.resultIndex3 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            }
        }else {
            this.resultAdd = 1;
            this.resultIndex1 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            this.resultIndex2 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            this.resultIndex3 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            while (this.resultIndex1 == this.resultIndex2 || this.resultIndex2 == this.resultIndex3){
                this.resultIndex1 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
                this.resultIndex2 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
                this.resultIndex3 = hall.GlobalFuncs.getRandomNumberBefore(double.GameWorld.newestObjectIndex+1);
            }
        }

        this.rollNode1.getComponent("double_cell_newResult").setRollTypeAndScale(
            double.windowNewWeaponType.newResultRollOne,double.GameWorld.newestObjectIndex,this.resultIndex1);
        this.rollNode2.getComponent("double_cell_newResult").setRollTypeAndScale(
            double.windowNewWeaponType.newResultRollTwo,double.GameWorld.newestObjectIndex,this.resultIndex2);
        this.rollNode3.getComponent("double_cell_newResult").setRollTypeAndScale(
            double.windowNewWeaponType.newResultRollThree,double.GameWorld.newestObjectIndex,this.resultIndex3);
        this.rollNode1.getComponent("double_cell_newResult").setRollTime(-1,55);
        this.rollNode2.getComponent("double_cell_newResult").setRollTime(-1,50);
        this.rollNode3.getComponent("double_cell_newResult").setRollTime(-1,45);
    },
    startRollAnimation : function () {
        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleNewResultFinish,false);
        this.isStartAni = true;
        this.rollNode1.getComponent("double_cell_newResult").setRollTime(12,1700);
        this.rollNode2.getComponent("double_cell_newResult").setRollTime(20,1750);
        this.rollNode3.getComponent("double_cell_newResult").setRollTime(27,1650);
    },
    endRollAnimation : function (rollType) {
        if(rollType  < double.windowNewWeaponType.newResultRollOne){
            return;
        }
        if(rollType == double.windowNewWeaponType.newResultRollOne){
            this.coinNumber += double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.resultIndex1]].goldNumber;
        }else if(rollType == double.windowNewWeaponType.newResultRollTwo){
            this.coinNumber += double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.resultIndex2]].goldNumber;
        }else {
            this.coinNumber += double.GameWorld.objectConfig[double.GameWorld.doubleObjectList[this.resultIndex3]].goldNumber;
        }

        this.coinLabel.string = this.coinNumber;
        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleNewResultEnd,false);
        // hall.GlobalFuncs.btnScaleEffectOnce(this.coinLabel,1.13);
        hall.GlobalFuncs.btnScaleEffectOnce(this.coinLayoutNode,1.5);
        this.resultNumber ++;
        if(this.resultNumber >= 3){
            double.AudioHelper.stopAllEffects();
            // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleNewResultEnd,false);
            this.isEndAni = true;
            if(this.resultAdd == 3){
                double.AudioHelper.playEffect(double.EffectPath_mp3.doubleRewardThreeMultiple,false);
            }else if(this.resultAdd == 2){
                double.AudioHelper.playEffect(double.EffectPath_mp3.doubleRewardTwoMultiple,false);
            }
            if(this.resultAdd != 1){
                this.showAddNodeCountDown = 50;
            }else {
                this.addNode.active = false;
                this.showTopBtnCountDown = 60;

                this.coinNumber *= this.resultAdd;
                this.coinLabel.string = this.coinNumber;
            }
            // this.coinNumber *= this.resultAdd;
            // this.coinLabel.string = this.coinNumber;

            if(ty.SystemInfo.isCheckVersion){
                this.topBtnTitleLabel.string = "领取";
            }else {
                if(hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_MACHINE_NODOUBLE_TIME) >= 2){
                    this.topBtnTitleLabel.string = "领3倍金币";
                }else {
                    this.topBtnTitleLabel.string = "领2倍金币";
                }
                this.showBottomButtonCount = 180;
            }
        }
    },

    showAddNode : function () {
        this.coinNumber *= this.resultAdd;
        this.coinLabel.string = this.coinNumber;

        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleNewResultEnd,false);
        hall.GlobalFuncs.btnScaleEffectOnce(this.coinLayoutNode,1.5);
        this.addNode.active = true;
        this.addNumberLabel.string = this.resultAdd +"倍";
        hall.GlobalFuncs.btnScaleEffectForNewResult(this.addNode);
        if(this.resultAdd == 3){
            hall.GlobalFuncs.nodeColorChangeEffect(this.coinColorChangeNode1);
            hall.GlobalFuncs.nodeColorChangeEffect(this.coinColorChangeNode2);
            hall.GlobalFuncs.nodeColorChangeEffect(this.coinColorChangeNode3);
        }else {
            if(this.resultIndex1 == this.resultIndex2){
                hall.GlobalFuncs.nodeColorChangeEffect(this.coinColorChangeNode1);
                hall.GlobalFuncs.nodeColorChangeEffect(this.coinColorChangeNode2);
            }else {
                hall.GlobalFuncs.nodeColorChangeEffect(this.coinColorChangeNode2);
                hall.GlobalFuncs.nodeColorChangeEffect(this.coinColorChangeNode3);
            }
        }
        this.bgSprite.spriteFrame = this.bgSpriteFrameList[1];

        this.showTopBtnCountDown = 60;
    },

    getMoreCoinAction : function () {
        if(!this.isStartAni){
            this.startRollAnimation();
            this.bottomButton.node.stopAllActions();
            this.topButton.node.active = false;
            return;
        }
        if(!this.isEndAni){
            return;
        }
        if(ty.SystemInfo.isCheckVersion){
            this.getChipForStart();
            return;
        }
        if(this.openType == "share"){
            if(ty.UserInfo.isInBSGS){
                double.Share.shareWithType(double.Share.onShareType.goldcoinluckymachine);
            }else {
                double.Share.shareWithType(double.Share.onShareType.unbsgsgoldcoinluckymachine);
            }
        }else {
            this.getChipForStart();
        }
    },
    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && (shareType == double.Share.onShareType.goldcoinluckymachine || shareType == double.Share.onShareType.unbsgsgoldcoinluckymachine)) {
            var resultType = double.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                    break;
                case 3:
                    if(hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_MACHINE_NODOUBLE_TIME) >= 2){
                        this.coinNumber *= 3;
                    }else {
                        this.coinNumber *= 2;
                    }
                    // this.coinNumber *= 2;
                    this.getChipForStart();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({title : '分享失败'});
                    break;
                default:
                    hall.MsgBoxManager.showToast({title : '分享失败了'+resultType});
                    break;
            }
            double.Share.resultType = 0;
        }
    },

    getCoinAction : function () {
        if(this.isEndAni){
            var number = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_MACHINE_NODOUBLE_TIME);
            hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_MACHINE_NODOUBLE_TIME,number+1);
           this.getChipForStart();
        }
    },

    getChipForStart : function () {
        double.GameWorld.chipNumber += this.coinNumber;
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_COIN_NUMBER,double.GameWorld.chipNumber);

        this.coinAniToNode.active = true;
        this.coinNumberLabel.string = double.GameWorld.chipNumber;
        if(!this.chipAniNode){
            this.chipAniNode = cc.instantiate(this.chipAniPrefab);
        }
        var from_pos = this.coinLabel.node.getPosition();
        from_pos.y -= 100;
        var to_pos = this.coinAniToNode.getPosition();
        this.chipAniNode.x = from_pos.x;
        this.chipAniNode.y = from_pos.y;
        var midy;
        var midx;
        if (Math.abs(to_pos.x - from_pos.x) < 100){
            midx = to_pos.x + 200;
            midy = from_pos.y + (to_pos.y - from_pos.y)/2;
        }else if (Math.abs(to_pos.y - from_pos.y) < 100){
            midx = (to_pos.x - from_pos.x) / 2;
            midy = from_pos.y;
        }else {
            midx = -200;
            midy = from_pos.y + (to_pos.y - from_pos.y)/2 + 100;
        }
        hall.LOGD("", "曲线运动中间点 midx = " + midx + "  midy = " + midy );
        var midPoint = cc.p(midx, midy);
        var controlPoints1 = [     from_pos,     midPoint,     to_pos   ];
        var bezierToDst1 = cc.bezierTo(0.7, controlPoints1);
        var act1 = cc.delayTime(1);

        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleChip1);

        var animation = this.chipAniNode.getComponent(cc.Animation).getAnimationState("jb_01");
        this.node.addChild(this.chipAniNode);
        var that = this;
        animation.once("finished", function (target) {
            that.chipAniNode.removeFromParent();
            if(double.GameWorld.totalLevel%10 == 1 && double.GameWorld.totalLevel < 100){
                // 每10关，进行枪械转盘抽奖励
                double.GlobalFuncs.showRewardWeapon();
            }else {
                var nextNewLevel = 0;
                var addTemp = 2;
                while (nextNewLevel < double.GameWorld.totalLevel-1){
                    nextNewLevel += addTemp;
                    if(nextNewLevel == double.GameWorld.totalLevel-1){
                        that.node.removeFromParent();
                        double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.newObject,double.GameWorld.newestObjectIndex);
                        return;
                    }
                    addTemp ++;
                }
                ty.NotificationCenter.trigger(double.EventType.GAME_START_LEVEL_UP);
            }
            that.node.removeFromParent();
        });
        animation.play();
        this.chipAniNode.runAction(cc.sequence(bezierToDst1,act1));

    },

    update : function(dt) {
        if(this.showBottomButtonCount){
            this.showBottomButtonCount --;
            if(this.showBottomButtonCount == 0){
                this.bottomButton.node.active = true;
                this.bottomBtnTitle.string = "不翻倍领取";
            }
        }
        if(this.showAddNodeCountDown){
            this.showAddNodeCountDown --;
            if(this.showAddNodeCountDown == 0){
                this.showAddNode();
            }
        }
        if(this.showTopBtnCountDown){
            this.showTopBtnCountDown --;
            if(this.showTopBtnCountDown == 0){
                this.topButton.node.active = true;
            }
        }
    },


    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

});
