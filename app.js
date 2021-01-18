const express = require('express');
const ejs = require('ejs');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

const { model, rootPath } = require('./config').Config
const { makePrisma } = require('./reslover')
    //把./views目录设置为模板文件的根，html文件模板放在view目录中
app.set('views', './views');
// app.set('views', path.join(__dirname, 'views'));
//设置模板引擎为ejs
app.set('view engine', 'ejs');

//为html扩展名注册ejs
app.engine('html', ejs.renderFile);
app.use(express.static('public'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = process.env.PORT || 9999;


console.log('初始化配置信息', model);

app.get('/', async(req, res) => {
    const filedType = model.filedType
    res.render('index', { 'filedType': JSON.stringify(filedType) })
})


app.get('/viewFile', async(req, res) => {
    const fileData = fs.readFileSync(path.join(rootPath, 'example.prisma'), 'utf-8')
    res.render('file', { "data": fileData })
})


//生成prisma文件
app.post('/toMakeFile', async(req, res) => {
    const getData = req.body
    if (Object.keys(getData.nodeInfo).length > 0) {
        await makePrisma(getData.nodeInfo, getData.linkInfo)
        return res.json({ code: 200, msg: 'success' })
    }
    return res.json({ code: 300, msg: '无效的内容' })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`));