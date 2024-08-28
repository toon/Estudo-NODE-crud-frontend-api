<template>
  <v-container>
    <v-data-table :items="items" :headers="headers">
      <template #default="{ item }">
        <div v-for="(parmoeda, index) in items" :key="index">
          <v-list-item>
            <v-list-item-title>{{ parmoeda.name }}</v-list-item-title>
          </v-list-item>
        </div>
        <v-btn @click="editItem(item.id)">Editar</v-btn>
        <v-btn @click="deleteItem(item.id)" color="red">Excluir</v-btn>
      </template>
    </v-data-table>
    <v-btn @click="$router.push('/create')">Criar Novo</v-btn>
  </v-container>
</template>

<script>
import api from "../services/api";
export default {
  data() {
    return {
      items: [],
      headers: [
        { text: "Par moeda", value: "name" },
        { text: "Ações", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.loadItems();
  },
  methods: {
    loadItems() {
      api.get("/parmoeda").then((response) => {
        this.items = response.data;
      });
    },
    editItem(id) {
      this.$router.push(`/edit/${id}`);
    },
    deleteItem(id) {
      api.delete(`/parmoeda/${id}`).then(() => this.loadItems());
    },
  },
};
</script>
