import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import NavigationBar from 'react-native-navbar';

import Categories from '../categories/components/Categories';


class BrowseScreen extends Component {
  static navigationOptions = {
    style: React.PropTypes.object
  };

  render() {
    return (
      <Categories/>
    );
  }
}

export default BrowseScreen;