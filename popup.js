const beforeInput = document.getElementById('before');
const afterInput = document.getElementById('after');
const fixedBefore = document.getElementById('fixed-before');
const fixedAfter = document.getElementById('fixed-after');
const okButton = document.getElementById('ok-button');

okButton.addEventListener('click', () => {

  const before = beforeInput.value
  const after = afterInput.value
  
  fixedBefore.innerText = before
  fixedAfter.innerText = after
  
  save(before, after)

  before.value = ''
  after.value = ''
});

// 設定を保存する
const save = (before, after) => {
  chrome.storage.local.set({ 
    before: before,
    after: after
  })
}