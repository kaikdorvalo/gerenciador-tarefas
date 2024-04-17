import { describe, it } from "@jest/globals";
import { CreateUserDto } from "../src/dtos/user/create-user.dto";
import app from '../app'
import supertest from 'supertest'
import { UserSignInDto } from "../src/dtos/user/user-signin";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from "../src/dtos/task/create-task.dto";
uuidv4();

describe('Task test', () => {
    const request = supertest(app);
    let token: string

    beforeAll(async () => {
        const uuid = uuidv4().replace(/-/g, '')
        const createUser = new CreateUserDto('Kaik', 78.5, 'test123@', `${uuid}@gmail.com`);
        const userSignin = new UserSignInDto(`${uuid}@gmail.com`, 'test123@');

        await request.post('/users').send(createUser);
        const login = await request.post('/users/signin').send(userSignin);
        token = login.body.data.token
    })

    it('Should be create a new Task', async () => {
        const newTask = new CreateTaskDto('Task test', 'Task description', new Date('2020-04-01'), new Date('2020-05-04'), 'test');
        const result = await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);

        expect(result.statusCode).toEqual(200);
    })

    it('Should be get all user Tasks', async () => {
        const newTask = new CreateTaskDto('Task test', 'Task description', new Date('2020-04-01'), new Date('2020-05-04'), 'test');
        await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);
        const result = await request.get('/tasks').set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toEqual(200);
        expect(result.body.data.length).toBeGreaterThan(0);
    })

    it('Should be get Task by Id', async () => {
        const newTask = new CreateTaskDto('Task test', 'Task description', new Date('2020-04-01'), new Date('2020-05-04'), 'test');
        const task = await request.post('/tasks').set('Authorization', `Bearer ${token}`).send(newTask);
        const result = await request.get(`/tasks/getbyid/${task.body.data._id}`).set('Authorization', `Bearer ${token}`).send(newTask);

        expect(result.statusCode).toEqual(200);
        expect(result.body.data._id).toEqual(task.body.data._id);
    })
})