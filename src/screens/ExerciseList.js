import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
  Button,
  View,
  Text,
  StatusBar,
  TextInput,
} from 'react-native';
import {getData, storeData} from '../AsyncStorage';

import {AuthContext} from '../Constants';

function ExerciseList() {
  const [exerciseList, setExerciseList] = React.useState('');

  useEffect(() => {
    let token = getData('userToken');
    fetch('https://exercisetracker-299302.ue.r.appspot.com/exercises', {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((resData) => {
        console.log(resData);
        setExerciseList(resData);
      })
      .catch((err) => console.log(err));
  });

  return (
    <FlatList
      data={exerciseList}
      renderItem={ItemList}
      keyExtractor={(item) => item.id}
    />
  );
}

function ItemList(title) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default ExerciseList;
