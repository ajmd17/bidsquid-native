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
import FloatLabelTextInput from 'react-native-floating-label-text-input';
import { RadioButtons, SegmentedControls } from 'react-native-radio-buttons';

import config from '../../config';


class AddListingModal extends Component {
  static propTypes = {
    marketId: React.PropTypes.string.isRequired,
    onAdded: React.PropTypes.func.isRequired,
    onModalClose: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      titleValue: '',
      priceValue: '1.00',
      availQtyValue: null,
      unitValue: null,

      selectedPriceOption: {
        label: 'Per Unit',
        value: 'perunit'
      },

      submitting: false,
      submissionError: null
    };
  }

  handlePriceChange = (text) => {

    this.setState({ priceValue: text });
  };

  handleAvailQtyChange = (text) => {

    this.setState({ availQtyValue: text });
  };

  handleUnitChange = (text) => {
    this.setState({ unitValue: text });
  };
  
  handleSubmitPress = () => {
    fetch(`${config.API_SERVER_URL}/api/offers`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        marketId: this.props.marketId,
        title: this.state.titleValue,
        price: this.state.priceValue,
        availQty: this.state.availQtyValue,
        unit: this.state.unitValue
      })
    }).then((response) => response.json())
    .then((json) => {
      if (!json.error) {
        console.log('added listing:', json);
        this.props.onAdded(json.offer);
      } else {
        this.setState({
          submitting: false,
          submissionError: json.error
        });
      }
    }).catch((err) => {
      console.error('Error adding listing:', err);
      this.setState({
        submitting: false,
        submissionError: err
      });
    });
  };

  renderSubmissionError() {
    if (this.state.submissionError != null) {
      return (
        <Text style={{
          fontFamily: 'Futura',
          fontSize: 16,
          color: '#cb2431',
          textAlign: 'center'
        }}>
          Submission Error: {this.state.submissionError}
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

          <Button
            onPress={this.handleSubmitPress}
            containerStyle={{
              marginTop: 5,
              marginHorizontal: 10,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#4285f4',
              backgroundColor: '#4285f4'
            }}
            style={{
              fontFamily: 'Futura',
              fontSize: 16,
              color: '#fff'
            }}>
            Submit
          </Button>

        </View>
      );
    }
  }

  render() {
    let unitOptions = [
      {
        label: 'Per Unit',
        value: 'perunit'
      },
      {
        label: 'Total',
        value: 'total'
      }
    ];

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
                borderRadius: 4,
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }}>
            
              <Text style={{
                fontFamily: 'Futura',
                fontSize: 24,
                color: '#485a69',
                textAlign: 'center'
              }}>
                Add a Listing
              </Text>

              {this.state.submitting ? <ActivityIndicator
                animating
              /> : null}

              <View style={{
                marginVertical: 10
              }}>
                <Text style={{
                  textAlign: 'left',
                  fontSize: 16,
                  fontFamily: 'Futura',
                  color: '#485a69'
                }}>
                  Title
                </Text>
                <TextInput
                  style={{
                    flex: 0,
                    height: 35,
                    marginTop: 5,
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
                  placeholder='Title of listing'
                />
              </View>

              <View style={{
                marginVertical: 10
              }}>

                <Text style={{
                  textAlign: 'left',
                  fontSize: 16,
                  fontFamily: 'Futura',
                  color: '#485a69'
                }}>
                  Price
                </Text>
                
                <TextInput
                  style={{
                    flex: 0,
                    height: 35,
                    marginTop: 5,
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
                  placeholder='Name your selling price!'
                  value={this.state.priceValue.toString()}
                  onChangeText={this.handlePriceChange}
                  onBlur={() => {
                    this.setState({
                      priceValue: this.state.priceValue.trim().length
                        ? parseFloat(this.state.priceValue).toFixed(2)
                        : '0.00'
                    });
                  }}
                />
              </View>

              <View style={{
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <SegmentedControls
                  options={ unitOptions }
                  selectedOption={this.state.selectedPriceOption}
                  onSelection={ (option) => { this.setState({ selectedPriceOption: option }); } }
                  extractText={ (option) => option.label }
                  testOptionEqual={(a, b) => { return a.value == b.value; }}
                />
              </View>

              {this.state.selectedPriceOption.value == 'perunit'
                ? <View>
                    <Text style={{
                      textAlign: 'left',
                      fontSize: 16,
                      fontFamily: 'Futura',
                      color: '#485a69'
                    }}>
                      Price
                    </Text>
                    
                    <TextInput
                      style={{
                        flex: 0,
                        height: 35,
                        marginTop: 5,
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
                      placeholder='Unit'
                      value={this.state.unitValue}
                      onChangeText={this.handleUnitChange}
                      autoCorrect={false}
                      autoCapitalize='none'
                      maxLength={10}
                    />
                  </View>
                : null}

              <View style={{
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <FloatLabelTextInput
                  keyboardType='decimal-pad'
                  placeholder='Available Quantity'
                  value={this.state.availQtyValue}
                  onChangeTextValue={this.handleAvailQtyChange}
                />
              </View>

              {this.renderSubmissionError()}

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

export default AddListingModal;