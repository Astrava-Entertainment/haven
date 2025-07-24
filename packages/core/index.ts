import { devtools } from '@vue/devtools';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './assets/css/app.css';
import App from '@/app.vue';
import Oruga from '@oruga-ui/oruga-next';
import '@oruga-ui/theme-oruga/dist/oruga.css';

if (process.env.NODE_ENV === 'development') {
  devtools.connect('http://localhost', 8098);
}
const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(Oruga);
app.mount('#app');
