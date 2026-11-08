/**
 * Nadir's personal letter. Edit the text here; the letter section renders it as written.
 * Each string in `paragraphs` becomes one paragraph.
 */

export interface LetterContent {
  salutation: string
  paragraphs: string[]
  closing: string
  signature: string
}

export const letter: LetterContent = {
  salutation: 'Əziz Rövşən əmi,',
  paragraphs: [
    'Əlli yaş insanın arxada qalan illərə təşəkkürlə, qarşıdakılara isə ümidlə baxdığı xüsusi bir mərhələdir. Bu günlərdə sənin haqqında düşünəndə ilk hiss etdiyim şey minnətdarlıq oldu.',
    'Həyatımda sənin kimi bir əminin olması mənim üçün böyük xoşbəxtlikdir. Sənə olan hörmətim və sevgim sözlərlə ifadə edə biləcəyimdən daha dərindir.',
    'Bu səhifəni əlli ilini bir az da olsa qeyd etmək və sənin bizim üçün nə qədər dəyərli olduğunu bir daha deyə bilmək üçün hazırladım. Ümid edirəm, burada toplanan anlar sənə xoş xatirələri yenidən yaşadacaq.',
    'Sənə hər şeydən əvvəl can sağlığı arzulayıram. Evində dinclik, ürəyində rahatlıq, ailənin əhatəsində isə daim sevinc olsun. Qarşıdakı illər sənə təkcə yaş yox, yeni gözəl xatirələr və xoş xəbərlər gətirsin.',
    'Ad günün mübarək, əziz əmi. Həmişə sağ ol.',
  ],
  closing: 'Hörmətlə,',
  signature: 'Nadir',
}
