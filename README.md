# CAMPUS CONNECT — FUTURISTIC CAMPUS WEB APPLICATION (2030 EDITION)

[![Java 21](https://img.shields.io/badge/Java-21%20LTS-blue.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-BCrypt-red.svg)](https://spring.io/projects/spring-security)
[![Database](https://img.shields.io/badge/Database-MySQL%20%2F%20JPA-orange.svg)](https://www.mysql.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%2F%20Three.js%20%2F%20GSAP-cyan.svg)](https://threejs.org/)

---

## 🌌 1. PROJECT OVERVIEW

**CAMPUS CONNECT (2030 Edition)** is a futuristic college web application simulating a university operating inside an orbital space station in the year 2030.

It combines:
- **Cinematic 3D Space Visuals**: Powered by Three.js rendering an orbital campus globe, rotating tech cages, twinkling starfields, glowing atmospheres, and mouse-based parallax.
- **GSAP Timelines**: Smooth animations, staggered text reveals, laser scanlines, and fluid transitions.
- **5-Stage Identity Initialization Wizard**: Multi-step student onboarding experience with validation and holographic student identity pass generation.
- **Holographic Authentication**: Spring Security session-based login with BCrypt password hashing.
- **Interactive Campus Portals**:
  1. *Events Sector* with live transactional capacity tracking and seat reservation.
  2. *Communities Guilds* (Coding, Robotics, Design, Astrophotography) with membership requests.
  3. *Academic Resources* with subject notes, department, and semester filters.
  4. *Lost & Found Subspace* with item reporting and recovery auditing.
  5. *Station Announcements* with real-time academic broadcasts.
- **Interactive Java Lab ("BEHIND THE UNIVERSE")**: A holographic developer workstation demonstrating how Campus Connect works internally through 8 enterprise Spring Boot modules, plain-English pseudocode, algorithm explanations, syntax highlighting, line numbers, and single-click copy buttons.
- **Dedicated Project Team Section**: Prominently honoring the development team across the landing page, About page, Java Lab, and footer.

---

## 👥 2. OFFICIAL PROJECT TEAM CREDITS

The following students are the official project developers:

| Team Member | Registration Number |
|---|---|
| **Sriharan V A** | `RA2511003040029` |
| **Shivesh A** | `RA2511003040028` |
| **KAVIN K** | `RA2511003040067` |

---

## 🛠️ 3. TECHNOLOGY STACK

### Backend
- **Language**: Java 21 LTS
- **Framework**: Spring Boot 3.3.4
- **Web**: Spring Web (RESTful Controllers, JSON serialization via Jackson)
- **Persistence**: Spring Data JPA & Hibernate
- **Security**: Spring Security 6 with BCrypt password hashing
- **Validation**: Jakarta Bean Validation (JSR 380)
- **Build Tool**: Apache Maven (with included `mvnw` wrapper)

### Database
- **Primary**: MySQL with relational integrity, foreign keys, and unique constraints.
- **Zero-Config Standalone Fallback**: Integrated H2 MySQL-compatibility mode (`MODE=MySQL`) for immediate evaluation without requiring an external database setup.

### Frontend
- **Structure**: Semantic HTML5 with accessible markup
- **Styling**: Vanilla CSS3 Sci-Fi Design System (`#050711` Cosmic Black, `#00E5FF` Electric Cyan, `#8B5CF6` Ultraviolet)
- **3D Graphics**: Three.js (WebGL starfield, orbital rings, celestial campus world, mouse parallax)
- **Motion & Timelines**: GSAP 3 (GreenSock Animation Platform)

---

## 🚀 4. SETUP & RUNNING INSTRUCTIONS

### Prerequisites
1. **JDK 21** or later installed.
2. **Maven 3.9+** (or use the included `./mvnw` / `mvnw.cmd` wrapper).
3. *(Optional)* **MySQL Server** (8.0+).

### Step 1: Clone or Navigate to Project
```powershell
cd "c:\APP PROJECT"
```

### Step 2: Configure Database (Optional for MySQL)
By default, the application runs out-of-the-box using the embedded H2 MySQL-compatible database.

To connect your local MySQL server, set the following environment variables:
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/campus_connect?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
$env:DB_USER="root"
$env:DB_PASSWORD="your_mysql_password"
$env:DB_DRIVER="com.mysql.cj.jdbc.Driver"
```

### Step 3: Compile and Run Tests
```powershell
.\mvnw test
```

### Step 4: Launch the Server
```powershell
.\mvnw spring-boot:run
```

The application will start on port `8080`.
Open your web browser and navigate to:
👉 **`http://localhost:8080`**

---

## 🔑 5. PRE-SEEDED TEST ACCOUNTS

The application automatically seeds the database on startup with the official team accounts:

- **Cadet 1**: `sv0029@srmist.edu.in` / Passkey: `Pass@2030` (Sriharan V A)
- **Cadet 2**: `sa0028@srmist.edu.in` / Passkey: `Pass@2030` (Shivesh A)
- **Cadet 3**: `kk0067@srmist.edu.in` / Passkey: `Pass@2030` (KAVIN K)

Or initialize a brand new student identity via the 5-Stage Initialization Wizard at:
👉 **`http://localhost:8080/register.html`**

---

## 💻 6. JAVA LAB — SOURCE CODE SHOWCASE

Visit the **Java Lab** at **`http://localhost:8080/java-lab.html`** to explore the 8 enterprise systems modules:

1. **Student Registration**: Unique constraints, BCrypt password hashing, transactional persistence (`AuthService.java`).
2. **Login & Authentication**: Spring Security filter chains, UserDetailsService, session security (`SecurityConfig.java`).
3. **Event Registration**: Pessimistic/atomic booking, capacity validation, duplicate prevention (`EventService.java`).
4. **Club Membership**: Multi-tier student guild membership requests and state management (`ClubService.java`).
5. **Lost & Found Subspace**: Item categorizing, location tracking, and ownership validation (`LostFoundService.java`).
6. **Database Operations**: Spring Data JPA query derivations and request-to-database flow (`StudentRepository.java`).
7. **REST API Architecture**: Controller mappings, HTTP verbs, and JSON serialization (`EventController.java`).
8. **Validation & Error Handling**: Declarative Bean Validation and `@RestControllerAdvice` error handling (`GlobalExceptionHandler.java`).

Each module includes:
- Production Java source code
- Plain-English algorithmic pseudocode
- Deep architectural explanation
- Syntax highlighting and line numbers
- Single-click clipboard copying with visual confirmation

---

## 🛡️ 7. SECURITY & TESTING

- **BCrypt Encryption**: Passwords are salted and hashed; plain-text passwords are never persisted.
- **DTO Projection**: Password hashes are strictly omitted from JSON responses.
- **Duplicate Prevention**: Compound database unique constraints prevent double event registrations or duplicate student identifiers.
- **Automated Test Suite**: Service and controller unit/integration tests covering registration, duplicate rejection, capacity limits, and security authorization.

---

&copy; 2030 Campus Connect. Developed by **Sriharan V A**, **Shivesh A**, and **KAVIN K**.
