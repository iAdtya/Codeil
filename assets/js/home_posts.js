{
  // Function to create a new post using AJAX
  let createPost = function () {
    // Select the new post form by its ID
    let newPostForm = $("#new-post-form");
  
    // Submit event handler for the form
    newPostForm.submit(function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Send a POST request to the server
      $.ajax({
        type: "POST",
        url: "/posts/create", // The URL where the post creation endpoint is located
        data: newPostForm.serialize(), // Serialize the form data for submission
        success: function (data) {
          // This function is called when the request is successful
          // It receives the response data from the server
          let newpost = newPostDom(data.data.post);
  
          // Prepend the new post to the posts list container
          $("#posts-list-container > ul").prepend(newpost);
  
          // Attach a deletePost function to the delete button of the new post
          deletePost($(".delete-post-button", newpost));
        },
        error: function (error) {
          // This function is called if there is an error in the AJAX request
          console.log(error.responseText); // Log the error message to the console
        },
      });
    });
  };
  
  
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">
        <p>
          <small>
            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
          </small>
          <%}%> ${ post.content }>
          <br />
          <small> ${post.user.name} </small>
        </p>
        <div class="post-comments"> 
          <form action="/comments/create" method="POST">
            <input
              type="text"
              name="content"
              placeholder="Type Here to add comment..."
            />
            <input type="hidden" name="post" value="${ post._id}" />
            <input type="submit" value="Add Comment" />
          </form>
          
          <div class="post-comments-list">
            <ul id="post-comments-${ post._id}">
            </ul>
          </div>
        </div>
      </li>
      `)
    }
  
    let deletePost = function (deleteLink) {
      $(deleteLink).click(function (event) {
        event.preventDefault();
  
        $.ajax({
          type: "get",
          url: $(deleteLink).prop("href"),
          success: function (data) {
            $(`#post-${data.data.post_id}`).remove();
          }, error: function (error) {
            console.log(error.responseText);
          }
        })
      
      })
    }
  
    createPost();
  }