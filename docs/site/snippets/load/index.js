
window.snippPool.LOAD = (function () {

    function setup(){
        sendEvent('dataRequest', {dataKey: 'load'});   
    }
    function sendEvent(evtName, data){
        dispatchEvent(new CustomEvent('LOAD:' + evtName, { detail: data }));
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