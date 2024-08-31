// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import { pt } from "vuetify/locale"; // Importando o locale português

export default createVuetify({
  locale: {
    locale: 'pt', // Define o idioma padrão como português
    messages: { pt }, // Adiciona o locale português
  },
});
