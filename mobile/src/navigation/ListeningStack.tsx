import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListeningHome from '../features/listening/screens/ListeningHome';
import CardSelectScreen from '../features/listening/screens/CardSelectScreen';
import DictationScreen from '../features/listening/screens/DictationScreen';
import CardSelectProbScreen from '../features/listening/screens/CardSelectProbScreen';
import CardSelectScoreScreen from '../features/listening/screens/CardSelectScoreScreen';
import DictationProbScreen from '../features/listening/screens/DictationProbScreen';

const Stack = createNativeStackNavigator();

export default function ListeningStack() {
  return (
    <Stack.Navigator initialRouteName="ListeningHome">
      <Stack.Screen name="ListeningHome" component={ListeningHome} />
      <Stack.Screen name="CardSelect" component={CardSelectScreen}/>
      <Stack.Screen name="CardSelectProb" component={CardSelectProbScreen}/>
      <Stack.Screen name="CardSelectScore" component={CardSelectScoreScreen}/>
      <Stack.Screen name="Dictation" component={DictationScreen}/>
      <Stack.Screen name="DictationProb" component={DictationProbScreen}/>
    </Stack.Navigator>
  );
}