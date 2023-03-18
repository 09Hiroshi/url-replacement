const targetString = document.getElementById('target-string');
const replaceString = document.getElementById('replace-string');
const fixedTargetString = document.getElementById('fixed-target-string');
const fixedReplaceString = document.getElementById('fixed-replace-string');
const okButton = document.getElementById('ok-button');

okButton.addEventListener('click', () => {

  const target = targetString.value;
  const replace = replaceString.value;
  
  fixedTargetString.innerText = target;
  fixedReplaceString.innerText = replace;
  
  targetString.value = '';
  replaceString.value = '';
});