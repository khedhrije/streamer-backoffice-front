export default class MediaService {
  getMedias() {
    return fetch("https://streamer-api-nehy8.ondigitalocean.app/private/content/medias")
      .then((res) => res.json())
      .then((d) => d);
  }

  getMedia(uuid) {
    return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/medias/${uuid}`)
      .then((res) => res.json())
      .then((d) => d);
  }

  getMediasByProgramUUID(uuid) {
    return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/programs/${uuid}/medias`)
      .then((res) => res.json())
      .then((d) => d);
  }

  deleteMedia(uuid) {
    const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/medias/${uuid}`;
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

  updateMedia(uuid, media) {
    const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/internal/medias/${uuid}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: media.status })
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
