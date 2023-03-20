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
  errorMessage.innerText = ''

  // 入力された文字列を取得
  const before = beforeInput.value
  const after = afterInput.value

  if (!validationRegister(before)) return

  // 入力された文字列を「変換したい文字列」と「変換後の文字列」の欄に反映する
  fixedBefore.innerText = before
  fixedAfter.innerText = after

  // テキストボックスを空にする
  before.value = ''
  after.value = ''

  // 設定を保存する
  chrome.storage.local.set({ 
    before: before,
    after: after
  })
})

replaceButton.addEventListener('click', () => {
  errorMessage.innerText = ''

  // 現在のタブに対してのアクション
  chrome.tabs.query({
    'active': true,
    'lastFocusedWindow': true
  }, (tabs) => {

    // 「変換したい文字列」と「変換後の文字列」を取得
    before = fixedBefore.textContent
    after = fixedAfter.textContent

    // 現在のURLを取得する
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

// 「登録する」ボタン押下時のバリデーション
const validationRegister = (before) => {
  if (before == '' || !before.match(/\S/g)) {
    errorMessage.innerText = '⚠️変換したい文字列を入力してください'
    return false
  }
  return true
}

// 「URLを変換する」ボタン押下時のバリデーション
const validationReplace = (url, before) => {
  if (!url.includes(before)) {
    errorMessage.innerText = `「${before}」が含まれないURLです`
  }
}