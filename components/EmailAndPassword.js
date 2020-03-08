/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import firebase from 'firebase';

import { View, TextInput, StyleSheet, TouchableOpacity, Text,KeyboardAvoidingView, Button } from 'react-native';

// create a component
class EmailAndPassword extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    loading: false,
    disable:true,
  }

  onBottomPress = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(this.onLoginSucess)
    .catch(err => {
      this.setState({
          error:err.message
      })
    })
    
  }
  choseStyle(){
    if(this.state.disable){
      return styles.buttonContainer2
    }
    return styles.buttonContainer
  }
  onLoginSucess(){
    this.setState({
      error: '',
      loading: false
    })
  }

  handlePass=password=>{
    this.setState({password},this.handleButton)
  }
  handleEmail=email=>{
    this.setState({email},this.handleButton)
  }
  handleButton=()=>{
    if(this.state.password.length>=6 && this.state.email.length>=6)
    {
      return this.setState({disable:false})
    }
      return this.setState({disable:true})
  }

  render(){
    return (
      <KeyboardAvoidingView behaivor="padding "style={styles.container}>
        <TextInput placeholder="email" 
                   style={styles.input} 
                   value={this.state.email}
                   onChangeText={this.handleEmail}
                   />
        <TextInput placeholder="password" 
                   style={styles.input} 
                   secureTextEntry
                   value={this.state.password}
                   onChangeText={this.handlePass}
                   />
          <Button style={
            styles.buttonContainer
          } onPress={this.onBottomPress} disabled={this.state.disable}
            title="Login"/>
          <Text style={styles.error}>
            {this.state.error}
          </Text>
      </KeyboardAvoidingView>
    );
  }
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20
},
input:{
    height:40,
    backgroundColor:'rgba(255,255,255,.5)',
    paddingLeft:10,
    marginBottom:15,
    borderRadius:5,
    fontSize:15,

},
error:{
    fontSize:25,
    color:'red',
    alignSelf:'center',
    marginTop:10

},
buttonText:{
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
    fontSize:20
},
buttonContainer:{
    backgroundColor:'#rgb(15,43,80)',
    padding:15,
    borderRadius:8
},
buttonContainer2:{
  backgroundColor:'#rgb(15,43,70)',
  padding:15,
  borderRadius:8
},
});

//make this component available to the EmailAndPassword
export default EmailAndPassword;
