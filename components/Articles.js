/* eslint-disable no-unused-vars */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import {Card,CardItem, Switch} from 'native-base';
import firebase from 'firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
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
  render (){
  return(
    <View>
    <TouchableOpacity style={{padding:20 }} onPress={() => firebase.auth().signOut()}>
          <Text style={{color: '#1B9CFC'}}>Logout</Text>
        </TouchableOpacity>

    </View>
      )
    }
}

    // <Tab.Navigator>
    //   <Tab.Screen name="Home" component={HomeScreen} />
    //   <Tab.Screen name="Settings" component={SettingsScreen} />
    // </Tab.Navigator>


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
  
}
});



