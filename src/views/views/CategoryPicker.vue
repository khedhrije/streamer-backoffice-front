<template>
    <div>
        <PickList v-model="categories" listStyle="height:342px" dataKey="id" breakpoint="1400px">
            <template #sourceheader> Categories </template>
            <template #targetheader> Selected </template>
            <template #item="slotProps">
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
import CategoryService from '@/service/CategoryService';

export default {
    props: {
        program: {},
    },
    data() {
        return {
            categories: [[], []],
            selectedCategories: [],
        };
    },
    categoryService: null,
    created() {
        this.categoryService = new CategoryService();
    },
    mounted() {
        this.categoryService.getCategories().then((data) => {
            this.categories[0] = data; // Set the first dimension of categories
        });
        this.categoryService.getCategoriesByProgramUUID(this.program.ID).then((data) => {
            this.selectedCategories = data;
          this.categories[1] = this.selectedCategories ? this.selectedCategories : [];// Set the second dimension of tags
        });
    },
    methods: {},
};
</script>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
