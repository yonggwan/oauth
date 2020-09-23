const fs = require('fs');
const path = require('path');
const Handlebars = require("handlebars");
const { resolve } = require('path');

module.exports = async function render (filePath, data) {
    return new Promise(resolve => {
        fs.readFile('./views' + filePath, 'utf-8', function(error, content) {
            console.log('@content@', error, content)
            if (error) return render('/404.html');
            const template = Handlebars.compile(content);
            console.log(template)
            const result = template(data);
            console.log('\n\n\n\nresult\n\n\n\n\n', result);
            resolve(result);
            // return template({ name: "Nils" })
        });
    })
}
