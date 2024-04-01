export interface Review {
    startLine:              number,
    endLine:                number,
    recommendationCategory: string,
    severity:               string,
    description:            string[],
    codeSnippet:            string[]
}

