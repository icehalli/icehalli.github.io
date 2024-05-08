
import { writeUserData, iDid, addItem, signOutUser, createUser, signInUser, getCurrentUser } from "./fb.js"

const loginContainer = document.querySelector('#login');
const mainContainer = document.querySelector('#main');

let UserNameInput = document.querySelector('#user-name')
UserNameInput.addEventListener(`focus`, () => UserNameInput.select());
let UserSubmit = document.querySelector('#submit-user');
//let userEl = document.querySelector('#user');
let signoutEl = document.querySelector('#signout');
let overviewEl = document.querySelector('#overview');
let mainviewEl = document.querySelector('#mainview');
let userviewEl = document.querySelector('#userview');


let login = document.querySelector('.login');
let create = document.querySelector('.create');
let container = document.querySelector('.container-login');
let containerOverview = document.querySelector('#container-overview');
let containerUser = document.querySelector('#container-user');
let submit = document.querySelector('#submit');

let password = document.querySelector('#password');
let password2 = document.querySelector('#password2');
let username = document.querySelector('#username');
let email = document.querySelector('#email');

let loginemail = document.querySelector('#loginemail');
loginemail.addEventListener(`focus`, () => loginemail.select());
let loginpassword = document.querySelector('#loginpassword');
loginpassword.addEventListener(`focus`, () => loginpassword.select());

function showMain(){
    mainContainer.style.display = 'block';
    loginContainer.style.display = 'none';
    containerOverview.style.display = 'none';  
    containerUser.style.display = 'none';  
}
function showLogin(){
    mainContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    containerOverview.style.display = 'none';  
    containerUser.style.display = 'none';  
}
function showOverview(){
    mainContainer.style.display = 'none';
    loginContainer.style.display = 'none';
    containerUser.style.display = 'none';    
    containerOverview.style.display = 'block';    
}
function showUser(){
    mainContainer.style.display = 'none';
    loginContainer.style.display = 'none';
    containerUser.style.display = 'block';    
    containerOverview.style.display = 'none'; 
    console.log(CURRENTUSER);   
    UserNameInput.value = CURRENTUSER.displayName;
}

// //data 
// onValue(starCountRef, (snapshot) => {
//     const data = snapshot.val();
//     updateStarCount(postElement, data);
//   });
//input way

let CURRENTUSER = null;
const textInput = document.getElementById('inp-hide');
    textInput.addEventListener('keydown', (event) => {
        
      if (event.key === 'Enter') {
        let userId = 'anonymous';
        CURRENTUSER = getCurrentUser();
        console.log('user', CURRENTUSER);
        if(CURRENTUSER)
            userId = CURRENTUSER.email;
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
window.addEventListener("onUsers", (e) => {
    onUsers(e.detail);
});
let fixedTodos = null;
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
    var doing2 = document.getElementsByClassName('doing');
    if(doing2.length > 0){
        setTimeout(() => {
            console.log('doings', doing2);
            //var span = doing2[0].querySelector('span');
            //span.innerHTML = span.dataset.text;
            doing2[0].classList.remove('doing'); 
        }, 1000);
    }

}

function onUsers(users) {
    console.log('onUsers', users);
}

function onTodos(todos) {    
    fixedTodos = todos;
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
        var el = free[0];
        let span = el.querySelector('span');
        span.dataset.text = val;
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
            console.log(e.currentTarget);
            var data = e.currentTarget.querySelector('span').innerHTML;
            // e.currentTarget.classList.add('blinking');
            // e.currentTarget.querySelector('span').innerHTML = "🔥 Vel gert";
            pushNotify(data);
            onIdid(data);
        });
    }
    else{
        appendTodo(val);
    }
}

function pushNotify(data, title = "🔥 Vel gert", status = null) {//'error', 'warning', 'success', 'info'
    if(status === 'error')
        data = data.replace('Firebase: ', '');
        let f = {};
        if(status === 'error')
            f.status = status;
        f.title = title;
        f.text = data;
        f.autotimeout = status === 'error' ? 5000 : 500;
        
        new Notify(f);
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
        onIdid(e.currentTarget.innerHTML);
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

UserSubmit.onclick = function(){
    var name = UserNameInput.value;
    var ob ={
        displayName: name
      };
    writeUserData(ob);

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
mainviewEl.onclick = function(){
    showMain();
}
userviewEl.onclick = function(){
    showUser();
}

function groupOverViewData(data){
    var res = {};
    if(data) {
        var t = Object.keys(data);
        for(let d of t){
            var f = data[d];
            if(f.user !== getCurrentUser().email)
                continue;
            var date = new Date(f.timestamp);
            var year = date.getFullYear().toString();
            var month = MonthName((date.getMonth() + 1).toString());
            var dayofmonth = date.getDate().toString();
            var time = `${(date.getHours() + '').padStart(2, '0')}:${(date.getMinutes()+'').padStart(2, '0')}`
            if(!res[year])
                res[year] = {};
            if(!res[year][month])
                res[year][month] = {};
            if(!res[year][month][dayofmonth])
                res[year][month][dayofmonth] = [];
            f.time = time;
            res[year][month][dayofmonth].push({time: f.time, val: f.val});
            // const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
            // const formattedTime = `${date.getHours()}:${(date.getMinutes()+'').padStart(2, '0')}`;
            
        }    
    }
        console.log('groupOverViewData', res);
    
    renderOverview(res);

}

function renderOverview(res){
    containerOverview.innerHTML = '';
    var header = document.createElement('h2');
    header.innerHTML = 'Yfirlit'
    containerOverview.appendChild(header);
    var obs = Object.keys(res);
    if(obs.length === 0) {
        containerOverview.appendChild(getbr('You lazy little...grrr'))
        return;
    }
    for(let y of obs) {
        addYear(y, res[y]);
    }
}
function addYear(key, res){
    containerOverview.appendChild(getbr(key))
    var obs = Object.keys(res);
    for(let y of obs) {
        addMonth(y, res[y]);
    }
}
function addMonth(key, res){
    //containerOverview.appendChild(getbr(key, 10))
    var obs = Object.keys(res);
    for(let y of obs) {
        addDays(y, key, res[y]);
    }
}
function addDays(d, m, res){
    containerOverview.appendChild(getbr(d + '.' + m, 20))
    var el = document.createElement('hr');
    containerOverview.appendChild(el);
    var obs = Object.keys(res);
    for(let y of obs) {
        addTimes(y, res[y]);
    }
}

function getbr(inner, padding=0){
    var el = document.createElement('div');
    el.style.paddingLeft = padding + 'px';
    el.innerHTML = inner;
    return el;
}
function addTimes(key, res){
    containerOverview.appendChild(getbr(res.time + ' ' + res.val, 20))
    // containerOverview.appendChild(getbr(res.time))
    // containerOverview.appendChild(getbr(res.val, 10))
}
function MonthName(i){
    const ms = {
        '1':'Jan',
        '2':'Feb',
        '3':'Mar',
        '4':'Apr',
        '5':'Maí',
        '6':'Jún',
        '7':'Júl',
        '8':'Ágú',
        '9':'Sep',
        '10':'Okt',
        '11':'Nóv',
        '12':'Des'
    }
    return ms[i+''];
}

function overview(){
    showOverview();    
    var res = groupOverViewData(allTodos.data);
    // var t = Object.keys(allTodos.data);
    // for(let d of t){
    //     var f = allTodos.data[d];
    //     if(f.user !== getCurrentUser().email)
    //         continue;
    //     addOverviewItem(f);
    // }
}

function addOverviewItem(f){    
    var div = document.createElement('div');
    var date = new Date(f.timestamp);
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${(date.getMinutes()+'').padStart(2, '0')}`;
    div.innerHTML = f.val + ' ' + formattedDate + ' ' + formattedTime;
    containerOverview.appendChild(div);    
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

window.addEventListener("setUser", (e) => {
    if(e.detail.success)
        pushNotify('Vistað', 'Flott', 'Info');
    else
        pushNotify(e.detail.msg, 'Ekki vistað', 'error');
    console.log('setuser:listener', e.detail);
});

function onCreateuser(d){
    if(d.success){
        console.log('success');
        container.classList.add('signinForm');
    }
    else{
        pushNotify(d.msg, 'Obbosí', 'error');
    }
}

function onSignin(d){//oaisfdoi29090öas
    if(d.success){
        onSigninSuccess(d.user);
    }
    else{
        pushNotify(d.msg, 'Obbosí', 'error');
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
function setUser(user){
    CURRENTUSER = user;
    //userEl.innerHTML = user ? user.email : '';
    signoutEl.style.display = user ? 'block' : 'none';    
    overviewEl.style.display = user ? 'block' : 'none'; 
    mainviewEl.style.display = user ? 'block' : 'none'; 
    userviewEl.style.display = user ? 'block' : 'none'; 
    //userviewEl.innerHTML = user ? 'Ég' : '';
}
function onAuthchange(d){
    if(d.success){
        if(d.user){
            console.log('authin', d.user.email);
            showMain();
            setUser(d.user);
            //getTodos();
        }
        else
            showLogin();
            setUser(d.user);
    }
    else{
        console.log('authout:fail')
    }
}



//showLogin();
