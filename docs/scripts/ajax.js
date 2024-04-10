class _Ajax {
    static getInFolder(url, cb) {
        if(_Config.isMock)
            this.get(url,cb);
        else
            this.get(_Config.folder + '/' + url);
    }
    static get(url, cb) {
        console.log("ajax", _Config.isMock);
        if(_Config.isMock) {
            _AjaxMock.get(url, cb);
            return;
        }
        $.get(url, function( data ) {
            if(cb)
                cb(data);
        });
    }
}

class _AjaxMock {
    static mocks = {
        "plans": {
        "current.md": `
# mock :muscle:
| a | b |
| - | - |
| r1c1 | r1c2 |
| r2c1 | r2c2 |
        `
        },
        "templates": {
        "current.md": `
# mock :muscle:
| a | b |
| - | - |
| r1c1 | r1c2 |
| r2c1 | r2c2 |
        `,
        "nav.json": {
            "header": "Template",
            "lis": [
                {
                    "label":"test3",
                    "url": "x.html"
                },
                {
                    "label":"test",
                    "url": "x.html"
                }
            ]
        }
    }
    };

    static get(url, cb) {

        console.log('get', url);
        const res = this.mocks[_Config.folder][url];
        cb(res);
    }
}