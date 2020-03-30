/* eslint-disable no-unused-vars */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import {Card, CardItem, Switch, Container, Header, Content, Body, Button, Toast, ListItem, Icon, Left, Right } from 'native-base';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import firebase from 'firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { conexionOnline} from '../config/db';

const app = firebase.initializeApp(conexionOnline);
const db = app.database();


const chartConfig = {
  backgroundGradientFrom: "#1E292D",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#FFFFFF",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 0) => `rgba(0, 0, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5
};

const data = {
  labels: ["Gas", "Humedad", "Calidad"], // optional
  data: [0.4, 0.6, 0.95]
};


function HomeScreen() {
  return (
    <View>

    <Text style={{padding: 3,fontSize:20, fontWeight:'bold'}}>Grafica Lineal</Text>
    <LineChart
      data={{
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100
            ]
          }
        ]
      }}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisLabel=""
      yAxisSuffix=""
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726"
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 0
      }}
    />
    <Text style={{padding:3 ,fontSize:20, fontWeight:'bold'}}>Grafica Anillo</Text>

    <ProgressChart
    data={data}
    width={screenWidth}
    height={230}
    chartConfig={chartConfig}
    hideLegend={false}
    
  />

  </View>
  );
}

function SettingsScreen() {
  return (
  <Container>
          <Container>
        
        <Content>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="notifications" />
              </Button>
            </Left>
            <Body>
              <Text>Notificaciones</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="wifi" />
              </Button>
            </Left>
            <Body>
              <Text>Dispositivo 1</Text>
            </Body>
            <Right>
                <Text>On/Off</Text>
              <Switch value={false} />
            </Right>
          </ListItem>
        </Content>
      </Container>
        </Container>
  );
}
function LogOut({ navigation }) {
    React.useEffect(() => {
      const logout = navigation.addListener('focus', e => {
        // Prevent default behavior
        //e.preventDefault();
        firebase.auth().signOut()

      });
  
      return logout;
    }, [navigation]);
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ya cerraste sesion</Text>
      
      </View>
    );
  }

const Tab = createBottomTabNavigator();

// create a component
const Prod=props=>(
<CardItem>
<Text>
{props.producto.titulo}
</Text>
<Switch
value={props.producto.check}
onValueChange={props.onCambio}
/>
</CardItem>
);

export default class App extends React.Component{
state={
  prductos:[],
}

  componentDidMount() {
    setInterval(() => {
    db.ref('dispositivos/prototipo01/realtime/0').on('value',(snapshot)=> {
      const userObj = snapshot.val();     
      window.lat=userObj.apagado;
      window.lon=userObj.ppm;
  });
    this.setState({
      latitud:window.lat,
      longitud:window.lon
      
    })
        console.log("La lati final es:"+this.state.latitud)
        console.log("La long final es:"+this.state.longitud)}, 1000);
}


  render (){
  return(
    
     <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#0D08AB',
        activeBackgroundColor: '#B5BAB8',
        allowFontScaling: true
      }}>
       <Tab.Screen name="Estadisticas"  component={HomeScreen}  />
       <Tab.Screen name="Ajustes"  component={SettingsScreen} />
       <Tab.Screen name="LogOut" component={LogOut}  />

      </Tab.Navigator>
      )
    }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
   
},
articleContainer:{
  padding:10,
  borderBottomColor:'rgba(255,255,255,.7)',
  borderBottomWidth:5
},
heading:{
   fontSize:22,
   color:'black',
   padding: 10,
   marginBottom:10
},
content:{
  marginTop:10,
  fontSize:19,
  
},
settings: {
  fontSize:32,
}
});

