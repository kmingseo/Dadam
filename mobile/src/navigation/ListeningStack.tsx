import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListeningHome from '../features/listening/screens/ListeningHome';
import ListeningStep1 from '../features/listening/screens/ListeningStep1';
import ListeningStep2 from '../features/listening/screens/ListeningStep2';
import Test from '../features/listening/screens/Test';

const Stack = createNativeStackNavigator();

export default function ListeningStack() {
  return (
    <Stack.Navigator initialRouteName="ListeningHome">
      <Stack.Screen name="ListeningHome" component={ListeningHome} />
      <Stack.Screen name="ListeningStep1" component={ListeningStep1}/>
      <Stack.Screen name="ListeningStep2" component={ListeningStep2}/>
      <Stack.Screen name="Test" component={Test}/>
    </Stack.Navigator>
  );
}