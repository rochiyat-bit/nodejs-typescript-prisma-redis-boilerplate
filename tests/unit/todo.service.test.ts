import { expect } from 'chai';
import { todoService } from '../../src/services/todo.service';
import { setupTests, teardownTests, cleanDatabase, cleanCache } from '../setup';
import { CreateTodoDto, UpdateTodoDto } from '../../src/types/todo.types';
import { NotFoundError } from '../../src/utils/errors';

describe('TodoService Unit Tests', () => {
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

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const data: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
      };

      const todo = await todoService.createTodo(data);

      expect(todo).to.have.property('id');
      expect(todo.title).to.equal(data.title);
      expect(todo.description).to.equal(data.description);
      expect(todo.status).to.equal(data.status);
      expect(todo.priority).to.equal(data.priority);
    });

    it('should create todo with minimal data', async () => {
      const data: CreateTodoDto = {
        title: 'Minimal Todo',
      };

      const todo = await todoService.createTodo(data);

      expect(todo).to.have.property('id');
      expect(todo.title).to.equal(data.title);
      expect(todo.status).to.equal('pending');
      expect(todo.priority).to.equal('medium');
    });
  });

  describe('getTodoById', () => {
    it('should get todo by id', async () => {
      const created = await todoService.createTodo({ title: 'Test Todo' });
      const todo = await todoService.getTodoById(created.id);

      expect(todo.id).to.equal(created.id);
      expect(todo.title).to.equal(created.title);
    });

    it('should throw NotFoundError for non-existent todo', async () => {
      try {
        await todoService.getTodoById('00000000-0000-0000-0000-000000000000');
        expect.fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
      }
    });

    it('should cache todo on first retrieval', async () => {
      const created = await todoService.createTodo({ title: 'Cache Test' });

      // First call - should cache
      await todoService.getTodoById(created.id);

      // Second call - should retrieve from cache
      const todo = await todoService.getTodoById(created.id);

      expect(todo.id).to.equal(created.id);
    });
  });

  describe('getAllTodos', () => {
    it('should get all todos with pagination', async () => {
      // Create multiple todos
      await todoService.createTodo({ title: 'Todo 1' });
      await todoService.createTodo({ title: 'Todo 2' });
      await todoService.createTodo({ title: 'Todo 3' });

      const result = await todoService.getAllTodos({ page: 1, limit: 10 });

      expect(result.todos).to.be.an('array');
      expect(result.todos.length).to.equal(3);
      expect(result.meta.total).to.equal(3);
      expect(result.meta.page).to.equal(1);
      expect(result.meta.totalPages).to.equal(1);
    });

    it('should filter todos by status', async () => {
      await todoService.createTodo({ title: 'Pending', status: 'pending' });
      await todoService.createTodo({ title: 'In Progress', status: 'in_progress' });
      await todoService.createTodo({ title: 'Completed', status: 'completed' });

      const result = await todoService.getAllTodos({ status: 'pending' });

      expect(result.todos.length).to.equal(1);
      expect(result.todos[0].status).to.equal('pending');
    });

    it('should filter todos by priority', async () => {
      await todoService.createTodo({ title: 'Low', priority: 'low' });
      await todoService.createTodo({ title: 'High', priority: 'high' });

      const result = await todoService.getAllTodos({ priority: 'high' });

      expect(result.todos.length).to.equal(1);
      expect(result.todos[0].priority).to.equal('high');
    });
  });

  describe('updateTodo', () => {
    it('should update todo', async () => {
      const created = await todoService.createTodo({ title: 'Original' });

      const updateData: UpdateTodoDto = {
        title: 'Updated',
        status: 'completed',
      };

      const updated = await todoService.updateTodo(created.id, updateData);

      expect(updated.id).to.equal(created.id);
      expect(updated.title).to.equal(updateData.title);
      expect(updated.status).to.equal(updateData.status);
    });

    it('should throw NotFoundError when updating non-existent todo', async () => {
      try {
        await todoService.updateTodo('00000000-0000-0000-0000-000000000000', {
          title: 'Updated',
        });
        expect.fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
      }
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo', async () => {
      const created = await todoService.createTodo({ title: 'To Delete' });

      await todoService.deleteTodo(created.id);

      try {
        await todoService.getTodoById(created.id);
        expect.fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
      }
    });

    it('should throw NotFoundError when deleting non-existent todo', async () => {
      try {
        await todoService.deleteTodo('00000000-0000-0000-0000-000000000000');
        expect.fail('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
      }
    });
  });
});
