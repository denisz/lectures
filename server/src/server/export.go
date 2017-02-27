package server

import (
	"github.com/tealeg/xlsx"
	"os"
	"math/rand"
	"strconv"
	"path/filepath"
	"encoding/hex"
)

// TempFileName generates a temporary filename for use in testing or whatever
func TempFileName(prefix, suffix string) string {
	randBytes := make([]byte, 16)
	rand.Read(randBytes)
	return filepath.Join(os.TempDir(), prefix+hex.EncodeToString(randBytes)+suffix)
}

func ExportByXLSX (results []Result) (string, error) {
	var err error
	var output = TempFileName ("xlsx", ".xlsx")
	var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var hcell *xlsx.Cell

	file = xlsx.NewFile()
	sheet, err = file.AddSheet("Sheet1")
	if err != nil {
		return output, err
	}

	//headers
	header := sheet.AddRow()
	cells  := []string{"UserID", "Date", "LectureID"}

	for _, cell := range cells {
		hcell  = header.AddCell()
		hcell.Value = cell
	}


	if len(results) > 0 {
		first := results[0]
		for _, ans := range first.Data.Answers {
			hcell  = header.AddCell()
			hcell.Value = ans.ID
		}
	}


	for _, item := range results {
		row = sheet.AddRow()

		cell = row.AddCell()
		cell.Value = strconv.FormatUint(item.UserId, 10)

		cell = row.AddCell()
		cell.Value = item.Created.Format("Mon Jan 2 15:04:05 MST")

		cell = row.AddCell()
		cell.Value = item.Data.LectureID

		for _, ans := range item.Data.Answers {
			cell = row.AddCell()
			cell.Value = ans.Value
		}
	}

	return output, file.Save(output)
}
