// src/graphql/queries.js
import { gql } from '@apollo/client'

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages(limit: 1, order_by: { created_at: desc }) {
        content
        role
      }
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
    }
  }
`

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $user_id: uuid!) {
    insert_chats_one(object: { title: $title, user_id: $user_id }) {
      id
      title
      created_at
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation SendMessage($message: String!, $chat_id: uuid!) {
    insert_messages_one(object: { content: $message, role: "user", chat_id: $chat_id }) {
      id
    }
    sendMessage(message: $message, chat_id: $chat_id) {
      message
    }
  }
`

export const MESSAGES_SUBSCRIPTION = gql`
  subscription MessagesSubscription($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
    }
  }
`

export const DELETE_CHAT = gql`
  mutation DeleteChat($chat_id: uuid!) {
    delete_messages(where: { chat_id: { _eq: $chat_id } }) {
      affected_rows
    }
    delete_chats_by_pk(id: $chat_id) {
      id
    }
  }
`