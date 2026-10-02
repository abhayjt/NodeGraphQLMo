import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
    ) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email
      password: $password
    ) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      createdAt
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $email: String
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
    ) {
      id
      name
      email
    }
  }
`;