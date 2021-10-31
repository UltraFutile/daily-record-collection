export interface PromptOptions { 
    type: "input" | "list",
    choices?: string[],
    validate?: (answer) => boolean | string
}