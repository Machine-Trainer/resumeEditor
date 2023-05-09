// Ready translated locale messages
import VueI18n from "vue-i18n";
import Vue from "vue";
Vue.use(VueI18n);

import English from './English'
import Chinese from './Chinese'

const messages = {
    English,
    Chinese
};

// Create VueI18n instance with options
export default new VueI18n({
    locale: 'English', // set locale
    messages, // set locale messages
});