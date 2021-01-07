import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  View,
  Text,
  StatusBar,
  TextInput,
} from 'react-native';
import {AuthContext} from '../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    padding: 10,
    fontSize: 32,
  },
});

function SignInScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        autoCompleteType="email"
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({email, password})} />
    </View>
  );
}

export default SignInScreen;
