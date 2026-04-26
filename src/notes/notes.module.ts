import { Module } from '@nestjs/common';
import { NotesController } from './controllers/notes.controller';
import { NotesService } from './services/notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { MailService } from 'src/mail/mail.service';
import { UsersModule } from 'src/users/users.module';
import { NotesEventsService } from './services/notes-events.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    UsersModule,
  ],
  controllers: [NotesController],
  providers: [NotesService, MailService, NotesEventsService],
})
export class NotesModule {}
