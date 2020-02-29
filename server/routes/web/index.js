module.exports = app => {
    const router = require('express').Router()
    const mongoose = require('mongoose')

    // const Article = require('../../models/Article')
    // const Category = require('../../models/Category')
    const Article = mongoose.model('Article')
    const Category = mongoose.model('Category')

    
    // eslint-disable-next-line
    router.get('/news/init', async(req, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        // eslint-disable-next-line
        const cats = await Category.find().where({
            parent: parent
        }).lean()
        // const articles = await Article.find().lean()
        const newsTitles = ["新星元部件爆料丨渐变马尾&amp;白金战服！伽罗换装出击~", "体验服爆料丨穿上新盔甲，守护玄雍城！白起优化曝光", "情人节限定皮肤爆料丨喜鹊筑桥，嫦娥后羿月下相逢", "觉醒之战即将再度开启！鬼谷子全屏大，露娜无限连", "新皮肤爆料丨AI意识觉醒，机器少女妲己绚丽登场！", "2月25日全服不停机更新公告", "2月28日体验服停机更新公告", "1月31日全服不停机更新公告", "云中君皮肤设计大赛 最佳设计奖获奖公告", "2月27日净化游戏环境声明及处罚公告", "【稷下修学游】活动公告", "伽罗星元上新 多重福利来袭", "峡谷来相聚 初春有好礼", "创意互动营-云中君皮肤设计大赛投票开启", "爱在峡谷携手度 甜蜜好礼轻松得", "王者荣耀职业联赛（KPL）2020年春季赛开赛时间公告", "《王者荣耀职业联赛（KPL）线上赛规则（暂行）》", "王者荣耀世界冠军杯总决赛落地首都北京", "2020年《王者荣耀》职业赛事（KPL与KPLGT）春季赛开赛调整公告", "中国电竞小伙逐梦记"]
        const newsList = newsTitles.map(title => {
            const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5 )
            return {
                categories: randomCats.slice(0, 2),
                title: title
            }
        })
        await Article.deleteMany({})
        await Article.insertMany(newsList)
        res.send(newsList)
    })


    app.use('/web/api', router)
}