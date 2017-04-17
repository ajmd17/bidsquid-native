/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  NavigatorIOS,
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

import events from './app/events';
import BrowseScreen from './app/components/BrowseScreen';
import AlertsScreen from './app/components/AlertsScreen';
import TransactionsScreen from './app/components/TransactionsScreen';
import DashboardScreen from './app/components/DashboardScreen';


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
    backgroundColor: '#485a69',
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

export default class NavigatorIOSApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'browse',
      goBackCallbacks: []
    };
  }

  componentDidMount() {
    this.goBackListener = events.addListener('open page', (goBackCallback) => {
      this.setState({
        goBackCallbacks: this.state.goBackCallbacks.concat([goBackCallback])
      });
    });
  }

  componentWillUnmount() {
    this.goBackListener.remove();
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
            
            fontFamily: 'Futura',
            fontSize: 16,
            color: '#fff'
          }}>
          Back
        </Button>
        </View>
      );
    }

    return (
      <View style={styles.container}>
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
          style={styles.navigationBar}
          statusBar={{
            tintColor: '#485a69',
            style: 'light-content'
          }}
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

        <Tabs
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

        </Tabs>

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


AppRegistry.registerComponent('BidSquidNative', () => NavigatorIOSApp);
