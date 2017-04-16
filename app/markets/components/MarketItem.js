import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Button from 'react-native-button';


class MarketItem extends Component {
  static propTypes = {
    market: React.PropTypes.object.isRequired,
    isDrawerOpen: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
    onViewListingsPress: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      panelHeight: new Animated.Value(0),
      panelOpacity: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isDrawerOpen != this.props.isDrawerOpen) {
      Animated.timing(this.state.panelHeight, {
        toValue: newProps.isDrawerOpen ? 120 : 0,
        duration: 200
      }).start();
      Animated.timing(this.state.panelOpacity, {
        toValue: newProps.isDrawerOpen ? 1 : 0,
        duration: 200
      }).start();
    }
  }

  handlePress = () => {
    this.props.onPress();
  };

  handleViewListingsPress = () => {
    this.props.onViewListingsPress();
  };

  renderButtons() {
    return (
      <Animated.View style={{
        height: this.state.panelHeight,
        opacity: this.state.panelOpacity
      }}>

        <View style={{
        }}>

          <Button
            onPress={this.handleViewListingsPress}
            containerStyle={{
              marginVertical: 2,
              padding: 5,
              borderRadius: 3,
              borderWidth: 1,
              borderColor: '#77c350',
              backgroundColor: '#77c350'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 16,
              color: '#fff'
            }}>
            View Listings
          </Button>

          <Button
            containerStyle={{
              marginVertical: 2,
              padding: 5,
              borderRadius: 3,
              borderWidth: 1,
              borderColor: '#4285f4',
              backgroundColor: '#fff'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 16,
              color: '#4285f4'
            }}>
            Add to Watchlist
          </Button>

          
          <Button
            containerStyle={{
              marginVertical: 2,
              padding: 5,
              borderRadius: 3,
              borderWidth: 1,
              borderColor: '#4285f4',
              backgroundColor: '#fff'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 16,
              color: '#4285f4'
            }}>
            Discussion Board
          </Button>
        </View>
      </Animated.View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={{
          borderRadius: 3,
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
            padding: 10
          }}>
            <Text style={{
              fontSize: 26,
              fontFamily: 'Futura',
              color: '#4285f4'
            }}>
              {this.props.market.name}
            </Text>
          </View>

          <View style={{
            padding: 10
          }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Futura',
              color: '#485a69'
            }}>
              {/*{this.props.numListings} active listings*/}
            </Text>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Futura',
              color: '#485a69'
            }}>
              {/*Best offer: {this.props.bestOffer}*/}
            </Text>
            {this.renderButtons()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default MarketItem;