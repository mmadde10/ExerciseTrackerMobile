import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  View,
  Text,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import {AuthContext} from './Constants';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = ({navigation}) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        fetch('https://exercisetracker-299302.ue.r.appspot.com/users/signin', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: data.email, password: data.password}),
        })
          .then((response) => response.json())
          .then((resData) => {
            if (resData.user.tokens) {
              dispatch({type: 'SIGN_IN', token: resData.user.tokens[0].token});
              //TODO handle 400, 404s
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),

      signUp: async (data) => {
        fetch('https://exercisetracker-299302.ue.r.appspot.com/users/signup', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: data.email, password: data.password}),
        })
          .then((response) => response.json())
          .then(async (resData) => {
            if (resData.user.tokens) {
              // store token
              await AsyncStorage.setItem('userToken', resData.user.tokens[0]);
              dispatch({type: 'SIGN_IN', token: resData.user.tokens[0].token});
              //TODO handle 400, 404s
            }
          });
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
