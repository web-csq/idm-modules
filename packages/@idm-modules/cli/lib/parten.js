const Alphabet = require('alphabetjs')
const chalk = require('chalk')
module.exports = {
    printParent() {
        const str = Alphabet('IDM', 'planar')
        console.log(
            chalk.green('-------------') + chalk.blueBright('  powered by yunit  ') + chalk.green('--------------')
        )
        console.log(chalk.green(str))
        console.log(chalk.green(' 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀'))
    }
}
