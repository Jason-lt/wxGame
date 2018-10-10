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

        coinLabel : {
            default : null,
            type : cc.Label
        },

        pageTypeSprite : {
            default : null,
            type : cc.Sprite
        },
        pageTypeSpriteFrameList : [cc.SpriteFrame],
        progressLabel : {
            default : null,
            type : cc.Label
        },

        weaponICONSpriteFrameList : [cc.SpriteFrame],
        weaponSpriteFrameList0 : [cc.SpriteFrame],
        weaponSpriteFrameList1 : [cc.SpriteFrame],
        weaponSpriteFrameList2 : [cc.SpriteFrame],

        weaponNodeList : [cc.Node],

        myPageView : {
            default : null,
            type : cc.PageView
        },
        gunUnlockNumber : 0,
        bowUnlockNumber : 0,
        rewardUnlockNumber : 0,

        nowPageIndex : 2,
        tempPageIndex : 0,

        pageCellPrefab : {
            default : null,
            type : cc.Prefab
        },

        solveButton : {
            default : null,
            type : cc.Button
        },
        solveChipNumberLabel : {
            default : null,
            type : cc.Label
        },
        rewardTipsLabel : {
            default : null,
            type : cc.Label
        },

        animationCount : 0,
        animationCountAll : 0,

        resultId : 0,
        tempResultId : 0
    },
    blackAction : function () {

    },
    backAction : function () {
        this.node.removeFromParent();
        ty.NotificationCenter.trigger(double.EventType.TITLE_PAGE_REVIEW);
    },
    onLoad : function() {
        this.solveButton.enableAutoGrayEffect = true;
        this.myPageView.node.on("scrolling",this.pageViewScrolling,this);
        ty.NotificationCenter.listen(double.EventType.CHANGE_WEAPONSDEPOT_STATE,this.exChangeWeaponsInfo,this);
    },

    exChangeWeaponsInfo : function () {
        var pages = this.myPageView.getPages();
        var pageView;
        var addWindow;
        var tempColor;
        var weaponType;
        var i;
        if(this.weaponNodeList && this.weaponNodeList.length > 0){
            var pageIndex = 0;
            for (i = 0 ; i < this.weaponNodeList.length ; i ++){
                pageIndex = parseInt(i/9);
                addWindow = this.weaponNodeList[i];
                if(pageIndex == 0){
                    tempColor = double.weaponsPageCellColor.weaponBgGreen;
                    weaponType = double.GameWorld.doubleGunNameList[i%9];
                }else if(pageIndex == 1){
                    tempColor = double.weaponsPageCellColor.weaponBgYellow;
                    weaponType = double.GameWorld.doubleBowNameList[i%9];
                }else {
                    tempColor = double.weaponsPageCellColor.weaponBgPink;
                    weaponType = double.GameWorld.doubleRewardWeaponList[i%9];
                }
                addWindow.getComponent("double_cell_weaponsDepot").setWeaponType(weaponType);
                if(double.GameWorld.weaponUnlockState[weaponType]){
                    addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(double.weaponsPageCellColor.weaponBgWhite);
                    addWindow.getComponent("double_cell_weaponsDepot").changeWeaponSpriteFrame(this["weaponSpriteFrameList"+pageIndex][i%9]);
                }else {
                    addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(tempColor);
                    addWindow.getComponent("double_cell_weaponsDepot").changeWeaponSpriteFrame(this["weaponICONSpriteFrameList"][pageIndex]);
                }
                if(weaponType == double.GameWorld.weaponNow){
                    addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(double.weaponsPageCellColor.weaponBgBlue);
                }
            }
        }else {
            for (i = 0 ; i < pages.length ; i ++){
                pageView = pages[i];
                if(i == 0){
                    tempColor = double.weaponsPageCellColor.weaponBgGreen;
                }else if(i == 1){
                    tempColor = double.weaponsPageCellColor.weaponBgYellow;
                }else {
                    tempColor = double.weaponsPageCellColor.weaponBgPink;
                }
                for (var j = 0 ; j < 9 ; j ++){
                    addWindow = cc.instantiate(this.pageCellPrefab);

                    if(i == 0){
                        weaponType = double.GameWorld.doubleGunNameList[j];
                    }else if(i == 1){
                        weaponType = double.GameWorld.doubleBowNameList[j];
                    }else {
                        if(j < 5){
                            weaponType = double.GameWorld.doubleGunNameList[j+9];
                        }else {
                            weaponType = double.GameWorld.doubleBowNameList[j+4];
                        }
                    }

                    addWindow.getComponent("double_cell_weaponsDepot").setWeaponType(weaponType);
                    if(double.GameWorld.weaponUnlockState[weaponType]){
                        addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(double.weaponsPageCellColor.weaponBgWhite);
                        addWindow.getComponent("double_cell_weaponsDepot").changeWeaponSpriteFrame(this["weaponSpriteFrameList"+i][j]);
                    }else {
                        addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(tempColor);
                        addWindow.getComponent("double_cell_weaponsDepot").changeWeaponSpriteFrame(this["weaponICONSpriteFrameList"][i]);
                    }
                    if(weaponType == double.GameWorld.weaponNow){
                        addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(double.weaponsPageCellColor.weaponBgBlue);
                    }
                    this.weaponNodeList.push(addWindow);
                    addWindow.x = (j%3)*200 -200;
                    addWindow.y = 245-parseInt(j/3)*245;
                    pageView.addChild(addWindow);
                }
            }
        }
    },

    updateWeaponsDepotInfo : function (refresh) {

        this.exChangeWeaponsInfo();

        this.coinLabel.string = double.GameWorld.chipNumber;
        this.gunUnlockNumber = 0;
        this.bowUnlockNumber = 0;
        this.rewardUnlockNumber = 0;
        for (var i = 0 ; i < 9 ; i ++){
            if(double.GameWorld.weaponUnlockState[double.GameWorld.doubleGunNameList[i]]){
                this.gunUnlockNumber ++;
            }
            if(double.GameWorld.weaponUnlockState[double.GameWorld.doubleBowNameList[i]]){
                this.bowUnlockNumber ++;
            }
            if(double.GameWorld.weaponUnlockState[double.GameWorld.doubleRewardWeaponList[i]]){
                this.rewardUnlockNumber ++;
            }
        }

        this.changeSolveState(refresh);
    },

    changeSolveState : function (refresh) {
        this.tempPageIndex = this.myPageView.getCurrentPageIndex();
        if(this.tempPageIndex != this.nowPageIndex || refresh){
            this.nowPageIndex = this.tempPageIndex;
            this.pageTypeSprite.spriteFrame = this.pageTypeSpriteFrameList[this.nowPageIndex];
            if(this.nowPageIndex == 0){
                this.solveButton.node.active = true;
                this.rewardTipsLabel.node.active = false;
                this.solveChipNumberLabel.string = double.GameWorld.generalConfig.gunUnlockChip;
                this.solveButton.interactable = double.GameWorld.chipNumber >= double.GameWorld.generalConfig.gunUnlockChip && this.gunUnlockNumber < 9;
                this.progressLabel.string = this.gunUnlockNumber+"/9";
            }else if(this.nowPageIndex == 1){
                this.solveButton.node.active = true;
                this.rewardTipsLabel.node.active = false;
                this.solveChipNumberLabel.string = double.GameWorld.generalConfig.bowUnlockChip;
                this.solveButton.interactable = double.GameWorld.chipNumber >= double.GameWorld.generalConfig.bowUnlockChip && this.bowUnlockNumber < 9;
                this.progressLabel.string = this.bowUnlockNumber+"/9";
            }else {
                this.solveButton.node.active = false;
                this.rewardTipsLabel.node.active = true;
                this.progressLabel.string = this.rewardUnlockNumber+"/9";
            }
        }
    },

    pageViewScrolling : function (event) {
        this.changeSolveState();
    },
    solveNewWeapon : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleWeaponsDepotRandom,false);
       //  this.resultId = hall.GlobalFuncs.getRandomNumberBefore(9);
       // if(this.nowPageIndex == 0){
       //     double.GameWorld.chipNumber -= double.GameWorld.generalConfig.gunUnlockChip;
       //     while (double.GameWorld.weaponUnlockState[double.GameWorld.doubleGunNameList[this.resultId]]){
       //         this.resultId = hall.GlobalFuncs.getRandomNumberBefore(9);
       //     }
       //     double.GameWorld.weaponNow = double.GameWorld.doubleGunNameList[this.resultId];
       // }else if(this.nowPageIndex == 1){
       //     double.GameWorld.chipNumber -= double.GameWorld.generalConfig.bowUnlockChip;
       //     while (double.GameWorld.weaponUnlockState[double.GameWorld.doubleBowNameList[this.resultId]]){
       //         this.resultId = hall.GlobalFuncs.getRandomNumberBefore(9);
       //     }
       //     double.GameWorld.weaponNow = double.GameWorld.doubleBowNameList[this.resultId];
       // }
       //  double.GameWorld.weaponUnlockState[double.GameWorld.weaponNow] = true;
       //  hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_NOW,double.GameWorld.weaponNow);
       //  hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_LOCK_STATE,JSON.stringify(double.GameWorld.weaponUnlockState));
       //  hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_COIN_NUMBER,double.GameWorld.chipNumber);
        this.myPageView.enabled = false;
        this.animationCountAll = 160;
        this.tempResultId = -1;
        this.solveButton.interactable = false;
        this.solveWeaponChangeIndexAction();
    },

    solveWeaponChangeIndexAction : function () {
        this.resultId = hall.GlobalFuncs.getRandomNumberBefore(9);
        if(this.nowPageIndex == 0){
            // double.GameWorld.chipNumber -= double.GameWorld.generalConfig.gunUnlockChip;
            while (double.GameWorld.weaponUnlockState[double.GameWorld.doubleGunNameList[this.resultId]] || this.resultId == this.tempResultId){
                this.resultId = hall.GlobalFuncs.getRandomNumberBefore(9);
            }
            this.tempResultId = this.resultId;
            this.weaponNodeList[this.resultId].getComponent("double_cell_weaponsDepot").chooseActionAnimation();
            if(this.gunUnlockNumber == 8){
                this.endSolveWeapon();
                return;
            }
        }else if(this.nowPageIndex == 1){
            // double.GameWorld.chipNumber -= double.GameWorld.generalConfig.bowUnlockChip;
            while (double.GameWorld.weaponUnlockState[double.GameWorld.doubleBowNameList[this.resultId]] || this.resultId == this.tempResultId){
                this.resultId = hall.GlobalFuncs.getRandomNumberBefore(9);
            }
            this.tempResultId = this.resultId;
            this.weaponNodeList[this.resultId+9].getComponent("double_cell_weaponsDepot").chooseActionAnimation2();
            if(this.bowUnlockNumber == 8){
                this.endSolveWeapon();
                return;
            }
        }
        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleWeaponsDepotRandom,false);
        this.animationCount = 10;
    },

    endSolveWeapon : function () {
        this.animationCount = 0;
        this.animationCountAll = 0;
        if(this.nowPageIndex == 0){
            double.GameWorld.chipNumber -= double.GameWorld.generalConfig.gunUnlockChip;
            double.GameWorld.weaponNow = double.GameWorld.doubleGunNameList[this.resultId];
        }else if(this.nowPageIndex == 1){
            double.GameWorld.chipNumber -= double.GameWorld.generalConfig.bowUnlockChip;
            double.GameWorld.weaponNow = double.GameWorld.doubleBowNameList[this.resultId];
        }
        double.GameWorld.weaponUnlockState[double.GameWorld.weaponNow] = true;
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_NOW,double.GameWorld.weaponNow);
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_WEAPON_LOCK_STATE,JSON.stringify(double.GameWorld.weaponUnlockState));
        hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_COIN_NUMBER,double.GameWorld.chipNumber);
        double.AudioHelper.playEffect(double.EffectPath_mp3.doubleWeaponsDepotUnlock,false);

        this.updateWeaponsDepotInfo(true);
        this.coinLabel.string = double.GameWorld.chipNumber;
        if(this.nowPageIndex == 1){
            this.weaponNodeList[this.resultId+9].getComponent("double_cell_weaponsDepot").chooseAction();
        }else {
            this.weaponNodeList[this.resultId].getComponent("double_cell_weaponsDepot").chooseAction();
        }
        this.showWeaponWindCount = 60;
        this.myPageView.enabled = true;
    },
    showNewWeapon : function () {
        this.solveButton.interactable = true;
        if(double.GlobalFuncs.getRewardOpenType("newWeapon") != "omit"){
            if(this.nowPageIndex == 1){
                double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.newWeapon,this.resultId+9);
            }else {
                double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.newWeapon,this.resultId);
            }
        }
    },

    addCoinAction : function () {
        hall.adManager.showRewardedVideo("weaponsDepot");
    },

    update : function(dt) {
        if(this.showWeaponWindCount){
            this.showWeaponWindCount --;
            if(this.showWeaponWindCount == 0){
                this.showNewWeapon();
            }
        }
        if(this.animationCount){
            this.animationCount -- ;
            if(this.animationCount == 0 ){
                this.solveWeaponChangeIndexAction();
            }
        }
        if(this.animationCountAll){
            this.animationCountAll --;
            if(this.animationCountAll == 0){
                this.animationCount = 0;
                this.endSolveWeapon();
            }
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // start () {
    //
    // },


});
