const app = getApp()
// 获取除去导航栏的剩余高度
function navExcludeHeight(that) {
  const {
    navBarExtendHeight,
    navBarHeight,
    screenHeight
  } = app.globalSystemInfo
  that.setData({
    excludeHeight: (screenHeight - navBarHeight - navBarExtendHeight)
  })
}
// 将逆地址解析
// @location  {latitude, longitude} 或 'latitude,longitude' 
// 返回 {
//   location '位置经纬度'
//   address '位置地址名'
//   mks '附近地点信息'
// }
function reverseGeocoder(location) {
  return new Promise((resolve, reject) => {
    app.wxMap.reverseGeocoder({
      location,
      //是否返回周边POI列表：1.返回；0不返回
      get_poi: 1,
      success: res => {
        let mks = []
        const {
          location,
          address,
          pois
        } = res.result
        for (var i = 0; i < pois.length; i++) {
          mks.push({
            title: pois[i].title,
            id: pois[i].id,
            latitude: pois[i].location.lat,
            longitude: pois[i].location.lng,
          })
        }
        let result = {
          location,
          address,
          mks
        }
        resolve(result)
      },
      fail: err => {
        reject(err)
      }
    })
  })



}

//首先定义一下，全局变量
var lastTime = 0; //此变量用来记录上次摇动的时间
var x = 0,
  y = 0,
  z = 0,
  lastX = 0,
  lastY = 0,
  lastZ = 0; //此组变量分别记录对应 x、y、z 三轴的数值和上次的数值
var shakeSpeed = 110; //设置阈值
// 加速度数据事件（摇一摇）回调
function shake(callBack) {
  console.log(1)
  wx.onAccelerometerChange(acceleration => {
    var nowTime = new Date().getTime(); //记录当前时间
    console.log(nowTime, lastTime)
    //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
    if (nowTime - lastTime > 100) {
      var diffTime = nowTime - lastTime; //记录时间段
      lastTime = nowTime; //记录本次摇动时间，为下次计算摇动时间做准备
      x = acceleration.x; //获取 x 轴数值，x 轴为垂直于北轴，向东为正
      y = acceleration.y; //获取 y 轴数值，y 轴向正北为正
      z = acceleration.z; //获取 z 轴数值，z 轴垂直于地面，向上为正
      //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
      var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
      if (speed > shakeSpeed) { //如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
        // wx.stopAccelerometer()
        wx.showLoading({
          title: '刷新中...'
        })
        callBack()
      }
      lastX = x; //赋值，为下一次计算做准备
      lastY = y; //赋值，为下一次计算做准备
      lastZ = z; //赋值，为下一次计算做准备
    }
  })

}

// 生成随机数
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 对数组拆分
// array 要拆分的数组
// oneDimensionalNumber 以每组多少个拆分
// groupNumber 以多少组拆分
function arraySplit(array, oneDimensionalNumber, groupNumber) {
  let newArray = []
  if (groupNumber) {
    oneDimensionalNumber = Math.floor(array.length / groupNumber)
    if (!oneDimensionalNumber) {
      array.forEach((item, index) => {
        newArray[index] = [item]
      })
      return newArray
    }
  }
  array.forEach((item, index) => {
    const group = Math.floor(index / oneDimensionalNumber)
    if (groupNumber === group) {
      newArray[0].push(item)
      return newArray
    }
    if (!newArray[group]) {
      newArray[group] = []
    }
    newArray[group].push(item)
  })
  return newArray
}

function reduction(array) {
  let newArr = []
  array.forEach((item, index) => {
    if (item.length) {
      item.forEach((item, index) => {
        newArr.push(item)
      })
    } else {
      newArr.push(item)
    }
  })
  return newArr
}
// JS字符串长度判断,超出进行自动截取(支持中文)
function cutstr(str, len) {
  if (!str) return str
  var str_length = 0;
  var str_len = 0;
  var str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4 
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串； 
  if (str_length <= len) {
    return str;
  }
}

// 判断中英文长度
function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1 
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

function getDateDiff(dateTimeStamp) {
  if (typeof dateTimeStamp === "string") {
    return dateTimeStamp
  }
  var result = ''
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

function GetSlideDirection(startX, startY, endX, endY) { //判读手指滑动方向
  var dy = startY - endY;
  var dx = endX - startX;
  var result = 0;
  //如果滑动距离太短
  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
    return result;
  }
  var angle = GetSlideAngle(dx, dy);
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
}

function GetSlideAngle(dx, dy) { //判断角度
  return Math.atan2(dy, dx) * 180 / Math.PI;
}

function add0(m) {
  return m < 10 ? '0' + m : m
}

function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  // var h = time.getHours();
  // var mm = time.getMinutes();
  // var s = time.getSeconds();
  // return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
  return y + '-' + add0(m) + '-' + add0(d);
}
module.exports = {
  navExcludeHeight: navExcludeHeight,
  reverseGeocoder: reverseGeocoder,
  shake: shake,
  randomNumber: randomNumber,
  arraySplit: arraySplit,
  cutstr: cutstr,
  getDateDiff: getDateDiff,
  reduction: reduction,
  GetSlideDirection: GetSlideDirection,
  format: format,
  strlen:strlen
}