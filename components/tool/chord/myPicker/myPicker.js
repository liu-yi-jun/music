// components/tool/chord/myPicker/myPicker.js
var sX = null,
  sY = null,
  mX = null,
  mY = null,
  eX = null,
  eY = null,
  sTime = null,
  eTime = null,
  mTime = null,
  nTime = null, //开始时间，结束时间，移动时的时间，开始到现在花费的时间
  nY = 0,
  drt = null,
  nowElm = null, //现在的Y位置。方向，当前元素
  canStart = true,
  canMove = false,
  canEnd = false, //移动事件条件。。
  emlLang = null, //子元素长度
  maxY = null,
  minY = null, //最大距离和最小距离
  lastY = null,
  nowY = null,
  moveY = null,
  stopInertiaMove = false, //是否停止惯性滚
  SE = null,
  ME = null,
  EE = null,
  moveCy = 0;
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
    translateY: 64,
    transition: 'none'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    moveStart(e) {
      // if (!canStart) {
      //   return
      // }
      console.log(e);
      SE = e.changedTouches[0]
      sX = SE.pageX;
      sY = SE.pageY;
      emlLang = 24
      lastY = sY;
      nY = this.data.translateY
      console.log("移动开始时", e);
      sTime = new Date().getTime();
      // if (!canMove && canEnd) {
      //   return false
      // }
      canStart = false
      canMove = false;
      stopInertiaMove = true;
      // $(window).on("touchmove", function (e) {
      //   if (stopInertiaMove) {
      //     e.preventDefault();
      //   }
      // })

    },
    moveing(e) {
      ME = e.changedTouches[0]
      mTime = new Date().getTime();
      mX = ME.pageX;
      mY = ME.pageY;
      drt = this.GetSlideDirection(sX, sY, mX, mY);
      if ((drt == 1 || drt == 2) && !canStart) {
        //console.log("条件允许移动")
        canMove = true;
        canEnd = true;
        stopInertiaMove = true;
      }
      if (canMove) {
        this.setData({
          translateY: -(nY - (mY - sY))
        })
      }
      if (mTime - sTime > 300) {
        console.log("移动后加速")
        sTime = mTime;
        lastY = mY;
      }
    },
    moveEnd(e) {
      let that = this
      EE = e.changedTouches[0]
      eX = EE.pageX;
      eY = EE.pageY;
      let sjObjOptH = 32
      maxY = sjObjOptH * 2;
      minY = -(emlLang - 3) * sjObjOptH;
      if (canEnd) {
        canMove = false;
        canEnd = false;
        canStart = true;
        nY = -(nY - (mY - sY));
        nowY = eY;
        if (nY > maxY) {
          that.setData({
            transition: "all .5s",
            translateY: maxY
          })
        } else if (nY < minY) {
          that.setData({
            transition: "all .5s",
            translateY: minY
          })
        } else {
          eTime = new Date().getTime();
          var speed = ((nowY - lastY) / (eTime - sTime));
          stopInertiaMove = false;
          //惯性滚动函数
        
          (function (v, startTime, contentY) {
            var dir = v > 0 ? -1 : 1;
            //加速度方向
            var deceleration = dir * 0.001; //0.001 为减速时间
            //console.log("移动方向",dir);
            //console.log("减速率",deceleration);
            function inertiaMove() {
              if (stopInertiaMove)
                return;
              var nowTime = new Date().getTime();
              var t = nowTime - startTime;
              var nowV = v + t * deceleration;
              //console.log("当期速度",nowV);
              var moveY = (v + nowV) / 2 * t;
              //console.log("当期移动距离",(contentY+moveY));
              //console.log("当期停止条件",dir * nowV,dir,nowV);
              if (dir * nowV > 0) { //大于0是减速停止
                //	console.log("移动结束，总距离",moveCy)
                //	console.log("移动结束，总距离除以高度",(moveCy/sjObjOptH))
                //	console.log("移动结束，总距离%高度",moveCy%sjObjOptH)
                if (moveCy > maxY) {
                  that.setData({
                    transition: "all .5s",
                    translateY: maxY
                  })
                } else if (moveCy < minY) {
                  that.setData({
                    transition: "all .5s",
                    translateY: minY
                  })
                } else {
                  var MC = Math.round(moveCy / sjObjOptH)
                  //		console.log(MC)
                  if (MC > 2) {
                    //			console.log("大于长度")
                    MC = 2
                  } else if (MC < -(emlLang - 1) + 2) {
                    //			console.log("小于长度+显示个数")
                    MC = -(emlLang - 1) + 2
                  }
                  that.setData({
                    transition: "all .4s",
                    translateY: sjObjOptH * MC
                  })
                }
                return
              }
              moveCy = (contentY + moveY)
              if (moveCy > (maxY + (sjObjOptH * 2))) {
                that.setData({
                  transition: "all .5s",
                  translateY: maxY
                })
                return
              } else if (moveCy < (minY - (sjObjOptH * 2))) {
                that.setData({
                  transition: "all .5s",
                  translateY: minY
                })
                return
              }
              that.setData({
                translateY: moveCy
              })
              var timers = setTimeout(inertiaMove, 10);
            }
            inertiaMove();
          })(speed, eTime, nY);
        }
        console.log("移动结束")
      }
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