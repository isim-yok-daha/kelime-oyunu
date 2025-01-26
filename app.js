const words = [
    "araba", "araç", "akıl", "elma", "kedi", "kalem", "masa", "sandalye", "çatal", "kaşık", 
    "bardak", "tabak", "kitap", "defter", "silgi", "klavye", "fare", "telefon", "ekran", "priz",
    "kapı", "pencere", "perde", "lamba", "halı", "yastık", "battaniye", "yorgan", "şapka", "çanta",
    "terlik", "ayakkabı", "bot", "mont", "pantolon", "gömlek", "kazak", "atkı", "bere", "eldiven",
    "çorap", "koltuk", "sehpa", "televizyon", "buzdolabı", "fırın", "ocak", "tencere", "tava", "süzgeç",
    "rende", "bıçak", "makas", "ağaç", "çiçek", "yaprak", "çim", "toprak", "deniz", "ırmak", "göl", "dağ",
    "tepe", "yol", "köprü", "tren", "otobüs", "uçak", "gemi", "liman", "havalimanı", "istasyon", "park",
    "bahçe", "kütüphane", "müze", "market", "mağaza", "eczane", "hastane", "okul", "üniversite", "sınıf",
    "banka", "postane", "kargo", "restoran", "kafe", "pastane", "otopark", "otel", "plaj", "kamp", "orman",
    "tatil", "seyahat", "şehir", "köy", "kasaba", "sahil", "kale", "tünel"
  ];
  
let word = '';
let guesses = [];
let letters = [];
let gameOver = false;
let currentIndex = 0;  // İlk boş kutu indexi
let letterUsage = {}; // Her harf için kullanım sayısı
let wordsGuessed = 0; // Kaç kelime doğru tahmin edildi

// Oyun başladığında kelime seçimi
function startGame() {

    const randomIndex = Math.floor(Math.random() * words.length);
    word = words[randomIndex];
    guesses = new Array(word.length).fill(null); // Kareler boş
    letters = generateRandomLetters(word); // Kelimenin harflerini düzgün yerleştirme
    currentIndex = 0;  // Oyun başlarken index sıfırlanıyor
    letterUsage = getLetterUsage(word); // Harflerin sayısını hesaplıyoruz
    updateWordDisplay();
    updateLettersDisplay();
    updateDeleteButton();
}

// Kelimenin içindeki harflerin kullanım sayısını almak
function getLetterUsage(word) {
    const usage = {};
    word.split('').forEach(letter => {
        usage[letter] = (usage[letter] || 0) + 1; // Her harfi sayıyoruz
    });
    return usage;
}

// Kelimenin harflerini ve rastgele harfleri karıştırma
function generateRandomLetters(word) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = word.split(''); // Kelimenin harflerini alıyoruz
    while (result.length < word.length * 2) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        result.push(randomLetter); // Kelimenin harflerinin sayısının iki katı kadar rastgele harf ekliyoruz
    }
    return result.sort(() => Math.random() - 0.5); // Harfleri karıştırıyoruz
}

// Kelimeyi ekranda göstermek
function updateWordDisplay() {
    const wordContainer = document.querySelector('.word-container');
    wordContainer.innerHTML = ''; // Önceki içerikleri temizle

    guesses.forEach((guess, index) => {
        const hexagon = document.createElement('div');
        hexagon.classList.add('hexagon');
        hexagon.textContent = guess !== null ? guess : '';  // Boş yerler de boş olmalı
        hexagon.dataset.index = index;  // Her hexagona bir index ekleyelim
        hexagon.onclick = () => handleHexagonClick(index); // Hexagona tıklanınca bu fonksiyon çalışacak
        wordContainer.appendChild(hexagon);
    });
}

// Harfleri ekranda göstermek
function updateLettersDisplay() {
    const lettersContainer = document.querySelector('.letters-container');
    lettersContainer.innerHTML = ''; // Önceki içerikleri temizle

    letters.forEach((letter, index) => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.dataset.letter = letter;  // Her butona harfi ekle
        button.onclick = () => handleLetterClick(letter, button, index); // Harf butonuna tıklandığında
        button.disabled = letterUsage[letter] <= 0; // Eğer harf sayısı sıfırsa buton devre dışı
        lettersContainer.appendChild(button);
    });
}

// Silme tuşunu ekleyelim
function updateDeleteButton() {
    const deleteButtonContainer = document.querySelector('.delete-button-container');
    deleteButtonContainer.innerHTML = ''; // Önceki içerikleri temizle

    if (currentIndex > 0) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Sil';
        deleteButton.onclick = deleteLastLetter;
        deleteButtonContainer.appendChild(deleteButton);
    }
}

// Harf tıklandığında
function handleLetterClick(letter, button, index) {
    if (gameOver || letterUsage[letter] <= 0) return; // Harf kullanılabilir mi kontrolü

    // Harf doğru ya da yanlış olsun, sırayla bir boş kutuya yerleşecek
    if (currentIndex < guesses.length) {
        guesses[currentIndex] = letter;
        letterUsage[letter]--; // Harfi bir kez kullandık, sayısını azalt
        currentIndex++; // Sonraki kutuya geçiş

        // Butonu devre dışı bırak ve gri yap
        button.disabled = true;
        button.classList.add('disabled');  // Butonu gri yapıyoruz

        // Animasyonu başlat
        animateLetterPlacement();
    }

    // Kelimeyi bitirdiysek, oyunu bitir
    if (currentIndex === guesses.length) {
        checkWord();
    }

    updateLettersDisplay(); // Harfleri güncelle
    updateDeleteButton(); // Silme tuşunu güncelle
}

// Harfi animasyonlu şekilde yerleştir
function animateLetterPlacement() {
    const hexagons = document.querySelectorAll('.hexagon');
    const hexagon = hexagons[currentIndex - 1]; // Son yerleştirilen hexagon

    // Harfi animasyonla kutuya ekleyelim
    setTimeout(() => {
        hexagon.textContent = guesses[currentIndex - 1]; // Harfi kutuya yerleştir
        hexagon.classList.add('animated');
        setTimeout(() => {
            hexagon.classList.remove('animated');
        }, 500); // Animasyon süresi
    }, 100); // Biraz gecikmeli ekliyoruz, animasyonu görsel olarak daha etkili yapmak için
}

// Kelimeyi kontrol et
function checkWord() {
    const wordContainer = document.querySelector('.word-container');
    if (guesses.join('') === word) {
        wordsGuessed++; // Kelime doğru, kelime sayısını artır
        alert(`Tebrikler! Kelimeyi doğru bildiniz: ${word}`);

        // Oyun devam etsin
        setTimeout(() => {
            resetGame(); // Kelimeyi bitir, yeni kelime seç
            startGame(); // Yeni kelime ile devam et
        }, 1000);
    } else {
        alert('Kelimeyi bulamadınız, tekrar deneyin!');
    }
}

// Son yerleştirilen harfi sil
function deleteLastLetter() {
    if (currentIndex > 0) {
        currentIndex--; // Sonraki kutuya geçişi geri al
        const letter = guesses[currentIndex];
        guesses[currentIndex] = null; // O kutuyu boşalt
        letterUsage[letter]++; // Silinen harfi geri ekle
        updateWordDisplay(); // Ekranı güncelle
        updateDeleteButton(); // Silme tuşunu güncelle
    }
}

// Hexagona tıklandığında harfi sil
function handleHexagonClick(index) {
    if (guesses[index] !== null) {
        const letter = guesses[index];
        guesses[index] = null; // Harfi boşalt
        letterUsage[letter]++; // Harfi geri ekle
        currentIndex--; // Index geri al
        updateWordDisplay(); // Ekranı güncelle
        updateLettersDisplay(); // Harfleri güncelle
        updateDeleteButton(); // Silme butonunu güncelle
    }
}

// Yeni kelime başlat
function resetGame() {
    guesses = [];
    letters = [];
    letterUsage = {};
    currentIndex = 0;
}

// Oyunu başlat
startGame();
