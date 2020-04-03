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
import firebase from 'firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { conexionOnline} from '../config/db';
import HomeScreen from './home';
import SettingsScreen from './Settings'


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



function LogOut({ navigation }) {

    React.useEffect(() => {
      const logout = navigation.addListener('focus', e => {
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


export default class App extends React.Component {

  render (){
  return(
    
     <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#0D08AB',
        activeBackgroundColor: '#B5BAB8',
        allowFontScaling: true
      }}>
       <Tab.Screen name="Home"  component={HomeScreen}/>
       <Tab.Screen name="Ajustes"  component={SettingsScreen} />
       <Tab.Screen name="LogOut" component={LogOut}  />
      </Tab.Navigator>
      )
    }
}





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

