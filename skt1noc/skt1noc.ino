//Librerias nesesarias para la funcionacion por wifi con web sockets
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.hpp>
#include <ArduinoJson.h>

#include "time.h"
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = -25200;
const int   daylightOffset_sec = -25200;
int second;
int minute;
int hour;
int day;
int month;
int year;
int weekday;
long current;
struct tm timeinfo;


#include <FirebaseESP32.h>
#define FIREBASE_HOST "integradora-firebase.firebaseio.com"
#define FIREBASE_AUTH "0mRiPl63WtUotvjTuZ8ddRyKQ1dBnOHpSQeJHWCl"

String path="/dispositivo";
FirebaseData firebaseData;  




// Constants
const char* ssid ="Angel";
const char* password ="123456789";
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

   Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
   Firebase.reconnectWiFi(true);

    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
  // Iniciar WebSocket server y asignar callback
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);

}
 void printLocalTime()
{

  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  
}

void loop() {
 
  //  WebSocket data
  firebase();
  webSocket.loop();
 
  //Llamado automatico
  
}

String date()
{
  delay(1000);
  
  printLocalTime();
  second = timeinfo.tm_sec;
  minute = timeinfo.tm_min;
  hour = timeinfo.tm_hour+7;
  day = timeinfo.tm_mday;
  month = timeinfo.tm_mon + 1;
  year = timeinfo.tm_year + 1900;
  weekday = timeinfo.tm_wday +1;
   String hora=String(hour);
  String minutos=String(minute);
  String segundos=String(second);
  String dias=String(day);
  String mes=String(month);
  String ano=String(year);
  String fecha=hora+":"+minutos+":"+segundos+" "+dias+"/"+mes+"/"+ano;
  //String fecha;
  return fecha;
  }
int primero=1;
void firebase(){
String id="1";
double gas;
gas=(double)getSensor();
if(primero==1){
FirebaseJson json1;
json1.set(id+"/ppm",gas);
json1.set(id+"/apagado",gascosa());
json1.set(id+"/fecha",date());
Firebase.set(firebaseData, path,json1);
primero=primero+1;
}
else{
  Firebase.pushDouble(firebaseData,path+"/"+id+"/ppm",gas);
  Firebase.pushInt(firebaseData,path+"/"+id+"/apagado",gascosa());
  Firebase.pushString(firebaseData,path+"/"+id+"/fecha",date());
  
}

}

//Mensaje json
String mensaje(){
const int    capacidad=JSON_OBJECT_SIZE(2);
StaticJsonDocument<capacidad> doc;
doc["ppm"]=getSensor();
doc["apagado"]=gascosa();

String  msg;
serializeJson(doc,msg);

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