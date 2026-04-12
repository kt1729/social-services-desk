import type { LanguageCode } from '../types';

export interface PrintHeaderTranslation {
  title: string;
  subtitle: string;
  notes: string;
  date: string;
  scan: string;
  visit: string;
}

export const PRINT_HEADERS: Record<LanguageCode, PrintHeaderTranslation> = {
  en: {
    title: 'SOCIAL SERVICE DESK',
    subtitle: 'Resource Information Card',
    notes: 'Notes:',
    date: 'Date:',
    scan: 'Scan to open:',
    visit: 'Visit this website:',
  },
  es: {
    title: 'SERVICIO SOCIAL',
    subtitle: 'Tarjeta de Información',
    notes: 'Notas:',
    date: 'Fecha:',
    scan: 'Escanee para abrir:',
    visit: 'Visite este sitio web:',
  },
  zh: {
    title: '社会服务台',
    subtitle: '资源信息卡',
    notes: '备注：',
    date: '日期：',
    scan: '扫描打开：',
    visit: '访问此网站：',
  },
  ht: {
    title: 'SÈVIS SOSYAL',
    subtitle: 'Kat Enfòmasyon Resous',
    notes: 'Nòt:',
    date: 'Dat:',
    scan: 'Eskane pou ouvri:',
    visit: 'Vizite sit entènèt sa a:',
  },
};
