const beforeInput = document.getElementById('before')
const afterInput = document.getElementById('after')
const fixedBefore = document.getElementById('fixed-before')
const fixedAfter = document.getElementById('fixed-after')
const registerButton = document.getElementById('register-button')
const replaceButton = document.getElementById('replace-button')
const errorMessage = document.getElementById('error-message')

/**
 * ポップアップ表示時の挙動
 */
// 設定を読み込む
chrome.storage.local.get(['before', 'after'], (result) => {

  document.getElementById('fixed-before').textContent = result.before
  document.getElementById('fixed-after').textContent = result.after

  // 一部、登録された設定の有無で表示/非表示を選択する
  if (result.before == null) {
    toggleVisibility('hidden')
  } else {
    toggleVisibility('visible')
  }
})

/**
 * 「登録する」ボタン押下時の挙動
 */
registerButton.addEventListener('click', () => {
  errorMessage.innerText = ''

  // 入力された文字列を取得
  const before = beforeInput.value
  const after = afterInput.value

  if (!validationRegister(before)) return

  // 入力された文字列を「変換したい文字列」と「変換後の文字列」の欄に反映する
  fixedBefore.innerText = before
  fixedAfter.innerText = after

  toggleVisibility('visible')

  // テキストボックスを空にする
  before.value = ''
  after.value = ''

  // 設定を保存する
  chrome.storage.local.set({ 
    before: before,
    after: after
  })
})

/**
 * 「URLを変換する」ボタン押下時の挙動
 */
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

/**
 * 「登録する」ボタン押下時のバリデーション
 * 
 * @param {*} before 
 * @returns 
 */
const validationRegister = (before) => {
  if (before == '' || !before.match(/\S/g)) {
    errorMessage.innerText = '⚠️変換したい文字列を入力してください'
    return false
  }
  return true
}

/**
 * 「URLを変換する」ボタン押下時のバリデーション
 * 
 * @param {*} url 
 * @param {*} before 
 */
const validationReplace = (url, before) => {
  if (!url.includes(before)) {
    errorMessage.innerText = `「${before}」が含まれないURLです`
  }
}

/**
 * 以下の項目の表示/非表示を指定する
 * ・矢印(→)
 * ・「URLを変換する」ボタン
 * 
 * @param {*} visibility 表示/非表示
 */
const toggleVisibility = (visibility) => {
  // 矢印
  document.getElementById("arrow").style.visibility = visibility;
  // 「URLを変換する」ボタン
  document.getElementById("replace-button").style.visibility = visibility;
}