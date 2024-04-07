class _Ajax {
    static get(url, cb) {
        $.get(url, function( data ) {
            if(cb)
                cb(data);
        });
    }
}