import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-user.dto';

@Injectable()
export class UsersCreateManyProvider {

    constructor(
        private readonly dataSource: DataSource
    ) { }

    public async createMany(createManyUserDtos: CreateManyUsersDto) {

        let newUsers: User[] | null = []

        // create queryrunner
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            // connect query runner to datasource 
            await queryRunner.connect()

            // start transaction
            await queryRunner.startTransaction();

        } catch (error) {
            throw new RequestTimeoutException(
                'Could not connect to the database, try again later!'
            )
        }


        try {

            for (let user of createManyUserDtos.users) {
                let newUser = queryRunner.manager.create(User, user);
                let result = await queryRunner.manager.save(newUser);

                newUsers.push(result);
            }

            // if successful commit 
            await queryRunner.commitTransaction();

        } catch (error) {

            // if unsuccessful rollback
            await queryRunner.rollbackTransaction();

            throw new ConflictException(
                'Could not complete the transaction',
                {
                    description: String(error),
                }
            )

        } finally {

            try {
                // release connection
                await queryRunner.release();
                
            } catch (error) {
                throw new RequestTimeoutException(
                    'Could not release the connection',
                    {
                        description: String(error)
                    }
                )
            }
        }

        return {users : newUsers};
    }
}
