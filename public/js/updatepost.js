// This function will take the input from the form and send a PUT request to the API
const updateHandler = async (event) => {
  event.preventDefault();
  const pathName = window.location.pathname;
  const pathArray = pathName.split("/");
  const post_id = pathArray[pathArray.length - 1];

  const title = document.querySelector("#post-name").value.trim();
  const content = document.querySelector("#post-cont").value.trim();

  if (title && content) {
    const response = await fetch(`/api/posts/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content, post_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return document.location.replace("/dashboard");
    } else {
      return alert("Failed to update post");
    }
  }
};

// This function will take the post_id and send a DELETE request to the API
const deleteHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const post_id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/posts/${post_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return document.location.replace("/dashboard");
    } else {
      return alert("Failed to delete post");
    }
  }
};

document.querySelector("#update").addEventListener("click", updateHandler);
document.querySelector("#delete").addEventListener("click", deleteHandler);
