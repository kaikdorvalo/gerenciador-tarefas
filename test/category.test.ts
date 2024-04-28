import { describe, it } from "@jest/globals";
import { CreateUserDto } from "../src/dtos/user/create-user.dto";
import app from '../app'
import supertest from 'supertest'
import { UserSignInDto } from "../src/dtos/user/user-signin";
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from "../src/dtos/task/create-task.dto";
import { CreateCategoryDto } from "../src/dtos/category/create-category.dto";
import { HttpStatus } from "../src/enums/http-status.enum";


describe('Task test', () => {
    const request = supertest(app);
    let token: string
    let newCategory: CreateCategoryDto

    beforeAll(async () => {
        const uuid = uuidv4().replace(/-/g, '')
        const createUser = new CreateUserDto('Kaik', 78.5, 'test123@', `${uuid}@gmail.com`);
        const userSignin = new UserSignInDto(`${uuid}@gmail.com`, 'test123@');

        await request.post('/users').send(createUser);
        const login = await request.post('/users/signin').send(userSignin);
        token = login.body.data.token

        newCategory = new CreateCategoryDto(`${uuid}test`, '#ffffff')
    })

    it('Should be create category', async () => {
        const result = await request.post('/categories').set('Authorization', `Bearer ${token}`).send(newCategory);

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.body.data.name).toEqual(newCategory.name);
    })

    it('Should be update category', async () => {
        const uuid = uuidv4().replace(/-/g, '')
        let category = { ...newCategory }
        category.name = `${uuid}category`
        const result = await request.post('/categories').set('Authorization', `Bearer ${token}`).send(category);
        const updateCategory = result.body.data;
        updateCategory.color = "#fafafa"
        updateCategory.name = `${uuidv4().replace(/-/g, '')}category`
        await request.put('/categories').set('Authorization', `Bearer ${token}`).send(updateCategory);

        const find = await request.get(`/categories/${updateCategory._id}`).set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.body.data._id).toEqual(find.body.data._id);
        expect(find.body.data.name).toEqual(updateCategory.name);

    })

    it('Should get Categories', async () => {
        const categories = await request.get('/categories').set('Authorization', `Bearer ${token}`);

        expect(categories.statusCode).toBe(HttpStatus.OK);
        expect(categories.body.data.length).toBeGreaterThan(0);
    })

    it('Should be delete category (only soft delete)', async () => {
        const uuid = uuidv4().replace(/-/g, '')
        let category = { ...newCategory };
        category.name = `${uuid}test`;

        const result = await request.post('/categories').set('Authorization', `Bearer ${token}`).send(category);
        const find = await request.get(`/categories/${result.body.data._id}`).set('Authorization', `Bearer ${token}`);
        const del = await request.delete('/categories').set('Authorization', `Bearer ${token}`).send({ _id: result.body.data._id });
        const findDel = await request.get(`/categories/${result.body.data._id}`).set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(find.body.data).toBeDefined();
        expect(findDel.statusCode).toBe(HttpStatus.BAD_REQUEST);
    })


})