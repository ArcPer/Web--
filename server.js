const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'arutdb',
  password: '123',
  port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Подключился молодец!');
});

// Получение списка авторов
app.get('/api/authors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authors');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение списка работ
app.get('/api/works', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM works');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получения работ определенного автора
app.get('/api/author-works/:authorId', async (req, res) => {
  const authorId = req.params.authorId;
  try {
    const result = await pool.query(`
      SELECT works.*
      FROM works
      INNER JOIN authorsworks ON works.work_id = authorsworks.work_id
      INNER JOIN authors ON authors.author_id = authorsworks.author_id
      WHERE authors.author_id = $1
    `, [authorId]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получения авторов и их роли для каждой работы
app.get('/api/work-authors/:workId', async (req, res) => {
  const workId = req.params.workId;
  try {
    const result = await pool.query(`
      SELECT authors.*, authorsworks.role
      FROM authors
      INNER JOIN authorsworks ON authors.author_id = authorsworks.author_id
      WHERE authorsworks.work_id = $1
    `, [workId]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавление автора
app.post('/api/authors', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query('INSERT INTO authors (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *', [first_name, last_name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавление работы
app.post('/api/works', async (req, res) => {
  const { title, work_type, publication_year } = req.body;
  try {
    const result = await pool.query('INSERT INTO works (title, work_type, publication_year) VALUES ($1, $2, $3) RETURNING *', [title, work_type, publication_year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удаление автора
app.delete('/api/authors/:authorId', async (req, res) => {
  const authorId = req.params.authorId;
  try {
    await pool.query('DELETE FROM authors WHERE author_id = $1', [authorId]);

    // Обновление нумерации авторов
    await pool.query('SELECT setval(\'authors_author_id_seq\', (SELECT COALESCE(MAX(author_id), 0) + 1 FROM authors))');

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удаление работы
app.delete('/api/works/:workId', async (req, res) => {
  const workId = req.params.workId;
  try {
    await pool.query('DELETE FROM works WHERE work_id = $1', [workId]);
    
    // Обновление нумрации работ
    await pool.query('SELECT setval(\'works_work_id_seq\', (SELECT COALESCE(MAX(work_id), 1) FROM works))');
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Связывание автора с работой и установления статуса (автор или соавтор)
app.post('/api/assign-author-work', async (req, res) => {
  const { authorId, workId, role } = req.body;
  try {
    await pool.query('INSERT INTO authorsworks (author_id, work_id, role) VALUES ($1, $2, $3)', [authorId, workId, role]);
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assign-author-work', async (req, res) => {
  const { workId, authorId, role } = req.body;

  try {
  
    const result = await pool.query('INSERT INTO authorsworks (work_id, author_id, role) VALUES ($1, $2, $3) RETURNING *', [workId, authorId, role]);
    
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Обновление роли автора в связи 
app.put('/api/assign-author-work/:workId/:authorId/:role', async (req, res) => {
  const { workId, authorId, role } = req.params;

  try {
    // Проверка наличия связи
    const result = await pool.query('SELECT * FROM authorsworks WHERE work_id = $1 AND author_id = $2', [workId, authorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Связь автора и работы не найдена.' });
    }

    // Обновляем роль в связи 
    await pool.query('UPDATE authorsworks SET role = $1 WHERE work_id = $2 AND author_id = $3', [role, workId, authorId]);
    
    res.status(200).json({ message: 'Роль автора обновлена.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удаление связи между автором и работой
app.delete('/api/assign-author-work/:workId/:authorId', async (req, res) => {
  const workId = req.params.workId;
  const authorId = req.params.authorId;
  try {
    // Проверка наличия связи
    const result = await pool.query('SELECT * FROM authorsworks WHERE work_id = $1 AND author_id = $2', [workId, authorId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Связь автора и работы не найдена.' });
    }

    // Удаление связь 
    await pool.query('DELETE FROM authorsworks WHERE work_id = $1 AND author_id = $2', [workId, authorId]);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
