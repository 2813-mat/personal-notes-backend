import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import 'reflect-metadata';

export class NoteSectionDto {
  @IsString()
  label: string;

  @IsString()
  content: string;
}

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteSectionDto)
  sections: NoteSectionDto[];
}
