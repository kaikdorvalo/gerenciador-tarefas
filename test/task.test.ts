import { describe, it } from "@jest/globals";
import { CreateUserDto } from "../src/dtos/user/create-user.dto";
import app from '../app'
import supertest from 'supertest'
import { UserSignInDto } from "../src/dtos/user/user-signin";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from "../src/dtos/task/create-task.dto";
import { Task } from "../src/interfaces/task.interface";
import { HttpStatus } from "../src/enums/http-status.enum";
import { CreateCategoryDto } from "../src/dtos/category/create-category.dto";
import { DeleteTaskDto } from "../src/dtos/task/delete-task.dto";

describe('Task test', () => {
    const request = supertest(app);
    let token: string
    const newTask = new CreateTaskDto('Task test', 'Task description', new Date('2020-04-01'), new Date('2020-05-04'), 'test');

    beforeAll(async () => {
        const uuid = uuidv4().replace(/-/g, '')
        const createUser = new CreateUserDto('Kaik', 78.5, 'test123@', `${uuid}@gmail.com`);
        const userSignin = new UserSignInDto(`${uuid}@gmail.com`, 'test123@');

        await request.post('/users').send(createUser);
        const login = await request.post('/users/signin').send(userSignin);
        token = login.body.data.token
    })

    it('Should be create a new Task without category', async () => {
        const result = await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);

        expect(result.statusCode).toEqual(HttpStatus.OK);
    })

    //doing
    it('Should be create a new Task with category', async () => {
        const newTaskWithCategory = { ...newTask };
        const createCategory = new CreateCategoryDto(`Test Category ${uuidv4()}`, '#ffffff');
        const createdCategory = await request.post('/categories').set('Authorization', `Bearer ${token}`).send(createCategory);
        newTaskWithCategory.category = createdCategory.body.data._id;
        const result = await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTaskWithCategory);

        expect(result.statusCode).toEqual(HttpStatus.OK);
        expect(result.body.data.category).toEqual(createdCategory.body.data._id)
    })

    it('Should be get all user Tasks', async () => {
        await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);
        const result = await request.get('/tasks').set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toEqual(HttpStatus.OK);
        expect(result.body.data.length).toBeGreaterThan(0);
    })

    it('Should be get Task by Id', async () => {
        const task = await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);
        const result = await request.get(`/tasks/getbyid/${task.body.data._id}`).set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toEqual(HttpStatus.OK);
        expect(result.body.data._id).toEqual(task.body.data._id);
    })

    it('Should be update update Task', async () => {
        const task = await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);
        const updateTask: Task = { ...task.body.data };
        updateTask.title = 'Test change task name';
        updateTask.description = 'test change task description';
        const result = await request.put('/tasks/').set('Authorization', `Bearer ${token}`).send(updateTask);
        const updatedTask = await request.get(`/tasks/getbyid/${updateTask._id}`).set('Authorization', `Bearer ${token}`).send(newTask);

        expect(result.statusCode).toEqual(HttpStatus.OK);
        expect(updatedTask.body.data._id).toEqual(updateTask._id);
        expect(updatedTask.body.data.title).toEqual('Test change task name');
        expect(updatedTask.body.data.description).toEqual('test change task description');
    })

    it('Should be delete a Task (only soft delete)', async () => {
        const task = await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);
        const deleteTask = new DeleteTaskDto(task.body.data._id);
        const result = await request.delete('/tasks').set('Authorization', `Bearer ${token}`).send(deleteTask);
        const getTask = await request.get(`/tasks/getbyid/${task.body.data._id}`).set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toEqual(HttpStatus.OK);
        expect(getTask.body.data).toEqual(undefined);
    })

    it('Should be get tasks by category', async () => {
        const newTaskWithCategory1 = { ...newTask };
        const newTaskWithCategory2 = { ...newTask };
        const createCategory = new CreateCategoryDto(`Test Category ${uuidv4()}`, '#ffffff');
        const createdCategory = await request.post('/categories').set('Authorization', `Bearer ${token}`).send(createCategory);
        newTaskWithCategory1.category = createdCategory.body.data._id;
        newTaskWithCategory2.category = createdCategory.body.data._id;
        await Promise.all([
            request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTaskWithCategory1),
            request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTaskWithCategory2),
            request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask)
        ]);

        const result = await request.get(`/tasks/categories/${createdCategory.body.data._id}`).set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.body.data.length).toEqual(2);
        expect(result.body.data[0].category).toEqual(createdCategory.body.data._id);
        expect(result.body.data[1].category).toEqual(createdCategory.body.data._id);
    })

    it('Should be get tasks by status', async () => {
        const newTask1 = { ...newTask };
        const newTask2 = { ...newTask };
        const newTask3 = { ...newTask };

        const [task1, task2, task3] = await Promise.all([
            request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask1),
            request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask2),
            request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask3)
        ]);

        const updateTask1: Task = { ...task1.body.data };
        const updateTask2: Task = { ...task2.body.data };

        updateTask1.status = 'in-progress';
        updateTask2.status = 'in-progress';

        await Promise.all([
            await request.put('/tasks/').set('Authorization', `Bearer ${token}`).send(updateTask1),
            await request.put('/tasks/').set('Authorization', `Bearer ${token}`).send(updateTask2)
        ])

        const result = await request.get(`/tasks/status/in-progress`).set('Authorization', `Bearer ${token}`);

        expect(result.body.data.length).toEqual(2);
        expect(result.body.data[0].status).toEqual('in-progress');
        expect(result.body.data[1].status).toEqual('in-progress');
    })




})