<template>
    <div class="grid crud-demo">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload disabled mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="medias"
                    v-model:selection="selectedMedias"
                    dataKey="ID"
                    :paginator="true"
                    :rows="5"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} medias"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Medias</h5>
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
                    <Column field="ID" header="ID" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.ID }}
                        </template>
                    </Column>
                    <Column field="title" header="Title" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.title }}
                        </template>
                    </Column>
                    <Column field="provider" header="Provider" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Provider</span>
                            <span :class="'provider-badge provider-' + (slotProps.data.provider ? slotProps.data.provider.toLowerCase() : '')">{{ slotProps.data.provider }}</span>
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span :class="'status-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <Column field="language" header="Language" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Language</span>
                            {{ slotProps.data.language }}
                        </template>
                    </Column>
                    <Column field="country" header="Country" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">country</span>
                            {{ slotProps.data.country }}
                        </template>
                    </Column>
                    <Column headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editMedia(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteMedia(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="mediaDialog" :style="{ width: '600px' }" header="Media Details" :modal="true" class="p-fluid">
                    <img :src="media.picture" :alt="media.picture" v-if="media.picture" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="ID">ID</label>
                        <InputText id="ID" v-model.trim="media.ID" :disabled="media.prvider != 'internal'" required="true" autofocus :class="{ 'p-invalid': submitted && !media.ID }" />
                        <small class="p-invalid" v-if="submitted && !media.ID">ID is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Title</label>
                        <InputText id="title" v-model.trim="media.title" :disabled="media.prvider != 'internal'" required="true" autofocus :class="{ 'p-invalid': submitted && !media.title }" />
                        <small class="p-invalid" v-if="submitted && !media.title">Title is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="media.description" :disabled="media.prvider != 'internal'" required="true" rows="5" cols="20" />
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="provider">Country</label>
                            <InputText id="provider" v-model="media.country" :disabled="media.prvider != 'internal'" />
                        </div>
                        <div class="field col">
                            <label for="provider">Language</label>
                            <InputText id="provider" v-model="media.language" :disabled="media.prvider != 'internal'" />
                        </div>
                    </div>

                    <div class="field">
                        <label for="status" class="mb-3">Status</label>
                        <Dropdown id="status" v-model="media.status" :options="statuses" optionLabel="label" placeholder="Select a Status">
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
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveMedia" />
                    </template>
                </Dialog>


                <Dialog v-model:visible="deleteMediaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="media"
                            >Are you sure you want to delete <b>{{ media.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMediaDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteMedia" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteMediasDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="media">Are you sure you want to delete the selected medias?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMediasDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedMedias" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import MediaService from '@/service/MediaService';


export default {
    data() {
        return {
            medias: null,
            mediaDialog: false,
            deleteMediaDialog: false,
            deleteMediasDialog: false,
            media: {},
            selectedMedias: null,
            filters: {},
            submitted: false,
            statuses: [
                { label: 'UNPROCESSED', value: 'unprocessed' },
                { label: 'RUN', value: 'run' },
                { label: 'SCHEDULED', value: 'scheduled' },
            ],
        };
    },
    mediaService: null,
    created() {
        this.mediaService = new MediaService();
        this.initFilters();
    },
    mounted() {
        this.mediaService.getMedias().then((data) => (this.medias = data));
    },
    methods: {
        openNew() {
            this.media = {};
            this.submitted = false;
            this.mediaDialog = true;
        },
        hideDialog() {
            this.mediaDialog = false;
            this.submitted = false;
        },
        saveMedia() {
            this.submitted = true;
            if (this.media.title.trim()) {
                if (this.media.ID) {
                    this.mediaService.getMedia(this.media.ID).then((data) => (this.media = data));
                    this.media.status = this.media.status.value ? this.media.status.value : this.media.status;
                    this.mediaService.updateMedia(this.media.ID, this.media).then(() => {
                        this.mediaService.getMedias().then((data) => (this.medias = data));
                        this.media = {};
                        this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Media Updated', life: 3000 });
                    });
                } else {
                    this.media.status = this.media.status ? this.media.status.value : 'UNPROCESSED';
                    this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Media Created', life: 3000 });
                }
                this.mediaDialog = false;
                this.media = {};
            }
        },
        editMedia(media) {
            this.media = { ...media };
            this.mediaDialog = true;
        },
        confirmDeleteMedia(media) {
            this.media = media;
            this.deleteMediaDialog = true;
        },
        deleteMedia() {
            this.mediaService.deleteMedia(this.media.ID).then(() => {
                this.mediaService.getMedias().then((data) => (this.medias = data));
                this.deleteMediaDialog = false;
                this.media = {};
                this.submitted = false;
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Media Deleted', life: 3000 });
            });
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        confirmDeleteSelected() {
            this.deleteMediasDialog = true;
        },
        deleteSelectedMedias() {
            this.medias = this.medias.filter((val) => !this.selectedMedias.includes(val));
            this.deleteMediasDialog = false;
            this.selectedMedias = null;
            this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Medias Deleted', life: 3000 });
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            };
        },
    },
};
</script>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
