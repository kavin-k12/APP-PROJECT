package com.campusconnect.repository;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    boolean existsByEventAndStudent(Event event, Student student);

    List<EventRegistration> findByStudentOrderByRegistrationDateDesc(Student student);

    List<EventRegistration> findByEvent(Event event);

    Optional<EventRegistration> findByEventAndStudent(Event event, Student student);
}
