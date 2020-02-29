const express = require('express')

const app = express()

app.set('secret', 'uihiuiohocgq9gecpn')

// 配置跨域和json
app.use(require('cors')())
app.use(express.json())

app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web')(app)

app.listen(3000, () => {
    console.log("App listening on  http://localhost:3000")
})