import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(configService: ConfigService): Promise<void> {
    // create the connection datasource
    const appDataSource = new DataSource({
        type: 'postgres',
        // entities: [User, Post, Tag, MetaOption],
        // autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
        synchronize: configService.get<boolean>('database.synchronize'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        host: configService.get<string>('database.host'),
        database: configService.get<string>('database.name'),
    })

    await appDataSource.initialize();
    // drop all tables
    await appDataSource.dropDatabase();
    // close the connection
    await appDataSource.destroy();
}