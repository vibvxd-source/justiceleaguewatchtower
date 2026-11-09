// --- 1. STATE & SUPABASE INITIALIZATION ---
let supabaseClient = null;
let currentAuthMode = 'login';
let currentRole = 'user'; // 'user' or 'admin'
let currentUser = null;

// Mock Data Postingan FansMed (Lokal & Supabase Sync Ready)
let fansmedPosts = [
    {
        id: 1,
        author: 'vibvxd@gmail.com',
        role: 'admin',
        title: 'Laporan Taktis: Evaluasi Kecepatan Speed Force The Flash',
        content: 'Hasil pemantauan satelit terbaru menunjukkan peningkatan energi Speed Force Barry Allen sebesar 14% saat melewati penghalang waktu. Tim analis Watchtower menyarankan koordinasi perlindungan garis waktu.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        createdAt: '09 Nov 2026, 00:15 WIB',
        likes: 12,
        likedBy: [],
        comments: [
            {
                id: 101,
                user: 'fan.gotham@gmail.com',
                text: 'Luar biasa Flash! Semoga tidak terjadi insiden Flashpoint lagi.',
                replies: [
                    { user: 'vibvxd@gmail.com', text: 'Sistem deteksi Flashpoint sudah aktif 24/7 di Watchtower!' }
                ]
            }
        ]
    }
];

// DATA 8 PAHLAWAN JUSTICE LEAGUE LENGKAP
const heroesData = [
    {
        id: 'batman',
        name: 'BATMAN',
        realName: 'Bruce Wayne',
        category: 'FOUNDER',
        title: 'The Dark Knight',
        image: 'batman.jpg',
        stats: { strength: 25, speed: 30, intelligence: 100, combat: 98 },
        powers: ['Detektif Terhebat', 'Ahli Bela Diri Master', 'Teknologi Tinggi (Bat-Tech)', 'Kekayaan Tak Terbatas', 'Ahli Strategi & Taktik Perang'],
        bio: 'Bruce Wayne mendedikasikan hidupnya untuk membasmi kejahatan di Gotham City setelah menyaksikan pembunuhan orang tuanya. Tanpa kekuatan super, ia mengandalkan kecerdasan jenius, latihan fisik ekstrem, dan teknologi.',
        battles: [
            {
                title: 'Pertarungan Psikologis di Arkham Asylum',
                enemy: 'Joker',
                description: 'Pertarungan mental dan fisik paling melelahkan saat Joker mengambil alih suaka Arkham dan menyandera petugas, menguji batas moralitas sang Kesatria Kegelapan.',
                location: 'Arkham Asylum, Gotham',
                outcome: 'Kemenangan telak Batman, Joker dikembalikan ke sel isolasi ketat.'
            },
            {
                title: 'Konfrontasi Taktis Knightmare / Armored Suit',
                enemy: 'Superman (Controlled)',
                description: 'Pertarungan kolosal menggunakan armor berlapis Kryptonite demi menghentikan pengaruh buruk alien kosmik terhadap Man of Steel.',
                location: 'Gotham Ruins',
                outcome: 'Garis waktu berhasil diamankan setelah kesadaran Superman pulih.'
            },
            {
                title: 'Konspirasi Court of Owls',
                enemy: 'The Talons',
                description: 'Menelusuri labirin bawah tanah rahasia Gotham untuk menghadapi pasukan pembunuh bayaran abadi yang mengendalikan kota dari bayang-bayang.',
                location: 'Undercity Gotham',
                outcome: 'Markas rahasia Court of Owls dihancurkan.'
            }
        ],
        enemies: [
            { name: 'Joker', image: 'https://images.unsplash.com/photo-1531256485856-f8b13d2a76f2?auto=format&fit=crop&w=300&q=80' },
            { name: 'Bane', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=300&q=80' },
            { name: 'Riddler', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80' },
            { name: 'Scarecrow', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80' }
        ]
    },
    {
        id: 'superman',
        name: 'SUPERMAN',
        realName: 'Clark Kent / Kal-El',
        category: 'FOUNDER',
        title: 'Man of Steel',
        image: 'superman.jpg',
        stats: { strength: 100, speed: 95, intelligence: 85, combat: 80 },
        powers: ['Fisiologi Kryptonian', 'Penerbangan', 'Heat Vision & X-Ray', 'Kekebalan Mutlak'],
        bio: 'Dikirim ke Bumi dari planet Krypton yang hancur, Kal-El dibesarkan di Kansas sebagai Clark Kent. Di bawah sinar matahari kuning Bumi, ia memperoleh kemampuan luar biasa.',
        battles: [
            {
                title: 'Penghancuran Metropolis',
                enemy: 'General Zod',
                description: 'Duel udara habis-habisan melawan jenderal sisa Krypton yang ingin mengubah Bumi menjadi planet asal mereka yang hancur.',
                location: 'Metropolis',
                outcome: 'Zod dikalahkan, Metropolis mulai dibangun kembali.'
            },
            {
                title: 'Hari Kematian Superman',
                enemy: 'Doomsday',
                description: 'Pertarungan brutal tanpa henti melawan monster purba genetika dari planet Krypton yang berujung pada gugurnya sang Man of Steel.',
                location: 'Doomsday Crater',
                outcome: 'Doomsday tewas, Superman kemudian bangkit kembali.'
            }
        ],
        enemies: [
            { name: 'Lex Luthor', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
            { name: 'General Zod', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
            { name: 'Doomsday', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
            { name: 'Brainiac', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80' }
        ]
    },
    {
        id: 'wonderwoman',
        name: 'WONDER WOMAN',
        realName: 'Diana Prince',
        category: 'FOUNDER',
        title: 'Amazonian Princess',
        image: 'wonder-woman.jpg',
        stats: { strength: 92, speed: 85, intelligence: 90, combat: 99 },
        powers: ['Kekuatan Dewa Olympus', 'Lasso of Truth', 'Gelang Defleksi', 'Taktik Perang Amazon'],
        bio: 'Putri Amazon dari Themyscira yang dikaruniai kekuatan oleh para Dewa Olympus. Diana bertindak sebagai pejuang paling tangguh yang memperjuangkan keadilan.',
        battles: [
            {
                title: 'Pertarungan Legendaris di No Man\'s Land',
                enemy: 'Ares (Dewa Perang)',
                description: 'Menghentikan manipulasi Dewa Perang Ares yang memanfaatkan konflik Perang Dunia I untuk menghancurkan umat manusia.',
                location: 'Eropa Tengah',
                outcome: 'Ares dikalahkan dan kedamaian dipulihkan.'
            },
            {
                title: 'Menahan Amukan Cheetah',
                enemy: 'Cheetah (Barbara Minerva)',
                description: 'Menghadapi mantan sahabatnya yang berubah menjadi monster akibat kutukan dewa kuno.',
                location: 'Washington D.C.',
                outcome: 'Kutukan Cheetah berhasil dinetralkan.'
            }
        ],
        enemies: [
            { name: 'Ares', image: 'https://images.unsplash.com/photo-1568870694358-005d53664d4b?auto=format&fit=crop&w=300&q=80' },
            { name: 'Cheetah', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80' },
            { name: 'Circe', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=300&q=80' }
        ]
    },
    {
        id: 'flash',
        name: 'THE FLASH',
        realName: 'Barry Allen',
        category: 'METAHUMAN',
        title: 'Scarlet Speedster',
        image: 'the-flash.jpg',
        stats: { strength: 60, speed: 100, intelligence: 90, combat: 70 },
        powers: ['Speed Force Connection', 'Kecepatan Cahaya', 'Perjalanan Waktu', 'Phasing Molekuler'],
        bio: 'Seorang ilmuwan forensik yang tersambar petir dan tersiram bahan kimia. Barry mampu berlari melebihi kecepatan cahaya.',
        battles: [
            {
                title: 'Insiden Flashpoint Paradox',
                enemy: 'Reverse-Flash',
                description: 'Barry berlari menembus waktu untuk menyelamatkan ibunya, yang memicu kekacauan garis waktu multidimensi.',
                location: 'Multiverse Alternate Timeline',
                outcome: 'Garis waktu berhasil direstorasi meskipun ada beberapa perubahan.'
            }
        ],
        enemies: [
            { name: 'Reverse-Flash', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80' },
            { name: 'Zoom', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80' }
        ]
    },
    {
        id: 'aquaman',
        name: 'AQUAMAN',
        realName: 'Arthur Curry',
        category: 'COSMIC',
        title: 'King of Atlantis',
        image: 'aquaman.jpg',
        stats: { strength: 88, speed: 75, intelligence: 75, combat: 85 },
        powers: ['Telepati Laut', 'Fisiologi Atlantis', 'Pengendalian Air', 'Trident of Atlan'],
        bio: 'Pewaris tahta Atlantis yang lahir dari hubungan manusia darat dan Ratu Atlantis. Arthur menguasai 70% wilayah Bumi.',
        battles: [
            {
                title: 'Perebutan Tahta Atlantis',
                enemy: 'Ocean Master (Orm)',
                description: 'Duel satu lawan satu di arena lava dasar laut untuk mencegah perang antara Atlantis dan dunia permukaan.',
                location: 'Ring of Fire, Atlantis',
                outcome: 'Arthur memenangkan duel dan dinobatkan sebagai Raja Atlantis.'
            }
        ],
        enemies: [
            { name: 'Black Manta', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80' },
            { name: 'Ocean Master', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=300&q=80' }
        ]
    },
    {
        id: 'cyborg',
        name: 'CYBORG',
        realName: 'Victor Stone',
        category: 'METAHUMAN',
        title: 'Techno-Organic Metahuman',
        image: 'cyborg.jpg',
        stats: { strength: 85, speed: 70, intelligence: 95, combat: 75 },
        powers: ['Integrasi Mother Box', 'Cybernetic Hacking', 'Boom Tube Teleportasi', 'Sound Cannon'],
        bio: 'Mantan atlet yang tubuhnya dibangun kembali menggunakan teknologi alien Mother Box.',
        battles: [
            {
                title: 'Peretasan Inti Server Grid',
                enemy: 'Grid (AI System)',
                description: 'Pertempuran siber di dalam jaringan digital global melawan kecerdasan buatan jahat.',
                location: 'Digital Cyberspace',
                outcome: 'Grid berhasil diisolasi dan dihancurkan.'
            }
        ],
        enemies: [
            { name: 'Grid', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80' }
        ]
    },
    {
        id: 'martian',
        name: 'MARTIAN MANHUNTER',
        realName: "J'onn J'onzz",
        category: 'COSMIC',
        title: 'The Last Martian',
        image: 'martian-manhunter.jpg',
        stats: { strength: 95, speed: 85, intelligence: 95, combat: 85 },
        powers: ['Shape-shifting', 'Telepati Master', 'Invisibility & Intangibility', 'Martian Vision'],
        bio: 'Survivor terakhir dari planet Mars Merah yang terdampar di Bumi.',
        battles: [
            {
                title: 'Perang Telepati di Mars Merah',
                enemy: 'Ma\'alefa\'ak',
                description: 'Pertarungan mental melawan saudaranya sendiri yang melepaskan wabah api telepati.',
                location: 'Mars (Flashback)',
                outcome: 'J\'onn selamat dan terdampar ke planet Bumi.'
            }
        ],
        enemies: [
            { name: 'Ma\'alefa\'ak', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' }
        ]
    },
    {
        id: 'greenlantern',
        name: 'GREEN LANTERN',
        realName: 'Hal Jordan',
        category: 'COSMIC',
        title: 'Emerald Knight',
        image: 'green-lantern.jpg',
        stats: { strength: 80, speed: 85, intelligence: 80, combat: 85 },
        powers: ['Green Power Ring', 'Konstruksi Energi', 'Penerbangan Kosmik', 'Perisai Forcefield'],
        bio: 'Mantan pilot penguji tanpa rasa takut yang terpilih oleh Power Ring alien Abin Sur.',
        battles: [
            {
                title: 'Perang Kosmik Sinestro Corps',
                enemy: 'Sinestro',
                description: 'Pertempuran antar galaksi memanfaatkan energi kehendak hijau melawan korps energi ketakutan kuning.',
                location: 'Sector 2814 Outer Space',
                outcome: 'Sinestro berhasil dikalahkan dan ditahan di Oa.'
            }
        ],
        enemies: [
            { name: 'Sinestro', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=300&q=80' }
        ]
    }
];

// --- 2. AUTHENTICATION & ROLE SWITCHING ---
function setAuthRole(role) {
    currentRole = role;
}

function initSupabase() {
    const savedUrl = localStorage.getItem('jl_supabase_url');
    const savedKey = localStorage.getItem('jl_supabase_key');
    if (savedUrl && savedKey && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(savedUrl, savedKey);
        } catch(e) { console.error(e); }
    }
}

// Fungsi untuk mencatat log login pengunjung ke database Supabase
async function logVisitorLogin(email, role) {
    if (!supabaseClient) {
        console.log("Mode Demo: Login dicatat secara lokal untuk", email);
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('user_logs')
            .insert([{ user_email: email, role: role }]);

        if (error) {
            console.error("Gagal mencatat log login:", error.message);
        } else {
            console.log("Log login berhasil direkam ke database.");
        }
    } catch (err) {
        console.error("Terjadi kesalahan sistem saat mencatat log:", err);
    }
}

function switchAuthTab(mode) {
    currentAuthMode = mode;
    const loginBtn = document.getElementById('tabLoginBtn');
    const regBtn = document.getElementById('tabRegisterBtn');
    const submitBtn = document.getElementById('authSubmitBtn');
    if (mode === 'login') {
        loginBtn.className = "flex-1 py-3 text-center border-b-2 border-yellow-500 text-yellow-500 font-bold transition-all";
        regBtn.className = "flex-1 py-3 text-center border-b-2 border-transparent text-slate-400 transition-all";
        submitBtn.querySelector('span').innerText = "AKSES SYSTEM";
    } else {
        regBtn.className = "flex-1 py-3 text-center border-b-2 border-yellow-500 text-yellow-500 font-bold transition-all";
        loginBtn.className = "flex-1 py-3 text-center border-b-2 border-transparent text-slate-400 transition-all";
        submitBtn.querySelector('span').innerText = "DAFTAR CADRE BARU";
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const alertBox = document.getElementById('authAlert');
    const alertText = document.getElementById('authAlertText');

    if(alertBox) alertBox.classList.add('hidden');

    if (supabaseClient) {
        try {
            let result, error;
            if (currentAuthMode === 'login') {
                const res = await supabaseClient.auth.signInWithPassword({ email, password });
                result = res.data;
                error = res.error;
            } else {
                // REGISTRASI (Mencegah error rate limit dengan handling yang aman)
                const res = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: { data: { role: currentRole } }
                });
                result = res.data;
                error = res.error;
            }

            if (error) throw error;

            if (currentAuthMode === 'register') {
                alert("Registrasi Berhasil! Silakan masuk melalui tab LOGIN.");
                switchAuthTab('login');
                return;
            }

            let userRole = currentRole;
            
            // Paksa akun utama Anda 'vibvxd@gmail.com' selalu menjadi admin
            if (email === 'vibvxd@gmail.com') {
                userRole = 'admin';
            } else {
                const { data: profile } = await supabaseClient
                    .from('profiles')
                    .select('role')
                    .eq('id', result.user.id)
                    .single();

                if (profile && profile.role) {
                    userRole = profile.role;
                }
            }

            currentUser = { 
                id: result.user.id,
                email: result.user.email, 
                role: userRole 
            };
            
            await logVisitorLogin(currentUser.email, userRole);
            showDashboard();
        } catch (err) {
            console.error("Auth Error:", err);
            let errMsg = err.message || "Gagal Melakukan Otentikasi";
            if (errMsg.includes("email rate limit")) {
                errMsg = "Batas pengiriman email terlampaui. Nonaktifkan 'Confirm email' di Dashboard Supabase Auth.";
            } else if (errMsg.includes("Invalid login credentials")) {
                errMsg = "Email atau password salah / belum terdaftar.";
            }
            if(alertText) alertText.innerText = errMsg;
            if(alertBox) alertBox.classList.remove('hidden');
        }
    } else {
        // Mode Demo Offline jika Supabase belum dikonfigurasi di web
        currentUser = { email: email, role: email === 'vibvxd@gmail.com' ? 'admin' : currentRole };
        await logVisitorLogin(currentUser.email, currentUser.role);
        showDashboard();
    }
}

function loginDemoMode(role) {
    currentRole = role;
    currentUser = { 
        email: role === 'admin' ? 'vibvxd@gmail.com' : 'guest.fan@justiceleague.org', 
        role: role 
    };
    
    logVisitorLogin(currentUser.email, role);
    showDashboard();
}

function handleLogout() {
    currentUser = null;
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('heroDetailPage').classList.add('hidden');
    document.getElementById('battleDetailPage').classList.add('hidden');
    document.getElementById('fansmedSection').classList.add('hidden');
    document.getElementById('authSection').classList.remove('hidden');
}

function showDashboard() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('heroDetailPage').classList.add('hidden');
    document.getElementById('battleDetailPage').classList.add('hidden');
    document.getElementById('fansmedSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');

    const emailDisplay = document.getElementById('userDisplayEmail');
    const roleBadge = document.getElementById('roleBadge');
    if (emailDisplay) emailDisplay.innerText = currentUser.email;
    if (roleBadge) {
        roleBadge.innerText = currentUser.role.toUpperCase();
        roleBadge.className = currentUser.role === 'admin' 
            ? "px-2 py-0.5 rounded text-[10px] font-bold font-orbitron bg-red-950 text-red-300 border border-red-700" 
            : "px-2 py-0.5 rounded text-[10px] font-bold font-orbitron bg-emerald-950 text-emerald-300 border border-emerald-700";
    }

    renderHeroes(heroesData);
    updateAdminUI(); // Mengatur kemunculan tombol Log Pengunjung khusus Admin
    window.scrollTo(0, 0);
}

// --- 3. DASHBOARD & HERO PAGE RENDER ---
function renderHeroes(heroes) {
    const grid = document.getElementById('heroesGrid');
    if(!grid) return;
    grid.innerHTML = '';
    heroes.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'jl-card rounded-xl overflow-hidden flex flex-col justify-between group cursor-pointer';
        card.onclick = () => showHeroDetailPage(hero.id);
        card.innerHTML = `
            <div class="relative h-56 overflow-hidden bg-slate-950">
                <img src="${hero.image}" alt="${hero.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                <span class="absolute top-3 right-3 text-[10px] font-orbitron px-2.5 py-1 bg-slate-900/90 border border-yellow-500/40 text-yellow-400 rounded">${hero.category}</span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <span class="text-xs font-mono text-yellow-500/80 uppercase tracking-widest">${hero.title}</span>
                    <h3 class="text-xl font-black font-orbitron text-white mb-1">${hero.name}</h3>
                    <p class="text-xs text-slate-400 font-mono mb-4">Identitas: ${hero.realName}</p>
                </div>
                <button class="w-full py-2 bg-slate-900 border border-slate-700 hover:border-yellow-500 text-xs font-orbitron text-yellow-400 rounded transition-colors">BUKA HALAMAN ARSIP</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterHeroes() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const role = document.getElementById('roleFilter').value;

    const filtered = heroesData.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(search) || 
                              h.realName.toLowerCase().includes(search) || 
                              h.powers.some(p => p.toLowerCase().includes(search));
        const matchesRole = (role === 'ALL') || (h.category === role);
        return matchesSearch && matchesRole;
    });

    renderHeroes(filtered);
}

function showHeroDetailPage(heroId) {
    const hero = heroesData.find(h => h.id === heroId);
    if (!hero) return;

    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('battleDetailPage').classList.add('hidden');
    document.getElementById('heroDetailPage').classList.remove('hidden');

    const container = document.getElementById('heroDetailContainer');
    container.innerHTML = `
        <button onclick="showDashboard()" class="mb-8 px-4 py-2 bg-slate-900 border border-yellow-500/50 hover:border-yellow-500 text-yellow-400 rounded-lg text-xs font-orbitron font-bold flex items-center gap-2">
            <i class="fa-solid fa-arrow-left"></i> KEMBALI KE WATCHTOWER
        </button>

        <div class="jl-card rounded-2xl p-6 md:p-8 mb-8 border-2 border-yellow-500/40">
            <div class="flex flex-col lg:flex-row gap-8 items-start">
                <img src="${hero.image}" alt="${hero.name}" class="w-full lg:w-1/3 h-80 object-cover rounded-xl border-2 border-yellow-500">
                <div class="flex-1">
                    <span class="text-xs font-mono text-yellow-500 uppercase">${hero.category} • ${hero.title}</span>
                    <h1 class="text-4xl font-black font-orbitron text-white mb-2">${hero.name}</h1>
                    <p class="text-sm text-slate-400 font-mono mb-4">Identitas: <span class="text-white">${hero.realName}</span></p>
                    <p class="text-slate-300 text-sm leading-relaxed mb-6">${hero.bio}</p>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div><span class="text-[10px] font-mono text-slate-400">KEKUATAN</span><div class="text-lg font-bold font-orbitron text-yellow-400">${hero.stats.strength}/100</div></div>
                        <div><span class="text-[10px] font-mono text-slate-400">KECEPATAN</span><div class="text-lg font-bold font-orbitron text-yellow-400">${hero.stats.speed}/100</div></div>
                        <div><span class="text-[10px] font-mono text-slate-400">INTELIJEN</span><div class="text-lg font-bold font-orbitron text-yellow-400">${hero.stats.intelligence}/100</div></div>
                        <div><span class="text-[10px] font-mono text-slate-400">TEMPUR</span><div class="text-lg font-bold font-orbitron text-yellow-400">${hero.stats.combat}/100</div></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="jl-card p-6 rounded-xl">
                <h3 class="text-base font-orbitron font-bold text-yellow-500 mb-4"><i class="fa-solid fa-bolt text-yellow-400"></i> Kemampuan Utama</h3>
                <ul class="space-y-2 font-mono text-xs text-slate-300">
                    ${hero.powers.map(p => `<li class="bg-slate-900/60 p-2.5 rounded border border-slate-800">⚡ ${p}</li>`).join('')}
                </ul>
            </div>

            <!-- RIWAYAT PERTARUNGAN -->
            <div class="jl-card p-6 rounded-xl">
                <h3 class="text-base font-orbitron font-bold text-yellow-500 mb-4"><i class="fa-solid fa-fire text-red-500"></i> Riwayat Pertarungan (Klik)</h3>
                <div class="space-y-3 font-mono text-xs">
                    ${hero.battles.map((b, index) => `
                        <div onclick="showBattleDetailPage('${hero.id}', ${index})" class="bg-slate-950/80 hover:bg-slate-900 p-3 rounded-lg border border-slate-800 hover:border-yellow-500 cursor-pointer transition-all">
                            <div class="text-yellow-400 font-bold mb-1"><i class="fa-solid fa-crosshairs text-red-400"></i> ${b.title}</div>
                            <div class="text-slate-400 text-[11px]">Musuh: <span class="text-red-300">${b.enemy}</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- MUSUH UTAMA -->
            <div class="jl-card p-6 rounded-xl">
                <h3 class="text-base font-orbitron font-bold text-yellow-500 mb-4"><i class="fa-solid fa-skull text-red-400"></i> Musuh Utama</h3>
                <div class="grid grid-cols-2 gap-3">
                    ${hero.enemies.map(e => `
                        <div class="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden text-center">
                            <img src="${e.image}" alt="${e.name}" class="w-full h-24 object-cover opacity-80">
                            <div class="p-2 text-[11px] font-orbitron font-bold text-red-300">${e.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

function showBattleDetailPage(heroId, battleIndex) {
    const hero = heroesData.find(h => h.id === heroId);
    if (!hero || !hero.battles[battleIndex]) return;
    const battle = hero.battles[battleIndex];

    document.getElementById('heroDetailPage').classList.add('hidden');
    document.getElementById('battleDetailPage').classList.remove('hidden');

    const container = document.getElementById('battleDetailContainer');
    container.innerHTML = `
        <button onclick="showHeroDetailPage('${hero.id}')" class="mb-8 px-4 py-2 bg-slate-900 border border-yellow-500/50 hover:border-yellow-500 text-yellow-400 rounded-lg text-xs font-orbitron font-bold flex items-center gap-2">
            <i class="fa-solid fa-arrow-left"></i> KEMBALI KE ARSIP ${hero.name}
        </button>

        <div class="jl-card rounded-2xl p-8 border-2 border-red-500/50 space-y-6">
            <div class="border-b border-slate-800 pb-4">
                <span class="text-xs font-mono text-red-400 uppercase tracking-widest">ARSIP PERTEMPURAN TAKTIS • WATCHTOWER</span>
                <h1 class="text-3xl md:text-5xl font-black font-orbitron text-white mt-1">${battle.title}</h1>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                <div class="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div class="text-yellow-400 font-orbitron font-bold uppercase">Detail Konflik:</div>
                    <p class="text-slate-300 leading-relaxed">${battle.description}</p>
                </div>
                <div class="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
                    <div>
                        <span class="text-slate-500 text-xs">PAHLAWAN TERLIBAT:</span>
                        <div class="text-white font-bold font-orbitron">${hero.name} (${hero.realName})</div>
                    </div>
                    <div>
                        <span class="text-slate-500 text-xs">MUSUH UTAMA:</span>
                        <div class="text-red-400 font-bold font-orbitron text-lg">${battle.enemy}</div>
                    </div>
                    <div>
                        <span class="text-slate-500 text-xs">LOKASI PERTEMPURAN:</span>
                        <div class="text-slate-200 font-bold">${battle.location}</div>
                    </div>
                    <div>
                        <span class="text-slate-500 text-xs">HASIL AKHIR:</span>
                        <div class="text-emerald-400 font-bold">${battle.outcome}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

// --- 4. FANSMED PORTAL LOGIC & MODERATION ---
function showFansMedPage() {
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('fansmedSection').classList.remove('hidden');

    const adminBox = document.getElementById('adminCreatePostBox');
    if (currentUser && currentUser.role === 'admin') {
        adminBox.classList.remove('hidden');
    } else {
        adminBox.classList.add('hidden');
    }

    renderFansmedPosts();
    window.scrollTo(0, 0);
}

function handleCreatePost(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;

    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImageUrl').value || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80';

    const newPost = {
        id: Date.now(),
        author: currentUser.email,
        role: 'admin',
        title: title,
        content: content,
        image: image,
        createdAt: new Date().toLocaleString('id-ID'),
        likes: 0,
        likedBy: [],
        comments: []
    };

    fansmedPosts.unshift(newPost);
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postImageUrl').value = '';

    renderFansmedPosts();
}

function deletePost(postId) {
    if (!currentUser || currentUser.role !== 'admin') return;
    if (confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
        fansmedPosts = fansmedPosts.filter(p => p.id !== postId);
        renderFansmedPosts();
    }
}

function deleteComment(postId, commentId) {
    if (!currentUser || currentUser.role !== 'admin') return;
    if (confirm("Hapus komentar ini?")) {
        const post = fansmedPosts.find(p => p.id === postId);
        if (post) {
            post.comments = post.comments.filter(c => c.id !== commentId);
            renderFansmedPosts();
        }
    }
}

function toggleLike(postId) {
    const post = fansmedPosts.find(p => p.id === postId);
    if (!post || !currentUser) return;

    const userEmail = currentUser.email;
    const index = post.likedBy.indexOf(userEmail);

    if (index === -1) {
        post.likedBy.push(userEmail);
        post.likes++;
    } else {
        post.likedBy.splice(index, 1);
        post.likes--;
    }

    renderFansmedPosts();
}

function addComment(postId) {
    const input = document.getElementById(`commentInput-${postId}`);
    const text = input.value.trim();
    if (!text || !currentUser) return;

    const post = fansmedPosts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            id: Date.now(),
            user: currentUser.email,
            text: text,
            replies: []
        });
        input.value = '';
        renderFansmedPosts();
    }
}

function addReply(postId, commentId) {
    const input = document.getElementById(`replyInput-${commentId}`);
    const text = input.value.trim();
    if (!text || !currentUser) return;

    const post = fansmedPosts.find(p => p.id === postId);
    if (post) {
        const comment = post.comments.find(c => c.id === commentId);
        if (comment) {
            comment.replies.push({
                user: currentUser.email,
                text: text
            });
            input.value = '';
            renderFansmedPosts();
        }
    }
}

function renderFansmedPosts() {
    const container = document.getElementById('fansmedPostsFeed');
    if (!container) return;
    container.innerHTML = '';

    fansmedPosts.forEach(post => {
        const isLiked = currentUser && post.likedBy.includes(currentUser.email);
        const isAdmin = currentUser && currentUser.role === 'admin';
        const postCard = document.createElement('div');
        postCard.className = 'jl-card rounded-2xl p-6 border border-slate-800 space-y-4';

        postCard.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-400 font-bold text-xs">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <div>
                        <div class="text-xs font-bold font-orbitron text-white flex items-center gap-2">
                            <span>${post.author}</span>
                            <span class="px-2 py-0.2 bg-red-950 border border-red-700 text-red-300 text-[9px] rounded">ADMIN</span>
                        </div>
                        <div class="text-[10px] text-slate-500 font-mono">${post.createdAt}</div>
                    </div>
                </div>
                ${isAdmin ? `
                    <button onclick="deletePost(${post.id})" class="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 text-[10px] font-orbitron rounded flex items-center gap-1.5 transition-all">
                        <i class="fa-solid fa-trash"></i> Hapus Post
                    </button>
                ` : ''}
            </div>

            <div>
                <h3 class="text-xl font-bold font-orbitron text-yellow-400 mb-2">${post.title}</h3>
                <p class="text-slate-300 text-xs font-sans leading-relaxed mb-4">${post.content}</p>
                ${post.image ? `<img src="${post.image}" class="w-full h-72 object-cover rounded-xl border border-slate-800 mb-4">` : ''}
            </div>

            <div class="flex items-center gap-6 border-t border-b border-slate-800/80 py-2 text-xs font-mono">
                <button onclick="toggleLike(${post.id})" class="flex items-center gap-2 ${isLiked ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-red-400'} transition-colors">
                    <i class="fa-solid fa-heart"></i>
                    <span>${post.likes} Likes</span>
                </button>
                <span class="text-slate-400 flex items-center gap-2">
                    <i class="fa-solid fa-comment"></i> ${post.comments.length} Komentar
                </span>
            </div>

            <div class="space-y-4 pt-2">
                <div class="flex gap-2">
                    <input type="text" id="commentInput-${post.id}" placeholder="Tulis komentar kamu..." class="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500">
                    <button onclick="addComment(${post.id})" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-orbitron font-bold text-xs rounded-lg">Kirim</button>
                </div>

                <div class="space-y-3">
                    ${post.comments.map(c => `
                        <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs font-mono">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-blue-400">${c.user}</span>
                                ${isAdmin ? `
                                    <button onclick="deleteComment(${post.id}, ${c.id})" class="text-red-400 hover:text-red-300 text-[10px]" title="Hapus Komentar">
                                        <i class="fa-solid fa-xmark"></i> Hapus
                                    </button>
                                ` : ''}
                            </div>
                            <p class="text-slate-300">${c.text}</p>

                            <div class="pl-4 border-l-2 border-slate-700 space-y-1.5 mt-2">
                                ${c.replies.map(r => `
                                    <div class="bg-slate-950 p-2 rounded text-[11px]">
                                        <span class="font-bold text-yellow-500">${r.user}:</span>
                                        <span class="text-slate-300">${r.text}</span>
                                    </div>
                                `).join('')}

                                <div class="flex gap-2 mt-2">
                                    <input type="text" id="replyInput-${c.id}" placeholder="Balas komentar..." class="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-[11px] text-white">
                                    <button onclick="addReply(${post.id}, ${c.id})" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-orbitron text-[10px] rounded">Balas</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.appendChild(postCard);
    });
}

// --- 5. ADMIN LOGS MODAL LOGIC ---
function updateAdminUI() {
    const logsBtn = document.getElementById('viewLogsBtn');
    if (logsBtn) {
        if (currentUser && currentUser.role === 'admin') {
            logsBtn.classList.remove('hidden');
        } else {
            logsBtn.classList.add('hidden');
        }
    }
}

async function fetchVisitorLogs() {
    const tableBody = document.getElementById('visitorLogsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-500">Memuat data log...</td></tr>`;

    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('user_logs')
                .select('*')
                .order('login_at', { ascending: false });

            if (error) throw error;
            renderLogsTable(data);
        } catch (err) {
            console.error("Gagal mengambil data log:", err.message);
            tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-400">Gagal memuat log dari Supabase.</td></tr>`;
        }
    } else {
        const dummyLogs = [
            { user_email: currentUser ? currentUser.email : 'vibvxd@gmail.com', role: currentUser ? currentUser.role : 'admin', login_at: new Date().toISOString() },
            { user_email: 'guest.fan@justiceleague.org', role: 'user', login_at: new Date(Date.now() - 3600000).toISOString() }
        ];
        renderLogsTable(dummyLogs);
    }
}

function renderLogsTable(logs) {
    const tableBody = document.getElementById('visitorLogsTableBody');
    if (!tableBody) return;

    if (!logs || logs.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-500">Belum ada riwayat login.</td></tr>`;
        return;
    }

    tableBody.innerHTML = '';
    logs.forEach((log, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-900/50 transition-colors';
        
        const dateFormatted = new Date(log.login_at).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const isLogAdmin = log.role === 'admin';

        row.innerHTML = `
            <td class="p-3 text-slate-500">${index + 1}</td>
            <td class="p-3 font-bold ${isLogAdmin ? 'text-red-400' : 'text-blue-400'}">${log.user_email}</td>
            <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isLogAdmin ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'}">
                    ${log.role.toUpperCase()}
                </span>
            </td>
            <td class="p-3 text-slate-400">${dateFormatted} WIB</td>
        `;
        tableBody.appendChild(row);
    });
}

function showLogsModal() {
    const modal = document.getElementById('logsModal');
    if (modal) {
        modal.classList.remove('hidden');
        fetchVisitorLogs();
    }
}

function closeLogsModal() {
    const modal = document.getElementById('logsModal');
    if (modal) modal.classList.add('hidden');
}

// --- 6. SUPABASE CONFIGURATION ---
function toggleSupabaseConfig() {
    const box = document.getElementById('supabaseConfigBox');
    if(box) box.classList.toggle('hidden');
}

function saveSupabaseConfig() {
    const url = document.getElementById('cfgSupabaseUrl').value.trim();
    const key = document.getElementById('cfgSupabaseKey').value.trim();
    if (url && key) {
        localStorage.setItem('jl_supabase_url', url);
        localStorage.setItem('jl_supabase_key', key);
        initSupabase();
        alert("Konfigurasi Supabase Tersimpan!");
    } else {
        alert("Harap isi Credentials Supabase.");
    }
}

window.addEventListener('DOMContentLoaded', () => { initSupabase(); });