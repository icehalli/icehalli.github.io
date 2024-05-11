
window.snippPool.USER = (function () {
    let name;
    let email;
    let uid;
    let submit;
    function setup(){
        sendEvent('dataRequest', {dataKey: 'user'});        
    }

    function getData() {
        var ob ={
            displayName: name.value
        };
        return ob;
    }

    function dataReady(data){
        name = document.querySelector('#user-name');
        email = document.querySelector('#user-email');
        uid = document.querySelector('#user-uid');
        name.value = data.displayName;
        email.value = data.email;
        uid.value = data.uid;
        submit = document.querySelector('#submit-user')
        
        window.addEventListener('USER:saveSuccess', (e) => {
            console.log('USER:saveSuccess:callback', e.detail);
            // window.snippPool['OVERVIEW'].SendEvent('history', e.detail.data)
        });
        window.addEventListener('USER:saveFail', (e) => {
            console.log('USER:saveFail:callback', e.detail);
            // window.snippPool['OVERVIEW'].SendEvent('history', e.detail.data)
        });
        submit.onclick = function(){
            console.log('dude')
            const success = {cb: 'USER:saveSuccess', msg:"Notandi vistaður"};
            const fail = {cb: 'USER:saveFail', msg:"Smá klikk eitthvað"};
            const callback = {
                success,
                fail
            }
            sendEvent('saveUser', getData(), 'Vista notanda', callback);
            //createUser(email.value, password.value);
            // window.addEventListener("USER:createUser", (e) => {
            //     console.log("SIGNUP:createUser", e.detail);
            // });
        }
        
        window.addEventListener("setUser", (e) => {
            console.log("setUser:receiver:inside", e.detail);
            // window.snippPool['OVERVIEW'].SendEvent('history', e.detail.data)
        });
    }

    //communication    
    function receiveEvent(evtName, data){        
        //entrypoint to closure
        //console.log(evtName, data)
        dataReady(data);
    }
    function sendEvent(evtName, data, msg, cb){
        dispatchEvent(new CustomEvent('USER:' + evtName, { detail: {data, msg, cb} }));
        //outside listener for e.g. onElementClick
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
// window.USER = USER;