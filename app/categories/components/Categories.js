import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import Button from 'react-native-button';

import Category from './Category';
import Markets from '../../markets/components/Markets';
import ProvideLocationModal from '../../provide-location/components/ProvideLocationModal';

import events from '../../events';
import config from '../../config';


class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      selectedCategory: null,
      geo: null,
      searchValue: '',
      locationModal: {
        showing: false
      }
    };
  }

  componentDidMount() {
    // load categories from server
    fetch(`${config.API_SERVER_URL}/api/categories/all/0/10`)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        categories: json.categories
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleCategoryPress = (category) => {
    AsyncStorage.getItem('saved geo')
    .then(JSON.parse)
    .then((json) => {
      console.log('got saved geo:', json);
      if (json == null) {
        this.setState({
          locationModal: {
            showing: true,
            categoryToOpenAfter: category
          }
        });
      } else {
        this.setState({
          selectedCategory: category,
          geo: json
        });
        events.emit('open page', () => {
          this.setState({ selectedCategory: null });
        });
      }
    })
    .catch((err) => {
      console.error('Error loading saved geo:', err);
    });
    
    /*this.setState({ selectedCategory: category });
    events.emit('open page', () => {
      this.setState({ selectedCategory: null });
    });*/
  };

  handlePostalCodeChange = (text) => {
    // lookup on server if validated
    let newState = {};


    this.setState({
      ...newState,
      postalCodeValue: text
    });
  };

  renderCategories() {
    if (this.state.categories != null) {
      return (
        <ScrollView style={{
          backgroundColor: '#f7f8fa'
        }}>
          {this.state.categories.map((el, i) => {
            return (
              <Category
                category={el}
                onPress={this.handleCategoryPress}
                key={i}
              />
            );
          })}
        </ScrollView>
      );
    }
  }

  renderLocationModal() {
    if (this.state.locationModal.showing) {
      return (
        <ProvideLocationModal
          onAcceptLocation={(place) => {
            console.log('place:', place);
            AsyncStorage.setItem('saved geo', JSON.stringify(place)).then((res) => {
              if (this.state.locationModal.categoryToOpenAfter != null) {
                this.setState({
                  selectedCategory: this.state.locationModal.categoryToOpenAfter,
                  locationModal: {
                    showing: false
                  } 
                });
                events.emit('open page', () => {
                  this.setState({ selectedCategory: null });
                });
              } else {
                this.setState({ locationModal: { showing: false } });
              }
            }).catch((err) => {
              console.error('Error saving geo:', err);
            });
          }}
          onModalClose={() => {
            this.setState({ locationModal: { showing: false } });  
          }}
        />
      );
    }
  }

  render() {

    if (this.state.selectedCategory != null && this.state.geo != null) {
      // render market view if a category is selected.
      return (
        <Markets
          category={this.state.selectedCategory}
          geo={this.state.geo}
        />
      );
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
          Categories
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
          placeholder='Search categories by name...'
        />

        {this.state.categories == null
          ? <ActivityIndicator
              animating
              size='large'
            />
          : null}

        {this.renderCategories()}

        {this.renderLocationModal()}
      </View>
    );
  }
}

export default Categories;