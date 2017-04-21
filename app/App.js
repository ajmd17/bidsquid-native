import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Navigator,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import Button from 'react-native-button';
import Tabs from 'react-native-tabs';
import NavigationBar from 'react-native-navbar';

import BrowseScreen from './components/BrowseScreen';
import AlertsScreen from './components/AlertsScreen';
import TransactionsScreen from './components/TransactionsScreen';
import DashboardScreen from './components/DashboardScreen';
import LoginModal from './login/components/LoginModal';
import AboutModal from './about/components/AboutModal';

import events from './events';
import config from './config';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  itemTabbar: {
    bottom: 0
  },
  tabItem: {
    fontSize: 12,
    fontFamily: 'Futura-Medium',
    color: '#485a69'
  },
  tabItemSelected: {
    color: '#4285f4'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  navigationBar: {
    backgroundColor: '#0ab498',
  },
  navTitle: {
    color: '#fff', // changing navbar title color
    
    paddingTop: 20,
    paddingBottom: 20
  },
  routerScene: {
    paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight, // some navbar padding to avoid content overlap
  },
});

const routes = [{
  name: 'browse',
  title: 'Browse',
  component: BrowseScreen
}, {
  name: 'alerts',
  title: 'Alerts',
  component: AlertsScreen
}, {
  name: 'transactions',
  title: 'Transactions',
  component: TransactionsScreen
}, {
  name: 'dashboard',
  title: 'More',
  component: DashboardScreen
}];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'browse',
      goBackCallbacks: [],
      showLoginButton: true,
      showingLoginModal: false,
      showingAboutModal: false
    };
  }

  componentDidMount() {
    this.goBackListener = events.addListener('open page', (goBackCallback) => {
      this.setState({
        goBackCallbacks: this.state.goBackCallbacks.concat([goBackCallback])
      });
    });

    this.loginListener = events.addListener('auth change', (accessToken) => {
      this.setState({
        showLoginButton: accessToken == null
      });
    });

    // auto check if logged in
    AsyncStorage.getItem('access token').then((token) => {
      // show login button only if it is not set.
      this.setState({
        showLoginButton: token == null
      });
    }).catch((err) => {
      console.error('Error loading access token:', err);
    });
  }

  componentWillUnmount() {
    this.goBackListener.remove();
    this.loginListener.remove();
  }
  
  renderScene = (route, nav) => {
    let leftButton;
    if (this.state.goBackCallbacks.length != 0) {
      leftButton = (
        <View style={{
        }}>
          <Button
            onPress={((cb) => {
              cb();
              this.setState({
                // chop last item (pop)
                goBackCallbacks: this.state.goBackCallbacks.slice(0, this.state.goBackCallbacks.length - 1)
              });
            }).bind(this, this.state.goBackCallbacks[this.state.goBackCallbacks.length - 1])}

            containerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
            style={{
              
              fontFamily: config.DEFAULT_FONT,
              fontSize: 16,
              color: '#fff'
            }}>
            Back
          </Button>
        </View>
      );
    } else {
      leftButton = (
        <View style={{
        }}>
          <Button
            onPress={(() => {
              this.setState({
                showingAboutModal: true
              });
            })}

            containerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
            style={{
              
              fontFamily: config.DEFAULT_FONT,
              fontSize: 16,
              color: '#fff'
            }}>
            About
          </Button>
        </View>
      );
    }

    let rightButton;
    if (this.state.showLoginButton) {
      rightButton = (
        <View style={{
        }}>
          <Button
            onPress={(() => {
              this.setState({ showingLoginModal: true });
            })}

            containerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
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
    } else {
      rightButton = (
        <View style={{
        }}>
          <Button
            onPress={(() => {
              // log user out
              AsyncStorage.removeItem('access token').then(() => {
                events.emit('auth change', null);
              }).catch((err) => {
                console.error('Error logging out:', err);
              });
            })}

            containerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
            style={{
              
              fontFamily: config.DEFAULT_FONT,
              fontSize: 16,
              color: '#fff'
            }}>
            Log Out
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        
        <StatusBar
          backgroundColor='#0ab498'
          barStyle='light-content'
        />
        <NavigationBar
          title={{
            title: 'Haystack',
            tintColor: '#fff',
            style: {
              fontFamily: 'GillSans-Italic',
              fontSize: 28
            }
          }}
          leftButton={leftButton}
          rightButton={rightButton}
          style={styles.navigationBar}
        />
        
        {(() => {
          let rootEl = routes.find((rootEl) => {
            return rootEl.name == route.name;
          });

          if (rootEl == null) {
            return null;
          }

          return <rootEl.component navigator={nav}/>;
        })()}
      </View>
    );
  };

  renderLoginModal() {
    if (this.state.showingLoginModal) {
      return (
        <LoginModal
          onLoginSuccess={() => {
            // show 'new topic' modal after login success
            this.setState({
              showingLoginModal: false,
              showLoginButton: false
            });
          }}
          onModalClose={() => {
            this.setState({ showingLoginModal: false });
          }}
        />
      );
    }
  }

  renderAboutModal() {
    if (this.state.showingAboutModal) {
      return (
        <AboutModal
          onModalClose={() => {
            this.setState({ showingAboutModal: false });
          }}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{
            name: 'browse',
            title: 'Browse',
            component: BrowseScreen
          }}
          ref='nav'
          renderScene={this.renderScene}
        />

        {/*<Tabs
          selected={this.state.page}
          style={styles.itemTabbar}
          selectedStyle={styles.tabItemSelected}
          style={{
            backgroundColor: '#fff',
          }}
          onSelect={(el) => {
            this.setState({
              page: el.props.name
            });

            let route = routes.find((route) => {
              return route.name == el.props.name;
            });
            if (route != null) {
              this.refs.nav.replace({ ...route });
            }
          }}>

          {routes.map((el, i) => {
            return (
              <Text name={el.name} style={styles.tabItem} key={i}>
                {el.title}
              </Text>
            );
          })}

        </Tabs>*/}

        {this.renderLoginModal()}
        {this.renderAboutModal()}

      </View>
    );
  }
}

class MyScene extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 'browse'
    };
  }

  _navigateToPage = (pageName) => {
    this.setState({ page: pageName });
    this.props.navigator.push({
      name: pageName,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Tabs selected={this.state.page}
          style={styles.itemTabbar}
          selectedStyle={styles.tabItemSelected}
          style={{ backgroundColor: '#fff' }}
          onSelect={(el) => {
            this._navigateToPage(el.props.name);
          }}>

          <Text name='browse' style={styles.tabItem}>Browse</Text>
          <Text name='alerts' style={styles.tabItem}>Alerts</Text>
          <Text name='transactions' style={styles.tabItem}>Transactions</Text>
          <Text name='more' style={styles.tabItem}>More</Text>
        </Tabs>
        
      </View>
    )
  }
}

export default App;