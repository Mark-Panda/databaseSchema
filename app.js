const express = require('express');
const ejs = require('ejs');
const cors = require('cors');
// const path = require('path');
const app = express();
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




app.get('/', async(req, res) => {
    res.render('index')
})



//获取模型
app.get('/datamodel', async(req, res) => {


    let linkDataArray1 = [{
        from: "Record1",
        fromPort: "field1",
        to: "Record2",
        toPort: "fieldA"
    }, {
        from: "Record1",
        fromPort: "field2",
        to: "Record2",
        toPort: "fieldD"
    }, {
        from: "Record1",
        fromPort: "fieldThree",
        to: "Record2",
        toPort: "fieldB"
    }]

    let nodeDataArray = req.query.nodeDataArray
    let linkDataArray = req.query.linkDataArray
    res.render('datamode', { "nodeDataArray": nodeDataArray, "linkDataArray": linkDataArray })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));