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
        bgSprite : {
            default : null,
            type : cc.Sprite
        },
        avatarBgSpriteFrameList : [cc.SpriteFrame],
        rankLabel : {
            default : null,
            type : cc.Label
        },
        rankSelfLabel : {
            default : null,
            type : cc.Label
        },
        avatarSprite : {
            default : null,
            type : cc.Sprite
        },
        nameLabel : {
            default : null,
            type : cc.Label
        },
        scoreLabel : {
            default : null,
            type : cc.Label
        }

        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    setPersonInformation : function (info,isSelf,spriteIndex) {
        this.bgSprite.spriteFrame = this.avatarBgSpriteFrameList[spriteIndex];
        if(isSelf){
            this.rankSelfLabel.node.active = true;
            this.rankLabel.node.active = false;
            this.rankSelfLabel.string = info.rank +"";
        }else {
            this.rankSelfLabel.node.active = false;
            this.rankLabel.node.active = true;
            this.rankLabel.string = info.rank +"";
        }
        if(info.avatarUrl && info.avatarUrl != ""){
            ty.SystemInfo.getImageWithURL(info.avatarUrl,this.avatarSprite);
        }
        this.nameLabel.string = hall.GlobalFuncs.sliceStringToLength(info.nickname,10);
        this.scoreLabel.string = info.sumScore +"";
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});
