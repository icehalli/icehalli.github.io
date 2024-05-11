
window.snippPool.SIGNUP2 = (function () {
    let submit;    
    let password;
    let email;
    function setup(){
        //private
        submit = document.querySelector('#submit-signup');
        password = document.querySelector('#password');
        password.addEventListener(`focus`, () => password.select());
        email = document.querySelector('#email');
        email.addEventListener(`focus`, () => email.select());

        submit.onclick = function(){
            const success = {cb: 'SIGNUP2:saveSuccess', msg:"Notandi vistaður"};
            const fail = {cb: 'SIGNUP2:saveFail', msg:"Smá klikk eitthvað"};
            const callback = {
                success,
                fail
            }
            // sendEvent('saveUser', getData(), 'Vista notanda', callback);
            sendEvent('createUser', getData(), 'Stofna notanda', callback)
            //createUser(email.value, password.value);
            // window.addEventListener("SIGNUP2:createUser", (e) => {
            //     console.log("SIGNUP:createUser", e.detail);
            // });
        }
    }
    function getData(val) {
        return {
            email:email.value,
            password: password.value
        }
    }

    //communication    
    function receiveEvent(evtName, data){        
        //entrypoint to closure
        //console.log(evtName, data)
    }
    function sendEvent(evtName, data, msg, cb){
        dispatchEvent(new CustomEvent('SIGNUP2:' + evtName, { detail: {data, msg, cb} }));
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
// window.SIGNUP2 = SIGNUP2;