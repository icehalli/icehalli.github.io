let useMock = !true;

if(useMock) {
    window['mock'] = useMock;
    // setTimeout(() => {
    //     //mockNotSignedInUser();
    //     mockSignedInUser();
    //     sendtodohistory(getHistoryMock());        
    //     setTimeout(() => {            
    //         mockTodoData();
    //     }, 1000);
    // }, 1000);
    function mockNotSignedInUser(){
        sendauthchange(null);
    }
    function mockSignedInUser(){
        sendauthchange(getUserLoggedInMockShort());
    }
    function mockTodoData(){
        sendfixedtodos(getTodosDataMock());
    }
    //send fixed todos
    function sendfixedtodos(data){
        dispatchEvent(new CustomEvent("onTodos", { detail: {success: true, data: data} }));
    }
    //send todo history
    function sendtodohistory(data){
        dispatchEvent(new CustomEvent("onMyTodos", { detail: {success: true, data: data} }));
    }
    //send users
    function sendusers(){
        dispatchEvent(new CustomEvent("onUsers", { detail: {success: true, data: data} }));
    }
    //send auth change
    function sendauthchange(user){
        dispatchEvent(new CustomEvent("onAuthStateChanged", { detail: {success: true, user: user} }));
    }
    //send user saved
    function sendusersaved(){
        dispatchEvent(new CustomEvent("setUser", { detail: {success: true, user: something} }));   
    }
    //send user saved failed
    function sendusersavedfailed(){
        dispatchEvent(new CustomEvent("setUser", { detail: {success: false, msg: error.message} }));
    }
    //user created success
    function usercreatedsuccess(){
        dispatchEvent(new CustomEvent("createUser", { detail: {success: true, user: user} }));
    }
    //user created fail
    function usercreatedfail(){
        dispatchEvent(new CustomEvent("createUser", { detail: {success: false, msg: error.message} }));
    }
    //user signed in succes
    function usersignedinsuccess(user){
        dispatchEvent(new CustomEvent("signInUser", { detail: {success: true, user: user} }));
    }
    //user signed in error
    function usersignedinerror(){
        dispatchEvent(new CustomEvent("signInUser", { detail: {success: false, msg: error.message} }));   
    }
    //user signed out fail
    function usersignedoutfail(){
        dispatchEvent(new CustomEvent("signOutUser", { detail: {success: false, msg: error.message} }));
    }
}

function getUserLoggedInMockShort(email, name){
    return {
        "uid": "6bCQ1qAHKfPI2WiYGdKcW8KGW9u1",
        "email": email ? email : "kk@kk.is",
        "emailVerified": false,
        "displayName": name ? name : "nnn",
        "isAnonymous": false,
        "providerData": [
            {
                "providerId": "password",
                "uid": email ? email : "kk@kk.is",
                "displayName": name ? name : "nnn",
                "email": email ? email : "kk@kk.is",
                "phoneNumber": null,
                "photoURL": null
            }
        ]
    }
}

function getUserLoggedInMock(){
    return {
        "uid": "6bCQ1qAHKfPI2WiYGdKcW8KGW9u1",
        "email": "kk@kk.is",
        "emailVerified": false,
        "displayName": "nnn",
        "isAnonymous": false,
        "providerData": [
            {
                "providerId": "password",
                "uid": "kk@kk.is",
                "displayName": "nnn",
                "email": "kk@kk.is",
                "phoneNumber": null,
                "photoURL": null
            }
        ],
        "stsTokenManager": {
            "refreshToken": "AMf-vBzmS3D-0Agul1nbGOodhRlLn-EvjL5aFxmNG3vmrPWT9CbJsZsuC-dHP9Uz6VjmLfKk-BMZbd4euZnHRfIphzSOSpAGYHGm_CXGhHQjIK5Wp_-i8bnssd9-lTaCC_vXGPu_U5DLi61xdvZsTYKOnchiHhm0rJeb4cNIbLwtZbew88YUeXLhK9CzKrHwQBtPVP-M7IuJcXAFYx4BHk7EmkWS1kGYEg",
            "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2MDI3MTI2ODJkZjk5Y2ZiODkxYWEwMzdkNzNiY2M2YTM5NzAwODQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoibm5uIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3BsYXlncm91bmQtOWYwZDYiLCJhdWQiOiJwbGF5Z3JvdW5kLTlmMGQ2IiwiYXV0aF90aW1lIjoxNzE1MTkzMTgwLCJ1c2VyX2lkIjoiNmJDUTFxQUhLZlBJMldpWUdkS2NXOEtHVzl1MSIsInN1YiI6IjZiQ1ExcUFIS2ZQSTJXaVlHZEtjVzhLR1c5dTEiLCJpYXQiOjE3MTUxOTMxODAsImV4cCI6MTcxNTE5Njc4MCwiZW1haWwiOiJra0Bray5pcyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJra0Bray5pcyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.KYiaOrlgB4muCOeUATmgVTOBxOVKwRPN6SQYjEyAlGdh9A_tzkX7btEFzU4atGLlclJL9DwiNYY8EsaY-3dOpM-7yVynZFe4E_pR1M0WMO74gSoGUTVJjity8e0R8-7ZOouAhQOKY3Y4v_fiN912SjPox6A8oP_rwOSeC0UW5wDo8-m2R5DYWK3q7WCZjsc-rlEuTjajI7ADkYFDYxUMdCoSLzFB9bRTPKx9m32NxUAxrP0fdisZNsJ7dFQ9QJvyaufo1lbI_ueICybRlIZNllyFUFnjOMMVz_U45Nbh7EAVelAUW4XJYyEJiTv7-pB1TyJfbLvTUf_dFmY21d6rqA",
            "expirationTime": 1715196783547
        },
        "createdAt": "1715116548315",
        "lastLoginAt": "1715193180039",
        "apiKey": "AIzaSyDyHS1hlhqzZdMvDJkaw4_cN7tmeg1t2d8",
        "appName": "[DEFAULT]"
    }
}

function getTodosDataMock() {
    return {
        "-NxEpcfl4bzv0UP9lEPO": {
            "timestamp": "2024-05-06T21:36:52.109Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
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
function getHistoryMock(){
    return {
        "-NxJ1Dnq0LCUm5Uq8t4n": {
            "timestamp": "2024-05-07T17:10:23.828Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ1T2lERHXarYetHwl": {
            "timestamp": "2024-05-07T17:11:26.280Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ1_hIfmsFXqOP-TPq": {
            "timestamp": "2024-05-07T17:11:57.612Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ1da0e2gMt5tMpq9n": {
            "timestamp": "2024-05-07T17:12:13.528Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ1grtsTPKxp3Gkl1O": {
            "timestamp": "2024-05-07T17:12:26.962Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ4RoyysL2t2DCr1nD": {
            "timestamp": "2024-05-07T17:24:27.672Z",
            "user": "d@d.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJ4Vhb2n4EpbGCOicH": {
            "timestamp": "2024-05-07T17:24:43.586Z",
            "user": "d@d.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJ58QY4b1MoTABd7UY": {
            "timestamp": "2024-05-07T17:27:30.361Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ5M8nCbhQlslqgOB2": {
            "timestamp": "2024-05-07T17:28:26.576Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ5NGzjS5HbXO7kW8z": {
            "timestamp": "2024-05-07T17:28:31.196Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ5WXW51bDVUDaz3Sg": {
            "timestamp": "2024-05-07T17:29:09.110Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ5_6Le8kJSUAonqiF": {
            "timestamp": "2024-05-07T17:29:23.755Z",
            "user": "d@d.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJ6C9eo6RPZ5L_FH3a": {
            "timestamp": "2024-05-07T17:32:07.818Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ6CwcR8YqhqgoI5qQ": {
            "timestamp": "2024-05-07T17:32:11.017Z",
            "user": "d@d.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJ6Dduoo6d9aNtfphT": {
            "timestamp": "2024-05-07T17:32:13.915Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ6Obu2a1t3kEX4iYI": {
            "timestamp": "2024-05-07T17:32:58.835Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJ6PG877aI0RA33phX": {
            "timestamp": "2024-05-07T17:33:01.475Z",
            "user": "d@d.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJ6Q0n-XoWqMU8Q5TD": {
            "timestamp": "2024-05-07T17:33:04.588Z",
            "user": "d@d.is",
            "val": "Fór út með Mosa"
        },
        "-NxJorS8xUxK-v6gwTTQ": {
            "timestamp": "2024-05-07T20:51:37.536Z",
            "user": "nyr@notandi.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJu8cT6cfssdf0zgRa": {
            "timestamp": "2024-05-07T21:14:40.877Z",
            "user": "aaa@bbb.is",
            "val": "Fór út með Mosa"
        },
        "-NxJu9FgN-dONHiEu7ts": {
            "timestamp": "2024-05-07T21:14:43.453Z",
            "user": "aaa@bbb.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJu9n7dpdUcNdHdJji": {
            "timestamp": "2024-05-07T21:14:45.656Z",
            "user": "aaa@bbb.is",
            "val": "Setti í vél"
        },
        "-NxJuAIPqZ2FEUZ_PoyB": {
            "timestamp": "2024-05-07T21:14:47.723Z",
            "user": "aaa@bbb.is",
            "val": "Gekk frá eftir mat"
        },
        "-NxJuB5uPvvJC_zwjY-d": {
            "timestamp": "2024-05-07T21:14:51.019Z",
            "user": "aaa@bbb.is",
            "val": "Verslaði"
        },
        "-NxJuRPUde_6S3oWydai": {
            "timestamp": "2024-05-07T21:15:57.808Z",
            "user": "kk@kk.is",
            "val": "Eldaði"
        },
        "-NxJuRmkVh9jH4tdKWvm": {
            "timestamp": "2024-05-07T21:15:59.360Z",
            "user": "kk@kk.is",
            "val": "Verslaði"
        },
        "-NxJuS5z8xHlHI3Zx1Bz": {
            "timestamp": "2024-05-07T21:16:00.655Z",
            "user": "kk@kk.is",
            "val": "Eldaði"
        },
        "-NxJuS__IB4UYFAOtIo_": {
            "timestamp": "2024-05-07T21:16:02.614Z",
            "user": "kk@kk.is",
            "val": "Setti í vél"
        },
        "-NxJuSlQV06XKdL0Qdpp": {
            "timestamp": "2024-05-07T21:16:03.372Z",
            "user": "kk@kk.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJuT__C3q4zeb5gVtV": {
            "timestamp": "2024-05-07T21:16:06.710Z",
            "user": "kk@kk.is",
            "val": "Gaf Mosa að borða"
        },
        "-NxJuTfKFIFQF_nYnxO6": {
            "timestamp": "2024-05-07T21:16:07.077Z",
            "user": "kk@kk.is",
            "val": "Setti í vél"
        },
        "-NxJuUFTc35zNqn7OXzi": {
            "timestamp": "2024-05-07T21:16:09.455Z",
            "user": "kk@kk.is",
            "val": "Gekk frá eftir mat"
        },
        "-NxJuUXtN_ZdxgQQi1_A": {
            "timestamp": "2024-05-07T21:16:10.633Z",
            "user": "kk@kk.is",
            "val": "Verslaði"
        },
        "-NxJvByloIlUsOijWdIh": {
            "timestamp": "2024-05-07T21:19:16.740Z",
            "user": "kk@kk.is",
            "val": "Setti í vél"
        },
        "-NxM5omsoxBs1P3dY72q": {
            "timestamp": "2024-05-08T07:29:17.860Z",
            "user": "kk@kk.is",
            "val": "Gekk frá eftir mat"
        },
        "-NxMAxQdyJv7vtwn7ijF": {
            "timestamp": "2024-05-08T07:51:46.629Z",
            "user": "aaa@bbb.com",
            "val": "Fór út með Mosa"
        },
        "-NxMAxgAE0OMBQNcAG9r": {
            "timestamp": "2024-05-08T07:51:47.688Z",
            "user": "aaa@bbb.com",
            "val": "Gaf Mosa að borða"
        },
        "-NxMSCMH6Iy1Ae4-1YkK": {
            "timestamp": "2024-05-08T09:07:05.657Z",
            "user": "kk@kk.is",
            "val": "Eldaði"
        },
        "-NxO0pe2T7ZGDyOb3xYY": {
            "timestamp": "2024-05-08T16:26:45.063Z",
            "user": "kk@kk.is",
            "val": "Verslaði"
        },
        "-NxO0pwT-oMNeXIyBjKi": {
            "timestamp": "2024-05-08T16:26:46.241Z",
            "user": "kk@kk.is",
            "val": "Eldaði"
        },
        "-NxOMcfSRAAQCNDHgQoK": {
            "timestamp": "2024-05-08T18:02:02.606Z",
            "user": "aaa@bbb.com",
            "val": "Eldaði"
        }
    }
}

