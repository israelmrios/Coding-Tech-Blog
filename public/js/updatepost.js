const updateHandler = async (event) => {
  event.preventDefault();
  const pathName = window.location.pathname;
  const pathArray = pathName.split("/");
  const post_id = pathArray[pathArray.length - 1];

  const title = document.querySelector("#post-name").value.trim();
  const content = document.querySelector("#post-cont").value.trim();

  if (title && content) {
    // const id = event.target.getAttribute("data-id");
    const response = await fetch(`/api/posts/${post_id}`, {
      method: "Put",
      body: JSON.stringify({ title, content, post_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert("Failed to update post");
    }
  }
};

const deleteHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert("Failed to delete post");
    }
  }
};

document.querySelector("#update").addEventListener("click", updateHandler);
document.querySelector("#delete").addEventListener("click", deleteHandler);