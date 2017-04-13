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
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Tabs from 'react-native-tabs';
import NavigationBar from 'react-native-navbar';

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
    color: '#485a69'
  },
  tabItemSelected: {
    color: '#0ab498'
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
    backgroundColor: '#0ab498'
  },
  navTitle: {
    color: '#fff', // changing navbar title color
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
      page: 'browse'
    };
  }
  
  renderScene(route, nav) {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{ title: route.title, tintColor: '#fff' }}
          style={styles.navigationBar}
          tintColor='#0ab498'
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

        <Tabs
          selected={this.state.page}
          style={styles.itemTabbar}
          selectedStyle={styles.tabItemSelected}
          style={{ backgroundColor: '#fff' }}
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
