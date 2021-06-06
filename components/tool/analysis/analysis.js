// components/tool/analysis/analysis.js
// 1	2	3	4	5	6	7	8	9	10	11	12	

const common = require("../../../assets/tool/common");
const authorize = require("../../../assets/tool/authorize")

// C	C#	D	Eb	E	F	F#	G	Ab	A	Bb	B	
let oldCent = -50
let app = getApp()


// 0	16.332	17.324	18.354	19.445	20.602	21.827	23.125	24.5	25.957	27.501	29.136	30.868	
// 1	32.704	34.649	36.709	38.892	41.204	43.655	46.25	49.001	51.914	55.001	58.272	61.737	
// 2	65.406	69.296	73.416	77.782	82.407	87.307	92.499	97.999	103.83	110.003	116.544	123.47	
// 3	130.81	138.595	146.836	155.567	164.818	174.618	185.002	196.002	207.657	220.005	233.087	246.947	
// 4	261.632	277.189	293.662	311.135	329.636	349.237	370.003	392.005	415.315	440.01	466.175	493.895	
// 5	523.263	554.379	587.344	622.269	659.271	698.473	740.007	784.01	830.629	880.02	932.35	987.79	
// 6	1046.528	1108.758	1174.688	1244.538	1318.542	1396.947	1480.013	1568.019	1661.258	1760.042	1864.699	1975.58	
// 7	2093.056	2217.515	2349.376	2489.076	2637.084	2793.893	960.027	3136.039	3322.517	3520.517	3729.398	3951.16	
// 8	4186.112	4435.031	1698.751	4978.153	5274.169	5587.787	5920.063	6272.07	6645.034	7040.168	7458.797	7902.319	
// 9	8372.224	8870.062	9397.502	9956.305	10548.337	11175.573	11840.106	12544.155	13290.068	1400.355	14917.594	15804.639	

let pitchs = [
  [16.332, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125, 24.5, 25.957, 27.501, 29.136, 30.868],
  [32.704, 34.649, 36.709, 38.892, 41.204, 43.655, 46.25, 49.001, 51.914, 55.001, 58.272, 61.737],
  [65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.83, 110.003, 116.544, 123.47],
  [130.81, 138.595, 146.836, 155.567, 164.818, 174.618, 185.002, 196.002, 207.657, 220.005, 233.087, 246.947],
  [261.632, 277.189, 293.662, 311.135, 329.636, 349.237, 370.003, 392.005, 415.315, 440.01, 466.175, 493.895],
  [523.263, 554.379, 587.344, 622.269, 659.271, 698.473, 740.007, 784.01, 830.629, 880.02, 932.35, 987.79],
  [1046.528, 1108.758, 1174.688, 1244.538, 1318.542, 1396.947, 1480.013, 1568.019, 1661.258, 1760.042, 1864.699, 1975.58],
  [2093.056, 2217.515, 2349.376, 2489.076, 2637.084, 2793.893, 960.027, 3136.039, 3322.517, 3520.517, 3729.398, 3951.16],
  [186.112, 4435.031, 1698.751, 4978.153, 5274.169, 5587.787, 5920.063, 6272.07, 6645.034, 7040.168, 7458.797, 7902.319],
  [8372.224, 8870.062, 9397.502, 9956.305, 10548.337, 11175.573, 11840.106, 12544.155, 13290.068, 1400.355, 14917.594, 15804.639],
]

let tone = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

// let 
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
    qiniuUrl: app.qiniuUrl,
    // options: [{
    //   id: 0,
    //   name: 'Standard',
    //   piece: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
    // }, {
    //   id: 1,
    //   name: 'New Standard',
    //   piece: ['C2', 'G2', 'D3', 'A3', 'E3', 'G4']
    // }, {
    //   id: 2,
    //   name: 'D tuning',
    //   piece: ['D2', 'G2', 'C3', 'F3', 'A3', 'D4']
    // }, {
    //   id: 3,
    //   name: 'Drop F# Tuning',
    //   piece: ['F#1', 'C#2', 'F#2', 'B2', 'Eb3', 'Ab3']
    // }, {
    //   id: 4,
    //   name: 'C Tuning',
    //   piece: ['G4', 'C4', 'E4', 'A4']
    // }, {
    //   id: 5,
    //   name: 'Tenor Violin',
    //   piece: ['G2', 'D3', 'A3', 'E4']
    // }, {
    //   id: 5,
    //   name: 'Calico(Vlolin)',
    //   piece: ['A3', 'E4', 'A4', 'C#5']
    // }, ],
    options: [{
      id: 0,
      name: '吉他',
      piece: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
    }, {
      id: 4,
      name: '尤克里里',
      piece: ['G4', 'C4', 'E4', 'A4']
    }],
    current: {},
    v0: 0.025,
    a: 0.3,
    oldCent: -50,
    analysis: {},
    line: 440,
    // -50--+50
    centRange: 100,
    spots: [],
    // 圆位于哪里上下波动 width/1.5 
    // 越大距离左边越近
    seat: 1.55,
    // 小球半径
    radius: 5,
    // 轨迹点的密集程度（值越大越稀疏）
    dense: 4,
    // 轨迹点最多的数量
    pointCount: 70,
    // 整体颜色
    color: '#FF5791',
    letter: 'D#',
    // 返回的音调与基础音调的误差
    disparity: 2,
    standard: [{
        name: 'E2',
        frequency: 82.41
      },
      {
        name: 'A2',
        frequency: 110
      },
      {
        name: 'D3',
        frequency: 146.83
      },
      {
        name: 'G3',
        frequency: 196
      },
      {
        name: 'B3',
        frequency: 246.95
      }, {
        name: 'E4',
        frequency: 329.64
      }
    ],
    // 当前校验的下标
    standardCurrent: 0,
    // 是否自动
    isAuto: true,
    // 玄的之前的宽度 logo移动的范围 / 5
    stringWidt: 0,
    logoTranslateX: 0,
    circleCenterX: 0,
    circleCenterY: 0,
    box: {
      // 矩形
      rectW: 31,
      rectH: 21,
      rectR: 3,
      // 三角形
      tH: 8,
      tD: 3
    },
    top: 0
  },
  lifetimes: {
    created: function () {
      let that = this
      authorize.authSettingRecord().then(() => {
        console.log('创建，创建');
        that.can = true
        that.canPonit = true
        // 初始化录音设备
        that.initrecorderManager()
        // 初始化socket
        that.initSocket()
        // 开始录音
        that.start()
      })
    },
    ready: function () {
      this.getTop()
      this.initSelect()
      this.initStringWidt()
      // wx.createSelectorQuery().in(this)
      //   .select('#canvas')
      //   .fields({
      //     node: true,
      //     size: true,
      //   })
      //   .exec(this.initCanvas.bind(this))

      wx.createSelectorQuery().in(this)
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        })
        .exec(this.initCanvas2.bind(this))
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      this.stop()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTop() {
      this.createSelectorQuery().select('#select-box').boundingClientRect(rect => {
        console.log(rect);
        this.setData({
          top: rect.top
        })
      }).exec()

    },
    // 初始化canvas
    initCanvas2(res) {
      this.width = res[0].width
      this.height = res[0].height
      this.rpx = wx.getSystemInfoSync().windowWidth / 375
      this.ctx = wx.createCanvasContext('canvas', this)
    },
    // 开始录音
    start() {
      this.isStop = false
      const options = {
        duration: 600000, //指定录音采样时间100ms
        sampleRate: 8000, //采样率最低8k
        numberOfChannels: 1, //录音通道数
        encodeBitRate: 32000, //8k采样率对应16k~48k
        format: 'pcm', //音频格式，有效值acc/mp3/wav/pcm
        // frameSize: 3.2,          //指定帧大小，单位KB
        frameSize: 1.6, //指定帧大小，单位KB
        // frameSize: 0.8, //指定帧大小，单位KB
        audioSource: 'auto',
      };
      this.recorderManager.start(options)
    },
    // 初始化canvas
    initCanvas(res) {
      const width = res[0].width
      const height = res[0].height
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      this.width = width
      this.height = height
      this.canvas = canvas
      this.ctx = ctx
      let img = canvas.createImage()
      img.src = '../../../images/success.png'
      this.img = img
    },
    // 开始录音
    start() {
      this.isStop = false
      const options = {
        duration: 600000, //指定录音采样时间100ms
        sampleRate: 8000, //采样率最低8k
        numberOfChannels: 1, //录音通道数
        encodeBitRate: 32000, //8k采样率对应16k~48k
        format: 'pcm', //音频格式，有效值acc/mp3/wav/pcm
        // frameSize: 3.2,          //指定帧大小，单位KB
        frameSize: 1.6, //指定帧大小，单位KB
        // frameSize: 0.8, //指定帧大小，单位KB
        audioSource: 'auto',
      };
      this.recorderManager.start(options)
    },
    // 初始化录音设备
    initrecorderManager() {
      this.recorderManager = wx.getRecorderManager()
      this.innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext.onPlay(() => {
        console.log('开始播放录音')
      })
      this.innerAudioContext.onEnded(() => {
        console.log('// 录音播放结束')
      })
      this.recorderManager.onError((err) => {
        console.log(err, '// 录音失败的回调处理');
      });
      this.recorderManager.onStart(() => {
        console.log('// 录音开始')
      })
      this.recorderManager.onStop((res) => {
        console.log('// 录音结束')
        const tempFilePath = res.tempFilePath
        this.innerAudioContext.src = tempFilePath
        if (!this.isStop) {
          console.log('开始新一轮录音')
          this.start()
        }
      })
      this.recorderManager.onFrameRecorded((res) => {
        let array = new Int16Array(res.frameBuffer)
        // window
        // let array = new Int16Array(res.frameBuffer.slice(0, 800))
        // if (array.length >= 800) {
        //   // 切
        //   array = array.subarray(0, 800)
        // } else {
        //   // 加
        //   array = this.concatenate(Int16Array, array, new Int16Array(800 - array.length))
        // }
        this.analysis(Array.prototype.slice.call(array))
      })
    },
    // 发送到后端解析
    analysis(endArry) {
      app.socket.emit('analysis2', endArry);
    },
    // 初始化socket
    initSocket() {
      app.socket.on('completeAnalysis2', (data) => {
        if (this.can) {
          this.can = false
          this.v0 = this.data.v0
          // 拐点渲染次数
          this.inflection = 1
          if (data.cent > 50) {
            data.cent = 50
          }
          this.baseCent = this.data.oldCent
          if (data.cent > this.data.oldCent) {
            this.direction = 'up'
            this.upPint = setInterval(() => {
              this.realizationPainting(data)
            }, 20)
          } else if (data.cent < this.data.oldCent) {
            this.direction = 'down'
            this.downPint = setInterval(() => {
              this.realizationPainting(data)
            }, 20)
          } else {
            this.can = true
          }
        }
      })
    },
    // 实现
    realizationPainting(data) {
      let color;
      let analysis = data
      let disparity = this.data.disparity
      let line = this.data.line
      analysis.pitchFirst = data.pitch ? data.pitch.charAt(0) : ''
      analysis.pitchTwo = data.pitch ? data.pitch.charAt(1) : ''
      if (this.direction == 'up') {
        this.data.oldCent = (this.data.oldCent + this.v0 >= data.cent) ? data.cent : (this.data.oldCent + this.v0)

      } else {
        this.data.oldCent = (this.data.oldCent - this.v0 <= data.cent) ? data.cent : (this.data.oldCent - this.v0)
      }
      if (Math.abs(data.frequency - line) <= disparity && Math.abs(this.data.oldCent) <= 5) {
        color = '#3DDB62'
      } else {
        color = '#FF5791'
      }
      if (color !== this.data.color) {
        this.setData({
          color
        })
        this.motionBall(this.data.oldCent, data.cent)
      } else {
        this.motionBall(this.data.oldCent, data.cent)
      }
      // 校准哪一个 + logo位置
      this.calibration(data.frequency)
      if (this.direction == 'up') {
        if (data.cent <= this.data.oldCent) {
          if (this.inflection && this.data.oldCent === data.cent) {
            // 是拐点让它继续咨询inflection次
            this.inflection--
          } else {
            this.setData({
              analysis
            })
            clearInterval(this.upPint)
            this.can = true
            return
          }
        }
      } else {
        if (data.cent >= this.data.oldCent) {
          if (this.inflection && this.data.oldCent === data.cent) {
            // 是拐点让它继续咨询inflection次
            this.inflection--
          } else {
            this.setData({
              analysis
            })
            clearInterval(this.downPint)
            this.can = true
            return
          }
        }
      }
      if (this.data.oldCent - this.baseCent >= (data.cent - this.baseCent) / 2) {
        if (this.direction == 'up') {
          this.v0 = (this.v0 - this.data.a <= 2) ? 2 : this.v0 - this.data.a
        } else {
          this.v0 = this.v0 + this.data.a
        }
      } else {
        if (this.direction == 'up') {
          this.v0 = this.v0 + this.data.a
        } else {
          this.v0 = (this.v0 - this.data.a <= 2) ? 2 : this.v0 - this.data.a
        }
      }
    },
    // 运动的球
    motionBall(oldCent, newCent) {
      let ctx = this.ctx
      ctx.clearRect(0, 0, this.width, this.height);
      this.drawLine()
      this.drawCentBox(oldCent)
      this.drawBall(oldCent)
      this.drawTrajectory(oldCent, newCent)
      ctx.draw()
    },
    // 画线
    drawLine() {
      let width = this.width
      let height = this.height
      let ctx = this.ctx
      let color = this.data.color
      ctx.beginPath();
      ctx.setStrokeStyle(color)
      ctx.setLineWidth(1)
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke()
    },
    // 画box
    drawCentBox(oldCent) {
      let width = this.width
      let height = this.height
      let ctx = this.ctx
      let {
        seat,
        radius,
        centRange,
        box,
        color,
        analysis
      } = this.data
      let y = ((oldCent + centRange / 2) * (height - 2 * radius)) / centRange
      let circleCenterX = width / seat
      let circleCenterY = height - radius - y

      let A = {
        x: circleCenterX,
        y: circleCenterY - (radius * 2)
      }
      // let B = {
      //   x: A.x - box.tD,
      //   y: A.y - box.tH
      // }
      // let C = {
      //   x: A.x + box.tD,
      //   y: A.y - box.tH
      // }

      // let E1 = {
      //   x: A.x - box.rectW / 2,
      //   y: A.y - box.tH
      // }
      // let p1 = {
      //   x: A.x - box.rectW / 2 + box.rectR,
      //   y: A.y - box.tH
      // }
      // let p2 = {
      //   x: A.x - box.rectW / 2,
      //   y: A.y - box.tH - box.rectR
      // }
      let E2 = {
        x: A.x - box.rectW / 2,
        y: A.y - box.tH - box.rectH
      }
      // let p3 = {
      //   x: A.x - box.rectW / 2,
      //   y: A.y - box.tH - box.rectH + box.rectR
      // }
      // let p4 = {
      //   x: A.x - box.rectW / 2 + box.rectR,
      //   y: A.y - box.tH - box.rectH
      // }
      // let E3 = {
      //   x: A.x + box.rectW / 2,
      //   y: A.y - box.tH - box.rectH
      // }
      // let p5 = {
      //   x: A.x + box.rectW / 2 - box.rectR,
      //   y: A.y - box.tH - box.rectH
      // }
      // let p6 = {
      //   x: A.x + box.rectW / 2,
      //   y: A.y - box.tH - box.rectH + box.rectR
      // }
      // let E4 = {
      //   x: A.x + box.rectW / 2,
      //   y: A.y - box.tH
      // }
      // let p7 = {
      //   x: A.x + box.rectW / 2,
      //   y: A.y - box.tH - box.rectR
      // }
      // let p8 = {
      //   x: A.x + box.rectW / 2 - box.rectR,
      //   y: A.y - box.tH
      // }
      // ctx.beginPath();
      // ctx.setLineWidth(1)
      // ctx.setStrokeStyle(color)
      // ctx.setFillStyle(color)
      // ctx.moveTo(A.x, A.y);
      // ctx.lineTo(B.x, B.y);
      // ctx.lineTo(p1.x, p1.y);
      // ctx.arcTo(E1.x, E1.y, p2.x, p2.y, box.rectR)
      // ctx.lineTo(p3.x, p3.y);
      // ctx.arcTo(E2.x, E2.y, p4.x, p4.y, box.rectR)
      // ctx.lineTo(p5.x, p5.y);
      // ctx.arcTo(E3.x, E3.y, p6.x, p6.y, box.rectR)
      // ctx.lineTo(p7.x, p7.y);
      // ctx.arcTo(E4.x, E4.y, p8.x, p8.y, box.rectR)
      // ctx.lineTo(C.x, C.y);
      // ctx.closePath();
      // ctx.fill()
      // ctx.stroke();
      this.ctx.drawImage('../../../images/red.png', E2.x, E2.y, box.rectW, box.tH + box.rectH)
      if (analysis.cent) {
        if (color === '#3DDB62') {
          // 已完成矫正
          let sc_x = E2.x + ((box.rectW - 21) / 2)
          let sc_Y = E2.y + ((box.rectH - 16) / 2)
          // 需修改
          this.ctx.drawImage('../../../images/green.png', E2.x, E2.y, box.rectW, box.tH + box.rectH)
          this.ctx.drawImage('../../../images/success.png', sc_x, sc_Y, 21, 16)
        } else {
          // 画字体
          ctx.setTextAlign('center')
          ctx.setTextBaseline('middle')
          ctx.setFontSize(12)
          ctx.setFillStyle('#FFFFFF')
          ctx.fillText(analysis.cent, A.x, A.y - box.tH - box.rectH / 2);
        }
      }
    },
    // 画球
    drawBall(oldCent) {
      let width = this.width
      let height = this.height
      let ctx = this.ctx
      let {
        seat,
        radius,
        centRange
      } = this.data
      let y = ((oldCent + centRange / 2) * (height - 2 * radius)) / centRange
      ctx.beginPath();
      ctx.arc(width / seat, height - radius - y, radius, 0, Math.PI * 2);
      ctx.setFillStyle('#FFFFFF')
      ctx.setStrokeStyle('#FFFFFF')
      ctx.setShadow(0, 0, 10, '#FFFFFF')
      ctx.fill();
      ctx.stroke();
    },
    //  画轨迹
    drawTrajectory(oldCent, newCent) {
      let ctx = this.ctx
      let width = this.width
      let height = this.height
      let {
        spots,
        radius,
        seat,
        dense,
        pointCount,
        centRange
      } = this.data
      let y = ((oldCent + centRange / 2) * (height - 2 * radius)) / centRange
      ctx.beginPath();
      ctx.lineWidth = 3;
      var gradient = ctx.createLinearGradient(0, 0, width / seat, 0);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, "#FFFFFF");
      ctx.setStrokeStyle(gradient)
      spots.unshift({
        x: width / seat,
        y: height - radius - y,
      })
      if (spots.length >= 3) {
        ctx.moveTo(spots[0].x, spots[0].y);
        let i
        for (i = 1; i < spots.length - 2; i++) {
          var xc = (spots[i].x + spots[i + 1].x) / 2;
          var yc = (spots[i].y + spots[i + 1].y) / 2;
          ctx.quadraticCurveTo(spots[i].x, spots[i].y, xc, yc);
        }
        ctx.quadraticCurveTo(spots[i].x, spots[i].y, spots[i + 1].x, spots[i + 1].y);
        ctx.stroke();
      }
      if (spots.length > pointCount) {
        spots.pop()
      }
      spots.forEach((item, index) => {
        item.x = item.x - dense
      })
    },
    // 矫正logo
    calibration(frequency) {
      let {
        isAuto,
        standardCurrent,
        standard,
        stringWidt
      } = this.data
      let logoTranslateX = 0
      let minIndex = 0
      for (let i = 1; i < standard.length; i++) {
        if (Math.abs(frequency - standard[i].frequency) < Math.abs(frequency - standard[minIndex].frequency)) {
          minIndex = i
        }
      }

      if (frequency - standard[minIndex].frequency > 0) {

        if (minIndex === standard.length - 1) {
          logoTranslateX = stringWidt * minIndex + 8
        } else {
          let tempIndex = 0,
            isMaximum = true
          standard.forEach((item, index) => {
            if ((item.frequency > standard[minIndex].frequency) && (Math.abs(standard[minIndex].frequency - standard[index].frequency) < Math.abs(standard[minIndex].frequency - standard[tempIndex].frequency))) {
              tempIndex = index,
                isMaximum = false
            }
          })
          if (isMaximum) {
            logoTranslateX = (stringWidt * minIndex) + 8
          } else {
            logoTranslateX = (stringWidt * minIndex) + stringWidt * (frequency - standard[minIndex].frequency) / (standard[tempIndex].frequency - standard[minIndex].frequency)
          }
        }
      } else if (frequency - standard[minIndex].frequency < 0) {

        if (minIndex === 0) {
          logoTranslateX = minIndex - 8
        } else {
          let tempIndex = 0,
            isMinimum = true
          standard.forEach((item, index) => {
            if ((item.frequency < standard[minIndex].frequency) && (Math.abs(standard[minIndex].frequency - standard[index].frequency) < Math.abs(standard[minIndex].frequency - standard[tempIndex].frequency))) {
              tempIndex = index,
                isMinimum = false
            }
          })
          if (isMinimum) {
            logoTranslateX = (stringWidt * minIndex) - 8

          } else {
            logoTranslateX = (stringWidt * minIndex) - stringWidt * (standard[minIndex].frequency - frequency) / (standard[minIndex].frequency - standard[tempIndex].frequency)
          }
        }
      } else {
        logoTranslateX = stringWidt * minIndex
      }
      standardCurrent = minIndex


      if (isAuto) {
        this.data.line = this.data.standard[standardCurrent].frequency
        this.setData({
          standardCurrent,
          logoTranslateX
        })
      } else {
        this.setData({
          logoTranslateX
        })
      }
    },
    // 初始化选择
    initSelect() {
      let current = this.data.options[0]
      this.setData({
        current
      })
    },
    // 选择调音方式
    optionTap(e) {
      let index = e.target.dataset.index
      let current = this.data.options[index]
      this.writeStandard(current.piece)
      this.setData({
        current,
        isShow: false
      });
    },
    // 标准调音
    writeStandard(piece) {
      let standard = []
      piece.forEach((item, index) => {
        standard.push({
          name: item,
          frequency: this.split(item)
        })
      })
      this.data.line = this.data.standard[0].frequency
      console.log(standard, 113);
      this.setData({
        standard,
        standardCurrent: 0
      }, () => {
        this.initStringWidt()
      })
    },
    split(str) {
      let letter = str.slice(0, str.length - 1)
      let group = str.slice(str.length - 1)
      let letterIndex
      tone.forEach((item, index) => {
        if (letter === item) {
          letterIndex = index
          return
        }
      })
      if (letterIndex == undefined) {
        return undefined
      }
      return pitchs[group][letterIndex]
    },
    // 初始化铉的宽度
    initStringWidt() {
      let query = wx.createSelectorQuery().in(this)
      let standard = this.data.standard
      query.select('#column').boundingClientRect(rect => {
        this.setData({
          stringWidt: rect.width / (standard.length - 1)
        })
      }).exec();
    },


    // 自动调音
    changeAuto() {
      this.setData({
        isAuto: !this.data.isAuto,
        standardCurrent: -1
      })
    },
    // 处理帧
    concatenate(resultConstructor, ...arrays) {
      let totalLength = 0;
      for (let arr of arrays) {
        totalLength += arr.length;
      }
      let result = new resultConstructor(totalLength);
      let offset = 0;
      for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    },
    // 点击铉
    string(e) {
      if (!this.data.isAuto) {
        let index = e.currentTarget.dataset.index
        this.data.line = this.data.standard[index].frequency
        this.setData({
          standardCurrent: index
        })
      }
    },
    // 停止录音
    stop() {
      this.recorderManager && this.recorderManager.stop()
      this.isStop = true
    },
    openClose() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
  }
})