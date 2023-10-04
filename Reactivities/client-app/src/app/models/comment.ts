// Named this ChatComment because SemanticUI has a component called Comment.
export interface ChatComment{
    id: number;
    //* This was a date but changed it to the string because it caused error in ActivityDetailedChat.tsx
    createdAt: string;
    body: string;
    username: string;
    displayName: string;
    image: string;
}