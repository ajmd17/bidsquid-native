import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

import Category from './Category';


class Categories extends Component {
  static propTypes = {
    style: React.PropTypes.object
  };

  render() {
    return (
      <View style={this.props.style || {}}>
        <Text>Categories</Text>
        <Category/>
        <Category/>
        <Category/>
        <Category/>
        <Category/>
        <Category/>
      </View>
    );
  }
}

export default Categories;