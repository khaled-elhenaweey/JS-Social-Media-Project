let baseUrl = "https://tarmeezacademy.com/api/v1/";

function getAllPosts() {
  // Make a request for a user with a given ID
  axios
    .get(`${baseUrl}posts?limit=1`)
    .then(function (response) {
      // handle success
      let postsBlock = document.getElementById("postContainer");
      let posts = response.data.data;
      for (const post of posts) {
        let tagsContent = "";
        let content = `
        <div class="card mb-3">
        <div class="card-header">
            <img src="${post.author.profile_image}" class="rounded-circle" alt="card-img" style='min-width: 40px; max-width: 40px; max-height: 40px'>
        <span class="fw-bold">@${post.author.name}</span>
        </div>
        <div class="card-body">
            <img src="${post.image}" class="w-100">
            <span> ${post.created_at}</span>
            <h5 class="card-title">
            ${post.title}
            </h5>
            <p class="card-text"> ${post.body}</p>
        </div>
        <div class="card-footer text-muted">
        <span><i class="bi bi-chat-left-dots"></i>(${post.comments_count}) comments</span>
        
        <span id="tagsContainer"></span>

      </div>
        </div>
        `;
        for (const tag of post.tags) {
          console.log(tag);
          tagsContent += `
          <span class="badge text-bg-primary">${tag}</span>
      `;
        }
        postsBlock.innerHTML += content;
        // Insert tags content into the tagsContainer of the last inserted post
        let tagsContainer =
          postsBlock.lastElementChild.querySelector("#tagsContainer");
        tagsContainer.innerHTML = tagsContent;
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}
function userLogin() {
  const userName = document.getElementById("loginUser").value;
  const userPass = document.getElementById("loginPass").value;
  let param = {
    username: userName,
    password: userPass,
  };
  axios
    .post(`${baseUrl}login`, param)
    .then(function (response) {
      let userToken = response.data.token;
      let userData = response.data.user;
      localStorage.setItem("userToken", userToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      showToast("login", "your data saved");
      stepUI();
    })
    .catch(function (error) {
      console.log(error);
    });
}
function userLogout() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
  showToast("logout", "remove data done");
  stepUI();
}
function showToast(type, message) {
  const toastLive = document.getElementById("liveToast");
  let toastMessage = document.querySelector(".toast-body");
  let toastType = document.querySelector(".toast-type");
  toastLive.classList.remove("hide");
  toastLive.classList.add("show");
  toastMessage.innerHTML = message;
  toastType.innerHTML = type;
}
function stepUI() {
  const token = localStorage.getItem("userToken");
  let loginDiv = document.querySelector(".login");
  let logoutDiv = document.querySelector(".logout");
  if (token == null) {
    loginDiv.classList.add("d-flex");
    loginDiv.classList.remove("d-none");
    logoutDiv.classList.add("d-none");
    logoutDiv.classList.remove("d-flex");
  } else {
    loginDiv.classList.add("d-none");
    loginDiv.classList.remove("d-flex");
    logoutDiv.classList.add("d-flex");
    logoutDiv.classList.remove("d-none");
  }
}

getAllPosts();
