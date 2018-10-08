// player_info_node.js
// created by wangjunpeng 15.12.05


ddz.PlayInfoNode = cc.Class({
    /**
     *
     * @param isLeft
     * @param seatInfo
     * @param parentNode
     */
    ctor: function() {

        var isLeft = arguments[0];
        var seatInfo = arguments[1];
        var parentNode = arguments[2];

        this._isLeft = isLeft;
        this._bg = null;
        this._avatar = null;

        this._isTenOn = true;

        this._btn = null;

        this._parentNode = parentNode;
        this._totalLab = null;
        this._winChanceLab = null;
        this._bombChanceLab = null;
        this._dizhuChanceLab = null;
        this._table = null;
        this._nameLab = null;
        this._info = []; //

        var winSize = cc.winSize;
        var w = winSize.width;
        var h = winSize.height;

        this.bgSize = cc.size(472, 364);
        this.tabSize = cc.size(430, 138);

        this._cellSize = cc.size(105, 148);

        this._seatInfo = seatInfo;

        if (h5.playScene.isErdou()) {
            this.BGPOS = cc.p(w * 0.4, h * 0.62);
        } else {
            this.BGPOS = isLeft ? cc.p(w * 0.38, h * 0.72) : cc.p(w * 0.62, h * 0.72);
        }

        this._swallowTouch = true;
        this.init();


    },
    init: function() {
        var bg = this._bg = cc.Scale9Sprite.createWithSpriteFrameName("hall_charge_back.png", cc.rect(25, 25, 56, 55));
        bg.setContentSize(this.bgSize);
        this.addChild(bg);
        bg.setPosition(this.BGPOS);

        var bw = this.bgSize.width;
        var bh = this.bgSize.height;

        var underBg = new cc.Sprite("#info_table_panel_bg.png");
        underBg.setPosition(bw / 2, 114);
        bg.addChild(underBg);


        var btn = this._btn = new cc.Sprite("#info_check.png");
        btn.setPosition(75, 21);
        underBg.addChild(btn);

        h5.globalFunc.addTouchToNode(btn, this.onBtnClick, this);



        var config = this._parentNode._tableInfo.smiliesConf;
        var info = this._info;

        var cbomb = config["bomb"];
        if (cbomb) {
            info.push({
                "name": "bomb",
                "pic": "info_n_send_3.png",
                "price": cbomb["price"]
            });
        }

        var cegg = config["egg"];
        if (cegg) {
            info.push({
                "name": "egg",
                "pic": "info_n_send_2.png",
                "price": cegg["price"]
            });
        }

        var cdiamond = config["diamond"];
        if (cdiamond) {
            info.push({
                "name": "diamond",
                "pic": "info_n_send_1.png",
                "price": cdiamond["price"]
            });
        }

        var cflower = config["flower"];
        if (cflower) {
            info.push({
                "name": "flower",
                "pic": "info_n_send_0.png",
                "price": cflower["price"]
            });
        }

        this.initTitle(bw, bh, bg);

        // var bgLayer = new cc.LayerColor(cc.color(0, 255, 0, 155), this.tabSize.width, this.tabSize.height);
        // bgLayer.ignoreAnchorPointForPosition(true);
        // bgLayer.setAnchorPoint(0, 0);
        // bgLayer.setPosition(cc.p(24 , 66));
        // bg.addChild(bgLayer);


        var table = this._table = new cc.TableView(this, this.tabSize);
        table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        table.setPosition(24, 66);
        table.setDelegate(this);
        bg.addChild(table);

        this._touchEndCall = function(touch, event) {
            var pos = touch.getLocation();
            var rect = bg.getBoundingBox();
            if (!cc.rectContainsPoint(rect, pos)) {
                this.removeFromParent();
            }
        }
    },

    onBtnClick: function() {
        this._btn.setVisible(!this._isTenOn);
        this._isTenOn = !this._isTenOn;
    },
    getTen:function () {
        return this._isTenOn;
    },

    initTitle: function(bw, bh, bg) {
        var seatInfo = this._seatInfo;
        var userInfo = seatInfo.model.user_info;
        var udata = userInfo.udataInfo;
        var gamedata = seatInfo.model.m_ownroom_data;


        var avatar = this._avatar = h5.globalFunc.createAvatarNode(udata.m_purl);
        avatar.setPosition(93, 285);
        bg.addChild(avatar, 2);

        var nameBg = new cc.Sprite("#info_name_bk.png");
        nameBg.setPosition(132, 306);
        nameBg.setAnchorPoint(cc.p(0, 0.5));
        bg.addChild(nameBg);

        var nameLabel = this._nameLab = new cc.LabelTTF(hall.GlobalFuncs.SliceStringToLength(udata.m_name, 10), "Arial", 24);
        nameLabel.setPosition(46, 19);
        nameLabel.setFontFillColor(cc.color(64, 14, 0));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameBg.addChild(nameLabel);



        var chipText = udata.m_chip;
        var coinLab = new cc.LabelTTF("金 币：" + chipText, "Arial", 24);
        coinLab.setFontFillColor(cc.color(64, 14, 0));
        coinLab.setAnchorPoint(cc.p(0, 0.5));
        coinLab.setPosition(181, 266);
        bg.addChild(coinLab);


        var lev = seatInfo.model.m_level || 0; // 6斗地主
        var duanLab = new cc.LabelTTF("段 位：" + lev + "段", "Arial", 24);
        duanLab.setFontFillColor(cc.color(64, 14, 0));
        duanLab.setPosition(181, 236);
        duanLab.setAnchorPoint(cc.p(0, 0.5));
        bg.addChild(duanLab);



        // var data_plays = gamedata["plays"] || 0;
        // var totalLabel = this._totalLab = new cc.LabelTTF("" + data_plays, "Arial", 14);
        // totalLabel.setPosition(bw * 0.523, bh * 0.83);
        // bg.addChild(totalLabel);

        // var data_win = gamedata["wins"] || 0;
        // var winrate = data_plays ? Math.floor(data_win * 100 / data_plays) : 0;
        // var winChanceLabel = this._winChanceLab = new cc.LabelTTF(winrate + "%", "Arial", 14);
        // winChanceLabel.setPosition(bw * 0.86, bh * 0.83);
        // bg.addChild(winChanceLabel);

        // var data_bomb = gamedata["bombs"] || 0;
        // var bombrate = data_plays ? Math.floor(data_bomb * 100 / data_plays) : 0;
        // var bombChanceLabel = this._bombChanceLab = new cc.LabelTTF(bombrate + "%", "Arial", 14);
        // bombChanceLabel.setPosition(bw * 0.523, bh * 0.688);
        // bg.addChild(bombChanceLabel);

        // var data_dizhu = gamedata["lords"] || 0;
        // var dizhurate = data_plays ? Math.floor(data_dizhu * 100 / data_plays) : 0;
        // var dizhuChanceLabel = this._dizhuChanceLab = new cc.LabelTTF(dizhurate + "%", "Arial", 14);
        // dizhuChanceLabel.setPosition(bw * 0.86, bh * 0.688);
        // bg.addChild(dizhuChanceLabel);

        // var reportLabel = new cc.LabelTTF("举报作弊", "Arial", 14);
        // reportLabel.setFontFillColor(cc.color(100, 200, 255));
        // var reportItem = new cc.MenuItemLabel(reportLabel, this._onReportClick, this);
        // var menu = new cc.Menu(reportItem);
        // reportItem.setPosition(bw * 0.85, bh * 0.57);
        // menu.setPosition(0, 0);
        // bg.addChild(menu);

    },
    tableCellAtIndex: function(table, index) {
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new cc.TableViewCell();

            var bg = new cc.Sprite("#info_n_send_bg.png");
            bg.setPosition(this._cellSize.width / 2, this._cellSize.height * 0.66);
            cell.addChild(bg);

            var cellBg = cell.tyicon = new cc.Sprite("#info_n_send_0.png");
            cellBg.setPosition(this._cellSize.width / 2, this._cellSize.height * 0.66);
            cell.addChild(cellBg);

            var coinIcon = new cc.Sprite("#history_coin.png");
            coinIcon.setPosition(30, this._cellSize.height * 0.17);
            cell.addChild(coinIcon);

            var lab = cell.typrice = new cc.LabelTTF("11", "Arial", 18);
            lab.setPosition(this._cellSize.width / 2 + 12, this._cellSize.height * 0.17);
            lab.setFontFillColor(cc.color(172, 23, 0));
            cell.addChild(lab);
        }
        var info = this._info[index];
        hall.GlobalFuncs.ChangeSpriteTexure(cell.tyicon, info["pic"]);
        cell.typrice.setString(info["price"]);
        return cell;
    },
    tableCellTouched: function(table, cell) {
        var index = cell.getIdx();
        var tableinfo = this._parentNode._tableInfo;
        var myindex = this._parentNode._mySeatIndex;
        var is_erdou = h5.playScene.isErdou();
        var toindex;
        if (is_erdou) {
            toindex = ddz.GlobalFuncs.getTopIndex(myindex);
        } else {
            toindex = this._isLeft ? ddz.GlobalFuncs.getPreIndex(myindex) : ddz.GlobalFuncs.GetNextIndex(myindex);
        }
        var info = this._info[index];
        var params = {
            "roomId": tableinfo.roomId(),
            "tableId": tableinfo.tableId(),
            "smilies": info["name"], //"bomb", "flower", "diamond", "egg"
            "toseat": toindex,
            "seatId": myindex,
            "counts": this._isTenOn ? 10 : 1
        };
        ddz.MsgFactory.getTableCall(hall.ME.normalInfo.userId,
            ddz.GameId,
            "smilies",
            hall.AccountInfo.clientId,
            params);
        this.removeFromParent();
    },
    tableCellSizeForIndex: function(table, idx) {
        return this._cellSize;
    },
    numberOfCellsInTableView: function(table) {
        return this._info.length;
    },
    _onReportClick: function() {
        this._parentNode.sendComplain();
        this.removeFromParent();
    }

});