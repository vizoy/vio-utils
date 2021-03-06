!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t = 'undefined' != typeof globalThis ? globalThis : t || self).vio = e())
})(this, function () {
  return {
    isNum(val) {
      return val === +val
    },
     
    // 随机数组项
    randItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    },
     
    // 随机数字
    // min max, or length && length <= 20
    randNum(...args) {
      let limit = 10 ** 20
      if (!args.length) throw new Error('params cannot be empty')
      if (args < 0 || args[0] < 0) throw new Error('params should positive integer')
      if (10 ** args > limit) throw new Error('Exceed maximum limit')
      let min = args.length === 1 ? 10 ** (args - 1) : args[0]
      let max = args.length === 1 ? 10 ** args - 1 : args[1]
      return Math.floor((Math.random() * (max - min + 1)) + min)
    },
     
    // 随机字符串
    randStr(len) {
      let str = ''
      while (str.length < len) {
        str += Math.random().toString(36).substr(2)
      }
      return str.substr(0, len)
    },
     
    // 随机数组 (洗牌算法, 不会改变原数组)
    shuffle(arr) {
      arr = arr.slice()
      let i = arr.length
      while (i) {
        let j = Math.floor(Math.random() * i--)
        ;[arr[j], arr[i]] = [arr[i], arr[j]]
      }
      return arr
    },
     
    // 随机数组
    randArr(arr) {
      return this.shuffle(arr)
    },
     
    // 随机颜色
    randColor() {
      let str = '00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)
      return '#' + str.slice(-6)
    },
     
    // 随机中文姓名
    randCname() {
      const first = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛狄米明臧计成戴宋庞熊纪舒项祝董梁杜阮蓝席季麻江童颜郭'
      const last = '永勇全真修杰恺学贤超铭琪睿锐瑞卓美彩伟梓庆诚尧瑜瑾雄鸿智熙正阳哲玄博辰俊羽星昊良景康玮安运元志承轩峻豪平朗源乐德信雨天振荣瀚煦靖辉潜霖钧奋丰勉浦桐傲征帅朋诗煜奇攀敏涵润泰茂义耀烨和意君嘉泉谦敬幽劲胜昌雪妙凝菡韵逸'
      return this.randItem([...first]) + this.randItem([...last]) + this.randItem([...last])
    },
     
    // 数组对象去重
    uniqueArr(arr, p) {
      if (!p) return [...new Set(arr)]
      let s = new Set()
      return arr.filter(v => !s.has(v[p]) ? s.add(v[p]) && true : false)
    },
     
    // 节流
    throttle(func, wait) {
      let start = 0
      return function(...args) {
        let now = Date.now()
        if (now - start >= wait) {
          func.apply(this, args)
          start = now
        }
      }
    },
     
    // 防抖
    debounce(func, delay) {
      let timer = null
      return function(...args) {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
     
    // 设置localStorage
    setStore(key, val, expires = 9e12) {
      localStorage.setItem(key, JSON.stringify({
        value: val,
        expires: expires - 0 + Math.trunc(Date.now() / 1000)
      }))
    },
    getStore(key) {
      try {
        let o = JSON.parse(localStorage.getItem(key))
        if (typeof o !== 'object') {
          this.setStore(key, o)
          return this.getStore(key)
        }
        if (o) {
          let now = Math.trunc(Date.now() / 1000)
          if (o.expires - now > 0) {
            return o.value
          }
        }
        localStorage.removeItem(key)
        return null
      } catch (e) {
        this.setStore(key, localStorage.getItem(key))
        return this.getStore(key)
      }
    },
     
    // 四舍五入保留小数后n位
    round(val, n = 2) {
      return Number(`${Math.round(`${val}e${n}`)}e-${n}`)
    },
     
    // 四舍五入保留小数后n位, 位数不足尾部填充零
    roundFO(val, n = 2) {
      return (this.round(val, n)).toFixed(n)
    },
     
    // 向下取整保留小数后n位
    floor(val, n = 2) {
      return Number(`${Math.floor(`${val}e${n}`)}e-${n}`)
    },
    // 向下取整保留小数后n位, 位数不足尾部填充零
    floorFO(val, n = 2) {
      return (this.floor(val, n)).toFixed(n)
    },
     
    // 延时器
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
     
    // 复制文本(已废弃) 将来可能会移除
    copyTextOld(text) {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', text)
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    },
     
    // 复制文本(推荐)
    copyText(str) {
      try {
        navigator.clipboard.writeText(str)
      } catch (err) {}
    },
     
    // 下载文本
    downloadText(content, filename) {
      let el = document.createElement('a')
      el.download = filename
      el.style.display = 'none'
      let blob = new Blob([content])
      el.href = URL.createObjectURL(blob)
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    },
     
    // 下载url
    downloadUrl(url, name) {
      let obj = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      obj.href = url
      obj.download = name
      let ev = document.createEvent('MouseEvents')
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      obj.dispatchEvent(ev)
    },
     
    // 格式化时间
    fmt(date, fmtStr = 'Y-M-D h:m:s') {
      if (typeof date === 'string') {
        date = date.replace(/-/g, '/')
      }
      let t = new Date(date)
      let o = {
        Y: t.getFullYear(),
        M: t.getMonth() + 1,
        D: t.getDate(),
        h: t.getHours(),
        m: t.getMinutes(),
        s: t.getSeconds(),
      }
      for (let k in o) {
        o[k] = String(o[k]).padStart(2, '0')
      }
      return fmtStr.replace('Y', o.Y)
        .replace('M', o.M)
        .replace('D', o.D)
        .replace('h', o.h)
        .replace('m', o.m)
        .replace('s', o.s)
    },
     
    // 金额千分位逗号隔开
    toThousands(num) {
      return (num+'').replace(/\B(?=(\d{3})+\b)/g, ',')
    },
     
    // 深拷贝, 深克隆
    deepClone(obj, hash = new WeakMap()) {
      if (obj === null) return obj
      if (obj instanceof Date) return new Date(obj)
      if (obj instanceof RegExp) return new RegExp(obj)
      if (typeof obj !== 'object') return obj
      if (hash.get(obj)) return hash.get(obj)
      let cloneObj = new obj.constructor()
      hash.set(obj, cloneObj)
      for (let key in obj) {
        if (Reflect.has(obj, key)) {
          cloneObj[key] = this.deepClone(obj[key], hash)
        }
      }
      return cloneObj
    },
    // 把数字格式化成易读的中文形式
    fmtNumToCN(num = 0, n = 2) {
      const arr = ['亿亿', '万亿', '亿', '万']
      for (let [i, v] of arr.entries()) {
        let c10 = 10 ** (16 - i * 4)
        if (num >= c10) {
          return Number(`${Math.round(`${num / c10}e${n}`)}e-${n}`) + v
        }
      }
      return num
    },
    // 图片转换成base64编码 @return { Promise }
    imgToBase64(imgUrl) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let img = new Image
      img.crossOrigin = 'Anonymous'
      img.src = imgUrl
      return new Promise((resolve, reject) => {
        img.addEventListener('load', () => {
          ctx.width = img.width
          ctx.height = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height)
          return resolve(canvas.toDataURL('image/png'))
        }, false)
      })
    },
     
    // 判断数组是否有重复的子项
    isUnique(arr) {
      return arr.length === new Set(arr).size
    },
     
    // base64转字符串
    atob(str) {
      return decodeURIComponent(encodeURIComponent(str))
    },
     
    // 字符串转base64
    btoa() {
      return decodeURIComponent(encodeURIComponent(str))
    },
     
    // 将数组块分成指定大小的更小数组, n个一组
    chunk(arr, size) {
      return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => {
        return arr.slice(i * size, i * size + size)
      })
    },
    // 将一个数组分割成n个更小的数组, 指定长度n
    chunkIntoN(arr, n) {
      const size = Math.ceil(arr.length / n)
      return Array.from({ length: n }, (v, i) => {
        return arr.slice(i * size, i * size + size)
      })
    },
    // 获取数据类型
    getType(val) {
      if (val === undefined) return 'undefined'
      if (val === null) return 'null'
      return val.constructor.name.toLowerCase()
    },
     
    // 震动
    vibrate(val = 50) {
      try {
        navigator.vibrate(Array.isArray(val) ? val : [val])
      } catch(e) {}
    },
   
    // 求两个数组的交集并过滤重复的值
    intersection(a, b) {
      const s = new Set(b)
      return [...new Set(a)].filter(x => s.has(x))
    },
     
    // 比较两个对象, 判断对象1是否包含对象2的属性和值
    matches(obj, source) {
      return Object.keys(source).every(key => {
        return obj.hasOwnProperty(key) && obj[key] === source[key]
      })
    },
     
    // js判断是否滚动到页面底部
    isBottom() {
      let el = document.documentElement
      return el.scrollTop + window.innerHeight >= el.scrollHeight
    },
     
    // 判断元素是否可见
    isVisible(el) {
      if (!el) return false
      let s = getComputedStyle(el)
      let fk = (
        s.display !== 'none' &&
        s.visibility !== 'hidden' &&
        s.opacity !== 0
      )
      let pe = el.parentElement
      if (pe) {
        return fk ? this.isVisible(pe) : false
      }
      return fk
    },
     
    // 判断元素是否在视口内, 可见区域内
    isInViewport(el) {
      if (!el) return false
      let r = el.getBoundingClientRect()
      return (
        r.top >= 0 &&
        r.left >= 0 &&
        r.bottom <= window.innerHeight &&
        r.right <= window.innerWidth
      )
    },
     
    // 平滑滚动到指定位置
    smoothTo(el, num) {
      el = typeof el === 'string' ? document.querySelector(el) : el
      el.scrollTo({
        top: num,
        behavior: 'smooth'
      })
    },
     
    // 通过v获取k  value get key
    getObjKey(obj, val) {
      return Object.keys(obj).find(v => obj[v] === val)
    },
     
    // 替代eval函数
    evalFunc(str) {
      if (typeof str !== 'string') throw new Error('params should be a string')
      return Function(`return () => {${str}}`)()()
    },
     
    isMobile() {
      return (/(iPhone|iPod|iPad|Android|ios)/i.test(navigator.userAgent))
    },
    isAndroid() {
      return (/(Android|Adr)/i.test(navigator.userAgent))
    },
    isIOS() {
      return (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent))
    },
    isWx() {
      return (/micromessenger/i.test(navigator.userAgent))
    },
     
    // hexToRgb('#fff')
    // hexToRgb('#f3558392')
    // hexToRgb('f35582')
    hexToRgb(hex) {
      let alpha = false,
          h = hex.slice(hex.startsWith('#') ? 1 : 0)
      if (h.length === 3) {
        h = [...h].map(x => x + x).join('')
      }
      else if (h.length === 8) {
        alpha = true
      }
      h = parseInt(h, 16)
      return (
        'rgb' +
        (alpha ? 'a' : '') +
        '(' +
        (h >>> (alpha ? 24 : 16)) +
        ', ' +
        ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
        ', ' +
        ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
        (alpha ? `, ${h & 0x000000ff}` : '') +
        ')'
      )
    },
     
    // rgb转16进制颜色
    rgbToHex(color) {
      let rgb = color.split(',')
      let r = parseInt(rgb[0].split('(')[1], 10)
      let g = parseInt(rgb[1], 10)
      let b = parseInt(rgb[2].split(')')[0], 10)
      let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
      return hex
    },
     
    // 判断是否是二代身份证
    isIdCard(val) {
      return /^\d{6}(18|19|20|21)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/.test(val)
    },
     
    // 通过身份证获取性别
    getSexById(id) {
      return id.substr(-2, 1) % 2 === 0 ? '女' : '男'
    },
     
    // 通过身份证获取出生日期
    getBirthById(id) {
      return id.substr(6, 8).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
    },
     
    isIpv4(str) {
      return /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/.test(str)
    },
     
    // 设置概率
    getProb(prob = 0.5) {
      return prob > Math.random()
    },
     
    // 比较两个字符串
    compareTwoStr(t, e) {
      if (((t = t.replace(/\s+/g, '')), (e = e.replace(/\s+/g, '')), !t.length && !e.length)) return 1
      if (!t.length || !e.length) return 0
      if (t === e) return 1
      if (1 === t.length && 1 === e.length) return 0
      if (t.length < 2 || e.length < 2) return 0
      let n = new Map()
      for (let e = 0; e < t.length - 1; e++) {
        const r = t.substring(e, e + 2),
          s = n.has(r) ? n.get(r) + 1 : 1
        n.set(r, s)
      }
      let r = 0
      for (let t = 0; t < e.length - 1; t++) {
        const s = e.substring(t, t + 2),
          g = n.has(s) ? n.get(s) : 0
        g > 0 && (n.set(s, g - 1), r++)
      }
      return (2 * r) / (t.length + e.length - 2)
    },
  }
})