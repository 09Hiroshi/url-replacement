const beforeInput = document.getElementById('before')
const afterInput = document.getElementById('after')
const fixedBefore = document.getElementById('fixed-before')
const fixedAfter = document.getElementById('fixed-after')
const registerButton = document.getElementById('register-button')
const replaceButton = document.getElementById('replace-button')

// 設定を読み込む
chrome.storage.local.get(['before', 'after'], (result) => {

  document.getElementById('fixed-before').textContent = result.before
  document.getElementById('fixed-after').textContent = result.after
})

registerButton.addEventListener('click', () => {

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
})

replaceButton.addEventListener('click', () => {

  // 現在のタブに対してのアクション
  chrome.tabs.query({
    'active': true,
    'lastFocusedWindow': true
  }, (tabs) => {

    // URLを変換する
    const url = tabs[0].url
    const newUrl = url.replace(fixedBefore.textContent, fixedAfter.textContent)

    // 変換後のURLを指定する
    chrome.tabs.update({
      url: newUrl
    })
  })
})