import dynamoose from "dynamoose";

const ddb = new dynamoose.aws.ddb.DynamoDB({
  region: process.env.AWS_REGION || "us-east-1",
});

dynamoose.aws.ddb.set(ddb);

export default dynamoose;

