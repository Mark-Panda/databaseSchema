const path = require('path');
const os = require('os')
const fs = require('fs');
const childProcess = require('child_process');
const { rootPath } = require('../config').Config
    // const rootPath = path.resolve(process.cwd());
    //生成prisma文件
async function makePrisma(nodeInfo, linkInfo) {
    console.log('nodeInfonodeInfo', nodeInfo);
    console.log('linkInfolinkInfo', linkInfo);
    if (!linkInfo) linkInfo = []
    let prismaInfo = ''
    for (let nodeItem of nodeInfo) {

        let schemType = nodeItem.schemaType
        let modelName = nodeItem.key
        const filedInfo = nodeItem.fields || []
        let tempData = ''
        const newName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
        prismaInfo += `
` + (nodeItem.keyDesc ? ('//' + nodeItem.keyDesc) : '')
        if (schemType === 'model') { //数据模型的
            let passiveLink = ''
            for (let filedItem of filedInfo) {
                let forignInfo = ''

                if (filedItem.otherInfo.forignKeyInfo) { //存在外键
                    //循环所有的外键关系
                    for (let linkItem of linkInfo) {

                        if (linkItem.from === modelName) { //主动连接的
                            switch (linkItem.relationType) {
                                case 'OneToOne': //一对一的情况
                                    forignInfo = `\n${filedItem.name}   ${linkItem.to}   @relation(fields: [${linkItem.fromPort}Id], references: [${linkItem.toPort}])
                                        ${linkItem.fromPort}Id   String`
                                    break;
                                case 'OneToMany': //一对多的情况
                                    forignInfo = `\n${filedItem.name}   ${linkItem.to}   @relation(fields: [${linkItem.fromPort}Id], references: [${linkItem.toPort}])
                                        ${linkItem.fromPort}Id   String`
                                    break;
                                case 'ManyToMany': //多对多的情况
                                    forignInfo = `\n${filedItem.name}   ${linkItem.to}[]`
                                    break;

                                default:
                                    break;
                            }

                        }
                    }
                    console.log('-----forignInfo111', forignInfo);
                }


                tempData += `   
    ${filedItem.desc ? '// ' + filedItem.desc : ''} ` + (forignInfo === '' ? `
    ${filedItem.name}   ${filedItem.info}${filedItem.otherInfo.isHaveNull === 'true' ? '' : '?'}   ${filedItem.otherInfo.isHavePrimaryKey === 'true' ? '@id' : ''}    ${filedItem.otherInfo.defaultValue ? `@default(${filedItem.otherInfo.defaultValue})` : ''}` : forignInfo)

            }
            //循环所有的外键关系
            for (let linkItem of linkInfo) {
                if (linkItem.to === modelName) { //被连接的
                    console.log('被连接');
                    switch (linkItem.relationType) {
                        case 'OneToOne': //一对一的情况
                            passiveLink = `\n${newName}   ${linkItem.from}?`
                            break;
                        case 'OneToMany': //一对多的情况
                            passiveLink = `\n${newName}   ${linkItem.from}[]`
                            break;
                        case 'ManyToMany': //多对多的情况
                            passiveLink = `\n${newName}   ${linkItem.from}[]`
                            break;

                        default:
                            break;
                    }

                }
            }
            console.log('-----forignInfo', passiveLink);
            tempData += passiveLink

            prismaInfo += `
model ${modelName} {                 ` + tempData + `
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
}\n
            `
        } else {  //枚举类型的
            for (let filedItem of filedInfo) {
                tempData += `   
    ${filedItem.desc ? '// ' + filedItem.desc : ''} 
    ${filedItem.name}   `

            }
            prismaInfo += `
enum ${modelName} {                 ` + tempData + `
}\n
            `
        }


    }





    if (!fs.existsSync(path.join(rootPath, 'example.prisma'))) {
        fs.writeFileSync(path.join(rootPath, 'example.prisma'), `
datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
}\n
        `)
    } else {
        fs.writeFileSync(path.join(rootPath, 'example.prisma'), `
datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
}\n
        `)
    }
    fs.appendFileSync(path.join(rootPath, 'example.prisma'), prismaInfo + os.EOL + '\n')

    //格式化输出的prisma文件
    const formatCMD = 'npx prisma format --schema=' + path.join(rootPath, 'example.prisma')
    console.log('----formatCMD', formatCMD);
    childProcess.exec(formatCMD, (error, stdout, stderr) => {
        console.log('数据整理完毕\n', stdout);
    })
}


module.exports = {
    makePrisma
}