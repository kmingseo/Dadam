import { View, Text, TouchableOpacity } from 'react-native';
import { useListeningNavigation } from '../../../navigation/useAppNavigation';
import { useDictaionProb } from '../hooks/useDicationProb';

export default function DictationScreen() {
    const navigation = useListeningNavigation();
    const {dictationStart, loading, error} = useDictaionProb();
    
    const handleStart = async () => {
      const problemSetId = await dictationStart();
      navigation.navigate('DictationProb', {problemSetId});
    }

  return (
    <View>
        <Text>받아쓰기</Text>
        <TouchableOpacity onPress={handleStart}>
          <Text>시작</Text>
        </TouchableOpacity>
    </View>
  );
}