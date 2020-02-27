const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {type: String},
    password: {
        type: String, 
        select: false,  //使密码在编辑管理员界面无法查看
        set(val) {
            return require('bcrypt').hashSync(val, 10)
    }}
})

module.exports = mongoose.model('AdminUser', schema)