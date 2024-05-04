<template>
  <div class="grid crud-demo">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button label="Ingest" icon="pi pi-cloud-download" class="p-button-warning" @click="openIngest" />
            </div>
          </template>

          <template v-slot:end>
            <FileUpload disabled mode="basic" accept="image/*" :maxFileSize="1000000" label="Import"
                        chooseLabel="Import" class="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          :value="audios"
          v-model:selection="selectedAudios"
          dataKey="ID"
          :paginator="true"
          :rows="5"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} audios"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Manage Audios</h5>
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
              </IconField>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="max-width: 0.5rem"></Column>
          <Column header="Picture" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Picture</span>
              <img :src="slotProps.data.picture" :alt="slotProps.data.image" class="shadow-2" width="100" />
            </template>
          </Column>
          <Column field="ID" header="ID" headerStyle="width:20%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">ID</span>
              {{ slotProps.data.ID }}
            </template>
          </Column>
          <Column field="title" header="Title" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.title }}
            </template>
          </Column>
          <Column field="provider" header="Provider" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Provider</span>
              <span
                :class="'provider-badge provider-' + (slotProps.data.provider ? slotProps.data.provider.toLowerCase() : '')">{{ slotProps.data.provider
                }}</span>
            </template>
          </Column>
          <Column field="status" header="Status" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              <span
                :class="'status-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status
                }}</span>
            </template>
          </Column>
          <Column field="language" header="Language" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Language</span>
              {{ slotProps.data.language }}
            </template>
          </Column>
          <Column field="country" header="Country" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">country</span>
              {{ slotProps.data.country }}
            </template>
          </Column>
          <Column headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                      @click="editAudio(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning"
                      @click="confirmDeleteAudio(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="audioDialog" :style="{ width: '600px' }" header="Audio Details" :modal="true"
                class="p-fluid">
          <img :src="audio.picture" :alt="audio.picture" v-if="audio.picture" width="150"
               class="mt-0 mx-auto mb-5 block shadow-2" />
          <div class="field">
            <label for="ID">ID</label>
            <InputText id="ID" v-model.trim="audio.ID" :disabled="audio.prvider != 'internal'" required="true" autofocus
                       :class="{ 'p-invalid': submitted && !audio.ID }" />
            <small class="p-invalid" v-if="submitted && !audio.ID">ID is required.</small>
          </div>
          <div class="field">
            <label for="name">Title</label>
            <InputText id="title" v-model.trim="audio.title" :disabled="audio.prvider != 'internal'" required="true"
                       autofocus :class="{ 'p-invalid': submitted && !audio.title }" />
            <small class="p-invalid" v-if="submitted && !audio.title">Title is required.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="audio.description" :disabled="audio.prvider != 'internal'"
                      required="true" rows="5" cols="20" />
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="provider">Country</label>
              <InputText id="provider" v-model="audio.country" :disabled="audio.prvider != 'internal'" />
            </div>
            <div class="field col">
              <label for="provider">Language</label>
              <InputText id="provider" v-model="audio.language" :disabled="audio.prvider != 'internal'" />
            </div>
          </div>

          <div class="field">
            <label for="status" class="mb-3">Status</label>
            <Dropdown id="status" v-model="audio.status" :options="statuses" optionLabel="label"
                      placeholder="Select a Status">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'status-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'status-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                </div>
                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
              </template>
            </Dropdown>
          </div>

          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveAudio" />
          </template>
        </Dialog>

        <Dialog v-model:visible="audioIngestDialog" :style="{ width: '600px' }" header="Audio Ingest" :modal="true"
                class="p-fluid">
          <div class="field">
            <label for="permalink">Permalink</label>
            <InputText id="permalink" v-model.trim="permalink" required="true" autofocus
                       :class="{ 'p-invalid': submitted && !permalink }" />
            <small class="p-invalid" v-if="submitted && !permalink">Permalink is required.</small>
          </div>

          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="ingestAudio" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteAudioDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="audio"
            >Are you sure you want to delete <b>{{ audio.name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAudioDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteAudio" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteAudiosDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="audio">Are you sure you want to delete the selected audios?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAudiosDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedAudios" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import AudioService from "@/service/AudioService";

export default {
  data() {
    return {
      permalink: null,
      audios: null,
      audioDialog: false,
      audioIngestDialog: false,
      deleteAudioDialog: false,
      deleteAudiosDialog: false,
      audio: {},
      selectedAudios: null,
      filters: {},
      submitted: false,
      statuses: [
        { label: "UNPROCESSED", value: "unprocessed" },
        { label: "RUN", value: "run" },
        { label: "SCHEDULED", value: "scheduled" }
      ]
    };
  },
  audioService: null,
  created() {
    this.audioService = new AudioService();
    this.initFilters();
  },
  mounted() {
    this.audioService.getAudios().then((data) => (this.audios = data));
  },
  methods: {
    openNew() {
      this.audio = {};
      this.submitted = false;
      this.audioDialog = true;
    },
    openIngest() {
      this.audio = {};
      this.submitted = false;
      this.audioIngestDialog = true;
    },
    hideDialog() {
      this.audioDialog = false;
      this.audioIngestDialog = false;
      this.submitted = false;
    },
    saveAudio() {
      this.submitted = true;
      if (this.audio.title.trim()) {
        if (this.audio.ID) {
          this.audioService.getAudio(this.audio.ID).then((data) => (this.audio = data));
          this.audio.status = this.audio.status.value ? this.audio.status.value : this.audio.status;
          this.audioService.updateAudio(this.audio.ID, this.audio).then(() => {
            this.audioService.getAudios().then((data) => (this.audios = data));
            this.audio = {};
            this.$toast.add({ severity: "success", summary: "Successful", detail: "Audio Updated", life: 3000 });
          });
        } else {
          this.audio.status = this.audio.status ? this.audio.status.value : "UNPROCESSED";
          this.$toast.add({ severity: "success", summary: "Successful", detail: "Audio Created", life: 3000 });
        }
        this.audioDialog = false;
        this.audio = {};
      }
    },
    ingestAudio() {
      this.submitted = true;
      this.audioService.ingestAudio(this.permalink).then(() => {
        this.$toast.add({ severity: "success", summary: "Successful", detail: "Audio Ingestion started", life: 3000 });
        this.permalink = null;
        this.audioIngestDialog = false;
        this.submitted = false;
      });
    },
    editAudio(audio) {
      this.audio = { ...audio };
      this.audioDialog = true;
    },
    confirmDeleteAudio(audio) {
      this.audio = audio;
      this.deleteAudioDialog = true;
    },
    deleteAudio() {
      this.audioService.deleteAudio(this.audio.ID).then(() => {
        this.audioService.getAudios().then((data) => (this.audios = data));
        this.deleteAudioDialog = false;
        this.audio = {};
        this.submitted = false;
        this.$toast.add({ severity: "success", summary: "Successful", detail: "Audio Deleted", life: 3000 });
      });
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteAudiosDialog = true;
    },
    deleteSelectedAudios() {
      this.audios = this.audios.filter((val) => !this.selectedAudios.includes(val));
      this.deleteAudiosDialog = false;
      this.selectedAudios = null;
      this.$toast.add({ severity: "success", summary: "Successful", detail: "Audios Deleted", life: 3000 });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      };
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
