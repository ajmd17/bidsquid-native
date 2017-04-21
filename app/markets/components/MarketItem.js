import React, { Component } from 'react';
import {
  ActivityIndicator,
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

import config from '../../config';


class MarketItem extends Component {
  static propTypes = {
    market: React.PropTypes.object.isRequired,
    isDrawerOpen: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
    onViewListingsPress: React.PropTypes.func.isRequired,
    onDiscussionBoardPress: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      numTopics: null,
      panelHeight: new Animated.Value(0),
      panelOpacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    // fetch num topics, num listings
    fetch(`${config.API_SERVER_URL}/api/markets/${this.props.market._id}/topics/count`)
    .then((response) => response.json())
    .then((json) => {
      if (json.error != null) {
        throw new Error(json.error);
      }
      this.setState({ numTopics: json.count });
    })
    .catch((err) => {
      console.error('Error fetching topics count:', err);
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isDrawerOpen != this.props.isDrawerOpen) {
      Animated.timing(this.state.panelHeight, {
        toValue: newProps.isDrawerOpen ? 135 : 0,
        duration: 400
      }).start();
      Animated.timing(this.state.panelOpacity, {
        toValue: newProps.isDrawerOpen ? 1 : 0,
        duration: 400
      }).start();
    }
  }

  handlePress = () => {
    this.props.onPress();
  };

  handleViewListingsPress = () => {
    this.props.onViewListingsPress();
  };

  handleDiscussionBoardPress = () => {
    this.props.onDiscussionBoardPress();
  };

  renderContent() {
    if (this.state.numTopics == null) {
      return (
        <ActivityIndicator animating size='small'/>
      );
    }

    return (
      <View style={{
        padding: 10
      }}>
        <Text style={{
          fontSize: 18,
          fontFamily: config.DEFAULT_FONT,
          color: '#485a69'
        }}>
          {this.state.numTopics == 1
            ? '1 discussion topic'
            : `${this.state.numTopics} discussion topics`}
        </Text>
        {this.renderButtons()}
      </View>
    );
  }

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
              marginVertical: 4,
              padding: 5,
              borderWidth: 1,
              borderColor: '#0ab498',
              backgroundColor: '#0ab498'
            }}
            style={{
              fontFamily: config.DEFAULT_FONT,
              fontSize: 18,
              color: '#fff'
            }}>
            View Listings
          </Button>

          {/*<Button
            containerStyle={{
              marginVertical: 4,
              padding: 5,
              borderRadius: 3,
              borderWidth: 1,
              borderColor: '#0ab498',
              backgroundColor: '#fff'
            }}
            style={{
              fontFamily: config.DEFAULT_FONT,
              fontSize: 18,
              color: '#0ab498'
            }}>
            Add to Watchlist
          </Button>*/}

          
          <Button
            onPress={this.handleDiscussionBoardPress}
            containerStyle={{
              marginVertical: 4,
              padding: 5,
              borderWidth: 1,
              borderColor: '#0ab498',
              backgroundColor: '#fff'
            }}
            style={{
              fontFamily: config.DEFAULT_FONT,
              fontSize: 18,
              color: '#0ab498'
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
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}>
            <Text style={{
              fontSize: 24,
              fontFamily: config.DEFAULT_FONT,
              color: '#86929b'
            }}>
              {this.props.market.name}
            </Text>
          </View>

          {this.renderContent()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default MarketItem;