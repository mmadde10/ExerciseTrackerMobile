import React from 'react';
import {Button, View, Text} from 'react-native';
import {AuthContext} from '../Constants';

function HomeScreen() {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

export default HomeScreen;
