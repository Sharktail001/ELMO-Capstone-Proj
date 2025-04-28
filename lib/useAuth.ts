import { useEffect, useState } from "react";
import { getCurrentUser, signOut, fetchUserAttributes } from "@aws-amplify/auth";
import type { AuthUser } from "@aws-amplify/auth";
import AWS from "aws-sdk";
import { Amplify } from "aws-amplify";

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


interface ExtendedUser extends AuthUser {
  name?: string;
  email?: string;
  avatar?: string; // Add more attributes if needed
  preferences?: []; // Assuming you have a preferences attribute
}

export const useAuth = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const authUser = await getCurrentUser();
        const attributes = await fetchUserAttributes(); // Get user attributes
        // console.log("User attributes:", attributes); // Log the attributes for debugging

        const userPrefereces = await dynamoDB.get({
          TableName: "Elmo-Users-Table",
          Key: { userId: authUser.username },
        }).promise();

        setUser({
          ...authUser,
          name: attributes.name || "Unknown",
          email: attributes.email || "No email",
          avatar: attributes.picture || "", // Cognito can store a profile picture URL under "picture"
          preferences: userPrefereces.Item?.preferences || [], // Assuming preferences are stored in DynamoDB
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const logout = async () => {
    try {
      await signOut();
      
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  return { user, loading, logout };
};
