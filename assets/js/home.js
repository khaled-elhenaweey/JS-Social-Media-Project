function getAllPosts() {
  // Make a request for a user with a given ID
  axios
    .get("https://tarmeezacademy.com/api/v1/posts")
    .then(function (response) {
      // handle success
      let postsBlock = document.getElementById("postContainer");
      let posts = response.data.data;
      for (const post of posts) {
        let content = `
          <div class="card mb-3">
          <div class="card-header">
    
              <img src="${post.author.profile_image}" class="rounded-circle" alt="card-img" style='min-width: 40px; max-width: 40px; max-height: 40px'>
           <span class="fw-bold">@${post.author.name}</span>
          </div>
          <div class="card-body">
              <img src="            ${post.image}
              " class="w-100">
            <h5 class="card-title">
            ${post.created_at}
            </h5>
            <p class="card-text">  ${post.body}</p>
          </div>
        </div>
          
          
          `;
        console.log(post);
        postsBlock.innerHTML += content;
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
getAllPosts();
