import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import MarketItem from './MarketItem';
import Listings from '../../listings/components/Listings';

import events from '../../events';
import config from '../../config';


class Markets extends Component {
  static propTypes = {
    category: React.PropTypes.object.isRequired,
    geo: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      markets: null,
      selectedMarket: null,
      viewMode: null, // 'listings', 'board'
      searchValue: '',
      openedId: null, // the id of a currently open market item
    };
  }

  componentDidMount() {
    // fetch markets
    fetch(`${config.API_SERVER_URL}/api/categories/${this.props.category._id}/markets`)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        markets: json.markets
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleMarketPress = (key) => {
    if (this.state.openedId != null && this.state.openedId == key) {
      // already set, set it to null.
      this.setState({ openedId: null });
    } else {
      // not yet set, so set it to the selected market
      this.setState({ openedId: key });
    }
  };

  handleViewListingsPress = (market) => {
    this.setState({
      viewMode: 'listings'
    });

    events.emit('open page', () => {
      this.setState({ openedId: null, viewMode: null });
    });
  };

  renderMarkets() {
    if (this.state.markets != null) {
      return (
        <ScrollView>
          {this.state.markets.map((el, i) => {
            return (
              <MarketItem
                market={el}
                isDrawerOpen={this.state.openedId != null &&
                  this.state.openedId == i}
                onPress={() => this.handleMarketPress(i)}
                onViewListingsPress={() => this.handleViewListingsPress(el)}
                key={i}
              />
            );
          })}
        </ScrollView>
      )
    }
  }

  render() {
    if (this.state.viewMode != null) {
      switch (this.state.viewMode) {
        case 'listings':
          return (
            <Listings
              market={this.state.markets[this.state.openedId]}
              geo={this.props.geo}
            />
          );
      }
    }

    return (
      <View style={{
        flex: 1
      }}>
        <Text style={{
          marginLeft: 10,
          paddingTop: 10,
          color: '#485a69',
          fontFamily: 'Futura',
          fontSize: 28,
          textAlign: 'left',
        }}>
          Markets for {this.props.category.name}
        </Text>

        <Text style={{
          marginLeft: 10,
          color: '#86929b',
          fontFamily: 'Futura',
          fontSize: 15,
        }}>
          {this.props.geo.name}, {this.props.geo.provinceCode}
        </Text>

        <TextInput
          style={{
            height: 35,
            marginHorizontal: 10,
            marginVertical: 10,
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
            shadowOpacity: 0.3,
            fontFamily: 'Futura',
            color: '#485a69'
          }}
          onChangeText={(text) => this.setState({ searchValue: text })}
          value={this.state.searchValue}
          placeholder='Search markets by name...'
        />

        <ActivityIndicator
          animating={this.state.markets == null}
          size='large'
        />

        {/*<View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 10
        }}>
          <TouchableHighlight>
            <Text style={{
            color: '#86929b',
            fontFamily: 'Futura',
            fontSize: 18
          }}>
            HOT
          </Text>
          
          </TouchableHighlight>
        </View>*/}

        {this.renderMarkets()}
      </View>
    );
  }
}

export default Markets;