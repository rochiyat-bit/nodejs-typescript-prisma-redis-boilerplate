import { expect } from 'chai';
import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../../src/app';
import { setupTests, teardownTests, cleanDatabase, cleanCache } from '../setup';

chai.use(chaiHttp);

describe('Todo API Integration Tests', () => {
  before(async () => {
    await setupTests();
  });

  after(async () => {
    await teardownTests();
  });

  beforeEach(async () => {
    await cleanDatabase();
    await cleanCache();
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const res = await chai
        .request(app)
        .post('/api/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          priority: 'high',
        });

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('id');
      expect(res.body.data.title).to.equal('Test Todo');
    });

    it('should return 422 for invalid data', async () => {
      const res = await chai
        .request(app)
        .post('/api/todos')
        .send({
          title: '', // Empty title
        });

      expect(res).to.have.status(422);
      expect(res.body.success).to.be.false;
    });

    it('should return 422 for title exceeding max length', async () => {
      const res = await chai
        .request(app)
        .post('/api/todos')
        .send({
          title: 'a'.repeat(101), // Exceeds 100 characters
        });

      expect(res).to.have.status(422);
      expect(res.body.success).to.be.false;
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should get todo by id', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo' });

      const todoId = createRes.body.data.id;

      const res = await chai.request(app).get(`/api/todos/${todoId}`);

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.id).to.equal(todoId);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await chai
        .request(app)
        .get('/api/todos/00000000-0000-0000-0000-000000000000');

      expect(res).to.have.status(404);
      expect(res.body.success).to.be.false;
    });

    it('should return 422 for invalid UUID', async () => {
      const res = await chai.request(app).get('/api/todos/invalid-uuid');

      expect(res).to.have.status(422);
      expect(res.body.success).to.be.false;
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos with default pagination', async () => {
      await chai.request(app).post('/api/todos').send({ title: 'Todo 1' });
      await chai.request(app).post('/api/todos').send({ title: 'Todo 2' });

      const res = await chai.request(app).get('/api/todos');

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
      expect(res.body.meta).to.have.property('page');
      expect(res.body.meta).to.have.property('total');
    });

    it('should filter todos by status', async () => {
      await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'Pending', status: 'pending' });
      await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'Completed', status: 'completed' });

      const res = await chai.request(app).get('/api/todos?status=pending');

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.every((todo: any) => todo.status === 'pending')).to.be.true;
    });

    it('should support pagination', async () => {
      for (let i = 1; i <= 15; i++) {
        await chai.request(app).post('/api/todos').send({ title: `Todo ${i}` });
      }

      const res = await chai.request(app).get('/api/todos?page=2&limit=10');

      expect(res).to.have.status(200);
      expect(res.body.meta.page).to.equal(2);
      expect(res.body.meta.limit).to.equal(10);
      expect(res.body.data.length).to.equal(5);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update todo', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'Original Title' });

      const todoId = createRes.body.data.id;

      const res = await chai
        .request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated Title', status: 'completed' });

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.title).to.equal('Updated Title');
      expect(res.body.data.status).to.equal('completed');
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await chai
        .request(app)
        .put('/api/todos/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Updated' });

      expect(res).to.have.status(404);
      expect(res.body.success).to.be.false;
    });

    it('should return 422 for invalid update data', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'Test' });

      const todoId = createRes.body.data.id;

      const res = await chai
        .request(app)
        .put(`/api/todos/${todoId}`)
        .send({ status: 'invalid_status' });

      expect(res).to.have.status(422);
      expect(res.body.success).to.be.false;
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete todo', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/todos')
        .send({ title: 'To Delete' });

      const todoId = createRes.body.data.id;

      const res = await chai.request(app).delete(`/api/todos/${todoId}`);

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;

      // Verify deletion
      const getRes = await chai.request(app).get(`/api/todos/${todoId}`);
      expect(getRes).to.have.status(404);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await chai
        .request(app)
        .delete('/api/todos/00000000-0000-0000-0000-000000000000');

      expect(res).to.have.status(404);
      expect(res.body.success).to.be.false;
    });
  });

  describe('API Health Check', () => {
    it('should return health status', async () => {
      const res = await chai.request(app).get('/api/health');

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
    });
  });
});
