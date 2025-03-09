import { Amplify } from 'aws-amplify';
import { signIn, signOut } from 'aws-amplify/auth';

// Correct Amplify v6+ configuration
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_Wh2rJhtYN',
      userPoolClientId: '5p32rcqgnak4fq3cl1gv63jp3q',
    }
  }
});

export const signInUser = async (username: string, password: string) => {
  try {
    const user = await signIn({ username, password });
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
