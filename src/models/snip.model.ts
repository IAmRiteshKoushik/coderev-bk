import { Review } from "./review.model";

export interface Snippet {
    fileName:       string,
    projectName:    string,
    email:          string,
    startLine:      number,
    endLine:        number,
    linesOfCode:    string[], // Store the lines of code being reviewed
    review:         Review[], // Store reviews for snippet
}

