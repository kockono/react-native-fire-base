const int relePin=13;
const int sensor=4;
float sensorValue;

void setup()
{
pinMode(sensor,INPUT);
pinMode(relePin,OUTPUT);
Serial.begin(9600);
}
void loop()
{
  
 sensorValue=analogRead(sensor);
 Serial.println(sensorValue);
 if(sensorValue>600){
digitalWrite(relePin,LOW);
 }
 else{
  digitalWrite(relePin,HIGH);
 }
 delay(1000);
}
