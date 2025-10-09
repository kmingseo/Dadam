package com.example.backend.domain.user;

import com.example.backend.domain.user.dto.RewardRequest;
import com.example.backend.domain.user.dto.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/user-info")
    public ResponseEntity<UserInfo> getUserInfo(@AuthenticationPrincipal UserDetailsImpl userDetails){
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userDetails.getUser();

        UserInfo userInfo = new UserInfo(
                user.getUsername(),
                user.getEmail(),
                user.getNativeLanguage(),
                user.getLevel(),
                user.getCoin(),
                user.getRole().name()
        );

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/reward")
    public ResponseEntity<Void> getReward(@RequestBody RewardRequest request){
        userService.updateReward(request.getCoin());

        return ResponseEntity.ok().build();
    }
}
