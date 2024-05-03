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
                        <FileUpload disabled mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="programs"
                    v-model:selection="selectedPrograms"
                    dataKey="ID"
                    :paginator="true"
                    :rows="5"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} programs"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Programs</h5>
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
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProgram(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProgram(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="programDialog" :style="{ width: '600px' }" header="Program Details" :modal="true" class="p-fluid">
                    <img :src="program.picture" :alt="program.picture" v-if="program.picture" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="ID">ID</label>
                        <InputText id="ID" v-model.trim="program.ID" :disabled="program.prvider != 'internal'" required="true" autofocus :class="{ 'p-invalid': submitted && !program.ID }" />
                        <small class="p-invalid" v-if="submitted && !program.ID">ID is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Title</label>
                        <InputText id="title" v-model.trim="program.title" :disabled="program.prvider != 'internal'" required="true" autofocus :class="{ 'p-invalid': submitted && !program.title }" />
                        <small class="p-invalid" v-if="submitted && !program.title">Title is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="program.description" :disabled="program.prvider != 'internal'" required="true" rows="5" cols="20" />
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="provider">Country</label>
                            <InputText id="provider" v-model="program.country" :disabled="program.prvider != 'internal'" />
                        </div>
                        <div class="field col">
                            <label for="provider">Language</label>
                            <InputText id="provider" v-model="program.language" :disabled="program.prvider != 'internal'" />
                        </div>
                    </div>

                    <div class="field">
                        <label for="status" class="mb-3">Status</label>
                        <Dropdown id="status" v-model="program.status" :options="statuses" optionLabel="label" placeholder="Select a Status">
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
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProgram" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="programIngestDialog" :style="{ width: '600px' }" header="Program Ingest" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="permalink">Permalink</label>
                        <InputText id="permalink" v-model.trim="permalink" required="true" autofocus :class="{ 'p-invalid': submitted && !permalink }" />
                        <small class="p-invalid" v-if="submitted && !permalink">Permalink is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="ingestProgram" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProgramDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="program"
                            >Are you sure you want to delete <b>{{ program.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProgramDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProgram" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProgramsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="program">Are you sure you want to delete the selected programs?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProgramsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPrograms" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import ProgramService from '@/service/ProgramService';
import router from '@/router';

export default {
    data() {
        return {
            permalink: null,
            programs: null,
            programDialog: false,
            programIngestDialog: false,
            deleteProgramDialog: false,
            deleteProgramsDialog: false,
            program: {},
            selectedPrograms: null,
            filters: {},
            submitted: false,
            statuses: [
                { label: 'UNPROCESSED', value: 'unprocessed' },
                { label: 'RUN', value: 'run' },
                { label: 'SCHEDULED', value: 'scheduled' },
            ],
        };
    },
    programService: null,
    created() {
        this.programService = new ProgramService();
        this.initFilters();
    },
    mounted() {
        this.programService.getPrograms().then((data) => (this.programs = data));
    },
    methods: {
        openNew() {
            this.program = {};
            this.submitted = false;
            this.programDialog = true;
        },
        openIngest() {
            this.program = {};
            this.submitted = false;
            this.programIngestDialog = true;
        },
        hideDialog() {
            this.programDialog = false;
            this.programIngestDialog = false;
            this.submitted = false;
        },
        saveProgram() {
            this.submitted = true;
            if (this.program.title.trim()) {
                if (this.program.ID) {
                    this.programService.getProgram(this.program.ID).then((data) => (this.program = data));
                    this.program.status = this.program.status.value ? this.program.status.value : this.program.status;
                    this.programService.updateProgram(this.program.ID, this.program).then(() => {
                        this.programService.getPrograms().then((data) => (this.programs = data));
                        this.program = {};
                        this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Program Updated', life: 3000 });
                    });
                } else {
                    this.program.status = this.program.status ? this.program.status.value : 'UNPROCESSED';
                    this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Program Created', life: 3000 });
                }
                this.programDialog = false;
                this.program = {};
            }
        },
        ingestProgram() {
            this.submitted = true;
            this.programService.ingestProgram(this.permalink).then(() => {
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Program Ingestion started', life: 3000 });
              this.permalink = null;
              this.programIngestDialog = false;
              this.submitted = false;
            });
        },
        editProgram(program) {
            this.program = { ...program };
            this.programDialog = true;
        },
        confirmDeleteProgram(program) {
            this.program = program;
            this.deleteProgramDialog = true;
        },
        deleteProgram() {
            this.programService.deleteProgram(this.program.ID).then(() => {
                this.programService.getPrograms().then((data) => (this.programs = data));
                this.deleteProgramDialog = false;
                this.program = {};
                this.submitted = false;
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Program Deleted', life: 3000 });
            });
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        confirmDeleteSelected() {
            this.deleteProgramsDialog = true;
        },
        deleteSelectedPrograms() {
            this.programs = this.programs.filter((val) => !this.selectedPrograms.includes(val));
            this.deleteProgramsDialog = false;
            this.selectedPrograms = null;
            this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Programs Deleted', life: 3000 });
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
