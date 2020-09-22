module.exports.mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

module.exports.URLHelper = class URLHelper extends URL {
    constructor(...props) {
        super(...props);
    }

    /**
     * @param {object} option { omitEmpty: boolean }
     * @return {object}
     */
    parseSearchParam = (option) => {
        if (!this.search) return {};
        return this.search
            .slice(1)
            .split('&')
            .reduce((prev, curr) => {
                const [k, v] = curr.split('=');
                if (option.omitEmpty && !v) return prev;
                return ({ ...prev, [k]: v })
            }, {});
    }
}