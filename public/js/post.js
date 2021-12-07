const deleteButtons = document.getElementsByClassName("btn-danger");

// Using a for loop to take the deleteButton Id and sends a DELETE request to the API endpoint
for (let i = 0; i < deleteButtons.length; i++) {
  const id = deleteButtons[i].getAttribute("data-delete");
  deleteButtons[i].addEventListener("click", async (e) => {
    e.preventDefault();
    const route = "../api/comments/" + id;
    const response = await fetch(route, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      setTimeout(() => {
        document.location.reload();
      }, 300);
    } else {
      alert(response.statusText);
    }
  });
}

// This function takes the input from the form and sends a POST request to the API endpoint
const comment = async (event) => {
  event.preventDefault();

  const content = document.getElementById("content").value;
  const pathName = window.location.pathname;
  const pathArray = pathName.split("/");
  const post_id = pathArray[pathArray.length - 1];

  if (content) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ content, post_id }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setTimeout(() => {
        document.location.reload();
      }, 300);
    } else {
      alert(response.statusText);
    }
  }
};

document.getElementById("comment").addEventListener("click", comment);
