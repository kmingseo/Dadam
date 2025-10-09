import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListeningHome from '../features/listening/screens/ListeningHome';
import CardSelectScreen from '../features/listening/screens/CardSelect/CardSelectScreen';
import DictationScreen from '../features/listening/screens/Dictation/DictationScreen';
import CardSelectProbScreen from '../features/listening/screens/CardSelect/CardSelectProbScreen';
import CardSelectScoreScreen from '../features/listening/screens/CardSelect/CardSelectScoreScreen';
import DictationProbScreen from '../features/listening/screens/Dictation/DictationProbScreen';
import DictationScoreScreen from '../features/listening/screens/Dictation/DictationScoreScreen';
import Test from '../features/listening/screens/Test';

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
      <Stack.Screen name="DictationScore" component={DictationScoreScreen}/>
      <Stack.Screen name="Test" component={Test}/>
    </Stack.Navigator>
  );
}