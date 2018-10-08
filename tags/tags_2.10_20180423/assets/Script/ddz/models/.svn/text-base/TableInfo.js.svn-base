// Create by Zhanghaibin on 14-03-05

// 一个桌子的基本信息，游戏开始时候初始化，在整个牌局中保持不变。
//牌局中变化的信息在table_state中
ddz._TableInfo = cc.Class({

    ctor:function(){

        // 配置信息
        this.config = {
            m_mincoin:0,        // 最小金币携带数
            m_maxseat:0,        // 桌子最多人数，仅在比赛场有效，标记4、5、6人桌。
            m_sfee:0,           // 抽水
            m_base:0,           // 基数
            m_maxcoin:0,        // 最大金币携带数
            m_coin2chip:0,      // 金币筹码兑换比例
            m_optime:0,         // 超时时间
            m_grab:1,           // 抢地主或者是叫地主玩法, 默认为1，即欢乐抢地主玩法
            m_basemulti:0,      // 基本(初始)倍数
            m_roommulti:1,      // 房间倍数
            m_untiCheat:0,      // 是否防作弊桌(0是no，1是yes)
            m_autoChange:0,     // 是否自动换桌(0是no，1是yes)
            m_passtime:0,       // 管不上的时间
            m_tbbox:0,          // 是否有宝箱(0是no，1是yes)
            m_isMingPai:0,      // 是否有明牌功能
            m_optimedis:"",
            m_maxMulti:0
        };
        // 投诉信息
        this.complain = {
           m_nComplainFee:-1,           // 投诉所需要的费用
           m_nComplainCompensation:-1,  // 投诉补偿金
           m_strComplainGameNum:""      // 局号
        };

        // 基本信息
        //谁在哪个房间哪个桌子
        this.normal = {
            m_tableId:0,            // 桌子id
            m_roomId:0,            // 桌子所属的房间号
            m_name:"",          // 名字
            m_pwd:""            // 密码
        };

        this.ftInfo = null;

        //配置信息
        this.smiliesConf = null;
        this.mCardNote= null;

        //比赛场信息
        this.isMatch = 0;
        this.matchNote = null;
        this.m_customTableId = 0;
        this.nameList = [];
        this.disbind = null;
        hall.LOGD(null, "in ctor new ddz.TableInfo");
    },

    /**
     * 获取当前的场景类型
     * @returns {number}
     */
    getSceneType:function () {
        if (this.isMatch){
            return ddz.Enums.SceneType.MATCH;
        }else if (this.ftInfo){
            return ddz.Enums.SceneType.FRIEND;
        }
        return ddz.Enums.SceneType.NORMAL;
    },

    //提供几个接口函数
    roomId: function() {
        return this.normal.m_roomId;
    },
    tableId: function() {
        return this.normal.m_tableId;
    },
    getConfig: function(tag) {
        return this.config[tag];
    },
    //默认的析构函数
    destroy:function(){
        this.config = null;
        this.complain = null;
        this.normal = null;
        this.mCardNote = null;
        this.nameList = [];
        this.disbind = null;
        if (this.ftInfo){
            this.ftInfo.cleanup();
            this.ftInfo = null;
        }
        hall.LOGD(null, "destroy in ddz.TableInfo");
    },

    // 转化配置信息
    parseConfigInfo:function(json){
        var config = this.config;
        config.m_mincoin = json["mincoin"];
        config.m_maxseat = json["maxseat"];
        config.m_maxMulti = json["maxMulti"];
        config.m_sfee = json["sfee"];
        config.m_base = json["base"];
        config.m_maxcoin = json["maxcoin"];
        config.m_coin2chip = json["coin2chip"];
        config.m_optime = json["optime"];
        config.m_grab = json["grab"];
        config.m_basemulti = json["basemulti"];
        config.m_roommulti = json["roommulti"];
        config.m_untiCheat = json["untiCheat"];
        config.m_autoChange = json["autoChange"];
        config.m_passtime = json["passtime"];
        config.m_tbbox = json["tbbox"];
        config.m_isMingPai = json["isMingPai"];
        config.m_optimedis = json["optimedis"];
        
        if(2 >= config.m_passtime){
            config.m_passtime = 5;
        }
    },

    // 转化基本信息
    parseNormalInfo:function(info){
        var normal = this.normal;
        normal.m_tableId = info["tableId"];
        normal.m_roomId = info["roomId"];
        normal.m_name = info["name"];
        normal.m_pwd = info["pwd"];


        hall.LOGD(null, "parseNormalInfo in ddz.TableInfo");
    },

    //转化json数据
    parseTableInfo:function(json){
        if(json.hasOwnProperty('info')){
            hall.LOGD(null, 'parseNormalInfo...');
            this.parseNormalInfo(json["info"]);
        }

        this.isMatch = json["isMatch"];

        if(json.hasOwnProperty('config')){
            hall.LOGD(null, 'parseConfigInfo...');
            this.parseConfigInfo(json["config"]);
        }

        var customTableId = json["customTableId"];

        if(json.hasOwnProperty('customTableId')) {
            this.m_customTableId = customTableId;
        }

        this.smiliesConf = json["smiliesConf"];

        if(json.hasOwnProperty('cardNote')){
            this.mCardNote = json["cardNote"];
        }

        if (json.hasOwnProperty('ftInfo')){
            if (!this.ftInfo){
                this.ftInfo = new ddz.FtInfo();
            }
            this.ftInfo.parseTableInfo(json)
        }
        if(json.hasOwnProperty('seat1')){
            this.nameList = [json["seat1"].name,json["seat2"].name,json["seat3"].name];
        }
        if(json.hasOwnProperty('disbind')){
            this.disbind = json.disbind;
        }
    },

    parseComplain : function(result) {
        var complain = this.complain;
        var gamenum = result["gameNum"];
        if(gamenum) {
            complain.m_strComplainGameNum = gamenum;
        }
        var com = result["complain"];
        if(com){
            complain.m_nComplainFee = com["fee"] || -1;
            complain.m_nComplainCompensation = com["compensation"] || -1;
        }
    },

    //重置
    Reset:function(){
        var config = this.config;
        config.m_base = 0;
        config.m_grab = 0;
        config.m_roommulti = 1;
        config.m_untiCheat = 0;
        config.m_tbbox = 0;
        config.m_isMingPai = 0;
        this.matchNote = null;
        this.isMatch = 0;
    }
});