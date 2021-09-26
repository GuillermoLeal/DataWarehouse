<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay scrollable persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="create" color="primary" dark v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon> agregar contacto
      </v-btn>
      <v-btn v-else icon v-bind="attrs" v-on="on">
        <v-icon color="primary">mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="primary white--text">
        <v-icon left dark>
          {{ create ? 'mdi-plus' : 'mdi-pencil' }}
        </v-icon>
        {{ create ? 'AGREGAR CONTACTO' : 'EDITAR CONTACTO' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4 blue-grey lighten-5">
        <v-form v-model="validateForm" ref="form" lazy-validation>
          <!-- //? DATOS PRINCIPALES -->
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <h3 class="title">Datos principales</h3>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field
                    :rules="[
                      v => !!v || 'Campo requerido *',
                      v =>
                        v.length <= 50 ||
                        'El nombre debe tener menos de 50 caracteres',
                      v =>
                        v.length >= 1 ||
                        'El nombre debe tener más de 3 caracteres'
                    ]"
                    v-model="form.name"
                    label="Nombre *"
                    outlined
                    dense
                    background-color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field
                    :rules="[
                      v => !!v || 'Campo requerido *',
                      v =>
                        v.length <= 50 ||
                        'El apellido debe tener menos de 50 caracteres',
                      v =>
                        v.length >= 1 ||
                        'El apellido debe tener más de 3 caracteres'
                    ]"
                    v-model="form.lastname"
                    label="Apellido *"
                    outlined
                    dense
                    background-color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="2">
                  <v-text-field
                    :rules="[
                      v => !!v || 'Campo requerido *',
                      v =>
                        v.length <= 50 ||
                        'La cargo debe tener menos de 50 caracteres',
                      v =>
                        v.length >= 1 ||
                        'La cargo debe tener más de 3 caracteres'
                    ]"
                    v-model="form.position"
                    label="Cargo *"
                    outlined
                    dense
                    background-color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="2">
                  <v-text-field
                    :rules="[
                      v => !!v || 'Campo requerido *',
                      v => /.+@.+\..+/.test(v) || 'El email no es válido',
                      v =>
                        v.length <= 50 ||
                        'El email debe tener menos de 50 caracteres',
                      v =>
                        v.length >= 1 ||
                        'El email debe tener más de 1 caracteres'
                    ]"
                    v-model="form.email"
                    label="Email *"
                    outlined
                    dense
                    background-color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="2">
                  <v-autocomplete
                    :rules="[v => !!v || 'Campo requerido *']"
                    v-model="form.company"
                    :items="dataSelects.companies"
                    item-text="name"
                    item-value="id"
                    label="Compañía *"
                    outlined
                    dense
                    background-color="white"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- //? DATOS SECUNDARIOS -->
          <v-row class="mt-6">
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-autocomplete
                :rules="[v => !!v || 'Campo requerido *']"
                @change="clearRegion"
                v-model="form.region"
                :items="dataSelects.regions"
                item-text="name"
                item-value="id"
                label="Región *"
                outlined
                dense
                background-color="white"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-autocomplete
                :rules="[v => !!v || 'Campo requerido *']"
                @change="clearCountry"
                :disabled="!form.region"
                v-model="form.country"
                :items="countriesFilter"
                item-text="name"
                item-value="id"
                label="País *"
                outlined
                dense
                background-color="white"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-autocomplete
                :rules="[v => !!v || 'Campo requerido *']"
                :disabled="!form.country"
                v-model="form.city"
                :items="citiesFilter"
                item-text="name"
                item-value="id"
                label="Ciudad *"
                outlined
                dense
                background-color="white"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="8" lg="3">
              <v-text-field
                :rules="[
                  v => !!v || 'Campo requerido *',
                  v =>
                    v.length <= 50 ||
                    'La dirección debe tener menos de 50 caracteres',
                  v =>
                    v.length >= 1 ||
                    'La dirección debe tener más de 1 caracteres'
                ]"
                v-model="form.address"
                label="Dirección *"
                outlined
                dense
                background-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-slider
                v-model="form.interest"
                label="Interés"
                :tick-labels="[0, 25, 50, 75, 100]"
                step="25"
                ticks="always"
                tick-size="4"
              ></v-slider>
            </v-col>
            <!-- //? Lista de canales -->
            <v-col cols="12">
              <v-data-table
                v-model="channelSelect"
                single-select
                show-select
                item-key="index"
                :headers="headers"
                :items="form.channels"
                class="elevation-0 transparent table-channels"
                disable-pagination
                hide-default-footer
                disable-sort
              >
                <template v-slot:header.actions>
                  <v-btn
                    :disabled="!validateChannel || form.channels.length == 5"
                    @click="addChannel"
                    color="primary"
                    dark
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <template v-slot:item="{ item, isSelected, select }">
                  <tr>
                    <td>
                      <v-simple-checkbox
                        :ripple="false"
                        :disabled="!validateChannel"
                        :value="isSelected"
                        @input="select($event)"
                      ></v-simple-checkbox>
                    </td>
                    <td>
                      <v-autocomplete
                        @change="addNameChannel(item)"
                        v-if="isSelected"
                        :rules="[v => !!v || 'requerido *']"
                        placeholder="Seleccionar canal"
                        v-model="item.channelId"
                        :items="filterChannels(item)"
                        item-text="name"
                        item-value="id"
                        hide-details
                        background-color="white"
                        required
                        outlined
                        dense
                      ></v-autocomplete>
                      <div v-else>{{ item.name }}</div>
                    </td>
                    <td class="td-account">
                      <v-text-field
                        v-if="isSelected"
                        :rules="[
                          v => !!v || 'requerido *',
                          v =>
                            v.length <= 50 ||
                            'La cuenta debe tener menos de 50 caracteres',
                          v =>
                            v.length >= 1 ||
                            'La cuenta debe tener más de 1 caracteres'
                        ]"
                        v-model="item.account"
                        placeholder="@ejemplo"
                        hide-details
                        outlined
                        dense
                        background-color="white"
                      ></v-text-field>
                      <div v-else class="div-account">{{ item.account }}</div>
                    </td>
                    <td>
                      <v-autocomplete
                        v-if="isSelected"
                        :rules="[v => !!v || v == 0 || 'requerido *']"
                        placeholder="Seleccionar canal"
                        v-model="item.preference"
                        :items="preferences"
                        item-text="name"
                        item-value="id"
                        hide-details
                        background-color="white"
                        required
                        outlined
                        dense
                      ></v-autocomplete>
                      <div v-else>
                        <v-icon
                          :color="getPreference(item.preference).color"
                          left
                          >{{ getPreference(item.preference).icon }}</v-icon
                        >
                        {{ getPreference(item.preference).name }}
                      </div>
                    </td>
                    <td>
                      <v-btn
                        @click="removerChannel(item.channelId)"
                        color="red"
                        dark
                        outlined
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </template>
                <template v-slot:no-data>
                  No se han encontrado registros...
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn text color="red" @click="closeModal">
          cancelar
        </v-btn>
        <v-btn color="primary" @click="postContact">
          guardar contacto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DialogCreateContact',
  props: {
    textBtn: {
      type: String,
      default: 'textBtn'
    },
    create: {
      type: Boolean,
      default: true
    },
    contact: {
      type: Object,
      default: () => ({})
    },
    dataSelects: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      validateForm: true,
      preferences: [
        {
          id: 0,
          name: 'Sin preferencia',
          icon: 'mdi-minus',
          color: 'grey lighten-1'
        },
        { id: 1, name: 'Canal favorito', icon: 'mdi-heart', color: 'red' },
        { id: 2, name: 'No molestar', icon: 'mdi-cancel', color: 'red' }
      ],
      channelSelect: [],
      headers: [
        { text: 'Canal de contacto', value: 'name' },
        { text: 'Cuenta de usuario', value: 'account' },
        { text: 'Preferencia', value: 'preference' },
        { text: '', value: 'actions', width: '50' }
      ],
      form: {
        id: null,
        name: '',
        lastname: '',
        position: '',
        email: '',
        company: null,
        region: null,
        country: null,
        city: null,
        address: '',
        interest: 0,
        channels: [
          // {
          //   id: 0,
          //   channelId: 0,
          //   name: 'facebook',
          //   account: 'guillermo.leal',
          //   preference: 1
          // },
          // {
          //   id: 1,
          //   channelId: 0,
          //   name: 'facebook',
          //   account: 'guillermo.leal',
          //   preference: 0
          // },
          // {
          //   id: 2,
          //   channelId: 0,
          //   name: 'facebook',
          //   account: 'guillermo.leal',
          //   preference: 2
          // }
        ]
      },
      countIndex: 0
    };
  },
  watch: {
    dialog: {
      handler() {
        if (!this.create) {
          axios
            .get(`/contact/contactById?id=${this.contact.id}`)
            .then(response => {
              const {
                id,
                name,
                lastName,
                position,
                email,
                companyId,
                cityId,
                address,
                interest,
                channels
              } = response.data.contact;

              this.form = {
                id,
                name,
                lastname: lastName,
                position,
                email,
                company: companyId,
                region: this.contact.regionId,
                country: this.contact.countryId,
                city: cityId,
                address,
                interest,
                channels
              };
            });
        }
      },
      deep: true
    }
  },
  computed: {
    countriesFilter() {
      return this.dataSelects.countries.filter(
        c => c.regionId === (this.form.region || null)
      );
    },
    citiesFilter() {
      return this.dataSelects.cities.filter(
        c => c.countryId === (this.form.country || null)
      );
    },
    validateChannel() {
      let validate = true;
      if (this.channelSelect.length) {
        const { channelId, account, preference } = this.channelSelect[0];
        if (
          !channelId ||
          !account ||
          !account.trim() ||
          (!preference && preference !== 0)
        )
          validate = false;
      }

      return validate;
    }
  },
  methods: {
    closeModal() {
      this.form = {
        id: null,
        name: '',
        lastname: '',
        position: '',
        email: '',
        company: null,
        region: null,
        country: null,
        city: null,
        address: '',
        interest: 0,
        channels: []
      };
      this.$refs.form.resetValidation();
      this.dialog = false;
    },
    getPreference(id) {
      return this.preferences.find(p => p.id == id);
    },
    addNameChannel(item) {
      const channel = this.dataSelects.channels.find(
        c => c.id == item.channelId
      );
      item.name = channel.name;
    },
    clearRegion() {
      this.form.country = null;
      this.form.city = null;
    },
    clearCountry() {
      this.form.city = null;
    },
    filterChannels(item) {
      const channels = this.form.channels.map(c => c.channelId);
      return this.dataSelects.channels.filter(
        c => !channels.some(id => id == c.id) || item.channelId === c.id
      );
    },
    addChannel() {
      if (this.validateChannel) {
        this.dataSelects.channelSelect = [];
        const data = {
          index: this.countIndex,
          id: null,
          channelId: 0,
          name: '',
          account: '',
          preference: 0
        };
        this.channelSelect.unshift(data);
        this.form.channels.unshift(data);
        this.countIndex++;
      }
    },
    removerChannel(id) {
      const index = this.form.channels
        .map(item => {
          return item.channelId;
        })
        .indexOf(id);
      console.log(index);
      if (index !== -1) {
        this.form.channels.splice(index, 1);
      }
    },
    postContact() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const data = { ...this.form };
        // Si se está creando el contacto
        if (this.create) {
          axios.post('/contact', data).then(() => {
            this.$emit('create');
          });
        }
        // Si se está editando el contacto
        else {
          axios.put('/contact', data).then(response => {
            this.$emit('edit', response.data.data);
          });
        }
        this.closeModal();
      }
    }
  }
};
</script>

<style scoped>
.table-channels {
  max-width: 1000px;
}
.td-account {
  max-width: 300px;
}
.div-account {
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
