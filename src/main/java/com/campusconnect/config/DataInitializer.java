package com.campusconnect.config;

import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Seeds the MySQL / H2 database with initial 2030 orbital station records
 * including the official project team accounts and sample portal telemetry.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final AcademicResourceRepository resourceRepository;
    private final LostFoundItemRepository lostFoundRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            StudentRepository studentRepository,
            EventRepository eventRepository,
            ClubRepository clubRepository,
            AcademicResourceRepository resourceRepository,
            LostFoundItemRepository lostFoundRepository,
            AnnouncementRepository announcementRepository,
            PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
        this.clubRepository = clubRepository;
        this.resourceRepository = resourceRepository;
        this.lostFoundRepository = lostFoundRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedStudents();
        seedEvents();
        seedClubs();
        seedResources();
        seedLostFound();
        seedAnnouncements();
    }

    private void seedStudents() {
        if (studentRepository.count() == 0) {
            String defaultHash = passwordEncoder.encode("Pass@2030");

            // Official Team Member 1
            Student sriharan = new Student(
                    "Sriharan V A",
                    "sv0029@srmist.edu.in",
                    "RA2511003040029",
                    defaultHash,
                    "Artificial Intelligence",
                    "Year 2 Beta",
                    "Autonomous AI, Deep Space Propulsion"
            );
            studentRepository.save(sriharan);

            // Official Team Member 2
            Student shivesh = new Student(
                    "Shivesh A",
                    "sa0028@srmist.edu.in",
                    "RA2511003040028",
                    defaultHash,
                    "Robotics & Cybernetics",
                    "Year 2 Beta",
                    "Quantum Robotics, Cybernetics & Systems"
            );
            studentRepository.save(shivesh);

            // Official Team Member 3
            Student kavin = new Student(
                    "KAVIN K",
                    "kk0067@srmist.edu.in",
                    "RA2511003040067",
                    defaultHash,
                    "Computer Science & Engineering",
                    "Year 2 Beta",
                    "Holographic UI, Distributed Systems"
            );
            studentRepository.save(kavin);
        }
    }

    private void seedEvents() {
        if (eventRepository.count() == 0) {
            eventRepository.save(new Event(
                    "Deep Space AI Hackathon 2030",
                    "48-hour competitive neural engineering hackathon simulating orbital mechanics and satellite constellation routing.",
                    "Hackathon",
                    LocalDateTime.of(2030, 11, 15, 9, 0),
                    "Orbital Lab Alpha-4",
                    120,
                    88,
                    "OPEN"
            ));

            eventRepository.save(new Event(
                    "Quantum Robotics Symposium",
                    "Keynote lectures and autonomous rover demonstrations from intercollegiate engineering teams.",
                    "Symposium",
                    LocalDateTime.of(2030, 11, 22, 14, 0),
                    "Starlight Auditorium",
                    250,
                    194,
                    "OPEN"
            ));

            eventRepository.save(new Event(
                    "Zero-G Design & VR Architecture Expo",
                    "Showcase of spatial design, futuristic habitats, and holographic user interface concepts.",
                    "Exhibition",
                    LocalDateTime.of(2030, 12, 5, 11, 0),
                    "Nexus Dome 2",
                    150,
                    150,
                    "FULL"
            ));
        }
    }

    private void seedClubs() {
        if (clubRepository.count() == 0) {
            clubRepository.save(new Club(
                    "Cybernetics & AI Guild",
                    "Coding",
                    "Dedicated to autonomous agents, LLM architectures, distributed algorithms, and neural network simulations.",
                    "Sriharan V A",
                    240,
                    "Wednesdays 17:00 UTC",
                    "⚡"
            ));

            clubRepository.save(new Club(
                    "Orbital Robotics Society",
                    "Robotics",
                    "Building space exploration rovers, quadcopters, and micro-controller telemetry hardware.",
                    "Shivesh A",
                    185,
                    "Tuesdays & Thursdays 18:00 UTC",
                    "🤖"
            ));

            clubRepository.save(new Club(
                    "Starlight Visual & Holographic Design",
                    "Design",
                    "Creating next-generation sci-fi interfaces, 3D animations, spatial UI, and cinematic graphics.",
                    "KAVIN K",
                    160,
                    "Fridays 16:30 UTC",
                    "🎨"
            ));

            clubRepository.save(new Club(
                    "Deep Field Astrophotography",
                    "Photography",
                    "Capturing planetary alignments, nebula imaging, and telescope optics processing.",
                    "Campus Astrophotographers",
                    110,
                    "Saturdays 20:00 UTC",
                    "🔭"
            ));
        }
    }

    private void seedResources() {
        if (resourceRepository.count() == 0) {
            resourceRepository.save(new AcademicResource(
                    "Advanced Data Structures & Graph Algorithms",
                    "Computer Science",
                    "Semester 5",
                    "PDF",
                    "4.8 MB",
                    "Dept. of Computing"
            ));

            resourceRepository.save(new AcademicResource(
                    "Distributed Operating Systems & Cloud Kernels",
                    "Artificial Intelligence",
                    "Semester 6",
                    "PDF",
                    "6.2 MB",
                    "Systems Architecture Lab"
            ));

            resourceRepository.save(new AcademicResource(
                    "Orbital Propulsion & Autonomous Telemetry Notes",
                    "Aerospace Engineering",
                    "Semester 4",
                    "ZIP",
                    "12.5 MB",
                    "Orbital Mechanics Guild"
            ));

            resourceRepository.save(new AcademicResource(
                    "Spring Boot Microservices & JPA Architecture Guide",
                    "Computer Science",
                    "Semester 5",
                    "PDF",
                    "3.4 MB",
                    "Java Lab Instructors"
            ));
        }
    }

    private void seedLostFound() {
        if (lostFoundRepository.count() == 0) {
            Student reporter = studentRepository.findAll().stream().findFirst().orElse(null);

            lostFoundRepository.save(new LostFoundItem(
                    "Holographic Smart Keycard & Lanyard",
                    "Encrypted student badge with blue cyber lanyard and NFC token.",
                    "Keycards",
                    "LOST",
                    "Orbital Lab Alpha-4 Corridor",
                    "OPEN",
                    LocalDate.of(2030, 10, 24),
                    reporter
            ));

            lostFoundRepository.save(new LostFoundItem(
                    "Neural Interface Stylus (Titanium)",
                    "Found on study console desk. Turned in to Central Security Desk.",
                    "Electronics",
                    "FOUND",
                    "Library Pod 3B",
                    "OPEN",
                    LocalDate.of(2030, 10, 25),
                    reporter
            ));
        }
    }

    private void seedAnnouncements() {
        if (announcementRepository.count() == 0) {
            announcementRepository.save(new Announcement(
                    "Mid-Term Subspace Examination Schedules Released",
                    "Academic",
                    LocalDate.of(2030, 10, 25),
                    "All departments may access their terminal exam schedules via the Academic Resources portal."
            ));

            announcementRepository.save(new Announcement(
                    "Java Lab 2030 Holographic Source Code Showcase Now Live",
                    "Campus News",
                    LocalDate.of(2030, 10, 24),
                    "Explore real Spring Boot architectures, JPA repositories, and algorithms inside the interactive Java Lab."
            ));

            announcementRepository.save(new Announcement(
                    "Central Shuttle Dock Maintenance Notice",
                    "Facility",
                    LocalDate.of(2030, 10, 22),
                    "Docking bay 3 will undergo gravitational calibration from 02:00 to 06:00 UTC."
            ));
        }
    }
}
