<template>
    <div class="layout-dashboard">
        <div class="grid">
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="overview-box sales">
                    <i class="overview-icon pi pi-dollar"></i>
                    <span class="overview-title">Sales</span>
                    <i class="overview-arrow pi pi-chevron-circle-up"></i>
                    <div class="overview-numbers">$ 92,440</div>
                    <div class="overview-subinfo">21% more than yesterday</div>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="overview-box views">
                    <i class="overview-icon pi pi-search"></i>
                    <span class="overview-title">Views</span>
                    <i class="overview-arrow pi pi-chevron-circle-up"></i>
                    <div class="overview-numbers">7029</div>
                    <div class="overview-subinfo">2% more than yesterday</div>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="overview-box users">
                    <i class="overview-icon pi pi-users"></i>
                    <span class="overview-title">Users</span>
                    <i class="overview-arrow pi pi-chevron-circle-up"></i>
                    <div class="overview-numbers">9522</div>
                    <div class="overview-subinfo">7% more than yesterday</div>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="overview-box checkin">
                    <i class="overview-icon pi pi-map-marker"></i>
                    <span class="overview-title">Check-Ins</span>
                    <i class="overview-arrow pi pi-chevron-circle-up"></i>
                    <div class="overview-numbers">4211</div>
                    <div class="overview-subinfo">18% more than yesterday</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            chartData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [12, 19, 3, 5, 2, 3, 9],
                        borderColor: ['#7E57C2'],
                        borderWidth: 3,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 3,
                        tension: 0.4,
                    },
                    {
                        label: 'Income',
                        data: [1, 2, 5, 3, 12, 7, 15],
                        backgroundColor: ['rgba(187,222,251,0.2)'],
                        borderColor: ['#42A5F5'],
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'Expenses',
                        data: [7, 12, 15, 5, 3, 13, 21],
                        borderColor: ['#FFB300'],
                        borderWidth: 3,
                        fill: false,
                        pointRadius: [4, 6, 4, 12, 8, 0, 4],
                        tension: 0.4,
                    },
                    {
                        label: 'New Users',
                        data: [3, 7, 2, 17, 15, 13, 19],
                        borderColor: ['#66BB6A'],
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                hover: {
                    mode: 'index',
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Month',
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value',
                            },
                        },
                    ],
                },
            },
            menuItems: [
                {
                    label: 'Save',
                    icon: 'pi pi-check',
                },
                {
                    label: 'Update',
                    icon: 'pi pi-refresh',
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                },
            ],
            tasksCheckbox: [],
            products: null,
            selectedProduct: null,
        };
    },
    created() {
    },
    mounted() {
        this.productService.getProducts().then((data) => (this.products = data));
    },
    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        },
    },
};
</script>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(async () => {
    events.value = await getEvents();
    options.value = { ...options.value, ...{ events: events.value } };
    events.value.forEach((item) => tags.value.push(item.tag));
  this.productService.getProducts().then((data) => (this.products = data));

});

const tags = ref([]);
const options = ref({
    plugins: [],
    initialDate: '2023-01-01',
    height: 720,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
});

const events = ref(null);

const getEvents = async () => {

    return response;
};
</script>

<style scoped lang="scss">
.product-badge {
    border-radius: 2px;
    padding: 0.25em 0.5rem;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.3px;

    &.status-instock {
        background: #c8e6c9;
        color: #256029;
    }

    &.status-outofstock {
        background: #ffcdd2;
        color: #c63737;
    }

    &.status-lowstock {
        background: #feedaf;
        color: #8a5340;
    }
}

::v-deep(.fc .fc-col-header-cell-cushion),
::v-deep(.fc-daygrid-dot-event .fc-event-time),
::v-deep(.fc-daygrid-dot-event .fc-event-title),
::v-deep(.fc .fc-daygrid-day-number),
::v-deep(.fc .fc-daygrid-more-link) {
    color: var(--text-color);
}

@media screen and (max-width: 960px) {
    ::v-deep(.fc-header-toolbar) {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
