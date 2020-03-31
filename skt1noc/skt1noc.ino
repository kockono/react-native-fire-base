//Librerias nesesarias para la funcionacion por wifi con web sockets
#include <WiFi.h>

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
#define FIREBASE_HOST "integradora-64ddd.firebaseio.com"
#define FIREBASE_AUTH "IaQ9xXV5HqkLlghXS8GnfROVfFlqTtRqUzsnJPri"

String path = "/dispositivos/prototipo01";
FirebaseData firebaseData;




// Constants
const char* ssid = "HOME-9A5F";
const char* password = "34C2C203B9BCC426";
const int sensor = 32;
float sensorValue;
const int rel_pin = 4;

int rel_state = 0;


void setup() {
  //Setup sensorer y actuadores
  pinMode(sensor, INPUT);
  pinMode(rel_pin, OUTPUT);
  rel_state = 1;
  digitalWrite(rel_pin, rel_state);

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
//conexion a base de datos
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  
//configuracion de cliente nps para obtener el tiempo
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();


}

//iniciacion de hora actual 
void printLocalTime()
{

  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }

}

void loop() {
//llamado de metodos
  firebase();
  
  Actuar();
  
//actuacion automatica si existe una fuga
if(getSensor()>350){
  rel_state=0;
}
  realtime();


}


//obtiene el valor del sensor
float getSensor() {
  sensorValue = analogRead(sensor);
  return sensorValue;

}

//creacion del formato de fecha para guardar el dato en la tabla datos 
String date()
{
  delay(1000);

  printLocalTime();
  second = timeinfo.tm_sec;
  minute = timeinfo.tm_min;
  hour = timeinfo.tm_hour + 7;
  day = timeinfo.tm_mday;
  month = timeinfo.tm_mon + 1;
  year = timeinfo.tm_year + 1900;
  weekday = timeinfo.tm_wday + 1;
  String hora = String(hour);
  String minutos = String(minute);
  String segundos = String(second);
  String dias = String(day);
  String mes = String(month);
  String ano = String(year);
  String fecha = hora + ":" + minutos + ":" + segundos + " " + dias + "/" + mes + "/" + ano;
  //String fecha;
  return fecha;
}

//variables de control para elo metodo firebase()
int primero = 1;
int id = 1;

//este metodo guarda a la tabla real time en tiempo real los nuevos datos de el sensor y si la electrovalvula esta apagada o encendida
void realtime(){
  double gas;
  gas = (double)getSensor();
  FirebaseJson json1;
  json1.set("/ppm", gas);
  json1.set("/apagado", rel_state);
  //json1.set("/fecha", date());
  Firebase.set(firebaseData, path + "/realtime/0", json1);
  
}

//este metodo guarda nuevos datos a la base de datos firebase en la tabla datos creando un json
void firebase() {


  double gas;
  gas = (double)getSensor();
  FirebaseJson json1;
  json1.set("/ppm", gas);
  json1.set("/apagado", rel_state);
  json1.set("/fecha", date());
  Firebase.set(firebaseData, path + "/datos/" + String(id), json1);
  id = id + 1;


}

//este metodo toma los datos de la base de datos y comprueba si la electrovalvula se tiene que apagar o prender 
void Actuar(){
    if (Firebase.getInt(firebaseData, path+"/realtime/0/apagado")) 
    {

     
        Serial.println(firebaseData.intData());
        if(firebaseData.intData()==1)
         {
            rel_state=1;
            digitalWrite(rel_pin, rel_state);
        }
        else if(firebaseData.intData()==0)
        {
          rel_state=0;
        digitalWrite(rel_pin, rel_state);
      
        }
      

  } 
  else 
  {
    Serial.println(firebaseData.errorReason());
  }
}
