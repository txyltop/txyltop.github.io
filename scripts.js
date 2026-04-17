let allPublications = [];

document.addEventListener('DOMContentLoaded', function () {
  loadPublications();

  var btnZh = document.getElementById('btn-zh');
  var btnEn = document.getElementById('btn-en');

  function setLang(lang) {
    if (lang === 'en') {
      document.body.classList.remove('lang-zh');
      document.body.classList.add('lang-en');
      btnZh.classList.remove('active');
      btnEn.classList.add('active');
      document.documentElement.lang = 'en';
    } else {
      document.body.classList.remove('lang-en');
      document.body.classList.add('lang-zh');
      btnEn.classList.remove('active');
      btnZh.classList.add('active');
      document.documentElement.lang = 'zh-CN';
    }
    localStorage.setItem('site_lang', lang);
    renderPublications();
  }

  btnZh.addEventListener('click', function () { setLang('zh'); });
  btnEn.addEventListener('click', function () { setLang('en'); });

  var saved = localStorage.getItem('site_lang');
  setLang(saved === 'en' ? 'en' : 'zh');
});

function loadPublications() {
  fetch('publications.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      allPublications = data.publications || [];
      renderPublications();
    })
    .catch(function () {
      var container = document.getElementById('publications-container');
      if (container) {
        container.innerHTML = '<p>Error loading publications.</p>';
      }
    });
}

function renderPublications() {
  var container = document.getElementById('publications-container');
  if (!container) return;

  var isEn = document.body.classList.contains('lang-en');
  container.innerHTML = '';

  allPublications.forEach(function (publication) {
    var item = document.createElement('div');
    item.className = 'publication-item';

    var thumbnail = document.createElement('div');
    thumbnail.className = 'pub-thumbnail';
    var img = document.createElement('img');
    img.src = publication.thumbnail;
    img.alt = 'thumbnail';
    thumbnail.appendChild(img);

    var content = document.createElement('div');

    var title = document.createElement('div');
    title.className = 'pub-title';
    title.textContent = publication.title;

    var authors = document.createElement('div');
    authors.className = 'pub-authors';
    authors.textContent = publication.authors;

    var venue = document.createElement('div');
    venue.className = 'pub-venue';
    venue.textContent = isEn ? publication.venue_en : publication.venue_zh;

    var links = document.createElement('div');
    links.className = 'pub-links';
    var pdf = document.createElement('a');
    pdf.href = publication.pdf;
    pdf.target = '_blank';
    pdf.rel = 'noopener noreferrer';
    pdf.textContent = '[PDF]';
    links.appendChild(pdf);

    content.appendChild(title);
    content.appendChild(authors);
    content.appendChild(venue);
    content.appendChild(links);

    item.appendChild(thumbnail);
    item.appendChild(content);
    container.appendChild(item);
  });
}
