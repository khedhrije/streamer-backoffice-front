export default class AudioService {
    getAudios() {
        return fetch('https://streamer-api-nehy8.ondigitalocean.app/private/content/audios')
            .then((res) => res.json())
            .then((d) => d);
    }

    getAudio(uuid) {
        return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/audios/${uuid}`)
            .then((res) => res.json())
            .then((d) => d);
    }

    getAudioByMediaUUID(uuid) {
        return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/medias/${uuid}/audio`)
          .then((res) => res.json())
          .then((d) => d);
    }

    deleteAudio(uuid) {
        const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/audios/${uuid}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        return fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                return data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    ingestAudio(permalink) {
        const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/external/audios/ingest?permalink=${permalink}`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        return fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                return data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    updateAudio(uuid, audio) {
        const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/internal/audios/${uuid}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: audio.status }),
        };

        return fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                return data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
