import { DocumentMetadataRepository } from '../../../domain/document/document.metadata.repository';
class DocumentDynamooseRepository implements DocumentMetadataRepository {

}

export const documentDynamooseRepository = new DocumentDynamooseRepository();