import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../schemas/note.schema';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { NotesEventsService } from './notes-events.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private mailService: MailService,
    private usersService: UsersService,
    private notesEvents: NotesEventsService,
  ) {}

  private async getAllUserEmails(): Promise<string[]> {
    return this.usersService.findAllEmails();
  }

  async create(createNoteDto: CreateNoteDto): Promise<{ id: string }> {
    const note = new this.noteModel(createNoteDto);
    const savedNote = await note.save();

    const id = savedNote._id as string;
    this.notesEvents.emitCreated(id, savedNote);

    const emails = await this.getAllUserEmails();
    if (emails.length > 0) {
      await this.mailService.sendNoteCreatedEmail(emails, savedNote.title);
    }

    return { id };
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { new: true })
      .exec();
    if (!note) throw new NotFoundException('Note not found');

    this.notesEvents.emitUpdated(id, note);

    const emails = await this.getAllUserEmails();
    if (emails.length > 0) {
      await this.mailService.sendNoteUpdatedEmail(emails, note.title);
    }

    return note;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Note not found');

    this.notesEvents.emitDeleted(id);

    const emails = await this.getAllUserEmails();
    if (emails.length > 0) {
      await this.mailService.sendNoteDeletedEmail(emails, result.title);
    }
  }
}
