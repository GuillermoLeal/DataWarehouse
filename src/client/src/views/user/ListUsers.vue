<template>
  <v-data-table
    :loading="loading"
    :headers="headers"
    :items="items"
    class="elevation-3"
    multi-sort
    :options.sync="options"
    :server-items-length="totalItems"
    :footer-props="{
      itemsPerPageText: 'Filas por página'
    }"
  >
    <template v-slot:item.role="{ item }">
      {{ item.role ? 'Admin' : 'Básico' }}
    </template>
    <template v-slot:no-data>
      No se han encontrado registros.
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ListUsers',
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastname' },
        { text: 'Email', value: 'email' },
        { text: 'Perfil', value: 'role' }
      ],
      items: [],
      options: {},
      totalItems: 0
    };
  },
  created() {
    // this.getData();
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;
      console.log(this.options);

      axios
        .get(
          `/api/user?limit=${itemsPerPage}&offset=${page -
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
    }
  }
};
</script>
