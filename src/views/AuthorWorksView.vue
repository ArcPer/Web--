<template>
  <div>
    <h2>Авторы и Работы</h2>

<form @submit.prevent="addAuthor">
  <label for="authorFirstName">Имя:</label>
  <input type="text" id="authorFirstName" v-model="newAuthorFirstName" required>
  <label for="authorLastName">Фамилия:</label>
  <input type="text" id="authorLastName" v-model="newAuthorLastName" required>
  <label for="authorEmail">Почта:</label>
  <input type="email" id="authorEmail" v-model="newAuthorEmail" required>
  <button type="submit">Добавить автора</button>
</form>

    <form @submit.prevent="addWork">
      <label for="workTitle">Название работы:</label>
      <input type="text" id="workTitle" v-model="newWorkTitle" required>
      <label for="workType">Тип работы:</label>
      <input type="text" id="workType" v-model="newWorkType" required>
      <label for="workYear">Год издания:</label>
      <input type="number" id="workYear" v-model="newWorkYear" required>
      <button type="submit">Добавить работу</button>
    </form>

    <h3>Список авторов</h3>
    <ul>
      <li v-for="author in authors" :key="author.author_id">
        {{ author.first_name }} {{ author.last_name }} ({{ author.email }})
        <button @click="deleteAuthor(author.author_id)">Удалить</button>
      </li>
    </ul>

   <h3>Список работ</h3>
   <ul>
      <li v-for="work in works" :key="work.work_id">
        {{ work.title }} ({{ work.work_type }}), {{ work.publication_year }}
        <button @click="deleteWork(work.work_id)">Удалить</button>

        <select v-model="selectedAuthorId">
          <option value="">Выберите автора</option>
          <option v-for="author in authors" :key="author.author_id" :value="author.author_id">
            {{ author.first_name }} {{ author.last_name }}
          </option>
        </select>
        <button @click="assignAuthorWork(work.work_id, selectedAuthorId, 'Основной автор')">Установить автором</button>
        <button @click="assignAuthorWork(work.work_id, selectedAuthorId, 'Соавтор')">Установить соавтором</button>
        <button @click="deleteAuthorWork(work.work_id, selectedAuthorId)">Удалить связь</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AuthorWorksView',
  data() {
    return {
      newAuthorFirstName: '',
      newAuthorLastName: '',
      newAuthorEmail: '',
      newWorkTitle: '',
      newWorkType: '',
      newWorkYear: null,
      authors: [],
      works: [],
      selectedAuthorId: '', 
    };
  },
  methods: {
    addAuthor() {
      axios.post('http://localhost:3000/api/authors', {
        first_name: this.newAuthorFirstName,
        last_name: this.newAuthorLastName,
        email: this.newAuthorEmail,
      })
      .then(response => {
        this.authors.push(response.data);
        this.newAuthorFirstName = '';
        this.newAuthorLastName = '';
        this.newAuthorEmail = '';
      })
      .catch(error => {
        console.error("Ошибка при добавлении автора:", error);
      });
    },
    addWork() {
      axios.post('http://localhost:3000/api/works', {
        title: this.newWorkTitle,
        work_type: this.newWorkType,
        publication_year: this.newWorkYear,
      })
      .then(response => {
        this.works.push(response.data);
        this.newWorkTitle = '';
        this.newWorkType = '';
        this.newWorkYear = null;
      })
      .catch(error => {
        console.error("Ошибка при добавлении работы:", error);
      });
    },
    deleteAuthor(authorId) {
      axios.delete(`http://localhost:3000/api/authors/${authorId}`)
      .then(() => {
        this.authors = this.authors.filter(author => author.author_id !== authorId);
      })
      .catch(error => {
        console.error("Ошибка при удалении автора:", error);
      });
    },
    deleteWork(workId) {
      axios.delete(`http://localhost:3000/api/works/${workId}`)
      .then(() => {
        this.works = this.works.filter(work => work.work_id !== workId);
      })
      .catch(error => {
        console.error("Ошибка при удалении работы:", error);
      });
    },
    deleteAuthorWork(workId, authorId) {
      axios.delete(`http://localhost:3000/api/assign-author-work/${workId}/${authorId}`)
        .then(() => {
        })
        .catch(error => {
          console.error("Ошибка при удалении связи автора и работы:", error);
        });
    },

    assignAuthorWork(workId, authorId, role) {
  axios.post('http://localhost:3000/api/assign-author-work', {
    workId,
    authorId,
    role
  })
    .then(response => {
    })
    .catch(error => {
      console.error("Ошибка при установлении связи автора и работы:", error);
    });
},


  },
  mounted() {
    axios.get('http://localhost:3000/api/authors')
      .then(response => {
        this.authors = response.data;
      })
      .catch(error => {
        console.error("Ошибка при загрузке данных об авторах:", error);
      });

    axios.get('http://localhost:3000/api/works')
      .then(response => {
        this.works = response.data;
      })
      .catch(error => {
        console.error("Ошибка при загрузке данных о работах:", error);
      });
  },
};
</script>

<style scoped>
</style>
