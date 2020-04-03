import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {  LineChart,  BarChart,  PieChart,  ProgressChart,  ContributionGraph,  StackedBarChart} from "react-native-chart-kit";
import {Card, CardItem, Switch, Container, Header, Content, Body, Button, Toast, ListItem, Icon, Left, Right } from 'native-base';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import firebase from 'firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { db } from '../config/db';



export default class SettingsScreen extends Component {

        
    state = {
        estado:0,
        ppm:0,
        checked: false
        }
        // this.handleChange=this.handleChange.bind(this)
    
    handleChange = (checked) => { 

        this.setState({ checked })
        let num = checked ? 1 : 0


        db.ref('dispositivos/prototipo01/realtime/0/apagado')
        .set(num);

    }
    



  componentDidMount() {

    setInterval(() => {
    db.ref('dispositivos/prototipo01/realtime/0').on('value',(snapshot)=> {
      const userObj = snapshot.val();     
      window.estado = userObj.apagado;
  });
  if(window.estado === undefined){
        this.setState({
        estado:0,
        checked: false
            })
  }else{
    
    this.setState({
      estado:window.estado,
      checked: window.estado === 1 ? true : false
        })
  }
        console.log("El estado final es:"+this.state.estado)},5000);
}

    render() {
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
              <Switch onValueChange={this.handleChange} value={ this.state.checked } />
            </Right>
          </ListItem>
        </Content>
      </Container>
        </Container>
  );
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

