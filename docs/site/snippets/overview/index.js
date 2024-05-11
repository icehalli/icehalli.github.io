window.snippPool.OVERVIEW = (function () {
    let containerOverview = null;
    function setup(){
        containerOverview = document.getElementById('container-overview');
        sendEvent('dataRequest', {dataKey: 'history'});
    }

    //communication    
    function receiveEvent(evtName, data){        
        //entrypoint to closure
        console.log(evtName, data)
        groupOverViewData(data)
    }
    function sendEvent(evtName, data){
        dispatchEvent(new CustomEvent('OVERVIEW:' + evtName, { detail: data }));
    }

    //internal logic
    
function groupOverViewData(data){
    var res = {};
    if(data) {
        var t = Object.keys(data);
        for(let d of t){
            var f = data[d];
            // if(f.user !== user)
            //     continue;
            var date = new Date(f.timestamp);
            var year = date.getFullYear().toString();
            var month = MonthName((date.getMonth() + 1).toString());
            var dayofmonth = date.getDate().toString();
            var dayofweek = date.getDay().toString();
            var time = `${(date.getHours() + '').padStart(2, '0')}:${(date.getMinutes()+'').padStart(2, '0')}`
            if(!res[year])
                res[year] = {};
            if(!res[year][month])
                res[year][month] = {};
            if(!res[year][month][dayofmonth+'|'+dayofweek])
                res[year][month][dayofmonth+'|'+dayofweek] = [];
            f.time = time;
            res[year][month][dayofmonth+'|'+dayofweek].push({time: f.time, val: f.val});
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
    containerOverview.appendChild(getbr(key, 'overview-year'))
    var obs = Object.keys(res);
    for(let y of obs.reverse()) {
        addMonth(y, res[y]);
    }
}

function addMonth(key, res){
    //containerOverview.appendChild(getbr(key, 10))
    var obs = Object.keys(res);
    for(let y of obs.reverse()) {
        addDays(y, key, res[y]);
    }
}
function addDays(d, m, res){
    var dAndWeekday = d.split('|');
    var d = dAndWeekday[0];
    var weekday = dAndWeekday[1];
    containerOverview.appendChild(getbr(WeekDayName(weekday) + ' ' + d + '.' + m, 'overview-day'))
    var el = document.createElement('hr');
    //containerOverview.appendChild(el);
    var obs = Object.keys(res);
    for(let y of obs.reverse()) {
        addTimes(y, res[y]);
    }
}

function getbr(inner, cls, padding=0){
    var el = document.createElement('div');
    el.classList.add(cls);
    el.style.paddingLeft = padding + 'px';
    el.innerHTML = inner;
    return el;
}
function addTimes(key, res){
    containerOverview.appendChild(getbr(res.time + ' ' + res.val, 'overview-time'))
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

function WeekDayName(i){
    const wd = {
        '0':'Sun',
        '1':'Mán',
        '2':'Þri',
        '3':'Mið',
        '4':'Fim',
        '5':'Fös',
        '6':'Lau',
    }
    return wd[i];
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
// window.OVERVIEW = OVERVIEW;