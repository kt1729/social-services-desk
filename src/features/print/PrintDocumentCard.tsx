import DOMPurify from 'dompurify';
import { QRCodeSVG } from 'qrcode.react';
import { getTranslatedText } from '../../shared/lib/translationUtils';
import { getCategoryLabel } from '../../shared/lib/categories';
import { PRINT_HEADERS } from '../../shared/lib/printHeaders';
import type { ServiceDocument, LanguageCode } from '../../shared/types';

interface PrintDocumentCardProps {
  document: ServiceDocument;
  lang: LanguageCode;
}

export default function PrintDocumentCard({ document: doc, lang }: PrintDocumentCardProps) {
  const headers = PRINT_HEADERS[lang];
  const today = new Date().toLocaleDateString();
  const isLink = doc.type === 'link' && doc.source?.url;
  const descriptionHtml = DOMPurify.sanitize(getTranslatedText(doc.description, lang));

  return (
    <div
      className="hidden print-block max-w-md mx-auto p-8"
      data-lang={lang}
      style={{ fontFamily: lang === 'zh' ? "'Noto Sans SC', sans-serif" : 'inherit' }}
    >
      <div className="border-2 border-gray-800 p-6">
        <h1 className="text-lg font-bold text-center">{headers.title}</h1>
        <p className="text-sm text-center mb-4">{headers.subtitle}</p>
        <hr className="border-gray-800 mb-4" />

        <h2 className="text-base font-bold mb-1">{getTranslatedText(doc.title, lang)}</h2>
        <p className="text-sm mb-3">{getCategoryLabel(doc.category, lang)}</p>

        {descriptionHtml && (
          <div
            className="text-sm mb-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

        {isLink && (
          <div className="mb-4">
            <p className="text-sm mb-1">{headers.visit}</p>
            <p className="text-sm font-medium mb-3">{doc.source.url}</p>
            {doc.printSettings?.showQRCode !== false && (
              <>
                <p className="text-sm mb-2">{headers.scan}</p>
                <div className="flex justify-center">
                  <QRCodeSVG value={doc.source.url!} size={120} />
                </div>
              </>
            )}
          </div>
        )}

        <p className="text-sm font-medium mb-2">{headers.notes}</p>
        <div className="space-y-3 mb-4">
          <div className="border-b border-gray-400" />
          <div className="border-b border-gray-400" />
        </div>

        <p className="text-xs text-right">
          {headers.date} {today}
        </p>
      </div>
    </div>
  );
}
