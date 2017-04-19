import React, { Component } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';


class TopicItem extends Component {
  static propTypes = {
    topic: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired
  };

  handlePress = () => {
    this.props.onPress();
  };

  render() {
    return (
      <View style={{
        borderWidth: 1,
        borderColor: '#eee',
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
        shadowColor: '#b1bbd0',
        shadowOffset: {
          width: 0,
          height: 4
        },
        shadowRadius: 2,
        shadowOpacity: 0.9,
        overflow: 'scroll'
      }}>
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}>
          <Text style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 26,
            fontFamily: 'Futura',
            color: '#0ab498'
          }}>
            {this.props.topic.title}
          </Text>
        </View>
      </View>
    );
  }
}

export default TopicItem;