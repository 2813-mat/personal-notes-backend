import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { NotesService } from '../services/notes.service';
import { NotesEventsService } from '../services/notes-events.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly notesEvents: NotesEventsService,
  ) {}

  @Sse('events')
  @ApiOperation({ summary: 'Stream de eventos em tempo real (SSE)' })
  @ApiResponse({ status: 200, description: 'Conexão SSE estabelecida' })
  events(): Observable<MessageEvent> {
    return this.notesEvents.asObservable();
  }

  @Post()
  @ApiOperation({ summary: 'Criar nota' })
  @ApiResponse({ status: 201, description: 'Nota criada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as notas' })
  @ApiResponse({ status: 200, description: 'Lista de notas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar nota por ID' })
  @ApiResponse({ status: 200, description: 'Nota encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Nota não encontrada' })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar nota' })
  @ApiResponse({ status: 200, description: 'Nota atualizada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Nota não encontrada' })
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar nota' })
  @ApiResponse({ status: 200, description: 'Nota deletada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Nota não encontrada' })
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
