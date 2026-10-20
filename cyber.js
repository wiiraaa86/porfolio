document.addEventListener('DOMContentLoaded', () => {
    // === 1. KUNCI LAYAR SAAT INTRO ===
    document.body.style.overflow = 'hidden';


    const enterBtn = document.getElementById('enterBtn');
    const mainContent = document.getElementById('mainContent');
    const statusText = document.querySelector('.system-status');
    const gateLeft = document.getElementById('gateLeft');
    const gateRight = document.getElementById('gateRight');
    const introScreen = document.getElementById('introScreen');
    const arenaScreen = document.getElementById('arenaScreen');
    
    const muteBtn = document.getElementById('muteBtn');
    const bgMusic = document.getElementById('bgMusic');
    const speakerIcon = document.getElementById('speakerIcon');
    
    if (bgMusic) bgMusic.volume = 0.5; 
    let isPlaying = false;

    const iconMuted = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>`;
    
    const iconPlaying = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;

    // === 3. LOGIKA ANIMASI KETIKAN ===
    const textArray = ["Web Developer", "UI / UX Enthusiast", "Problem Solver", "Mobile Device Technician"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById("typed-text");
    
    function typeEffect() {
        if (!typedTextSpan) return;
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; 
        }
        setTimeout(typeEffect, typeSpeed);
    }

    // === 4. LOGIKA ANIMASI ANGKA (COUNTER STATS ARENA) ===
    function animateCounters() {
        const counters = document.querySelectorAll('.stats-grid .counter');
        const duration = 2000; 

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1); 
                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                
                counter.innerText = Math.ceil(easeOutProgress * target);

                if (progress < 1) requestAnimationFrame(updateCount); 
                else counter.innerText = target; 
            }
            requestAnimationFrame(updateCount);
        });
    }

 
    // === 5. LOGIKA NAVBAR SMART SCROLL, SCROLLSPY & SLIDER ANIMASI ===
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('main[id], section[id]'); 
    const navLinks = document.querySelectorAll('.nav-links a'); 
    const indicator = document.querySelector('.nav-indicator'); // Elemen kapsul baru
    let lastScrollTop = 0;

    // Fungsi inti untuk menggeser kapsul
    function updateIndicator(activeElement) {
        if (!activeElement || !indicator) return;
        const parentLi = activeElement.parentElement;
        // Atur lebar kapsul sesuai lebar menu, dan posisinya sesuai jarak menu dari kiri
        indicator.style.width = `${activeElement.offsetWidth}px`;
        indicator.style.left = `${parentLi.offsetLeft}px`;
        indicator.style.opacity = '1';
    }

    // Jalankan pergeseran awal saat website pertama kali dibuka
    const initialActive = document.querySelector('.nav-links a.active');
    if (initialActive) {
        setTimeout(() => updateIndicator(initialActive), 100); 
    }

    // Pastikan kapsul tetap sejajar saat ukuran jendela browser diubah
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-links a.active');
        if (currentActive) updateIndicator(currentActive);
    });

    // Pergeseran saat menu DIKLIK
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            updateIndicator(this);
        });
    });

    // Pergeseran otomatis saat halaman di-SCROLL
    window.addEventListener('scroll', () => {
        if (!arenaScreen || arenaScreen.style.display === 'none') return;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Logika menyembunyikan navbar saat scroll ke bawah
        if (scrollTop > lastScrollTop && scrollTop > 80) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 

        // Deteksi halaman/section aktif saat ini
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollTop >= (sectionTop - section.clientHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        // Terapkan kapsul ke menu yang sesuai dengan ID halaman
        if (currentSection) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentSection}`) {
                    // Mencegah animasi terulang terus menerus jika posisinya sudah benar
                    if (!link.classList.contains('active')) {
                        navLinks.forEach(nav => nav.classList.remove('active'));
                        link.classList.add('active');
                        updateIndicator(link);
                    }
                }
            });
        }
    });

    // === 6. FUNGSI ANIMASI DETAIL SKILL (DIPERBAIKI) ===
    function animateDetailStats(targetId) {
        const detailContainer = document.getElementById(targetId);
        if (!detailContainer) return;

        const counters = detailContainer.querySelectorAll('.detail-counter');
        const bars = detailContainer.querySelectorAll('.s-progress-fill');

        // 1. Reset lebar bar menjadi 0 secara instan
        bars.forEach(bar => {
            bar.style.width = '0';
        });

        // 2. Gunakan double requestAnimationFrame agar browser mendeteksi perubahan dari 0 ke target width
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            });
        });

        // 3. Animasi Angka Menghitung (Counter)
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1200; 
            const startTime = performance.now();
            counter.innerText = '0'; 

            function updateStat(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                counter.innerText = Math.ceil(easeOutProgress * target);

                if (progress < 1) requestAnimationFrame(updateStat);
                else counter.innerText = target;
            }
            requestAnimationFrame(updateStat);
        });
    }

    // === 7. LOGIKA TAB MENU PADA SKILL LOADOUT ===
    const branchItems = document.querySelectorAll('.branch-item');
    const branchDetails = document.querySelectorAll('.branch-detail-content');
    const heroImage = document.querySelector('.hero-image'); // Ambil elemen gambar hero

    branchItems.forEach(item => {
        item.addEventListener('click', () => {
            // Hapus class active dari semua menu
            branchItems.forEach(btn => btn.classList.remove('active'));
            item.classList.add('active'); // Tambahkan ke yang diklik

            // 1. Tampilkan Detail Konten yang Sesuai
            const targetId = item.getAttribute('data-tab');
            branchDetails.forEach(detail => detail.classList.remove('active'));
            const targetDetail = document.getElementById(targetId);
            
            if (targetDetail) {
                targetDetail.classList.add('active');
                animateDetailStats(targetId); 
            }

            // 2. Logika Pergantian Foto Hero secara Halus (Fade)
            if (heroImage) {
                const newImgSrc = item.getAttribute('data-image'); // Ambil alamat gambar
                
                if (newImgSrc) {
                    heroImage.classList.add('fade-img'); // Pudarkan gambar lama
                    
                    // Tunggu 300ms (sesuai durasi CSS) sebelum mengganti src dan memunculkannya kembali
                    setTimeout(() => {
                        heroImage.src = newImgSrc;
                        heroImage.classList.remove('fade-img');
                    }, 300);
                }
            }
        });
    });

    // === 8. INISIALISASI OBSERVER SCROLL (DIPANGGIL SETELAH ARENA TERBUKA) ===
    function initScrollAnimations() {
        
        // A. Observer untuk Combat Stats
        const combatStats = document.querySelector('.combat-stats');
        if (combatStats) {
            const statsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBars = combatStats.querySelectorAll('.progress-fill');
                        const statCounters = combatStats.querySelectorAll('.stat-counter');

                        progressBars.forEach(bar => {
                            bar.style.width = '0';
                            setTimeout(() => {
                                bar.style.width = bar.getAttribute('data-width');
                            }, 50);
                        });

                        statCounters.forEach(counter => {
                            const target = +counter.getAttribute('data-target');
                            const duration = 1500; 
                            const startTime = performance.now();
                            counter.innerText = '0';

                            function updateStat(currentTime) {
                                const elapsedTime = currentTime - startTime;
                                const progress = Math.min(elapsedTime / duration, 1);
                                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                                counter.innerText = Math.ceil(easeOutProgress * target);

                                if (progress < 1) requestAnimationFrame(updateStat);
                                else counter.innerText = target;
                            }
                            requestAnimationFrame(updateStat);
                        });
                        observer.unobserve(entry.target); 
                    }
                });
            }, { threshold: 0.5 }); 
            statsObserver.observe(combatStats);
        }

        // B. Observer untuk Skill Branches & Hero Card (Bagian Skills)
        const branchList = document.querySelector('.branch-list');
        if (branchList) {
            const branchObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const branchItemsAnim = document.querySelectorAll('.branch-item');
                        const branchCounters = document.querySelectorAll('.branch-counter');

                        // 1. Animasi Kartu Hero di Sebelah Kiri (Power Bar & Power Counter)
                        const heroPowerFill = document.querySelector('.hero-power .power-fill');
                        const heroPowerCounter = document.querySelector('.hero-power .power-counter');
                        
                        if (heroPowerFill) {
                            heroPowerFill.style.width = '0';
                            setTimeout(() => {
                                heroPowerFill.style.width = heroPowerFill.getAttribute('data-width');
                            }, 50);
                        }
                        if (heroPowerCounter) {
                            const targetPower = +heroPowerCounter.getAttribute('data-target');
                            const durationPower = 1500;
                            const startPowerTime = performance.now();
                            heroPowerCounter.innerText = '0';

                            function updatePowerStat(currentTime) {
                                const elapsed = currentTime - startPowerTime;
                                const progress = Math.min(elapsed / durationPower, 1);
                                const ease = 1 - Math.pow(1 - progress, 3);
                                heroPowerCounter.innerText = Math.ceil(ease * targetPower);

                                if (progress < 1) requestAnimationFrame(updatePowerStat);
                                else heroPowerCounter.innerText = targetPower;
                            }
                            requestAnimationFrame(updatePowerStat);
                        }

                        // 2. Munculkan Kotak Skill 1-4 Bergantian
                        branchItemsAnim.forEach(item => {
                            item.classList.add('show-branch');
                        });

                        // 3. Animasi Angka Cabang Skill (Branch Counters)
                        branchCounters.forEach((counter, index) => {
                            const target = +counter.getAttribute('data-target');
                            const duration = 1500; 
                            const delay = (index * 200) + 100; 

                            setTimeout(() => {
                                const startTime = performance.now();
                                counter.innerText = '0';
                                function updateBranchStat(currentTime) {
                                    const elapsedTime = currentTime - startTime;
                                    const progress = Math.min(elapsedTime / duration, 1);
                                    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                                    counter.innerText = Math.ceil(easeOutProgress * target);

                                    if (progress < 1) requestAnimationFrame(updateBranchStat);
                                    else counter.innerText = target;
                                }
                                requestAnimationFrame(updateBranchStat);
                            }, delay); 
                        });

                        // 4. Animasi Detail Tab Aktif (AVG & Baris Skill di Bawahnya)
                        const activeTabNode = document.querySelector('.branch-item.active');
                        if (activeTabNode) {
                            const activeTabId = activeTabNode.getAttribute('data-tab');
                            animateDetailStats(activeTabId);
                        }

                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 }); 
            branchObserver.observe(branchList);
        }
    }

    // === 9. LOGIKA MASUK ARENA (TOMBOL ENTER & KEYBOARD ENTER) ===
    let hasEntered = false;

    function enterArena() {
        if (hasEntered) return;
        hasEntered = true;

        if (bgMusic) {
            setTimeout(() => {
                bgMusic.play().then(() => {
                    if (speakerIcon) speakerIcon.innerHTML = iconPlaying;
                    isPlaying = true;
                }).catch((e) => console.log(e));
            }, 4500);
        }

        if (statusText) {
            statusText.style.color = "#c90014";
            statusText.innerText = "アクセスを許可中...(Open Game)";
        }
        if (enterBtn) enterBtn.style.transform = "scale(0.95)";
            
        setTimeout(() => {
            if (mainContent) mainContent.classList.add('fade-out');
            
            setTimeout(() => {
                if (gateLeft) gateLeft.classList.add('open-gate');
                if (gateRight) gateRight.classList.add('open-gate');
                
                setTimeout(() => {
                    if (introScreen) introScreen.style.opacity = '0';
                    
                    setTimeout(() => {
                        window.scrollTo(0, 0); 
                        
                        if (introScreen) introScreen.style.display = 'none';
                        if (arenaScreen) arenaScreen.style.display = 'block'; 
                        
                        setTimeout(() => {
                            window.scrollTo(0, 0); 
                            document.body.style.overflow = 'auto'; 
                            
                            if (arenaScreen) arenaScreen.style.opacity = '1';
                            
                            // PANGGIL ANIMASI SCROLL HANYA SETELAH ARENA TERBUKA
                            initScrollAnimations();

                            setTimeout(() => {
                                typeEffect();
                                animateCounters(); 
                            }, 1000); 
                            
                        }, 50); 
                    }, 1000); 
                }, 1800); 
            }, 600); 
        }, 400); 
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', enterArena);
    }

    // Mendukung tombol Enter pada keyboard untuk masuk arena
    window.addEventListener('keydown', (e) => {
        if (!hasEntered && (e.key === 'Enter' || e.code === 'Enter')) {
            enterArena();
        }
    });

    // === 10. LOGIKA TOMBOL SUARA (MUTE/UNMUTE) ===
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (!bgMusic) return;
            if (isPlaying) {
                bgMusic.pause();
                if (speakerIcon) speakerIcon.innerHTML = iconMuted;
                isPlaying = false;
            } else {
                bgMusic.play();
                if (speakerIcon) speakerIcon.innerHTML = iconPlaying;
                isPlaying = true;
            }
        });
    }

    // === 11. LOGIKA CUSTOM CURSOR TARGET SNIPER VIDEO GAME (SMOOTH NO DELAY) ===
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        const hudText = cursor.querySelector('.hud-target-text');

        // Variabel untuk menyimpan posisi mouse asli dan posisi kursor buatan
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // Fungsi untuk menangkap pergerakan mouse dari event
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Tampilkan kursor jika sebelumnya disembunyikan
            if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
                 cursor.style.opacity = '1';
            }
        });

        // Loop animasi menggunakan requestAnimationFrame agar sangat mulus (60FPS+)
        function renderCursor() {
            // Lerp (Linear Interpolation) untuk efek smooth following (opsional)
            // Jika ingin 100% instan tanpa delay SAMA SEKALI, samakan saja nilainya:
            cursorX = mouseX;
            cursorY = mouseY;
            
            // Jika ingin ada sedikit efek 'mengikuti' yang sangat halus, gunakan ini (hapus 2 baris di atas, buka komen di bawah):
            // cursorX += (mouseX - cursorX) * 0.8;
            // cursorY += (mouseY - cursorY) * 0.8;

            // Gunakan translate3d untuk Hardware Acceleration (memaksa GPU bekerja)
            // Kurangi setengah dari lebar/tinggi kursor (54/2 = 27px) agar titik persis di tengah mouse
            cursor.style.transform = `translate3d(${cursorX - 27}px, ${cursorY - 27}px, 0)`;

            requestAnimationFrame(renderCursor);
        }
        // Mulai loop animasi
        requestAnimationFrame(renderCursor);


        // --- Sisa logika hover Anda tetap sama ---
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        // Deteksi dinamis untuk link navigasi dan elemen interaktif
        document.addEventListener('mouseover', (e) => {
            const navLink = e.target.closest('.nav-links a, .navbar a, nav a, a[href^="#"]');
            const generalInteractive = e.target.closest('a, button, .branch-item, .cyber-button, [role="button"]');

            if (navLink) {
                // Saat hover nav, kita perlu menggabungkan efek scale dengan translate3d
                cursor.style.transform = `translate3d(${cursorX - 27}px, ${cursorY - 27}px, 0) scale(1.7)`;
                cursor.classList.add('hover-nav', 'hover');
                if (hudText) hudText.textContent = 'AIM';
            } else if (generalInteractive) {
                cursor.style.transform = `translate3d(${cursorX - 27}px, ${cursorY - 27}px, 0) scale(1.35)`;
                cursor.classList.add('hover');
                cursor.classList.remove('hover-nav');
                if (hudText) hudText.textContent = 'LOCK';
            }
        });

        document.addEventListener('mouseout', (e) => {
            const interactive = e.target.closest('a, button, .branch-item, .cyber-button, [role="button"]');
            if (interactive) {
                if (!e.relatedTarget || !e.relatedTarget.closest('a, button, .branch-item, .cyber-button, [role="button"]')) {
                    // Kembalikan ukuran normal saat keluar hover
                    cursor.classList.remove('hover', 'hover-nav');
                    if (hudText) hudText.textContent = '';
                }
            }
        });
    }});