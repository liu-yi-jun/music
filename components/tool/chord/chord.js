// components/tool/chord/chord.js
let app = getApp()
const guitarK = ["Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", ]
const guitarS = [
  'madd9',
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

]
const ukeleleK = [
  'Bb',
  'B',
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

];
const ukeleleS = [
  'madd9',
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

];

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    excludeHeight: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    switchbtn: 'guitar',
    key: 'C',
    suffixe: 'major',
    chordUrls: [],
    keys: guitarK,
    suffixs: guitarS,
    // translateX: 0,
    // transition: 'none',
    keyObj: {
      translateX: 0,
      index: 0,
      current: 0,
      width: 0
    },
    suffixObj: {
      translateX: 0,
      index: 0,
      current: 0,
      width: 0
    },
    show: false
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    created: function () {
      this.getsvg()
    },
    ready() {
    
        var query = this.createSelectorQuery()
        query.select('#swiper-item-key').boundingClientRect(rect => {
          console.log(rect.width);
          this.setData({
            'keyObj.width': rect.width
          })
        }).exec();
        query.select('#swiper-item-suffix').boundingClientRect(rect => {
          console.log(rect.width);
          this.setData({
            'suffixObj.width': rect.width
          })
        }).exec();

  

    }
  },
  methods: {
    keyChange(e) {
      console.log(e);
      let keys = this.data.keys
      this.setData({
        'keyObj.current': e.detail.current,
        'keyObj.index': e.detail.current,
        key: keys[(e.detail.current + 2) % keys.length],
      })
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setData({
          show: false
        }, () => this.getsvg())
      }, 1000)
    },
    keyAnimationfinish() {
      this.kIndex = undefined
      this.isSwitchKey = false
    },
    keyTransition(e) {
      if (this.isSwitchKey) return
      let dx = e.detail.dx
      let width = this.data.keyObj.width
      let length = this.data.keys.length
      let num = parseInt(dx / width);
      if (this.kIndex === undefined) {
        this.kIndex = this.data.keyObj.index
      }
      if (dx >= 0) {
        ((dx % width) > (width / 2)) ? num++ : num
      } else {
        (Math.abs(dx % width) > (width / 2)) ? num-- : num
      }
      if (this.kIndex + num >= 0) {
        num = (this.kIndex + num) % length
      } else {
        num = length + this.kIndex + num
      }
      this.setData({
        'keyObj.index': num
      })
    },
    suffixChange(e) {
      console.log(e.detail.current);
      let suffixs = this.data.suffixs
      this.setData({
        'suffixObj.current': e.detail.current,
        'suffixObj.index': e.detail.current,
        suffixe: suffixs[(e.detail.current + 1) % suffixs.length]
      })
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setData({
          show: false
        }, () => this.getsvg())
      }, 1000)
    },
    suffixAnimationfinish() {
      this.sIndex = undefined
      this.isSwitchSuffix = false
    },
    suffixTransition(e) {
      if (this.isSwitchSuffix) return
      let dx = e.detail.dx
      let width = this.data.suffixObj.width
      let length = this.data.suffixs.length
      let num = parseInt(dx / width);
      if (this.sIndex === undefined) {
        this.sIndex = this.data.suffixObj.index
      }
      if (dx >= 0) {
        ((dx % width) > (width / 2)) ? num++ : num
      } else {
        (Math.abs(dx % width) > (width / 2)) ? num-- : num
      }
      if (this.sIndex + num >= 0) {
        num = (this.sIndex + num) % length
      } else {
        num = length + this.sIndex + num
      }
      console.log(num, 444444444);
      this.setData({
        'suffixObj.index': num
      })
    },

    switchbtn(e) {
      let switchbtn = e.currentTarget.dataset.switchbtn
      if (this.data.switchbtn === switchbtn) {
        return
      }
      this.isSwitchKey = true
      this.isSwitchSuffix = true
      this.setData({
        switchbtn,
        key: 'D',
        suffixe: 'minor',
        keys: switchbtn === 'guitar' ? guitarK : ukeleleK,
        suffixs: switchbtn === 'guitar' ? guitarS : ukeleleS,
        keyObj: {
          translateX: 0,
          index: 0,
          current: 0,
          width: this.data.keyObj.width
        },
        show: false,
        suffixObj: {
          translateX: 0,
          index: 0,
          current: 0,
          width: this.data.suffixObj.width
        }
      }, () => this.getsvg())
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
          chordUrls: res.chordUrls,
          show: true
        })
      })
    },
    touchstart(e) {
      let obj, objName = e.currentTarget.dataset.objname
      console.log('objName', objName)
      if (objName === 'keyObj') {
        obj = this.data.keyObj
      } else if (objName === 'suffixObj') {
        obj = this.data.suffixObj
      }
      obj.sY = e.changedTouches[0].clientY
      obj.sX = e.changedTouches[0].clientX
      console.log('9999999999999999999', this.data[objName].translateX)
      obj.nX = this.data[objName].translateX
      console.log('touchstart', objName)
      obj.sTime = new Date().getTime()
      obj.lastX = obj.sX
      obj.canStart = false
      obj.canMove = false;
      obj.stopInertiaMove = true;

    },
    touchmove(e) {
      let obj, objName = e.currentTarget.dataset.objname
      console.log('touchmove', objName)
      if (objName === 'keyObj') {
        obj = this.data.keyObj
      } else if (objName === 'suffixObj') {
        obj = this.data.suffixObj
      }
      obj.mTime = new Date().getTime();
      obj.mY = e.changedTouches[0].clientY
      obj.mX = e.changedTouches[0].clientX
      let drt = this.GetSlideDirection(obj.sX, obj.sY, obj.mX, obj.mY);
      if (drt == 3 || drt == 4) {
        //console.log("条件允许移动")
        obj.canMove = true;
        obj.canEnd = true
        obj.stopInertiaMove = true;
      }
      if (obj.canMove) {
        let translateX = `${objName}.translateX`
        let transition = `${objName}.transition`
        this.setData({
          [translateX]: obj.nX - (obj.sX - obj.mX),
          [transition]: 'none'
        })
      }
      if (obj.mTime - obj.sTime > 300) {
        console.log("移动后加速")
        obj.sTime = obj.mTime;
        obj.lastX = obj.mX;
      }
    },
    touchend(e) {
      let obj, objName = e.currentTarget.dataset.objname
      console.log('touchend', objName)
      if (objName === 'keyObj') {
        obj = this.data.keyObj
      } else if (objName === 'suffixObj') {
        obj = this.data.suffixObj
      }
      obj.eY = e.changedTouches[0].clientY
      obj.eX = e.changedTouches[0].clientX
      obj.maxX = (112 / 2) * 2;
      obj.minX = -(this.data.keys.length - 3) * (112 / 2);
      if (obj.canEnd) {
        obj.canMove = false;
        obj.canEnd = false;
        obj.canStart = true;
        obj.nX = obj.nX - (obj.sX - obj.mX);
        obj.nowX = obj.eX;
        let translateX = `${objName}.translateX`
        let transition = `${objName}.transition`
        if (obj.nX > obj.maxX) {
          this.setData({
            [translateX]: obj.maxX,
            [transition]: 'all .5s'
          })
        } else if (obj.nX < obj.minX) {
          this.setData({
            [translateX]: obj.minX,
            [transition]: 'all .5s'
          })
        } else {
          obj.eTime = new Date().getTime();
          var speed = ((obj.nowX - obj.lastX) / (obj.eTime - obj.sTime))
          obj.stopInertiaMove = false;
          //惯性滚动函数
          console.log('222222222', speed, obj.eTime, obj.nX, objName)
          this.test(speed, obj.eTime, obj.nX, objName)
        }
      }
    },
    test(v, startTime, contentX, objName) {
      let obj
      if (objName === 'keyObj') {
        obj = this.data.keyObj
      } else if (objName === 'suffixObj') {
        obj = this.data.suffixObj
      }
      var dir = v > 0 ? -1 : 1;
      //加速度方向
      var deceleration = dir * 0.003; //0.001 为减速时间
      console.log("移动方向", dir);
      console.log("减速率", deceleration);

      function inertiaMove() {
        if (obj.stopInertiaMove)
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
          let translateX = `${objName}.translateX`
          let transition = `${objName}.transition`
          if (obj.moveCx > obj.maxX) {
            this.setData({
              [transition]: 'all .5s',
              [translateX]: obj.maxX
            })
          } else if (obj.moveCx < obj.minX) {
            this.setData({
              [transition]: 'all .5s',
              [translateX]: obj.minX
            })
          } else {
            var MC = Math.round(obj.moveCx / (112 / 2))
            //		console.log(MC)
            if (MC > 2) {
              //			console.log("大于长度")
              MC = 2
            } else if (MC < -(this.data.keys.length - 1) + 2) {
              //			console.log("小于长度+显示个数")
              MC = -(this.data.keys.length - 1) + 2
            }
            this.setData({
              [transition]: 'all .4s',
              [translateX]: (112 / 2) * MC
            })
          }
          return
        }
        obj.moveCx = (contentX + moveX)
        if (obj.moveCx > (obj.maxX + ((112 / 2) * 2))) {
          this.setData({
            [transition]: 'all .5s',
            [translateX]: obj.maxX
          })
          return
        } else if (obj.moveCx < (obj.minX - ((112 / 2) * 2))) {
          this.setData({
            [transition]: 'all .5s',
            [translateX]: obj.minX
          })
          return
        }
        this.setData({
          translateX: obj.moveCx
        })
        var timers = setTimeout(inertiaMove.bind(this), 10);
      }
      inertiaMove.call(this)

    },
    keyLeft() {
      let current = this.data.keyObj.current - 1
      if(current<0){
        current = current + this.data.keys.length
      }
      this.isSwitchKey = true
      this.keyChange({detail:{current}})
    },
    keyRight() {
      let current = (this.data.keyObj.current + 1) % this.data.keys.length
      this.isSwitchKey = true
      this.keyChange({detail:{current}})
    },
    suffixeLeft() {
      let current = this.data.suffixObj.current - 1
      if(current<0){
        current = current + this.data.suffixs.length
      }
      this.isSwitchSuffix = true
      this.suffixChange({detail:{current}})
    },

    suffixeRight() {
      let current = (this.data.suffixObj.current + 1) % this.data.suffixs.length
      this.isSwitchSuffix = true
      this.suffixChange({detail:{current}})
    }
  }
})