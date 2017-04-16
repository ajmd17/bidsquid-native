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

import Category from './Category';
import Markets from '../../markets/components/Markets';

import events from '../../events';
import config from '../../config';


class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      selectedCategory: null,
      searchValue: ''
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
    this.setState({ selectedCategory: category });
    events.emit('open page', () => {
      this.setState({ selectedCategory: null });
    });
  };

  renderCategories() {
    if (this.state.categories != null) {
      return (
        <ScrollView>
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

  render() {
    if (this.state.selectedCategory != null) {
      // render market view if a category is selected.
      return (
        <Markets category={this.state.selectedCategory}/>
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

        <ActivityIndicator
          animating={this.state.categories == null}
          size='large'
        />

        {this.renderCategories()}
      </View>
    );
  }
}

export default Categories;