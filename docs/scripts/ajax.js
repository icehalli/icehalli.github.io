class _Ajax {
    static get(url, cb) {
        if(_Global.isMock) {
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
        cb('# mock');
    }
}