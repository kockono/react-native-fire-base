import React, { Component } from 'react';
import firebase from 'firebase';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LoginForm from './LoginForm';
import Articles from './Articles';
import BG from '../public/images/8.jpg';
import { conexionOnline } from "../config/db";
import Loading from './Loading';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class App extends Component {
  state={
    loggedIn: null,
  }

componentDidMount(){
  if(!firebase.apps.length){
    firebase.initializeApp(conexionOnline);
  }
  
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          loggedIn:true
        })
      }else{
        this.setState({
          loggedIn:false
        })
      }
    })
}

  renderContent = () => {
    switch (this.state.loggedIn) {
      case false:
        return <ImageBackground style={styles.container} source={BG}>
        <LoginForm />
        </ImageBackground>
      case true:
        return <Articles />;
        default:
          return <Loading />
    }
  };
  
  render() {
    return (<NavigationContainer>
      <Stack.Navigator>
      {
        this.state.loggedIn===false?(
          <Stack.Screen
          name="Login"
          component={LoginForm}
          />
          

        ):(
          <Stack.Screen
            name="Graficas"
            component={Articles}
          />
        )
      }
      </Stack.Navigator>
      </NavigationContainer>) ;
  }
}

const Stack = createStackNavigator();

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height:'100%',
    width:'100%'
  },
});

//make this component available to the app
export default App;
