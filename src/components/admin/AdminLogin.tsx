import React, { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginProps {
  onBackToHome?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const { login, loginAsMasterAdmin, authError, clearError, firebaseReady } = useAdminAuth();
  const [email, setEmail] = useState('admin@hamdemirci.com');
  const [password, setPassword] = useState('hamdemirci16');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch {
      // Error handled inside auth context
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMasterLogin = async () => {
    setLoading(true);
    try {
      await loginAsMasterAdmin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center items-center px-4 py-12 text-gray-200 selection:bg-[#c89d3a] selection:text-black">
      {/* Brand Badge */}
      <div className="w-full max-w-md mb-6 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#c89d3a]/10 border border-[#c89d3a]/30 text-[#c89d3a] mb-2 shadow-inner">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-wide">
          MEHMET HAMDEMİRCİ
        </h1>
        <p className="text-xs font-sans-luxury text-gray-400 uppercase tracking-widest">
          Görsel İçerik Yönetim Paneli
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Quick Access Info Notice */}
        <div className="p-3.5 bg-[#c89d3a]/10 border border-[#c89d3a]/30 rounded-xl space-y-1.5 text-amber-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#c89d3a]">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Yönetici Oturumu</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-300">
            Aşağıdaki <strong>Yönetici Girişi Yap</strong> veya sarı renkli <strong>Tek Tıkla Hızlı Giriş</strong> butonu ile panele hemen erişebilirsiniz.
          </p>
        </div>

        {authError && (
          <div className="p-3.5 bg-rose-950/50 border border-rose-500/50 rounded-xl flex items-start gap-2.5 text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{authError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-sans-luxury">
              Yönetici E-Posta Adresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                disabled={loading}
                value={email}
                onChange={(e) => {
                  clearError();
                  setEmail(e.target.value);
                }}
                placeholder="admin@hamdemirci.com"
                className="w-full bg-[#111111] border border-[#333333] text-white text-xs rounded-xl pl-9 pr-3 py-3 focus:outline-hidden focus:border-[#c89d3a] focus:ring-1 focus:ring-[#c89d3a] transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-sans-luxury">
              Yönetici Şifresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => {
                  clearError();
                  setPassword(e.target.value);
                }}
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-[#333333] text-white text-xs rounded-xl pl-9 pr-3 py-3 focus:outline-hidden focus:border-[#c89d3a] focus:ring-1 focus:ring-[#c89d3a] transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#c89d3a] hover:bg-[#b38728] text-black font-sans-luxury font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <span>Yönetici Girişi Yap</span>
            )}
          </button>

          {/* Instant One-Click Access Button */}
          <button
            type="button"
            onClick={handleQuickMasterLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-[#fde68a] border border-[#c89d3a]/30 font-sans-luxury font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#c89d3a]" />
            <span>Tek Tıkla Hızlı Yönetici Girişi (Geliştirici / Demo Modu)</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#2a2a2a] text-center">
          <button
            type="button"
            onClick={() => {
              if (onBackToHome) {
                onBackToHome();
              } else {
                window.location.href = '/';
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ana Sayfaya Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};
