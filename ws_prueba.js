
 //Conexion a el websocket con lo que el hardware haya lanzado
var url = "ws://192.168.0.11:80/";

var output;
var button;
var canvas;
var context;
//var intervalo = setInterval(doSend("getRELState"), 1000);

function init() {

 
    // ELEMENTOS HTML
    button = document.getElementById("toggleButton");
    output = document.getElementById("output");
    canvas = document.getElementById("relevador");
    
    // ELEMENTO HTML
    context = canvas.getContext("2d");
    context.arc(25, 25, 15, 0, Math.PI * 2, false);
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.stroke();
    context.fillStyle = "black";
    context.fill();
    
    
    wsConnect(url);
}
 
// conexion a WebSocket server
function wsConnect(url) {
    
    // Creacion de objeto para conexion y conexion
    websocket = new WebSocket(url);
    //var intervalo = setInterval(doSend("getRELState"), 1000);
    // eventos de websocket
    websocket.onopen = function(evt) { onOpen(evt)  };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) 
    var intervalo = setInterval(doSend("getRELState"), 5000);
};
    websocket.onerror = function(evt) { onError(evt) };
}
 
// CUANDO SE ESTABLECE LA CONEXION
function onOpen(evt) {
 
    // CONEXION 
    console.log("Connected")
    
    // BOTON
    button.disabled = false;
    
    // OBTENIENDO RELEVADOR
    doSend("getRELState");
}
 
// CERRAR CONEXION
function onClose(evt) {
 
    // MENSAJE DE DESCONEXION
    console.log("Disconnected");
    
    // Disable BUTTON
    button.disabled = true;
    
    // RECONEXION
    setTimeout(function() { wsConnect(url) }, 2000);
}
 
// CUANDO WEBSOCKET MANDA MENSAJE
function onMessage(evt) {
 
    // IMPRIME MENSAJE
    console.log(evt.data);
    json=JSON.parse(evt.data);
    //console.log(": " + json);
    // ACTUALIZA HTML
    switch(evt.data) {
        case "0":
            console.log("RELEBADOR esta apagado");
            context.fillStyle = "black";
            context.fill();
            break;
        case "1":
            console.log("RELEBADOR  esta encendido");
            context.fillStyle = "red";
            context.fill();
            break;
        default:
            break;
    }
}
 
// SI UN ERROR SUCEDE
function onError(evt) {
    console.log("ERROR: " + evt.data);
} 
 
// IMPRIME EL ESTADO DE EL WEBSOCKET
function doSend(message) {
    console.log("Sending: " + message);
    websocket.send(message);
}
 
// LLAMADO CADA QUE DE PRESIONE EL BOTON
function onPress() {
    doSend("toggleREL");
    doSend("getRELState");
}

 
// PARA LLAMAR LAS FUNCIONES CUANDO LA VENTANA SE ACTUALICE 
window.addEventListener("load", init, false);
//var intervalo = setInterval(doSend("getRELState"), 1000);

