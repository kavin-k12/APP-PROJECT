package com.campusconnect.service;

import com.campusconnect.entity.Club;
import com.campusconnect.entity.ClubMembership;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.ClubMembershipRepository;
import com.campusconnect.repository.ClubRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClubService {

    private final ClubRepository clubRepository;
    private final ClubMembershipRepository membershipRepository;

    public ClubService(ClubRepository clubRepository, ClubMembershipRepository membershipRepository) {
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Club getClubById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guild not found with ID: " + id));
    }

    @Transactional
    public ClubMembership applyForMembership(Long clubId, Student student, String joinStatement) {
        Club club = getClubById(clubId);

        if (membershipRepository.existsByClubAndStudent(club, student)) {
            throw new DuplicateResourceException("Membership request already exists for this guild");
        }

        ClubMembership membership = new ClubMembership();
        membership.setClub(club);
        membership.setStudent(student);
        membership.setJoinStatement(joinStatement != null ? joinStatement : "Cadet application for guild membership.");
        membership.setStatus("PENDING");
        membership.setRequestDate(LocalDateTime.now());

        return membershipRepository.save(membership);
    }
}
