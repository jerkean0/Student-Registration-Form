const form = document.getElementById('registrationForm');
const dob = document.getElementById('dob');
const password = document.getElementById('portalPassword');
const confirmPassword = document.getElementById('confirmPassword');
const mobile = document.getElementById('mobile');
const modal = document.getElementById('resultModal');
const successModal = document.getElementById('successModal');
const summaryContent = document.getElementById('summaryContent');
const strengthBar = document.getElementById('strengthBar');
const ageNote = document.getElementById('ageNote');

// bdays
dob.max = new Date().toISOString().split('T')[0];

// Calcu sa edad
dob.addEventListener('change', () => {
  const age = new Date().getFullYear() - new Date(dob.value).getFullYear();
  ageNote.textContent = age >= 0 ? `Age: ${age} years old` : '';
});

// Pass
password.addEventListener('input', () => {
  const val = password.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  strengthBar.style.width = `${score * 25}%`;
  strengthBar.style.background = ['#f87171', '#fb923c', '#facc15', '#34d399'][score - 1] || 'transparent';
});

// Number
mobile.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
});

form.addEventListener('reset', () => {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
  ageNote.textContent = '';
  strengthBar.style.width = '0%';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  document.querySelectorAll('.error').forEach(el => el.textContent = '');

  if (!form.checkValidity()) {
    form.querySelectorAll(':invalid').forEach(el => {
      const errSpan = document.getElementById(el.id + 'Error');
      if (errSpan) errSpan.textContent = 'Required or invalid.';
    });
    if (!document.querySelector('input[name="Status"]:checked')) {
      document.getElementById('statusError').textContent = 'Please select status.';
    }
    return;
  }

  if (password.value !== confirmPassword.value) {
    document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
    return;
  }

  const selectedCourses = document.querySelectorAll('input[name="Courses"]:checked');
  if (selectedCourses.length === 0) {
    document.getElementById('coursesError').textContent = 'Select at least 1 course.';
    return;
  }

  summaryContent.innerHTML = '';
  const formData = new FormData(form);
  const coursesList = Array.from(selectedCourses).map(c => c.value).join(', ');
  formData.delete('Courses');
  if (coursesList) formData.append('Courses', coursesList);

  for (let [key, value] of formData.entries()) {
    if (value.trim() !== '') {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${key}:</strong> ${value}`;
      summaryContent.appendChild(div);
    }
  }

  modal.classList.add('show');
});

// Mod
document.getElementById('editForm').addEventListener('click', () => modal.classList.remove('show'));
document.getElementById('confirmButton').addEventListener('click', () => {
  modal.classList.remove('show');
  successModal.classList.add('show');
});
document.getElementById('closeSuccess').addEventListener('click', () => {
  successModal.classList.remove('show');
  form.reset();
});