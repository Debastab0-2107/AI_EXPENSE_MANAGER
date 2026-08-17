package com.expensemanager.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.expensemanager.entity.User;
import java.time.LocalDateTime;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    List<User> findByEmailVerifiedFalseAndCreatedAtBefore(LocalDateTime time);

}