package com.campusconnect.security;

import com.campusconnect.entity.Student;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Custom UserDetails implementation representing an authenticated student.
 */
public class UserPrincipal implements UserDetails {

    private final Student student;

    public UserPrincipal(Student student) {
        this.student = student;
    }

    public Student getStudent() {
        return student;
    }

    public Long getId() {
        return student.getId();
    }

    public String getRegistrationNumber() {
        return student.getRegistrationNumber();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(student.getRole()));
    }

    @Override
    public String getPassword() {
        return student.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return student.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return student.isEnabled();
    }
}
