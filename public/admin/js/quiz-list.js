/**
 * Admin Quiz - List Scripts
 * Gerencia a lista de perguntas do quiz
 */

document.addEventListener('DOMContentLoaded', function() {
  // Configurar botões de delete
  const deleteButtons = document.querySelectorAll('.admin-btn-delete');
  
  deleteButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const formId = this.getAttribute('data-delete-form');
      if (formId && confirm('Tem certeza que deseja excluir esta pergunta?')) {
        document.getElementById(formId).submit();
      }
    });
  });
});
