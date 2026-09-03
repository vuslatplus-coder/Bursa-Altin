import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Edit2,
  Check,
  X,
  Link as LinkIcon,
  Grid,
  Database,
  HelpCircle,
  FolderPlus,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { NavigationGroup, NavigationColumn, NavigationItem } from '../../types';
import {
  listenToNavigationGroups,
  saveAllNavigationGroups,
  saveNavigationGroup,
  deleteNavigationGroup,
  seedDefaultNavigationIfEmpty,
} from '../../services/navigationService';
import { DEFAULT_NAVIGATION_GROUPS } from '../../data/defaultNavigationData';
import { ImageUploadField } from './ImageUploadField';
import { LinkSelectorInput, resolveLinkDescription } from './LinkSelectorInput';

interface MenuManagerProps {
  onShowToast: (msg: string) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ onShowToast }) => {
  const [groups, setGroups] = useState<NavigationGroup[]>(DEFAULT_NAVIGATION_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(DEFAULT_NAVIGATION_GROUPS[0]?.id || 'nav-taki');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Group Modal State
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [newGroupLabel, setNewGroupLabel] = useState('');
  const [newGroupSlug, setNewGroupSlug] = useState('');
  const [newGroupDisplayType, setNewGroupDisplayType] = useState<'megamenu' | 'link' | 'dropdown'>('megamenu');

  // Firebase Schema Info Box Toggle
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);

  // Subscribe to real-time navigation groups from Firebase Firestore
  useEffect(() => {
    const unsub = listenToNavigationGroups((data) => {
      if (data && data.length > 0) {
        setGroups(data);
      }
    });
    return () => unsub();
  }, []);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  // Save all changes to Firestore
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveAllNavigationGroups(groups);
      onShowToast('Menü ve kategori yapısı Firebase Firestore (menu_gruplari) koleksiyonuna başarıyla kaydedildi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Reset / Seed Default Navigation
  const handleResetDefaults = async () => {
    if (confirm('Tüm menüyü varsayılan Bursa Altın yapısına (TAKI, PIRLANTA, ALTIN & YATIRIM, ÖZEL GÜNLER, FIRSATLAR, ALTIN REHBERİ) sıfırlamak istiyor musunuz?')) {
      setLoading(true);
      try {
        const seeded = await seedDefaultNavigationIfEmpty(true);
        setGroups(seeded);
        onShowToast('Menü yapısı varsayılan ayarlara sıfırlandı ve Firebase\'e aktarıldı.');
      } catch (err: any) {
        onShowToast(`Hata: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Group Operations
  const handleCreateNewGroup = () => {
    if (!newGroupLabel.trim()) {
      onShowToast('Lütfen menü başlığı girin.');
      return;
    }

    const slug = newGroupSlug.trim()
      ? newGroupSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
      : newGroupLabel.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const groupId = `nav-${slug || Date.now()}`;

    const newGroup: NavigationGroup = {
      id: groupId,
      label: newGroupLabel.trim().toUpperCase(),
      slug: slug,
      order: groups.length + 1,
      active: true,
      displayType: newGroupDisplayType,
      featuredTitle: `${newGroupLabel.trim()} Koleksiyonu`,
      featuredSubtitle: 'Özel tasarım ve el işçiliği modelleri keşfedin.',
      featuredLink: `kategori:${slug}`,
      featuredImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      columns: newGroupDisplayType === 'megamenu' ? [
        {
          id: `col-${slug}-1`,
          title: 'Popüler Modeller',
          order: 1,
          active: true,
          items: [
            {
              id: `item-${Date.now()}-1`,
              label: 'Yeni Ürün Modelleri',
              slug: `${slug}-yeni`,
              link: `kategori:${slug}`,
              order: 1,
              active: true,
              badge: 'Yeni'
            },
            {
              id: `item-${Date.now()}-2`,
              label: 'Çok Satanlar',
              slug: `${slug}-coksatan`,
              link: `kategori:${slug}`,
              order: 2,
              active: true,
              badge: 'Çok Satan'
            }
          ]
        }
      ] : []
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    setSelectedGroupId(newGroup.id);
    setIsAddGroupModalOpen(false);
    setNewGroupLabel('');
    setNewGroupSlug('');
    onShowToast(`"${newGroup.label}" menü başlığı eklendi. Kaydetmek için 'Firebase'e Kaydet' butonuna basabilirsiniz.`);
  };

  const handleDeleteGroup = (groupId: string, groupLabel: string) => {
    if (confirm(`"${groupLabel}" menü başlığını ve altındaki tüm sütunları silmek istediğinize emin misiniz?`)) {
      const filtered = groups.filter((g) => g.id !== groupId);
      const reordered = filtered.map((g, idx) => ({ ...g, order: idx + 1 }));
      setGroups(reordered);
      if (selectedGroupId === groupId) {
        setSelectedGroupId(reordered[0]?.id || '');
      }
      deleteNavigationGroup(groupId).catch(console.warn);
      onShowToast(`"${groupLabel}" menü başlığı silindi.`);
    }
  };

  const handleMoveGroup = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= groups.length) return;
    const newGroups = [...groups];
    const [moved] = newGroups.splice(index, 1);
    newGroups.splice(targetIndex, 0, moved);
    const updated = newGroups.map((g, idx) => ({ ...g, order: idx + 1 }));
    setGroups(updated);
  };

  const handleToggleGroupActive = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, active: !g.active } : g))
    );
  };

  const handleUpdateGroupField = (field: keyof NavigationGroup, value: any) => {
    if (!selectedGroup) return;
    setGroups((prev) =>
      prev.map((g) => (g.id === selectedGroup.id ? { ...g, [field]: value } : g))
    );
  };

  // Column Operations inside selected group
  const handleAddColumn = () => {
    if (!selectedGroup) return;
    const newColId = `col-${selectedGroup.slug}-${Date.now()}`;
    const newCol: NavigationColumn = {
      id: newColId,
      title: 'Yeni Sütun',
      order: (selectedGroup.columns?.length || 0) + 1,
      active: true,
      items: [
        {
          id: `item-${Date.now()}`,
          label: 'Yeni Kategori / Alt Başlık',
          slug: `kategori-${Date.now()}`,
          link: `kategori:${selectedGroup.slug || 'all'}`,
          order: 1,
          active: true,
          badge: '',
        },
      ],
    };

    const updatedCols = [...(selectedGroup.columns || []), newCol];
    handleUpdateGroupField('columns', updatedCols);
  };

  const handleUpdateColumn = (colId: string, field: keyof NavigationColumn, value: any) => {
    if (!selectedGroup) return;
    const updatedCols = (selectedGroup.columns || []).map((col) =>
      col.id === colId ? { ...col, [field]: value } : col
    );
    handleUpdateGroupField('columns', updatedCols);
  };

  const handleDeleteColumn = (colId: string) => {
    if (!selectedGroup) return;
    if (confirm('Bu sütunu ve altındaki tüm kategorileri silmek istediğinize emin misiniz?')) {
      const updatedCols = (selectedGroup.columns || []).filter((col) => col.id !== colId);
      handleUpdateGroupField('columns', updatedCols);
    }
  };

  // Sub-item Operations inside a column
  const handleAddItem = (colId: string) => {
    if (!selectedGroup) return;
    const newItemId = `item-${Date.now()}`;
    const newItem: NavigationItem = {
      id: newItemId,
      label: 'Yeni Alt Başlık',
      slug: `urun-${Date.now()}`,
      link: `kategori:${selectedGroup.slug || 'all'}`,
      order: 10,
      active: true,
      badge: '',
    };

    const updatedCols = (selectedGroup.columns || []).map((col) => {
      if (col.id === colId) {
        return {
          ...col,
          items: [...(col.items || []), newItem],
        };
      }
      return col;
    });

    handleUpdateGroupField('columns', updatedCols);
  };

  const handleUpdateItem = (
    colId: string,
    itemId: string,
    field: keyof NavigationItem,
    value: any
  ) => {
    if (!selectedGroup) return;
    const updatedCols = (selectedGroup.columns || []).map((col) => {
      if (col.id === colId) {
        return {
          ...col,
          items: (col.items || []).map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          ),
        };
      }
      return col;
    });

    handleUpdateGroupField('columns', updatedCols);
  };

  const handleDeleteItem = (colId: string, itemId: string) => {
    if (!selectedGroup) return;
    const updatedCols = (selectedGroup.columns || []).map((col) => {
      if (col.id === colId) {
        return {
          ...col,
          items: (col.items || []).filter((item) => item.id !== itemId),
        };
      }
      return col;
    });

    handleUpdateGroupField('columns', updatedCols);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans-luxury">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#121215] text-white rounded-2xl border border-[#27272a] shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#c89d3a]" />
            <h2 className="text-base font-bold text-white font-serif tracking-wide">
              Navigasyon, Mega Menü & Kategori Yönetimi
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-semibold">
              Firebase Canlı
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Üst menü başlıklarını (TAKI, PIRLANTA, vb.), mega menü sütunlarını (Yüzükler, Kolyeler) ve alt kategorileri buradan kolayca ekleyip düzenleyebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
            className="px-3 py-2 bg-[#1e1e24] hover:bg-[#282832] text-gray-300 border border-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{showFirebaseGuide ? 'Firebase Rehberini Gizle' : 'Firebase Şema Rehberi'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={loading}
            className="px-4 py-2 bg-[#1e1e24] hover:bg-[#282832] text-gray-300 border border-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Varsayılana Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer hover:shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Kaydediliyor...' : 'Tümünü Firebase’e Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* Firebase Firestore Schema Info Guide (Expandable) */}
      {showFirebaseGuide && (
        <div className="p-5 bg-[#18181b] border border-amber-500/30 rounded-2xl text-xs space-y-3 animate-fade-in text-gray-300">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Database className="w-4 h-4" />
              <span>Firebase Firestore Veritabanı Yapısı & Anlaşılır Alan İsimlendirmeleri</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">Koleksiyon: menu_gruplari / navigationGroups</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
            <div className="p-3 bg-[#121214] rounded-xl border border-gray-800 space-y-1.5">
              <p className="text-amber-300 font-bold">1. Ana Koleksiyon Adı</p>
              <p className="text-gray-400">
                Firebase Firestore konsolunda veriler <code className="text-amber-400 font-mono">menu_gruplari</code> (ve uyumluluk için <code className="text-amber-400 font-mono">navigationGroups</code>) altında tutulur.
              </p>
            </div>

            <div className="p-3 bg-[#121214] rounded-xl border border-gray-800 space-y-1.5">
              <p className="text-amber-300 font-bold">2. Doküman İsimleri</p>
              <p className="text-gray-400">
                Her menü başlığı açık ve anlaşılır doküman ID'lerine sahiptir: <code className="text-emerald-400 font-mono">nav-taki</code>, <code className="text-emerald-400 font-mono">nav-pirlanta</code>, <code className="text-emerald-400 font-mono">nav-altin-yatirim</code> vb.
              </p>
            </div>

            <div className="p-3 bg-[#121214] rounded-xl border border-gray-800 space-y-1.5">
              <p className="text-amber-300 font-bold">3. Alanlar (Fields)</p>
              <p className="text-gray-400">
                <strong className="text-white">label</strong> (Başlık), <strong className="text-white">displayType</strong> (Görünüm Türü), <strong className="text-white">columns</strong> (Sütunlar dizisi), <strong className="text-white">items</strong> (Alt öğeler, linkler ve rozetler).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Group List + Right Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Menu Groups List (TAKI, PIRLANTA, ALTIN & YATIRIM, etc.) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            
            {/* Header & Add Button */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Ana Menü Başlıkları
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">
                  {groups.length} Aktif Başlık
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsAddGroupModalOpen(true)}
                className="px-3 py-1.5 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Menü Ekle</span>
              </button>
            </div>

            {/* Groups List */}
            <div className="space-y-2">
              {groups.map((group, index) => {
                const isSelected = selectedGroup?.id === group.id;

                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/90 border-[#c89d3a] shadow-xs'
                        : 'bg-gray-50/70 border-gray-200/80 hover:bg-gray-100/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-gray-200 text-[10px] font-mono font-bold flex items-center justify-center text-gray-700 shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${
                          isSelected ? 'text-[#996515]' : 'text-gray-900'
                        }`}>
                          {group.label}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                          <span>{group.displayType === 'megamenu' ? `${group.columns?.length || 0} Sütun` : 'Doğrudan Link'}</span>
                          <span>•</span>
                          <span className="truncate">{group.slug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleGroupActive(group.id)}
                        className={`p-1.5 rounded transition-colors ${
                          group.active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-200'
                        }`}
                        title={group.active ? 'Menüde Görünür' : 'Gizli'}
                      >
                        {group.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveGroup(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
                        title="Yukarı Taşı"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveGroup(index, 'down')}
                        disabled={index === groups.length - 1}
                        className="p-1 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
                        title="Aşağı Taşı"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(group.id, group.label)}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Menü Başlığını Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column: Selected Group Deep Configuration */}
        {selectedGroup ? (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Group General Settings Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#c89d3a]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    "{selectedGroup.label}" Menü Başlığı Detayları
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-amber-100 text-[#996515] font-bold font-mono">
                    ID: {selectedGroup.id}
                  </span>
                  <span className="text-[11px] px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold font-mono">
                    Slug: {selectedGroup.slug}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Menü Başlığı (Label)</label>
                  <input
                    type="text"
                    value={selectedGroup.label}
                    onChange={(e) => handleUpdateGroupField('label', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-[#c89d3a] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Bağlantı Slug / Kodu</label>
                  <input
                    type="text"
                    value={selectedGroup.slug}
                    onChange={(e) => handleUpdateGroupField('slug', e.target.value.toLowerCase())}
                    placeholder="örn: taki, pirlanta, gumus"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-[#c89d3a] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Görünüm Türü</label>
                  <select
                    value={selectedGroup.displayType}
                    onChange={(e) => handleUpdateGroupField('displayType', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-[#c89d3a] focus:bg-white"
                  >
                    <option value="megamenu">Mega Menü (Çok Sütunlu & Görselli)</option>
                    <option value="link">Doğrudan Sayfa Bağlantısı</option>
                    <option value="dropdown">Klasik Açılır Menü</option>
                  </select>
                </div>
              </div>

              {/* Mega Menu Featured Promo Card Settings */}
              {selectedGroup.displayType === 'megamenu' && (
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c89d3a]" />
                    <h4 className="text-xs font-bold text-gray-900">
                      Mega Menü Sağ Taraf Özel Vitrin / Tanıtım Kartı
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Kart Başlığı</label>
                      <input
                        type="text"
                        value={selectedGroup.featuredTitle || ''}
                        onChange={(e) => handleUpdateGroupField('featuredTitle', e.target.value)}
                        placeholder="Örn: Zarafetin İmzası"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#c89d3a]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Kart Alt Başlığı / Açıklama</label>
                      <input
                        type="text"
                        value={selectedGroup.featuredSubtitle || ''}
                        onChange={(e) => handleUpdateGroupField('featuredSubtitle', e.target.value)}
                        placeholder="Örn: 14 ve 22 ayar usta işçilikli koleksiyon"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#c89d3a]"
                      />
                    </div>
                  </div>

                  <div>
                    <LinkSelectorInput
                      label="Kart Butonu Tıklama Hedefi"
                      subLabel="Koleksiyonu Gör butonuna tıklandığında açılacak kategori veya sayfa"
                      value={selectedGroup.featuredLink || `kategori:${selectedGroup.slug}`}
                      onChange={(val) => handleUpdateGroupField('featuredLink', val)}
                    />
                  </div>

                  <div>
                    <ImageUploadField
                      label="Kart Görseli (Görsel Yükle veya URL)"
                      imageUrl={selectedGroup.featuredImage || ''}
                      onImageChange={(url) => handleUpdateGroupField('featuredImage', url)}
                      storagePath={`navigation/${selectedGroup.id}/featured`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu Columns & Items Editor */}
            {selectedGroup.displayType === 'megamenu' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-[#c89d3a]" />
                    <h3 className="text-sm font-bold text-gray-900">
                      Mega Menü Sütunları ve Kategoriler ({selectedGroup.columns?.length || 0} Sütun)
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddColumn}
                    className="px-3.5 py-1.5 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Yeni Sütun Ekle</span>
                  </button>
                </div>

                {(!selectedGroup.columns || selectedGroup.columns.length === 0) ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-2">
                    <p className="text-xs text-gray-500">Bu grupta henüz kategori sütunu bulunmuyor.</p>
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="px-4 py-2 bg-amber-50 text-[#c89d3a] text-xs font-bold rounded-lg hover:bg-amber-100 cursor-pointer"
                    >
                      İlk Sütunu Oluştur (Örn: Yüzükler, Kolyeler)
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGroup.columns.map((col, colIndex) => (
                      <div
                        key={col.id}
                        className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between"
                      >
                        {/* Column Header */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">
                              Sütun #{colIndex + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateColumn(col.id, 'active', !col.active)}
                                className={`p-1 rounded transition-colors ${col.active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                title={col.active ? 'Aktif Sütun' : 'Gizli Sütun'}
                              >
                                {col.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteColumn(col.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Sütunu Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-gray-600 font-bold mb-1">
                              Sütun Başlığı (Örn: YÜZÜKLER, BİLEZİKLER)
                            </label>
                            <input
                              type="text"
                              value={col.title}
                              onChange={(e) => handleUpdateColumn(col.id, 'title', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs font-bold text-gray-900 outline-none focus:border-[#c89d3a] focus:bg-white"
                            />
                          </div>
                        </div>

                        {/* Items under this column */}
                        <div className="space-y-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span className="font-bold">Kategori & Alt Başlıklar ({col.items?.length || 0})</span>
                            <button
                              type="button"
                              onClick={() => handleAddItem(col.id)}
                              className="text-[#996515] hover:text-[#78350f] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Öğe Ekle</span>
                            </button>
                          </div>

                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {(col.items || []).map((item) => (
                              <div
                                key={item.id}
                                className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2.5 text-xs shadow-2xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) =>
                                      handleUpdateItem(col.id, item.id, 'label', e.target.value)
                                    }
                                    placeholder="Örn: Ajda Bilezik, Alyans"
                                    className="flex-1 bg-white border border-gray-300 rounded p-1.5 text-xs font-semibold outline-none focus:border-[#c89d3a]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteItem(col.id, item.id)}
                                    className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                                    title="Öğeyi Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Link / Target Selector */}
                                <div>
                                  <LinkSelectorInput
                                    label="Tıklama Hedefi / Kategori"
                                    subLabel="Tıklanınca açılacak ürün kategorisi veya sayfa"
                                    value={item.link}
                                    onChange={(val) =>
                                      handleUpdateItem(col.id, item.id, 'link', val)
                                    }
                                  />
                                </div>

                                {/* Badge */}
                                <div className="flex items-center gap-2">
                                  <Tag className="w-3 h-3 text-amber-600 shrink-0" />
                                  <input
                                    type="text"
                                    value={item.badge || ''}
                                    onChange={(e) =>
                                      handleUpdateItem(col.id, item.id, 'badge', e.target.value)
                                    }
                                    placeholder="Özel Rozet (örn: Çok Satan, Popüler, Özel, İndirim)"
                                    className="flex-1 bg-white border border-gray-300 rounded p-1 text-[11px] text-gray-700 outline-none focus:border-[#c89d3a]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">Lütfen düzenlemek için sol taraftan bir menü başlığı seçin.</p>
          </div>
        )}

      </div>

      {/* Add New Group Modal */}
      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-gray-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#c89d3a]" />
                <h3 className="text-sm font-bold">Yeni Menü Başlığı Ekle</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGroupModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Menü Başlığı</label>
                <input
                  type="text"
                  value={newGroupLabel}
                  onChange={(e) => setNewGroupLabel(e.target.value)}
                  placeholder="Örn: GÜMÜŞ & HEDİYE, ERKEK, SAAT"
                  className="w-full bg-[#121214] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-[#c89d3a]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">URL / Slug Kodu (İsteğe Bağlı)</label>
                <input
                  type="text"
                  value={newGroupSlug}
                  onChange={(e) => setNewGroupSlug(e.target.value)}
                  placeholder="Örn: gumus, erkek, saat"
                  className="w-full bg-[#121214] border border-gray-700 rounded-lg p-2.5 text-white font-mono outline-none focus:border-[#c89d3a]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Görünüm Türü</label>
                <select
                  value={newGroupDisplayType}
                  onChange={(e) => setNewGroupDisplayType(e.target.value as any)}
                  className="w-full bg-[#121214] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-[#c89d3a]"
                >
                  <option value="megamenu">Mega Menü (Açılır Sütunlar & Görselli)</option>
                  <option value="link">Doğrudan Sayfa Linki</option>
                  <option value="dropdown">Klasik Açılır Menü</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsAddGroupModalOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleCreateNewGroup}
                className="px-5 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Menü Başlığını Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
