import { StyleSheet, Text, View, FlatList, RefreshControl, ScrollView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import UserAvatar from 'react-native-user-avatar';
import { FAB } from '@rneui/themed';

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetch("https://random-data-api.com/api/v2/users?size=10")
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err.message);
      })
  })

  function getUser() {
    fetch("https://random-data-api.com/api/v2/users?size=1")
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        const newUsers = [data, ...users]
        setUsers(newUsers);
      })
      .catch((err) => {
        console.log(err.message);
      })
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>Welcome to the User List</Text>
        <FlatList refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={users} renderItem={({ item }) => <ListItem user={item} />}></FlatList>
        <FAB
          style={styles.fab}
          icon={{ name: 'add', color: 'white' }}
          color="green"
          onPress={getUser}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function ListItem({ user }) {
  let os = Platform.OS;
  let fullName = `${user.first_name} ${user.last_name}`;

  if (os === 'ios') {
    return (
      <View key={user.id} style={styles.listItem}>
        <View>
          <Text>{user.first_name}</Text>
          <Text>{user.last_name}</Text>
        </View>
        <View>
          <UserAvatar size={100} name={fullName} src={user.avatar} bgColors={['#ccc', '#fafafa', '#ccaabb']} />
        </View>
      </View>
    );
  } else {
    return (
      <View key={user.id} style={styles.listItem}>
        <View>
          <UserAvatar size={100} name={fullName} src={user.avatar} bgColors={['#ccc', '#fafafa', '#ccaabb']} />
        </View>
        <View>
          <Text>{user.first_name}</Text>
          <Text>{user.last_name}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 100
  },
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 50
  }
});
