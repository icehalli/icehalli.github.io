
window.snippPool.USERSECTION = (function () {

    function setup(){
        sendEvent('dataRequest', {dataKey: 'load'});   
    }
    function sendEvent(evtName, data){
        dispatchEvent(new CustomEvent('USERSECTION:' + evtName, { detail: data }));
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