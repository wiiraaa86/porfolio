document.addEventListener('DOMContentLoaded', () => {
    // Array teks yang akan diketik bergantian
    const textArray = ["Web Developer", "UI / UX Enthusiast", "Problem Solver", "Mobile Device Tecnician"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typedTextSpan = document.getElementById("typed-text");
    
    function typeEffect() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Mengatur kecepatan ketik
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            // Jeda saat teks selesai diketik sebelum dihapus
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            // Jeda sebelum mengetik kata baru
            typeSpeed = 500; 
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Memulai efek ketikan
    setTimeout(typeEffect, 1000);

    // ==========================================
    // LOGIKA MUSIK & TOMBOL SUARA
    // ==========================================
    const muteBtn = document.getElementById('muteBtn');
    const bgMusic = document.getElementById('bgMusic');
    const speakerIcon = document.getElementById('speakerIcon');

    // Set volume musik (0.0 sampai 1.0)
    bgMusic.volume = 0.3; 
    let isPlaying = false;

    // Ikon saat suara mati (Mute)
    const iconMuted = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
    `;

    // Ikon saat suara menyala (Unmute)
    const iconPlaying = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    `;

    muteBtn.addEventListener('click', () => {
        if (isPlaying) {
            // Jika sedang main, maka Jeda (Pause)
            bgMusic.pause();
            speakerIcon.innerHTML = iconMuted; // Ubah ikon ke silang
            isPlaying = false;
        } else {
            // Jika sedang jeda, maka Putar (Play)
            bgMusic.play();
            speakerIcon.innerHTML = iconPlaying; // Ubah ikon ke gelombang suara
            isPlaying = true;
        }
    });
});

// Opsi Tambahan: Menyalakan musik pada klik pertama di area mana saja di halaman
    let hasInteracted = false;

    document.body.addEventListener('click', () => {
        if (!hasInteracted && !isPlaying) {
            bgMusic.play().then(() => {
                speakerIcon.innerHTML = iconPlaying;
                isPlaying = true;
                hasInteracted = true;
            }).catch((error) => {
                console.log("Browser tetap memblokir autoplay: ", error);
            });
        }
    }, { once: true }); // { once: true } memastikan event ini hanya berjalan satu kali saja



