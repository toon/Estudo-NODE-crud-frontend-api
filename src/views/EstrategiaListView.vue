<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="[{ key: 'name', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Estratégias</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              class="mb-2"
              color="primary"
              dark
              v-bind="props"
            >
              Novo item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Par moeda"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="12"
                    sm="12"
                  >
                  
                  <v-textarea 
                    v-model="editedItem.description"  
                    clearable 
                    label="Descrição"

                  >
                  </v-textarea>
                  
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-checkbox
                      v-model="editedItem.active"
                      label="Ativo?"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Confirma exclusão este item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="editItem(item)"
        title="Editar"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
        title="Excluir"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.active="{ item }">
      <v-icon v-if="item.active == true" color="success" title="Ativo">mdi-check-circle</v-icon>
      <v-icon v-else color="error" title="Inativo">mdi-close-circle</v-icon>
    </template>    
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="loadItems"
      >
        Recarregar
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import api from "../services/api";

export default {
  data: () => ({
    items: [],
    headers: [
      { title: "Cód", value: "id", key: "id" },
      { title: "Estratégia", key:"name", value: "name" },
      { title: "Descrição", key:"description", value: "description" },
      { title: "Status", key: "active", align: "center", value: "active" },
      { title: "Ações", value: "actions", align: "end", sortable: false },
    ],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      name: ''
    },
    defaultItem: {
      name: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Novo item' : 'Editar item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.loadItems();
  },

  methods: {

    loadItems() {
      api.get("/strategy").then((response) => {
        this.items = response.data;
      });
    },
    
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      api.delete(`/strategy/${this.editedItem.id}`).then(() => 
        this.loadItems(),
        this.closeDelete()
      );
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        api.put(`/strategy/${this.editedItem.id}`, this.editedItem).then(() => 
          this.loadItems()
        )
      } else {
        api.post("/strategy", this.editedItem).then(() => 
          this.loadItems()
        )
      }
      this.close()
    },
  },
}
</script>