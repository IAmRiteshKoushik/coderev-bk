/* The following are the request-body validators for associating, listing-
 * associated repos and describing the association of aws-s3 with aws-codeguru
 */


// Associate Repository
interface associateRepoReq {
    ClientRequestToken: string;
    KMSKeyDetails:  {
        EncryptionOption: string;
        KMSKeyId: string;
    };
    Repository: {
        S3Bucket: {
            BucketName: string;
            Name: string;
        };
    };
};


// Describe repository association repository
interface descRepoAssociationReq {
    RepositoryAssociation: {
        AssociationArn: string;
        AssociationId: string;
        ConnectionArn: string;
        CreatedTimeStamp: number;
        KMSKeyDetails: {
            EncryptionOPtion: string;
            KMSKeyId: string;
        };
        LastUpdatedTimeStamp: number;
        Name: string; // s3-repo name
        Owner: string; // IAM user
        ProviderType: string;
        S3RepositoryDetails : {
            BucketName: string;
            CodeArtifacts: {
                BuildArtifactsObjectKey: string;
                SourceCodeArtifactsObjectKey: string;
            };
        };
        State: string;
        StateReason: string;
    };
};


// ListRepositoryAssociation reqeust does not have a body
// DisassociateRepository request does not have a body



