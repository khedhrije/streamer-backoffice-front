export default class BlockService {
    getBlocks() {
        return fetch('https://streamer-api-nehy8.ondigitalocean.app/private/display/blocks')
            .then((res) => res.json())
            .then((d) => d);
    }
    getBlocksByProgramUUID(uuid) {
        return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/programs/${uuid}/blocks`)
            .then((res) => res.json())
            .then((d) => d);
    }
    getBlock(uuid) {
        return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/blocks/${uuid}`)
            .then((res) => res.json())
            .then((d) => d);
    }
    deleteBlock(uuid) {
        const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/blocks/${uuid}`;
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
    updateBlock(uuid, block) {
        const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/internal/blocks/${uuid}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: block.status }),
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
