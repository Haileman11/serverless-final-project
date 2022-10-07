import { TodosAccess } from '../dataLayer/todosAccess'
import * as AttachmentUtils from '../fileStorage/attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem';
import * as createError from 'http-errors'
// import { getUserId } from '../lambda/utils'
const todosAccess = new TodosAccess()


// TODO: Implement businessLogic
export const getTodosForUser = async (userId: string) => {
    let items:TodoItem[]= await todosAccess.getTodosForUser(userId)
    items.map((item) => {
        if(item.attachmentUrl) {
            item.attachmentUrl = AttachmentUtils.getAttachmentUrl(item.todoId);
        }
    });
    return items
}
export const createTodo = async (createTodoRequest: CreateTodoRequest,userId:string) => {
    const todoId = uuid.v4()    
    const createdAt = new Date().toISOString()
    const done = false
    if (!createTodoRequest.name ||  createTodoRequest.name==='') {
        const error=createError(422, 'Invalid name.') as createError.HttpError
        throw error
    }
    // const attachmentUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazon.com/${todoId}`

    const newTodo={todoId,userId,createdAt,done,...createTodoRequest}
    return todosAccess.createTodo(newTodo);    
}
export const updateTodo = async (todoId:string,userId:string,item:UpdateTodoRequest)=>{
   return todosAccess.updateTodo(todoId,userId,item)
}
export const updateTodoAttachment = async (todoId: string, userId: string) => {
    const url= AttachmentUtils.getAttachmentUrl(todoId)
   return todosAccess.updateTodoAttachment(todoId,userId, url)
}
export const deleteTodo = async (todoId:string,userId:string)=>{
    return todosAccess.deleteTodo(todoId,userId)
}
