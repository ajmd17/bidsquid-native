import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';


class Category extends Component {
  static propTypes = {
  };

  render() {
    return (
      <View style={{ flexDirection: 'column', flex: 1, backgroundColor: '#000' }}>
        <Text>Category!!!</Text>
      </View>
    );
  }
}

export default Category;