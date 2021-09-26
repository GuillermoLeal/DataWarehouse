<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" sm="6" lg="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          background-color="white"
          placeholder="buscar..."
          hide-details
          outlined
          dense
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" lg="8" class="d-flex justify-end align-center">
        <DialogDelete
          v-if="selectedItems.length"
          option="btn-large"
          title="Eliminar Contactos"
          :text="`¿Está seguro que desea eliminar los contactos seleccionados?`"
          @accept="deleteContacts(true)"
        />
        <div class="ml-4">
          <DialogContact
            :dataSelects="dataSelects"
            @create="getData"
            :create="true"
          />
        </div>
      </v-col>
    </v-row>
    <!-- //? LISTA DE COMAÑIAS -->
    <v-data-table
      v-model="selectedItems"
      item-key="id"
      show-select
      :loading="loading"
      :headers="headers"
      :items="items"
      class="elevation-3"
      multi-sort
      :options.sync="options"
      :server-items-length="totalItems"
      :footer-props="{
        itemsPerPageText: 'Filas por página',
        'items-per-page-options': [5, 10, 25]
      }"
    >
      <template v-slot:item.fullName="{ item }">
        <div class="py-2 d-flex aling-center">
          <v-icon left size="34">mdi-account-circle</v-icon>
          <div class="d-flex justify-center flex-column">
            <span>{{ item.fullName }}</span>
            <span class="grey--text text-small">{{ item.email }}</span>
          </div>
        </div>
      </template>
      <template v-slot:item.country="{ item }">
        <td class="py-2 d-flex justify-center flex-column">
          <span>{{ item.country }}</span>
          <span class="grey--text text-small">{{ item.region }}</span>
        </td>
      </template>
      <template v-slot:item.interest="{ item }">
        <div class="d-flex justify-center align-center flex-column">
          {{ item.interest }}%
          <v-progress-linear
            :value="item.interest"
            class="ml-2"
            :color="colorsLine[item.interest]"
            background-color="grey lighten-2"
            rounded
          >
          </v-progress-linear>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <DialogContact
          :dataSelects="dataSelects"
          @edit="getData"
          :create="false"
          :contact="item"
        />
        <DialogDelete
          title="Eliminar Ciudad"
          :text="
            `¿Está seguro que desea eliminar el contacto ${item.fullName}?`
          "
          :item="item"
          @accept="deleteContacts(false, item)"
        />
      </template>
      <template v-slot:no-data>
        No se han encontrado registros.
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';
import DialogContact from './Dialog.vue';
import DialogDelete from '../../components/DialogDelete';

export default {
  name: 'ListContacts',
  components: {
    DialogContact,
    DialogDelete
  },
  data() {
    return {
      loading: false,
      search: '',
      headers: [
        { text: 'Contacto', value: 'fullName' },
        { text: 'País/Región', value: 'country' },
        { text: 'Compañía', value: 'company' },
        { text: 'Cargo', value: 'position' },
        { text: 'Interés', value: 'interest' },
        { text: 'Acciones', align: 'center', value: 'actions', sortable: false }
      ],
      items: [],
      options: {},
      totalItems: 0,
      selectedItems: [],
      dataSelects: {
        companies: [],
        regions: [],
        countries: [],
        cities: [],
        channels: []
      },
      colorsLine: {
        0: 'grey lighten-2',
        25: 'blue darken-1',
        50: 'yellow darken-1',
        75: 'orange darken-1',
        100: 'red darken-1'
      }
    };
  },
  created() {
    const reqRegions = axios.get('/region');
    const reqCountries = axios.get('/country');
    const reqCities = axios.get('/city');
    const reqCompanies = axios.get('/company');
    const reqChannels = axios.get('/channel');

    axios
      .all([reqRegions, reqCountries, reqCities, reqCompanies, reqChannels])
      .then(
        axios.spread((...responses) => {
          this.dataSelects.regions = responses[0].data.data;
          this.dataSelects.countries = responses[1].data.data;
          this.dataSelects.cities = responses[2].data.data;
          this.dataSelects.companies = responses[3].data.data;
          this.dataSelects.channels = responses[4].data.data;
        })
      );
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true
    },
    search: {
      handler() {
        this.getData();
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.selectedItems = [];
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;

      axios
        .get(
          `/contact?search=${this.search}&limit=${itemsPerPage}&offset=${page -
            1}&sortBy=${sortBy.join()}&sortDesc=${sortDesc.join()}`
        )
        .then(response => {
          const { data, totalData } = response.data;
          this.items = data;
          this.totalItems = totalData;
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteContacts(multiple, item) {
      const items = multiple ? this.selectedItems.map(i => i.id) : [item.id];

      axios.delete('/contact', { data: { items } }).then(() => {
        this.getData();
      });
    }
  }
};
</script>

<style scoped>
.text-small {
  font-size: 0.8rem;
}
</style>
