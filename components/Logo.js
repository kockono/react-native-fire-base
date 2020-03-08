/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { View, Image } from 'react-native';

// create a component
const Logo = () => {
  return (
    <View>
    <Image source={require('../public/images/favicon.png')} style={{ height: 150, width:150 }} />
    </View>
  );
};

//make this component available to the Logo
export default Logo;
