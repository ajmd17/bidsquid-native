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

import config from '../config';


class PostalCodeField extends Component {
  static propTypes = {
    style: React.PropTypes.object,
    onPostalCodeChanged: React.PropTypes.func.isRequired,
    onPostalCodeError: React.PropTypes.func.isRequired,
    onPlaceFound: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      foundPlace: null,
      postalCode: '',
      postalCodeNormalized: '',
      postalCodeError: null
    };
  }

  handlePostalCodeChange = (text) => {
    let valueNormalized = text.replace(/\s+/g, '').toUpperCase();
    
    if (valueNormalized.length <= 6) {
      if (valueNormalized.length >= 3) {
        if (!/[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]/.test(valueNormalized.substring(0, 3))) {
          let err = 'Couldn\'t validate that postal code';
          this.props.onPostalCodeError(err);  
          this.setState({
            postalCode: text.toUpperCase(),
            postalCodeNormalized: valueNormalized.substring(0, 3),
            postalCodeError: err
          });
        } else {
          let valueBefore = this.state.postalCodeNormalized;

          this.setState({
            postalCode: text.toUpperCase(),
            postalCodeNormalized: valueNormalized.substring(0, 3),
            postalCodeError: null
          }, () => {
            if (this.state.postalCodeNormalized != valueBefore) {
              this.props.onPostalCodeChanged(this.state.postalCodeNormalized);

              fetch(`${config.API_SERVER_URL}/api/places/ca/${this.state.postalCodeNormalized}`)
              .then((response) => response.json())
              .then((json) => {
                console.log('json:', json);
                if (json.place != null) {
                  this.props.onPlaceFound(json.place);
                  this.setState({
                    foundPlace: json.place,
                    postalCodeError: null
                  });
                } else {
                  this.setState({
                    foundPlace: null,
                    postalCodeError: json.error
                  });
                }
              })
              .catch((err) => {
                this.props.onPostalCodeError(err.message);
                this.setState({
                  foundPlace: null,
                  postalCodeError: err.message
                });
              });
            }
          });
        }
      } else  {
        // remove errors and the found place
        this.props.onPostalCodeChanged(text.toUpperCase());

        this.setState({
          foundPlace: null,
          postalCode: text.toUpperCase(),
          postalCodeNormalized: valueNormalized,
          postalCodeError: null
        });
      }
    }
  };

  render() {
    return (
      <TextInput
        style={{
          flex: 0,
          height: 40,
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
          fontFamily: config.DEFAULT_FONT,
          color: '#485a69',
          ...(this.props.style || {})
        }}
        onChangeText={this.handlePostalCodeChange}
        value={this.state.postalCode}
        placeholder='Postal Code'
      />
    );
  }
}

export default PostalCodeField;