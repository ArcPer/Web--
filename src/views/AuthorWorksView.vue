<template>
  <div>
    <h2>Авторы и Работы</h2>

    <form @submit.prevent="addAuthor" class="form">
  <div class="form-group">
    <label for="authorFirstName">Имя:</label>
    <input type="text" id="authorFirstName" v-model="newAuthorFirstName" required>
  </div>
  <div class="form-group">
    <label for="authorLastName">Фамилия:</label>
    <input type="text" id="authorLastName" v-model="newAuthorLastName" required>
  </div>
  <div class="form-group">
    <label for="authorEmail">Почта:</label>
    <input type="email" id="authorEmail" v-model="newAuthorEmail" required>
  </div>
  <button type="submit" class="form-button">Добавить автора</button>
</form>

<form @submit.prevent="addWork" class="form">
  <div class="form-group">
    <label for="workTitle">Название работы:</label>
    <input type="text" id="workTitle" v-model="newWorkTitle" required>
  </div>
  <div class="form-group">
    <label for="workType">Тип работы:</label>
    <input type="text" id="workType" v-model="newWorkType" required>
  </div>
  <div class="form-group">
    <label for="workYear">Год издания:</label>
    <input type="number" id="workYear" v-model="newWorkYear" required>
  </div>
  <button type="submit" class="form-button">Добавить работу</button>
</form>


    <table>
      <tr>
        <h3>Список авторов</h3>
      </tr>
      <tr v-for="author in authors" :key="author.author_id">
        <td>
          {{ author.first_name }} {{ author.last_name }} ({{ author.email }})
        </td>
        <td>
          <button @click="deleteAuthor(author.author_id)">Удалить</button>
        </td>
      </tr>
    </table>

    <h3>Список работ</h3>
    <ul class="list">
      <li v-for="work in works" :key="work.work_id">
        <div class="list-item">
          {{ work.title }} ({{ work.work_type }}), {{ work.publication_year }}
          <div class="work-actions">
            <button @click="deleteWork(work.work_id)" class="list-button">Удалить</button>
            <button @click="selectWork(work)" class="list-button">Выбрать</button>
          </div>

          <div v-if="selectedWork === work" class="work-actions">
            <select v-model="selectedAuthorId" class="form-select">
              <option value="">Выберите автора</option>
              <option v-for="author in authors" :key="author.author_id" :value="author.author_id">
                {{ author.first_name }} {{ author.last_name }}
              </option>
            </select>
            <button @click="assignAuthorWork(work.work_id, selectedAuthorId, 'Основной автор')" class="list-button">Установить автором</button>
            <button @click="assignAuthorWork(work.work_id, selectedAuthorId, 'Соавтор')" class="list-button">Установить соавтором</button>
            <button @click="deleteAuthorWork(work.work_id, selectedAuthorId)" class="list-button">Удалить связь</button>
          </div>
        </div>
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
      selectedWork: null,
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

 selectWork(work) {
      this.selectedWork = work;
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
