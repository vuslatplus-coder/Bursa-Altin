/**
 * Category & Navigation URL Resolver
 * Translates any raw menu link, slug, or Firestore category ID
 * to a standardized catalog category and optional filter.
 */

export interface ResolvedNavigation {
  targetTab: 'anasayfa' | 'katalog' | 'koleksiyon' | 'kurlar' | 'rehber' | 'altinini-getir' | 'blog';
  category: string; // 'yuzuk', 'bilezik', 'kolye', 'kupe', 'alyans', 'yatirim', 'ozel', 'all'
  subCategory?: string; // 'tektas', 'baget', 'bestas', 'ajda', 'burma', 'hasir', 'kelepce', 'kulce', 'sarrafiye', etc.
  subCategoryLabel?: string;
  searchQuery?: string;
  guideSlug?: string;
  pageSlug?: string;
}

export function resolveNavigationLink(rawLink: string, rawSlug?: string): ResolvedNavigation {
  if (!rawLink && !rawSlug) {
    return { targetTab: 'katalog', category: 'all' };
  }

  let link = (rawLink || rawSlug || '').trim().toLowerCase();

  // Strip prefixes like 'rehber:', 'guide:', 'page:', 'tab:'
  if (link.startsWith('rehber:') || link.startsWith('guide:') || link.startsWith('/rehber/')) {
    const slug = link.replace(/^(rehber:|guide:|\/rehber\/)/, '').trim();
    return { targetTab: 'rehber', category: 'all', guideSlug: slug || rawSlug };
  }

  if (link.startsWith('page:') || link.startsWith('sayfa:') || link.startsWith('/sayfa/')) {
    const slug = link.replace(/^(page:|sayfa:|\/sayfa\/)/, '').trim();
    return { targetTab: 'anasayfa', category: 'all', pageSlug: slug || rawSlug };
  }

  if (link.startsWith('tab:')) {
    const tabName = link.replace('tab:', '').trim();
    if (tabName === 'kurlar' || tabName === 'canli-kurlar') return { targetTab: 'kurlar', category: 'all' };
    if (tabName === 'altinini-getir') return { targetTab: 'altinini-getir', category: 'all' };
    if (tabName === 'rehber') return { targetTab: 'rehber', category: 'all' };
    if (tabName === 'koleksiyon') return { targetTab: 'koleksiyon', category: 'all' };
    if (tabName === 'anasayfa') return { targetTab: 'anasayfa', category: 'all' };
    return { targetTab: 'katalog', category: 'all' };
  }

  // Clean catalog / category prefixes
  link = link
    .replace(/^kategori:/, '')
    .replace(/^category:/, '')
    .replace(/^cat:/, '')
    .replace(/^katalog:/, '')
    .replace(/^\/kategori\//, '')
    .replace(/^\/katalog\?category=/, '')
    .trim();

  // 1. SPECIFIC SUB-CATEGORIES FIRST (Exact match)
  // Tektaş Pırlanta
  if (link === 'tektas' || link === 'tek-tas' || link === 'tektas-yuzuk' || link === 'item-tektas') {
    return { targetTab: 'katalog', category: 'yuzuk', subCategory: 'tektas', subCategoryLabel: 'Tektaş Pırlanta' };
  }
  // Baget Yüzük
  if (link === 'baget' || link === 'baget-yuzuk' || link === 'item-baget') {
    return { targetTab: 'katalog', category: 'yuzuk', subCategory: 'baget', subCategoryLabel: 'Baget Pırlanta' };
  }
  // Beştaş Yüzük
  if (link === 'bestas' || link === 'bes-tas' || link === 'bestas-yuzuk' || link === 'item-bestas') {
    return { targetTab: 'katalog', category: 'yuzuk', subCategory: 'bestas', subCategoryLabel: 'Beştaş Pırlanta' };
  }
  // Altın Yüzük (Klasik / 22K)
  if (link === 'altin-yuzuk' || link === 'altinyuzuk' || link === 'item-altin-yuzuk') {
    return { targetTab: 'katalog', category: 'yuzuk', subCategory: 'altin-yuzuk', subCategoryLabel: 'Altın Yüzükler' };
  }

  // Alyans
  if (link === 'alyans' || link === 'alyanslar' || link === 'cift-alyans' || link === 'item-alyans' || link.includes('alyans')) {
    return { targetTab: 'katalog', category: 'alyans', subCategory: 'alyans', subCategoryLabel: 'Alyans Modelleri' };
  }

  // Ajda Bilezik
  if (link === 'ajda-bilezik' || link === 'ajda' || link === 'item-ajda-bilezik') {
    return { targetTab: 'katalog', category: 'bilezik', subCategory: 'ajda', subCategoryLabel: 'Ajda Bilezik' };
  }
  // Burma Bilezik
  if (link === 'burma-bilezik' || link === 'burma' || link === 'item-burma-bilezik') {
    return { targetTab: 'katalog', category: 'bilezik', subCategory: 'burma', subCategoryLabel: 'Burma Bilezik' };
  }
  // Hasır Bilezik
  if (link === 'hasir-bilezik' || link === 'hasir' || link === 'trabzon-hasiri') {
    return { targetTab: 'katalog', category: 'bilezik', subCategory: 'hasir', subCategoryLabel: 'Hasır Bilezik & Kelepçe' };
  }
  // Kelepçe / Künye
  if (link === 'kelepce' || link === 'kunye' || link === 'item-kelepce' || link === 'item-kunye') {
    return { targetTab: 'katalog', category: 'bilezik', subCategory: 'kelepce', subCategoryLabel: 'Kelepçe & Künye' };
  }

  // Külçe Altın / Has Gram
  if (link === 'kulce' || link === 'kulce-altin' || link === 'gram-altin' || link === 'item-gram-altin') {
    return { targetTab: 'katalog', category: 'yatirim', subCategory: 'kulce', subCategoryLabel: '24K Has Külçe Altın' };
  }
  // Sarrafiye / Çeyrek / Yarım / Tam / Ata
  if (
    link === 'sarrafiye' ||
    link === 'ceyrek-altin' ||
    link === 'yarim-altin' ||
    link === 'tam-altin' ||
    link === 'ata-lira' ||
    link === 'cumhuriyet-altini' ||
    link === 'item-ceyrek-altin' ||
    link === 'item-yarim-altin' ||
    link === 'item-tam-altin'
  ) {
    return { targetTab: 'katalog', category: 'yatirim', subCategory: 'sarrafiye', subCategoryLabel: 'Darphane Sarrafiye' };
  }

  // Tuğralı & Madalyon
  if (link === 'tugrali-kolye' || link === 'resat-kolye' || link.includes('tugra')) {
    return { targetTab: 'katalog', category: 'kolye', subCategory: 'tugrali', subCategoryLabel: 'Tuğralı Kolye' };
  }

  // 2. PRIMARY CATEGORIES
  if (link === 'yuzuk' || link === 'yuzukler' || link === 'pirlanta' || link.includes('yuzuk')) {
    return { targetTab: 'katalog', category: 'yuzuk' };
  }
  if (link === 'bilezik' || link === 'bilezikler' || link === 'bileklik' || link.includes('bilezik') || link.includes('bileklik')) {
    return { targetTab: 'katalog', category: 'bilezik' };
  }
  if (link === 'kolye' || link === 'kolyeler' || link === 'gerdanlik' || link.includes('kolye') || link.includes('gerdanlik') || link.includes('set')) {
    return { targetTab: 'katalog', category: 'kolye' };
  }
  if (link === 'kupe' || link === 'kupeler' || link.includes('kupe')) {
    return { targetTab: 'katalog', category: 'kupe' };
  }
  if (link === 'yatirim' || link === 'altin-yatirim' || link.includes('yatirim')) {
    return { targetTab: 'katalog', category: 'yatirim' };
  }
  if (link === 'ozel' || link === 'ozel-tasarim' || link === 'haute-joaillerie') {
    return { targetTab: 'katalog', category: 'ozel' };
  }

  return { targetTab: 'katalog', category: 'all' };
}
