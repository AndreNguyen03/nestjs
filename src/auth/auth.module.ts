import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Export AuthService if you want to use it in other modules
  imports: [forwardRef(() =>UsersModule)], // Import other modules if needed, e.g., UsersModule for user-related
})
export class AuthModule {}
