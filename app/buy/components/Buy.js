import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import Categories from '../../categories/components/Categories';

import config from '../../config';


class Buy extends Component {
  static propTypes = {
    style: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Categories/>
    );
  }
}

export default Buy;