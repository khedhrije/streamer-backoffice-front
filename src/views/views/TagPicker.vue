<template>
    <div>
        <PickList v-model="tags" listStyle="height:342px" dataKey="id" breakpoint="1400px">
            <template #sourceheader> Tags</template>
            <template #targetheader> Selected</template>
            <template #item="slotProps">
                <img class="w-4rem flex-shrink-0 border-round" src="/layout/images/green.jpeg" :alt="slotProps.item.name" />
                <div class="flex flex-wrap p-2 align-items-center gap-3">
                    <div class="flex-1 flex flex-column gap-2">
                        <span class="font-bold">{{ slotProps.item.title }}</span>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-tag text-sm"></i>
                            <span>{{ slotProps.item.description }}</span>
                        </div>
                    </div>
                    <span class="font-bold">{{ slotProps.item.ID }}</span>
                </div>
            </template>
        </PickList>
    </div>
</template>

<script>
import TagService from '@/service/TagService';

export default {
    props: {
        program: {},
    },
    data() {
        return {
            tags: [[], []],
            selectedTags: [],
        };
    },
    tagService: null,
    created() {
        this.tagService = new TagService();
    },
    mounted() {
        this.tagService.getTags().then((data) => {
            this.tags[0] = data; // Set the first dimension of tags
        });
        this.tagService.getTagsByProgramUUID(this.program.ID).then((data) => {
            this.selectedTags = data;
            this.tags[1] = this.selectedTags ? this.selectedTags : []; // Set the second dimension of tags
        });
    },
    methods: {},
};
</script>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
