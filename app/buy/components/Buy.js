import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import MarketItem from './MarketItem';


class Buy extends Component {
  static propTypes = {
    style: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      markets: [1,2,3,4,5,6,7,8]
    };
  }

  renderMarkets() {
    if (this.state.markets != null) {
      return (
        <View style={{ paddingTop: 50 }}>
          {this.state.markets.map((el, i) => {
            return (
              <MarketItem
                title={'Market #' + i}
                numListings={Math.floor(Math.random() * 50)}
                bestOffer={'$' + (Math.random() * 2).toFixed(2) + ' / lb'}
                key={i}
              />
            );
          })}
        </View>
      )
    }
  }

  render() {
    return (
      <ScrollView style={this.props.style || {}}>
        <Text style={{
          paddingTop: 20,
          paddingBottom: 15,
          color: '#485a69',
          fontFamily: 'Futura',
          fontSize: 24,
          textAlign: 'center',
        }}>
          What are you looking to buy?
        </Text>

        <TextInput
          style={{
            height: 35,
            marginHorizontal: 10,
            paddingHorizontal: 10,
            borderColor: '#eee',
            borderRadius: 4,
            backgroundColor: '#fff',
            shadowColor: '#b1bbd0',
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowRadius: 2,
            shadowOpacity: 0.3
          }}
          onChangeText={(text) => this.setState({ searchValue: text })}
          value={this.state.searchValue}
        />

        <Text style={{
          marginVertical: 10,
          textAlign: 'center',
          color: '#86929b',
          fontFamily: 'Futura',
          fontSize: 15,
        }}>
          Showing results near Sydney, NS
        </Text>

        {this.renderMarkets()}
      </ScrollView>
    );
  }
}

export default Buy;