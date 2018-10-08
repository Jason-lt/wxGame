

// var ddz_getRedPacket = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_getRedPacket);
// var window = ddz_getRedPacket.getComponent('ddz_getRedPacket');
// window.setRedPacketNumber("20.98");
cc.Class({
    extends: cc.Component,

    properties: {
        ddz_redpacket:{
            default : null,
            type : cc.Node
        },
        shareButton : {
            default : null,
            type : cc.Button
        },
        shareLabel : {
            default : null,
            type : cc.Label
        },
        numberString :"",
    },

    setRedPacketNumber:function (numberString,buttonString) {
        this.numberString = numberString+".00";
        var window = this.ddz_redpacket.getComponent('ddz_redPacket');
        window.setRedPacketNumber(this.numberString);
        if(buttonString){
            this.shareLabel.string = buttonString;
        }
        // this.shareButton.node.on("click",this.onShareButton,this);
    },


    onShareButton : function (event) {
        ddz.LOGD(null, "onShareButton");
        // var titleA = ddz.GameWorld.shareMassageList.getRewardPacket;
        // var imageA = ddz.GameWorld.shareImageList.getRewardPacket;
        // ty.TuyooSDK.shareWithTitleArrayAndImageArray(titleA,imageA);
        var tempCavas = wx.createCanvas();
        var context = tempCavas.getContext("2d");
        var image = wx.createImage();
        var imageArray = ddz.GameWorld.shareImageList.getRewardPacketForNumber;
        var imageType = hall.GlobalFuncs.getRandomNumberBefore(imageArray.length);
        // imageType = 0;
        image.src = imageArray[imageType]+'?360';
        var text = this.numberString;
        image.onload = function () {
            context.drawImage(image,0,0);
            if(imageType == 0){
                context.font="40px Arial";
                context.fillStyle="#202020";
                context.textAlign="center";
                context.fillText(text,180,82);
            }else if(imageType = 1){
                context.font="45px Arial";
                context.fillStyle="#ffffff";
                context.textAlign="center";
                var textWidth = context.measureText(text).width;
                context.fillText(text,180,215);
                context.font="15px Arial";
                context.textAlign="left";
                context.fillText("元",180+textWidth/2,215);
            }

            var tempFilePath = tempCavas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: 360,
                height: 288,
                destWidth: 360,
                destHeight: 288
            });
            // ddz.LOGD(null, "tempFilePathtempFilePathtempFilePath==="+tempFilePath);
            var shareType = ty.UserInfo.clickStatShareType.clickStatShareTypeWithDraw;
            ty.TuyooSDK.shareWithTitleArrayAndImageArray(shareType,ddz.GameWorld.shareMassageList.getRewardPacket,[tempFilePath]);
        };
    },

    onLoad :function() {
        this.shareButton.node.on("click",this.onShareButton,this);
        // this.setRedPacketNumber("58.62");
    },
    onDestroy : function () {
        // this.shareButton.node.off("click",this.onShareButton,this);
    }

    // update (dt) {},
});