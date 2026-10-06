/**
 * ==========================================================================
 * SRIRAM M - DEVELOPER PORTFOLIO ENGINE
 * Dynamic Interactivity, Particle Mesh, Ingestion Benchmark, Modals & Toast
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAmbientCanvas();
  initTypewriter();
  initNavbarScrollSpy();
  initSkillsFilter();
  initSimulator();
  initModals();
  initContactForm();
  initQuickCopyButtons();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sriram_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sriram_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
    });
  }
}

/* ==========================================================================
   2. Interactive Ambient Particle Mesh Canvas
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 45);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: i % 2 === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(99, 102, 241, 0.35)'
    });
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse subtle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 0.8;
          p.y -= (dy / dist) * 0.8;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Typewriter Hero Animation
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-target');
  if (!target) return;

  const roles = [
    'Robust Backend Systems',
    'Java & Spring Boot APIs',
    'High-Throughput Log Aggregators',
    'Optimized MySQL Architectures',
    'Full-Stack Web Applications'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/* ==========================================================================
   4. Navbar Scroll & Active ScrollSpy
   ========================================================================== */
function initNavbarScrollSpy() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky blur navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close when link clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   5. Technical Skills Category Filtering
   ========================================================================== */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const categoryCards = document.querySelectorAll('.skill-category-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-category');

      categoryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter) {
          card.style.display = 'block';
          card.style.animation = 'modalScale 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Live Interactive Log Ingestion & Index Benchmark Simulator
   ========================================================================== */
function initSimulator() {
  const btnRun = document.getElementById('btn-run-simulation');
  const batchSelect = document.getElementById('batch-size-select');
  const modeSelect = document.getElementById('indexing-mode-select');
  const terminal = document.getElementById('terminal-screen');
  const latencyVal = document.getElementById('sim-latency-val');
  const throughputVal = document.getElementById('sim-throughput-val');

  if (!btnRun || !terminal) return;

  btnRun.addEventListener('click', () => {
    btnRun.disabled = true;
    const batchSize = parseInt(batchSelect.value, 10);
    const isOptimized = modeSelect.value === 'optimized';

    terminal.innerHTML = '';
    appendTerminalLine('SYSTEM', `Preparing ingestion worker for batch size: ${batchSize} records...`, 'text-secondary');

    setTimeout(() => {
      appendTerminalLine('INGESTION', `Received HTTP POST /api/v1/logs/batch with payload count: ${batchSize}`, 'terminal-ok');
    }, 200);

    setTimeout(() => {
      if (isOptimized) {
        appendTerminalLine('JDBC-POOL', `Executing batched prepared statements (batch_size=${batchSize})...`, 'terminal-ok');
        appendTerminalLine('INDEXING', `B-Tree Composite Indexes verified: idx_service_time, idx_level_time. Zero table scan.`, 'terminal-ok');
        appendTerminalLine('TRANSACTION', `Isolated propagation boundary committed in separate worker thread.`, 'terminal-ok');

        const calculatedLatency = Math.floor(14 + Math.random() * 8) + (batchSize === 500 ? 5 : 2);
        const calculatedThroughput = Math.floor((batchSize / (calculatedLatency / 1000))).toLocaleString();

        setTimeout(() => {
          appendTerminalLine('SUCCESS', `202 ACCEPTED. ${batchSize} records ingested in ${calculatedLatency}ms!`, 'terminal-ok');
          latencyVal.textContent = `${calculatedLatency} ms`;
          throughputVal.textContent = `${calculatedThroughput} rec/s`;
          btnRun.disabled = false;
          showToast(`Ingestion completed in ${calculatedLatency}ms with 4 Composite Indexes!`);
        }, 350);
      } else {
        appendTerminalLine('JDBC-WARN', `Individual INSERT statements triggered without batch grouping...`, 'terminal-warn');
        appendTerminalLine('DB-SCAN', `Full table scan warning: missing composite index for filtered queries.`, 'terminal-warn');
        appendTerminalLine('LOCK-WAIT', `Thread lock wait time elevated. Transaction boundary standard.`, 'terminal-warn');

        const calculatedLatency = Math.floor(280 + Math.random() * 120) + (batchSize === 500 ? 110 : 30);
        const calculatedThroughput = Math.floor((batchSize / (calculatedLatency / 1000))).toLocaleString();

        setTimeout(() => {
          appendTerminalLine('COMPLETE', `Batch processed in ${calculatedLatency}ms (High latency detected).`, 'terminal-warn');
          latencyVal.textContent = `${calculatedLatency} ms`;
          throughputVal.textContent = `${calculatedThroughput} rec/s`;
          btnRun.disabled = false;
          showToast(`Completed unoptimized write in ${calculatedLatency}ms. Notice the latency difference!`);
        }, 500);
      }
    }, 450);
  });

  function appendTerminalLine(tag, message, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    const timeStr = new Date().toTimeString().split(' ')[0];
    line.innerHTML = `<span class="terminal-timestamp">[${timeStr}] [${tag}]</span> <span class="${className}">${message}</span>`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }
}

/* ==========================================================================
   7. Project Deep Dive Modals & Resume Viewer
   ========================================================================== */
const projectData = {
  'log-aggregator': {
    title: 'Distributed Log Viewer & Aggregator — Architecture Deep Dive',
    content: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: rgba(56, 189, 248, 0.08); border-left: 4px solid var(--accent-cyan); padding: 14px 18px; border-radius: 4px;">
          <h4 style="color: var(--accent-cyan); font-size: 1.05rem; margin-bottom: 6px;">Executive Engineering Summary</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
            Built a high-throughput, full-stack log ingestion and search microservice capable of processing high-volume structured payloads without stalling web request threads. Built with <strong>Java 17, Spring Boot, Spring Data JPA (Hibernate), and MySQL</strong>.
          </p>
        </div>

        <div>
          <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 12px; font-weight: 700;">System Architecture & Concurrency Strategy</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: var(--text-secondary);">
            <li><strong style="color: var(--text-primary);">• Single/Batch Ingestion Endpoints:</strong> REST controller accepting JSON payloads of up to 500 structured logs per batch request, returning asynchronous ticket IDs for ingestion status tracking.</li>
            <li><strong style="color: var(--text-primary);">• Isolated Transaction Boundaries:</strong> Uses Spring's <code>@Async</code> worker thread pool alongside <code>@Transactional(propagation = Propagation.REQUIRES_NEW)</code> so that single record validation errors never cascade into whole-batch rollbacks.</li>
            <li><strong style="color: var(--text-primary);">• JDBC Batching:</strong> Configured <code>spring.jpa.properties.hibernate.jdbc.batch_size=500</code> and order-inserts/order-updates, consolidating hundreds of network roundtrips into atomic multi-row queries.</li>
          </ul>
        </div>

        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); padding: 18px; border-radius: 12px;">
          <h4 style="font-size: 0.95rem; font-family: var(--font-mono); color: var(--accent-cyan); margin-bottom: 10px;">The 4 Key MySQL Composite Indexes</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-family: var(--font-mono); font-size: 0.8rem;">
            <div style="background: var(--bg-primary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--accent-emerald);">idx_service_timestamp</span>
              <p style="color: var(--text-muted); margin-top: 4px;">(service_name, created_at DESC)</p>
            </div>
            <div style="background: var(--bg-primary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--accent-emerald);">idx_level_timestamp</span>
              <p style="color: var(--text-muted); margin-top: 4px;">(log_level, created_at DESC)</p>
            </div>
            <div style="background: var(--bg-primary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--accent-emerald);">idx_trace_session</span>
              <p style="color: var(--text-muted); margin-top: 4px;">(trace_id, session_id)</p>
            </div>
            <div style="background: var(--bg-primary); padding: 10px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--accent-emerald);">idx_job_status_time</span>
              <p style="color: var(--text-muted); margin-top: 4px;">(batch_job_id, status, updated_at)</p>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">GitHub Repository ↗</a>
          <a href="#simulator" class="btn btn-primary btn-sm" onclick="closeModals()">Open Live Simulator</a>
        </div>
      </div>
    `
  },
  'car-showroom': {
    title: 'E-Commerce Car Showroom Website — Full-Stack Breakdown',
    content: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: rgba(99, 102, 241, 0.08); border-left: 4px solid var(--accent-indigo); padding: 14px 18px; border-radius: 4px;">
          <h4 style="color: var(--accent-indigo); font-size: 1.05rem; margin-bottom: 6px;">Project Architecture & Features</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
            A complete e-commerce automotive dealership application engineered with a reactive React single-page frontend consuming robust REST APIs built with <strong>Java and Spring Boot</strong>, backed by MySQL.
          </p>
        </div>

        <div>
          <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 12px; font-weight: 700;">Key Technical Highlights</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: var(--text-secondary);">
            <li><strong style="color: var(--text-primary);">• Dynamic Filtering & Search:</strong> Real-time filtering across electric vehicles, sports cars, price tiers, and performance metrics without page refreshes.</li>
            <li><strong style="color: var(--text-primary);">• End-to-End RESTful Integration:</strong> Microservice API contracts handling inventory status, customer inquiry submissions, and test drive schedule bookings.</li>
            <li><strong style="color: var(--text-primary);">• Relational Schema Design:</strong> Normalized MySQL schema with foreign key relationships for vehicle inventory, user bookings, customer inquiries, and specifications.</li>
          </ul>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">GitHub Repository ↗</a>
          <button class="btn btn-secondary btn-sm" onclick="closeModals()">Close</button>
        </div>
      </div>
    `
  },
  'todo-api': {
    title: 'Spring Boot To-Do REST API — Endpoints & Specification',
    content: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: rgba(16, 185, 129, 0.08); border-left: 4px solid var(--accent-emerald); padding: 14px 18px; border-radius: 4px;">
          <h4 style="color: var(--accent-emerald); font-size: 1.05rem; margin-bottom: 6px;">Production-Ready REST Microservice</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
            Engineered with strict adherence to MVC layered architecture (Controller, Service, Repository, Entity), DTO input validation, and centralized exception handling.
          </p>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-subtle); text-align: left; color: var(--accent-cyan);">
                <th style="padding: 10px;">HTTP Verb</th>
                <th style="padding: 10px;">URI Endpoint</th>
                <th style="padding: 10px;">Status</th>
                <th style="padding: 10px;">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 10px; color: #38bdf8; font-weight: 700;">GET</td>
                <td style="padding: 10px;">/api/v1/tasks</td>
                <td style="padding: 10px; color: #10b981;">200 OK</td>
                <td style="padding: 10px; color: var(--text-secondary);">Fetch all tasks with pagination</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 10px; color: #10b981; font-weight: 700;">POST</td>
                <td style="padding: 10px;">/api/v1/tasks</td>
                <td style="padding: 10px; color: #10b981;">201 Created</td>
                <td style="padding: 10px; color: var(--text-secondary);">Create new task with DTO validation</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 10px; color: #f59e0b; font-weight: 700;">PUT</td>
                <td style="padding: 10px;">/api/v1/tasks/{id}</td>
                <td style="padding: 10px; color: #10b981;">200 OK</td>
                <td style="padding: 10px; color: var(--text-secondary);">Update task title, status, due date</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 10px; color: #f43f5e; font-weight: 700;">DELETE</td>
                <td style="padding: 10px;">/api/v1/tasks/{id}</td>
                <td style="padding: 10px; color: #10b981;">204 No Content</td>
                <td style="padding: 10px; color: var(--text-secondary);">Idempotent removal with cascade cleanup</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">GitHub Repository ↗</a>
          <button class="btn btn-secondary btn-sm" onclick="closeModals()">Close</button>
        </div>
      </div>
    `
  }
};

window.openProjectModal = function(projectId) {
  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('modal-project-title');
  const contentEl = document.getElementById('modal-project-content');

  const data = projectData[projectId];
  if (!data || !modal) return;

  titleEl.textContent = data.title;
  contentEl.innerHTML = data.content;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closeModals = function() {
  const modals = document.querySelectorAll('.modal-backdrop');
  modals.forEach(m => {
    m.classList.remove('active');
    m.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = 'auto';
};

function initModals() {
  const projectModal = document.getElementById('project-modal');
  const projectCloseBtn = document.getElementById('modal-close-btn');

  const resumeModal = document.getElementById('resume-modal');
  const resumeNavBtn = document.getElementById('btn-view-resume-nav');
  const resumeCloseBtn = document.getElementById('resume-modal-close-btn');

  if (projectCloseBtn) {
    projectCloseBtn.addEventListener('click', closeModals);
  }
  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', closeModals);
  }

  if (resumeNavBtn && resumeModal) {
    resumeNavBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  // Backdrop click closes modal
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModals();
    }
  });

  // ESC key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModals();
    }
  });
}

/* ==========================================================================
   8. Clipboard Copy & Toast Notifications
   ========================================================================== */
window.copyToClipboard = function(text, successMessage = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
};

function fallbackCopy(text, successMessage) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast(successMessage);
}

function initQuickCopyButtons() {
  const btnCopyEmail = document.getElementById('btn-quick-email');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      copyToClipboard('msriram292004@gmail.com', 'Sriram\'s email copied: msriram292004@gmail.com');
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ==========================================================================
   9. Interactive Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Compose mailto link so hiring managers can instantly send email via client
    const mailtoLink = `mailto:msriram292004@gmail.com?subject=${encodeURIComponent(subject || 'Opportunity for Sriram M')}&body=${encodeURIComponent(`Hi Sriram,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
    
    showToast(`Opening email client for ${name}...`);
    window.location.href = mailtoLink;

    form.reset();
  });
}
