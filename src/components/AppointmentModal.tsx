import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceType: 'ozel-tasarim',
    date: '2026-09-01',
    time: '14:00',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'ozel-tasarim': return 'Özel Tasarım & Kişiye Özel Atölye İmalatı';
      case 'alyans-tektaş': return 'Alyans, Tektaş & Düğün Takı Seti';
      case 'yatirim-danismanligi': return 'Fiziki Altın & Külçe Yatırım Danışmanlığı';
      case 'vip-agirlama': return 'VIP Özel Ağırlama Salonu Randevusu';
      default: return 'Özel Görüşme';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#141414] border border-[#d4af37] max-w-xl w-full my-8 p-6 sm:p-8 relative gold-glow-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#e5e2e1]/60 hover:text-white p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#d4af37]/20 border border-[#d4af37] text-[#f2ca50] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-2xl text-[#f7e7ce]">
              Randevu Talebiniz Alındı
            </h3>
            <p className="font-sans-luxury text-xs sm:text-sm text-[#e5e2e1]/80 max-w-md mx-auto leading-relaxed">
              Sayın <strong>{formData.fullName}</strong>, {formData.date} tarihinde saat {formData.time} için randevu ön kaydınız oluşturulmuştur. Müşteri temsilcimiz teyit için sizinle <strong>{formData.phone}</strong> numarasından iletişime geçecektir.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(`Merhaba, ${formData.fullName} adına ${formData.date} ${formData.time} tarihindeki "${getServiceLabel(formData.serviceType)}" randevum hakkında görüşmek istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#d4af37] text-[#0f0f0f] text-xs font-semibold uppercase tracking-wider font-sans-luxury flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp ile Hızlı Teyit Al
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 border border-[#f7e7ce]/20 text-xs font-sans-luxury uppercase text-[#e5e2e1]"
              >
                Tamam
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#d4af37]/40 bg-[#1a1914] text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Bursa Kapalıçarşı Mağazamız
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#f7e7ce]">
                Özel Salon Randevusu
              </h2>
              <p className="text-xs text-[#e5e2e1]/65 font-sans-luxury mt-2">
                Mehmet Hamdemirci Kuyumculuk VIP salonunda çayınız veya kahveniz eşliğinde mücevherlerinizi seçin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans-luxury">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                  Adınız ve Soyadınız:
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                    Telefon Numaranız:
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05XX XXX XX XX"
                    className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                    E-posta:
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@mail.com"
                    className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                  Hizmet Konusu:
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="ozel-tasarim">Özel Tasarım & Kişiye Özel Atölye İmalatı</option>
                  <option value="alyans-tektaş">Alyans, Tektaş & Düğün Takı Seti</option>
                  <option value="yatirim-danismanligi">Fiziki Altın & Külçe Yatırım Danışmanlığı</option>
                  <option value="vip-agirlama">VIP Özel Ağırlama Salonu Randevusu</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                    Tercih Edilen Tarih:
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                    Saat:
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="10:00">10:00</option>
                    <option value="11:30">11:30</option>
                    <option value="14:00">14:00</option>
                    <option value="15:30">15:30</option>
                    <option value="17:00">17:00</option>
                    <option value="18:30">18:30</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] mb-1">
                  Ek Notlar (İsteğe bağlı):
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="İlgilendiğiniz özel taş veya altın modeli..."
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 text-sm border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] text-xs font-semibold uppercase tracking-[0.2em] transition-all"
              >
                Randevu Talebini Onayla
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
