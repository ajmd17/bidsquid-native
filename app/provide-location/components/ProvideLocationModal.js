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

import PostalCodeField from '../../components/PostalCodeField';

import config from '../../config';


class ProvideLocationModal extends Component {
  static propTypes = {
    onAcceptLocation: React.PropTypes.func.isRequired,
    onModalClose: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      foundPlace: null,
      searching: false,
      postalCodeError: null
    };
  }

  handleAcceptPress = () => {
    if (this.state.foundPlace != null) {
      this.props.onAcceptLocation(this.state.foundPlace);
    }
  };

  renderPostalCodeError() {
    if (this.state.postalCodeError != null) {
      return (
        <Text style={{
          fontFamily: 'Futura',
          fontSize: 18,
          color: '#cb2431',
        }}>
          {this.state.postalCodeError}
        </Text>
      );
    }
  }

  renderAcceptButton() {
    if (this.state.foundPlace != null) {
      return (
        <View style={{
          flex: 0
        }}>
          <Button
            onPress={this.handleAcceptPress}
            containerStyle={{
              marginTop: 15,
              marginHorizontal: 10,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#0ab498',
              backgroundColor: '#0ab498'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 20,
              color: '#fff'
            }}>
            {this.state.foundPlace.name}
          </Button>

          <Button
            onPress={() => {
              this.setState({
                foundPlace: null
              });
            }}
            containerStyle={{
              marginTop: 5,
              marginHorizontal: 10,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#eee',
              backgroundColor: '#f2f2f2'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 16,
              color: '#485a69'
            }}>
            Clear
          </Button>
        </View>
      );
    }
  }

  renderModalBottom() {
    if (this.state.foundPlace == null) {
      return (
        <View style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <Button
            onPress={this.props.onModalClose}
            containerStyle={{
              marginTop: 5,
              marginHorizontal: 10,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#eee',
              backgroundColor: '#f2f2f2'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 16,
              color: '#485a69'
            }}>
            Cancel
          </Button>

        </View>
      );
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onModalClose}>
        <Modal isVisible={true} onRequestClose={this.props.onModalClose}>
          <TouchableWithoutFeedback
            onPress={(event) => {
              event.stopPropagation();
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 22,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }}>
            
              <Text style={{
                fontFamily: 'Futura',
                fontSize: 24,
                color: '#485a69'
              }}>
                Provide Your Location
              </Text>
              
              <Text style={{
                marginVertical: 30,
                fontFamily: 'Futura',
                fontSize: 18,
                color: '#485a69',
                textAlign: 'center'
              }}>
                To view locally-based listings, please enter the first three characters of your postal code.
              </Text>
              
              <PostalCodeField
                onPostalCodeChanged={(postalCode) => {

                  this.setState({
                    foundPlace: null,
                    searching: postalCode.length == 3,
                    postalCodeError: null
                  });

                  console.log('onPostalCodeChanged:', postalCode);
                }}
                onPostalCodeError={(err) => {
                  console.log('onPostalCodeError:', err);

                  this.setState({
                    foundPlace: null,
                    searching: false,
                    postalCodeError: err
                  });
                }}
                onPlaceFound={(place) => {
                  console.log('place:',place);
                  this.setState({
                    foundPlace: place,
                    searching: false,
                    postalCodeError: null
                  });
                }}
              />

              {this.state.searching ? <ActivityIndicator
                animating
              /> : null}

              {this.renderPostalCodeError()}

              {this.renderAcceptButton()}

              {this.renderModalBottom()}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  modalButtonContainer: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#4285f4',
    backgroundColor: '#fff'
  },
  modalButton: {
    fontFamily: 'Futura',
    fontSize: 20,
    color: '#4285f4'
  },
  modalButtonPrimaryContainer: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#4285f4',
    backgroundColor: '#4285f4'
  },
  modalButtonPrimary: {
    fontFamily: 'Futura',
    fontSize: 20,
    color: '#fff'
  }
});

export default ProvideLocationModal;