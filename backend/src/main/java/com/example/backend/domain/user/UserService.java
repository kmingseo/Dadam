package com.example.backend.domain.user;

import com.example.backend.domain.user.dto.LoginRequest;
import com.example.backend.domain.user.dto.TokenResponse;
import com.example.backend.domain.user.dto.SignupRequest;
import com.example.backend.global.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
//import com.example.backend.global.security.JwtTokenProvider;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    //회원가입
   public void signup(SignupRequest signupRequest) {
       if(userRepository.existsById(signupRequest.getUserId())){
           throw new RuntimeException("이미 존재하는 ID입니다");
       }

       String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());

       User user = new User();
       user.setUserId(signupRequest.getUserId());
       user.setPassword(encodedPassword);
       user.setEmail(signupRequest.getEmail());
       user.setUsername(signupRequest.getUsername());
       user.setNativeLanguage(signupRequest.getNativeLanguage());

       userRepository.save(user);

   }

   public TokenResponse login(LoginRequest loginRequest) {
       User user = userRepository.findById(loginRequest.getUserId())
               .orElseThrow(()->new RuntimeException("존재하지 않는 ID입니다."));

       if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
           throw new RuntimeException("비밀번호가 일치하지 않습니다.");
       }

       String accessToken = jwtTokenProvider.generateAccessToken(user.getUserId(), user.getRole());
       String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId(), user.getRole());

       refreshTokenService.storeRefreshToken(user.getUserId(), refreshToken);

       return new TokenResponse(accessToken, refreshToken);
   }

   @Transactional
   public void updateReward(int coin) {
       UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
       User user = userDetails.getUser();

       User managedUser = userRepository.findById(user.getUserId()).get();
       managedUser.setCoin(user.getCoin() + coin);
   }
}
