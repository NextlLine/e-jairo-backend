export class DocumentMetadata {
    constructor(
        public id: string,
        public name: string,
        public content: string,
        public contentType: string,
        public fileSize: number,
        public createdAt: string,
        public category?: string,
    ) {}
}