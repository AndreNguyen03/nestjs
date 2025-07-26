import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { bootstrapNestApp } from 'test/helpers/bootstrap-nest-app.helper';
import { completeUser, missingEmail, missingFirstName, missingPassword } from './users.post.e2e-spec.sample-data';
import * as request from 'supertest';

describe('[Users] @Post Endpoints', () => {
    let app: INestApplication<App>;
    let config: ConfigService
    let httpServer: any;
    beforeEach(async () => {
        // instantiating the app
        app = await bootstrapNestApp();
        // extract the config
        config = app.get<ConfigService>(ConfigService)
        httpServer = app.getHttpServer();
    });

    afterEach(async () => {
        await dropDatabase(config);
        await app.close()
    });

    it('/users - Endpoint is public', () => {
        return request(httpServer)
            .post('/users')
            .send({})
            .expect(400);
    })
    it('/users - firstName is mandatory', () => {
        return request(httpServer)
            .post('/users')
            .send(missingFirstName)
            .expect(400);
    })
    it('/users - email is mandatory', () => {
        return request(httpServer)
            .post('/users')
            .send(missingEmail)
            .expect(400);
    })
    it('/users - password is mandatory', () => {
        return request(httpServer)
            .post('/users')
            .send(missingPassword)
            .expect(400);
    })
    it('/users - Valid request successfully creates user', async () => {
        return request(httpServer)
            .post('/users')
            .send(completeUser)
            .expect(201)
            .then(({ body }) => {
                expect(body.data).toBeDefined();
                expect(body.data.firstName).toBe(completeUser.firstName);
                expect(body.data.lastName).toBe(completeUser.lastName);
                expect(body.data.email).toBe(completeUser.email);
            });
    })
    it('/users - password is not returned in response', async () => {
        return request(httpServer)
            .post('/users')
            .send(completeUser)
            .expect(201)
            .then(({ body }) => {
                expect(body.data.password).toBeUndefined();
            });
    })
    it('/users - googleId is not returned in response', async () => {
        return request(httpServer)
            .post('/users')
            .send(completeUser)
            .expect(201)
            .then(({ body }) => {
                expect(body.data.googleId).toBeUndefined();
            });
    })
});
