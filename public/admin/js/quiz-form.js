/**
 * Admin Quiz - Form Scripts
 * Gerencia o formulário de criação/edição de perguntas do quiz
 */

document.addEventListener('DOMContentLoaded', function() {
  const typeSelect = document.getElementById('question-type');

  if (typeSelect) {
    updateFormForType();
    typeSelect.addEventListener('change', updateFormForType);
  }
});

function updateFormForType() {
  const typeSelect = document.getElementById('question-type');
  if (!typeSelect) return;

  const type = typeSelect.value;
  const image1Group = document.getElementById('image1-group');
  const image2Group = document.getElementById('image2-group');
  const image1Label = document.getElementById('image1-label');
  const correctOptionLabels = document.querySelectorAll('input[name="correctOption"]');

  if (type === 'TRUE_FALSE') {
    // Ocultar campos de imagem — V/F é só texto
    if (image1Group) image1Group.style.display = 'none';
    if (image2Group) image2Group.style.display = 'none';
    // Labels das opções
    if (correctOptionLabels.length >= 2) {
      const label0 = correctOptionLabels[0].nextElementSibling;
      const label1 = correctOptionLabels[1].nextElementSibling;
      if (label0) label0.textContent = '0 = Verdadeiro';
      if (label1) label1.textContent = '1 = Falso';
    }
  } else if (type === 'IMAGE_COMPARE') {
    if (image1Group) image1Group.style.display = 'block';
    if (image2Group) image2Group.style.display = 'block';
    if (image1Label) image1Label.textContent = '(Imagem A)';
    if (correctOptionLabels.length >= 2) {
      const label0 = correctOptionLabels[0].nextElementSibling;
      const label1 = correctOptionLabels[1].nextElementSibling;
      if (label0) label0.textContent = 'Imagem A é IA';
      if (label1) label1.textContent = 'Imagem B é IA';
    }
  } else {
    if (image1Group) image1Group.style.display = 'block';
    if (image2Group) image2Group.style.display = 'none';
    if (image1Label) image1Label.textContent = '(Imagem principal)';
    if (correctOptionLabels.length >= 2) {
      const label0 = correctOptionLabels[0].nextElementSibling;
      const label1 = correctOptionLabels[1].nextElementSibling;
      if (label0) label0.textContent = 'IA (Primeira opção)';
      if (label1) label1.textContent = 'Não IA (Segunda opção)';
    }
  }
}

window.updateFormForType = updateFormForType;
// Alias de compatibilidade
window.toggleImageCompareFields = updateFormForType;
