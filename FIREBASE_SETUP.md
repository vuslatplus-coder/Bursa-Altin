# Firebase Kurulum ve Yönetim Paneli Kılavuzu

Bu belge, **Mehmet Hamdemirci Kuyumculuk** web sitesinin görsel içerik yönetim panelini Firebase'e bağlamak için adım adım Türkçe talimatları içerir.

---

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin.
2. **"Add project"** (Proje Ekle) butonuna tıklayın ve bir proje adı belirleyin (Örn: `hamdemirci-kuyumculuk`).
3. Google Analytics adımını isteğe bağlı olarak geçebilir veya etkinleştirebilirsiniz.

---

## 2. Firebase Authentication (Giriş) Kurulumu

1. Sol menüden **Build > Authentication** seçeneğine tıklayın.
2. **"Get Started"** (Başla) butonuna basın.
3. **Sign-in method** sekmesinden **"Email/Password"** seçeneğini etkinleştirin (Enable) ve kaydedin.
4. **Users** sekmesine gelin ve **"Add user"** (Kullanıcı Ekle) butonuna basarak kendi yönetici e-posta adresinizi ve güçlü bir şifrenizi tanımlayın.
5. Eklenen kullanıcının sağ tarafındaki **User UID** değerini kopyalayın (Bu değer `VITE_FIREBASE_ADMIN_UID` için gereklidir).

---

## 3. Cloud Firestore (Veritabanı) Kurulumu

1. Sol menüden **Build > Firestore Database** seçeneğine tıklayın.
2. **"Create database"** butonuna basın.
3. Konum olarak `eur3 (europe-west)` veya Türkiye'ye en yakın bölgeyi seçin.
4. Güvenlik kuralları adımında **"Start in production mode"** seçin.
5. Veritabanı oluştuktan sonra **Rules** sekmesine gelin ve projedeki `firestore.rules` dosyasının içeriğini buraya yapıştırıp **Publish** edin (Kurallardaki `ADMIN_USER_UID_BURAYA` yerine kendi Admin UID'nizi yazabilirsiniz).

---

## 4. Firebase Storage (Görsel Depolama) Kurulumu

1. Sol menüden **Build > Storage** seçeneğine tıklayın.
2. **"Get Started"** butonuna basarak depolama alanını etkinleştirin.
3. **Rules** sekmesine gelin ve projedeki `storage.rules` dosyasının içeriğini yapıştırıp **Publish** edin.

---

## 5. Web App Oluşturma ve API Bilgilerini Alma

1. Sol üstteki **Project Overview** yanındaki dişli (Ayarlar) simgesine tıklayıp **Project settings**'e girin.
2. **General** sekmesinde aşağı kaydırın ve **Your apps** bölümünden **Web (`</>`)** simgesine tıklayın.
3. Bir uygulama adı yazıp **Register app** deyin.
4. Ekrana gelen `firebaseConfig` nesnesindeki değerleri projenizin `.env` veya Hosting ortam değişkenlerine ekleyin:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=projeniz.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=projeniz
VITE_FIREBASE_STORAGE_BUCKET=projeniz.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:...
VITE_FIREBASE_ADMIN_UID=KOPYALADIGINIZ_ADMIN_UID
```

---

## 6. Yönetim Paneline Erişim (/admin)

- Web sitenizin sonuna `/admin` ekleyerek (Örn: `https://siteadresi.com/admin`) yönetim ekranına ulaşabilirsiniz.
- Firebase Console'da oluşturduğunuz yönetici e-posta ve şifresiyle giriş yapın.
- Yalnızca `VITE_FIREBASE_ADMIN_UID` ile eşleşen kullanıcı içerik ekleyebilir, değiştirebilir ve silebilir.
- İlk girişte **"Mevcut Görselleri Firebase'e Aktar"** butonuna basarak sitenin mevcut zengin afiş ve vitrin içeriklerini tek tıkla veritabanına aktarabilirsiniz.
- Sitedeki hiçbir müşteri linkinde `/admin` bağlantısı yer almaz.
