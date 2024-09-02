<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="[{ key: 'nome', order: 'asc' }]"
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
          v-model="dialogParesmoeda"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Pares de moeda</span>
            </v-card-title>

            <v-card-text>
              <v-container>

                <v-list select-strategy="classic">

                  <v-list-item 
                    v-for="parmoeda, index in paresmoeda"
                    :key="index"
                  >
                    <template v-slot:prepend>

                      <v-list-item-action start>
                        <v-checkbox-btn v-model="parmoeda.checked"></v-checkbox-btn>
                      </v-list-item-action>
                    </template>

                    <v-list-item-title>{{ parmoeda.nome }}</v-list-item-title>

                  </v-list-item>

                </v-list>

              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeDialogParesmoeda"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="saveParMoeda"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
                      v-model="editedItem.nome"
                      label="Par moeda"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    md="12"
                    sm="12"
                  >
                  
                  <v-textarea 
                    v-model="editedItem.descricao"  
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
                      v-model="editedItem.ativo"
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
        @click="editParesmoeda(item)"
        title="Pares moeda"
      >
        mdi-currency-btc
      </v-icon>
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
    <template v-slot:item.ativo="{ item }">
      <v-icon v-if="item.ativo == true" color="success" title="Ativo">mdi-check-circle</v-icon>
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
    paresmoeda: [],
    activeoperation: [],
    items: [],
    headers: [
      { title: "Cód", value: "id", key: "id" },
      { title: "Estratégia", key:"nome", value: "nome" },
      { title: "Descrição", key:"descricao", value: "descricao" },
      { title: "Status", key: "ativo", align: "center", value: "ativo" },
      { title: "Ações", value: "actions", align: "end", sortable: false },
    ],
    dialog: false,
    dialogParesmoeda: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      nome: ''
    },
    defaultItem: {
      nome: ''
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
    dialogParesmoeda (val) {
      val || this.closeDialogParesmoeda()
    },
  },

  created() {
    this.loadItems();
  },

  methods: {

    loadItems() {
      api.get("/estrategia").then((response) => {
        this.items = response.data;
      });
      // api.get("/parmoeda").then((response) => {
      //   this.paresmoeda = response.data;
      //   console.log(this.paresmoeda);
      // });      
    },
    
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editParesmoeda(item) {
      // Definir qual item está sendo editado
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      
      // Recuperar da API os pares de moeda desta estratégia
      api.get(`/getmanytomany/Estrategia/${item.id}/ParMoeda/`).then((response) => {
        
        this.paresmoeda = response.data.allRelatedItems;
        
        const markedPairs = response.data.relatedItemIds;

        // DEBUG
        // console.log(this.activeoperation)

        // Extrair os ParMoedaId da resposta da API
        // const markedPairs = relatedItemIds.map(item => item.ParMoedaId);

        // forEach:
        // - O método forEach é usado para iterar sobre cada item na lista paresmoeda. Ele executa a função fornecida uma vez para cada item na lista.

        // parmoeda:
        // - Em cada iteração, parmoeda é o objeto atual da lista paresmoeda sendo processado.

        // markedPairs.includes(parmoeda.nome):
        // - markedPairs é uma lista de nomes de pares de moeda que devem estar marcados (obtida de uma API, por exemplo).
        // - O método includes verifica se o nome do par de moeda atual (parmoeda.nome) está presente na lista markedPairs. Retorna true se o nome estiver na lista e false caso contrário.

        // Atualizar o estado de cada par de moeda com base nos ParMoedaId
        this.paresmoeda.forEach(parmoeda => {
          parmoeda.checked = markedPairs.includes(parmoeda.id);
        });

      });

      // Mostrar a tela de diálogo
      this.dialogParesmoeda = true
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      api.delete(`/estrategia/${this.editedItem.id}`).then(() => 
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

    closeDialogParesmoeda () {
      this.dialogParesmoeda = false
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    /**
     * Função para salvar os pares de moeda associados à estratégia
     */
    saveParMoeda () {
      
      // Filtrar apenas os pares de moeda que estão marcados (checked)
      const markedPairs = this.paresmoeda.filter(parmoeda => parmoeda.checked);

      // Criar o JSON para enviar para a API apenas com os IDs dos pares marcados
      const payload = {
        relatedIds: markedPairs.map(parmoeda => parmoeda.id) // Supondo que 'id' é o identificador do par de moeda
      };

      // Fazer a requisição para a API usando axios
      api.put(`/putmanytomany/Estrategia/${this.editedItem.id}/ParMoeda`, payload).then(() => {
        // Carregar os itens novamente ou fazer outra ação após salvar
        this.loadItems();
      }).catch(error => {
        // Tratamento de erro
        console.error("Erro ao salvar os dados:", error);
      });

      // Fechar o diálogo ou card
      this.closeDialogParesmoeda();
    },

    save () {
      if (this.editedIndex > -1) {
        api.put(`/estrategia/${this.editedItem.id}`, this.editedItem).then(() => 
          this.loadItems()
        )
      } else {
        api.post("/estrategia", this.editedItem).then(() => 
          this.loadItems()
        )
      }
      this.close()
    },
  },
}
</script>