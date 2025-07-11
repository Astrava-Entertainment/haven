<script setup lang="ts">
import {useStore} from '@/store';

const store = useStore()

const greetMsg = ref('')
const name = ref('')
const storeGreet = computed(() => store.storeGreet)

function greet()
{
  greetMsg.value = name.value;
  store.name = name.value
}
</script>

<template>
  <div>
    <form class="" @submit.prevent="greet">
      <input id="greet-input" v-model="name" placeholder="Enter a name..."/>
      <button type="submit" class="btn">Greet</button>
    </form>
    <p>{{ greetMsg }}</p>
    <p>{{ storeGreet }}</p>
  </div>
</template>
