import { Request, Response } from 'express';
const { BlobServiceClient } = require('@azure/storage-blob');
import formidable from 'formidable';

export const postImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: true });

    form.parse(req, async function (err, fields, files: any) {
        if (!err) {
            const file: any = files.image[0];
            const filePath = file.filepath;
            const fileName = file.originalFilename;
            console.log('FILE -->', file)
            uploadToBlobStorage('events', filePath, fileName)
                .then((url: string) => {
                    return res.status(200).json({ data: url });
                })
                .catch((err: any) => {
                    console.log('ERROR -->', err);
                    return res.status(500).json({ error: err });
                });
        }
    });
};

let AZURE_STORAGE_CONNECTION_STRING =
    'DefaultEndpointsProtocol=https;AccountName=sociatlasstorage;AccountKey=PgICERpfWhJmaxS233hg5bLV3Oo6NWkHCGKxb83CWz6Hgm8n++psSEqsz7ppXSMsgI5nqIVZtp9m+AStT0+/RQ==;EndpointSuffix=core.windows.net';

// Initialize blob service client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

async function uploadToBlobStorage(containerName: string, filePath: string, fileName: string) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
        console.log(`Upload block blob ${fileName} successfully`, uploadBlobResponse.requestId);
        return blockBlobClient.url;
    } catch (error) {
        console.log('ERROR -->', error);
        throw error;
    }
}
