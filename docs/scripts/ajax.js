class _Ajax {
    static get(url, cb) {
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
    static get(url, cb) {
        const res = `
# mock :muscle:
| a | b |
| - | - |
| r1c1 | r1c2 |
| r2c1 | r2c2 |
        `;
        cb(res);
    }
}