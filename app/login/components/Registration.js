import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Button from 'react-native-button';

import PostalCodeField from '../../components/PostalCodeField';

import events from '../../events';
import config from '../../config';
import emailValidator from '../../email-validator';


class Registration extends Component {
  static propTypes = {
    onRegistrationSuccess: React.PropTypes.func.isRequired,
    onModalClose: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      emailAddress: '',
      password: '',
      passwordRepeat: '',
      nameNotEnteredError: false,
      emailNotEnteredError: false,
      emailNotValidError: false,
      passwordNotEnteredError: false,
      passwordRepeatNotEnteredError: false,
      passwordsDontMatchError: false,
      postalCodeNotEnteredError: false,
      registrationError: null,
      loading: false,
      foundPlace: null,
      searching: false,
      postalCodeError: null
    };
  }

  handleFullNameChange = (text) => {
    this.setState({
      fullName: text,
      nameNotEnteredError: false,
      registrationError: null
    });
  };

  handleEmailAddressChange = (text) => {
    this.setState({
      emailAddress: text,
      emailNotEnteredError: false,
      emailNotValidError: false,
      registrationError: null
    });
  };

  handlePasswordChange = (text) => {
    this.setState({
      password: text,
      passwordNotEnteredError: false,
      passwordsDontMatchError: false,
      registrationError: null
    });
  };

  handlePasswordRepeatChange = (text) => {
    this.setState({
      passwordRepeat: text,
      passwordRepeatNotEnteredError: false,
      passwordsDontMatchError: false,
      registrationError: null
    });
  };

  validateFields = () => {
    let newState = {};

    if (this.state.fullName == null || this.state.fullName.trim().length == 0) {
      newState.nameNotEnteredError = true;
    }
    
    if (this.state.emailAddress == null || this.state.emailAddress.trim().length == 0) {
      newState.emailNotEnteredError = true;
    } else if (!emailValidator.check(this.state.emailAddress)) {
      newState.emailNotValidError = true;
    }

    if (this.state.password == null || this.state.password.trim().length == 0) {
      newState.passwordNotEnteredError = true;
    }

    if (this.state.passwordRepeat == null || this.state.passwordRepeat.trim().length == 0) {
      newState.passwordRepeatNotEnteredError = true;
    } else if (this.state.password != this.state.passwordRepeat) {
      newState.passwordsDontMatchError = true;
    }

    if (this.state.foundPlace == null) {
      newState.postalCodeNotEnteredError = true;
    }

    this.setState(newState);

    return Object.keys(newState).length == 0;
  };

  handleRegisterPress = () => {
    if (this.validateFields()) {
      // login to server
      fetch(`${config.API_SERVER_URL}/api/register`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          name: this.state.fullName,
          email: this.state.emailAddress,
          password: this.state.password,
          latitude: this.state.foundPlace.geo[0],
          longitude: this.state.foundPlace.geo[1]
        })
      })
      .then((response) => response.json())
      .then((json) => {
        if (json.error != null) {
          this.setState({
            registrationError: json.error,
            password: '' // reset password to empty
          });
        } else {
          this.setState({
            loading: true
          }, () => {
            setTimeout(() => {
              // registration success
              this.props.onRegistrationSuccess(json);
            }, 1500);
          })
        }
      }).catch((err) => {
        console.error('Error registering account:', err);
        this.setState({
          registrationError: err.message,
          password: '' // reset password to empty
        });
      });
    }
  };

  renderRegistrationError() {
    if (this.state.registrationError) {
      return (
        <View>
          <Text style={{
            color: '#cb2431',
            fontFamily: config.DEFAULT_FONT,
            fontSize: 18,
            textAlign: 'center'
          }}>
            {this.state.registrationError}
          </Text>
        </View>
      );
    }
  }

  renderModalBottom() {
    return (
      <View style={{
        marginTop: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee'
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
            borderColor: '#86929b',
          }}
          style={{
            fontFamily: config.DEFAULT_FONT,
            fontSize: 16,
            color: '#86929b'
          }}>
          Cancel
        </Button>

        <Button
          onPress={this.handleRegisterPress}
          containerStyle={{
            marginTop: 5,
            marginHorizontal: 10,
            paddingVertical: 5,
            paddingHorizontal: 20,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#0ab498',
            backgroundColor: '#0ab498'
          }}
          style={{
            fontFamily: config.DEFAULT_FONT,
            fontSize: 16,
            color: '#fff'
          }}>
          Register
        </Button>

      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            justifyContent: 'center',
            borderRadius: 3
          }}>
        
          <Text style={{
            fontFamily: config.DEFAULT_FONT,
            fontSize: 24,
            color: '#485a69',
            marginBottom: 10
          }}>
            Create an Account
          </Text>

          <View>
            <Text style={{
              marginVertical: 10,
              fontFamily: config.DEFAULT_FONT,
              color: '#485a69'
            }}>
              Having an account allows you to create listings, interact with listings, and participate in discussions.
            </Text>
          </View>

          <View style={{
            marginVertical: 10
          }}>
            <TextInput
              value={this.state.fullName}
              onChangeText={this.handleFullNameChange}
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
                color: '#485a69'
              }}
              placeholder='Your full name'
            />

            {this.state.nameNotEnteredError
              ? <Text style={{
                  color: '#cb2431',
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 18
                }}>
                  Your name is required.
                </Text>
              : null}
          </View>

          <View style={{
            marginVertical: 10
          }}>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='email-address'
              value={this.state.emailAddress}
              onChangeText={this.handleEmailAddressChange}
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
                color: '#485a69'
              }}
              placeholder='Your email address'
            />

            {this.state.emailNotEnteredError
              ? <Text style={{
                  color: '#cb2431',
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 18
                }}>
                  Your email address is required.
                </Text>
              : null}

            {this.state.emailNotValidError
              ? <Text style={{
                  color: '#cb2431',
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 18
                }}>
                  The email you have provided is not valid.
                </Text>
              : null}
          </View>

          <View style={{
            marginVertical: 10
          }}>
            <TextInput
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={this.handlePasswordChange}
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
                color: '#485a69'
              }}
              placeholder='Password'
            />

            {this.state.passwordNotEnteredError
              ? <Text style={{
                  color: '#cb2431',
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 18
                }}>
                  Password is required.
                </Text>
              : null}
          </View>

          <View style={{
            marginVertical: 10
          }}>
            <TextInput
              secureTextEntry={true}
              value={this.state.passwordRepeat}
              onChangeText={this.handlePasswordRepeatChange}
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
                color: '#485a69'
              }}
              placeholder='Password (repeat)'
            />

            {this.state.passwordRepeatNotEnteredError
              ? <Text style={{
                  color: '#cb2431',
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 18
                }}>
                  Password repeat is required.
                </Text>
              : null}

            {this.state.passwordsDontMatchError
              ? <Text style={{
                  color: '#cb2431',
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 18
                }}>
                  The passwords you have entered do not match.
                </Text>
              : null}
          </View>

          <View style={{
            marginVertical: 10
          }}>
            <PostalCodeField
              onPostalCodeChanged={(postalCode) => {
                console.log('onPostalCodeChanged:', postalCode);
                this.setState({
                  foundPlace: null,
                  searching: postalCode.length == 3,
                  postalCodeError: null,
                  postalCodeNotEnteredError: false
                });
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
                  postalCodeError: null,
                  postalCodeNotEnteredError: false
                });
              }}
            />

            {this.state.foundPlace != null
              ? <View style={{
                  flex: 0,
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>
                  <Image source={require('../../../img/check-green.png')}/>
                  <Text style={{
                    marginLeft: 5,
                    fontFamily: config.DEFAULT_FONT,
                    color: '#485a69'
                  }}>
                    {this.state.foundPlace.name}
                  </Text>
                </View>
              : null}

            {this.state.postalCodeNotEnteredError
              ? <Text style={{
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 18,
                  color: '#cb2431'
                }}>
                  Postal code is required.
                </Text>
              : null}

              {this.state.postalCodeError != null
                ? <Text style={{
                    fontFamily: config.DEFAULT_FONT,
                    fontSize: 18,
                    color: '#cb2431'
                  }}>
                    {this.state.postalCodeError}
                  </Text>
                : null}
          </View>


          {this.state.loading || this.state.searching
            ? <ActivityIndicator
                animated
                size='small'
              />
            : null}

          {this.renderRegistrationError()}

          
          {this.renderModalBottom()}
        </View>
      </ScrollView>
    );
  }
}

export default Registration;