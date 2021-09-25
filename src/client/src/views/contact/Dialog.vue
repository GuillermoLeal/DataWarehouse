<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay scrollable>
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
                        v.length >= 3 ||
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
                        v.length >= 3 ||
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
                        v.length >= 3 ||
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
                      v => /.+@.+\..+/.test(v) || 'El email no es válido'
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
                    :items="companies"
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
                :items="regions"
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
                :rules="[v => !!v || 'Campo requerido *']"
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
                item-key="id"
                :headers="headers"
                :items="form.channels"
                class="elevation-0 transparent"
                disable-pagination
                hide-default-footer
                disable-sort
              >
                <template v-slot:header.actions>
                  <v-btn color="primary" dark>
                    <v-icon left>mdi-plus</v-icon>
                    agregar canal
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
                        v-if="isSelected"
                        :rules="[v => !!v || 'requerido *']"
                        @change="asignarColor(item)"
                        placeholder="Seleccionar canal"
                        v-model="item.chanelId"
                        :items="channels"
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
                    <td>
                      <v-text-field
                        v-if="isSelected"
                        :rules="[v => !!v || 'requerido *']"
                        v-model="item.account"
                        placeholder="@ejemplo"
                        hide-details
                        outlined
                        dense
                        background-color="white"
                      ></v-text-field>
                      <div v-else>{{ item.account }}</div>
                    </td>
                    <td>
                      <v-autocomplete
                        v-if="isSelected"
                        :rules="[v => !!v || 'requerido *']"
                        @change="asignarColor(item)"
                        placeholder="Seleccionar canal"
                        v-model="item.preference"
                        :items="channels"
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
                      <v-btn color="red" dark outlined>
                        <v-icon left>mdi-delete</v-icon>
                        eliminar canal
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
        <v-btn text color="red" @click="postCompany">
          cancelar
        </v-btn>
        <v-btn color="primary" @click="postCompany">
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
    company: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      validateForm: true,
      companies: [],
      regions: [],
      countries: [],
      cities: [],
      channels: [],
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
          //   chanelId: 0,
          //   name: 'facebook',
          //   account: 'guillermo.leal',
          //   preference: 1
          // },
          // {
          //   id: 1,
          //   chanelId: 0,
          //   name: 'facebook',
          //   account: 'guillermo.leal',
          //   preference: 0
          // },
          // {
          //   id: 2,
          //   chanelId: 0,
          //   name: 'facebook',
          //   account: 'guillermo.leal',
          //   preference: 2
          // }
        ]
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
          this.regions = responses[0].data.data;
          this.countries = responses[1].data.data;
          this.cities = responses[2].data.data;
          this.companies = responses[3].data.data;
          this.channels = responses[4].data.data;
        })
      );
  },
  watch: {
    dialog: {
      handler() {
        if (!this.create) {
          this.form.id = this.company.id;
          this.form.name = this.company.name;
          this.form.address = this.company.address;
          this.form.email = this.company.email;
          this.form.telephone = this.company.telephone;
          this.form.city = this.company.city;
        }
      },
      deep: true
    }
  },
  computed: {
    countriesFilter() {
      return this.countries.filter(
        c => c.regionId === (this.form.region || null)
      );
    },
    citiesFilter() {
      return this.cities.filter(
        c => c.countryId === (this.form.country || null)
      );
    },
    validateChannel() {
      let validate = true;
      if (this.channelSelect.length) {
        const { chanelId, account } = this.channelSelect[0];
        if (!chanelId || !account || account.trim()) validate = false;
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
    clearRegion() {
      this.form.country = null;
      this.form.city = null;
    },
    clearCountry() {
      this.form.city = null;
    },
    postCompany() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        const data = { ...this.form };
        // Si se está creando la compañía
        if (this.create) {
          axios.post('/company', data).then(() => {
            this.$emit('create');
          });
        }
        // Si se está editando la compañía
        else {
          axios.put('/company', data).then(response => {
            this.$emit('edit', response.data.data);
          });
        }
        this.closeModal();
      }
    }
  }
};
</script>
