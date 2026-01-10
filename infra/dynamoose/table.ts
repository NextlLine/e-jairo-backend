import dynamoose from "./client";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

if (!TABLE_NAME) {
  throw new Error("DYNAMODB_TABLE_NAME não definida");
}

const AppTableSchema = new dynamoose.Schema(
  {
    PK: {
      type: String,
      hashKey: true,
    },
    SK: {
      type: String,
      rangeKey: true,
    },

    // TEAM
    GSI1PK: {
      type: String,
      index: {
        name: "GSI1",
        rangeKey: "GSI1SK",
      },
    },
    GSI1SK: {
      type: String,
    },

    // UNITY
    GSI2PK: {
      type: String,
      index: {
        name: "GSI2",
        rangeKey: "GSI2SK",
      },
    },
    GSI2SK: {
      type: String,
    },

    entity: {
      type: String,
      required: true,
    },
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

export const AppTable = dynamoose.model(TABLE_NAME, AppTableSchema, {
  create: false,
  update: false,
  waitForActive: false,
});
