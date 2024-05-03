export default class ProgramService {
    getPrograms() {
        return fetch('https://streamer-api-nehy8.ondigitalocean.app/private/content/programs')
            .then((res) => res.json())
            .then((d) => d);
    }

    getProgram(uuid) {
        return fetch(`https://streamer-api-nehy8.ondigitalocean.app/private/content/programs/${uuid}`)
            .then((res) => res.json())
            .then((d) => d);
    }

    deleteProgram(uuid) {
        const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/programs/${uuid}`;
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

    updateProgram(uuid, program) {
        const url = `https://streamer-api-nehy8.ondigitalocean.app/private/content/internal/programs/${uuid}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: program.status }),
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
