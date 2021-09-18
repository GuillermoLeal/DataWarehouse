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
        <DialogCompany @create="updateTable" :create="true" />
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
      <template v-slot:item.actions="{ item }">
        <DialogCompany @edit="updateTable" :create="false" :company="item" />
      </template>
      <template v-slot:no-data>
        No se han encontrado registros.
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';
import DialogCompany from './Dialog.vue';

export default {
  name: 'ListCompanies',
  components: {
    DialogCompany
  },
  data() {
    return {
      loading: false,
      search: '',
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'País', value: 'countryName' },
        { text: 'Dirección', value: 'address' },
        { text: 'Email', value: 'email' },
        { text: 'Teléfono', value: 'telephone' },
        { text: 'Acciones', align: 'center', value: 'actions', sortable: false }
      ],
      items: [],
      options: {},
      totalItems: 0,
      selectedItems: []
    };
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
          `/company?search=${this.search}&limit=${itemsPerPage}&offset=${page -
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
    updateTable() {
      this.getData();
    }
  }
};
</script>
