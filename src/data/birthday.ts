/**
 * All visible copy (except the letter and the gallery) lives here.
 * Edit freely: the components only read from this file.
 */

export interface NavItem {
  id: string
  label: string
}

export interface MilestoneItem {
  title: string
  text: string
}

export const birthday = {
  honoree: {
    fullName: 'Rövşən Qədirov',
    address: 'Rövşən əmi',
    birthDateLabel: '28.11.1976',
    age: 50,
  },

  creator: {
    fullName: 'Nadir Qədirzadə',
    signature: 'Nadir',
  },

  /** Section ids must match the `id` attribute of each section component. */
  nav: [
    { id: 'home', label: 'Əsas' },
    { id: 'anlar', label: 'Anlar' },
    { id: 'elli-il', label: 'Əlli il' },
    { id: 'mektub', label: 'Məktub' },
    { id: 'tebrik', label: 'Təbrik' },
  ] satisfies NavItem[],

  hero: {
    giftNote: 'Sənin üçün hazırlanmış kiçik bir hədiyyə',
    headlineLines: ['Əlli il.', 'Saysız xatirələr.', 'Bir ömürlük dəyər.'],
    scrollLabel: 'Aşağı sürüşdür',
    scrollAria: 'Xatirələrə keç',
  },

  gallery: {
    eyebrow: '01 — Anlar',
    title: 'Anlarla dolu bir ömür',
    lead: 'Hər fotoşəkil bir hekayədir. İllərin içindən seçilmiş anlar burada toplanıb.',
    openPhoto: 'Fotoşəkili böyüt',
    placeholderHint: 'Fotoşəkil',
  },

  milestone: {
    eyebrow: '02 — Əlli il',
    title: 'Əlli il',
    lead: 'Bir rəqəm, amma arxasında yaşanmış illərin, öyrənilmiş dərslərin və sevilən insanların bütün çəkisi var.',
    items: [
      {
        title: 'Həyat',
        text: 'Əlli il ərzində yaşanan hər gün, hər qərar və hər təcrübə bu günə gətirib çıxarıb.',
      },
      {
        title: 'Xatirələr',
        text: 'Zaman keçir, xatirələr isə qalır. Ən qiymətli xəzinələrimizdən biri məhz onlardır.',
      },
      {
        title: 'Ailə',
        text: 'Doğma insanların əhatəsində keçən günlər hər şeydən qiymətlidir.',
      },
      {
        title: 'Təcrübə',
        text: 'İllərin gətirdiyi sakitlik, müdriklik və bilik.',
      },
      {
        title: 'Əhatədəki insanlar',
        text: 'Yolu kəsişdiyi hər kəsin həyatında qalan istilik və iz.',
      },
    ] satisfies MilestoneItem[],
  },

  letter: {
    eyebrow: '03 — Məktub',
    title: 'Sənə bir neçə söz',
    dateLabel: '28 noyabr 2026',
  },

  finale: {
    headlineLines: ['Ad günün mübarək,', 'Rövşən əmi!'],
    love: 'Səni çox istəyirəm!',
    closingPrefix: 'Hörmətlə,',
    backToTop: 'Başa qayıt',
  },

  footer: {
    madeBy: 'Nadir Qədirzadə tərəfindən sevgi ilə hazırlanıb',
    year: '2026',
  },

  a11y: {
    skipToContent: 'Əsas məzmuna keç',
    backHome: 'Başa qayıt',
    openMenu: 'Menyunu aç',
    closeMenu: 'Menyunu bağla',
    mainNav: 'Əsas naviqasiya',
  },
}
