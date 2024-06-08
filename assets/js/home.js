let baseUrl = "https://tarmeezacademy.com/api/v1/";
let currentPage = 1;
let lastPage = 1;

window.addEventListener("scrollend", function () {
  const endOfPage =
    window.innerHeight + this.window.pageYOffset >=
    this.document.body.offsetHeight;
  console.log(currentPage, lastPage);
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getAllPosts(false, currentPage);
  }
});
getAllPosts();
function createPost() {
  const title = document.getElementById("postTitle").value;
  const body = document.getElementById("postInfo").value;
  const image = document.getElementById("postImage").files[0];
  let token = localStorage.getItem("userToken");

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);
  const headers = {
    "Content-Type": "multipart/form-data",
    // prettier-ignore
    "authorization": `Bearer ${token}`,
  };

  axios
    .post(`${baseUrl}posts`, formData, { headers: headers })
    .then(function (response) {
      getAllPosts();
      console.log("post created");
    })
    .catch(function (error) {
      // Log the error for better debugging
      console.log("Error:", error.response);
      showToast("error", error.response.data.message);
    });
}
function getAllPosts(reload = true, page = 1) {
  // Make a request for a user with a given ID ?limit=1
  axios
    .get(`${baseUrl}posts?limit=4&page=${page}`)
    .then(function (response) {
      // handle success
      let postsBlock = document.getElementById("postContainer");
      let posts = response.data.data;
      lastPage = response.data.meta.last_page;
      if (reload) {
        postsBlock.innerHTML = "";
      }
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
function userRegister() {
  const userName = document.getElementById("registerUser").value;
  const name = document.getElementById("registerName").value;
  const userPass = document.getElementById("registerPass").value;
  const userImage = document.getElementById("userImage").files[0];
  let formData = new FormData();
  formData.append("username", userName);
  formData.append("password", userPass);
  formData.append("name", name);
  formData.append("profile_image", userImage);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(`${baseUrl}register`, formData, { headers: headers })
    .then(function (response) {
      console.log(response.data);
      let userToken = response.data.token;
      let userData = response.data.user;
      localStorage.setItem("userToken", userToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      showToast("register", "your data saved");
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
  const user = JSON.parse(localStorage.getItem("userData"));
  let loginDiv = document.querySelector(".login");
  let logoutDiv = document.querySelector(".logout");
  let createPostBtn = document.querySelector("#createPostBtn");
  let userInfo = document.querySelector(".user-info");
  let userContent = `
            <span class="fw-bold me-2">${user.name}</span>
  `;
  userInfo.innerHTML = userContent;
  if (token == null) {
    loginDiv.classList.add("d-flex");
    loginDiv.classList.remove("d-none");
    logoutDiv.classList.add("d-none");
    logoutDiv.classList.remove("d-flex");
    createPostBtn.classList.add("d-none");
    createPostBtn.classList.remove("d-flex");
  } else {
    loginDiv.classList.add("d-none");
    loginDiv.classList.remove("d-flex");
    logoutDiv.classList.add("d-flex");
    logoutDiv.classList.remove("d-none");
    createPostBtn.classList.remove("d-none");
    createPostBtn.classList.add("d-flex");
  }
}
stepUI();
