const beforeInput = document.getElementById('before')
const afterInput = document.getElementById('after')
const fixedBefore = document.getElementById('fixed-before')
const fixedAfter = document.getElementById('fixed-after')
const registerButton = document.getElementById('register-button')
const replaceButton = document.getElementById('replace-button')
const errorMessage = document.getElementById('error-message')

// 設定を読み込む（ポップアップ表示時の挙動）
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

  // 入力された文字列を変換内容の欄に反映する
  fixedBefore.innerText = before
  fixedAfter.innerText = after

  toggleVisibility('visible')

  // テキストボックスを空にする
  beforeInput.value = ''
  afterInput.value = ''

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
    const escapeRegExpBefore = escapeRegExp(before)
    const newUrl = url.replace(new RegExp(escapeRegExpBefore, 'g'), after)

    // 変換後のURLを指定する
    chrome.tabs.update({
      url: newUrl
    })
  })
})

/**
 * 「登録する」ボタン押下時のバリデーション
 * 
 * @param {*} before 変換したい文字列
 * @returns バリデーションエラー後の処理を実行しないため、無理矢理returnする
 */
const validationRegister = (before) => {

  if (before == '' || !before.match(/\S/g)) {
    errorMessage.innerText = '変換したい文字列を入力してください'
    return false
  }
  return true
}

/**
 * 「URLを変換する」ボタン押下時のバリデーション
 * 
 * @param {*} url 現在のURL
 * @param {*} before 変換したい文字列
 */
const validationReplace = (url, before) => {

  if (!url.includes(before)) {
    errorMessage.innerText = `現在のURLに'${before}'は含まれません`
  }
}

/**
 * 以下の項目の表示/非表示を指定する
 * ・「URLを変換する」ボタン
 * ・文字列の変換内容
 * 
 * @param {*} visibility 表示/非表示
 */
const toggleVisibility = (visibility) => {

  // 「URLを変換する」ボタン
  document.getElementById("replace-button").style.visibility = visibility;
  // 文字列の変換内容
  document.getElementById("content-to-replace").style.visibility = visibility;
}

/**
 * 渡された文字列の中から以下の文字をエスケープする
 * 対象文字: \/*+.?^&-{}[]()|
 * 
 * @param {*} str 文字列
 * @returns 
 */
const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}