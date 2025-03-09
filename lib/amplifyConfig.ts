import { Amplify } from 'aws-amplify';
import { signIn, signOut, signUp, confirmSignUp } from 'aws-amplify/auth';

const poolId = process.env.AWS_POOL_ID;
const userPoolClientId = process.env.AWS_POOL_CLIENT_ID;

// Correct Amplify v6+ configuration
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: String(poolId),
      userPoolClientId: String(userPoolClientId),
    }
  }
});

export const signInUser = async (username: string, password: string) => {
  try {
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