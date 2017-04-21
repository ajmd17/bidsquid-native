import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  AsyncStorage,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Button from 'react-native-button';

import events from '../../events';
import config from '../../config';


class Login extends Component {
  static propTypes = {
    message: React.PropTypes.string,
    onLoginSuccess: React.PropTypes.func.isRequired,
    onRegisterPress: React.PropTypes.func.isRequired,
    onModalClose: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',
      password: '',
      loginError: null,
      loading: false
    };
  }

  handleEmailAddressChange = (text) => {
    this.setState({
      emailAddress: text,
      loginError: null
    });
  };

  handlePasswordChange = (text) => {
    this.setState({
      password: text,
      loginError: null
    });
  };

  handleLoginPress = () => {
    // login to server
    fetch(`${config.API_SERVER_URL}/api/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        email: this.state.emailAddress,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.error != null) {
        this.setState({
          loginError: json.error,
          password: '' // reset password to empty
        });
      } else {
        this.setState({
          loading: true
        });
        console.log('json:', json);

        // save
        return AsyncStorage.setItem('access token', json.token).then(() => {
          // emit event
          events.emit('auth change', json.token);
          // login success
          this.props.onLoginSuccess(json.token);
        });
      }
    }).catch((err) => {
      console.error('Error logging in:', err);
      this.setState({
        loginError: err.message,
        password: '' // reset password to empty
      });
    });
  };

  renderLoginError() {
    if (this.state.loginError) {
      return (
        <View>
          <Text style={{
            color: '#cb2431',
            fontFamily: config.DEFAULT_FONT,
            fontSize: 18,
            textAlign: 'center'
          }}>
            {this.state.loginError}
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
          onPress={this.handleLoginPress}
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
          Log In
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
            marginBottom: 10,
            textAlign: 'center'
          }}>
            Log In to Your Account
          </Text>

          <View>
            {this.props.message != null
              ? <Text style={{
                  marginVertical: 10,
                  fontFamily: config.DEFAULT_FONT,
                  color: '#485a69',
                  textAlign: 'center'
                }}>
                  {this.props.message}
                </Text>
              : null}

            <Text style={{
              marginVertical: 10,
              fontFamily: config.DEFAULT_FONT,
              color: '#485a69',
              textAlign: 'center'
            }}>
              Logging into your account allows you to create listings, interact with listings, and participate in discussions.
            </Text>
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
          </View>

          <View style={{
            marginVertical: 10
          }}>
            <TextInput
              returnKeyType='go'
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

            {this.state.loading
              ? <ActivityIndicator
                  animated
                  size='small'
                />
              : null}

            {this.renderLoginError()}

            <View style={{
              flex: 0,
              alignItems: 'center',
              marginTop: 20,
            }}>
              <Text style={{
                fontSize: 16,
                fontFamily: config.DEFAULT_FONT,
                color: '#485a69'
              }}>
                Don't have an account yet?
              </Text>
              <TouchableOpacity onPress={this.props.onRegisterPress}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: config.DEFAULT_FONT,
                  color: '#0ab498'
                }}>
                  Sign up today!
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          
          {this.renderModalBottom()}
        </View>
      </ScrollView>
    );
  }
}

export default Login;