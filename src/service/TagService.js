export default class TagService {
  getTags() {
    return fetch("https://streamer-api-nehy8.ondigitalocean.app/private/classification/tags")
      .then((res) => res.json())
      .then((d) => d);
  }

  getTagsByProgramUUID(uuid) {
    return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/programs/${uuid}/tags`)
      .then((res) => res.json())
      .then((d) => d);
  }

  getTag(uuid) {
    return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/classification/tags/${uuid}`)
      .then((res) => res.json())
      .then((d) => d);
  }

  deleteTag(uuid) {
    const url = `https://streamer-api-nehy8.ondigitalocean.app/private/classification/tags/${uuid}`;
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

  updateTag(uuid, tag) {
    const url = `https://streamer-api-nehy8.ondigitalocean.app/private/classification/tags/${uuid}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: tag.status })
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
