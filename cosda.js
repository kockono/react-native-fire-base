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

// --------------------------- Graficas --------------------------------//
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

// ---------------------------- Fin De Graficas ------------------ //

const Dispositivo = props => {

  <Content>
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
              <Switch value={props.check} onValueChange={props.onRene} />
            </Right>
          </ListItem>
        </Content>
}

function LogOut({ navigation }) {
    React.useEffect(() => {
      const logout = navigation.addListener('focus', e => {
        // Prevent default behavior
        //e.preventDefault();
        firebase.auth().signOut()
        
        //Codigo de firebase para logout
        // Do something manually
        // ...
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



export default class App extends React.Component{
  
state={
  check:0,
  ws:null,
}
doSend(mss){
  ws.send(mss);

}
ranaRene(){
  doSend("toggleREL")
}
SettingsScreen(props) {
  return (
  <Container>
          <Container>
        <Dispositivo
        onRene={()=>this.ranaRene()}
        check={this.state.check}
        />
        
      </Container>
        </Container>
  );
}
constructor(props) {
    super(props);

    this.state = {
        ws: null
    };
}

// constructor(){
//   super();
//   const URL="ws://192.168.0.0";
//   const ws = WebSocket(URL);
// }
componentDidMount(){
    this.connect();
  // ws.onopen =()=>{
  //   this.doSend("getRELState")
  // }
  //
  // ws.onmessage =(e)=>{
  //   let json=JSON.parse(e.data)

  //   this.setState({
  //     check:json.apagado
  //   })
  //   setInterval(this.doSend("getRELState"),5000)

  // }
} 

connect = () => {
    var ws = new WebSocket("ws://localhost:3000/ws");
    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
        console.log("connected websocket main component");
        this.doSend("getRELState")

        this.setState({ ws: ws });

        that.timeout = 250; // reset timer to 250 on open of websocket connection 
        clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    
    };
    ws.onclose = e => {
        console.log(
            `Socket is closed. Reconnect will be attempted in ${Math.min(
                10000 / 1000,
                (that.timeout + that.timeout) / 1000
            )} second.`,
            e.reason
        );

        that.timeout = that.timeout + that.timeout; //increment retry interval
        connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };
    ws.onerror = err => {
        console.error(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
        );

        ws.close();
    };
    ws.onmessage =(e)=>{
     let json=JSON.parse(e.data)
  
    this.setState({
        check:json.apagado
     })
      setInterval(this.doSend("getRELState"),5000)
  
    };
};

checke = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
};
  render (){
  return(
    
     <Tab.Navigator
      initialRouteName="Estadisticas"
      tabBarOptions={{
        activeTintColor: '#0D08AB',
        activeBackgroundColor: '#B5BAB8',
        allowFontScaling: true
      }}>
       <Tab.Screen name="Estadisticas"  component={HomeScreen}  />
       <Tab.Screen name="Ajustes" component={this.SettingsScreen}/>
       <Tab.Screen name="LogOut" component={LogOut}  />

      </Tab.Navigator>
      )
    }
}

    


// ---------------------------- Estilos -------------------------------//
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