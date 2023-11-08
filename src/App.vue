<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div>
      <nav>
        <router-link to="/authors">Авторы</router-link>
        <router-link to="/works">Труды</router-link>
        <router-link to="/authorworks">Отчётность</router-link>

      </nav>
      <router-view></router-view>
    </div>

    <div class="wrapper">

      <HelloWorld msg="Издательство!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

router-link {
  padding: 5px 10px;
  border: 1px solid #ccc;
  text-decoration: none;
  color: black;
}

router-link:hover {
  background-color: #f5f5f5;
}
</style>