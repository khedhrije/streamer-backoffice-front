<template>
    <div>
        <div class="grid grid-nogutter surface-section text-800">
            <div class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
                <section>
                    <span class="block text-6xl font-bold mb-1">{{ media.title }}</span>
                    <div class="text-xl text-primary font-bold mb-3">{{ media.ID }}</div>
                    <p class="mt-0 mb-4 text-700 line-height-3">{{ media.description }}</p>
                    <Button label="Publish" type="button" class="mr-3 p-button-raised"></Button>
                    <Button label="Update" type="button" class="p-button-outlined"></Button>
                </section>
            </div>
            <div class="col-12 md:col-6 overflow-hidden">
                <img :src="media.picture" alt="Image" class="md:ml-auto block md:h-full" style="max-height: 25rem; clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
            </div>
            <audio hidden="true" ref="player" :src="selectedAudio.directLink" @timeupdate="updateProgress" @loadedmetadata="setDuration"></audio>

            <div style="min-width: 100%">
                <div class="grid grid-nogutter">
                    <div class="col-12">
                        <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3" :class="{ 'border-top-1 surface-border': media }">
                            <div class="md:w-10rem relative">
                                <img class="block xl:block mx-auto border-round w-full" :src="media.picture" :alt="media.title" />
                                <Tag :value="media.status" class="absolute" style="left: 4px; top: 4px"></Tag>
                            </div>
                            <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                                <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                    <div>
                                        <span class="font-medium text-secondary text-sm">{{ media.ID }}</span>
                                        <div class="text-lg font-medium text-900 mt-2">{{ media.title }}</div>
                                    </div>
                                    <div>
                                        <span class="font-medium text-secondary text-sm">{{ formatTime(currentTime) }} / {{ formatTime(media.duration) }}</span>
                                    </div>
                                    <input v-if="media.ID === media.ID" style="min-width: 100%" type="range" :value="currentTime" :max="duration" @input="seek($event.target.value)" />
                                    <p></p>
                                </div>
                                <div class="flex flex-column md:align-items-end gap-5">
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <!-- Play button only shows if media is not playing or a different media is playing -->
                                        <Button v-if="!isPlaying || media.ID !== media.ID" icon="pi pi-play" outlined @click="play(media)"></Button>
                                        <!-- Pause button shows only when this specific media is playing and is not paused -->
                                        <Button v-if="media.ID === media.ID && isPlaying && !isPaused" icon="pi pi-pause" outlined @click="pause()"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid mt-1">
            <div class="col-7">No</div>
            <div class="col-5">Hey</div>
        </div>
    </div>
</template>

<script>
import MediaService from '@/service/MediaService';
import AudioService from '@/service/AudioService';

export default {
    data() {
        return {
            media: {},
            medias: [],
            isPlaying: false,
            isPaused: false,
            selectedMedia: {},
            selectedAudio: {},
            currentTime: 0,
            duration: 0,
        };
    },

    mediaService: null,
    audioService: null,

    created() {
        this.mediaService = new MediaService();
        this.audioService = new AudioService();
    },
    mounted() {
        this.mediaService.getMedia(this.$route.params.ID).then((data) => (this.media = data));
    },
    methods: {
        formatTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            seconds = Math.floor(seconds % 60); // Ensure seconds are an integer
            minutes = minutes % 60; // Ensure minutes are calculated correctly

            return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
        },
        padTime(time) {
            return time.toString().padStart(2, '0');
        },
        play(media) {
            this.selectedMedia = media;
            this.audioService.getAudioByMediaUUID(this.selectedMedia.ID).then((data) => {
                this.selectedAudio = data;
                this.isPlaying = true;
                this.isPaused = false;
                this.$nextTick(() => {
                    this.playAudio();
                });
            });
        },

        playAudio() {
            if (this.$refs.player) {
                this.$refs.player.play();
                this.isPlaying = true;
                this.isPaused = false;
            }
        },

        pause() {
            if (this.$refs.player) {
                this.$refs.player.pause();
                this.isPlaying = false;
                this.isPaused = true;
            }
        },

        stop() {
            if (this.$refs.player) {
                this.$refs.player.pause();
                this.isPlaying = false;
                this.isPaused = false;
                this.selectedAudio = {};
            }
        },

        increaseVolume() {
            if (this.$refs.player.volume < 1) this.$refs.player.volume += 0.1;
        },

        decreaseVolume() {
            if (this.$refs.player.volume > 0) this.$refs.player.volume -= 0.1;
        },

        updateProgress() {
            this.currentTime = this.$refs.player.currentTime;
        },

        setDuration() {
            this.duration = this.$refs.player.duration;
        },

        seek(time) {
            if (this.$refs.player) {
                this.$refs.player.currentTime = time;
            }
        },
    },
};
</script>

<style scoped lang="scss">
.audio-player {
    color: #ff00ff; /* Adjust to match your theme */
    background-color: #e0e0e0; /* Light grey background */
    padding: 10px;
    width: 300px; /* Adjust based on your layout */
    border-radius: 5px;
}

.controls button {
    background-color: #d70070; /* Pink shade */
    color: white;
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
}

.controls input[type='range'] {
    width: 100%;
}
</style>
