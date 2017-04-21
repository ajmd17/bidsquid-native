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

import config from '../../config';


class ListingItem extends Component {
  static propTypes = {
    listing: React.PropTypes.object.isRequired,
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
            fontFamily: config.DEFAULT_FONT,
            color: '#0ab498'
          }}>
            {this.props.listing.title}
          </Text>

          <View style={{
            padding: 10
          }}>
            <Text style={{
              fontSize: 18,
              fontFamily: config.DEFAULT_FONT,
              color: '#485a69'
            }}>
              Price: ${this.props.listing.price}
            </Text>
            <Text style={{
              fontSize: 18,
              fontFamily: config.DEFAULT_FONT,
              color: '#485a69'
            }}>
              Available Quantity: {this.props.listing.availQty}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default ListingItem;