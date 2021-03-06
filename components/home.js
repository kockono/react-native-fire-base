import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {  LineChart,  BarChart,  PieChart,  ProgressChart,  ContributionGraph,  StackedBarChart} from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import firebase from 'firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { db } from '../config/db';




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

export default class HomeScreen extends Component {

state = {
    estado:0,
    ppm:0
}

  componentDidMount() {
    setInterval(() => {
    db.ref('dispositivos/prototipo01/realtime/0').on('value',(snapshot)=> {
      const userObj = snapshot.val();     
      window.estado=userObj.apagado;
      window.ppm=userObj.ppm;
  });
  if(window.ppm === undefined){
        this.setState({
        ppm:0
            })
  }else{
    this.setState({
      estado:window.estado,
      ppm:window.ppm
      
        })
  }
       }, 7500);
}

render() {

let long = this.state.ppm;
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
              long
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
    <Text style={{padding: 3,fontSize:20, fontWeight:'bold'}}>ppm: {this.state.ppm}</Text>
    <Text style={{padding: 3,fontSize:20, fontWeight:'bold'}}>Estado: {this.state.estado}</Text>

  </View>
  );
}
 
}