import { User } from './../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController'); //BoardsController에서 보내는 log
  constructor(private boardsService: BoardsService) {}
  //   @Get('')
  //   getAllBoard(): Board[] {
  //     return this.boardsService.getAllBoards();
  //   }

  @Get('/userboard')
  getUserBoard(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return this.boardsService.getUserBoards(user);
  }

  @Get('')
  getAllBoard(): Promise<Board[]> {
    return this.boardsService.getAllBoard();
  }
  //   @Post()
  //   @UsePipes(ValidationPipe) //DTO에 적용
  //   createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //     console.log('title', createBoardDto.title);
  //     console.log('description', createBoardDto.description);
  //     return this.boardsService.createBoard(createBoardDto);
  //   }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `User ${user.username} creating a new board. Payload: ${JSON.stringify(
        createBoardDto,
      )}`,
    );
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  //   @Get('/:id')
  //   getBoardById(@Param('id') id: string): Board {
  //     return this.boardsService.getBoardById(id);
  //   }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }
  //   @Delete('/:id')
  //   deleteBoard(@Param('id') id: string): void {
  //     this.boardsService.deleteBoard(id);
  //   }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status);
  }

  //   @Patch('/:id/status')
  //   updateBoardStatus(
  //     @Param('id') id: string,
  //     @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  //   ) {
  //     return this.boardsService.updateBoardStatus(id, status);
  //   }
}
