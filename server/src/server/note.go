package server

type Note struct {
	ID uint64
	UserId uint64
	Data []byte
}

func NewNote() *Note {
	note := Note{}
	return &note
}