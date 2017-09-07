let yesSelected = document.getElementById('reset_yes')
let noSelected = document.getElementById('reset_no')
let LanguageMenu = ''
let menu_list = ''

yesSelected.addEventListener('click', function onYesSelect (e) {
  console.log('yesSelected was clicked')
  console.log(LanguageMenu)
  if (LanguageMenu === '') {
    renderLanguageMenu(LanguageMenu)
  }
})

noSelected.addEventListener('click', function noSelected (f) {
  console.log('noSelected was clicked')
    if (LanguageMenu !== '') {
      deleteLanguageMenu(LanguageMenu)
      LanguageMenu = ''
    }
})

function renderLanguageMenu() {
  LanguageMenu = document.createElement("select")
  LanguageMenu.setAttribute("id", "language-menu")
  LanguageMenu.setAttribute('name', 'language')
  console.log(LanguageMenu)

  let languages = ['JavaScript', 'Java', 'Python', 'CSS', 'PHP', 'Ruby', 'C++']

  for (let i = 0; i < languages.length; i++) {
    let LanguageOption = document.createElement ('option')
    LanguageOption.textContent = languages[i]
    LanguageOption.setAttribute('value', 'languages[i]')
    LanguageMenu.appendChild(LanguageOption)
  }
  yesSelected.insertAdjacentElement('afterend', LanguageMenu)
}

function deleteLanguageMenu() {
  LanguageMenu = document.getElementById('language-menu')
  LanguageMenu.remove()
}

// <textarea cols="50" rows="10" name="body" placeholder="Add a code snippet here" required value={{body}}></textarea>
