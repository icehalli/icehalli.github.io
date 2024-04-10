class _Ajax {
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
        "current.md": `
# mock :muscle:
| a | b |
| - | - |
| r1c1 | r1c2 |
| r2c1 | r2c2 |
        `,
        "templates/nav.json": {
            "lis": [
                {
                    "label":"test2",
                    "url": "x.html"
                },
                {
                    "label":"test",
                    "url": "x.html"
                }
            ]
        }
    };

    static get(url, cb) {

        console.log('get', url);
        const res = this.mocks[_Config.folder+'/'+url];
        cb(res);
    }
}