const fs = require('fs-extra')
const path = require('path')

const readFiles = async (filePath, name, callback) => {
    const files = fs.readdirSync(filePath)
    files
        .map(file => {
            const filedir = path.join(filePath, file)
            const stats = fs.statSync(filedir)
            if (stats.isFile() && filedir.indexOf(name) > -1) {
                callback && callback(filedir)
            } else if (stats.isDirectory()) {
                readFiles(filedir, name, callback)
            }
        })
}

const componentsPath = 'all-books'
const bookPath = {}
readFiles(
    path.join(__dirname, './', componentsPath),
    '.pdf',
    (file, error) => {
        if (error) {
            return console.error('read files error:', error)
        }
        const _bookPath = file.split('/all-books/')[1].split('/')
        if (!Reflect.has(bookPath, _bookPath[0])) {
            bookPath[_bookPath[0]] = []
        }
        bookPath[_bookPath[0]].push(_bookPath[1])
    }
)

let fileText = "# record books I've read\n"

fileText += '\n' + '## catalogue\n\n'

Object.keys(bookPath).map(key => {
    fileText += `- ${key}\n`
    const bookNames = bookPath[key].reduce((result, value) => {
        return result += '  - ' + value + '\n'
    }, '')
    fileText += bookNames
})

console.log (fileText)

fs.outputFileSync(
    path.join(__dirname, './readme.md'),
    fileText,
    { encoding: 'utf-8' }
)

const exec = require('child_process').exec;
exec('git log --pretty=format:"%s" -n 1 | xargs -I message git commit -n --amend -m message', function(err,stdout,stderr) {
    if(err) {
        console.log('error', err)
        return
    }
    console.log('stdout', stdout)
    console.log('stderr', stderr)
});