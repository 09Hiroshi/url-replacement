window.addEventListener('load', () => {
  
  // 設定を読み込む
  chrome.storage.local.get(['before', 'after'], (result) => {
    document.getElementById('fixed-before').textContent = result.before
    document.getElementById('fixed-after').textContent = result.after
  })

  const beforeInput = document.getElementById('before')
  const afterInput = document.getElementById('after')
  const fixedBefore = document.getElementById('fixed-before')
  const fixedAfter = document.getElementById('fixed-after')
  const okButton = document.getElementById('ok-button')

  okButton.addEventListener('click', () => {

    const before = beforeInput.value
    const after = afterInput.value
    
    fixedBefore.innerText = before
    fixedAfter.innerText = after

    before.value = ''
    after.value = ''

    // 設定を保存する
    chrome.storage.local.set({ 
      before: before,
      after: after
    })
  });
})