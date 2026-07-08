const gallery = document.querySelector('#project-gallery');
const filters = document.querySelector('#filters');
const status = document.querySelector('#project-status');
const modal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#modal-image');
const closeModal = document.querySelector('#close-modal');

let projects = [];
let activeFilter = 'all';

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
}[char]));

function renderFilters() {
  const tags = ['all', ...new Set(projects.flatMap(project => project.tags))];
  filters.innerHTML = tags.map(tag => `<button class="filter-btn ${tag === activeFilter ? 'active' : ''}" data-filter="${tag}">${tag === 'all' ? 'TOUS' : escapeHtml(tag.toUpperCase())}</button>`).join('');
}

function renderProjects() {
  const visible = projects.filter(project => activeFilter === 'all' || project.tags.includes(activeFilter));
  gallery.innerHTML = visible.map(project => {
    const tech = project.tech.map(item => `<span class="tech-tag">${escapeHtml(item)}</span>`).join('');
    const links = [
      project.demoUrl ? `<a href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Jouer / voir →</a>` : '',
      project.image ? `<a href="${escapeHtml(project.image)}" class="open-modal" data-image="${escapeHtml(project.image)}" data-title="${escapeHtml(project.title)}">Voir l’image</a>` : ''
    ].join('');
    return `<article class="project-card">
      <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy">
      <div class="project-info">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <div class="project-tech">${tech}</div>
        <div class="project-links">${links}</div>
      </div>
    </article>`;
  }).join('');
  status.textContent = `${visible.length} projet${visible.length > 1 ? 's' : ''} affiché${visible.length > 1 ? 's' : ''}.`;
}

filters.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderProjects();
});

gallery.addEventListener('click', event => {
  const link = event.target.closest('.open-modal');
  if (!link) return;
  event.preventDefault();
  modalImage.src = link.dataset.image;
  modalImage.alt = `Image du projet ${link.dataset.title}`;
  modal.showModal();
});

closeModal.addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  const rect = modal.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) modal.close();
});

async function init() {
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error('Impossible de charger les projets');
    projects = await response.json();
    renderFilters();
    renderProjects();
  } catch (error) {
    gallery.innerHTML = '<p>Les projets ne peuvent pas être chargés pour le moment.</p>';
    console.error(error);
  }
}
document.querySelector('#year').textContent = new Date().getFullYear();
init();