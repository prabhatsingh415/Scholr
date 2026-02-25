package com.scholr.scholr.service;
import com.scholr.scholr.CustomUserDetails;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.repository.UserRepository;
import lombok.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;



@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull String collegeId) throws UsernameNotFoundException {
        User user = userRepository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        return new CustomUserDetails(user);
    }
}