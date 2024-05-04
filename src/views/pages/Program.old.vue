<template>
  <div>
    <div class="grid grid-nogutter surface-section text-800">
      <div class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
        <section>
          <span class="block text-6xl font-bold mb-1">{{ program.title }}</span>
          <div class="text-xl text-primary font-bold mb-3">{{ program.ID }}</div>
          <p class="mt-0 mb-4 text-700 line-height-3">{{ program.description }}</p>
          <Button label="Publish" type="button" class="mr-3 p-button-raised"></Button>
          <Button label="Update" type="button" class="p-button-outlined"></Button>
        </section>
      </div>
      <div class="col-12 md:col-6 overflow-hidden">
        <img :src="program.picture" alt="Image" class="md:ml-auto block md:h-full"
             style="max-height: 20rem; clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
      </div>
      <audio hidden="true" ref="player" :src="selectedAudio.directLink" @timeupdate="updateProgress"
             @loadedmetadata="setDuration"></audio>

      <div v-if="selectedMedia.ID && selectedAudio.ID" style="min-width: 100%">
        <div class="grid grid-nogutter">
          <div class="col-12">
            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                 :class="{ 'border-top-1 surface-border': selectedMedia }">
              <div class="md:w-10rem relative">
                <img class="block xl:block mx-auto border-round w-full" :src="selectedMedia.picture"
                     :alt="selectedMedia.title" />
                <Tag :value="selectedMedia.status" class="absolute" style="left: 4px; top: 4px"></Tag>
              </div>
              <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                  <div>
                    <span class="font-medium text-secondary text-sm">{{ selectedMedia.ID }}</span>
                    <div class="text-lg font-medium text-900 mt-2">{{ selectedMedia.title }}</div>
                  </div>
                  <div>
                    <span class="font-medium text-secondary text-sm">{{ formatTime(currentTime)
                      }} / {{ formatTime(selectedMedia.duration) }}</span>
                  </div>
                  <input v-if="selectedMedia.ID === selectedMedia.ID" style="min-width: 100%" type="range"
                         :value="currentTime" :max="duration" @input="seek($event.target.value)" />
                  <p></p>
                </div>
                <div class="flex flex-column md:align-items-end gap-5">
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <!-- Play button only shows if media is not playing or a different media is playing -->
                    <Button v-if="!isPlaying || selectedMedia.ID !== selectedMedia.ID" icon="pi pi-play" outlined
                            @click="play(selectedMedia)"></Button>
                    <!-- Pause button shows only when this specific media is playing and is not paused -->
                    <Button v-if="selectedMedia.ID === selectedMedia.ID && isPlaying && !isPaused" icon="pi pi-pause"
                            outlined @click="pause()"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 grid mt-1">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Medias</span>
              <div class="text-900 font-medium text-xl">{{ totalMedias }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                 style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-headphones text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Running</span>
              <div class="text-900 font-medium text-xl">{{ totalRunning }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                 style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-play text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Scheduled</span>
              <div class="text-900 font-medium text-xl">{{ totalScheduled }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                 style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-home text-cyan-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Unprocessed</span>
              <div class="text-900 font-medium text-xl">{{ totalUnprocessed }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                 style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-globe text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid mt-1">
      <div class="col-7">
        <div class="card">
          <TabMenu :model="tabs" v-model:activeIndex="activeTab" />
        </div>
        <div v-if="activeTab == 0" class="card">General</div>
        <div v-if="activeTab == 1" class="card">Medias</div>
        <div v-if="activeTab == 2" class="card">Blocks</div>
        <div v-if="activeTab == 3" class="card">Categories</div>
        <div v-if="activeTab == 4" class="card">Tags</div>
      </div>
      <div class="col-5">
        <DataView :value="medias" paginator :rows="5">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="item in slotProps.items" :key="item.ID" class="col-12">
                <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                     :class="{ 'border-top-1 surface-border': item }">
                  <div class="md:w-10rem relative">
                    <img class="block xl:block mx-auto border-round w-full" :src="item.picture" :alt="item.title" />
                    <Tag :value="item.status" class="absolute" style="left: 4px; top: 4px"></Tag>
                  </div>
                  <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                    <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                      <div>
                        <span class="font-medium text-secondary text-sm">{{ item.ID }}</span>
                        <div class="text-lg font-medium text-900 mt-2">{{ item.title }}</div>
                      </div>
                      <div>
                        <span class="font-medium text-secondary text-sm">{{ formatTime(item.duration) }}</span>
                      </div>
                      <input v-if="item.ID === selectedMedia.ID" type="range" :value="currentTime" :max="duration"
                             @input="seek($event.target.value)" />
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <div class="flex flex-row-reverse md:flex-row gap-2">
                        <!-- Play button only shows if media is not playing or a different media is playing -->
                        <Button v-if="!isPlaying || item.ID !== selectedMedia.ID" icon="pi pi-play" outlined
                                @click="play(item)"></Button>
                        <!-- Pause button shows only when this specific media is playing and is not paused -->
                        <Button v-if="item.ID === selectedMedia.ID && isPlaying && !isPaused" icon="pi pi-pause"
                                outlined @click="pause()"></Button>
                        <!-- View details button -->
                        <router-link :to="'/medias/' + item.ID" rel="noopener">
                          <Button icon="pi pi-eye" outlined class="p-button-info mr-2" />
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>

<script>
import ProgramService from "@/service/ProgramService";
import MediaService from "@/service/MediaService";
import AudioService from "@/service/AudioService";

export default {
  data() {
    return {
      program: {},
      medias: [],
      isPlaying: false,
      isPaused: false,
      selectedMedia: {},
      selectedAudio: {},
      currentTime: 0,
      duration: 0,
      tabs: [
        { label: "General", icon: "pi pi-home" },
        { label: "Medias", icon: "pi pi-inbox" },
        { label: "Blocks", icon: "pi pi-inbox" },
        { label: "Categories", icon: "pi pi-chart-line" },
        { label: "Tags", icon: "pi pi-list" }
      ],
      activeTab: 0
    };
  },

  programService: null,
  mediaService: null,
  audioService: null,

  created() {
    this.programService = new ProgramService();
    this.mediaService = new MediaService();
    this.audioService = new AudioService();
  },
  mounted() {
    this.programService.getProgram(this.$route.params.ID).then((data) => (this.program = data));
    this.mediaService.getMediasByProgramUUID(this.$route.params.ID).then((data) => (this.medias = data));
  },
  computed: {
    totalMedias() {
      return this.medias.length;
    },
    totalRunning() {
      return this.medias.filter((media) => media.status === "run").length;
    },
    totalScheduled() {
      return this.medias.filter((media) => media.status === "scheduled").length;
    },
    totalUnprocessed() {
      return this.medias.filter((media) => media.status === "unprocessed").length;
    }
  },
  methods: {
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

    pause() {
      if (this.$refs.player) {
        this.$refs.player.pause();
        this.isPlaying = false;
        this.isPaused = false;
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
    formatTime(seconds) {
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      seconds = Math.floor(seconds % 60); // Ensure seconds are an integer
      minutes = minutes % 60; // Ensure minutes are calculated correctly

      return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
    },
    padTime(time) {
      return time.toString().padStart(2, "0");
    }
  }
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
