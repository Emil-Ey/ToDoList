import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type FieldError1 = {
  __typename?: 'FieldError1';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type List = {
  __typename?: 'List';
  id: Scalars['Float'];
  title: Scalars['String'];
  desc: Scalars['String'];
  tasksNo: Scalars['Float'];
  creatorId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  creator: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
  createTask: TaskResponse;
  deleteTask: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  createList: List;
  updateList?: Maybe<List>;
  deleteList: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword1: Scalars['String'];
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  listId: Scalars['Int'];
  text: Scalars['String'];
};


export type MutationDeleteTaskArgs = {
  listId: Scalars['Int'];
  id: Scalars['Int'];
};


export type MutationVoteArgs = {
  listId: Scalars['Int'];
  id: Scalars['Int'];
};


export type MutationCreateListArgs = {
  desc: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdateListArgs = {
  desc: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeleteListArgs = {
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  tasks: Array<Task>;
  list?: Maybe<List>;
  tasksNotDone: Scalars['Int'];
  lists: Array<List>;
};


export type QueryTasksArgs = {
  listId: Scalars['Int'];
};


export type QueryListArgs = {
  id: Scalars['Int'];
};


export type QueryTasksNotDoneArgs = {
  listId: Scalars['Int'];
};


export type QueryListsArgs = {
  userId: Scalars['Int'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['Float'];
  listId: Scalars['Float'];
  text: Scalars['String'];
  done: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  list: List;
};

export type TaskResponse = {
  __typename?: 'TaskResponse';
  errors?: Maybe<Array<FieldError1>>;
  task?: Maybe<Task>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type RegularListFragment = (
  { __typename?: 'List' }
  & Pick<List, 'id' | 'title' | 'desc' | 'tasksNo'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email'>
  ) }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & UserErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type TaskErrorFragment = (
  { __typename?: 'FieldError1' }
  & Pick<FieldError1, 'field' | 'message'>
);

export type UserErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type CreateListMutationVariables = Exact<{
  title: Scalars['String'];
  desc: Scalars['String'];
}>;


export type CreateListMutation = (
  { __typename?: 'Mutation' }
  & { createList: (
    { __typename?: 'List' }
    & RegularListFragment
  ) }
);

export type CreateTaskMutationVariables = Exact<{
  listId: Scalars['Int'];
  text: Scalars['String'];
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'TaskResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError1' }
      & TaskErrorFragment
    )>>, task?: Maybe<(
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'text' | 'done'>
      & { list: (
        { __typename?: 'List' }
        & RegularListFragment
      ) }
    )> }
  ) }
);

export type DeleteListMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteListMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteList'>
);

export type DeleteTaskMutationVariables = Exact<{
  listId: Scalars['Int'];
  id: Scalars['Int'];
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTask'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type UpdateListMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  desc: Scalars['String'];
}>;


export type UpdateListMutation = (
  { __typename?: 'Mutation' }
  & { updateList?: Maybe<(
    { __typename?: 'List' }
    & RegularListFragment
  )> }
);

export type VoteMutationVariables = Exact<{
  id: Scalars['Int'];
  listId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type ListQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ListQuery = (
  { __typename?: 'Query' }
  & { list?: Maybe<(
    { __typename?: 'List' }
    & RegularListFragment
  )> }
);

export type ListsQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type ListsQuery = (
  { __typename?: 'Query' }
  & { lists: Array<(
    { __typename?: 'List' }
    & RegularListFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type TasksQueryVariables = Exact<{
  listId: Scalars['Int'];
}>;


export type TasksQuery = (
  { __typename?: 'Query' }
  & { tasks: Array<(
    { __typename?: 'Task' }
    & Pick<Task, 'id' | 'listId' | 'text' | 'done'>
    & { list: (
      { __typename?: 'List' }
      & RegularListFragment
    ) }
  )> }
);

export type TasksNotDoneQueryVariables = Exact<{
  listId: Scalars['Int'];
}>;


export type TasksNotDoneQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'tasksNotDone'>
);

export const RegularListFragmentDoc = gql`
    fragment RegularList on List {
  id
  title
  desc
  tasksNo
  creator {
    id
    username
    email
  }
}
    `;
export const UserErrorFragmentDoc = gql`
    fragment UserError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...UserError
  }
  user {
    ...RegularUser
  }
}
    ${UserErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const TaskErrorFragmentDoc = gql`
    fragment TaskError on FieldError1 {
  field
  message
}
    `;
export const CreateListDocument = gql`
    mutation CreateList($title: String!, $desc: String!) {
  createList(title: $title, desc: $desc) {
    ...RegularList
  }
}
    ${RegularListFragmentDoc}`;

export function useCreateListMutation() {
  return Urql.useMutation<CreateListMutation, CreateListMutationVariables>(CreateListDocument);
};
export const CreateTaskDocument = gql`
    mutation CreateTask($listId: Int!, $text: String!) {
  createTask(listId: $listId, text: $text) {
    errors {
      ...TaskError
    }
    task {
      id
      text
      done
      list {
        ...RegularList
      }
    }
  }
}
    ${TaskErrorFragmentDoc}
${RegularListFragmentDoc}`;

export function useCreateTaskMutation() {
  return Urql.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument);
};
export const DeleteListDocument = gql`
    mutation DeleteList($id: Int!) {
  deleteList(id: $id)
}
    `;

export function useDeleteListMutation() {
  return Urql.useMutation<DeleteListMutation, DeleteListMutationVariables>(DeleteListDocument);
};
export const DeleteTaskDocument = gql`
    mutation DeleteTask($listId: Int!, $id: Int!) {
  deleteTask(listId: $listId, id: $id)
}
    `;

export function useDeleteTaskMutation() {
  return Urql.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateListDocument = gql`
    mutation UpdateList($id: Int!, $title: String!, $desc: String!) {
  updateList(id: $id, title: $title, desc: $desc) {
    ...RegularList
  }
}
    ${RegularListFragmentDoc}`;

export function useUpdateListMutation() {
  return Urql.useMutation<UpdateListMutation, UpdateListMutationVariables>(UpdateListDocument);
};
export const VoteDocument = gql`
    mutation Vote($id: Int!, $listId: Int!) {
  vote(id: $id, listId: $listId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const ListDocument = gql`
    query List($id: Int!) {
  list(id: $id) {
    ...RegularList
  }
}
    ${RegularListFragmentDoc}`;

export function useListQuery(options: Omit<Urql.UseQueryArgs<ListQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ListQuery>({ query: ListDocument, ...options });
};
export const ListsDocument = gql`
    query Lists($userId: Int!) {
  lists(userId: $userId) {
    ...RegularList
  }
}
    ${RegularListFragmentDoc}`;

export function useListsQuery(options: Omit<Urql.UseQueryArgs<ListsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ListsQuery>({ query: ListsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const TasksDocument = gql`
    query Tasks($listId: Int!) {
  tasks(listId: $listId) {
    id
    listId
    text
    done
    list {
      ...RegularList
    }
  }
}
    ${RegularListFragmentDoc}`;

export function useTasksQuery(options: Omit<Urql.UseQueryArgs<TasksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TasksQuery>({ query: TasksDocument, ...options });
};
export const TasksNotDoneDocument = gql`
    query TasksNotDone($listId: Int!) {
  tasksNotDone(listId: $listId)
}
    `;

export function useTasksNotDoneQuery(options: Omit<Urql.UseQueryArgs<TasksNotDoneQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TasksNotDoneQuery>({ query: TasksNotDoneDocument, ...options });
};