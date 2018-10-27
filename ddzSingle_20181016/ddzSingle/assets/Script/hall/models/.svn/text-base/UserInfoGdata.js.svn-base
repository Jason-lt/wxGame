//  userInfo中的gdata信息

hall.UserInfoGdata = cc.Class({

    ctor: function() {
        this._TAG = "hall.UserInfoGdata";
        this.m_matchscores = 0;
        this.m_marsscore = 0;
        this.m_lastlogin =  0; // 上次登录时间,距离2012-5-1的天数
        this.m_gold =  0; // 金花
        this.m_level =  0; // 用户级别
        this.m_title =  ""; //称号
        this.m_chip =  0; // 筹码(更正:单品游戏金币.by FK)
        this.m_nextexp =  0; //到下一级的经验
        this.m_maxwinchip = 0;
        this.m_maxweekdoubles = 0;
        this.m_oboxtimes = 0;
        this.m_referrerSwitch =  1; // 推荐人功能开关，1 开启；0 未开启
        this.m_robotloc = "";
        this.m_winrate =  {}; // 胜率：｛pt总局数， wt胜利数｝
        this.m_exp = 0;
        this.m_slams = 0;
        this.m_losechips = 0;
        this.m_winchips =  0; //历史赢取最大金币数
        this.m_canSetReferrer =  false; // 是否还能设置推荐人 true可以；false不可以
        this.m_nslogin =  0; //连续登录天数
        this.m_experience=[];
        this.m_loginsum = -1;// 登陆的次数。第一次登陆(即新手)是1,大于1则判定为老手
        this.m_charm = 0; //魅力值
        this.m_dashifen = null; // 大厅版斗地主的大师分信息,存储在hallGData中
        this.m_skillScoreInfo = null;// 牌桌里的座位上的userinfo中的大师分信息
        this.m_starHeadId = -1; // 明星头像ID - 明星斗地主添加
        this.m_winchipstats = [];// 各种游戏所赢的金币数
        this.m_kinstats = []; // 各种王

        hall.LOGD(this._TAG, "in ctor");
    },

    destroy: function() {
        hall.LOGD(this._TAG, "in destroy");
    },

    randomSetStarHeadId:function(sex){
        this.m_starHeadId = Math.floor(Math.random() * 3);
    },

    starHeadId: function(){
        if( this.m_starHeadId < 0 ){
            this.randomSetStarHeadId();
        }
        return this.m_starHeadId;
    },

    parseGdata:function(gdata){
        hall.LOGD(this._TAG, '=======gdata begin========'+JSON.stringify(gdata));

        if(typeof(gdata) != 'undefined'){
            this.m_matchscores = gdata["matchscores"];
            this.m_marsscore = gdata["marsscore"];
            this.m_lastlogin = gdata["lastlogin"];
            this.m_gold = gdata["gold"];
            this.m_level = gdata["level"];
            this.m_title = gdata["title"];
            // this.m_chip = gdata["chip"];
            this.m_nextexp = gdata["nextexp"];
            this.m_maxweekdoubles = gdata["maxweekdoubles"];
            this.m_maxwinchip = gdata["maxwinchip"];
            this.m_oboxtimes = gdata["oboxtimes"];
            this.m_referrerSwitch = gdata["referrerSwitch"];
            this.m_robotloc = gdata["robotloc"];
            this.m_exp = gdata["exp"];
            this.m_slams = gdata["slams"];
            this.m_losechips = gdata["losechips"];
            this.m_winchips = gdata["winchips"];
            this.m_canSetReferrer = gdata["canSetReferrer"];
            this.m_nslogin = gdata["nslogin"];
            this.m_loginsum = gdata["loginsum"];
            this.m_charm = gdata["charm"];

            this.m_winchipstats = gdata["winchip_stats"];
            this.m_kinstats = gdata["king_stats"];
            
            if(typeof(gdata["winrate"]) != 'undefined'){
                var winrateObj = JSON.parse(gdata["winrate"]);
                for(var j in winrateObj){
                    if(typeof(winrateObj[j]) != 'undefined'){
                        this.m_winrate[j] = winrateObj[j]
                    }
                }
            }
            if(typeof(gdata["dashifen"]) != 'undefined'){
                this.m_dashifen = null;
                this.m_dashifen = gdata["dashifen"];
            }
        }

        if( this.m_starHeadId == -1 ){
            this.randomSetStarHeadId(0);
        }
        hall.LOGD(this._TAG, '=======gdata end========');
    }
});