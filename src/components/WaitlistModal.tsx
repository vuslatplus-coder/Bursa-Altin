import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Shield, QrCode, Download, Share2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Özel Lansman İndirimi',
    'Hasır Bilezik Koleksiyonu'
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vipCode, setVipCode] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'BA-VIP-' + Math.floor(100000 + Math.random() * 900000);
    setVipCode(code);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#141414] border border-[#d4af37] max-w-lg w-full my-8 p-6 sm:p-8 relative gold-glow-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#e5e2e1]/60 hover:text-white p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {isSuccess ? (
          <div className="text-center py-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e1a12] border border-[#d4af37] text-xs font-sans-luxury text-[#f2ca50]">
              <Sparkles className="w-3.5 h-3.5" />
              VIP ERİŞİM KARTINIZ HAZIR
            </div>

            {/* Exclusive VIP Digital Pass Card */}
            <div className="p-6 bg-gradient-to-br from-[#1c1913] to-[#0c0c0c] border border-[#d4af37] text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-2xl rounded-full" />
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#d4af37]">
                    BURSA ALTIN • VIP CLUB
                  </span>
                  <div className="font-serif-luxury text-xl text-[#f7e7ce] mt-1 font-semibold">
                    {name || 'Kıymetli Müşterimiz'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-none border border-[#d4af37] flex items-center justify-center text-[#f2ca50] text-xs font-bold font-serif-luxury">
                  BA
                </div>
              </div>

              <div className="mt-8 flex justify-between items-end">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#e5e2e1]/50 font-sans-luxury block">
                    Özel Davetiye Kodu
                  </span>
                  <span className="font-mono text-sm sm:text-base text-[#f2ca50] font-bold tracking-wider">
                    {vipCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-widest text-[#e5e2e1]/50 font-sans-luxury block">
                    Geçerlilik
                  </span>
                  <span className="text-xs text-[#e5e2e1] font-sans-luxury">
                    2026 Büyük Lansman
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#e5e2e1]/75 font-sans-luxury max-w-sm mx-auto">
              Davetiye kodunuz <strong>{email}</strong> adresine iletilmiştir. Lansman gününde %10 açılış ayrıcalığı ve öncelikli randevu hakkı kazandınız.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] text-xs font-sans-luxury font-semibold uppercase tracking-[0.2em]"
            >
              Tamamla ve Kapat
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#d4af37]/40 bg-[#1a1914] text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Özel Erken Erişim
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#f7e7ce]">
                VIP Davetiye Programı
              </h2>
              <p className="text-xs text-[#e5e2e1]/65 font-sans-luxury mt-2">
                Bursa Altın yeni dijital platformu açıldığında ilk keşfedenler arasında yer alın ve lansman avantajlarından faydalanın.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 font-sans-luxury">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                  Adınız ve Soyadınız:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                  E-Posta Adresiniz:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@bursaaltin.com"
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                  Telefon Numaranız (SMS Davetiye İçin):
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="053X XXX XX XX"
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-2">
                  İlgilendiğiniz Alanlar:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Özel Lansman İndirimi',
                    'Hasır Bilezik Koleksiyonu',
                    'Pırlanta & Tektaş',
                    'Külçe Altın & Ziynet',
                    'Kişiye Özel Tasarım'
                  ].map((interest) => (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 text-[11px] border transition-all ${
                        selectedInterests.includes(interest)
                          ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#f2ca50]'
                          : 'border-[#f7e7ce]/15 text-[#e5e2e1]/60'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] text-xs font-semibold uppercase tracking-[0.2em] transition-all mt-4"
              >
                VIP Kartımı Oluştur
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
