

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

        panel:cc.Node,

        parentScene: {
            default: null,
            serializable: false
        },

        cellHeight:102,
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad : function (){
        // this.moreButton.node.on("click",this.onMoreButton,this);
    },

    setInformationWithTotalAndLoss:function (inforArray) {
        for (var i = 0;i < 8;i++){
            var ddz_cell = cc.instantiate(this.ddz_rewardCell);
            // ddz_cell.y = -130-this.cellHeight*i;
            ddz_cell.y = -60-this.cellHeight*i;
            this.panel.addChild(ddz_cell);
            var ddz_rewardCellS = ddz_cell.getComponent('ddz_rewardCell');
            if(i < inforArray.length){
                var resultA = inforArray[i];
                ddz_rewardCellS.setDetailInformation(resultA);
            }else {
                ddz_rewardCellS.setDetailInformation({"titleS":"--","numberString":"--","timeS":"--","stateS":"--"});
            }

            // if (i%2 == 0) {
            //     ddz_rewardCellS.setBgSpr(true);
            // }else {
            //     ddz_rewardCellS.setBgSpr(false);
            // }
        }
    }
    // update (dt) {},
});
