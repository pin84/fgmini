/**
 * 新增工具需要在list添加相关项目
 * 参考已有工具的配置
 */

 let list = [
    {name: 'mount', path: './coreSrc/mount.js'},
    {name: 'img', path: './coreSrc/img.js'},
    {name: 'info', path: './coreSrc/info.js'},
    {name: 'mock', path: './mockSrc/index.js'},
]

let listResult = {}
list.map(item => {
    listResult[item.name] = require(item.path)
})
module.exports = listResult