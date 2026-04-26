import { Injectable } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { Note } from '../schemas/note.schema';

@Injectable()
export class NotesEventsService {
  private subject = new Subject<MessageEvent>();

  emitCreated(id: string, note: Note): void {
    this.subject.next({
      type: 'note:created',
      data: { id, title: note.title, sections: note.sections, createdAt: note.createdAt },
    });
  }

  emitUpdated(id: string, note: Note): void {
    this.subject.next({
      type: 'note:updated',
      data: { id, title: note.title, sections: note.sections, createdAt: note.createdAt },
    });
  }

  emitDeleted(id: string): void {
    this.subject.next({ type: 'note:deleted', data: { id } });
  }

  asObservable(): Observable<MessageEvent> {
    return this.subject.asObservable();
  }
}
