const BASE_URL = "https://user-list.alphacamp.io/"
const INDEX_URL = BASE_URL + "api/v1/users/"
const USER_PER_PAGE = 15
const users = []
let filteredUsers = []

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUsersData(getUserByPage(1))
})
  .catch((err) => console.log(err))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderUsersData(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
      <div class="card m-2" style="width: 10rem;">
      <img src="${item.avatar}" class="card-img-top" data-bs-toggle="modal" data-bs-target="#user-modal" id="robot-avatar" alt="avatar" data-id="${item.id}">
      <div class="card-body">
        <p class="card-text" id="robot-name">${item.name}</p>
        <a href="#" class="btn btn-primary" id="plus-btn" data-id="${item.id}">+</a>
        
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}
//modal
function showUsersModal(id) {
  const userName = document.querySelector('#modal-name')
  const userAvatar = document.querySelector('.modal-avatar')
  const userDetail = document.querySelector('#modal-detail')

  axios
    .get(INDEX_URL + id)
    .then(response => {
      const data = response.data
      userName.innerText = data.name
      userAvatar.src = data.avatar
      userDetail.innerHTML = `
        <p>email: ${data.email}</p>
        <p>gender: ${data.gender}</p>
        <p>age: ${data.age}</p>
        <p>region: ${data.region}</p>
        <p>birthday: ${data.birthday}</p>
    `
    })
    .catch(error => console.log(error))
}


//favorite
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('FavoriteUser')) || []
 const user = users.find((user) => user.id === id)
  
  if (list.some((user) => user.id === id)) {
    return alert ('此使用者已在收藏清單中！')
  } else {alert('已將使用者加入清單')}
  list.push(user)
  event.preventDefault()
localStorage.setItem('FavoriteUser',JSON.stringify(list))
  
}

//pagination
function renderPaginator (amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page ++ ) {
    rawHTML += `
  <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
  `
  }
  paginator.innerHTML = rawHTML
}

function getUserByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USER_PER_PAGE
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('#robot-avatar')) {
    showUsersModal(event.target.dataset.id)
  } else if (event.target.matches('#plus-btn')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//search bar
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    filteredUsers = 'noResult'
    return alert(`您輸入的關鍵字：${keyword}，沒有符合條件的結果`)
  }
  renderUsersData(getUserByPage(1))
  renderPaginator(filteredUsers.length)  
})

//btn paginator
paginator.addEventListener('click',function onPaginatorClicked(event){
  if (event.target.tagName !=='A') return
  const page = Number(event.target.dataset.page)
  if (filteredUsers === 'noResult') return
    renderUsersData(getUserByPage(page))
})

//change test