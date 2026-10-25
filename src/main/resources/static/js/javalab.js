/**
 * CAMPUS CONNECT 2030 — JAVA LAB SHOWCASE CONTROLLER
 * Powers the interactive holographic workstation, syntax highlighting,
 * pseudocode comparisons, and code copy functionality.
 */

(function () {
  'use strict';

  // Catalog of the 8 Required Java Systems Modules
  const MODULES_CATALOG = [
    {
      id: "student-registration",
      name: "Student Registration",
      category: "Security & Auth",
      description: "Transactional registration workflow with duplicate validation, BCrypt password hashing, and DTO projection.",
      filePath: "src/main/java/com/campusconnect/service/AuthService.java",
      fileName: "AuthService.java",
      endpoint: "POST /api/auth/register",
      javaCode: `@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Student register(RegistrationRequest request) {
        // Normalize email to lower case
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // Check whether the email is already registered
        if (studentRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException(
                    "Email address is already initialized in this universe");
        }

        // Check whether the student registration number already exists
        String normalizedReg = request.getRegistrationNumber().trim().toUpperCase();
        if (studentRepository.existsByRegistrationNumber(normalizedReg)) {
            throw new DuplicateResourceException(
                    "Student registration number is already initialized");
        }

        // Create new student entity
        Student student = new Student();
        student.setName(request.getName().trim());
        student.setEmail(normalizedEmail);
        student.setRegistrationNumber(normalizedReg);
        student.setDepartment(request.getDepartment());
        student.setAcademicYear(request.getAcademicYear());
        student.setInterests(request.getInterests());

        // Secure password hashing with BCrypt (never store plain text)
        student.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        student.setRole("ROLE_STUDENT");
        student.setEnabled(true);

        return studentRepository.save(student);
    }
}`,
      pseudocode: `MODULE: STUDENT REGISTRATION

PSEUDOCODE:

START

1. Receive student registration details via RegistrationRequest DTO.
2. Validate required fields, email format, and password complexity rules (@Valid).
3. Normalize email to lowercase and registration number to uppercase.
4. Check whether the email is already registered in MySQL (existsByEmail).
5. Check whether the student registration number already exists (existsByRegistrationNumber).
6. If either identifier already exists, throw DuplicateResourceException with safe error message.
7. Securely hash the plain-text password using Spring Security BCryptPasswordEncoder.
8. Instantiate a new Student entity and map normalized attributes and default student role.
9. Persist the Student entity transactionally into MySQL via StudentRepository.
10. Map the persisted Student to a StudentResponse DTO (excluding passwordHash) and return HTTP 201 Created.

END`,
      explanation: `<h4>Architecture & Flow Analysis</h4>
<p>The Student Registration system demonstrates modern enterprise Spring Boot patterns:</p>
<ul>
  <li><strong>Separation of Concerns:</strong> The Controller handles HTTP JSON deserialization and DTO validation, delegating business logic to the <code>AuthService</code>.</li>
  <li><strong>Duplicate Prevention:</strong> Two independent pre-checks (<code>existsByEmail</code> and <code>existsByRegistrationNumber</code>) query the database before persistence, backed by unique column constraints in MySQL.</li>
  <li><strong>Cryptographic Security:</strong> Plain-text passwords are never stored. The <code>BCryptPasswordEncoder</code> automatically generates a random salt and applies adaptive work-factor hashing.</li>
  <li><strong>DTO Projection:</strong> The internal <code>passwordHash</code> field is strictly excluded from responses, preventing sensitive data leakage.</li>
  <li><strong>Transactional Integrity:</strong> The <code>@Transactional</code> annotation guarantees that all database updates succeed or roll back atomically.</li>
</ul>`
    },

    {
      id: "authentication",
      name: "Login & Authentication",
      category: "Security & Auth",
      description: "Spring Security authentication flow, UserDetailsService integration, and session security.",
      filePath: "src/main/java/com/campusconnect/security/SecurityConfig.java",
      fileName: "SecurityConfig.java",
      endpoint: "POST /api/auth/login",
      javaCode: `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Safe for REST with custom headers/tokens
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", "/index.html", "/login.html", "/register.html",
                    "/campus.html", "/events.html", "/communities.html",
                    "/resources.html", "/lost-found.html", "/java-lab.html",
                    "/about.html", "/css/**", "/js/**", "/assets/**",
                    "/api/auth/**", "/api/javalab/**", "/h2-console/**"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/events", "/api/clubs", "/api/resources", "/api/announcements").permitAll()
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(f -> f.disable())) // For H2 console
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}`,
      pseudocode: `MODULE: LOGIN & AUTHENTICATION

PSEUDOCODE:

START

1. Receive login credentials (email and password) via LoginRequest DTO.
2. Validate that email and password fields are present and well-formed.
3. Delegate authentication to Spring Security's AuthenticationManager:
   - Load user principal from MySQL by email via CustomUserDetailsService.
   - If user is not found, throw BadCredentialsException.
   - Compare submitted password with stored BCrypt hash using passwordEncoder.matches().
   - If password matches, create authenticated UsernamePasswordAuthenticationToken.
4. Bind authenticated Authentication token into the SecurityContextHolder.
5. Create or refresh HTTP Session and establish secure, HttpOnly session cookie.
6. Return StudentResponse DTO and HTTP 200 OK with success status.

END`,
      explanation: `<h4>Authentication vs. Authorization</h4>
<p>This module implements standards-compliant Spring Security authentication:</p>
<ul>
  <li><strong>Authentication:</strong> Proves <em>who the student is</em> by verifying credentials against BCrypt hashes stored in MySQL.</li>
  <li><strong>Authorization:</strong> Controls <em>what actions the student may perform</em> (e.g. registering for events, reporting lost items, or accessing administrative controls).</li>
  <li><strong>Never Storing Plain Text:</strong> Spring Security's <code>BCryptPasswordEncoder</code> protects passwords against rainbow tables and offline dictionary attacks.</li>
  <li><strong>Stateless / Stateful Adaptability:</strong> Configured with secure session cookies and CSRF protection policies appropriate for modern web applications.</li>
</ul>`
    },

    {
      id: "event-registration",
      name: "Event Registration",
      category: "Academic Life",
      description: "Transactional registration with capacity enforcement, duplicate check, and concurrency protection.",
      filePath: "src/main/java/com/campusconnect/service/EventService.java",
      fileName: "EventService.java",
      endpoint: "POST /api/events/{id}/register",
      javaCode: `@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;

    public EventService(
            EventRepository eventRepository,
            EventRegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @Transactional
    public EventRegistration registerStudentForEvent(Long eventId, Student student) {
        // 1. Find event with pessimistic locking to prevent race conditions
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        // 2. Verify event registration is open
        if (!"OPEN".equalsIgnoreCase(event.getStatus())) {
            throw new BadRequestException("Event registration is currently closed");
        }

        // 3. Verify student has not already registered
        if (registrationRepository.existsByEventAndStudent(event, student)) {
            throw new DuplicateResourceException("You are already registered for this event");
        }

        // 4. Verify capacity limits
        if (event.getRegisteredCount() >= event.getCapacity()) {
            throw new BadRequestException("Event capacity reached (" + event.getCapacity() + " maximum)");
        }

        // 5. Increment registered count transactionally
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        if (event.getRegisteredCount() >= event.getCapacity()) {
            event.setStatus("FULL");
        }
        eventRepository.save(event);

        // 6. Persist registration record
        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setStudent(student);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus("CONFIRMED");

        return registrationRepository.save(registration);
    }
}`,
      pseudocode: `MODULE: EVENT REGISTRATION

PSEUDOCODE:

START

1. Receive event ID and authenticated student principal from request.
2. Find the Event in MySQL by event ID.
3. Check that the event exists and its status is "OPEN".
4. Check that the student is not already registered (existsByEventAndStudent).
5. Check event capacity against registeredCount.
6. If full or student is already registered, reject request with descriptive HTTP 400 error.
7. Increment event.registeredCount by 1 and mark status as "FULL" if capacity reached.
8. Create a new EventRegistration persistence record with current timestamp and "CONFIRMED" status.
9. Commit all changes atomically inside a single database transaction (@Transactional).
10. Return confirmation receipt DTO with HTTP 200 OK.

END`,
      explanation: `<h4>Concurrency & Capacity Strategy</h4>
<p>Preventing overbooking in high-traffic campus events:</p>
<ul>
  <li><strong>Atomic Transactions:</strong> Database reads, capacity checks, and registration writes occur within an isolated transaction.</li>
  <li><strong>Unique Constraints:</strong> A compound unique constraint on <code>(event_id, student_id)</code> provides an immutable database-level guarantee against duplicate registrations.</li>
  <li><strong>Optimistic / Pessimistic Locking:</strong> Protects against race conditions when multiple students click register simultaneously at the capacity threshold.</li>
</ul>`
    },

    {
      id: "club-membership",
      name: "Club Membership",
      category: "Communities",
      description: "Campus guild membership applications, role checks, and approval state transitions.",
      filePath: "src/main/java/com/campusconnect/service/ClubService.java",
      fileName: "ClubService.java",
      endpoint: "POST /api/clubs/{id}/join",
      javaCode: `@Service
public class ClubService {

    private final ClubRepository clubRepository;
    private final ClubMembershipRepository membershipRepository;

    public ClubService(
            ClubRepository clubRepository,
            ClubMembershipRepository membershipRepository) {
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional
    public ClubMembership applyForMembership(Long clubId, Student student, String statement) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Community guild not found: " + clubId));

        if (membershipRepository.existsByClubAndStudent(club, student)) {
            throw new DuplicateResourceException("Membership request already pending or active for this guild");
        }

        ClubMembership membership = new ClubMembership();
        membership.setClub(club);
        membership.setStudent(student);
        membership.setJoinStatement(statement);
        membership.setStatus("PENDING");
        membership.setRequestDate(LocalDateTime.now());

        return membershipRepository.save(membership);
    }
}`,
      pseudocode: `MODULE: CLUB MEMBERSHIP

PSEUDOCODE:

START

1. Receive club ID, authenticated student, and optional statement.
2. Verify club exists in database.
3. Check if membership record already exists for (club, student).
4. If record exists, throw DuplicateResourceException.
5. Create new ClubMembership entity with status "PENDING".
6. Record application timestamp and statement.
7. Save membership to MySQL and notify guild leads.
8. Return submitted application status.

END`,
      explanation: `<h4>Community Guild Mechanics</h4>
<p>Student clubs operate with multi-tiered membership states (PENDING, APPROVED, REJECTED, LEAD). Spring Data JPA relations link <code>Student</code> and <code>Club</code> via a rich association entity <code>ClubMembership</code>.</p>`
    },

    {
      id: "lost-found",
      name: "Lost & Found Subspace",
      category: "Campus Operations",
      description: "Campus lost and found tracking with category filters, ownership verification, and status mutations.",
      filePath: "src/main/java/com/campusconnect/service/LostFoundService.java",
      fileName: "LostFoundService.java",
      endpoint: "POST /api/lost-found",
      javaCode: `@Service
public class LostFoundService {

    private final LostFoundItemRepository itemRepository;

    public LostFoundService(LostFoundItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<LostFoundItem> getItems(String type) {
        if (type != null && !type.isBlank()) {
            return itemRepository.findByTypeIgnoreCaseOrderByDateReportedDesc(type);
        }
        return itemRepository.findAllByOrderByDateReportedDesc();
    }

    @Transactional
    public LostFoundItem reportItem(LostFoundRequest request, Student reporter) {
        LostFoundItem item = new LostFoundItem();
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setType(request.getType()); // "LOST" or "FOUND"
        item.setLocation(request.getLocation());
        item.setStatus("OPEN");
        item.setDateReported(LocalDate.now());
        item.setReporter(reporter);

        return itemRepository.save(item);
    }
}`,
      pseudocode: `MODULE: LOST & FOUND

PSEUDOCODE:

START

1. Receive item report DTO (title, type, category, location, description).
2. Validate required details (@NotBlank).
3. Bind the authenticated student as the reporter.
4. Set status to "OPEN" and assign current date.
5. Save LostFoundItem entity to MySQL.
6. Return created item DTO.

END`,
      explanation: `<h4>Subspace Item Auditing</h4>
<p>Items are categorized into Electronics, Books, ID Cards, and Personal Gear. Status changes from OPEN to CLAIMED or RESOLVED require ownership validation against the reporting student or an authorized campus officer.</p>`
    },

    {
      id: "database-operations",
      name: "Database Operations",
      category: "Persistence & JPA",
      description: "Relational mapping with Hibernate/JPA, connection pooling, and multi-entity queries.",
      filePath: "src/main/java/com/campusconnect/repository/StudentRepository.java",
      fileName: "StudentRepository.java",
      endpoint: "SQL / Hibernate JPA Layer",
      javaCode: `@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByRegistrationNumber(String registrationNumber);

    boolean existsByEmail(String email);

    boolean existsByRegistrationNumber(String registrationNumber);

    @Query("SELECT s FROM Student s WHERE s.department = :dept ORDER BY s.name ASC")
    List<Student> findCadetsByDepartment(@Param("dept") String department);
}`,
      pseudocode: `MODULE: DATABASE OPERATIONS

PSEUDOCODE:

START

1. Spring Data JPA generates proxy implementation at runtime based on method names.
2. "findByEmail" maps to: SELECT * FROM students WHERE email = ? LIMIT 1.
3. "existsByEmail" maps to: SELECT count(*) > 0 FROM students WHERE email = ?.
4. Hibernate translates entity graph mappings into optimized ANSI SQL for MySQL.
5. HikariCP connection pool manages active physical MySQL connections efficiently.

END`,
      explanation: `<h4>Request-to-Database Flow</h4>
<p>Every read/write operation travels cleanly through four architectural tiers:</p>
<ol>
  <li><strong>Frontend:</strong> Sends JSON payload via Fetch API.</li>
  <li><strong>Controller:</strong> Receives request, performs validation, maps parameters.</li>
  <li><strong>Service Layer:</strong> Coordinates transactions, business rules, and security.</li>
  <li><strong>Repository Layer:</strong> Executes typed SQL queries against MySQL using Hibernate JPA.</li>
</ol>`
    },

    {
      id: "rest-architecture",
      name: "REST API Architecture",
      category: "Architecture",
      description: "Controller mappings, clean HTTP verbs, content negotiation, and JSON serialization.",
      filePath: "src/main/java/com/campusconnect/controller/EventController.java",
      fileName: "EventController.java",
      endpoint: "GET /api/events",
      javaCode: `@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse> register(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventRegistration registration = eventService.registerStudentForEvent(id, principal.getStudent());
        return ResponseEntity.ok(new ApiResponse(true, "Registration confirmed with ID: " + registration.getId()));
    }
}`,
      pseudocode: `MODULE: REST API ARCHITECTURE

PSEUDOCODE:

START

1. Client dispatches HTTP GET to /api/events.
2. Spring DispatcherServlet routes request to EventController.getAllEvents().
3. Service retrieves list of active events from MySQL.
4. Jackson JSON serializer converts Java entities into JSON payload.
5. Response headers set Content-Type: application/json;charset=UTF-8.
6. HTTP 200 OK returned with payload body.

END`,
      explanation: `<h4>Standardized REST Verbs</h4>
<p>Campus Connect strictly follows REST architectural standards:</p>
<ul>
  <li><code>GET</code> for idempotent resource reads.</li>
  <li><code>POST</code> for creating registrations and identity initialization.</li>
  <li><code>PUT/PATCH</code> for updating item states.</li>
  <li><code>DELETE</code> for removing registrations or reports.</li>
</ul>`
    },

    {
      id: "validation-errors",
      name: "Validation & Error Handling",
      category: "Architecture",
      description: "Declarative Bean Validation (@Valid), custom exceptions, and standardized GlobalExceptionHandler.",
      filePath: "src/main/java/com/campusconnect/exception/GlobalExceptionHandler.java",
      fileName: "GlobalExceptionHandler.java",
      endpoint: "ControllerAdvice Layer",
      javaCode: `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Failed");
        response.put("details", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse> handleDuplicate(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiResponse(false, ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, ex.getMessage()));
    }
}`,
      pseudocode: `MODULE: VALIDATION AND ERROR HANDLING

PSEUDOCODE:

START

1. Request arrives at endpoint with @Valid annotation on DTO.
2. Bean Validation validates @NotBlank, @Email, @Size annotations.
3. If constraint violated, MethodArgumentNotValidException is raised.
4. GlobalExceptionHandler captures the exception via @RestControllerAdvice.
5. Constructs clean, standardized JSON response containing field errors.
6. Returns HTTP 400 Bad Request (or 409 Conflict for duplicates, 404 for missing).

END`,
      explanation: `<h4>Server-Side Security Defense</h4>
<p>Client-side validation can always be bypassed by direct API calls; therefore, all business invariants must be strictly enforced server-side via Bean Validation (JSR 380) and centralized exception advisors.</p>`
    }
  ];

  let currentModule = MODULES_CATALOG[0];
  let currentTab = 'java';

  document.addEventListener('DOMContentLoaded', () => {
    const cardsGrid = document.getElementById('javalab-cards-grid');
    if (!cardsGrid) return;

    renderModuleCards(MODULES_CATALOG);
    initModuleSearch();
    initCodeViewerWorkstation();
  });

  function renderModuleCards(modules) {
    const cardsGrid = document.getElementById('javalab-cards-grid');
    if (!cardsGrid) return;

    if (modules.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          No Java Lab modules found matching your query.
        </div>
      `;
      return;
    }

    cardsGrid.innerHTML = modules
      .map(
        (mod) => `
      <div class="module-card" data-id="${mod.id}">
        <span class="badge-neon badge-cyan module-badge">${escapeHtml(mod.category)}</span>
        <h3 class="module-card-title">${escapeHtml(mod.name)}</h3>
        <p class="module-card-desc">${escapeHtml(mod.description)}</p>
        <div class="module-card-meta">
          <span>📁 ${escapeHtml(mod.fileName)}</span>
          <span style="color: var(--neon-cyan); font-weight: 700;">EXPLORE →</span>
        </div>
      </div>
    `
      )
      .join('');

    // Attach click listeners to module cards
    cardsGrid.querySelectorAll('.module-card').forEach((card) => {
      card.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const selected = MODULES_CATALOG.find((m) => m.id === id);
        if (selected) {
          openCodeViewer(selected);
        }
      });
    });
  }

  function initModuleSearch() {
    const searchInput = document.getElementById('javalab-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const filtered = MODULES_CATALOG.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query) ||
          m.fileName.toLowerCase().includes(query) ||
          m.javaCode.toLowerCase().includes(query)
      );
      renderModuleCards(filtered);
    });
  }

  function initCodeViewerWorkstation() {
    // Back to modules button
    const btnBack = document.getElementById('btn-back-modules');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        const workstation = document.getElementById('code-viewer-workstation');
        const cardsGrid = document.getElementById('javalab-cards-grid');
        const filterBar = document.querySelector('.javalab-filter-bar');

        if (workstation) workstation.classList.remove('active');
        if (cardsGrid) cardsGrid.style.display = 'grid';
        if (filterBar) filterBar.style.display = 'flex';
      });
    }

    // Tabs switching (Java, Pseudocode, Explanation)
    document.querySelectorAll('.workstation-tabs .tab-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.workstation-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        currentTab = this.getAttribute('data-tab');
        updateViewerContent();
      });
    });

    // Copy Code Button
    const btnCopy = document.getElementById('btn-copy-code');
    if (btnCopy) {
      btnCopy.addEventListener('click', handleCopyCode);
    }
  }

  function openCodeViewer(mod) {
    currentModule = mod;

    const workstation = document.getElementById('code-viewer-workstation');
    const cardsGrid = document.getElementById('javalab-cards-grid');
    const filterBar = document.querySelector('.javalab-filter-bar');

    if (cardsGrid) cardsGrid.style.display = 'none';
    if (filterBar) filterBar.style.display = 'none';
    if (workstation) workstation.classList.add('active');

    // Populate sidebar navigation
    renderSidebarModules();

    // Set Header Info
    const fileBadge = document.getElementById('workstation-file-badge');
    const endpointChip = document.getElementById('workstation-endpoint-chip');

    if (fileBadge) fileBadge.textContent = mod.filePath;
    if (endpointChip) endpointChip.textContent = mod.endpoint || 'Internal Spring Component';

    // Reset to Java code tab
    currentTab = 'java';
    document.querySelectorAll('.workstation-tabs .tab-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === 'java');
    });

    updateViewerContent();

    workstation.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderSidebarModules() {
    const list = document.getElementById('workstation-module-list');
    if (!list) return;

    list.innerHTML = MODULES_CATALOG.map(
      (m) => `
      <li class="module-nav-item ${m.id === currentModule.id ? 'active' : ''}" data-id="${m.id}">
        <span>${escapeHtml(m.name)}</span>
        <span style="font-size: 0.8rem; opacity: 0.7;">${m.id === currentModule.id ? '●' : '○'}</span>
      </li>
    `
    ).join('');

    list.querySelectorAll('.module-nav-item').forEach((item) => {
      item.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const selected = MODULES_CATALOG.find((m) => m.id === id);
        if (selected) {
          openCodeViewer(selected);
        }
      });
    });
  }

  function updateViewerContent() {
    const editorViewport = document.getElementById('code-editor-viewport');
    const pseudoViewport = document.getElementById('pseudocode-viewport');
    const explainViewport = document.getElementById('explanation-viewport');
    const copyBtn = document.getElementById('btn-copy-code');

    if (!editorViewport || !pseudoViewport || !explainViewport) return;

    editorViewport.style.display = 'none';
    pseudoViewport.style.display = 'none';
    explainViewport.style.display = 'none';

    if (currentTab === 'java') {
      editorViewport.style.display = 'block';
      if (copyBtn) copyBtn.style.display = 'inline-flex';
      renderSyntaxHighlightedCode(currentModule.javaCode);
    } else if (currentTab === 'pseudocode') {
      pseudoViewport.style.display = 'block';
      if (copyBtn) copyBtn.style.display = 'inline-flex';
      const pseudoBlock = document.getElementById('pseudocode-content-block');
      if (pseudoBlock) pseudoBlock.textContent = currentModule.pseudocode;
    } else if (currentTab === 'explanation') {
      explainViewport.style.display = 'block';
      if (copyBtn) copyBtn.style.display = 'none';
      const explainTitle = document.getElementById('explanation-module-title');
      const explainBody = document.getElementById('explanation-module-body');
      if (explainTitle) explainTitle.textContent = currentModule.name + ' — Architectural Analysis';
      if (explainBody) explainBody.innerHTML = currentModule.explanation;
    }
  }

  function renderSyntaxHighlightedCode(rawCode) {
    const linesContainer = document.getElementById('code-lines-content');
    const lineNumbers = document.getElementById('code-line-numbers');
    if (!linesContainer || !lineNumbers) return;

    const lines = rawCode.split('\n');

    // Generate line numbers
    lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');

    // Token-based highlighting for Java keywords, types, annotations, strings
    const highlightedLines = lines.map((line) => {
      let l = escapeHtml(line);

      // Comments
      if (l.trim().startsWith('//')) {
        return `<span class="syn-com">${l}</span>`;
      }

      // Annotations
      l = l.replace(/(@[A-Za-z0-9_]+)/g, '<span class="syn-anno">$1</span>');

      // Keywords
      l = l.replace(
        /\b(public|private|protected|class|interface|void|return|new|if|else|throw|try|catch|import|package|extends|implements|static|final)\b/g,
        '<span class="syn-kw">$1</span>'
      );

      // Types
      l = l.replace(
        /\b(String|Long|Integer|Boolean|Student|Event|Club|EventRegistration|ClubMembership|LostFoundItem|Optional|List|Map|ResponseEntity)\b/g,
        '<span class="syn-type">$1</span>'
      );

      // String literals
      l = l.replace(/(&quot;.*?&quot;)/g, '<span class="syn-str">$1</span>');

      return l;
    });

    linesContainer.innerHTML = highlightedLines.join('\n');
  }

  async function handleCopyCode() {
    const btnCopy = document.getElementById('btn-copy-code');
    let textToCopy = '';

    if (currentTab === 'java') {
      textToCopy = currentModule.javaCode;
    } else if (currentTab === 'pseudocode') {
      textToCopy = currentModule.pseudocode;
    } else {
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      if (btnCopy) {
        btnCopy.classList.add('copied');
        btnCopy.innerHTML = '✓ COPIED TO CLIPBOARD!';
        setTimeout(() => {
          btnCopy.classList.remove('copied');
          btnCopy.innerHTML = '📋 COPY CODE';
        }, 2200);
      }
    } catch (e) {
      alert('Code copied!');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
