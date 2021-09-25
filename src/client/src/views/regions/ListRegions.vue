<template>
  <v-row class="pa-8">
    <v-col cols="12" class="d-flex justify-start align-center">
      <v-icon size="36" color="black" left>mdi-earth</v-icon>
      <h1>Regiones y Ciudades</h1>
    </v-col>
    <v-col cols="12" class="d-flex justify-end align-center">
      <DialogRegion
        @create="createRegion"
        :textBtn="'Agregar región'"
        :create="true"
      />
    </v-col>
    <v-col cols="12">
      <v-alert v-if="!regions.length" dense text type="info" class="ma-0">
        No se tienen Regiones Creadas. Intenta crear una!
      </v-alert>
      <!-- //? Lista regiones -->
      <!-- //*** region ***-->
      <v-expansion-panels v-else accordion>
        <v-expansion-panel
          v-for="region in regions"
          :key="region.id"
          @change="getCountrys(region.id)"
          :id="`regionId-${region.id}`"
        >
          <v-expansion-panel-header>
            {{ region.name }}
            <div class="mr-4 d-flex align-center">
              <v-spacer></v-spacer>
              <DialogCountry
                @create="createCountry"
                :create="true"
                :region="region"
              />
            </div>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <div class="mb-2 d-flex justify-space-between align-center">
              <v-alert
                dense
                text
                type="info"
                class="ma-0"
                v-if="!countrys.length"
              >
                No se tienen asignados países
              </v-alert>
            </div>

            <!-- //*** Pais *** -->
            <v-expansion-panels v-if="countrys.length" accordion>
              <v-expansion-panel
                v-for="country in countrys"
                :key="country.id"
                @change="getCities(country.id)"
                :id="`countryId-${country.id}`"
              >
                <v-expansion-panel-header>
                  {{ country.name }}
                  <div class="d-flex justify-space-between align-center">
                    <v-spacer></v-spacer>

                    <DialogCountry
                      @edit="editCountry"
                      :create="false"
                      :region="region"
                      :country="country"
                    />
                    <!-- Modal alerta eliminar país -->
                    <DialogDelete
                      title="Eliminar País"
                      :text="
                        `¿Está seguro que desea eliminar el país ${country.name}? (también se eliminaran las ciudades asociadas)`
                      "
                      :item="country"
                      @accept="eliminarCountry(country)"
                    />
                    <div class="mx-4">
                      <DialogCity
                        @create="createCity"
                        :create="true"
                        :country="country"
                      />
                    </div>
                  </div>
                </v-expansion-panel-header>
                <v-divider></v-divider>
                <v-expansion-panel-content class="pt-4">
                  <v-alert
                    dense
                    text
                    type="info"
                    class="ma-0"
                    v-if="!cities.length"
                  >
                    No se tienen asignados ciudades
                  </v-alert>
                  <!-- //*** Ciudad *** -->
                  <div
                    v-else
                    v-for="city in cities"
                    :key="city.id"
                    class="city pa-4"
                  >
                    {{ city.name }}
                    <DialogCity
                      @edit="editCity"
                      :create="false"
                      :country="country"
                      :city="city"
                    />
                    <!-- Modal alerta eliminar país -->
                    <DialogDelete
                      title="Eliminar Ciudad"
                      :text="
                        `¿Está seguro que desea eliminar la ciudad ${city.name}?`
                      "
                      :item="city"
                      @accept="eliminarCity(city)"
                    />
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import DialogDelete from '../../components/DialogDelete';
import DialogRegion from './DialogRegion';
import DialogCountry from './DialogCountry';
import DialogCity from './DialogCity';

export default {
  name: 'ListRegions',
  components: { DialogDelete, DialogRegion, DialogCountry, DialogCity },
  data() {
    return {
      regions: [],
      countrys: [],
      cities: []
    };
  },
  created() {
    this.getRegions();
  },
  methods: {
    removeItemFromArr(arr, id) {
      const i = arr.map(i => i.id).indexOf(id);

      if (i !== -1) {
        arr.splice(i, 1);
      }
    },
    getRegions() {
      axios
        .get('/region')
        .then(response => {
          this.regions = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCountrys(id) {
      axios
        .get(`/country/countryForRegionId?id=${id}`)
        .then(response => {
          this.countrys = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCities(id) {
      axios
        .get(`/city/cityForCountryId?id=${id}`)
        .then(response => {
          this.cities = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    createRegion(item) {
      this.regions.push(item);
    },
    createCountry(item, regionId) {
      const regionExpanded = document.querySelector(`#regionId-${regionId}`);
      if (regionExpanded.classList.contains('v-item--active'))
        this.countrys.push(item);
    },
    editCountry(item) {
      const country = this.countrys.find(c => c.id === item.id);
      if (country) country.name = item.name;
    },
    eliminarCountry(item) {
      axios.delete('/country', { data: { id: item.id } }).then(() => {
        this.removeItemFromArr(this.countrys, item.id);
      });
    },
    createCity(item, countryId) {
      const countryExpanded = document.querySelector(`#countryId-${countryId}`);
      if (countryExpanded.classList.contains('v-item--active'))
        this.cities.push(item);
    },
    editCity(item) {
      const city = this.cities.find(c => c.id === item.id);
      if (city) city.name = item.name;
    },
    eliminarCity(item) {
      axios.delete('/city', { data: { id: item.id } }).then(() => {
        this.removeItemFromArr(this.cities, item.id);
      });
    }
  }
};
</script>

<style scoped>
.city {
  border: 1px solid #e0e0e0;
}
</style>
