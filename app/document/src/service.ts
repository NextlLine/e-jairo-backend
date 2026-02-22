import { DocumentRepository } from '../../../domain/document/document.repository';
import { DocumentMetadataRepository } from '../../../domain/document/document.metadata.repository';

export class DocumentService {
    constructor(
        private readonly documentRepository: DocumentRepository,
        private readonly documentMetadataRepository: DocumentMetadataRepository
    ) { }

    deleteDocument(documentId: string) {
        throw new Error("Method not implemented.");
    }
    uploadDocument(body: any) {
        throw new Error("Method not implemented.");
    }
}