<script setup lang="ts">
import {useStore} from '@/store';

const store = useStore()

const greetMsg = ref('')
const name = ref('')
const storeGreet = computed(() => store.storeGreet)

function greet()
{
  greetMsg.value = name.value
  store.name = name.value
}
</script>

<template>
  <div>
    <form class="flex flex-col gap-y-4" @submit.prevent="greet">
      <input class="border-solid outline-1 rounded-lg bg-highlight cursor-text p-1" v-model="name" placeholder="Enter a name..."/>
      <button type="submit" class="border-solid outline-1 rounded-lg bg-highlight cursor-pointer">Greet</button>
    </form>
    <p>{{ greetMsg }}</p>
    <p>{{ storeGreet }}</p>
  </div>
</template>
