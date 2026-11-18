export {};

// Shape of the custom Clerk session claim configured as { "metadata": "{{user.public_metadata}}" }.
declare global {
  interface CustomJwtSessionClaims {
    metadata?: { role?: "admin" };
  }
}
