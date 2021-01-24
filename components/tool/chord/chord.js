// components/tool/chord/chord.js
let app = getApp()
const guitarK = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
const guitarS = [
  'major',
  'minor',
  'dim',
  'dim7',
  'sus2',
  'sus4',
  '7sus4',
  'alt',
  'aug',
  '6',
  '69',
  '7',
  '7b5',
  'aug7',
  '9',
  '9b5',
  'aug9',
  '7b9',
  '7#9',
  '11',
  '9#11',
  '13',
  'maj7',
  'maj7b5',
  'maj7#5',
  'maj9',
  'maj11',
  'maj13',
  'm6',
  'm69',
  'm7',
  'm7b5',
  'm9',
  'm11',
  'mmaj7',
  'mmaj7b5',
  'mmaj9',
  'mmaj11',
  'add9',
  'madd9'
]
const ukeleleK = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B'
];
const ukeleleS = [
  'major',
  'minor',
  'dim',
  'dim7',
  'sus2',
  'sus4',
  '7sus4',
  'alt',
  'aug',
  '6',
  '69',
  '7',
  '7b5',
  'aug7',
  '9',
  '9b5',
  'aug9',
  '7b9',
  '7b9#5',
  '7#9',
  '11',
  '9#11',
  '13',
  '13b9',
  '13b5b9',
  'b13b9',
  'b13#9',
  'maj7',
  'maj7b5',
  'maj7#5',
  'maj9',
  'maj11',
  'maj13',
  'm6',
  'm7',
  'm7b5',
  'm9',
  'm69',
  'm9b5',
  'm11',
  'mmaj7',
  'mmaj7b5',
  'mmaj9',
  'mmaj11',
  'add9',
  'madd9'
];

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    switchbtn: 'guitar',
    key: 'F',
    suffixe: '7b9',
    chordUrls: [],
    keys: guitarK,
    suffixs: guitarS,
    translateX: 0,
    transition: 'none',
    moveCx: 0
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    created: function () {
      this.getsvg()
    }
  },
  methods: {
    switchbtn(e) {
      let switchbtn = e.currentTarget.dataset.switchbtn
      if (this.data.switchbtn === switchbtn) {
        return
      }
      this.setData({
        switchbtn
      })
    },
    choosekey(e) {
      let key = e.currentTarget.dataset.key
      this.data.key = key
      this.getsvg()
    },
    choosesuffixe(e) {
      let suffixe = e.currentTarget.dataset.suffixe
      this.data.suffixe = suffixe
      this.getsvg()
    },
    getsvg() {
      let {
        suffixe,
        key,
        switchbtn
      } = this.data
      app.get(app.Api.getGuitar, {
        key,
        suffix: suffixe,
        name: switchbtn
      }, {
        loading: false
      }).then(res => {
        this.setData({
          chordUrls: res.chordUrls
        })
      })
    },
    touchstart(e) {
      this.sY = e.changedTouches[0].clientY
      this.sX = e.changedTouches[0].clientX
      this.nX = this.data.translateX
      this.sTime = new Date().getTime()
      this.lastX = this.sX
      this.canStart = false
      this.canMove = false;
      this.stopInertiaMove = true;
    },
    touchmove(e) {
      this.mTime = new Date().getTime();
      this.mY = e.changedTouches[0].clientY
      this.mX = e.changedTouches[0].clientX
      let drt = this.GetSlideDirection(this.sX, this.sY, this.mX, this.mY);

      if (drt == 3 || drt == 4) {
        //console.log("条件允许移动")
        this.canMove = true;
        this.canEnd = true
        this.stopInertiaMove = true;
      }
      if (this.canMove) {
        this.setData({
          translateX: this.nX - (this.sX - this.mX),
          transition: 'none'
        })
      }
      if (this.mTime - this.sTime > 300) {
        console.log("移动后加速")
        this.sTime = this.mTime;
        this.lastX = this.mX;
      }
    },
    touchend(e) {
      this.eY = e.changedTouches[0].clientY
      this.eX = e.changedTouches[0].clientX
      this.maxX = (112 / 2) * 2;
      this.minX = -(this.data.keys.length - 3) * (112 / 2);
      if (this.canEnd) {
        this.canMove = false;
        this.canEnd = false;
        this.canStart = true;
        this.nX = this.nX - (this.sX - this.mX);
        this.nowX = this.eX;
        if (this.nX > this.maxX) {
          this.setData({
            transition: 'all .5s',
            translateX: this.maxX
          })
        } else if (this.nX < this.minX) {
          this.setData({
            transition: 'all .5s',
            translateX: this.minX
          })
        } else {
          this.eTime = new Date().getTime();
          var speed = ((this.nowX - this.lastX) / (this.eTime - this.sTime))
          this.stopInertiaMove = false;
          //惯性滚动函数
          this.test(speed, this.eTime, this.nX)
        }
      }
    },
    test(v, startTime, contentX) {
      var dir = v > 0 ? -1 : 1;
      //加速度方向
      var deceleration = dir * 0.001; //0.001 为减速时间
      console.log("移动方向", dir);
      console.log("减速率", deceleration);

      function inertiaMove() {
        if (this.stopInertiaMove)
          return;
        var nowTime = new Date().getTime();
        var t = nowTime - startTime;
        var nowV = v + t * deceleration;
        console.log("当期速度", nowV);
        var moveX = (v + nowV) / 2 * t;
        console.log("当期移动距离", (contentX + moveX));
        console.log("当期停止条件", dir * nowV, dir, nowV);
        if (dir * nowV > 0) { //大于0是减速停止
          //	console.log("移动结束，总距离",moveCy)
          //	console.log("移动结束，总距离除以高度",(moveCy/sjObj.opt.height))
          //	console.log("移动结束，总距离%高度",moveCy%sjObj.opt.height)
          if (this.data.moveCx > this.maxX) {
            this.setData({
              transition: 'all .5s',
              translateX: this.maxX
            })
          } else if (this.data.moveCx < this.minX) {
            this.setData({
              transition: 'all .5s',
              translateX: this.minX
            })
          } else {
            var MC = Math.round(this.data.moveCx / (112 / 2))
            //		console.log(MC)
            if (MC > 2) {
              //			console.log("大于长度")
              MC = 2
            } else if (MC < -(this.data.keys.length - 1) + 2) {
              //			console.log("小于长度+显示个数")
              MC = -(this.data.keys.length - 1) + 2
            }
            this.setData({
              transition: 'all .4s',
              translateX: (112 / 2) * MC
            })
          }
          return
        }
        console.log(this.data, this)
        this.data.moveCx = (contentX + moveX)
        if (this.data.moveCx > (this.maxX + ((112 / 2) * 2))) {
          this.setData({
            transition: 'all .5s',
            translateX: this.maxX
          })
          return
        } else if (this.data.moveCx < (this.minX - ((112 / 2) * 2))) {
          this.setData({
            transition: 'all .5s',
            translateX: this.minX
          })
          return
        }
        this.setData({
          translateX: this.data.moveCx
        })
        var timers = setTimeout(inertiaMove.bind(this), 10);
      }
      inertiaMove.call(this)

    },

    GetSlideDirection(startX, startY, endX, endY) { //判读手指滑动方向
      var dy = startY - endY;
      var dx = endX - startX;
      var result = 0;
      //如果滑动距离太短
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result;
      }
      var angle = this.GetSlideAngle(dx, dy);
      if (angle >= -45 && angle < 45) {
        result = 4; //右
      } else if (angle >= 45 && angle < 135) {
        result = 1; //上
      } else if (angle >= -135 && angle < -45) {
        result = 2; //下
      } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3; //左
      }
      return result;
    },
    GetSlideAngle(dx, dy) { //判断角度
      return Math.atan2(dy, dx) * 180 / Math.PI;
    }
  }
})