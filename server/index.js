var webSocketServer = require('ws').Server;
var wss = new webSocketServer({ port: 5001});

var count = 0;
wss.on('connection',function(ws){
    var user = '';
    count++;
    console.log('Curent clients:'+count);
    console.log('[Server] connected!')
    ws.on('message', function(data){
        var newData = JSON.parse(data); 
        console.log(`[Server] received ${data}`);
        user = newData.user;

        wss.clients.forEach(client => {
            if(client == ws){
                newData.type = 'request';
            }else{
                newData.type = 'response';
            }
            client.send(JSON.stringify(newData),(err)=>{
                if(err){
                    console.log(`[Server] error: ${err}`);
                }
            });
        });
        
        
        // var feedback = {
        //     type:'response',
        //     msg:'We have received your messaage.'
        // };

        // function addMsg(){
            
        //     switch(newData.user){
        //         case 'Amy':
        //             feedback.msg = 'Amy, nice to see you!'+feedback.msg;
        //             console.log("[test]"+feedback.msg);
        //             break;
        //         case 'Bora':
        //             feedback.msg = 'Hi Bora!'+feedback.msg;
        //             break;
        //         case 'Cherry':
        //             feedback.msg ='Hey! Fat Cherry!'+ feedback.msg;
        //             break;
        //         default:
        //             break;
        //     }
        // }
        // async function send(){
        //     await addMsg();
        //     ws.send(JSON.stringify(feedback));
        //     console.log(JSON.stringify(feedback));
        // }
        // send();
    } );
    
    ws.on('close',function(){
        count --;
        console.log('[Server] Lost a client.');
        console.log('Online clients:'+count);
        var date = new Date();
        newData = {
            type: 'notify',
            user: user,
            msg: '[Left chat room]',
            time: date.getTime(),
        }
        wss.clients.forEach(client => {
            if(client != ws){
                client.send(JSON.stringify(newData),(err)=>{
                    if(err){
                        console.log(`[Server] error: ${err}`);
                    }
                });
            }
        });
    });
});

// wss.on('connection', function (ws) {
//     console.log(`[SERVER] connection()`);
//     ws.on('message', function (message) {
//         console.log(`[SERVER] Received: ${message}`);
//         ws.send(`ECHO: ${message}`, (err) => {
//             if (err) {
//                 console.log(`[SERVER] error: ${err}`);
//             }
//         });
//     })
// });

// wss.on('connection', function(ws){
//     console.log('Connected!')
    
//     //當偵測收到訊息時，執行動作
//     ws.on('message',function(message){
//         console.log('Receieve:'+ message);

//         if(message == 'Hello'){
//             ws.send('Hey there from the server');
//             console.log('1');
//         }else{
//             ws.send('what did you say?');
//             console.log('2');
//         }
//     })
// })