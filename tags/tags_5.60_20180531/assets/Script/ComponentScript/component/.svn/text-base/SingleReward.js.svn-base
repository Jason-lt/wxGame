
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "singleReward";
    },

    properties: {
        rewardSpr : cc.Sprite,
        rewardDes : cc.RichText,
    },


    onLoad :function() {
        // this.setAvatarUrl("http://ddz.image.tuyoo.com/avatar/head_female_2.png");
        // this.setPlayerName("我是一只小小鸟");
        // this.hideNameDisplay();
    },

    /**
     {
         "icon": "user:chip",
         "name": "\金\币",
         "count": 2000,
         "iconPath": "http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t300k_2.png"
     }
     */
    setRewardInfo: function(rewardInfo) {
        this.rewardType = 'coin';
        if(rewardInfo.icon == 'user:chip') {
            this.rewardType = 'coin';
            this.setRewardDes('coin', rewardInfo.count);
            ddz.Share.shareKeywordReplace.arenaWinRewardChip = rewardInfo.count;
        } else if(rewardInfo.icon = 'user:coupon'){
            this.rewardType = 'coupon';
            this.setRewardDes('coupon', (rewardInfo.count/100) + '元');
            ddz.Share.shareKeywordReplace.arenaWinRewardMoney = rewardInfo.count/100;
        }
        this.setRewardSpr(this.rewardType, rewardInfo.iconPath);
    },

    /**
     * 设置玩家名称
     * @param val
     */
    setRewardDes : function (type, num) {
        if(type == 'coin') {
            this.rewardDes.string = "<img src='ddz_coin_white' height=30 width=30/><color=#ffffff> " + num + "</color>";
        } else {
            this.rewardDes.string = "<color=#ffffff>" + num + "</color>";
        }
    },

    setRewardSpr : function(type, url) {
        var spritePic = '';
        var self = this;
        if(type == 'coin') {
            spritePic = 'ddz_mall_coin_icon_mall';
            cc.loader.loadRes("table/ddz_mall", cc.SpriteAtlas, function (err, atlas) {
                var frame = atlas.getSpriteFrame(spritePic);
                self.rewardSpr.spriteFrame = frame;
            });
        } else if(type == 'coupon') {
            spritePic = 'ddz_mall_redpackage_icon_mall';
            cc.loader.loadRes("table/ddz_mall", cc.SpriteAtlas, function (err, atlas) {
                var frame = atlas.getSpriteFrame(spritePic);
                self.rewardSpr.spriteFrame = frame;
            });
        } else if(url) {
            ty.SystemInfo.getImageWithURL(url,this.rewardSpr);
        }
    }
});
