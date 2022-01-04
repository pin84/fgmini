
let list = [
    {name: 'article', path: './article.js'},
    {name: 'home', path: './home.js'},
]

let listResult = {}
list.map(item => {
    listResult[item.name] = require(item.path)
})
module.exports = listResult