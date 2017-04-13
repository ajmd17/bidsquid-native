import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';


class AlertsScreen extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  render() {
    return (
      <View style={this.props.style || {}}>
        <Text>This is the alerts screen</Text>
      </View>
    );
  }
}

export default AlertsScreen;