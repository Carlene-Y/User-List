const BASE_URL = "https://user-list.alphacamp.io/"
const INDEX_URL = BASE_URL + "api/v1/users/"

const users = JSON.parse(localStorage.getItem('FavoriteUser')) || []


// axios.get(INDEX_URL).then((response) => {
//   users.push(...response.data.results)
//   renderUsersData(users)
// })
//   .catch((err) => console.log(err))


const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderUsersData(users) {
  let rawHTML = ''
  users.forEach(item => {
    rawHTML += `
      <div class="card m-2" style="width: 10rem;">
      <img src="${item.avatar}" class="card-img-top" data-bs-toggle="modal" data-bs-target="#user-modal" id="robot-avatar" alt="avatar" data-id="${item.id}">
      <div class="card-body">
        <p class="card-text" id="robot-name">${item.name}</p>
        <a href="#" class="btn btn-danger" id="delete-btn" data-id="${item.id}">x</a>
        
      </div>
    </div>
    `  
  })
  dataPanel.innerHTML = rawHTML
}
renderUsersData(users)

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

//remove
function removeFromFavorite(id) {
  if( !users || !users.length) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex,1)
  localStorage.setItem('FavoriteUser',JSON.stringify(users))
  renderUsersData(users)
}



dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('#robot-avatar')) {
    showUsersModal(event.target.dataset.id)
  } else if (event.target.matches('#delete-btn')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

//search bar
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredUsers = []
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword}，沒有符合條件的結果`)
  }
  renderUsersData(filteredUsers)
})


