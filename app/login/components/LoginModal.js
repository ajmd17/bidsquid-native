import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import Button from 'react-native-button';

import Login from './Login';
import Registration from './Registration';

import events from '../../events';
import config from '../../config';


class LoginModal extends Component {
  static propTypes = {
    message: React.PropTypes.string,
    onLoginSuccess: React.PropTypes.func.isRequired,
    onModalClose: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showingRegistration: false
    };
  }

  renderContent() {
    if (this.state.showingRegistration) {
      return (
        <Registration
          onRegistrationSuccess={() => {
            this.setState({ showingRegistration: false });
          }}
          onModalClose={this.props.onModalClose}
        />
      );
    } else {
      return (
        <Login
          message={this.props.message}
          onLoginSuccess={this.props.onLoginSuccess}
          onRegisterPress={() => {
            this.setState({ showingRegistration: true });
          }}
          onModalClose={this.props.onModalClose}
        />
      );
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback>
        <Modal isVisible={true} onRequestClose={this.props.onModalClose}>
          <TouchableWithoutFeedback
            onPress={(event) => {
              event.stopPropagation();
            }}>

            {this.renderContent()}
            
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}

export default LoginModal;