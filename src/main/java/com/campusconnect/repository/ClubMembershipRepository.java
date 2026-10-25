package com.campusconnect.repository;

import com.campusconnect.entity.Club;
import com.campusconnect.entity.ClubMembership;
import com.campusconnect.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {

    boolean existsByClubAndStudent(Club club, Student student);

    List<ClubMembership> findByStudent(Student student);

    List<ClubMembership> findByClub(Club club);

    Optional<ClubMembership> findByClubAndStudent(Club club, Student student);
}
