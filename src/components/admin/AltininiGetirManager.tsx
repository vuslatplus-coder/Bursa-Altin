import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Coins,
  Scale,
  BadgeDollarSign,
  MessageSquare,
  Award,
  Layers
} from 'lucide-react';
import { AltininiGetirConfig, AltininiGetirServiceItem } from '../../types';
import {
  listenToAltininiGetirConfig,
  saveAltininiGetirConfig,
} from '../../services/contentPagesService';
import { DEFAULT_ALTININI_GETIR_CONFIG } from '../../data/defaultContentPagesData';
import { ImageUploadField } from './ImageUploadField';

interface AltininiGetirManagerProps {
  onShowToast: (msg: string) => void;
}

export const AltininiGetirManager: React.FC<AltininiGetirManagerProps> = ({ onShowToast }) => {
  const [config, setConfig] = useState<AltininiGetirConfig>(DEFAULT_ALTININI_GETIR_CONFIG);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = listenToAltininiGetirConfig((data) => {
      if (data) {
        setConfig(data);
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAltininiGetirConfig(config);
      onShowToast('Altınını Getir sayfa ayarları ve hizmet kartları başarıyla kaydedildi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Altınını Getir sayfa ayarlarını varsayılan ayarlara döndürmek istiyor musunuz?')) {
      setConfig(DEFAULT_ALTININI_GETIR_CONFIG);
      onShowToast('Varsayılan ayarlar yüklendi. Değişiklikleri kaydetmeyi unutmayınız.');
    }
  };

  const handleUpdateField = (field: keyof AltininiGetirConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddService = () => {
    const newService: AltininiGetirServiceItem = {
      id: `srv-${Date.now()}`,
      title: 'Yeni Altın Hizmeti',
      subtitle: 'Özel Avantaj',
      description: 'Hizmet açıklaması buraya gelecek.',
      iconName: 'Sparkles',
      order: (config.services?.length || 0) + 1,
      active: true,
    };
    setConfig((prev) => ({
      ...prev,
      services: [...(prev.services || []), newService],
    }));
  };

  const handleUpdateService = (id: string, field: keyof AltininiGetirServiceItem, value: any) => {
    setConfig((prev) => ({
      ...prev,
      services: (prev.services || []).map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Bu hizmet kartını silmek istediğinize emin misiniz?')) {
      setConfig((prev) => ({
        ...prev,
        services: (prev.services || []).filter((s) => s.id !== id),
      }));
    }
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= (config.services || []).length) return;
    const newServices = [...(config.services || [])];
    const [moved] = newServices.splice(index, 1);
    newServices.splice(targetIndex, 0, moved);
    setConfig((prev) => ({
      ...prev,
      services: newServices.map((s, idx) => ({ ...s, order: idx + 1 })),
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans-luxury">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#c89d3a]" />
            Altınını Getir & Değerleme Hizmetleri Yönetimi
          </h2>
          <p className="text-xs text-gray-400">
            Altın bozdurma, takas, değerleme kartları ve WhatsApp danışma metinlerini Firebase'den güncelleyin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Varsayılana Döndür</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Kaydediliyor...' : 'Firebase’e Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* Main Form: Page Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: General Page Info & Cover Image */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c89d3a]" />
              <span>Sayfa Başlığı ve Genel Bilgiler</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Sayfa Ana Başlığı</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-semibold text-xs outline-none focus:border-[#c89d3a]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Açıklama Metni</label>
                <textarea
                  rows={3}
                  value={config.description}
                  onChange={(e) => handleUpdateField('description', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#c89d3a]"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Sayfa Kapak Görseli (Görsel Yükle veya URL)"
                  imageUrl={config.coverImage}
                  onImageChange={(url) => handleUpdateField('coverImage', url)}
                  storagePath="altinini-getir/cover"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp & CTA Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Buton ve WhatsApp İletişim Ayarları</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Birincil Buton Metni</label>
                <input
                  type="text"
                  value={config.ctaPrimaryText}
                  onChange={(e) => handleUpdateField('ctaPrimaryText', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">İkincil WhatsApp Buton Metni</label>
                <input
                  type="text"
                  value={config.ctaSecondaryText}
                  onChange={(e) => handleUpdateField('ctaSecondaryText', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">WhatsApp Numarası (Uluslararası formatta)</label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => handleUpdateField('whatsappNumber', e.target.value)}
                  placeholder="+905321234567"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Varsayılan WhatsApp Mesaj Şablonu</label>
                <textarea
                  rows={2}
                  value={config.whatsappMessage}
                  onChange={(e) => handleUpdateField('whatsappMessage', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hurda Altın / Scrap Gold SEO Text */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#c89d3a]" />
              <span>Hurda Altın & Değerleme Bilgi Kutusu</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Kutu Başlığı</label>
                <input
                  type="text"
                  value={config.scrapGoldInfoTitle || ''}
                  onChange={(e) => handleUpdateField('scrapGoldInfoTitle', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Kutu Açıklama İçeriği</label>
                <textarea
                  rows={3}
                  value={config.scrapGoldInfoContent || ''}
                  onChange={(e) => handleUpdateField('scrapGoldInfoContent', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 6 Core Service Cards Manager */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c89d3a]" />
              <span>Hizmet Kartları ({config.services?.length || 0})</span>
            </h3>

            <button
              onClick={handleAddService}
              className="px-3.5 py-1.5 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Hizmet Ekle</span>
            </button>
          </div>

          <div className="space-y-4">
            {(config.services || []).map((service, index) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3 transition-all hover:border-amber-200"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-[#996515] text-[10px] font-mono font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{service.title}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateService(service.id, 'active', !service.active)}
                      className={`p-1.5 rounded transition-colors ${
                        service.active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={service.active ? 'Aktif' : 'Gizli'}
                    >
                      {service.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleMoveService(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                      title="Yukarı Taşı"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleMoveService(index, 'down')}
                      disabled={index === (config.services || []).length - 1}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                      title="Aşağı Taşı"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      title="Hizmeti Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Hizmet Başlığı</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleUpdateService(service.id, 'title', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Alt Başlık / Vurgu</label>
                    <input
                      type="text"
                      value={service.subtitle}
                      onChange={(e) => handleUpdateService(service.id, 'subtitle', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 font-bold mb-1">Açıklama</label>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => handleUpdateService(service.id, 'description', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">İkon Türü</label>
                    <select
                      value={service.iconName}
                      onChange={(e) => handleUpdateService(service.id, 'iconName', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                    >
                      <option value="Scale">Hassas Terazi (Scale)</option>
                      <option value="BadgeDollarSign">Dolar/Nakit Rozeti (BadgeDollarSign)</option>
                      <option value="Coins">Altın Sikke (Coins)</option>
                      <option value="Sparkles">Işıltı & Yenileme (Sparkles)</option>
                      <option value="RefreshCw">Dönüşüm / Değişim (RefreshCw)</option>
                      <option value="ArrowLeftRight">Takas (ArrowLeftRight)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
