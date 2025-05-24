function showSection(id) {
  // Hide all sections
  document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
  // Show the selected section
  document.getElementById(id).classList.add('active');
  // Update nav button active state
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  const navBtns = document.querySelectorAll('nav button');
  navBtns.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(id)) {
      btn.classList.add('active');
    }
  });
}
// Show dashboard by default
showSection('dashboard');
