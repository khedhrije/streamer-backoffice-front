<template>
    <div>
        <PickList v-model="blocks" listStyle="height:342px" dataKey="id" breakpoint="1400px">
            <template #sourceheader> Blocks </template>
            <template #targetheader> Selected </template>
            <template #item="slotProps">
                <div class="flex flex-wrap p-2 align-items-center gap-3">
                    <img class="w-4rem flex-shrink-0 border-round" :src="slotProps.item.picture" :alt="slotProps.item.name" />
                    <div class="flex-1 flex flex-column gap-2">
                        <span class="font-bold">{{ slotProps.item.title }}</span>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-tag text-sm"></i>
                            <span>{{ slotProps.item.provider }}</span>
                        </div>
                    </div>
                    <span class="font-bold">{{ slotProps.item.status }}</span>
                </div>
            </template>
        </PickList>
    </div>
</template>

<script>
import BlockService from '@/service/BlockService';

export default {
    props: {
        program: {},
    },
    data() {
        return {
            blocks: [[], []],
            selectedBlocks: [],
        };
    },
    blockService: null,
    created() {
        this.blockService = new BlockService();
    },
    mounted() {
        this.blockService.getBlocks().then((data) => {
            this.blocks[0] = data; // Set the first dimension of blocks
        });
        this.blockService.getBlocksByProgramUUID(this.program.ID).then((data) => {
            this.selectedBlocks = data;
          this.blocks[1] = this.selectedBlocks ? this.selectedBlocks : [];// Set the second dimension of tags
        });
    },
    methods: {},
};
</script>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
