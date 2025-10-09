import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useAuthNavigation } from '../../../navigation/useAppNavigation';
import { testFetch } from '../../../fetch/testFetch';
import { useLoginForm } from '../hooks/useLoginForm';
import { useLogin } from '../hooks/useLogin';

function LoginScreen() {
  const navigation = useAuthNavigation();
  const [check, setCheck] = useState('실패');
  const { user, handleChange, handleIdChange } = useLoginForm();
  const { login } = useLogin();

    useEffect(() => {
    const fetchData = async()=>{
      const res=await testFetch();
      setCheck(res);
    }

    fetchData();
  }, []);

  const handleSignupNavigation = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    try {
      await login(user);
      Alert.alert('로그인 성공');
    } catch (e) {
      Alert.alert('로그인 실패');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>서버 연결 {check}</Text>

          <TextInput
              placeholder="아이디"
              placeholderTextColor="#888"
              value={user.userId}
              onChangeText={handleIdChange}
              maxLength={16}
              keyboardType="default"
          />
          
          <TextInput
              placeholder="비밀번호"
              placeholderTextColor="#888"
              value={user.password}
              secureTextEntry
              onChangeText={text => handleChange('password', text)}
              maxLength={20}
          />
          
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}>
            <Text>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignupNavigation}
            style={styles.button}>
            <Text>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default LoginScreen;
