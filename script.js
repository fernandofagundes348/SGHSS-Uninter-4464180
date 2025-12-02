//BANCO DE DADOS & CONFIGURAÇÃO
const DB_NAME = 'SGHSS_PRO_DB_V1';

// Inicializa ou recupera dados do LocalStorage
function getDB() {
    let db = JSON.parse(localStorage.getItem(DB_NAME));
    if (!db) {
        // Dados Iniciais (Seed) para teste imediato
        db = {
            users: [
                { id: 'u1', name: 'Paciente Teste', email: 'paciente@vidaplus.com', password: '123', role: 'paciente' },
                { id: 'u2', name: 'Dr. Gregory House', email: 'medico@vidaplus.com', password: '123', role: 'medico' },
                { id: 'u3', name: 'Admin Geral', email: 'admin@vidaplus.com', password: '123', role: 'admin' }
            ],
            appointments: [
                { id: 'a1', patientId: 'u1', doctorId: 'u2', date: '2025-10-15', time: '14:00', specialty: 'Cardiologia', type: 'Telemedicina', status: 'Agendado' }
            ],
            records: [],
            internations: [
                { id: 'i1', room: '101', status: 'Ocupado', type: 'UTI' },
                { id: 'i2', room: '102', status: 'Livre', type: 'Enfermaria' },
                { id: 'i3', room: '103', status: 'Livre', type: 'Enfermaria' }
            ]
        };
        saveDB(db);
    }
    return db;
}

function saveDB(data) { localStorage.setItem(DB_NAME, JSON.stringify(data)); }
function generateID() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }


//SISTEMA DE AUTENTICAÇÃO
function toggleAuth(screen) {
    document.querySelectorAll('.auth-form').forEach(el => el.classList.add('d-none'));
    document.getElementById(`form-${screen}`).classList.remove('d-none');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = getDB().users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('SGHSS_SESSION', JSON.stringify(user));
        initApp();
    } else {
        alert("Acesso Negado. Verifique as credenciais de teste na tela.");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const db = getDB();
    const newUser = {
        id: generateID(),
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        role: 'paciente' // Padrão
    };
    db.users.push(newUser);
    saveDB(db);
    alert("Conta criada com sucesso! Faça login.");
    toggleAuth('login');
}

function handleForgot(e) {
    e.preventDefault();
    alert("Link de recuperação enviado para o e-mail (Simulação).");
    toggleAuth('login');
}

function logout() {
    localStorage.removeItem('SGHSS_SESSION');
    location.reload();
}

//NAVEGAÇÃO E LÓGICA DO APP
function initApp() {
    const user = JSON.parse(localStorage.getItem('SGHSS_SESSION'));
    if (!user) return; // Se não estiver logado, fica na auth

    // Troca Telas
    document.getElementById('auth-screen').classList.replace('d-flex', 'd-none');
    document.getElementById('app-screen').classList.remove('d-none');
    document.getElementById('app-screen').classList.add('d-flex');

    // Atualiza UI com dados do usuário
    updateUserInfo(user);
    setupSidebar(user);

    // Redireciona para Dashboard correta
    const startPage = user.role === 'medico' ? 'painel-medico' : (user.role === 'admin' ? 'painel-admin' : 'painel-paciente');
    navigateTo(startPage);
}

function updateUserInfo(user) {
    document.getElementById('user-name-display').innerText = user.name;
    document.getElementById('user-role-display').innerText = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('desktop-avatar').innerText = initials;
    document.getElementById('mobile-avatar').innerText = initials;
}

function setupSidebar(user) {
    const menu = document.getElementById('sidebar-menu');
    let items = [];

    // Define menu baseado no cargo (Role-based Access Control)
    if (user.role === 'paciente') {
        items = [
            { id: 'painel-paciente', icon: 'bi-grid-fill', text: 'Visão Geral' },
            { id: 'agendamento', icon: 'bi-plus-circle-fill', text: 'Novo Agendamento' },
            { id: 'meus-agendamentos', icon: 'bi-calendar-check', text: 'Minhas Consultas' },
            { id: 'historico-clinico', icon: 'bi-file-medical', text: 'Prontuário' },
        ];
    } else if (user.role === 'medico') {
        items = [
            { id: 'painel-medico', icon: 'bi-calendar-week', text: 'Agenda Médica' },
            { id: 'atendimento', icon: 'bi-clipboard-pulse', text: 'Sala de Atendimento' },
        ];
    } else {
        items = [
            { id: 'painel-admin', icon: 'bi-speedometer2', text: 'Dashboard Admin' },
            { id: 'gestao-cadastros', icon: 'bi-people-fill', text: 'Usuários' },
            { id: 'controle-leitos', icon: 'bi-hospital', text: 'Gestão de Leitos' },
            { id: 'relatorios', icon: 'bi-file-earmark-bar-graph', text: 'Relatórios' }
        ];
    }

    menu.innerHTML = items.map(item => `
        <button class="list-group-item list-group-item-action" onclick="navigateTo('${item.id}')">
            <i class="bi ${item.icon}"></i> ${item.text}
        </button>
    `).join('') + `
        <button class="list-group-item list-group-item-action text-danger mt-3" onclick="logout()">
            <i class="bi bi-box-arrow-left"></i> Sair
        </button>
    `;
}

function navigateTo(sectionId) {
    // Esconde todas, mostra a alvo
    document.querySelectorAll('.app-section').forEach(el => el.classList.add('d-none'));
    const target = document.getElementById(sectionId);
    if(target) target.classList.remove('d-none');

    // Atualiza Menu Ativo
    document.querySelectorAll('.list-group-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="navigateTo('${sectionId}')"]`);
    if(activeBtn) activeBtn.classList.add('active');

    // Títulos da página
    const titles = {
        'painel-paciente': 'Visão Geral', 'agendamento': 'Agendar Consulta', 
        'meus-agendamentos': 'Minhas Consultas', 'historico-clinico': 'Histórico Clínico',
        'painel-medico': 'Pacientes do Dia', 'atendimento': 'Atendimento'
    };
    const titleEl = document.getElementById('page-title');
    const titleMob = document.getElementById('page-title-mobile');
    if(titleEl) titleEl.innerText = titles[sectionId] || 'SGHSS';
    if(titleMob) titleMob.innerText = titles[sectionId] || 'SGHSS';

    // Fecha menu mobile
    const sidebarEl = document.getElementById('sidebarMenu');
    if(window.innerWidth < 992 && sidebarEl.classList.contains('show')) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(sidebarEl);
        if(bsOffcanvas) bsOffcanvas.hide();
    }

    // Carregadores de Dados Dinâmicos
    if(sectionId === 'meus-agendamentos') loadPatientApps();
    if(sectionId === 'painel-medico') loadDoctorSchedule();
    if(sectionId === 'historico-clinico') loadHistory();
    if(sectionId === 'gestao-cadastros') loadUsersTable();
    if(sectionId === 'controle-leitos') loadBedsGrid();
}

//4. LÓGICA DE NEGÓCIO (PACIENTE)
// Listener para Radio Button de Tipo de Consulta
document.addEventListener('change', e => {
    if(e.target.name === 'btnradio') document.getElementById('ag-tipo').value = e.target.value;
});

function handleNewAppointment(e) {
    e.preventDefault();
    const db = getDB();
    const user = JSON.parse(localStorage.getItem('SGHSS_SESSION'));
    
    db.appointments.push({
        id: generateID(),
        patientId: user.id,
        doctorId: 'u2', // Demo
        specialty: document.getElementById('ag-especialidade').value,
        date: document.getElementById('ag-data').value,
        time: document.getElementById('ag-hora').value,
        type: document.getElementById('ag-tipo').value,
        status: 'Agendado'
    });
    saveDB(db);
    alert('Agendamento realizado com sucesso!');
    navigateTo('meus-agendamentos');
}

function loadPatientApps() {
    const user = JSON.parse(localStorage.getItem('SGHSS_SESSION'));
    const apps = getDB().appointments.filter(a => a.patientId === user.id);
    const tbody = document.getElementById('lista-agendamentos-paciente');
    
    if(apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4 text-muted">Nenhuma consulta agendada.</td></tr>';
        return;
    }

    tbody.innerHTML = apps.map(app => `
        <tr>
            <td class="ps-4">
                <div class="fw-bold text-dark">${app.date.split('-').reverse().join('/')}</div>
                <small class="text-muted">${app.time}</small>
            </td>
            <td><span class="d-block text-dark fw-medium">${app.specialty}</span><small class="text-muted">${app.type}</small></td>
            <td><span class="badge bg-${app.status === 'Agendado' ? 'primary' : 'success'} bg-opacity-10 text-${app.status === 'Agendado' ? 'primary' : 'success'} border border-${app.status === 'Agendado' ? 'primary' : 'success'} border-opacity-25 rounded-pill px-3">${app.status}</span></td>
            <td class="text-end pe-4">
                ${app.type === 'Telemedicina' ? 
                `<button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm" onclick="startTelemedicina()"><i class="bi bi-camera-video-fill me-1"></i> Entrar</button>` : 
                `<button class="btn btn-sm btn-light border rounded-circle" disabled><i class="bi bi-geo-alt-fill"></i></button>`}
            </td>
        </tr>
    `).join('');
}

function loadHistory() {
    const user = JSON.parse(localStorage.getItem('SGHSS_SESSION'));
    const recs = getDB().records.filter(r => r.patientId === user.id);
    const container = document.getElementById('conteudo-historico');

    if(recs.length === 0) {
        container.innerHTML = '<div class="text-center py-5 text-muted"><i class="bi bi-folder2-open display-1 opacity-25"></i><p class="mt-2">Seu prontuário está vazio.</p></div>';
        return;
    }

    container.innerHTML = recs.map(r => `
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-primary m-0"><i class="bi bi-calendar-event me-2"></i>${r.date}</h6>
                <span class="badge bg-light text-dark border">Dr. Gregory House</span>
            </div>
            <div class="mb-3">
                <small class="text-uppercase text-muted fw-bold" style="font-size: 0.7rem;">Evolução</small>
                <p class="mt-1">${r.description}</p>
            </div>
            <div class="bg-body-tertiary p-3 rounded-3 border border-dashed">
                <small class="text-uppercase text-muted fw-bold" style="font-size: 0.7rem;"><i class="bi bi-prescription2 me-1"></i>Receita</small>
                <p class="m-0 fw-medium text-dark">${r.prescription}</p>
            </div>
        </div>
    `).join('');
}

//LÓGICA DE NEGÓCIO (MÉDICO)
function loadDoctorSchedule() {
    // Demo: mostra todos. Num real filtraria por doctorId
    const apps = getDB().appointments.filter(a => a.status === 'Agendado'); 
    const container = document.getElementById('lista-agenda-medico');

    if(apps.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">Sem pacientes na fila.</div>';
        return;
    }

    container.innerHTML = apps.map(app => `
        <div class="col-md-6 col-xl-4">
            <div class="card border-0 shadow-sm p-3 rounded-4 h-100">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 fw-bold" style="width:50px; height:50px; display:flex; align-items:center; justify-content:center;">${app.time}</div>
                        <div>
                            <h6 class="m-0 fw-bold">Paciente (ID: ${app.patientId.substr(0,4)})</h6>
                            <small class="text-muted">${app.type}</small>
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-2 mt-auto">
                    <button class="btn btn-primary w-100 rounded-pill" onclick="startAtendimento('${app.patientId}','${app.id}')">Atender</button>
                    ${app.type === 'Telemedicina' ? `<button class="btn btn-dark rounded-circle" onclick="startTelemedicina()"><i class="bi bi-camera-video-fill"></i></button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function startAtendimento(pid, aid) {
    document.getElementById('atend-paciente-id').value = pid;
    document.getElementById('atend-app-id').value = aid;
    document.getElementById('atend-id-display').innerText = aid.substr(0,4);
    navigateTo('atendimento');
}

function saveAtendimento(e) {
    e.preventDefault();
    const db = getDB();
    
    // Salva Prontuário
    db.records.push({
        id: generateID(),
        patientId: document.getElementById('atend-paciente-id').value,
        doctorId: JSON.parse(localStorage.getItem('SGHSS_SESSION')).id,
        date: new Date().toLocaleDateString('pt-BR'),
        description: document.getElementById('atend-descricao').value,
        prescription: document.getElementById('atend-receita').value
    });

    // Atualiza Status da Consulta
    const appId = document.getElementById('atend-app-id').value;
    const appIndex = db.appointments.findIndex(a => a.id === appId);
    if(appIndex >= 0) db.appointments[appIndex].status = 'Realizada';

    saveDB(db);
    alert('Atendimento finalizado com sucesso.');
    
    // Limpa form
    document.getElementById('atend-descricao').value = '';
    document.getElementById('atend-receita').value = '';
    
    navigateTo('painel-medico');
}

//LÓGICA DE NEGÓCIO (ADMIN)
function loadUsersTable() {
    const tbody = document.getElementById('tabela-usuarios');
    tbody.innerHTML = getDB().users.map(u => `
        <tr>
            <td class="ps-4 fw-medium">${u.name}</td>
            <td class="text-muted">${u.email}</td>
            <td><span class="badge bg-light text-dark border">${u.role}</span></td>
            <td><span class="badge bg-success bg-opacity-10 text-success">Ativo</span></td>
        </tr>
    `).join('');
}

function loadBedsGrid() {
    const grid = document.getElementById('grid-leitos');
    grid.innerHTML = getDB().internations.map(bed => `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="card text-center p-3 border-0 shadow-sm rounded-4 ${bed.status === 'Ocupado' ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10'}">
                <h4 class="m-0 fw-bold ${bed.status === 'Ocupado' ? 'text-danger' : 'text-success'}">${bed.room}</h4>
                <small class="text-muted d-block my-1">${bed.type}</small>
                <span class="badge ${bed.status === 'Ocupado' ? 'bg-danger' : 'bg-success'} rounded-pill">${bed.status}</span>
            </div>
        </div>
    `).join('');
}

//TELEMEDICINA (WEBRTC)
let localStream = null;
let callTimer = null;
let secCounter = 0;

async function startTelemedicina() {
    // Verifica Protocolo de Segurança
    if (window.location.protocol === 'file:') {
        alert("⚠️ ATENÇÃO: A câmera foi bloqueada pelo navegador.\n\nMotivo: Você abriu o arquivo direto (file://).\nSolução: Use a extensão 'Live Server' no VS Code.\n\nO sistema abrirá a tela de simulação sem a câmera local.");
    }

    // Mostra Overlay
    const tela = document.getElementById('tela-telemedicina');
    tela.classList.remove('d-none');
    tela.classList.add('d-block');

    try {
        // Tenta pegar mídia
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        const videoLocal = document.getElementById('video-local');
        videoLocal.srcObject = localStream;

        // Avisos de UI
        document.getElementById('camera-off-msg').classList.add('d-none');
    
    } catch (err) {
        console.warn("Sem acesso à câmera:", err);
        document.getElementById('camera-off-msg').classList.remove('d-none');
    }

    // Inicia Vídeo Remoto (Médico)
    const videoRemote = document.getElementById('video-remote');
    videoRemote.play().catch(e => console.log("Vídeo remoto não iniciado (autoplay policy/falta arquivo)."));
    videoRemote.volume = 0.5;

    // Inicia Cronômetro
    startCallTimer();
}

function endCall() {
    // Para Vídeos
    const videoRemote = document.getElementById('video-remote');
    videoRemote.pause();
    videoRemote.currentTime = 0;

    // Para Webcam
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    // Para Timer
    stopCallTimer();

    // Fecha Overlay
    const tela = document.getElementById('tela-telemedicina');
    tela.classList.remove('d-block');
    tela.classList.add('d-none');
}

// Controles
function toggleMic() {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    track.enabled = !track.enabled;
    const btn = document.getElementById('btn-mic');
    btn.innerHTML = track.enabled ? '<i class="bi bi-mic-fill fs-4"></i>' : '<i class="bi bi-mic-mute-fill fs-4"></i>';
    btn.classList.toggle('bg-danger', !track.enabled);
    btn.classList.toggle('glass-btn', track.enabled);
}

function toggleCam() {
    if (!localStream) return;
    const track = localStream.getVideoTracks()[0];
    track.enabled = !track.enabled;
    const btn = document.getElementById('btn-cam');
    btn.innerHTML = track.enabled ? '<i class="bi bi-camera-video-fill fs-4"></i>' : '<i class="bi bi-camera-video-off-fill fs-4"></i>';
    btn.classList.toggle('bg-danger', !track.enabled);
    btn.classList.toggle('glass-btn', track.enabled);
    
    const msg = document.getElementById('camera-off-msg');
    track.enabled ? msg.classList.add('d-none') : msg.classList.remove('d-none');
}

function startCallTimer() {
    const el = document.getElementById('call-timer');
    secCounter = 0;
    el.innerText = "00:00";
    if(callTimer) clearInterval(callTimer);
    callTimer = setInterval(() => {
        secCounter++;
        const m = Math.floor(secCounter/60).toString().padStart(2,'0');
        const s = (secCounter%60).toString().padStart(2,'0');
        el.innerText = `${m}:${s}`;
    }, 1000);
}

function stopCallTimer() {
    if(callTimer) clearInterval(callTimer);
}

// Boot
window.onload = function() {
    if(localStorage.getItem('SGHSS_SESSION')) initApp();
}