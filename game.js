const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreVal = document.getElementById('score-value');
const dataOverlay = document.getElementById('data-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayContent = document.getElementById('overlay-content');
const closeOverlay = document.getElementById('close-overlay');
const startScreen = document.getElementById('start-screen');
const victoryScreen = document.getElementById('victory-screen');
const failScreen = document.getElementById('fail-screen');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const nextLogInfo = document.getElementById('score-value');
const stabilityFill = document.getElementById('stability-fill');
const fullResumeContent = document.getElementById('full-resume-content');

// Load Assets
const avatarImg = new Image();
avatarImg.src = 'avatar.jpg';

// Setup Canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 35;
}
window.addEventListener('resize', resize);
resize();

// Game State
let gameRunning = false;
let stability = 100;
let unlockedDataCount = 0;
let frameCount = 0;
let totalHits = 0;
const unlockTargets = [5, 11, 17, 23, 29, 35, 41];

const profileData = [
    {
        id: 0,
        title: "CORE_IDENTITY",
        content: `<h2>Golam Rabbani</h2>
                  <p>Senior Software Engineer & Team Lead</p>
                  <p>As a Senior Software Engineer and Team Lead, I excel in crafting robust solutions with Node.js, Express, NestJS, and SQL/NoSQL databases, Prisma, TypeOrm. My expertise extends to React for dynamic front-end experiences.</p>
                  <p>Email: golamrabbani3587@gmail.com | Dhaka, Bangladesh</p>`
    },
    {
        id: 1,
        title: "SKILL_ARSENAL",
        content: `<h2>Technical Skills</h2>
                  <div class="skills-grid">
                    <span class="skill-tag">NodeJS</span><span class="skill-tag">Express</span><span class="skill-tag">NestJS</span>
                    <span class="skill-tag">React</span><span class="skill-tag">NextJS</span><span class="skill-tag">TypeScript</span>
                    <span class="skill-tag">OpenAI</span><span class="skill-tag">Docker</span><span class="skill-tag">Jenkins</span>
                    <span class="skill-tag">Kubernetes</span><span class="skill-tag">Terraform</span><span class="skill-tag">AWS</span>
                    <span class="skill-tag">Ansible</span><span class="skill-tag">Grafana</span><span class="skill-tag">TypeOrm</span>
                    <span class="skill-tag">Prisma</span><span class="skill-tag">MongoDB</span><span class="skill-tag">PostgreSQL</span>
                  </div>`
    },
    {
        id: 2,
        title: "WORK_EXPERIENCE_P1",
        content: `<h2>Recent Experience</h2>
                  <div class="job-entry">
                    <p class="job-company">CodeShaper (03/2025 - Running)</p>
                    <p class="job-title">Senior Software Engineer</p>
                    <p class="job-meta">Dhaka, Bangladesh</p>
                    <p>Managing team and worked as a senior software engineer. Focus on building and improving SaaS products.</p>
                  </div>
                  <div class="job-entry">
                    <p class="job-company">Essaly (11/2022 - 02/2025)</p>
                    <p class="job-title">Senior Software Engineer</p>
                    <p class="job-meta">Riyadh, Saudi Arabia</p>
                    <p>Worked on different projects with skill set including technical solutions and business orientation.</p>
                  </div>`
    },
    {
        id: 3,
        title: "WORK_EXPERIENCE_P2",
        content: `<h2>Earlier Quests</h2>
                  <div class="job-entry">
                    <p class="job-company">Prolific Info Tech (09/2021 - 11/2022)</p>
                    <p class="job-title">Senior Software Engineer</p>
                    <p>Developed high-quality services for enterprise customers.</p>
                  </div>
                  <div class="job-entry">
                    <p class="job-company">Shuttle (01/2021 - 08/2021)</p>
                    <p class="job-title">Software Engineer</p>
                    <p>Developed apps APIs and internal mass-transit startup software.</p>
                  </div>
                  <div class="job-entry">
                    <p class="job-company">NotionSoft (01/2019 - 12/2020)</p>
                    <p class="job-title">Software Engineer</p>
                    <p>Developed different software using NodeJS, Express and others.</p>
                  </div>`
    },
    {
        id: 4,
        title: "ACADEMIC_LORE",
        content: `<h2>Education</h2>
                  <p class="university">Bachelor In Computer Science And Engineering</p>
                  <p>Daffodil International University (2015 - 2019)</p>
                  <p>CGPA: 2.78 | Location: Dhaka, Bangladesh</p>
                  <p>Courses: Completed two research papers based on machine learning.</p>`
    },
    {
        id: 5,
        title: "RESEARCH_&_ORG",
        content: `<h2>Research Artifacts</h2>
                  <p><strong>1. Sentiment Classification for Bengali News</strong></p>
                  <p>Performance measurement of multiple supervised learning algorithms.</p>
                  <p><strong>2. Comparative Sentiment Analysis</strong></p>
                  <p>Using different types of machine learning algorithms.</p>
                  <h2>Organizations</h2>
                  <p>Team ICT71 (Team Lead) | 12/2018 - 01/2019</p>`
    },
    {
        id: 6,
        title: "SOCIAL_&_COMMS",
        content: `<h2>Connect with Developer</h2>
                  <p><strong>Email:</strong> golamrabbani3587@gmail.com</p>
                  <p><strong>Phone:</strong> 8801751394949</p>
                  <p><strong>Location:</strong> Dhaka, Bangladesh</p>
                  <p><strong>Website:</strong> rabbani.begelled.com</p>
                  <ul>
                    <li><strong>LinkedIn:</strong> linkedin.com/in/rabbani204</li>
                    <li><strong>Facebook:</strong> facebook.com/rabbani.sarkar.543</li>
                    <li><strong>GitHub:</strong> github.com/rabbani204</li>
                  </ul>`
    }
];

// Combine all for final resume
function generateFullResume() {
    return `
        <div class="resume-header-main" style="grid-column: span 2; display: flex; align-items: center; gap: 30px; margin-bottom: 20px; border-bottom: 2px solid var(--primary); padding-bottom: 20px;">
            <img src="avatar.jpg" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--primary); object-fit: cover;">
            <div>
                <h1 style="font-family: 'Orbitron'; color: white; margin: 0;">GOLAM RABBANI</h1>
                <p style="color: var(--primary); font-family: 'Orbitron'; margin: 5px 0 0 0;">SENIOR SOFTWARE ENGINEER & TEAM LEAD</p>
            </div>
        </div>
        <div class="resume-main">
            <section class="resume-section">
                <h3>About Me</h3>
                <p>Senior Software Engineer and Team Lead with expertise in Node.js, Express, NestJS, and SQL/NoSQL databases. Proficient in DevOps tools like Docker, Jenkins, Terraform, and Kubernetes.</p>
            </section>
            
            <section class="resume-section">
                <h3>Work Experience</h3>
                <div class="job-entry">
                    <div class="job-header">
                        <span class="job-title">Senior Software Engineer</span>
                        <span class="job-company">CodeShaper</span>
                    </div>
                    <p class="job-meta">03/2025 - Present | Dhaka, Bangladesh</p>
                    <p>Software development company specializing in building custom software solutions. Managing team and working on SaaS products.</p>
                </div>
                <div class="job-entry">
                    <div class="job-header">
                        <span class="job-title">Senior Software Engineer</span>
                        <span class="job-company">Essaly</span>
                    </div>
                    <p class="job-meta">11/2022 - 02/2025 | Riyadh, Saudi Arabia</p>
                    <p>Leading technology business orientations. Worked on diverse projects using robust technical stacks.</p>
                </div>
                <div class="job-entry">
                    <div class="job-header">
                        <span class="job-title">Senior Software Engineer</span>
                        <span class="job-company">Prolific Info Tech</span>
                    </div>
                    <p class="job-meta">09/2021 - 11/2022 | Dhaka, Bangladesh</p>
                    <p>Delivering high-quality enterprise standards at competitive costs.</p>
                </div>
                <div class="job-entry">
                    <div class="job-header">
                        <span class="job-title">Software Engineer</span>
                        <span class="job-company">Shuttle</span>
                    </div>
                    <p class="job-meta">01/2021 - 08/2021 | Dhaka, Bangladesh</p>
                    <p>Mass-transit startup focused on safe and affordable transportation.</p>
                </div>
                <div class="job-entry">
                    <div class="job-header">
                        <span class="job-title">Software Engineer</span>
                        <span class="job-company">NotionSoft</span>
                    </div>
                    <p class="job-meta">01/2019 - 12/2020 | Dhaka, Bangladesh</p>
                    <p>Developed various software solutions using NodeJS and Express.</p>
                </div>
            </section>
            
            <section class="resume-section">
                <h3>Research Papers</h3>
                <div class="education-item">
                    <p class="job-title">Bengali News Headline Sentiment Classification</p>
                    <p class="job-meta">01/2019 - 05/2019</p>
                    <p>Performance measurement of multiple supervised learning algorithms.</p>
                </div>
                <div class="education-item">
                    <p class="job-title">Comparative Sentiment Analysis</p>
                    <p class="job-meta">01/2019 - 05/2019</p>
                    <p>Using different types of machine learning algorithms for consumer feedback.</p>
                </div>
            </section>
        </div>
        
        <div class="resume-side">
            <section class="resume-section">
                <h3>Contact & Social</h3>
                <p><strong>Email:</strong> golamrabbani3587@gmail.com</p>
                <p><strong>Phone:</strong> 8801751394949</p>
                <p><strong>Location:</strong> Dhaka, Bangladesh</p>
                <p><strong>Website:</strong> rabbani.begelled.com</p>
                <div style="margin-top: 15px;">
                    <p><strong>LinkedIn:</strong> /in/rabbani204</p>
                    <p><strong>GitHub:</strong> /rabbani204</p>
                    <p><strong>Facebook:</strong> /rabbani.sarkar.543</p>
                </div>
            </section>

            <section class="resume-section">
                <h3>Skills</h3>
                <div class="skill-tags">
                    <span class="skill-tag">NodeJS</span><span class="skill-tag">Express</span><span class="skill-tag">NestJS</span>
                    <span class="skill-tag">React</span><span class="skill-tag">NextJS</span><span class="skill-tag">TypeScript</span>
                    <span class="skill-tag">Docker</span><span class="skill-tag">Kubernetes</span><span class="skill-tag">Terraform</span>
                    <span class="skill-tag">AWS</span><span class="skill-tag">Prisma</span><span class="skill-tag">PostgreSQL</span>
                </div>
            </section>

            <section class="resume-section">
                <h3>Languages</h3>
                <p>English (Professional)</p>
                <p>Bangla (Native)</p>
                <p>Hindi (Limited)</p>
            </section>
            
            <section class="resume-section">
                <h3>Education</h3>
                <div class="education-item">
                    <p class="job-company">Daffodil International Univ.</p>
                    <p class="job-meta">B.Sc. in CSE (2015-2019)</p>
                </div>
            </section>
        </div>
    `;
}

// Entities & Initial State
const player = { x: 0, y: 0, size: 20, speed: 6, angle: 0, color: '#00f2ff' };
let bullets = [], enemies = [], particles = [];
const keys = {};
let mouse = { x: 0, y: 0, down: false };

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);
window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if (gameRunning) player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
});

function handleInteraction(x, y) {
    const rect = canvas.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    mouse.x = canvasX;
    mouse.y = canvasY;

    if (gameRunning) {
        player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        // Instant fire towards the tapped point
        bullets.push({
            x: player.x, y: player.y,
            vx: Math.cos(player.angle) * 12,
            vy: Math.sin(player.angle) * 12
        });
    }
}

window.addEventListener('mousedown', e => {
    handleInteraction(e.clientX, e.clientY);
    mouse.down = true;
});
window.addEventListener('mouseup', () => mouse.down = false);

window.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    handleInteraction(touch.clientX, touch.clientY);
    mouse.down = true;
}, { passive: false });

window.addEventListener('touchmove', e => {
    if (!gameRunning) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    e.preventDefault();
}, { passive: false });

window.addEventListener('touchend', () => mouse.down = false);

function spawnEnemy() {
    if (!gameRunning) return;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * canvas.width; y = -50; }
    else if (side === 1) { x = canvas.width + 50; y = Math.random() * canvas.height; }
    else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 50; }
    else { x = -50; y = Math.random() * canvas.height; }
    enemies.push({ x, y, size: 25, speed: 1.5 + (totalHits / 50), hp: 1, color: '#ff3333' });
}

function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({ x, y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 1, color });
    }
}

function update() {
    if (!gameRunning) return;
    frameCount++;
    // Player Movement (Keyboard)
    if (keys['KeyW'] || keys['ArrowUp']) player.y -= player.speed;
    if (keys['KeyS'] || keys['ArrowDown']) player.y += player.speed;
    if (keys['KeyA'] || keys['ArrowLeft']) player.x -= player.speed;
    if (keys['KeyD'] || keys['ArrowRight']) player.x += player.speed;

    // Player Movement (Mobile/Mouse Follow)
    if (mouse.down) {
        const dx = mouse.x - player.x;
        const dy = mouse.y - player.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 30) {
            player.x += (dx / dist) * player.speed;
            player.y += (dy / dist) * player.speed;
        }
    }

    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

    if ((mouse.down || keys['Space']) && frameCount % 10 === 0) {
        bullets.push({
            x: player.x, y: player.y,
            vx: Math.cos(player.angle) * 12, vy: Math.sin(player.angle) * 12
        });
    }

    bullets = bullets.filter(b => {
        b.x += b.vx; b.y += b.vy;
        return b.x > 0 && b.x < canvas.width && b.y > 0 && b.y < canvas.height;
    });

    enemies.forEach((e, ei) => {
        const ang = Math.atan2(player.y - e.y, player.x - e.x);
        e.x += Math.cos(ang) * e.speed; e.y += Math.sin(ang) * e.speed;
        if (Math.hypot(player.x - e.x, player.y - e.y) < player.size + e.size / 2) {
            stability -= 10; enemies.splice(ei, 1); createParticles(e.x, e.y, e.color);
        }
        bullets.forEach((b, bi) => {
            if (Math.hypot(b.x - e.x, b.y - e.y) < e.size) {
                enemies.splice(ei, 1); bullets.splice(bi, 1); createParticles(e.x, e.y, e.color);
                totalHits++;
                if (unlockedDataCount < unlockTargets.length && totalHits >= unlockTargets[unlockedDataCount]) {
                    showData(unlockedDataCount);
                }
            }
        });
    });

    if (frameCount % 60 === 0) spawnEnemy();
    particles.forEach((p, pi) => { p.x += p.vx; p.y += p.vy; p.life -= 0.02; if (p.life <= 0) particles.splice(pi, 1); });

    stabilityFill.style.width = stability + '%';
    const currentTarget = unlockTargets[unlockedDataCount] || unlockTargets[unlockTargets.length - 1];
    scoreVal.textContent = `SYNC: ${unlockedDataCount}/${unlockTargets.length} | NEXT: ${totalHits}/${currentTarget} HITS`;

    if (stability <= 0) { gameRunning = false; failScreen.classList.remove('hidden'); }
    if (unlockedDataCount === unlockTargets.length) {
        gameRunning = false;
        fullResumeContent.innerHTML = generateFullResume();
        victoryScreen.classList.remove('hidden');
    }
}

function draw() {
    ctx.fillStyle = stability < 30 ? '#1a0505' : '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00f2ff08';
    for (let i = 0; i < canvas.width; i += 100) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let i = 0; i < canvas.height; i += 100) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
    particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 2, 2); });
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#fff'; bullets.forEach(b => ctx.fillRect(b.x - 2, b.y - 2, 4, 4));

    // Enemies (Virus Icon)
    enemies.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(frameCount / 10);
        ctx.fillStyle = e.color;

        // Draw Virus Shape
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4);
            ctx.lineTo(e.size / 2 + 5, 0);
            ctx.lineTo(e.size / 2, 2);
        }
        ctx.closePath();
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(0, 0, e.size / 3, 0, Math.PI * 2);
        ctx.fillStyle = '#900';
        ctx.fill();

        ctx.restore();
    });

    // Player (Avatar)
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle + Math.PI / 2); // Adjust for image orientation

    // Draw glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = player.color;

    // Clip circle for avatar
    ctx.beginPath();
    ctx.arc(0, 0, player.size, 0, Math.PI * 2);
    ctx.clip();

    // Draw Image
    if (avatarImg.complete) {
        ctx.drawImage(avatarImg, -player.size, -player.size, player.size * 2, player.size * 2);
    } else {
        ctx.fillStyle = player.color;
        ctx.fill();
    }

    ctx.restore();
    ctx.shadowBlur = 0;
}

function showData(id) {
    const data = profileData[id];
    overlayTitle.textContent = data.title;
    overlayContent.innerHTML = data.content;
    dataOverlay.classList.remove('hidden');
    gameRunning = false;
    unlockedDataCount++;
    const sidebarList = document.getElementById('sidebar-list');
    const placeholder = sidebarList.querySelector('.sidebar-placeholder');
    if (placeholder) placeholder.remove();
    const item = document.createElement('div');
    item.className = 'sidebar-item';
    item.textContent = data.title;
    item.onclick = () => { overlayTitle.textContent = data.title; overlayContent.innerHTML = data.content; dataOverlay.classList.remove('hidden'); gameRunning = false; };
    sidebarList.appendChild(item);
    stability = Math.min(100, stability + 15);
}

closeOverlay.addEventListener('click', () => { dataOverlay.classList.add('hidden'); gameRunning = true; });
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    player.x = canvas.width / 2; player.y = canvas.height / 2;
    gameRunning = true;
    requestAnimationFrame(gameLoop);
});
retryBtn.addEventListener('click', () => location.reload());
function gameLoop() { update(); draw(); if (gameRunning || !dataOverlay.classList.contains('hidden')) requestAnimationFrame(gameLoop); }
resize();
