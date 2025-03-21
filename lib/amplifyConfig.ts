import { Amplify } from 'aws-amplify';
import { signIn, signOut, signUp, confirmSignUp } from 'aws-amplify/auth';
import dotenv from 'dotenv';

dotenv.config();

// const poolId = process.env.AWS_POOL_ID;
// const userPoolClientId = String(process.env.AWS_POOL_CLIENT_ID);

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_Wh2rJhtYN",
      userPoolClientId: "5p32rcqgnak4fq3cl1gv63jp3q",
    }
  }
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
    // console.log("test", poolId);
    const user = await signIn({ username, password });
    console.log("Logged in successfully");
    return user;
  } catch (error) {
    console.error("Error during login:", error);
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

export const signUpUser = async (name: string, password: string, attributes: { email: string }) => {
  try {
    const signUpResult = await signUp({
      username: attributes.email,
      password,
      options: {
        userAttributes: {
          name
        },
      }
    });
    console.log("Signed up successfully", signUpResult);
    return signUpResult;
  } catch (error) {
    console.error("Error during signup:", error);
  }
};

export const confirmUserSignUp = async (username: string, confirmationCode: string) => {
  try {
    const confirmSignUpResult = await confirmSignUp({ username, confirmationCode });
    console.log("Confirmed signup successfully", confirmSignUpResult);
    return confirmSignUpResult;
  } catch (error) {
    console.error("Error during confirm signup:", error);
  }
}