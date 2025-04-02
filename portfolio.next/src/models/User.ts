/**
 * Base user interface with common properties
 */
export interface BaseUser {
  username: string;
  isAdmin: boolean;
}

/**
 * Full user model returned from the API
 */
export interface User extends BaseUser {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new user
 */
export interface UserCreate extends BaseUser {
  password: string;
}

/**
 * Data for updating an existing user
 */
export interface UserUpdate extends Partial<BaseUser> {
  password?: string;
}

/**
 * Form data for creating a new user
 */
export interface UserCreateFormData {
  username: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
}

/**
 * Convert form data to UserCreate model
 * This ensures type safety when transforming form data to API model
 * @param formData - The form data to convert
 * @returns UserCreate - The data ready for API submission
 */
export function toUserCreate(formData: UserCreateFormData): UserCreate {
  return {
    username: formData.username,
    password: formData.password,
    isAdmin: formData.isAdmin
  };
}
