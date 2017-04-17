import React, { Component } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import Button from 'react-native-button';

import AddListingModal from '../../add-listing/components/AddListingModal';
import ListingItem from './ListingItem';

import config from '../../config';


class Listings extends Component {
  static propTypes = {
    market: React.PropTypes.object.isRequired,
    geo: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      listings: null,
      showingAddListingModal: false
    };
  }

  componentDidMount() {
    const queryParams = {
      latitude: this.props.geo.geo[0],
      longitude: this.props.geo.geo[1],
      distanceKm: 50
    };

    const queryString = Object.keys(queryParams)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
    .join('&')
    .replace(/%20/g, '+');

    // fetch markets
    fetch(`${config.API_SERVER_URL}/api/markets/${this.props.market._id}/listings?${queryString}`)
    .then((response) => response.json())
    .then((json) => {
      console.log('got listings:', json);
      this.setState({
        listings: json.offers
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleListingPress = (listing) => {
    
  };

  renderAddListingModal() {
    if (this.state.showingAddListingModal) {
      return (
        <AddListingModal
          onAcceptPress={() => {

          }}
          onModalClose={() => {
            this.setState({ showingAddListingModal: false });
          }}
        />
      );
    }
  }

  renderListings() {
    if (this.state.listings != null) {
      return (
        <ScrollView>
          {this.state.listings.map((el, i) => {
            return (
              <ListingItem
                listing={el}
                key={i}
              />
            );
          })}
        </ScrollView>
      );
    }
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}>


        <View style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          paddingTop: 10,
        }}>
        
          <Text style={{
            color: '#485a69',
            fontFamily: 'Futura',
            fontSize: 28,
            textAlign: 'left',
          }}>
            Listings for {this.props.market.name}
          </Text>


          <Button
            onPress={() => {
              this.setState({ showingAddListingModal: true });
            }}
            containerStyle={{
              flex: 0,
              justifyContent: 'center',
              padding: 5,
              borderRadius: 3,
              backgroundColor: '#77c350'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 16,
              color: '#fff'
            }}>
            + Add Listing
          </Button>
        </View>

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
          placeholder='Search listings...'
        />

        <ActivityIndicator
          animating={this.state.listings == null}
          size='large'
        />

        {this.renderAddListingModal()}
        {this.renderListings()}
      </View>
    );
  }
}

export default Listings;