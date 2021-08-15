<template>
  <v-row class="pa-8">
    <v-col cols="12" class="d-flex justify-start align-center">
      <v-icon size="36" color="black" left>mdi-account-group</v-icon>
      <h1>Usuarios</h1>
    </v-col>
    <v-col cols="12" md="6" lg="4">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        placeholder="buscar..."
        hide-details
        outlined
        dense
        clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6" lg="8" class="d-flex justify-end align-center">
      <v-btn @click="addUser" color="primary" dark>
        <v-icon>mdi-plus</v-icon>
        Agregar Usuario
      </v-btn>
    </v-col>
    <v-col cols="12">
      <!-- //? Tabla de usuarios -->
      <ListUsers
        :updateUser="dialogUser"
        :updateDelete="dialogDelete"
        @edit="editUser"
        @delete="openDialogDeleteUser"
      />
      <!-- //? Modal crear/editar usuario -->
      <DialogUser
        :dialog="dialogUser"
        :option="option"
        :item="item"
        @close="closeDialog"
      />
      <!-- //? Modal eliminar usuario -->
      <v-dialog v-model="dialogDelete" persistent width="600">
        <v-card>
          <v-card-title class="text-h5 red white--text">
            Eliminar Usuario
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDelete">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-4">
            <p class="body-1">
              ¿Está segudo que desea eliminar
              {{
                selectedItems.length > 1
                  ? 'los usuarios seleccionados'
                  : 'este usuario'
              }}
              ?
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-2" color="primary" text @click="closeDelete">
              cancelar
            </v-btn>
            <v-btn @click="delteUser" color="red" dark class="elevation-0">
              Eliminar usuario
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import ListUsers from './ListUsers.vue';
import DialogUser from './DialogUser.vue';

export default {
  name: 'User',
  components: { ListUsers, DialogUser },
  data() {
    return {
      option: false,
      dialogUser: false,
      item: null,
      alert: false,
      colorAlert: '',
      message: '',
      dialogDelete: false,
      selectedItems: []
    };
  },
  methods: {
    closeDialog() {
      this.item = null;
      this.option = false;
      this.dialogUser = false;
    },
    addUser() {
      this.item = null;
      this.option = false;
      this.dialogUser = true;
    },
    editUser(user) {
      this.item = user;
      this.option = true;
      this.dialogUser = true;
    },
    openDialogDeleteUser(users) {
      this.dialogDelete = true;
      this.selectedItems = [...users];
    },
    closeDelete() {
      this.dialogDelete = false;
      this.selectedItems = [];
    },
    delteUser() {
      const users = this.selectedItems.map(u => u.id);
      axios
        .delete('/user', { data: { users } })
        .then(() => {
          this.closeDelete();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
