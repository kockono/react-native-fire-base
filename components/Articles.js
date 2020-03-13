/* eslint-disable no-unused-vars */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import {Card, CardItem, Switch, Container, Header, Content, Body, Button, Toast, ListItem, Icon, Left, Right } from 'native-base';
 


import firebase from 'firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
      <Container>
        
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text>
                   Bienvenido A Ventium

                   Seguridad con amabilidad

                   En Construcción  
                </Text>

              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
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
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="wifi" />
              </Button>
            </Left>
            <Body>
              <Text>Dispositivo 2</Text>
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

//-------------------


// -------------------



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
    
     <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#0D08AB',
        activeBackgroundColor: '#B5BAB8',
        allowFontScaling: true
      }}>
       <Tab.Screen name="Home"  component={HomeScreen}  />
       <Tab.Screen name="Settings"  component={SettingsScreen} />
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



