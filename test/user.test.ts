import { describe, it } from "@jest/globals";
import { CreateUserDto } from "../src/dtos/user/create-user.dto";
import app from '../app'
import supertest from 'supertest'
import { UserSignInDto } from "../src/dtos/user/user-signin";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from "../src/dtos/task/create-task.dto";
import { HttpStatus } from "../src/enums/http-status.enum";

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

    it('Should be create user', async () => {
        const uuid = uuidv4().replace(/-/g, '')
        const newUser = new CreateUserDto('test', 71.90, '12345678', `${uuid}@gmail.com`);
        const result = await request.post('/users').send(newUser);

        expect(result.statusCode).toBe(HttpStatus.OK);
    })

    it('Should be signin', async () => {
        const uuid = uuidv4().replace(/-/g, '')
        const newUser = new CreateUserDto(`${uuid}`, 71.90, '12345678', `${uuid}@gmail.com`);
        await request.post('/users').send(newUser);
        const result = await request.post('/users/signin').send({ email: `${uuid}@gmail.com`, password: '12345678' });

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.body.data.name).toEqual(`${uuid}`);
        expect(result.body.data.token).toBeDefined();
    })

    it('Should be refresh token', async () => {
        const uuid = uuidv4().replace(/-/g, '')
        const newUser = new CreateUserDto(`${uuid}`, 71.90, '12345678', `${uuid}@gmail.com`);
        await request.post('/users').send(newUser);
        const signin = await request.post('/users/signin').send({ email: `${uuid}@gmail.com`, password: '12345678' });
        let cookie = signin.headers['set-cookie'][0];
        const result = await request.get('/users/refreshtoken').set('Cookie', cookie)

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.body.accessToken).toBeDefined();
    })
})