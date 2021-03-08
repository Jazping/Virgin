window.WsTest = function(wsUrl,events){
	if(typeof WebSocket != 'function'){
		alert("not websocket allowed!");
		return;
	}
	var connection = new WebSocket(wsUrl);
	var isOpen = false;
	var con = connection;
	con.onopen = function (e) {
		if(e.type == 'open'){
			isOpen = true;
			if(events&&typeof events.onopen == 'function'){
				events.onopen(e);
			}else{
				console.log('Connection to server opened');
			}
		}else{
			console.error(e);
		}
    };
    con.onmessage = function(e){
    	try{
    		if(events&&typeof events.onmessage == 'function' && e.data){
            	events.onmessage(e,JSON.parse(e.data));
            }else if(typeof e.data == 'string'){
            	var data = JSON.parse(e.data);
            	console.log(data.position);
            }else if(e.data){
            	console.error("unknow data type!");
            }
    	}catch(e){
    		console.error(e);
    	}
    };
    con.onerror = function(e){
    	if(events&&typeof events.onerror == 'function'){
        	events.onerror(e);
        }else{
        	throw e;
        }
    };
    con.onclose = function(e){
    	if(events&&typeof events.onclose == 'function'){
        	events.onclose(e);
        }else{
        	console.log('Connection to server closed');
        }
    };
    
    this.isOpen = function(){
    	return isOpen;
    };
    
    this.send = function(body){
    	con.send(body);
    }
} 