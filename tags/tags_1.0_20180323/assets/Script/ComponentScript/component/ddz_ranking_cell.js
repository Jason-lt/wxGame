

cc.Class({
    extends: cc.Component,

    properties: {
        backBg : {
            default : null,
            type : cc.Sprite
        },
        rankLabel : {
            default : null,
            type : cc.Label
        },
        rankSprite : {
            default : null,
            type : cc.Sprite
        },
        nameLabel : {
            default : null,
            type : cc.Label
        },
        countLabel : {
            default : null,
            type : cc.Label
        },
        avatar : {
            default : null,
            type : cc.Node
        },
        rankSpritList :[cc.SpriteFrame],
    },
    addDataWithObject : function (objc) {
        var  rank = objc.rank;
        // ddz.LOGD(null, "arr[4%2 ======"+parseInt(arr[3])+"======"+parseInt(arr[3])%2 +"======"+arr[3]);
        if(parseInt(rank%2) == 0){
            this.backBg.node.active = false;
        }else {
            this.backBg.node.active = true;
        }
        this.setDetailInformation(objc);
    },

// {
//     "userId":10442,
//     "rankPic":"http://ddz.dl.tuyoo.com/cdn37/hall/rank/imgs/rank_0.png",
//     "rank":1,
//     "detail":{
//     "rankValue":"1",
//         "name":"来宾01baGt**F",
//         "headUrl":"http://ddz.image.tuyoo.com/avatar/head_suv.png"
// }
    setDetailInformation:function (resultMap) {
        var rank = resultMap.rank;
        if(rank <4){
            this.rankLabel.node.active = false;
            this.rankSprite.node.active = true;
            this.rankSprite.spriteFrame = this.rankSpritList[rank-1];
        }else {
            this.rankLabel.node.active = true;
            this.rankSprite.node.active = false;
            this.rankLabel.string = rank;
        }
        var detail = resultMap.detail;
        this.nameLabel.string =  detail.name;
        this.countLabel.string = detail.rankValue+"次";
        var wimdow = this.avatar.getComponent("Avatar");
        wimdow.setAvatarUrl(detail.headUrl);
        // ty.SystemInfo.getImageWithURL("http://ddz.image.tuyoo.com/avatar/head_female_2.png",wimdow.avatar);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});
