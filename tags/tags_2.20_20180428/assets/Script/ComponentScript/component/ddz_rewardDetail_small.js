

cc.Class({
    extends: cc.Component,

    properties: {

        ddz_rewardCell: {
            default : null,
            type : cc.Prefab
        },
        // moreButton : {
        //     default : null,
        //     type : cc.Button
        // },

        parentScene: {
            default: null,
            serializable: false
        }
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad : function (){
        // this.moreButton.node.on("click",this.onMoreButton,this);
    },

    setInformationWithTotalAndLoss:function (inforArray) {
        for (var i = 0;i < 3;i++){
            var ddz_cell = cc.instantiate(this.ddz_rewardCell);
            ddz_cell.y = -130-106*i;
            this.node.addChild(ddz_cell);
            var ddz_rewardCellS = ddz_cell.getComponent('ddz_rewardCell');
            if(i < inforArray.length){
                var resultA = inforArray[i];
                ddz_rewardCellS.setDetailInformation(resultA);
            }else {
                ddz_rewardCellS.setDetailInformation({"titleS":"--","numberString":"--","timeS":"--","stateS":"--"});
            }
        }
    },
    // onMoreButton : function () {
    //     ddz.LOGD(null, "onMoreButton");
    //     this.parentScene.onMoreButton();
    // },

    // update (dt) {},
});
