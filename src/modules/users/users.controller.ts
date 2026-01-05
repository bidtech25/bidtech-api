import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport'; // Uncomment this to protect the route later

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee (Admin only)' })
  @ApiResponse({ status: 201, description: 'Profile created successfully.' })
  // @UseGuards(AuthGuard('jwt')) // Uncomment this to protect the route later
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createEmployee(dto);
  }
}
