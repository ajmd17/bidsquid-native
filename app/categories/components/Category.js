import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';


class Category extends Component {
  static propTypes = {
    category: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired
  };

  handlePress = (category) => {
    this.props.onPress(category);
  };

  renderSubcategories() {
    if (this.props.category.subcategories != null) {
      return (
        <View style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}>
          {this.props.category.subcategories.map((el, i) => {
            return (
              <TouchableOpacity onPress={() => this.handlePress(el)} key={i}>
                <Text style={{
                  marginVertical: 2,
                  fontFamily: 'Futura',
                  fontSize: 20,
                  color: '#0ab498',
                }}>
                  {el.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
  }

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
            fontSize: 24,
            fontFamily: 'Futura',
            color: '#86929b',
            backgroundColor: '#fff'
          }}>
            {this.props.category.name}
          </Text>
        </View>

        {this.renderSubcategories()}
        
      </View>
    );
  }
}

export default Category;