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


const NUM_CATEGORIES_PER_LOAD = 10;

function filterCategories(categories, query) {
  return categories.filter((el) => {
    if (el.name.toLowerCase().indexOf(query) != -1) {
      return true;
    } else if (el.subcategories != null && el.subcategories.length != 0) {
      return filterCategories(el.subcategories, query).length != 0;
    } else {
      return false;
    }
  });
}

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleCategories: null,
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
    fetch(`${config.API_SERVER_URL}/api/categories/all/0/${NUM_CATEGORIES_PER_LOAD}`)
    .then((response) => response.json())
    .then((json) => {
      let categories = json.categories.sort((a, b) => {
        if (b.subcategories == null) {
          return -1;
        }
        if (a.subcategories == null) {
          return 1;
        }
        return b.subcategories.length - a.subcategories.length;
      });

      this.setState({
        categories: categories,
        visibleCategories: filterCategories(categories, this.state.searchValue)
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleSearchValueChange = (text) => {
    this.setState({ searchValue: text });

    // query the categories
    if (this.state.categories != null) {
      this.setState({
        visibleCategories: filterCategories(this.state.categories, text)
      });
    }
  };

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
    if (this.state.visibleCategories != null) {
      return (
        <ScrollView style={{
          backgroundColor: '#f7f8fa'
        }}>
          {this.state.visibleCategories.map((el, i) => {
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
        <View style={{
          flex: 0,
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: '#fff'
        }}>
          <Text style={{
            marginLeft: 10,
            paddingTop: 10,
            color: '#485a69',
            fontSize: 24,
            textAlign: 'left',
            fontFamily: config.DEFAULT_FONT,
          }}>
            Categories
          </Text>

          <TextInput
            style={{
              height: 35,
              marginHorizontal: 10,
              marginVertical: 10,
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
              fontFamily: config.DEFAULT_FONT,
              color: '#485a69'
            }}
            onChangeText={this.handleSearchValueChange}
            value={this.state.searchValue}
            placeholder='Search categories by name...'
          />
        </View>

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