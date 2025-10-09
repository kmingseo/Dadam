import { View, Text, TouchableOpacity } from 'react-native';
import { useListeningNavigation } from '../../../../navigation/useAppNavigation';
import { useDictaionProb } from '../../hooks/useDicationProb';

export default function DictationScreen() {
    const navigation = useListeningNavigation();
    const {dictationStart, loading, error} = useDictaionProb();

    const handleWord = async () => {
      const problemSetId = await dictationStart('word');
      navigation.navigate('DictationProb', {problemSetId});
    }
    
    const handleSentence = async () => {
      const problemSetId = await dictationStart('sentence');
      navigation.navigate('DictationProb', {problemSetId});
    }


  return (
    <View>
        <Text>받아쓰기</Text>
        <TouchableOpacity onPress={handleWord}>
          <Text>단어</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSentence}>
          <Text>문장</Text>
        </TouchableOpacity>
    </View>
  );
}