
import { iDid, addItem, signOutUser, createUser, signInUser, getCurrentUser } from "./fb.js"

const loginContainer = document.querySelector('#login');
const mainContainer = document.querySelector('#main');

let userEl = document.querySelector('#user');
let signoutEl = document.querySelector('#signout');
let overviewEl = document.querySelector('#overview');


let login = document.querySelector('.login');
let create = document.querySelector('.create');
let container = document.querySelector('.container-login');
let containerOverview = document.querySelector('#container-overview');
let submit = document.querySelector('#submit');

let password = document.querySelector('#password');
let password2 = document.querySelector('#password2');
let username = document.querySelector('#username');
let email = document.querySelector('#email');

let loginemail = document.querySelector('#loginemail');
let loginpassword = document.querySelector('#loginpassword');

function showMain(){
    mainContainer.style.display = 'block';
    loginContainer.style.display = 'none';
    containerOverview.style.display = 'none';  
}
function showLogin(){
    mainContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    containerOverview.style.display = 'none';  
}
function showOverview(){
    mainContainer.style.display = 'none';
    loginContainer.style.display = 'none';
    containerOverview.style.display = 'block';    
}

// //data 
// onValue(starCountRef, (snapshot) => {
//     const data = snapshot.val();
//     updateStarCount(postElement, data);
//   });
//input way

const textInput = document.getElementById('inp-hide');
    textInput.addEventListener('keydown', (event) => {
        
      if (event.key === 'Enter') {
        let userId = 'anonymous';
        let user = getCurrentUser();
        if(user)
            userId = user.email;
        else{
            showLogin();
            return;
        }
        console.log('Enter key pressed!', userId);
        //return;
        var content = {
            val: textInput.value,
            timestamp: new Date().toJSON(),
            user: userId
        }
        addItem(content);
        textInput.value = '';
        // Perform desired actions here
      }
    });

//data events
window.addEventListener("onTodos", (e) => {
    onTodos(e.detail);
});
window.addEventListener("onMyTodos", (e) => {
    onMyTodos(e.detail);
});

let allTodos = null;
function onMyTodos(mytodos){
    allTodos = mytodos;
    console.log(allTodos);
}


function onTodos(todos) {
    if(todos && todos.data){
        console.log('onTodos', todos);
        var t = Object.keys(todos.data);
        for(let d of t){
            let todo = todos.data[d];
            addTodo(todo.val);        
        }
    }
}
function addTodo(val){    
    let free = document.getElementsByClassName('free');
    if(free.length > 0){
        var el = free[0];let span = el.querySelector('span');
        span.innerHTML = val;
        var imgUrl = getImage(val);
        if(imgUrl) {
            let img = el.querySelector('img');
            img.src = imgUrl;
        }
        else{
            //for now only image/known actions are shown as buttons
            return;
        }
        el.classList.remove('free');
        el.addEventListener('click', (e) => {
            onIdid(e.target.innerHTML);
        });
    }
    else{
        appendTodo(val);
    }
}

function onIdid(val){    
    let userId = 'anonymous';
    let user = getCurrentUser();
    if(user)
        userId = user.email;
    else{
        showLogin();
        return;
    }
    //return;
    var content = {
        val: val,
        timestamp: new Date().toJSON(),
        user: userId
    }
    iDid(content);
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
        onIdid(e.target.innerHTML);
    });
    
    document.getElementById('image-gallery').appendChild(newDiv);
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

// clicks
container.classList.add('signinForm');
login.onclick = function(){
    container.classList.add('signinForm');
}

create.onclick = function(){
    container.classList.remove('signinForm');
}

loginsubmit.onclick = function(){
    signInUser(loginemail.value, loginpassword.value);
}

submit.onclick = function(){
    createUser(email.value, password.value);
}

signoutEl.onclick = function(){
    signOutUser();
}

overviewEl.onclick = function(){
    overview();
}

function overview(){
    showOverview();    
    var t = Object.keys(allTodos.data);
    for(let d of t){
        var div = document.createElement('div');
        var f = allTodos.data[d];
        var date = new Date(f.timestamp);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        div.innerHTML = f.val + ' ' + formattedDate;
        containerOverview.appendChild(div);  
    }
}

//auths

window.addEventListener("signInUser", (e) => {
    onSignin(e.detail);
});

window.addEventListener("signOutUser", (e) => {
   onSignout(e.detail); 
});

window.addEventListener("onAuthStateChanged", (e) => {
    onAuthchange(e.detail);
});

window.addEventListener("createUser", (e) => {
    onCreateuser(e.detail);
});

function onCreateuser(d){
    if(d.success){
        console.log('success');
        container.classList.add('signinForm');
    }
    else{
        console.log(d.msg);
    }
}

function onSignin(d){//oaisfdoi29090öas
    if(d.success){
        onSigninSuccess(d.user);
    }
    else{
        onSigninFail(d.msg)
    }
}

function onSigninSuccess(user){//oaisfdoi29090öas
    showMain();
    console.log(user);
}

function onSigninFail(d){//oaisfdoi29090öas
    console.log('loginfail');
}

function onSignout(d){
    
}
function showUser(user){
    userEl.innerHTML = user ? user.email : '';
    signoutEl.style.display = user ? 'block' : 'none';    
    overviewEl.style.display = user ? 'block' : 'none';        
}
function onAuthchange(d){
    if(d.success){
        if(d.user){
            console.log('authin', d.user.email);
            showMain();
            showUser(d.user);
            //getTodos();
        }
        else
            showLogin();
            showUser(d.user);
    }
    else{
        console.log('authout:fail')
    }
}



//showLogin();
