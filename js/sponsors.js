/* Sponsor cards - the businesses shown in the small "Sponsored" card (front page and under the CV preview).
   Edit only this list to add, change or remove a sponsor. One card shows at a time, taking turns.
   Fields:
     id      short unique word
     name    business name
     line    one sentence about what they offer (keep it under about 100 characters)
     area    optional: where they work
     actions the buttons, main one first (up to two fit nicely), each { cta: 'button text', action: 'link' }. A link can be:
               WhatsApp  https://wa.me/27721234567?text=Hi%2C%20I%20saw%20you%20on%20CV%20Maker%20SA
               phone     tel:0721234567
               email     mailto:name@example.com?subject=...
               website   https://...
             (older entries may instead have one button as cta + action)
     logo    optional: a small square picture in www/img/sponsors/ (e.g. 'img/sponsors/shop.png'); otherwise initials
     ini     optional: the letters in the circle when there is no logo (otherwise taken from the name)
     color   optional: colour of the initials circle
     from, until  optional: first and last day to show it ('2026-11-01')
   Sponsor cards never appear on the CV, the PDF or the Word file, and the app sends nothing when they are shown. */
window.CV_SPONSORS = [
  {
    id: 'naynayjuju',
    name: 'Nay Nay and Juju Trading',
    line: 'Starting a business? Company and NPC registration, tax returns, tax certificates, B-BBEE and COIDA.',
    area: 'Welkom and Kutlwanong',
    actions: [
      { cta: 'WhatsApp', action: 'https://wa.me/27684042600?text=' + encodeURIComponent('Hi, I saw Nay Nay and Juju Trading on CV Maker SA. I would like help with ') },
      { cta: 'Email', action: 'mailto:tumelovincent558@gmail.com?subject=' + encodeURIComponent('Business services enquiry (from CV Maker SA)') }
    ],
    ini: 'NJ',
    color: '#0B5D4B'
  },
  {
    id: 'advertise',
    name: 'Advertise here',
    line: 'Reach people looking for work with a card like this. WhatsApp 068 404 2600 for prices.',
    actions: [
      { cta: 'WhatsApp', action: 'https://wa.me/27684042600?text=' + encodeURIComponent('Hi Tumelo, I would like to advertise my business on CV Maker SA. What are the prices?') },
      { cta: 'Email', action: 'mailto:tumelovincent558@gmail.com?subject=' + encodeURIComponent('Advertising on CV Maker SA') }
    ],
    ini: '+',
    color: '#C98A00'
  }
];
