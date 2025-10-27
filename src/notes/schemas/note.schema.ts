import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class NoteSection {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  content: string;
}

const NoteSectionSchema = SchemaFactory.createForClass(NoteSection);

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [NoteSectionSchema], default: [] })
  sections: NoteSection[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
