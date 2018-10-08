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
        slectedTitleLabel: {
            default : null,
            type : cc.Label
        },
        unSlectedTitleLabel: {
            default : null,
            type : cc.Label
        },
        selectedSprite: {
            default : null,
            type : cc.Sprite
        },
        selected : false,
        type: 0,
        count : 0
    },
    onLoad : function() {

    },
    selectButtonAction : function () {
        if(this.type == 1){
            ty.NotificationCenter.trigger(ddz.EventType.ACTION_FT_CHANGE_ROUND_SELECT,this.count);
        }
    },
    setSelectedState : function (selected) {
        this.selectedSprite.node.active = selected;
        this.slectedTitleLabel.node.active = selected;
        this.unSlectedTitleLabel.node.active = !selected;
        // if(selected){
        //     this.titleLabel.textColor = cc.color(253,80,81,1);
        // }else {
        //     this.titleLabel.textColor = cc.color(26,105,81,1);
        // }
    },
    setTitleString : function (titleString) {
        this.titleLabel.string = titleString;
    },
    setRoundCount : function (count) {
        this.slectedTitleLabel.string = count+"局";
        this.unSlectedTitleLabel.string = count + "局";
        this.count = count;
    }
    // update (dt) {},
});
