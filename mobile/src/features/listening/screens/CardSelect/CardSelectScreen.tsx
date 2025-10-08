import { View, Text, TouchableOpacity } from 'react-native';
import { useListeningNavigation } from '../../../../navigation/useAppNavigation';
import { useCardProb } from '../../hooks/useCardProb';

export default function CardSelectScreen() {
    const navigation = useListeningNavigation();
    const {cardSelectStart, loading, error} = useCardProb(); 

    const handleStart = async () =>{
      const problemSetId = await cardSelectStart();
      navigation.navigate('CardSelectProb',{ problemSetId })
    }
    
  return (
    <View>
        <Text>카드 고르기</Text>
        <TouchableOpacity onPress={handleStart}>
          <Text>시작</Text>
        </TouchableOpacity>
    </View>
  );
}