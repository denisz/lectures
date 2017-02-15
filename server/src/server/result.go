package server

import (
	"time"
	"encoding/json"
	"io"
)

type ResultDataAnswer struct {
	ID string
	Index int64
	Value string
}

type ResultData struct {
	Answers []ResultDataAnswer
	LectureID string
}

type Result struct {
	ID uint64
	UserId uint64
	Data *ResultData
	Created time.Time
}

func NewResultData() *ResultData{
	data := ResultData{}
	data.Answers = []ResultDataAnswer{}

	return &data
}

func NewResult() *Result {
	result := Result{}
	result.Created 	= time.Now()
	result.Data 	= NewResultData()

	return &result
}

func NewResultFromJSON(reader io.ReadCloser) (*Result, error) {
	result 	:= NewResult()
	err	:= json.NewDecoder(reader).Decode(result.Data)

	return result, err
}
