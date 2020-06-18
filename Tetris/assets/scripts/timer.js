// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        timerLabel: cc.Label,
        endManager: cc.Node,
		gameScript:{
            type:require('Game'),
            default:null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //this.__startTimer();
    },
	click(){
	  this.__startTimer();
	},

    // update (dt) {},

    stopTimer() {
        this.unschedule(this.__timerCallback);
    },

    __startTimer() {
        this.count = 20;
        this.schedule(this.__timerCallback, 1);
    },

    __timerCallback() {
		let score=this.gameScript.score;
        if (this.count <= 0) {
			console.log("jinru ");
            this.unschedule(this.callback);
            if(score <= 2){
                this.endManager.getComponent('end-manager').showLose();
				console.log("jinru 1");
            }else{
                this.endManager.getComponent('end-manager').showWin();
            }
			this.gameScript.lose();
			//停止所有播放的音乐
			cc.audioEngine.pauseAll();
            return;
        }

        this.count--;
        this.timerLabel.string = "00:" + this.__prefixZero(this.count, 2);
    },

    __prefixZero(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }
});
