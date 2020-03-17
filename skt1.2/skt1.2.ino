



//Librerias nesesarias para la funcionacion por wifi con web sockets
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.hpp>
#include <ArduinoJson.h>
#include <IOXhop_FirebaseESP32.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
//fecha
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
String formattedDate;
String dayStamp;
String timeStamp;
//FIREBASE
#define FIREBASE_HOST "integradora-firebase.firebaseio.com"
#define FIREBASE_AUTH "0mRiPl63WtUotvjTuZ8ddRyKQ1dBnOHpSQeJHWCl"
String path="/dispositivo";
 
// Constants
const char* ssid ="HOME-9A5F";
const char* password ="34C2C203B9BCC426";
const char *msg_toggle_led = "toggleREL";
const char *msg_get_led = "getRELState";
const int sensor=32;
float sensorValue;
const int rel_pin=4;
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
 //FIREBASE
 
  //3. Set your Firebase info

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  //4. Enable auto reconnect the WiFi when connection lost
  Firebase.reconnectWiFi(true);
    timeClient.begin();
    timeClient.setTimeOffset(25200);
  // Iniciar WebSocket server y asignar callback
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}

String date(){
  while(!timeClient.update()) {
    timeClient.forceUpdate();
  }
   formattedDate = timeClient.getFormattedTime();
  Serial.println(formattedDate);

  // Extract date
  int splitT = formattedDate.indexOf("T");
  dayStamp = formattedDate.substring(0, splitT);
  return dayStamp;

}

String hora(){
   while(!timeClient.update()) {
    timeClient.forceUpdate();
  }
   formattedDate = timeClient.getFormattedTime();
  Serial.println(formattedDate);

  // Extract date
  int splitT = formattedDate.indexOf("T");
  
  // Extract time
  timeStamp = formattedDate.substring(splitT+1, formattedDate.length()-1);
  return timeStamp;
}

void firebase(){
  String msg=mensaje();
Firebase.set( path , msg);
  
}
void loop() {
 
  //  WebSocket data
  webSocket.loop();
 firebase();
 
  //Llamado automatico
  
}
//Mensaje json
String mensaje(){
const int    capacidad=JSON_OBJECT_SIZE(4);
StaticJsonDocument<capacidad> doc;
doc["ppm"]=getSensor();
doc["apagado"]=gascosa();
doc["fecha"]=date();
doc["hora"]=hora();
String  msg;
serializeJson(doc,msg);
//Serial.println(msg);
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
      /*char letras[100]; 
        mensaje().toCharArray(letras,100);
        sprintf(msg_buf,"%s",letras);
        Serial.printf("enviando to [%u]:%s\n",cliente,msg_buf);
        webSocket.sendTXT(cliente,msg_buf);*/
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
 if(getSensor()>300){
  rel_state=0;
digitalWrite(rel_pin,rel_state);

 }
 return rel_state;
}

float getSensor(){
  sensorValue=analogRead(sensor);
  return sensorValue;
    
}