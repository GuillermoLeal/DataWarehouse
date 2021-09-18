<template>
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
    <template v-slot:top>
      <div class="d-flex justify-end">
        <v-btn
          @click="remove(false)"
          v-show="selectedItems.length"
          color="primary"
          text
          class="pa-6"
        >
          <v-icon left>mdi-delete</v-icon>
          Eliminar usuarios
        </v-btn>
      </div>
    </template>
    <template v-slot:item.role="{ item }">
      <td>
        {{ item.role ? 'Admin' : 'Básico' }}
      </td>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon v-if="selectedItems.length">mdi-dots-horizontal</v-icon>
      <div v-else class="d-flex justify-center align-center">
        <v-icon @click="edit(item)" left small>mdi-pencil</v-icon>
        <v-icon @click="remove(item)" left small>mdi-delete</v-icon>
      </div>
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
  props: {
    search: String,
    updateUser: Boolean,
    updateDelete: Boolean
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido', value: 'lastname' },
        { text: 'Email', value: 'email' },
        { text: 'Perfil', value: 'role' },
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
    },
    updateUser: {
      handler() {
        if (!this.updateUser) this.getData();
      },
      deep: true
    },
    updateDelete: {
      handler() {
        if (!this.updateDelete) this.getData();
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
          `/user?search=${this.search}&limit=${itemsPerPage}&offset=${page -
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
    edit(item) {
      this.$emit('edit', { ...item });
    },
    remove(item) {
      let items = null;
      if (item) {
        items = [{ ...item }];
      } else {
        items = this.selectedItems;
      }
      this.$emit('delete', items);
    }
  }
};
</script>
