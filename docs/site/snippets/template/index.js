
const TEMPLATE = (function () {
    function setup(){
        //private
    }

    //communication    
    function receiveEvent(evtName, data){        
        //entrypoint to closure
        //console.log(evtName, data)
    }
    function sendEvent(evtName, data){
        dispatchEvent(new CustomEvent('TEMPLATE:' + evtName, { detail: data }));
        //outside listener for e.g. onElementClick
        window.addEventListener("TEMPLATE:onElementClick", (e) => {
            console.log("TEMPLATE:onElementClick", e.detail);
        });
    }

    // internal click or some internal event
    function onElementClick(e){
        var data = e.currentTarget.querySelector('span').innerHTML;
        // pushNotify(data);
        // onIdid(data); 
        //console.log('onElementClick', data);
        sendEvent('onElementClick', data);
    }

    //interface
    return {
        Setup() {
            setup();
        },
        SendEvent(evt, data) {
            receiveEvent(evt, data);
        }
    }
})();
window.TEMPLATE = TEMPLATE;