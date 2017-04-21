import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Button from 'react-native-button';
import InViewport from '../../components/InViewport';

import TopicItem from './TopicItem';
import NewTopicModal from './NewTopicModal';
import LoginModal from '../../login/components/LoginModal';

import config from '../../config';


const NUM_TOPICS_PER_LOAD = 10;

function createQueryString(queryParams) {
  return Object.keys(queryParams)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
    .join('&')
    .replace(/%20/g, '+');
}

class Topics extends Component {
  static propTypes = {
    market: React.PropTypes.object.isRequired,
    geo: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      topics: null,
      numTopics: null,
      loading: true,
      showingNewTopicModal: false,
      showingLoginModal: false,
      accessToken: null
    };
  }

  componentDidMount() {
    const queryString = createQueryString({
      latitude: this.props.geo.geo[0],
      longitude: this.props.geo.geo[1],
      distanceKm: 50
    });

    Promise.all([
      fetch(`${config.API_SERVER_URL}/api/markets/${this.props.market._id}/topics/count?${queryString}`),
      fetch(`${config.API_SERVER_URL}/api/markets/${this.props.market._id}/topics/all/0/${NUM_TOPICS_PER_LOAD}?${queryString}`),
    ])
    .then((responses) => Promise.all(responses.map((response) => response.json())))
    .then(([countJson, topicsJson]) => {
      if (countJson.error) {
        console.error('Error loading topics count:', countJson.error);
      } else if (topicsJson.error) {
        console.error('Error loading topics:', topicsJson.error);
      } else {
        console.log('results:', [countJson, topicsJson])
        this.setState({
          topics: topicsJson.topics,
          numTopics: countJson.count,
          loading: false
        });
      }
    })
  }

  handleCreateTopicPress = () => {
    AsyncStorage.getItem('access token').then((token) => {
      console.log('got access token:', token);
      if (token == null) {
        // show login modal, uid not set
        this.setState({
          showingLoginModal: true
        });
      } else {
        // show new topic modal
        this.setState({
          showingNewTopicModal: true,
          accessToken: token
        });
      }
    }).catch((err) => {
      console.error('Error loading access token:', err);
    });
  };

  loadMore = (visible) => {
    if (visible) {
      const queryString = createQueryString({
        latitude: this.props.geo.geo[0],
        longitude: this.props.geo.geo[1],
        distanceKm: 50
      });

      // load more topics based on number of possible topics to load
      fetch(`${config.API_SERVER_URL}/api/markets/${this.props.market._id}/topics/all/${(this.state.topics || []).length}/${NUM_TOPICS_PER_LOAD}?${queryString}`)
        .then((response) => response.json())
        .then((json) => {
          if (json.error) {
            throw new Error(json.error);
          }
          
          this.setState({
            topics: (this.state.topics || []).concat(json.topics),
            loading: false
          });
        })
        .catch((err) => {
          console.error('Error loading more topics:', err);
        });
    } else {
      // if there are more to load, 
      // then set back to loading so we see animation later
      this.setState({
        loading: this.state.numTopics > this.state.topics.length
      });
    }
  };

  renderNewTopicModal() {
    if (this.state.showingNewTopicModal) {
      return (
        <NewTopicModal
          accessToken={this.state.accessToken}
          market={this.props.market}
          onAdded={(topic) => {
            this.setState({
              showingNewTopicModal: false,
              topics: (this.state.topics || []).concat([topic])
            });
          }}
          onModalClose={() => {
            this.setState({ showingNewTopicModal: false });
          }}
        />
      );
    }
  }

  renderLoginModal() {
    if (this.state.showingLoginModal) {
      return (
        <LoginModal
          message='To create topics and participate in discussions, sign in to an account.'
          onLoginSuccess={(token) => {
            // show 'new topic' modal after login success
            this.setState({
              showingLoginModal: false,
              showingNewTopicModal: true,
              accessToken: token
            });
          }}
          onModalClose={() => {
            this.setState({ showingLoginModal: false });
          }}
        />
      );
    }
  }

  renderTopics() {
    if (this.state.topics != null) {
      if (this.state.topics.length != 0) {
        return (
          <ScrollView>
            {this.state.topics.map((el, i) => {
              console.log(el);
              return (
                <TopicItem
                  topic={el}
                  key={i}
                />
              );
            })}
          </ScrollView>
        );
      } else {
        return (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: 24,
              fontFamily: config.DEFAULT_FONT,
              color: '#485a69',
              textAlign: 'center'
            }}>
              No topics in this market yet.
            </Text>
            <TouchableOpacity onPress={this.handleCreateTopicPress}>
              <Text style={{
                fontSize: 24,
                fontFamily: config.DEFAULT_FONT,
                color: '#0ab498',
                textAlign: 'center'
              }}>
                Create a new topic
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <View style={{

          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: '#fff'
        }}>
          <View style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginHorizontal: 10,
            paddingTop: 10
          }}>

            <View style={{ flex: 1 }}>
              <Text style={{
                color: '#485a69',
                fontFamily: config.DEFAULT_FONT,
                fontSize: 24,
                textAlign: 'left',
              }}>
                Topics for {this.props.market.name}
              </Text>
            </View>

            <View>
              <Button
                onPress={this.handleCreateTopicPress}
                containerStyle={{
                  flex: 0,
                  justifyContent: 'center',
                  padding: 5,
                  borderRadius: 3,
                  borderWidth: 1,
                  borderColor: '#0ab498',
                  backgroundColor: '#48B9A6'
                }}
                style={{
                  fontFamily: config.DEFAULT_FONT,
                  fontSize: 16,
                  color: '#fff'
                }}>
                + Create Topic
              </Button>
            </View>
          </View>

          <Text style={{
            marginLeft: 10,
            color: '#86929b',
            fontFamily: config.DEFAULT_FONT,
            fontSize: 15,
          }}>
            {this.props.geo.name}, {this.props.geo.provinceCode}
          </Text>

          <TextInput
            style={{
              height: 35,
              marginHorizontal: 10,
              marginVertical: 10,
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
            onChangeText={(text) => this.setState({ searchValue: text })}
            value={this.state.searchValue}
            placeholder='Search topics...'
          />
        </View>

        {this.state.topics == null
          ? <ActivityIndicator
              animating
              size='large'
            />
          : null}

        {this.renderNewTopicModal()}
        {this.renderLoginModal()}
        {this.renderTopics()}
      </View>
    );
  }
}

export default Topics;