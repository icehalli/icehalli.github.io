class _Ajax {
    static getInFolder(url, cb) {
        if(_Config.isMock)
            this.get(url,cb);
        else
            this.get(_Config.folder + '/' + url);
    }
    static get(url, cb) {
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                cb(json);
            });
        // fetch(url)
        //     .then(handleFulfilledA, function(data){
        //         cb(data);
        //     });
        // const myPromise = new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //       resolve("foo");
        //     }, 300);
        //   });
        // const response = await fetch(url);
        // const movies = await response.json();
        // cb(movies);
        
    }
    
    static get2(url, cb) {
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
    static mocksReady = false;
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

    static setupMock(){
        this.mocks.plans = {};
        this.mocks.templates = {};
        this.mocks.something = {};
        // plans
        this.mocks.plans["current.md"] = `
# mock :muscle:
| a | b |
| - | - |
| r1c1 | r1c2 |
| r2c1 | r2c2 |
                `;
        // templates
        this.mocks.templates["current.md"] = `
# mock :muscle:
| a | b |
| - | - |
| r1c1 | r1c2 |
| r2c1 | r2c2 |
                `;
        this.mocks.templates["nav.json"] = {
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
        };
        // something
        this.mocks.something["index.md"] = `
# mock :muscle:
| a | b |
| - | - |
| r1c1 | r1c2 |
| r2c1 | r2c2 |
                `;
        this.mocks.something["something.md"] = '# someghing file';

        this.mocks.something["index.json"] = {
            "header": "Something",
            "lis": [
                {
                    "label":"index",
                    "url": "index.html"
                },
                {
                    "label":"something",
                    "url": "something.md"
                }
            ]
        };
        this.mocksReady = true;
    }

    static get(url, cb) {
        if(!this.mocksReady)
            this.setupMock();
        if(!this.mocks[_Config.folder])
            cb('# folder not found ' + _Config.folder);
        else if(!this.mocks[_Config.folder][url])
            cb('# file ' + url + ' not found in folder ' + _Config.folder);
        else {
            const res = this.mocks[_Config.folder][url];
            cb(res);
        }
    }
}