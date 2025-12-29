// ==========================================
// KULLANICI YÖNETİM SİSTEMİ (localStorage)
// ==========================================

let currentUser = null; // Aktif kullanıcı

// Tüm kurslar listesi
const allCourses = [
    { name: 'Web Geliştirme Masterclass', icon: '💻', desc: 'HTML, CSS, JavaScript ve modern framework\'lerle profesyonel web siteleri geliştirin.' },
    { name: 'UI/UX Tasarım Temelleri', icon: '🎨', desc: 'Kullanıcı deneyimi odaklı modern arayüzler tasarlamayı öğrenin.' },
    { name: 'Veri Bilimi & Analitik', icon: '📊', desc: 'Python ile veri analizi, görselleştirme ve makine öğrenimi tekniklerini keşfedin.' },
    { name: 'Mobil Uygulama Geliştirme', icon: '📱', desc: 'React Native ile iOS ve Android için cross-platform uygulamalar oluşturun.' },
    { name: 'Yapay Zeka ve Deep Learning', icon: '🤖', desc: 'TensorFlow ve PyTorch ile yapay zeka modelleri geliştirmeyi öğrenin.' },
    { name: 'Siber Güvenlik Temelleri', icon: '🔒', desc: 'Ağ güvenliği, ethical hacking ve güvenlik testleri konularında uzmanlaşın.' }
];

// Sayfa yüklendiğinde oturum kontrolü
window.onload = function() {
    checkSession();
    handleScroll();
    initScrollAnimations();
}

// Scroll animasyonları için intersection observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Animasyon eklenecek elementler
    document.querySelectorAll('.course-card, .feature-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Scroll event listener ekle
window.addEventListener('scroll', handleScroll);

// Scroll olayını yönet - header'ı şeffaftan opak'a geçir
function handleScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Oturum kontrolü - kullanıcı daha önce giriş yapmış mı?
function checkSession() {
    try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUIAfterLogin();
        }
    } catch (error) {
        console.error('Oturum yükleme hatası:', error);
        localStorage.removeItem('currentUser');
    }
}

// Kayıt Olma İşlemi
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Validasyonlar
    if (name.length < 3) {
        alert('❌ İsim en az 3 karakter olmalıdır!');
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        alert('❌ Geçerli bir e-posta adresi girin!');
        return;
    }
    
    if (username.length < 3) {
        alert('❌ Kullanıcı adı en az 3 karakter olmalıdır!');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Şifre en az 6 karakter olmalıdır!');
        return;
    }
    
    // Kullanıcı adının daha önce alınıp alınmadığını kontrol et
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
        alert('Bu kullanıcı adı veya e-posta zaten kayıtlı! Lütfen başka bir tane deneyin.');
        return;
    }
    
    // Yeni kullanıcı oluştur
    const newUser = {
        name: name,
        email: email,
        username: username,
        password: password,
        registeredAt: new Date().toISOString(),
        courses: [] // Kullanıcının aldığı kurslar
    };
    
    // Kullanıcıları listeye ekle ve kaydet
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Otomatik giriş yap
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // UI'ı güncelle
    updateUIAfterLogin();
    closeModal('signupModal');
    
    alert('🎉 Hoş geldin ' + name + '! Hesabın başarıyla oluşturuldu.');
    
    // Formu temizle
    e.target.reset();
}

// Giriş Yapma İşlemi
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Kayıtlı kullanıcıları kontrol et
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert('❌ Kullanıcı adı veya şifre hatalı!');
        return;
    }
    
    // Başarılı giriş
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateUIAfterLogin();
    closeModal('loginModal');
    
    alert('✅ Hoş geldin ' + user.name + '!');
    
    // Formu temizle
    e.target.reset();
}

// Giriş sonrası UI güncellemesi
function updateUIAfterLogin() {
    document.getElementById('authGroup').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    
    // Kullanıcı adını ve avatarı güncelle
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('userWelcome').textContent = 'Hoş geldin, ' + currentUser.name.split(' ')[0] + '!';
}

// Çıkış Yapma
function logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.removeItem('currentUser');
        currentUser = null;
        
        // UI'ı eski haline getir
        document.getElementById('authGroup').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
        
        closeModal('profileModal'); // Profil modalı varsa kapat
        alert('Başarıyla çıkış yaptınız!');
    }
}

// ===========================================
// PROFİL MODAL FONKSİYONLARI
// ===========================================

// Profil modalını aç ve verileri doldur
function openProfileModal() {
    if (!currentUser) return;
    
    // Avatar
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('profileAvatarLarge').textContent = initials;
    
    // Temel bilgiler
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileUsername').textContent = currentUser.username;
    
    // Üyelik tarihi
    const joinDate = new Date(currentUser.registeredAt);
    document.getElementById('profileJoinDate').textContent = joinDate.toLocaleDateString('tr-TR');
    
    // Kurs sayısı
    document.getElementById('profileCourseCount').textContent = currentUser.courses.length;
    
    // Kurs listesi
    const coursesList = document.getElementById('profileCoursesList');
    if (currentUser.courses.length === 0) {
        coursesList.innerHTML = '<div class="empty-state">📚 Henüz hiç kurs almadınız.<br><small>Hemen keşfetmeye başlayın!</small></div>';
    } else {
        coursesList.innerHTML = '<ul class="course-list">' + 
             currentUser.courses.map(course => `<li class="course-list-item">✅ ${course}</li>`).join('') + 
             '</ul>';
    }
    
    openModal('profileModal');
}

// ===========================================
// ARAMA FONKSİYONU
// ===========================================

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (searchTerm.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    // Kursları filtrele
    const filteredCourses = allCourses.filter(course => 
        course.name.toLowerCase().includes(searchTerm) || 
        course.desc.toLowerCase().includes(searchTerm)
    );
    
    if (filteredCourses.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">🔍 Aradığınız kurs bulunamadı.</div>';
    } else {
        resultsContainer.innerHTML = filteredCourses.map(course => `
            <div class="search-result-item" onclick="checkCourseAccess('${course.name}'); document.getElementById('searchResults').style.display='none'; document.getElementById('searchInput').value='';">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5rem;">${course.icon}</span>
                    <div style="flex: 1;">
                        <strong>${course.name}</strong>
                        <div style="font-size: 0.85rem; color: #6b7280;">${course.desc.substring(0, 60)}...</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    resultsContainer.style.display = 'block';
}

// Arama dışına tıklayınca sonuçları kapat
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-bar')) {
        document.getElementById('searchResults').style.display = 'none';
    }
});

// ===========================================
// NEWSLETTER FONKSİYONU
// ===========================================

function handleNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    
    // Aboneleri kaydet
    let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    
    if (subscribers.includes(email)) {
        alert('⚠️ Bu e-posta adresi zaten bültenimize kayıtlı!');
        return;
    }
    
    subscribers.push(email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    
    alert('🎉 Bültene başarıyla abone oldunuz!\n\nEn yeni içeriklerden haberdar olacaksınız.');
    e.target.reset();
}

// ===========================================
// DİĞER YARDIMCI FONKSİYONLAR
// ===========================================

// Mobile menü toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    navLinks.classList.toggle('active');
    
    // İkon değiştirme
    if (navLinks.classList.contains('active')) {
        menuToggle.innerHTML = '✕';
    } else {
        menuToggle.innerHTML = '☰';
    }
}

// Menü linklerine tıklanınca mobil menüyü kapat
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '☰';
            }
        });
    });
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Daha fazla yorum göster
function loadMoreTestimonials() {
    const moreTestimonials = document.getElementById('moreTestimonials');
    const loadMoreBtn = document.getElementById('loadMoreTestimonials');
    const hideMoreBtn = document.getElementById('hideMoreTestimonials');
    
    moreTestimonials.style.display = 'grid';
    loadMoreBtn.style.display = 'none';
    hideMoreBtn.style.display = 'inline-block';
    
    // Yumuşak kaydırma
    setTimeout(() => {
        moreTestimonials.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Ek yorumları gizle
function hideMoreTestimonials() {
    const moreTestimonials = document.getElementById('moreTestimonials');
    const loadMoreBtn = document.getElementById('loadMoreTestimonials');
    const hideMoreBtn = document.getElementById('hideMoreTestimonials');
    
    moreTestimonials.style.display = 'none';
    loadMoreBtn.style.display = 'inline-block';
    hideMoreBtn.style.display = 'none';
    
    // Butonlara yumuşak kaydırma
    loadMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===========================================
// ÖZELLİK DETAY FONKSİYONU
// ===========================================

function openFeatureDetail(featureType) {
    const features = {
        expert: {
            icon: '🎓',
            title: 'Uzman Eğitmenler',
            content: `
                <p>SkillUp'ta sektörün en deneyimli ve başarılı isimleriyle tanışın!</p>
                <ul class="feature-detail-list">
                    <li><strong>10+ yıl deneyimli</strong> eğitmenler</li>
                    <li>Google, Microsoft, Meta gibi şirketlerde <strong>çalışmış profesyoneller</strong></li>
                    <li><strong>Gerçek dünya projeleri</strong> ve case study'ler</li>
                    <li>Birebir <strong>mentörlük</strong> imkanı</li>
                    <li>Canlı Q&A seansları ve <strong>interaktif dersler</strong></li>
                </ul>
                <p>Eğitmenlerimiz sadece teoriyi değil, <strong>güncel sektör bilgilerini</strong> de paylaşır!</p>
            `
        },
        flexible: {
            icon: '⏰',
            title: 'Esnek Öğrenme',
            content: `
                <p>Öğrenmeyi hayatınıza siz uydurun, hayatınızı öğrenmeye değil!</p>
                <ul class="feature-detail-list">
                    <li><strong>7/24 erişim</strong> - İstediğiniz zaman, istediğiniz yerden</li>
                    <li><strong>Mobil uyumlu</strong> - Telefon, tablet, bilgisayar</li>
                    <li><strong>İndirilebilir içerikler</strong> - Çevrimdışı öğrenme</li>
                    <li><strong>Kendi hızınızda</strong> ilerleyin - Acele yok!</li>
                    <li><strong>Duraklatma & Devam</strong> - Kaldığınız yerden devam edin</li>
                </ul>
                <p>Sabah kahvesiyle, öğle arasında veya gece yarısı - <strong>sizin seçiminiz!</strong></p>
            `
        },
        certificate: {
            icon: '📜',
            title: 'Sertifika Programı',
            content: `
                <p>Kursu tamamladığınızda profesyonel kariyerinize değer katacak sertifikalar kazanın!</p>
                <ul class="feature-detail-list">
                    <li><strong>Blockchain doğrulama</strong> - Sahtecilik önlenir</li>
                    <li><strong>LinkedIn paylaşımı</strong> - Tek tıkla profilde göster</li>
                    <li><strong>PDF ve dijital format</strong> - İndir veya paylaş</li>
                    <li><strong>İşveren onaylı</strong> - Sektörde kabul görür</li>
                    <li><strong>QR kod doğrulama</strong> - Hızlı erişim</li>
                </ul>
                <p>Sertifikalarınız, <strong>gerçek yeteneklerinizin kanıtı</strong> olacak!</p>
            `
        },
        community: {
            icon: '💬',
            title: 'Topluluk Desteği',
            content: `
                <p>Yalnız değilsiniz! 50.000+ öğrenci topluluğuna katılın.</p>
                <ul class="feature-detail-list">
                    <li><strong>Özel Discord sunucusu</strong> - Anlık destek</li>
                    <li><strong>Haftalık webinarlar</strong> - Canlı etkileşim</li>
                    <li><strong>Proje paylaşım platformu</strong> - Feedback alın</li>
                    <li><strong>Networking etkinlikleri</strong> - Bağlantılar kurun</li>
                    <li><strong>Mentor bulma</strong> - Deneyimlilerden öğrenin</li>
                </ul>
                <p>Birlikte öğrenmek, <strong>daha hızlı ve eğlenceli</strong>dir!</p>
            `
        },
        mobile: {
            icon: '📱',
            title: 'Mobil Erişim',
            content: `
                <p>Tüm cihazlarınızda kesintisiz öğrenme deneyimi!</p>
                <ul class="feature-detail-list">
                    <li><strong>iOS ve Android uygulaması</strong> - Native deneyim</li>
                    <li><strong>Otomatik senkronizasyon</strong> - Cihazlar arası geçiş</li>
                    <li><strong>Offline mod</strong> - İnternetsiz öğrenme</li>
                    <li><strong>Push bildirimleri</strong> - Hatırlatmalar ve güncellemeler</li>
                    <li><strong>Responsive tasarım</strong> - Her ekran boyutunda mükemmel</li>
                </ul>
                <p>Otobüste, parkta, evde - <strong>her yerde öğrenin!</strong></p>
            `
        },
        updates: {
            icon: '🔄',
            title: 'Sürekli Güncelleme',
            content: `
                <p>Teknoloji hızla değişiyor, biz de! İçeriklerimiz her zaman güncel.</p>
                <ul class="feature-detail-list">
                    <li><strong>Aylık içerik güncellemeleri</strong> - Yeni konular eklenir</li>
                    <li><strong>Sektör trendleri</strong> - En son teknolojiler</li>
                    <li><strong>Bug fix ve iyileştirmeler</strong> - Sürekli gelişim</li>
                    <li><strong>Ücretsiz erişim</strong> - Güncellemeler için ekstra ücret yok</li>
                    <li><strong>Feedback sistemi</strong> - Önerileriniz önemli</li>
                </ul>
                <p>Bir kez satın alın, <strong>ömür boyu güncellemelere erişin!</strong></p>
            `
        },
        format: {
            icon: '🎬',
            title: 'Format Üstünlüğü',
            content: `
                <p>Modern dijital dünyanın formatını kullanarak öğrenmeyi yeniden tanımlıyoruz!</p>
                <ul class="feature-detail-list">
                    <li><strong>Dikey video formatı</strong> - Mobil öncelikli tasarım</li>
                    <li><strong>2-10 dakikalık modüller</strong> - Mikro-öğrenme yaklaşımı</li>
                    <li><strong>TikTok tarzı akış</strong> - Sürükleyici içerik deneyimi</li>
                    <li><strong>Hızlı geçişler</strong> - Dikkat dağınıklığı yok</li>
                    <li><strong>%80 tamamlama oranı</strong> - Gelenekselde sadece %20</li>
                </ul>
                <p>Öğrenmeyi <strong>sosyal medya kadar bağımlılık yapıcı</strong> hale getirdik!</p>
            `
        },
        personal: {
            icon: '🎯',
            title: 'Kişisel İçerikler',
            content: `
                <p>Herkes farklıdır, öğrenme yolculuğunuz da öyle olmalı!</p>
                <ul class="feature-detail-list">
                    <li><strong>Yapay zeka destekli öneriler</strong> - İlgi alanlarınıza göre</li>
                    <li><strong>Öğrenme hızı analizi</strong> - Size özel tempo ayarı</li>
                    <li><strong>Kişisel ilerleme takibi</strong> - Hedefinize ne kadar yakınsınız?</li>
                    <li><strong>Özel öğrenme yolları</strong> - Kariyerinize uygun rotalar</li>
                    <li><strong>Adaptif içerik</strong> - Seviyeniz otomatik ayarlanır</li>
                </ul>
                <p>Öğrenme deneyiminiz <strong>tamamen size özel!</strong></p>
            `
        }
    };
    
    const feature = features[featureType];
    if (feature) {
        document.getElementById('featureIcon').textContent = feature.icon;
        document.getElementById('featureTitle').textContent = feature.title;
        document.getElementById('featureContent').innerHTML = feature.content;
        openModal('featureDetailModal');
    }
}

// Modal Açma
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Modal Kapama
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Modallar arası geçiş (Giriş -> Kayıt vb.)
function switchModal(closeId, openId) {
    closeModal(closeId);
    openModal(openId);
}

// Kursa Tıklanınca Çalışan AKILLI Fonksiyon
function checkCourseAccess(courseName) {
    const titleEl = document.getElementById('c-title');
    const descEl = document.getElementById('c-desc');
    const btnEl = document.getElementById('c-btn');
    const iconEl = document.getElementById('c-icon');

    titleEl.textContent = courseName;
    
    if (currentUser) {
        // EĞER GİRİŞ YAPILDIYSA
        iconEl.textContent = "✅";
        descEl.textContent = "Tebrikler! Giriş yaptığınız için bu kursa hemen başlayabilirsiniz. İlk derse gitmek için butona tıklayın.";
        btnEl.textContent = "Derse Başla ▶";
        btnEl.onclick = function() {
            // Kursu kullanıcının kurs listesine ekle
            if (!currentUser.courses.includes(courseName)) {
                currentUser.courses.push(courseName);
                updateUserData();
            }
            alert('🎓 ' + courseName + ' dersine yönlendiriliyorsunuz...\n\nSatın alınan kurslarınız: ' + currentUser.courses.join(', '));
            closeModal('courseModal');
        };
    } else {
        // EĞER MİSAFİR İSE
        iconEl.textContent = "🔒";
        descEl.textContent = "Bu kursun içeriğine erişmek ve sertifika programına katılmak için lütfen önce giriş yapın.";
        btnEl.textContent = "Giriş Yap ve Abone Ol";
        btnEl.onclick = function() {
            switchModal('courseModal', 'loginModal');
        };
    }

    openModal('courseModal');
}

// Kullanıcı verilerini güncelle
function updateUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.username === currentUser.username);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// SSS (Accordion) Aç/Kapa
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.plus-icon');
    const isOpen = answer.classList.contains('active');
    
    // Tüm FAQ'ları kapat
    document.querySelectorAll('.faq-a').forEach(item => {
        item.classList.remove('active');
        item.style.maxHeight = '0';
        item.style.paddingBottom = '0';
    });
    document.querySelectorAll('.plus-icon').forEach(item => {
        item.innerHTML = '+';
        item.style.background = '#6366f1';
    });
    
    // Eğer tıklanan kapalıysa, aç
    if (!isOpen) {
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.paddingBottom = '2rem';
        icon.innerHTML = '-';
        icon.style.background = '#8b5cf6';
    }
}

// Modal dışına tıklayınca kapatma
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
}

// ==========================================
// CHATBOT (SKILLUP ASİSTAN)
// ==========================================

// Chatbot penceresini aç/kapat
function toggleChatbot() {
    const window = document.getElementById('chatbotWindow');
    const isVisible = window.style.display === 'flex';
    window.style.display = isVisible ? 'none' : 'flex';
    
    if (!isVisible) {
        const input = document.getElementById('chatbotInput');
        if (input) input.focus();
    }
}

// Kullanıcı mesajı gönder
function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const text = (input.value || '').trim();
    if (!text) return;
    
    appendUserMessage(text);
    input.value = '';
    
    // Bot yanıtını biraz gecikmeyle göster
    setTimeout(() => {
        const response = getBotResponse(text);
        appendBotMessage(response);
    }, 300);
}

// Kullanıcı mesajını ekle
function appendUserMessage(text) {
    const messagesDiv = document.getElementById('chatbotMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'user-msg';
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Bot mesajını ekle
function appendBotMessage(html) {
    const messagesDiv = document.getElementById('chatbotMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'bot-msg';
    msgDiv.innerHTML = html;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Bot yanıtını oluştur (kural tabanlı)
function getBotResponse(text) {
    const t = text.toLowerCase();

    // Hedef bazlı kurs önerileri
    const goalResponse = getGoalBasedRecommendation(t);
    if (goalResponse) return goalResponse;

    // Kurs arama
    if (t.includes('kurs') || t.includes('eğitim') || t.includes('ders')) {
        const matches = allCourses.filter(c => 
            t.includes(c.name.toLowerCase()) || 
            c.name.toLowerCase().includes(t.split(' ')[0]) ||
            (c.desc || '').toLowerCase().includes(t)
        );
        
        if (matches.length > 0) {
            const links = matches.slice(0, 4).map(c => 
                `<a class="chatbot-link" onclick="checkCourseAccess('${c.name}'); toggleChatbot();">${c.icon} ${c.name}</a>`
            ).join('<br>');
            return `Şu kursları buldum:<br>${links}`;
        }
        
        return `Hangi alanda kurs arıyorsunuz? 💡<br>Örnekler: "Web Geliştirme", "UI/UX", "Veri Bilimi", "AI", "Mobil", "Siber Güvenlik"`;
    }

    // Giriş / Kayıt
    if (t.includes('giriş') || t.includes('login') || t.includes('oturum')) {
        return `Giriş yapmak için <a class="chatbot-link" onclick="openModal('loginModal'); toggleChatbot();">buraya tıklayın</a> 🔐`;
    }
    if (t.includes('kayıt') || t.includes('signup') || t.includes('üye ol')) {
        return `Kayıt olmak için <a class="chatbot-link" onclick="openModal('signupModal'); toggleChatbot();">buraya tıklayın</a> ✨`;
    }

    // Profil
    if (t.includes('profil') || t.includes('hesap')) {
        if (currentUser) {
            return `Profilinizi görmek için <a class="chatbot-link" onclick="openProfileModal(); toggleChatbot();">buraya tıklayın</a> 👤`;
        }
        return `Önce giriş yapmanız gerekiyor. <a class="chatbot-link" onclick="openModal('loginModal'); toggleChatbot();">Giriş Yap</a> 🔐`;
    }

    // Abonelik / Fiyat
    if (t.includes('abonelik') || t.includes('fiyat') || t.includes('ücret') || t.includes('plan') || t.includes('premium')) {
        return `💰 Üyelik planlarımızı görmek için <a class="chatbot-link" href="#pricing" onclick="toggleChatbot();">Fiyatlandırma</a> bölümüne bakabilirsiniz.`;
    }

    // Sertifika
    if (t.includes('sertifika')) {
        return `🎓 Kursları tamamlayanlara <strong>blockchain doğrulamalı sertifika</strong> veriyoruz. LinkedIn'de paylaşabilir, QR kod ile doğrulayabilirsiniz!`;
    }

    // İletişim
    if (t.includes('iletişim') || t.includes('destek') || t.includes('yardım') || t.includes('mail') || t.includes('e-posta')) {
        return `📧 Bizimle iletişime geçmek için <a class="chatbot-link" onclick="openModal('contactModal'); toggleChatbot();">İletişim</a> sayfasına göz atın.`;
    }

    // SSS
    if (t.includes('sss') || t.includes('sıkça') || t.includes('sorular')) {
        return `❓ Sık sorulan sorular için <a class="chatbot-link" href="#faq" onclick="toggleChatbot();">SSS</a> bölümünü inceleyin.`;
    }

    // Hakkımızda
    if (t.includes('hakkında') || t.includes('hakkımızda') || t.includes('vizyonunuz')) {
        return `ℹ️ SkillUp hakkında bilgi almak için <a class="chatbot-link" onclick="openModal('aboutModal'); toggleChatbot();">Hakkımızda</a> sayfasını ziyaret edin.`;
    }

    // Özellikler
    if (t.includes('özellik') || t.includes('ne sunuyorsunuz')) {
        return `✨ Platform özelliklerimizi görmek için sayfayı aşağı kaydırın veya <a class="chatbot-link" href="#features" onclick="toggleChatbot();">Özellikler</a> bölümüne göz atın.`;
    }

    // Anasayfa
    if (t.includes('anasayfa') || t.includes('ana sayfa') || t.includes('başa dön')) {
        return `🏠 Anasayfaya dönmek için <a class="chatbot-link" onclick="scrollToTop(); toggleChatbot();">buraya tıklayın</a>.`;
    }

    // Kariyer / İş
    if (t.includes('kariyer') || t.includes('iş') || t.includes('çalış')) {
        return `💼 Kariyer fırsatları için <a class="chatbot-link" onclick="openModal('careerModal'); toggleChatbot();">Kariyer</a> sayfamızı ziyaret edin.`;
    }

    // Varsayılan yanıt
    return `🤔 Size şu konularda yardımcı olabilirim:<br>
        • <strong>Kurs arama</strong> (örn: "Web geliştirme kursu")<br>
        • <strong>Kariyer hedefi</strong> (örn: "Frontend developer olmak istiyorum")<br>
        • <strong>Giriş/Kayıt</strong><br>
        • <strong>Abonelik ve fiyatlar</strong><br>
        • <strong>Sertifika bilgisi</strong><br>
        • <strong>İletişim ve destek</strong><br><br>
        Bir soru sorun veya yardım isteyin! 😊`;
}

// Hedef bazlı kurs önerileri
function getGoalBasedRecommendation(text) {
    const goalPlans = [
        {
            keywords: ['frontend', 'front-end', 'front end', 'ön yüz'],
            title: 'Frontend Developer',
            courses: ['Web Geliştirme Masterclass', 'UI/UX Tasarım Temelleri', 'Mobil Uygulama Geliştirme']
        },
        {
            keywords: ['fullstack', 'full stack', 'full-stack', 'tam yığın'],
            title: 'Full-Stack Developer',
            courses: ['Web Geliştirme Masterclass', 'Veri Bilimi & Analitik', 'Siber Güvenlik Temelleri']
        },
        {
            keywords: ['veri bilimi', 'data science', 'veri analisti', 'data analyst'],
            title: 'Veri Bilimci',
            courses: ['Veri Bilimi & Analitik', 'Yapay Zeka ve Deep Learning']
        },
        {
            keywords: ['ai', 'yapay zeka', 'machine learning', 'ml', 'deep learning'],
            title: 'AI/ML Geliştirici',
            courses: ['Yapay Zeka ve Deep Learning', 'Veri Bilimi & Analitik']
        },
        {
            keywords: ['mobil', 'mobile', 'react native', 'android', 'ios'],
            title: 'Mobil Geliştirici',
            courses: ['Mobil Uygulama Geliştirme', 'Web Geliştirme Masterclass', 'UI/UX Tasarım Temelleri']
        },
        {
            keywords: ['siber', 'güvenlik', 'cyber', 'security', 'hacker'],
            title: 'Siber Güvenlik Uzmanı',
            courses: ['Siber Güvenlik Temelleri', 'Web Geliştirme Masterclass']
        },
        {
            keywords: ['ui', 'ux', 'tasarım', 'designer', 'tasarımcı'],
            title: 'UI/UX Tasarımcı',
            courses: ['UI/UX Tasarım Temelleri', 'Web Geliştirme Masterclass']
        }
    ];

    // Hedef anahtar kelimelerini kontrol et
    const goalTriggers = ['hedef', 'kariyer', 'olmak istiyorum', 'olmak', 'plan', 'yol haritası'];
    const isGoalIntent = goalTriggers.some(k => text.includes(k));

    // Eşleşen hedef planını bul
    let matchedGoal = null;
    for (const goal of goalPlans) {
        if (goal.keywords.some(k => text.includes(k))) {
            matchedGoal = goal;
            break;
        }
    }

    if (!matchedGoal && !isGoalIntent) return null;

    if (!matchedGoal) {
        return `🎯 Hangi kariyer hedefine yönelik yardım istiyorsunuz?<br><br>
            Örnek hedefler:<br>
            • "Frontend developer olmak istiyorum"<br>
            • "Veri bilimci olmak istiyorum"<br>
            • "AI/ML alanında çalışmak istiyorum"<br>
            • "Mobil geliştirici olmak istiyorum"<br>
            • "UI/UX tasarımcı olmak istiyorum"`;
    }

    const courseLinks = matchedGoal.courses
        .map((name, i) => `${i + 1}. <a class="chatbot-link" onclick="checkCourseAccess('${name}'); toggleChatbot();">${name}</a>`)
        .join('<br>');

    return `🎯 <strong>${matchedGoal.title}</strong> hedefi için önerilen öğrenme yolu:<br><br>
        ${courseLinks}<br><br>
        💡 Bu kursları sırasıyla tamamlamanızı öneriyorum. Başarılar! 🚀`;
}

// Enter tuşu ile mesaj gönder
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatbotInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
});