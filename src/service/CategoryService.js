export default class Categorieservice {
  getCategories() {
    return fetch("https://streamer-api-nehy8.ondigitalocean.app/private/classification/categories")
      .then((res) => res.json())
      .then((d) => d);
  }

  getCategoriesByProgramUUID(uuid) {
    return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/programs/${uuid}/categories`)
      .then((res) => res.json())
      .then((d) => d);
  }

  getCategory(uuid) {
    return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/classification/categories/${uuid}`)
      .then((res) => res.json())
      .then((d) => d);
  }

  deleteCategory(uuid) {
    const url = `https://streamer-api-nehy8.ondigitalocean.app/private/classification/categories/${uuid}`;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  updateCategory(uuid, category) {
    const url = `https://streamer-api-nehy8.ondigitalocean.app/private/classification/categories/${uuid}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: category.status })
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
