<template>
  <div>
    <h2>Авторы</h2>
    <ul>
      <li v-for="author in authors" :key="author.author_id">
        {{ author.first_name }} {{ author.last_name }}
        <button @click="showAuthorWorks(author.author_id)">Показать работы</button>
      </li>
    </ul>

    <div v-if="selectedAuthorWorks && selectedAuthorWorks.length">
      <h3>Работы автора {{ selectedAuthorName }}</h3>
      <ul>
        <li v-for="work in selectedAuthorWorks" :key="work.work_id">
          {{ work.title }} ({{ work.work_type }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AuthorsView',
  data() {
    return {
      authors: [],
      selectedAuthorWorks: [],
      selectedAuthorName: null,
    };
  },
  methods: {
  // Работы автора
  showAuthorWorks(authorId) {
    // Находим полное имя автора для отображения
    const author = this.authors.find(author => author.author_id === authorId);
    this.selectedAuthorName = author.first_name + ' ' + author.last_name;
    
    // Получения информации об авторе
    axios.get(`http://localhost:3000/api/author/${authorId}`)
      .then(response => {
        // Обновление
        this.selectedAuthor = response.data;
      })
      .catch(error => {
        console.error("Ошибка при загрузке информации об авторе:", error);
      });

    // Получения работ автора
    axios.get(`http://localhost:3000/api/author-works/${authorId}`)
      .then(response => {
        this.selectedAuthorWorks = response.data;
      })
      .catch(error => {
        console.error("Ошибка при загрузке работ автора:", error);
      });
  },
},
data() {
  return {
    authors: [],
    selectedAuthorWorks: [],
    selectedAuthorName: '',
    selectedAuthor: null, 
  };
},

  mounted() {
    axios.get('http://localhost:3000/api/authors') 
      .then(response => {
        this.authors = response.data;
      })
      .catch(error => {
        console.error("Ошибка при загрузке данных об авторах:", error);
      });
  },
};
</script>

<style scoped>
</style>
