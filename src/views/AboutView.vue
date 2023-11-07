<template>
  <div class="about">
    <h1>Если не трудно оцените старания</h1>
    
    <div class="rating">
      <p>Оцените эту страницу:</p>
      <button @click="like">Понравилось</button>
      <button @click="dislike">Не понравилось</button>
      <p>Понравилось: {{ likes }}</p>
      <p>Не понравилось: {{ dislikes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      likes: 0,
      dislikes: 0,
    };
  },
  methods: {
    like() {
      this.likes++;
    },
    dislike() {
      this.dislikes++;
    },
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 10vh;
    display: flex;
    align-items: center;
  }

  .rating {
    margin-top: 20px;
    text-align: center;
  }

  .rating button {
    padding: 10px 20px;
    margin: 10px;
    background-color: #4c90af;
    color: white;
    border: none;
    cursor: pointer;
  }
}
</style>
