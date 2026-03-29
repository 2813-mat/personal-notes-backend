import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Note, NoteDocument } from '../schemas/note.schema';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<{ id: string }> {
    const note = new this.noteModel(createNoteDto);

    const savedNote = await note.save();

    await this.mailService.sendNoteCreatedEmail(
      this.configService.getOrThrow<string>('NOTIFICATION_EMAIL'),
      savedNote.title,
    );

    return { id: savedNote._id as string };
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
    return note;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Note not found');
  }
}
