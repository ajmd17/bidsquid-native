import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';


class DashboardScreen extends Component {
  static navigationOptions = {
    style: React.PropTypes.object
  };

  render() {
    return (
      <View style={this.props.style || {}}>
        <Text>This is the dashboard screen</Text>
      </View>
    );
  }
}

export default DashboardScreen;