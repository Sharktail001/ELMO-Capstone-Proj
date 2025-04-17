import { Amplify } from "aws-amplify";
import { signIn, signOut, signUp, confirmSignUp } from "aws-amplify/auth";
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

// const poolId = process.env.AWS_POOL_ID;
// const userPoolClientId = String(process.env.AWS_POOL_CLIENT_ID);

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_Wh2rJhtYN",
      userPoolClientId: "5p32rcqgnak4fq3cl1gv63jp3q",
    },
  },
});

const dynamoDB =  new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  accessKeyId: "AKIA5PERF5HC7RSKHE4P",
  secretAccessKey: "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",
});

// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: poolId!,
//       userPoolClientId: userPoolClientId,
//     }
//   }
// });

export const signInUser = async (username: string, password: string) => {
  try {
    const user = await signIn({ username, password });
    console.log("Logged in successfully");
    return user;
  } catch (error: any) {
    console.error("Error during login:", error);
    throw new Error(error?.message || "An unexpected error occurred.");
  }
};

export const signOutUser = async () => {
  try {
    await signOut();
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const signUpUser = async (
  name: string,
  password: string,
  attributes: { email: string }
) => {
  try {
    const signUpResult = await signUp({
      username: attributes.email,
      password,
      options: {
        userAttributes: {
          name,
        },
      },
    });
    console.log("Signed up successfully", signUpResult);
    return signUpResult;
  } catch (error: any) {
    console.error("Error during signup:", error);
    throw new Error(
      error?.message || "An unexpected error occurred during signup."
    );
  }
};

export const confirmUserSignUp = async (username: string, confirmationCode: string, password: string) => {
  try {
    const confirmSignUpResult = await confirmSignUp({
      username,
      confirmationCode,
    });
    console.log("Confirmed signup successfully", confirmSignUpResult);
    await signInUser(username, password);
    return confirmSignUpResult;
  } catch (error) {
    console.error("Error during confirm signup:", error);
  }
};

export const getTableItems = async (tableName: string)  => {
  const params = {
    TableName: tableName
  };

  try{
    const data = await dynamoDB.scan(params).promise();
    console.log("Items recieved successfully:", data.Items);
    return data.Items;
  } catch (error){
    console.error("Error fetching table items:", error);
  }
}