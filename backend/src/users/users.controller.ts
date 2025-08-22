import { Controller, Get, Param, UseGuards, Request, Put, Body } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse 
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Current user profile retrieved successfully',
    schema: {
      example: {
        id: "uuid-string",
        email: "user@example.com",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        preferences: [
          {
            id: "uuid",
            userId: "uuid-string",
            categoryId: "uuid",
            category: {
              id: "uuid",
              name: "Technology",
              slug: "technology"
            }
          }
        ]
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  async getCurrentUser(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    schema: {
      example: {
        id: "uuid-string",
        email: "user@example.com",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    }
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'User first name' },
        lastName: { type: 'string', description: 'User last name' }
      },
      example: {
        firstName: "John",
        lastName: "Smith"
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile updated successfully',
    schema: {
      example: {
        id: "uuid-string",
        email: "user@example.com",
        username: "johndoe",
        firstName: "John",
        lastName: "Smith",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  async updateCurrentUser(
    @Request() req: any,
    @Body() updateData: { firstName?: string; lastName?: string }
  ) {
    return this.usersService.updateUser(req.user.id, updateData);
  }

  @Get('me/preferences')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user preferences' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'User preferences retrieved successfully',
    schema: {
      example: {
        preferences: [
          {
            id: "uuid",
            userId: "uuid-string",
            categoryId: "uuid",
            category: {
              id: "uuid",
              name: "Technology",
              slug: "technology",
              description: "Latest tech news"
            }
          },
          {
            id: "uuid",
            userId: "uuid-string", 
            categoryId: "uuid",
            category: {
              id: "uuid",
              name: "Sports",
              slug: "sports",
              description: "Sports news and updates"
            }
          }
        ]
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  async getUserPreferences(@Request() req: any) {
    const user = await this.usersService.findOne(req.user.id);
    return { preferences: user?.preferences || [] };
  }
}
