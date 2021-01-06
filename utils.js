;(function(win) {
  win.vio = {
    isNum(val) {
      return val === +val
    },
    
    // 随机数组项
    randItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    },
    
    // 随机数字
    // min max, or length && length < 16
    randNum(...arg) {
      let limit = Number.MAX_SAFE_INTEGER
      let min = 0
      let max = 0
      if (!arg.length) throw new Error('arguments cannot be empty')
      if (arg,length > 2) throw new Error('pass two parameters at most')
      if (arg.length === 1) {
        min = Math.min(Math.pow(10, arg - 1), limit)
        max = Math.min(Math.pow(10, arg) - 1, limit)
      } else {
        min = Math.min(arg[0], limit)
        max = Math.min(arg[1], limit)
      }
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
    
    // 数组对象去重
    uniqueArr(arr, p) {
      if (!p) return [...new Set(arr)]
      let s = new Set()
      return arr.filter(v => !s.has(v[p]) ? s.add(v[p]) && true : false)
    },
    
    // 节流
    throttle(func, wait) {
      let start = 0
      return function() {
        let now = Date.now()
        if (now - start >= wait) {
          func.apply(this, arguments)
          start = now
        }
      }
    },
    
    // 防抖
    debounce(func, delay) {
      let timer = null
      return function() {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, arguments)
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
      let o = JSON.parse(localStorage.getItem(key))
      if (o) {
        let now = Math.trunc(Date.now() / 1000)
        if (o.expires - now > 0) {
          return o.value
        }
      }
      localStorage.removeItem(key)
      return null
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
    
    // 复制文本
    copyText(text) {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', text)
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
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
    // 图片转换成base64编码
    toBase64(img) {
      let canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      let dataURL = canvas.toDataURL('image/' + ext)
      return dataURL.replace(/^.+?base64,/, '').replace(/\r\n/g, '').replace(/\\/g, '%2B')
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
    getType(v) {
      if (v === undefined) return 'undefined'
      if (v === null) return 'null'
      return v.constructor.name.toLowerCase()
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
    evalFunc(fnStr) {
      return Function(`return ${fnStr}`)()
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
    
    // img数据上报
    reportImg(url) {
      new Image().src = url
    },
    
    // 设置概率
    getProbability(prob = 0.5) {
      return prob > Math.random()
    },
    
    // 等待DOM加载完成 rely on jquery
    // eg: await loadEl('.box')  or await loadEl(v => $(v).find('li'))
    loadEl(fnz, timeout = 30e3) {
      return new Promise(resolve => {
        const iFn = () => {
          let el = typeof fnz === 'function' ? fnz() : $(fnz)
          if (el.length) {
            return resolve(el)
          }
          setTimeout(iFn, 50)
        }
        iFn()
        setTimeout(() => {
          return resolve($(null))
        }, timeout)
      })
    },
    
    // 返回n天前的日期字符串
    daysAgo(n) {
      let d = new Date()
      d.setDate(d.getDate() - Math.abs(n))
      return d.toISOString().split('T')[0]
    },
    
    // 赋值时会同步到本地存储
    createProxyStorage(prefix, obj) {
      for (let k in obj) {
        let type = typeof obj[k]
        obj[`_${k}_`] = type.replace(/^./, m => m.toUpperCase() )
        if (!localStorage.getItem(`${prefix}[${k}]`) && !/^_|_$/.test(k)) {
          localStorage.setItem(`${prefix}[${k}]`, type === 'object' ? JSON.stringify(obj[k]) : obj[k])
        }
      }
      return new Proxy(obj, {
        set(obj, prop, value) {
          if (!obj[`_${prop}_`]) {
            throw new Error(`Please initialize: ${prop}`)
          }
          localStorage.setItem(`${prefix}[${prop}]`, obj[`_${prop}_`] === 'Object' ? JSON.stringify(value) : value)
        },
        get(obj, prop) {
          let lsVal = localStorage.getItem(`${prefix}[${prop}]`)
          let _p = obj[`_${prop}_`]
          if (_p === 'Object') {
            return JSON.parse(lsVal)
          }
          if (_p === 'Boolean') {
            return lsVal === 'true'
          }
          return Function(`return ${_p}`)()(lsVal)
        }
      })
    },
    
    // 监听dom状态(显示或隐藏), 监测, 检测dom
    // watchDomState('.modal', 'hide').then()
    watchDomState(selector, state) {
      return new Promise((resolve) => {
        const iFn = () => {
          setTimeout(() => {
            let el = document.querySelector(selector)
            let show = !!el && getComputedStyle(el).display !== 'none'
            if (show && state === 'show') {
              return resolve(true)
            } else if (!show && state === 'hide') {
              return resolve(true)
            }
            iFn()
          }, 50)
        }
        iFn()
      })
    },
    
    // 监听dom节点或后代节点变化 el [, options], cb
    watchDom(el, ...args) {
      if (typeof el === 'string') {
        el = document.querySelector(el)
      }
      let opt = args.length > 1 ? args[0] : {}
      let cb = args.length > 1 ? args[1] : args[0]
      return new MutationObserver((mutations, observer) => {
        cb(mutations)
      }).observe(el, Object.assign({
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
      }, opt))
    },
    
  }
})(window)
