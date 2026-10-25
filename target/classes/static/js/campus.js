/**
 * CAMPUS CONNECT 2030 — CAMPUS UNIVERSE PORTAL CONTROLLER
 * Manages Events, Communities, Academic Resources, Lost & Found, and Announcements.
 */

(function () {
  'use strict';

  // Demo Fallback Data (Clearly labeled for transparent academic presentation)
  const DEMO_EVENTS = [
    {
      id: 1,
      title: "Deep Space AI Hackathon 2030",
      description: "48-hour competitive neural engineering hackathon simulating orbital mechanics and satellite constellation routing.",
      category: "Hackathon",
      eventDate: "2030-11-15T09:00:00",
      location: "Orbital Lab Alpha-4",
      capacity: 120,
      registeredCount: 88,
      status: "OPEN"
    },
    {
      id: 2,
      title: "Quantum Robotics Symposium",
      description: "Keynote lectures and autonomous rover demonstrations from intercollegiate engineering teams.",
      category: "Symposium",
      eventDate: "2030-11-22T14:00:00",
      location: "Starlight Auditorium",
      capacity: 250,
      registeredCount: 194,
      status: "OPEN"
    },
    {
      id: 3,
      title: "Zero-G Design & VR Architecture Expo",
      description: "Showcase of spatial design, futuristic habitats, and holographic user interface concepts.",
      category: "Exhibition",
      eventDate: "2030-12-05T11:00:00",
      location: "Nexus Dome 2",
      capacity: 150,
      registeredCount: 150,
      status: "FULL"
    }
  ];

  const DEMO_CLUBS = [
    {
      id: 1,
      name: "Cybernetics & AI Guild",
      category: "Coding",
      description: "Dedicated to autonomous agents, LLM architectures, distributed algorithms, and neural network simulations.",
      leadName: "Sriharan V A",
      memberCount: 240,
      meetingSchedule: "Wednesdays 17:00 UTC",
      icon: "⚡"
    },
    {
      id: 2,
      name: "Orbital Robotics Society",
      category: "Robotics",
      description: "Building space exploration rovers, quadcopters, and micro-controller telemetry hardware.",
      leadName: "Shivesh A",
      memberCount: 185,
      meetingSchedule: "Tuesdays & Thursdays 18:00 UTC",
      icon: "🤖"
    },
    {
      id: 3,
      name: "Starlight Visual & Holographic Design",
      category: "Design",
      description: "Creating next-generation sci-fi interfaces, 3D animations, spatial UI, and cinematic graphics.",
      leadName: "KAVIN K",
      memberCount: 160,
      meetingSchedule: "Fridays 16:30 UTC",
      icon: "🎨"
    },
    {
      id: 4,
      name: "Deep Field Astrophotography",
      category: "Photography",
      description: "Capturing planetary alignments, nebula imaging, and telescope optics processing.",
      leadName: "Campus Astrophotographers",
      memberCount: 110,
      meetingSchedule: "Saturdays 20:00 UTC",
      icon: "🔭"
    }
  ];

  const DEMO_RESOURCES = [
    {
      id: 1,
      title: "Advanced Data Structures & Graph Algorithms",
      department: "Computer Science",
      semester: "Semester 5",
      format: "PDF",
      fileSize: "4.8 MB",
      author: "Dept. of Computing"
    },
    {
      id: 2,
      title: "Distributed Operating Systems & Cloud Kernels",
      department: "Artificial Intelligence",
      semester: "Semester 6",
      format: "PDF",
      fileSize: "6.2 MB",
      author: "Systems Architecture Lab"
    },
    {
      id: 3,
      title: "Orbital Propulsion & Autonomous Telemetry Notes",
      department: "Aerospace Engineering",
      semester: "Semester 4",
      format: "ZIP",
      fileSize: "12.5 MB",
      author: "Orbital Mechanics Guild"
    },
    {
      id: 4,
      title: "Spring Boot Microservices & JPA Architecture Guide",
      department: "Computer Science",
      semester: "Semester 5",
      format: "PDF",
      fileSize: "3.4 MB",
      author: "Java Lab Instructors"
    }
  ];

  const DEMO_LOST_FOUND = [
    {
      id: 1,
      title: "Holographic Smart Keycard & Lanyard",
      category: "Electronics",
      type: "LOST",
      location: "Orbital Lab Alpha-4 Corridor",
      dateReported: "2030-10-24",
      status: "OPEN",
      description: "Encrypted student badge with blue cyber lanyard and NFC token."
    },
    {
      id: 2,
      title: "Neural Interface Stylus (Titanium)",
      category: "Electronics",
      type: "FOUND",
      location: "Library Pod 3B",
      dateReported: "2030-10-25",
      status: "OPEN",
      description: "Found on study console desk. Turned in to Central Security Desk."
    },
    {
      id: 3,
      title: "Quantum Mechanics Reference Notebook",
      category: "Books",
      type: "LOST",
      location: "Starlight Auditorium Row G",
      dateReported: "2030-10-23",
      status: "CLAIMED",
      description: "Black binder with handwritten derivations and lecture notes."
    }
  ];

  const DEMO_ANNOUNCEMENTS = [
    {
      id: 1,
      title: "Mid-Term Subspace Examination Schedules Released",
      category: "Academic",
      date: "2030-10-25",
      content: "All departments may access their terminal exam schedules via the Academic Resources portal."
    },
    {
      id: 2,
      title: "Java Lab 2030 Holographic Source Code Showcase Now Live",
      category: "Campus News",
      date: "2030-10-24",
      content: "Explore real Spring Boot architectures, JPA repositories, and algorithms inside the interactive Java Lab."
    },
    {
      id: 3,
      title: "Central Shuttle Dock Maintenance Notice",
      category: "Facility",
      date: "2030-10-22",
      content: "Docking bay 3 will undergo gravitational calibration from 02:00 to 06:00 UTC."
    }
  ];

  document.addEventListener('DOMContentLoaded', async () => {
    // Check and display logged in user
    updateUserProfileDisplay();

    // Initialize portals on current page
    if (document.getElementById('events-container')) {
      loadEvents();
    }

    if (document.getElementById('clubs-container')) {
      loadClubs();
    }

    if (document.getElementById('resources-container')) {
      loadResources();
    }

    if (document.getElementById('lostfound-container')) {
      loadLostFound();
    }

    if (document.getElementById('announcements-container')) {
      loadAnnouncements();
    }

    // Modal close listeners
    document.querySelectorAll('.modal-close-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sci-modal').forEach((m) => (m.style.display = 'none'));
      });
    });

    // Report Lost & Found Form handler
    const reportForm = document.getElementById('report-lostfound-form');
    if (reportForm) {
      reportForm.addEventListener('submit', handleReportItemSubmit);
    }
  });

  async function updateUserProfileDisplay() {
    const user = await CampusAPI.getCurrentUser();
    const userBadge = document.getElementById('nav-user-badge');
    const userNameSpan = document.getElementById('nav-user-name');
    const userRegSpan = document.getElementById('nav-user-reg');
    const authBtn = document.getElementById('nav-auth-btn');

    if (user && user.name) {
      if (userBadge) userBadge.style.display = 'inline-flex';
      if (userNameSpan) userNameSpan.textContent = user.name;
      if (userRegSpan) userRegSpan.textContent = user.registrationNumber || '';
      if (authBtn) {
        authBtn.textContent = 'LOGOUT';
        authBtn.href = '#';
        authBtn.onclick = (e) => {
          e.preventDefault();
          CampusAPI.logout();
        };
      }
    } else {
      if (userBadge) userBadge.style.display = 'none';
      if (authBtn) {
        authBtn.textContent = 'LOGIN';
        authBtn.href = 'login.html';
      }
    }
  }

  /* ---------------------------------------------------------------------- */
  /* EVENTS PORTAL                                                          */
  /* ---------------------------------------------------------------------- */
  async function loadEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;

    let events = [];
    let isRealData = false;

    try {
      events = await CampusAPI.getEvents();
      if (Array.isArray(events) && events.length > 0) {
        isRealData = true;
      } else {
        events = DEMO_EVENTS;
      }
    } catch (e) {
      events = DEMO_EVENTS;
    }

    renderDataSourceNotice('events-data-notice', isRealData);

    container.innerHTML = events
      .map((ev) => {
        const isFull = ev.registeredCount >= ev.capacity || ev.status === 'FULL';
        return `
        <div class="portal-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="badge-neon badge-cyan">${escapeHtml(ev.category || 'Event')}</span>
            <span class="badge-neon ${isFull ? 'badge-ruby' : 'badge-emerald'}">
              <span class="status-dot" style="background:${isFull ? 'var(--accent-ruby)' : 'var(--accent-emerald)'}"></span>
              ${isFull ? 'FULL' : 'OPEN'}
            </span>
          </div>
          <h3 class="portal-card-title">${escapeHtml(ev.title)}</h3>
          <p class="portal-card-desc">${escapeHtml(ev.description)}</p>
          <div style="margin-bottom: 18px; font-family: var(--font-tech); font-size: 0.9rem; color: var(--text-secondary);">
            <div>📍 <strong>Location:</strong> ${escapeHtml(ev.location)}</div>
            <div>🗓️ <strong>Date:</strong> ${new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div>👥 <strong>Capacity:</strong> ${ev.registeredCount || 0} / ${ev.capacity} registered</div>
          </div>
          <div class="portal-card-footer">
            <button class="btn-futuristic btn-primary-cyan btn-event-register" 
                    data-id="${ev.id}" 
                    ${isFull ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              ${isFull ? 'CAPACITY REACHED' : 'INITIALIZE REGISTRATION'}
            </button>
          </div>
        </div>
      `;
      })
      .join('');

    // Attach event register clicks
    container.querySelectorAll('.btn-event-register').forEach((btn) => {
      btn.addEventListener('click', async function () {
        const id = this.getAttribute('data-id');
        this.disabled = true;
        this.textContent = 'REGISTERING...';

        try {
          await CampusAPI.registerEvent(id);
          this.textContent = '✓ CONFIRMED';
          this.style.background = 'rgba(16, 185, 129, 0.3)';
          this.style.borderColor = 'var(--accent-emerald)';
          alert('Event registration confirmed transactionally in database!');
          loadEvents();
        } catch (err) {
          this.disabled = false;
          this.textContent = 'INITIALIZE REGISTRATION';
          alert(err.message || 'Unable to register. Please ensure you are logged in.');
        }
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* COMMUNITIES / CLUBS PORTAL                                             */
  /* ---------------------------------------------------------------------- */
  async function loadClubs() {
    const container = document.getElementById('clubs-container');
    if (!container) return;

    let clubs = [];
    let isRealData = false;

    try {
      clubs = await CampusAPI.getClubs();
      if (Array.isArray(clubs) && clubs.length > 0) {
        isRealData = true;
      } else {
        clubs = DEMO_CLUBS;
      }
    } catch (e) {
      clubs = DEMO_CLUBS;
    }

    renderDataSourceNotice('clubs-data-notice', isRealData);

    container.innerHTML = clubs
      .map(
        (c) => `
      <div class="portal-card">
        <div class="portal-card-icon">${c.icon || '🚀'}</div>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <span class="badge-neon badge-violet">${escapeHtml(c.category || 'Guild')}</span>
        </div>
        <h3 class="portal-card-title">${escapeHtml(c.name)}</h3>
        <p class="portal-card-desc">${escapeHtml(c.description)}</p>
        <div style="margin-bottom: 18px; font-family: var(--font-tech); font-size: 0.88rem; color: var(--text-secondary);">
          <div>👑 <strong>Lead:</strong> ${escapeHtml(c.leadName || 'Faculty / Student Lead')}</div>
          <div>👥 <strong>Active Cadets:</strong> ${c.memberCount || 100}+</div>
          <div>⏱️ <strong>Schedule:</strong> ${escapeHtml(c.meetingSchedule || 'Weekly')}</div>
        </div>
        <div class="portal-card-footer">
          <button class="btn-futuristic btn-secondary-space btn-join-club" data-id="${c.id}" data-name="${escapeHtml(c.name)}">
            TRANSMIT MEMBERSHIP REQUEST
          </button>
        </div>
      </div>
    `
      )
      .join('');

    container.querySelectorAll('.btn-join-club').forEach((btn) => {
      btn.addEventListener('click', async function () {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const reason = prompt(`Submit membership statement for ${name}:`, 'Interested in space software development and AI.');
        if (reason === null) return;

        this.disabled = true;
        this.textContent = 'TRANSMITTING...';

        try {
          await CampusAPI.joinClub(id, reason);
          this.textContent = '✓ REQUEST SUBMITTED';
          this.style.borderColor = 'var(--accent-emerald)';
          alert(`Membership request submitted for ${name}!`);
        } catch (err) {
          this.disabled = false;
          this.textContent = 'TRANSMIT MEMBERSHIP REQUEST';
          alert(err.message || 'Please log in to submit membership requests.');
        }
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* ACADEMIC RESOURCES PORTAL                                              */
  /* ---------------------------------------------------------------------- */
  async function loadResources() {
    const container = document.getElementById('resources-container');
    if (!container) return;

    const deptFilter = document.getElementById('filter-dept')?.value || '';
    const semFilter = document.getElementById('filter-sem')?.value || '';

    let resources = [];
    let isRealData = false;

    try {
      resources = await CampusAPI.getResources(deptFilter, semFilter);
      if (Array.isArray(resources) && resources.length > 0) {
        isRealData = true;
      } else {
        resources = DEMO_RESOURCES;
      }
    } catch (e) {
      resources = DEMO_RESOURCES;
    }

    renderDataSourceNotice('resources-data-notice', isRealData);

    container.innerHTML = resources
      .map(
        (r) => `
      <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <span class="badge-neon badge-cyan">${escapeHtml(r.department)}</span>
            <span class="badge-neon badge-gold">${escapeHtml(r.semester)}</span>
            <span class="badge-neon badge-violet">${escapeHtml(r.format)}</span>
          </div>
          <h4 style="font-size: 1.15rem; margin-bottom: 8px;">${escapeHtml(r.title)}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-tech);">
            Author: ${escapeHtml(r.author)} • Size: ${escapeHtml(r.fileSize)}
          </p>
        </div>
        <div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
          <a href="#" class="btn-futuristic btn-secondary-space" style="width: 100%;" onclick="event.preventDefault(); alert('Downloading academic telemetry file: ${escapeHtml(r.title)}');">
            ⬇ DOWNLOAD RESOURCE
          </a>
        </div>
      </div>
    `
      )
      .join('');
  }

  /* ---------------------------------------------------------------------- */
  /* LOST & FOUND SUBSPACE TRACKER                                          */
  /* ---------------------------------------------------------------------- */
  async function loadLostFound() {
    const container = document.getElementById('lostfound-container');
    if (!container) return;

    let items = [];
    let isRealData = false;

    try {
      items = await CampusAPI.getLostFoundItems();
      if (Array.isArray(items) && items.length > 0) {
        isRealData = true;
      } else {
        items = DEMO_LOST_FOUND;
      }
    } catch (e) {
      items = DEMO_LOST_FOUND;
    }

    renderDataSourceNotice('lostfound-data-notice', isRealData);

    container.innerHTML = items
      .map(
        (item) => `
      <div class="portal-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <span class="badge-neon ${item.type === 'LOST' ? 'badge-ruby' : 'badge-emerald'}">
            ${escapeHtml(item.type)}
          </span>
          <span class="badge-neon badge-cyan">${escapeHtml(item.category)}</span>
          <span class="badge-neon badge-gold">${escapeHtml(item.status)}</span>
        </div>
        <h3 class="portal-card-title">${escapeHtml(item.title)}</h3>
        <p class="portal-card-desc">${escapeHtml(item.description)}</p>
        <div style="font-family: var(--font-tech); font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">
          <div>📍 <strong>Location:</strong> ${escapeHtml(item.location)}</div>
          <div>🗓️ <strong>Logged:</strong> ${escapeHtml(item.dateReported)}</div>
        </div>
      </div>
    `
      )
      .join('');
  }

  async function handleReportItemSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('lf-title').value.trim();
    const type = document.getElementById('lf-type').value;
    const category = document.getElementById('lf-category').value;
    const location = document.getElementById('lf-location').value.trim();
    const description = document.getElementById('lf-desc').value.trim();

    try {
      await CampusAPI.reportLostFoundItem({ title, type, category, location, description });
      alert('Item report registered in database!');
      document.getElementById('report-lostfound-form').reset();
      document.querySelectorAll('.sci-modal').forEach((m) => (m.style.display = 'none'));
      loadLostFound();
    } catch (err) {
      alert(err.message || 'Please log in to report items.');
    }
  }

  /* ---------------------------------------------------------------------- */
  /* ANNOUNCEMENTS PORTAL                                                   */
  /* ---------------------------------------------------------------------- */
  async function loadAnnouncements() {
    const container = document.getElementById('announcements-container');
    if (!container) return;

    let announcements = [];
    let isRealData = false;

    try {
      announcements = await CampusAPI.getAnnouncements();
      if (Array.isArray(announcements) && announcements.length > 0) {
        isRealData = true;
      } else {
        announcements = DEMO_ANNOUNCEMENTS;
      }
    } catch (e) {
      announcements = DEMO_ANNOUNCEMENTS;
    }

    renderDataSourceNotice('announcements-data-notice', isRealData);

    container.innerHTML = announcements
      .map(
        (a) => `
      <div class="glass-panel" style="padding: 24px; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="badge-neon badge-cyan">${escapeHtml(a.category)}</span>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(a.date)}</span>
        </div>
        <h4 style="font-size: 1.15rem; margin-bottom: 8px;">${escapeHtml(a.title)}</h4>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">${escapeHtml(a.content)}</p>
      </div>
    `
      )
      .join('');
  }

  function renderDataSourceNotice(elementId, isRealData) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (isRealData) {
      el.innerHTML = '<span class="status-dot" style="background:var(--accent-emerald);"></span> REAL DATABASE PERSISTENCE (SPRING DATA JPA / MYSQL)';
      el.style.color = 'var(--accent-emerald)';
    } else {
      el.innerHTML = '<span class="status-dot" style="background:var(--accent-gold);"></span> SAMPLE 2030 CAMPUS DATA (CONNECT BACKEND TO VIEW LIVE JPA ENTITIES)';
      el.style.color = 'var(--accent-gold)';
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
