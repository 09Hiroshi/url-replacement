const beforeInput = document.getElementById('before')
const afterInput = document.getElementById('after')
const fixedBefore = document.getElementById('fixed-before')
const fixedAfter = document.getElementById('fixed-after')
const registerButton = document.getElementById('register-button')
const replaceButton = document.getElementById('replace-button')
const errorMessage = document.getElementById('error-message')

// 設定を読み込む
chrome.storage.local.get(['before', 'after'], (result) => {

  document.getElementById('fixed-before').textContent = result.before
  document.getElementById('fixed-after').textContent = result.after
})

registerButton.addEventListener('click', () => {

  const before = beforeInput.value
  const after = afterInput.value

  validationRegister(before)

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

    before = fixedBefore.textContent
    after = fixedAfter.textContent

    // URLを取得する
    const url = tabs[0].url

    validationReplace(url, before)

    // URLを変換する
    const newUrl = url.replace(before, after)

    // 変換後のURLを指定する
    chrome.tabs.update({
      url: newUrl
    })
  })
})

const validationRegister = (before) => {
  if (before == '' || !before.match(/\S/g)) {
    errorMessage.innerText = '⚠️変換したい文字列を入力してください'
  }
}

const validationReplace = (url, before) => {
  if (!url.includes(before)) {
    errorMessage.innerText = `「${before}」が含まれないURLです`
  }
}