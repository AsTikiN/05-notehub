import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MouseEvent } from "react";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDeleted: () => void;
}

export default function NoteList({ notes, onDeleted }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      onDeleted();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    mutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              type="button"
              onClick={(event) => handleDelete(event, note.id)}
              disabled={mutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
