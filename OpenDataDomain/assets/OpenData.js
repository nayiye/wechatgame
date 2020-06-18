// 作者: la_vie_est_belle
// 公众号：All Codes
// 教程地址：https://pyqt5.blog.csdn.net/article/details/104749017

/*该项目仅用于学习，请勿上线任何平台！*/
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,      // item预制
        content: cc.Node,           // content节点
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (typeof wx === 'undefined') {
            return;
        }

        wx.onMessage( data => {
            if (data.message) {
                if (data.message != 'clear') {
                    this.allInfoList = [];                      // 所有玩家的数据保存在这个数组中，用于排序
                    this.getFriendInfo();                       // 获取同城好友信息(当前玩家的信息也会返回)
                }
                else {
                    this.content.removeAllChildren();           // 关闭排行榜时清空节点
                }
            }
        });
    },

    getFriendInfo () {
        // 获取同城好友信息(包括自身)
        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: (res) => {
                for (let i = 0; i < res.data.length; i++) {
                    // 获取玩家微信名，头像url和分数
                    let nickName = res.data[i].nickname;
                    let avatarUrl = res.data[i].avatarUrl;
                    let score = 0;
                    if (res.data[i].KVDataList.length)
                        score = res.data[i].KVDataList[0]['value'];

                    // 加入到数组中
                    this.allInfoList.push({
                        nickName: nickName,
                        avatarUrl: avatarUrl,
                        score: score
                    });
                }

                // 开始排名
                this.makeRanks();
            },

            fail: (res) => {
                console.log(res);
            }
        });
    },

    makeRanks () {
        // 首先将allInfoList内部元素进行排序，根据分数来降序排列
        this.allInfoList.sort((a, b) => {
            return b['score'] - a['score'];
        });
        
        // 根据各个玩家的分数制作排名
        for (let i=0; i<this.allInfoList.length; i++) {
            let nickName = this.allInfoList[i]['nickName'];
            let avatarUrl = this.allInfoList[i]['avatarUrl'];
            let score = this.allInfoList[i]['score'];
            this.createItem(i+1, nickName, avatarUrl, score);
        }
    },

    createItem (rank, nickName, avatarUrl, score) {
        // 生成item
        let item = cc.instantiate(this.itemPrefab);
        
        // 排名
        item.children[0].getComponent(cc.Label).string = String(rank);
        // 微信名
        item.children[4].getComponent(cc.Label).string = nickName;
        // 分数
        item.children[5].getComponent(cc.Label).string = score;
        // 头像
        cc.loader.load({url: avatarUrl, type: 'png'}, (err, texture) => {
            if (err) console.error(err);
            item.children[1].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });

        // 添加到content中
        this.content.addChild(item);
    }
});
