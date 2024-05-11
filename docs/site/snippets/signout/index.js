
window.snippPool.SIGNOUT = (function () {

    function setup(){
        sendEvent('dataRequest', {dataKey: 'user'});   
    }
    function sendEvent(evtName, data){
        dispatchEvent(new CustomEvent('SIGNOUT:' + evtName, { detail: data }));
        //outside listener for e.g. onElementClick
    }
    //interface
    return {
        Setup() {
            setup();
        },
        SendEvent(evt, data) {
        }
    }
})();