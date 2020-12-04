var express = require('express')
var compression = require('compression')
var axios = require('axios')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var csrf = require('xsrf')
var history = require('connect-history-api-fallback')

var vueAxios = axios.create({
  headers: {
    origin: 'https://y.qq.com/',
    'sec-fetch-site': 'same-site',
    'access-control-allow-origin': 'https://y.qq.com',
    'access-control-expose-headers': 'Area',
    referer: 'https://c.y.qq.com/'
  },
  timeout: 3000
})
var sendAxiosAjax = function (url, params) {
  return Promise.resolve(
    vueAxios.get(url, {
      params
    })
  )
}

var port = process.env.PORT || 9123

var app = express()

var csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['HEAD', 'OPTIONS'],
  checkPathReg: /^\/api/
})
app.use(cookieParser())
app.use(csrfProtection)
app.use(history())

var apiRoutes = express.Router()

// 获取 qq music 推荐页 recomPlayList信息
apiRoutes.get('/getDiscList', csrfProtection, function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  sendAxiosAjax(url, req.query)
    .then(response => {
      return res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

apiRoutes.get('/getCdInfo', csrfProtection, function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    return res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

// 获取 歌手的信息
apiRoutes.get('/getSingerList', csrfProtection, function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  axios
    .get(url, {
      params: req.query
    })
    .then(response => {
      return res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

// 获取 歌手详情页的歌单信息
apiRoutes.get('/getSingerSongList', csrfProtection, function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  sendAxiosAjax(url, req.query)
    .then(response => {
      return res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

apiRoutes.post('/getPurlUrl', bodyParser.json(), csrfProtection, function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios
    .post(url, req.body, {
      headers: {
        referer: 'https://y.qq.com/',
        origin: 'https://y.qq.com',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

// 获取 歌手详情页的歌单信息
apiRoutes.get('/lyric', csrfProtection, function (req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  sendAxiosAjax(url, req.query)
    .then(response => {
      var ret = response.data
      return res.json(ret)
    })
    .catch(e => {
      console.log(e)
    })
})
// 获取搜索歌单
apiRoutes.get('/search', csrfProtection, function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  sendAxiosAjax(url, req.query)
    .then(response => {
      var ret = response.data
      return res.json(ret)
    })
    .catch(e => {
      console.log(e)
    })
})

// #region 推荐页
// 获取 qq music 推荐页 slider信息
app.get('/api/getTopBanner', csrfProtection, function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  sendAxiosAjax(url, req.query)
    .then(response => {
      return res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

app.use('/api', apiRoutes)

app.get('/', function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  return next()
})

app.use(compression())

app.use(express.static('./dist'))

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next()
  }

  // handle CSRF token errors here
  res.status(403)
  res.send('屏蔽')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
