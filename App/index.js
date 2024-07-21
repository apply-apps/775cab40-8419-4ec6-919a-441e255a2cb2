// Filename: index.js
// Combined code from all files
import React from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View, TextInput, Button, ActivityIndicator, Alert, FlatList } from 'react-native';
import axios from 'axios';

const WorkoutInput = ({ onAddWorkout }) => {
  const [workout, setWorkout] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  
  const handleAddWorkout = () => {
    if (workout && sets && reps) {
      onAddWorkout({ workout, sets, reps });
      setWorkout('');
      setSets('');
      setReps('');
    } else {
      Alert.alert('All fields are required.');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Workout"
        value={workout}
        onChangeText={setWorkout}
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <Button title="Add Workout" onPress={handleAddWorkout} />
    </View>
  );
};

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the workouts from the API Hub
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('http://apihub.p.appply.xyz:3300/workouts');
        setWorkouts(response.data.workouts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutText}>{item.workout}</Text>
      <Text style={styles.workoutText}>Sets: {item.sets}</Text>
      <Text style={styles.workoutText}>Reps: {item.reps}</Text>
    </View>
  );

  return (
    <FlatList
      data={workouts}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const App = () => {
  const addWorkout = (newWorkout) => {
    // Handle adding the new workout to the list or send it to the server
    // For now, just log it
    console.log(newWorkout);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout Tracker</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <WorkoutInput onAddWorkout={addWorkout} />
        <WorkoutList />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  scrollView: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderRadius: 10,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
  workoutItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  workoutText: {
    fontSize: 16,
  },
});

export default App;