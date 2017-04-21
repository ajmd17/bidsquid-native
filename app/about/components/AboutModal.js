import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import Button from 'react-native-button';

import events from '../../events';
import config from '../../config';


class AboutModal extends Component {
  static propTypes = {
    onModalClose: React.PropTypes.func.isRequired
  };

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
          Close
        </Button>

      </View>
    );
  }

  renderContent() {
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
            About Haystack
          </Text>

          <View>
            <Text style={{
              marginVertical: 10,
              fontFamily: config.DEFAULT_FONT,
              color: '#485a69',
              textAlign: 'center'
            }}>
              Haystack is a platform based on BidSquid.{'\n\n'}
              It's been created to give a place for local producers to form an online community and connect with others.
            </Text>
          </View>

          {this.renderModalBottom()}
        </View>
      </ScrollView>
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

            {this.renderContent()}
            
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}

export default AboutModal;