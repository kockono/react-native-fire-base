
//Librerias nesesarias para la funcionacion por wifi con web sockets
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.hpp>
#include <ArduinoJson.h>
 
// Constants
const char* ssid ="tantive-iv";
const char* password ="0KOZXOEM";
const char *msg_toggle_led = "toggleREL";
const char *msg_get_led = "getRELState";
const int sensor=32;
float sensorValue;
const int rel_pin=15;
// Globals
WebSocketsServer webSocket = WebSocketsServer(80);
char msg_buf[100];
int rel_state=0;


void setup() {
  //Setup sensorer y actuadores
  pinMode(sensor,INPUT);
 pinMode(rel_pin,OUTPUT);
 rel_state=1;
 digitalWrite(rel_pin,rel_state);
 
  // Serial port
  Serial.begin(9000);
 
  // Connect to access point
  Serial.println("Connecting");
  WiFi.begin(ssid, password);
  while ( WiFi.status() != WL_CONNECTED ) {
    delay(500); 
    Serial.print(".");
  }
 
  // Imprimir  IP address
  Serial.println("Connected!");
  Serial.print("My IP address: ");
  Serial.println(WiFi.localIP());
 
  // Iniciar WebSocket server y asignar callback
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}
 
void loop() {
 
  //  WebSocket data
  webSocket.loop();
 
  //Llamado automatico
  
}
//Mensaje json
String mensaje(){
const int    capacidad=JSON_OBJECT_SIZE(2);
StaticJsonDocument<capacidad> doc;
doc["ppm"]=getSensor();
doc["apagado"]=gascosa();

String  msg;
serializeJson(doc,msg);
Serial.println(msg);
return msg;   
}

 // Llamado al recibir los mensajes  WebSocket
void onWebSocketEvent(uint8_t cliente,
                      WStype_t type,
                      uint8_t * payload,
                      size_t length) {
 
  // control de mensajes 
  switch(type) {
 
 
 //Si el cliente de ha desconectado
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", cliente);
      gascosa();
      break;
 
    // New client conectado
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(cliente);
        Serial.printf("[%u] Connection from ", cliente);
        Serial.println(ip.toString());
      }
      break;
 
    // Mensaje por parte del cliente         
    case WStype_TEXT:
      Serial.printf("[%u] Text: %s\n", cliente, payload);
      //webSocket.sendTXT(cliente, payload);
      //Prender Relay
      if(strcmp((char *)payload, "toggleREL")==0){  
        rel_state=rel_state? 0:1;
       Serial.printf("Toggling Relevador to %u\n",rel_state);
        digitalWrite(rel_pin,rel_state);
       
        //if(rel_state==0){
          //digitalWrite(rel_pin,HIGH);
        //}
        //else if (rel_state==1){
          //digitalWrite(rel_pin,LOW);
       // }
      }else if(strcmp((char *)payload ,"getRELState")==0){
        char letras[100]; 
        mensaje().toCharArray(letras,100);
        sprintf(msg_buf,"%s",letras);
        Serial.printf("enviando to [%u]:%s\n",cliente,msg_buf);
        webSocket.sendTXT(cliente,msg_buf);
      }else{
       Serial.println("[%u] Message not recognized");
      }
      break;
 
    // Todos los tipos de mensaje que se pueden recibir
    case WStype_BIN:
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
    default:
      break;
  }
}

//Metodo automatico para activar y desactivar relevador
int gascosa(){
 if(getSensor()>100){
  rel_state=0;
digitalWrite(rel_pin,rel_state);

 }
 return rel_state;
}

float getSensor(){
  sensorValue=analogRead(sensor);
  return sensorValue;
    
}
