import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';


class TransactionsScreen extends Component {
  static navigationOptions = {
    style: React.PropTypes.object
  };

  render() {
    return (
      <View style={this.props.style || {}}>
        <Text>This is the transactions screen</Text>
      </View>
    );
  }
}

export default TransactionsScreen;