import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import GoogleAnalytics from './GoogleAnalytics';
import { QRCodeSVG } from 'qrcode.react';
import { SUPPORTED_LANGUAGES } from '../../shared/lib/languages';
import type { LanguageCode } from '../../shared/types';

export default function PublicLayout() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [search, setSearch] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const qrUrl = `${window.location.origin}/public`;
  const logoUrl = import.meta.env.VITE_PUBLIC_LOGO_URL || '/logo.webp';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GoogleAnalytics />
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/public" className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
            <span className="text-lg font-bold text-gray-900 hidden sm:inline">
              Community Resources
            </span>
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex-1 sm:min-w-[260px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Search resources and documents'
                    : lang === 'es'
                      ? 'Buscar recursos y documentos'
                      : lang === 'zh'
                        ? '\u641C\u7D22\u8D44\u6E90\u548C\u6587\u6863'
                        : 'Chèche resous ak dokiman'
                }
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 bg-white"
              />
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LanguageCode)}
              className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              aria-label={
                lang === 'en'
                  ? 'Open QR code'
                  : lang === 'es'
                    ? 'Abrir código QR'
                    : lang === 'zh'
                      ? '打开二维码'
                      : 'Louvri kòd QR'
              }
              className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M3 3h7v7H3V3Zm2 2v3h3V5H5Zm9-2h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Zm6-2h2v2h-2v-2Zm0 4h2v2h-2v-2Zm2-2h2v2h-2v-2Zm2-2h2v2h-2v-2Zm0 4h2v2h-2v-2Zm2-2h2v2h-2v-2Zm-4 4h6v2h-6v-2Zm4-6h2v2h-2v-2Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close QR code"
            onClick={() => setQrOpen(false)}
          />
          <div
            className="relative bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-sm p-6 text-center"
            data-testid="public-qr-modal"
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label={
                lang === 'en'
                  ? 'Close QR code'
                  : lang === 'es'
                    ? 'Cerrar código QR'
                    : lang === 'zh'
                      ? '关闭二维码'
                      : 'Fèmen kòd QR'
              }
              onClick={() => setQrOpen(false)}
            >
              ×
            </button>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {lang === 'en'
                ? 'Scan to access the resources on your phone.'
                : lang === 'es'
                  ? 'Escanea para acceder desde tu teléfono'
                  : lang === 'zh'
                    ? '扫码在手机上访问此页面'
                    : 'Eskane pou w ka jwenn paj sa a sou telefòn ou'}
            </h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block print-border-none">
              <QRCodeSVG
                value={qrUrl}
                size={180}
                level="H"
                imageSettings={{
                  src: logoUrl,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{qrUrl}</p>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <Outlet context={{ lang, search }} />
      </main>

      <footer className="bg-white border-t border-gray-200 px-4 py-3 text-center text-xs text-gray-400">
        Crafted with NYC spirit
      </footer>
    </div>
  );
}
