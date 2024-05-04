<template>
    <div class="grid crud-demo">
        <div class="col-12 grid">
            <div class="col-12 md:col-6 lg:col-3">
                <div class="surface-card shadow-2 p-3 border-round">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Programs</span>
                            <div class="text-900 font-medium text-xl">{{ totalPrograms }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
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
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-play text-orange-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-6 lg:col-3">
                <div class="surface-card shadow-2 p-3 border-round">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Internal</span>
                            <div class="text-900 font-medium text-xl">{{ totalInternal }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-home text-cyan-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-6 lg:col-3">
                <div class="surface-card shadow-2 p-3 border-round">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">External</span>
                            <div class="text-900 font-medium text-xl">{{ totalExternal }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-globe text-purple-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <ProgramCrud />
        </div>
    </div>
</template>

<script>
import ProgramService from '@/service/ProgramService';
import ProgramCrud from '@/views/views/ProgramCrud.vue';
export default {
    components: { ProgramCrud },
    data() {
        return {
            programs: [],
        };
    },
    programService: null,
    created() {
        this.programService = new ProgramService();
    },
    mounted() {
        this.programService.getPrograms().then((data) => (this.programs = data));
    },
    computed: {
        totalPrograms() {
            return this.programs.length;
        },
        totalRunning() {
            return this.programs.filter((program) => program.status === 'run').length;
        },
        totalInternal() {
            return this.programs.filter((program) => program.provider === 'internal').length;
        },
        totalExternal() {
            return this.programs.filter((program) => program.provider === 'radioline').length;
        },
    },
    methods: {},
};
</script>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
