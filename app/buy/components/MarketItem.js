import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';


class MarketItem extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    numListings: React.PropTypes.number.isRequired,
    bestOffer: React.PropTypes.string.isRequired,
  };

  renderButtons() {
    return (
      <View style={{
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>

        <Button
          containerStyle={{marginRight: 5, padding:5, width: 130, height:35, borderRadius: 0, backgroundColor: '#77c350'}}
          style={{
            fontFamily: 'Futura',
            fontSize: 16,
            color: '#fff'
          }}>
          View Listings
        </Button>
        <Button
          containerStyle={{
            padding:5,
            width: 160,
            height:35,
            borderRadius: 0,
            backgroundColor: '#de6372'
          }}
          style={{
            fontFamily: 'Futura',
            fontSize: 16,
            color: '#fff'
          }}>
          Add to Watchlist
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View style={{
        marginHorizontal: 10,
        marginVertical: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
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
        <Text style={{
          fontSize: 22,
          fontFamily: 'Futura',
          color: '#4285f4'
        }}>
          {this.props.title}
        </Text>
        <Text style={{
          fontSize: 18,
          fontFamily: 'Futura',
          color: '#485a69'
        }}>
          {this.props.numListings} active listings
        </Text>
        <Text style={{
          fontSize: 18,
          fontFamily: 'Futura',
          color: '#485a69'
        }}>
          Best offer: {this.props.bestOffer}
        </Text>


        {this.renderButtons()}
      </View>
    );
  }
}

export default MarketItem;