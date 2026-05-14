/* ================================================
   TASKFLOW — app.js
   OIB-SIP Level 2 Task 3 — Basic To-Do Web App
   Features: Add · Edit · Delete · Complete ·
             Pending / Completed lists · Priority ·
             Category · Due Date · Search · Sort ·
             Date/Time stamps · LocalStorage
   ================================================ */

'use strict';

/* ── STATE ── */
let tasks      = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
let activeFilter = 'all';
let activeSort   = 'date';
let editingId    = null;

/* ── DOM refs ── */
const taskInput      = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput   = document.getElementById('dueDateInput');
const addBtn         = document.getElementById('addBtn');
const searchInput    = document.getElementById('searchInput');
const pendingList    = document.getElementById('pendingList');
const completedList  = document.getElementById('completedList');
const pendingEmpty   = document.getElementById('pendingEmpty');
const completedEmpty = document.getElementById('completedEmpty');
const pendingBadge   = document.getElementById('pendingBadge');
const completedBadge = document.getElementById('completedBadge');
const modalOverlay   = document.getElementById('modalOverlay');
const modalClose     = document.getElementById('modalClose');
const modalCancel    = document.getElementById('modalCancel');
const modalSave      = document.getElementById('modalSave');
const editInput      = document.getElementById('editInput');
const editPriority   = document.getElementById('editPriority');
const editCategory   = document.getElementById('editCategory');
const editDue        = document.getElementById('editDue');
const editNotes      = document.getElementById('editNotes');
const toast          = document.getElementById('toast');
const clearCompleted = document.getElementById('clearCompleted');
const progressFill   = document.getElementById('progressFill');
const progressPct    = document.getElementById('progressPct');
const sidebarDate    = document.getElementById('sidebarDate');
const mainTitle      = document.getElementById('mainTitle');
const mainSubtitle   = document.getElementById('mainSubtitle');
const mobileMenuBtn  = document.getElementById('mobileMenuBtn');
const sidebar        = document.querySelector('.sidebar');

/* ── HELPERS ── */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function save() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

function showToast(msg, type = 'info') {
  toast.textContent = msg;
  toast.className = `toast toast--${type} show`;
  clearTimeout(toast._tid);
  toast._tid = setTimeout(() => toast.classList.remove('show'), 2800);
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatAdded(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000)  return 'just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function dueDateClass(dueISO, completed) {
  if (!dueISO || completed) return '';
  const now  = new Date();
  const due  = new Date(dueISO);
  const diff = due - now;
  if (diff < 0)       return 'overdue';
  if (diff < 86400000) return 'today';
  return '';
}

function dueDateIcon(cls) {
  if (cls === 'overdue') return '⚠️';
  if (cls === 'today')   return '🔔';
  return '📅';
}

/* ── SIDEBAR DATE ── */
function updateSidebarDate() {
  const now = new Date();
  sidebarDate.textContent = now.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}
updateSidebarDate();

/* ── FILTER & SORT ── */
function getFiltered() {
  const q = searchInput.value.trim().toLowerCase();
  let list = tasks.filter(t => {
    if (q && !t.text.toLowerCase().includes(q) && !(t.notes || '').toLowerCase().includes(q)) return false;
    if (activeFilter === 'pending')   return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    if (activeFilter === 'high')      return t.priority === 'high';
    if (activeFilter === 'medium')    return t.priority === 'medium';
    if (activeFilter === 'low')       return t.priority === 'low';
    return true;
  });

  const pOrder = { high: 0, medium: 1, low: 2 };
  if (activeSort === 'priority') list.sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);
  else if (activeSort === 'due') list.sort((a, b) => {
    if (!a.due && !b.due) return 0;
    if (!a.due) return 1;
    if (!b.due) return -1;
    return new Date(a.due) - new Date(b.due);
  });
  else if (activeSort === 'alpha') list.sort((a, b) => a.text.localeCompare(b.text));
  else list.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

  return list;
}

/* ── BUILD TASK CARD ── */
function buildCard(task) {
  const cls   = dueDateClass(task.due, task.completed);
  const card  = document.createElement('div');
  card.className = `task-card priority-${task.priority}${task.completed ? ' completed' : ''}`;
  card.dataset.id = task.id;

  card.innerHTML = `
    <button class="task-check${task.completed ? ' checked' : ''}" data-action="toggle" aria-label="Toggle complete">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </button>
    <div class="task-content">
      <div class="task-text">${escapeHTML(task.text)}</div>
      <div class="task-meta">
        <span class="task-badge task-badge--${task.priority}">${task.priority.toUpperCase()}</span>
        <span class="task-badge task-badge--cat">${escapeHTML(task.category)}</span>
        ${task.due ? `<span class="task-date-label ${cls}">${dueDateIcon(cls)} Due: ${formatDate(task.due)}</span>` : ''}
      </div>
      ${task.notes ? `<div class="task-notes">${escapeHTML(task.notes)}</div>` : ''}
      <div class="task-added">Added ${formatAdded(task.addedAt)}${task.completedAt ? ' &nbsp;·&nbsp; ✓ Done ' + formatAdded(task.completedAt) : ''}</div>
    </div>
    <div class="task-actions">
      <button class="task-btn" data-action="edit" aria-label="Edit task" title="Edit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button class="task-btn task-btn--delete" data-action="delete" aria-label="Delete task" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
    </div>
  `;

  /* Card-level click delegation */
  card.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'toggle') toggleTask(task.id);
    if (action === 'edit')   openEdit(task.id);
    if (action === 'delete') deleteTask(card, task.id);
  });

  return card;
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── RENDER ── */
function render() {
  const filtered = getFiltered();
  const pending   = filtered.filter(t => !t.completed);
  const completed = filtered.filter(t => t.completed);

  /* Pending list */
  pendingList.innerHTML = '';
  if (pending.length === 0) {
    pendingList.appendChild(pendingEmpty);
    pendingEmpty.style.display = '';
  } else {
    pendingEmpty.style.display = 'none';
    pending.forEach(t => pendingList.appendChild(buildCard(t)));
  }

  /* Completed list */
  completedList.innerHTML = '';
  if (completed.length === 0) {
    completedList.appendChild(completedEmpty);
    completedEmpty.style.display = '';
  } else {
    completedEmpty.style.display = 'none';
    completed.forEach(t => completedList.appendChild(buildCard(t)));
  }

  updateStats();
}

/* ── STATS ── */
function updateStats() {
  const all       = tasks;
  const pend      = all.filter(t => !t.completed);
  const done      = all.filter(t => t.completed);
  const highCount = all.filter(t => t.priority === 'high' && !t.completed);

  document.getElementById('statTotal').textContent   = all.length;
  document.getElementById('statPending').textContent = pend.length;
  document.getElementById('statDone').textContent    = done.length;
  document.getElementById('statHigh').textContent    = highCount.length;

  document.getElementById('countAll').textContent       = all.length;
  document.getElementById('countPending').textContent   = pend.length;
  document.getElementById('countCompleted').textContent = done.length;

  pendingBadge.textContent   = pend.length;
  completedBadge.textContent = done.length;

  const pct = all.length ? Math.round((done.length / all.length) * 100) : 0;
  progressFill.style.width = pct + '%';
  progressPct.textContent  = pct + '%';
}

/* ── ADD TASK ── */
function addTask() {
  const text = taskInput.value.trim();
  if (!text) { showToast('Please enter a task first!', 'error'); taskInput.focus(); return; }

  const task = {
    id:          uid(),
    text,
    priority:    prioritySelect.value,
    category:    categorySelect.value,
    due:         dueDateInput.value || null,
    notes:       '',
    completed:   false,
    addedAt:     new Date().toISOString(),
    completedAt: null,
  };

  tasks.unshift(task);
  save();
  render();

  taskInput.value     = '';
  dueDateInput.value  = '';
  prioritySelect.value = 'medium';
  categorySelect.value = 'General';
  taskInput.focus();
  showToast('Task added! ✦', 'success');
}

/* ── TOGGLE COMPLETE ── */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed   = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;
  save();
  render();
  showToast(task.completed ? 'Task completed! 🎉' : 'Task moved back to pending.', task.completed ? 'success' : 'info');
}

/* ── DELETE ── */
function deleteTask(card, id) {
  card.classList.add('removing');
  card.addEventListener('animationend', () => {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }, { once: true });
  // Fallback if animation doesn't fire
  setTimeout(() => {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }, 500);
  showToast('Task deleted.', 'error');
}

/* ── EDIT ── */
function openEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingId = id;
  editInput.value    = task.text;
  editPriority.value = task.priority;
  editCategory.value = task.category;
  editDue.value      = task.due || '';
  editNotes.value    = task.notes || '';
  modalOverlay.classList.add('open');
  editInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  editingId = null;
}

function saveEdit() {
  const text = editInput.value.trim();
  if (!text) { showToast('Task name cannot be empty!', 'error'); return; }
  const task = tasks.find(t => t.id === editingId);
  if (!task) return;
  task.text     = text;
  task.priority = editPriority.value;
  task.category = editCategory.value;
  task.due      = editDue.value || null;
  task.notes    = editNotes.value.trim();
  save();
  render();
  closeModal();
  showToast('Task updated! ✦', 'success');
}

/* ── CLEAR COMPLETED ── */
clearCompleted.addEventListener('click', () => {
  const doneCount = tasks.filter(t => t.completed).length;
  if (doneCount === 0) { showToast('No completed tasks to clear.', 'info'); return; }
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
  showToast(`Cleared ${doneCount} completed task${doneCount > 1 ? 's' : ''}!`, 'success');
});

/* ── SIDEBAR FILTER ── */
document.querySelectorAll('.sidebar__link[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar__link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;

    const titles = {
      all: ['All Tasks', 'Manage everything in one place'],
      pending: ['Pending Tasks', 'Things still to do'],
      completed: ['Completed Tasks', 'Great work! 🎉'],
      high: ['High Priority', 'Urgent tasks needing attention'],
      medium: ['Medium Priority', 'Important but not urgent'],
      low: ['Low Priority', 'When you get around to it'],
    };
    const [t, s] = titles[activeFilter] || ['Tasks', ''];
    mainTitle.textContent    = t;
    mainSubtitle.textContent = s;
    render();

    if (window.innerWidth <= 900) sidebar.classList.remove('open');
  });
});

/* ── SORT ── */
document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSort = btn.dataset.sort;
    render();
  });
});

/* ── SEARCH ── */
searchInput.addEventListener('input', render);

/* ── ADD TASK EVENTS ── */
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

/* ── MODAL EVENTS ── */
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modalSave.addEventListener('click', saveEdit);
editInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveEdit(); });
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

/* ── MOBILE MENU ── */
mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));

/* ── KEYBOARD SHORTCUTS ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); taskInput.focus(); }
});

/* ── INIT ── */
render();

/* Seed with sample tasks if empty */
if (tasks.length === 0) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().slice(0, 16);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 16);
  const sampleTasks = [
    { id: uid(), text: 'Complete OIB-SIP Level 2 Task 3 — To-Do Web App', priority: 'high', category: 'Study', due: tomorrow, notes: 'Deploy on GitHub Pages after finishing.', completed: false, addedAt: new Date(now - 3600000).toISOString(), completedAt: null },
    { id: uid(), text: 'Review HTML, CSS & JavaScript fundamentals', priority: 'medium', category: 'Study', due: null, notes: '', completed: false, addedAt: new Date(now - 7200000).toISOString(), completedAt: null },
    { id: uid(), text: 'Push portfolio code to GitHub repository', priority: 'high', category: 'Work', due: yesterday, notes: 'Also update README with live demo link.', completed: false, addedAt: new Date(now - 10800000).toISOString(), completedAt: null },
    { id: uid(), text: 'Set up Google Colab for ML project', priority: 'low', category: 'Study', due: null, notes: '', completed: true, addedAt: new Date(now - 86400000).toISOString(), completedAt: new Date(now - 3600000).toISOString() },
    { id: uid(), text: 'Morning workout — 30 minutes', priority: 'medium', category: 'Health', due: null, notes: '', completed: true, addedAt: new Date(now - 172800000).toISOString(), completedAt: new Date(now - 86400000).toISOString() },
  ];
  tasks = sampleTasks;
  save();
  render();
}
