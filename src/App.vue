<template>
  <v-app id="inspire">
    <!-- <v-system-bar>
      <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>
    </v-system-bar> -->

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      permanent
    >

    <v-list nav>
      <v-list-item prepend-icon="mdi-currency-btc" title="Pares de moeda" value="parmoedas" to="/parmoedas"></v-list-item>
      <v-list-item prepend-icon="mdi-target-variant" title="Estrategias" value="estrategias" to="/estrategias"></v-list-item>
    </v-list>    
    
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const drawer = ref(null)
</script>

<script>
  export default {
    data: () => (
      { 
        drawer: null,
      }
    ),
  }
</script>