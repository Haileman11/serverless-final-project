import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient = new XAWS.DynamoDB.DocumentClient,
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX) {
    }
    async createTodo (item: object):Promise<TodoItem>  {                
        await this.docClient.put({
            TableName: this.todosTable,
            Item: item
        }).promise()
        return item as TodoItem
    }
    async getTodosForUser(userId): Promise <TodoItem[]> {
        const result =await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }
    async updateTodo(todoId:string,userId:string,item:UpdateTodoRequest): Promise<TodoUpdate>{
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: 'set #TodoName = :todoName, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#TodoName": "name"
            },
            ExpressionAttributeValues: {
              ':todoName': item.name,
              ':dueDate': item.dueDate,
              ':done': item.done          
          }
        }).promise()
        return 
    }
    async updateTodoAttachment(todoId:string,userId:string,attachmentUrl:string): Promise<TodoUpdate>{
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
              ':attachmentUrl': attachmentUrl
          }
        }).promise()
        return 
    }
    async deleteTodo(todoId: string,userId:string) {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },        
        }).promise()
        return
    }
}  
