import {
  StackNavigator,
} from 'react-navigation';

import MainScreen from './components/MainScreen';


const App = StackNavigator({
  Main: { screen: MainScreen }
});

export default App;