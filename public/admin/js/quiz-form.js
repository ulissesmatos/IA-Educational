/**
 * Admin Quiz - Form Scripts
 * Gerencia o formulário de criação/edição de perguntas do quiz
 */

document.addEventListener('DOMContentLoaded', function() {
  const typeSelect = document.getElementById('question-type');
  
  if (typeSelect) {
    // Executar ao carregar
    toggleImageCompareFields();
    
    // Executar ao mudar
    typeSelect.addEventListener('change', toggleImageCompareFields);
  }
});

function toggleImageCompareFields() {
  const typeSelect = document.getElementById('question-type');
  if (!typeSelect) return;
  
  const type = typeSelect.value;
  const image2Group = document.getElementById('image2-group');
  const image1Label = document.getElementById('image1-label');
  const correctOptionLabels = document.querySelectorAll('input[name="correctOption"]');
  
  if (type === 'IMAGE_COMPARE') {
    // Mostrar campo da segunda imagem
    if (image2Group) {
      image2Group.style.display = 'block';
    }
    if (image1Label) {
      image1Label.textContent = '(Imagem A)';
    }
    // Atualizar labels das opções
    if (correctOptionLabels.length >= 2) {
      const label0 = correctOptionLabels[0].nextElementSibling;
      const label1 = correctOptionLabels[1].nextElementSibling;
      if (label0) label0.textContent = 'Imagem A é IA';
      if (label1) label1.textContent = 'Imagem B é IA';
    }
  } else {
    // Esconder campo da segunda imagem
    if (image2Group) {
      image2Group.style.display = 'none';
    }
    if (image1Label) {
      image1Label.textContent = '(Imagem principal)';
    }
    // Restaurar labels padrão
    if (correctOptionLabels.length >= 2) {
      const label0 = correctOptionLabels[0].nextElementSibling;
      const label1 = correctOptionLabels[1].nextElementSibling;
      if (label0) label0.textContent = 'IA (Primeira opção)';
      if (label1) label1.textContent = 'Não IA (Segunda opção)';
    }
  }
}

// Expor função globalmente para compatibilidade
window.toggleImageCompareFields = toggleImageCompareFields;
