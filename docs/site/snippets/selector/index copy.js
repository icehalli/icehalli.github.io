console.log('selector snippet');

//DEPENDENCIES
    // todos input data in function mock()
    // pushNotify(data);
    // onIdid(data); 

// maybe snippets need to be in a class
// that is configured with input function setup(data);
// or snippets have listeners triggered with snippetInit event
// so basically in and out events
const SELECTOR = (function () {
    function setup(){
        sendEvent('dataRequest', {dataKey: 'todos'});
        //onTodos({data:mock()});
    }

    let fixedTodos = null;

    function onTodos(todos) {
        fixedTodos = todos;
        if(!todos || !todos.data)
            return;
        var t = Object.keys(todos.data);
        for(let d of t){
            let todo = todos.data[d];
            addTodo(todo.val);        
        }
    }

    function getImage(val) {
        var imgs = getTodos();
        for(var t of imgs){
            if(t.do === val)
                return t.img;
        }
        return '';
    }

    function getTodos(){
        return [
            {id:1, order:1, do:'Setti í vél', img:'https://source.unsplash.com/mAWTLZIjI8k'},
            {id:2, order:2, do:'Fór út með Mosa', img:'https://source.unsplash.com/BmisHZUE750'},
            {id:3, order:3, do:'Gaf Mosa að borða', img:'https://source.unsplash.com/RCDcigzmtII'},
            {id:4, order:4, do:'Eldaði', img:'https://source.unsplash.com/APDMfLHZiRA'},
            {id:5, order:5, do:'Gekk frá eftir mat', img:'https://source.unsplash.com/Q7YAlDm3xSo'},
            {id:6, order:6, do:'Verslaði', img:'https://source.unsplash.com/QsYXYSwV3NU'},
        ];
    }

    function addTodo(val){    
        let free = document.getElementsByClassName('free2');
        if(free.length > 0){
            var el = free[0];
            let span = el.querySelector('span');
            span.dataset.text = val;
            span.innerHTML = val;
            var imgUrl = getImage(val);
            if(imgUrl) {
                let img = el.querySelector('img');
                img.src = imgUrl;
            }
            else//for now only image/known actions are shown as buttons
                return;
            el.classList.remove('free2');
            el.addEventListener('click', onElementClick);
        }
        else{
            appendTodo(val);
        }
    }

    function receiveEvent(evtName, data){
        console.log(evtName, data)
        onTodos({data:data});
       // dispatchEvent(new CustomEvent('Selector:' + evtName, { detail: data }));
    }
    function sendEvent(evtName, data){
        dispatchEvent(new CustomEvent('SELECTOR:' + evtName, { detail: data }));
    }

    function onElementClick(e){
        var data = e.currentTarget.querySelector('span').innerHTML;
        // pushNotify(data);
        // onIdid(data); 
        //console.log('onElementClick', data);
        sendEvent('onElementClick', data);
    }


    function appendTodo(val){
        const img = document.createElement("img");
        img.src = "https://source.unsplash.com/WtolM5hsj14";
        
        const span = document.createElement("span");
        span.innerHTML = val;

        const div = document.createElement("div");
        div.classList.add('overlay')
        div.appendChild(span);
        
        const newDiv = document.createElement("li");
        newDiv.classList.add('did');
        
        newDiv.appendChild(img);
        newDiv.appendChild(div);
        
        newDiv.addEventListener('click', (e) => {
            onIdid(e.currentTarget.innerHTML);
        });
        
        document.getElementById('image-gallery').appendChild(newDiv);
    }


    function mock(){
        return {
            "-NxEpcfl4bzv0UP9lEPO": {
                "timestamp": "2024-05-06T21:36:52.109Z",
                "user": "d@d.is",
                "val": "Fór út með Gosa"
            },
            "-NxEpgd9ej7CGbD_ruco": {
                "timestamp": "2024-05-06T21:37:08.326Z",
                "user": "d@d.is",
                "val": "Gaf Mosa að borða"
            },
            "-NxEpiwSSk1rd_xLY4pJ": {
                "timestamp": "2024-05-06T21:37:17.754Z",
                "user": "d@d.is",
                "val": "Setti í vél"
            },
            "-NxEpm4aNzWZXHWltnOM": {
                "timestamp": "2024-05-06T21:37:30.627Z",
                "user": "d@d.is",
                "val": "Gekk frá eftir mat"
            },
            "-NxEpnnWH5Eu1PDZKt9q": {
                "timestamp": "2024-05-06T21:37:37.662Z",
                "user": "d@d.is",
                "val": "Verslaði"
            },
            "-NxEpp7W9XX9x2aDtHQw": {
                "timestamp": "2024-05-06T21:37:43.101Z",
                "user": "d@d.is",
                "val": "Eldaði"
            }
        }
    }
    return {
        Setup() {
            setup();
        },
        SendEvent(evt, data) {
            receiveEvent(evt, data);
        }
    }
})();

window.SELECTOR = SELECTOR;
