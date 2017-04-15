import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import NavigationBar from 'react-native-navbar';

import Categories from '../categories/components/Categories';
import Buy from '../buy/components/Buy';

class BrowseScreen extends Component {
  static navigationOptions = {
    style: React.PropTypes.object
  };

  render() {
    return (
      <Buy/>
    );
  }
}

export default BrowseScreen;