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


class NewTopicModal extends Component {
  static propTypes = {
    accessToken: React.PropTypes.string.isRequired,
    market: React.PropTypes.object.isRequired,
    onAdded: React.PropTypes.func.isRequired,
    onModalClose: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      titleValue: '',
      submitting: false,
      submissionError: null
    };
  }
  
  handleSubmitPress = () => {
    fetch(`${config.API_SERVER_URL}/api/markets/${this.props.market._id}/topics`, {
      method: 'POST',
      headers: {
        'x-access-token': this.props.accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.titleValue
      })
    }).then((response) => response.json())
    .then((json) => {
      if (!json.error) {
        console.log('added topic:', json);
        this.props.onAdded(json.topic);
      } else {
        this.setState({
          submitting: false,
          submissionError: json.error
        });
      }
    }).catch((err) => {
      console.error('Error adding topic:', err);
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
          fontFamily: config.DEFAULT_FONT,
          fontSize: 16,
          color: '#cb2431',
          textAlign: 'center'
        }}>
          Submission Error: {this.state.submissionError}
        </Text>
      );
    }
  }

  renderModalBottom() {
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
            fontFamily: config.DEFAULT_FONT,
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
            fontFamily: config.DEFAULT_FONT,
            fontSize: 16,
            color: '#fff'
          }}>
          Submit
        </Button>

      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback>
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
                fontFamily: config.DEFAULT_FONT,
                fontSize: 24,
                color: '#485a69',
                textAlign: 'center'
              }}>
                New Topic
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
                  fontFamily: config.DEFAULT_FONT,
                  color: '#485a69'
                }}>
                  Title
                </Text>
                <TextInput
                  value={this.state.titleValue}
                  placeholder='Enter title of topic'
                  onChangeText={(text) => {
                    this.setState({ titleValue: text });
                  }}
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
                    fontFamily: config.DEFAULT_FONT,
                    color: '#485a69'
                  }}
                />
              </View>

              {this.renderSubmissionError()}
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
    fontFamily: config.DEFAULT_FONT,
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
    fontFamily: config.DEFAULT_FONT,
    fontSize: 20,
    color: '#fff'
  }
});

export default NewTopicModal;