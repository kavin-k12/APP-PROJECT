/**
 * CAMPUS CONNECT 2030 — HOLOGRAPHIC AUTHENTICATION & IDENTITY INITIALIZATION
 * Implements the 5-Stage Identity Initialization Wizard & Login Controller.
 */

(function () {
  'use strict';

  // State for Registration Wizard
  let currentStep = 1;
  const registrationData = {
    name: '',
    email: '',
    registrationNumber: '',
    password: '',
    department: 'Artificial Intelligence',
    program: 'B.Tech Space Systems',
    academicYear: 'Year 2 Beta',
    interests: []
  };

  // DOM Elements for Register Wizard
  const regContainer = document.getElementById('register-wizard-container');
  if (regContainer) {
    initRegistrationWizard();
  }

  // DOM Elements for Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    initLoginForm();
  }

  // Password visibility toggle helpers
  document.querySelectorAll('.password-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          this.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
        } else {
          input.type = 'password';
          this.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        }
      }
    });
  });

  /* ---------------------------------------------------------------------- */
  /* REGISTRATION WIZARD LOGIC                                              */
  /* ---------------------------------------------------------------------- */
  function initRegistrationWizard() {
    // Password Strength Meter
    const passInput = document.getElementById('reg-password');
    const meterBar = document.getElementById('pass-strength-bar');
    if (passInput && meterBar) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        let score = 0;
        if (val.length >= 6) score += 25;
        if (val.length >= 8) score += 25;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 25;
        if (/[^A-Za-z0-9]/.test(val)) score += 25;

        meterBar.style.width = `${score}%`;
        if (score <= 25) {
          meterBar.style.backgroundColor = 'var(--accent-ruby)';
        } else if (score <= 50) {
          meterBar.style.backgroundColor = 'var(--accent-gold)';
        } else if (score <= 75) {
          meterBar.style.backgroundColor = 'var(--neon-cyan)';
        } else {
          meterBar.style.backgroundColor = 'var(--accent-emerald)';
        }
      });
    }

    // Interactive Chips for Areas of Interest
    document.querySelectorAll('.interest-chip').forEach((chip) => {
      chip.addEventListener('click', function () {
        this.classList.toggle('selected');
        const interest = this.getAttribute('data-value');
        if (this.classList.contains('selected')) {
          if (!registrationData.interests.includes(interest)) {
            registrationData.interests.push(interest);
          }
        } else {
          registrationData.interests = registrationData.interests.filter((i) => i !== interest);
        }
      });
    });

    // Step 1: Begin Initialization Button
    const btnBegin = document.getElementById('btn-begin-init');
    if (btnBegin) {
      btnBegin.addEventListener('click', () => {
        goToStep(2);
      });
    }

    // Step 2: Next button (Identity to Profile)
    const btnStep2Next = document.getElementById('btn-step2-next');
    if (btnStep2Next) {
      btnStep2Next.addEventListener('click', () => {
        if (validateStep2()) {
          goToStep(3);
        }
      });
    }

    // Step 3: Back & Next
    const btnStep3Back = document.getElementById('btn-step3-back');
    if (btnStep3Back) {
      btnStep3Back.addEventListener('click', () => goToStep(2));
    }

    const btnStep3Next = document.getElementById('btn-step3-next');
    if (btnStep3Next) {
      btnStep3Next.addEventListener('click', () => {
        captureStep3Data();
        goToStep(4);
        performServerVerification();
      });
    }

    // Step 5: Enter Campus
    const btnEnterCampus = document.getElementById('btn-enter-campus');
    if (btnEnterCampus) {
      btnEnterCampus.addEventListener('click', () => {
        window.location.href = 'campus.html';
      });
    }
  }

  function goToStep(step) {
    currentStep = step;

    // Hide all step panels
    document.querySelectorAll('.wizard-stage-panel').forEach((panel) => {
      panel.style.display = 'none';
    });

    // Show current panel
    const currentPanel = document.getElementById(`stage-${step}-panel`);
    if (currentPanel) {
      currentPanel.style.display = 'block';
    }

    // Update stepper visual nodes
    for (let i = 1; i <= 5; i++) {
      const node = document.getElementById(`step-node-${i}`);
      if (node) {
        node.classList.remove('active', 'completed');
        if (i < step) {
          node.classList.add('completed');
          node.innerHTML = '✓';
        } else if (i === step) {
          node.classList.add('active');
          node.innerHTML = i;
        } else {
          node.innerHTML = i;
        }
      }
    }

    // Update stepper progress line
    const progressLine = document.getElementById('stepper-progress-line');
    if (progressLine) {
      const percent = ((step - 1) / 4) * 100;
      progressLine.style.width = `${percent}%`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateStep2() {
    let isValid = true;

    const name = document.getElementById('reg-name');
    const email = document.getElementById('reg-email');
    const regNum = document.getElementById('reg-number');
    const pass = document.getElementById('reg-password');
    const confirmPass = document.getElementById('reg-confirm-password');

    // Reset error states
    [name, email, regNum, pass, confirmPass].forEach((el) => {
      if (el) el.classList.remove('is-invalid');
    });

    if (!name || name.value.trim().length < 2) {
      name.classList.add('is-invalid');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value.trim())) {
      email.classList.add('is-invalid');
      isValid = false;
    }

    if (!regNum || regNum.value.trim().length < 5) {
      regNum.classList.add('is-invalid');
      isValid = false;
    }

    if (!pass || pass.value.length < 6) {
      pass.classList.add('is-invalid');
      isValid = false;
    }

    if (!confirmPass || confirmPass.value !== pass.value) {
      confirmPass.classList.add('is-invalid');
      isValid = false;
    }

    if (isValid) {
      registrationData.name = name.value.trim();
      registrationData.email = email.value.trim();
      registrationData.registrationNumber = regNum.value.trim().toUpperCase();
      registrationData.password = pass.value;
    }

    return isValid;
  }

  function captureStep3Data() {
    const dept = document.getElementById('reg-department');
    const prog = document.getElementById('reg-program');
    const year = document.getElementById('reg-year');

    if (dept) registrationData.department = dept.value;
    if (prog) registrationData.program = prog.value;
    if (year) registrationData.academicYear = year.value;
  }

  async function performServerVerification() {
    const scanningProgress = document.getElementById('scanning-progress-bar');
    const scanStatusText = document.getElementById('scan-status-text');
    const verifyErrorBox = document.getElementById('verify-error-box');

    if (verifyErrorBox) verifyErrorBox.style.display = 'none';

    // Cinematic progress simulation
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress > 85) progress = 85;
      if (scanningProgress) scanningProgress.style.width = `${progress}%`;
      if (scanStatusText) {
        if (progress > 60) scanStatusText.textContent = 'CONNECTING TO QUANTUM HIBERNATE / SPRING SECURITY LAYER...';
        else if (progress > 30) scanStatusText.textContent = 'CHECKING IDENTIFIER UNIQUENESS & VALIDATING POLICIES...';
      }
    }, 250);

    try {
      // Real backend registration via Spring Boot API
      const response = await CampusAPI.register({
        name: registrationData.name,
        email: registrationData.email,
        registrationNumber: registrationData.registrationNumber,
        password: registrationData.password,
        department: registrationData.department,
        academicYear: registrationData.academicYear,
        interests: registrationData.interests.join(', ')
      });

      clearInterval(interval);
      if (scanningProgress) scanningProgress.style.width = '100%';
      if (scanStatusText) scanStatusText.textContent = 'IDENTITY INITIALIZATION CONFIRMED BY SERVER!';

      setTimeout(() => {
        populateIdentityCard(response.student || registrationData);
        goToStep(5);
      }, 700);
    } catch (err) {
      clearInterval(interval);
      if (scanningProgress) scanningProgress.style.width = '100%';
      if (scanStatusText) scanStatusText.textContent = 'INITIALIZATION HALTED: SERVER EXCEPTION';

      if (verifyErrorBox) {
        verifyErrorBox.style.display = 'block';
        verifyErrorBox.textContent = `Error: ${err.message || 'Unable to complete identity initialization on server.'}`;
      }
    }
  }

  function populateIdentityCard(student) {
    const idName = document.getElementById('card-student-name');
    const idReg = document.getElementById('card-student-reg');
    const idDept = document.getElementById('card-student-dept');
    const idYear = document.getElementById('card-student-year');
    const idEmail = document.getElementById('card-student-email');

    if (idName) idName.textContent = student.name || registrationData.name;
    if (idReg) idReg.textContent = student.registrationNumber || registrationData.registrationNumber;
    if (idDept) idDept.textContent = student.department || registrationData.department;
    if (idYear) idYear.textContent = student.academicYear || registrationData.academicYear;
    if (idEmail) idEmail.textContent = student.email || registrationData.email;
  }

  /* ---------------------------------------------------------------------- */
  /* LOGIN FORM LOGIC                                                       */
  /* ---------------------------------------------------------------------- */
  function initLoginForm() {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');
      const submitBtn = document.getElementById('btn-login-submit');
      const errorBox = document.getElementById('login-error-alert');

      if (errorBox) errorBox.style.display = 'none';

      const email = emailInput.value.trim();
      const password = passInput.value;

      if (!email || !password) {
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.textContent = 'Please enter both your college email and password.';
        }
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="status-dot"></span> AUTHENTICATING THROUGH SPRING SECURITY...';

      try {
        await CampusAPI.login(email, password);

        submitBtn.innerHTML = '✓ ACCESS GRANTED. ENTERING UNIVERSE...';
        submitBtn.style.background = 'rgba(16, 185, 129, 0.4)';
        submitBtn.style.borderColor = 'var(--accent-emerald)';

        setTimeout(() => {
          window.location.href = 'campus.html';
        }, 800);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.textContent = err.message || 'Invalid credentials. Please verify your college email and password.';
        }
      }
    });
  }
})();
