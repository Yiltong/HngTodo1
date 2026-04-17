/* ═══════════════════════════════════════
   Advanced Todo Card — script.js
═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── State ── */
  const state = {
    title: 'Design New Onboarding Flow',
    description: 'Create wireframes and mockups for user onboarding. This includes all screens from welcome through profile setup, ensuring smooth UX transitions and accessibility compliance throughout the entire flow.',
    priority: 'High',
    status: 'Pending',
    dueDate: (() => {
      // Set due date to tomorrow by default
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    })(),
    tags: ['Work', 'Urgent', 'Design'],
  };

  /* Snapshot for cancel */
  let editSnapshot = null;

  /* ── DOM refs ── */
  const card          = document.querySelector('[data-testid="test-todo-card"]');
  const titleEl       = document.querySelector('[data-testid="test-todo-title"]');
  const descEl        = document.querySelector('[data-testid="test-todo-description"]');
  const priorityBadge = document.querySelector('[data-testid="test-todo-priority-badge"]');
  const priorityLabel = priorityBadge.querySelector('.priority-label');
  const dueDateEl     = document.querySelector('[data-testid="test-todo-due-date"]');
  const timeChipEl    = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const overdueEl     = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
  const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
  const checkbox      = document.querySelector('[data-testid="test-todo-checkbox"]');
  const expandToggle  = document.querySelector('[data-testid="test-todo-expand-toggle"]');
  const toggleText    = expandToggle.querySelector('.toggle-text');
  const viewMode      = document.querySelector('[data-testid="test-todo-view-mode"]');
  const editForm      = document.querySelector('[data-testid="test-todo-edit-form"]');
  const editBtn       = document.querySelector('[data-testid="test-todo-edit-button"]');
  const deleteBtn     = document.querySelector('[data-testid="test-todo-delete-button"]');
  const saveBtn       = document.querySelector('[data-testid="test-todo-save-button"]');
  const cancelBtn     = document.querySelector('[data-testid="test-todo-cancel-button"]');
  const editTitle     = document.querySelector('[data-testid="test-todo-edit-title-input"]');
  const editDesc      = document.querySelector('[data-testid="test-todo-edit-description-input"]');
  const editPriority  = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
  const editDueDate   = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');

  const COLLAPSE_THRESHOLD = 120; // chars

  /* ════════════════════════════════════
     RENDER
  ════════════════════════════════════ */
  function render() {
    /* Title & description */
    titleEl.textContent = state.title;
    descEl.textContent  = state.description;

    /* Priority */
    card.dataset.priority = state.priority;
    priorityLabel.textContent = state.priority + ' Priority';

    /* Status */
    card.dataset.status = state.status;
    statusControl.value = state.status;
    checkbox.checked    = state.status === 'Done';

    /* Due date label */
    dueDateEl.textContent = 'Due ' + formatDate(state.dueDate);

    /* Expand toggle visibility */
    const longDesc = state.description.length > COLLAPSE_THRESHOLD;
    expandToggle.style.display = longDesc ? 'inline-flex' : 'none';

    /* Time chip */
    updateTimeChip();
  }

  /* ════════════════════════════════════
     TIME CHIP
  ════════════════════════════════════ */
  function updateTimeChip() {
    if (state.status === 'Done') {
      timeChipEl.textContent = 'Completed';
      timeChipEl.classList.remove('overdue-chip');
      overdueEl.classList.add('hidden');
      card.removeAttribute('data-overdue');
      return;
    }

    const now  = new Date();
    const diff = state.dueDate - now; // ms

    if (diff < 0) {
      /* Overdue */
      const abs = Math.abs(diff);
      timeChipEl.textContent = 'Overdue by ' + humanDuration(abs);
      timeChipEl.classList.add('overdue-chip');
      overdueEl.classList.remove('hidden');
      card.dataset.overdue = 'true';
    } else {
      timeChipEl.textContent = 'Due in ' + humanDuration(diff);
      timeChipEl.classList.remove('overdue-chip');
      overdueEl.classList.add('hidden');
      card.removeAttribute('data-overdue');
    }
  }

  function humanDuration(ms) {
    const totalMins = Math.floor(ms / 60000);
    if (totalMins < 60)  return totalMins + ' minute' + (totalMins !== 1 ? 's' : '');
    const hours = Math.floor(totalMins / 60);
    if (hours < 24) return hours + ' hour' + (hours !== 1 ? 's' : '');
    const days  = Math.floor(hours / 24);
    return days + ' day' + (days !== 1 ? 's' : '');
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* ════════════════════════════════════
     STATUS SYNC
  ════════════════════════════════════ */
  function setStatus(val) {
    state.status = val;
    render();
  }

  /* ════════════════════════════════════
     EDIT MODE
  ════════════════════════════════════ */
  function openEdit() {
    /* Snapshot */
    editSnapshot = { ...state, dueDate: new Date(state.dueDate) };

    /* Populate form */
    editTitle.value    = state.title;
    editDesc.value     = state.description;
    editPriority.value = state.priority;
    editDueDate.value  = toInputDate(state.dueDate);

    viewMode.classList.add('hidden');
    editForm.classList.remove('hidden');

    /* Focus first field */
    editTitle.focus();
  }

  function closeEdit(save) {
    if (save) {
      state.title       = editTitle.value.trim() || state.title;
      state.description = editDesc.value.trim()  || state.description;
      state.priority    = editPriority.value;
      if (editDueDate.value) {
        state.dueDate = new Date(editDueDate.value + 'T00:00:00');
      }
    } else if (editSnapshot) {
      Object.assign(state, editSnapshot);
    }

    viewMode.classList.remove('hidden');
    editForm.classList.add('hidden');

    render();
    editBtn.focus();
  }

  function toInputDate(d) {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dy}`;
  }

  /* ════════════════════════════════════
     EXPAND / COLLAPSE
  ════════════════════════════════════ */
  function toggleExpand() {
    const isExpanded = expandToggle.getAttribute('aria-expanded') === 'true';
    expandToggle.setAttribute('aria-expanded', String(!isExpanded));
    descEl.classList.toggle('expanded', !isExpanded);
    toggleText.textContent = !isExpanded ? 'Show less' : 'Show more';
  }

  /* ════════════════════════════════════
     EVENT LISTENERS
  ════════════════════════════════════ */

  /* Status dropdown */
  statusControl.addEventListener('change', () => setStatus(statusControl.value));

  /* Checkbox */
  checkbox.addEventListener('change', () => {
    setStatus(checkbox.checked ? 'Done' : 'Pending');
  });

  /* Edit */
  editBtn.addEventListener('click', openEdit);

  /* Save */
  saveBtn.addEventListener('click', () => closeEdit(true));

  /* Cancel */
  cancelBtn.addEventListener('click', () => closeEdit(false));

  /* Delete */
  deleteBtn.addEventListener('click', () => {
    card.style.transition = 'opacity .3s ease, transform .3s ease';
    card.style.opacity    = '0';
    card.style.transform  = 'scale(.96)';
    setTimeout(() => card.remove(), 320);
  });

  /* Expand toggle */
  expandToggle.addEventListener('click', toggleExpand);

  /* Keyboard trap inside edit form */
  editForm.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeEdit(false); }
  });

  /* ════════════════════════════════════
     TICK — update time every 45 seconds
  ════════════════════════════════════ */
  setInterval(updateTimeChip, 45_000);

  /* ════════════════════════════════════
     INIT
  ════════════════════════════════════ */
  render();

  /* Initial expand-toggle state */
  if (state.description.length <= COLLAPSE_THRESHOLD) {
    descEl.classList.add('expanded');
  }

})();
