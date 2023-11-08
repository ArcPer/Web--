<template>
  <div>
    <h2>Труды</h2>
    <table>
      <tr v-for="work in works" :key="work.work_id">
        <td>
          {{ work.title }} ({{ work.work_type }})
        </td>
        <td>
          <button @click="showWorkAuthors(work.work_id)">Показать авторов</button>
        </td>
        <tr v-if="workAuthors[work.work_id]">
          <td colspan="2">
            <ul>
              <li v-for="author in workAuthors[work.work_id]" :key="author.author_id">
                {{ author.first_name }} {{ author.last_name }} ({{ author.role }})
              </li>
            </ul>
          </td>
        </tr>
      </tr>
    </table>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'WorksView',
  data() {
    return {
      works: [],
      workAuthors: {}, 
    };
  },
  methods: {
    // Получаем авторов и соавторов для работы
    showWorkAuthors(workId) {
      axios.get(`http://localhost:3000/api/work-authors/${workId}`)
        .then(response => {
          this.workAuthors[workId] = response.data;
        })
        .catch(error => {
          console.error("Ошибка при загрузке авторов работы:", error);
        });
    },
  },
  mounted() {
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
